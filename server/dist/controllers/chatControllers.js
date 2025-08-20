"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcarComoLeido = exports.getConversacionesUsuario = exports.createOrGetConversacion = exports.getChatMessages = exports.sendMessage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * POST /api/mensajes
 * Crear un mensaje entre dos usuarios para un alojamiento
 */
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contenido, emisorId, conversacionId } = req.body;
        const nuevoMensaje = yield prisma.mensaje.create({
            data: {
                contenido,
                emisorId,
                conversacionId,
            },
        });
        // Obtener la conversación para saber quién es quién
        const conversacion = yield prisma.conversacion.findUnique({
            where: { id: conversacionId },
        });
        if (!conversacion) {
            res.status(404).json({ message: "Conversación no encontrada" });
            return;
        }
        const esPropietario = emisorId === conversacion.propietarioId;
        const esEstudiante = emisorId === conversacion.estudianteId;
        yield prisma.conversacion.update({
            where: { id: conversacionId },
            data: {
                ultimoMensajeId: nuevoMensaje.id,
                propietarioVistoUltimo: esPropietario ? true : false,
                estudianteVistoUltimo: esEstudiante ? true : false,
            },
        });
        res.status(201).json(nuevoMensaje);
    }
    catch (error) {
        res.status(500).json({ message: `Error al enviar el mensaje: ${error.message}` });
    }
});
exports.sendMessage = sendMessage;
/**
 * GET /api/mensajes/:alojamientoId/:usuarioA/:usuarioB
 * Obtener historial de chat entre dos usuarios sobre un alojamiento
 */
const getChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversacionId } = req.params;
        const mensajes = yield prisma.mensaje.findMany({
            where: {
                conversacionId: Number(conversacionId),
            },
            orderBy: { createdAt: "asc" },
        });
        res.json(mensajes);
    }
    catch (error) {
        res.status(500).json({ message: `Error al obtener los mensajes: ${error.message}` });
    }
});
exports.getChatMessages = getChatMessages;
/**
 * POST /api/conversaciones
 * Crea una conversación si no existe ya entre estudiante y propietario sobre un alojamiento
 */
const createOrGetConversacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { alojamientoId, estudianteId, propietarioId } = req.body;
        let conversacion = yield prisma.conversacion.findUnique({
            where: {
                alojamientoId_estudianteId_propietarioId: {
                    alojamientoId,
                    estudianteId,
                    propietarioId,
                },
            },
        });
        if (!conversacion) {
            conversacion = yield prisma.conversacion.create({
                data: {
                    alojamientoId,
                    estudianteId,
                    propietarioId,
                },
            });
        }
        res.status(200).json(conversacion);
    }
    catch (error) {
        res.status(500).json({ message: `Error al crear/conseguir la conversación: ${error.message}` });
    }
});
exports.createOrGetConversacion = createOrGetConversacion;
const getConversacionesUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarioId = Number(req.query.usuarioId);
        const conversaciones = yield prisma.conversacion.findMany({
            where: {
                OR: [
                    { estudianteId: usuarioId },
                    { propietarioId: usuarioId },
                ],
            },
            include: {
                alojamiento: {
                    include: {
                        ubicacion: true,
                    },
                },
                propietario: {
                    select: { nombre: true },
                },
                estudiante: {
                    select: { nombre: true },
                },
                mensajes: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(conversaciones);
    }
    catch (error) {
        res.status(500).json({ message: `Error al obtener conversaciones: ${error.message}` });
    }
});
exports.getConversacionesUsuario = getConversacionesUsuario;
const marcarComoLeido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversacionId = Number(req.params.id);
        const { usuarioId } = req.body;
        const conversacion = yield prisma.conversacion.findUnique({
            where: { id: conversacionId },
        });
        if (!conversacion) {
            res.status(404).json({ message: "Conversación no encontrada" });
            return;
        }
        const data = {};
        if (usuarioId === conversacion.estudianteId) {
            data.estudianteVistoUltimo = true;
        }
        else if (usuarioId === conversacion.propietarioId) {
            data.propietarioVistoUltimo = true;
        }
        else {
            res.status(403).json({ message: "Usuario no autorizado en esta conversación" });
            return;
        }
        yield prisma.conversacion.update({
            where: { id: conversacionId },
            data,
        });
        res.status(200).json({ message: "Mensaje marcado como leído" });
    }
    catch (error) {
        res.status(500).json({ message: `Error al marcar como leído: ${error.message}` });
    }
});
exports.marcarComoLeido = marcarComoLeido;
