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
exports.rechazarAlojamiento = exports.aprobarAlojamiento = exports.getAlojamientosPendientes = exports.getAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener datos del admin por cognitoId
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
        });
        if (!usuario) {
            res.status(404).json({ message: "No se encontró al admin" });
            return;
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error al recuperar el admin: ${error.message}` });
    }
});
exports.getAdmin = getAdmin;
const getAlojamientosPendientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendientes = yield prisma.alojamiento.findMany({
            where: { estado: "Pendiente" },
            include: {
                ubicacion: true,
            },
        });
        res.json(pendientes);
    }
    catch (err) {
        console.error("Error al obtener alojamientos pendientes:", err);
        res.status(500).json({ message: "Error interno al obtener alojamientos pendientes" });
    }
});
exports.getAlojamientosPendientes = getAlojamientosPendientes;
const aprobarAlojamiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { esDestacado } = req.body;
    try {
        yield prisma.alojamiento.update({
            where: { id },
            data: {
                estado: "Aprobado",
                motivoRechazo: null,
                esDestacado: esDestacado === true || esDestacado === "true",
            },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Error al aprobar alojamiento:", err.message);
        res.status(500).json({ message: "Error al aprobar alojamiento" });
    }
});
exports.aprobarAlojamiento = aprobarAlojamiento;
const rechazarAlojamiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { motivo, esDestacado } = req.body;
    if (!motivo || motivo.trim().length < 5) {
        res.status(400).json({ message: "Motivo de rechazo inválido" });
        return;
    }
    try {
        yield prisma.alojamiento.update({
            where: { id },
            data: {
                estado: "Rechazado",
                motivoRechazo: motivo.trim(),
                esDestacado: esDestacado === true || esDestacado === "true",
            },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Error al rechazar alojamiento:", err.message);
        res.status(500).json({ message: "Error al rechazar alojamiento" });
    }
});
exports.rechazarAlojamiento = rechazarAlojamiento;
