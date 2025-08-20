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
exports.getManagerProperties = exports.updateManager = exports.createManager = exports.getManager = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const prisma = new client_1.PrismaClient();
// Obtener un propietario por cognitoId
const getManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
        });
        if (!usuario || usuario.tipo !== "Propietario") {
            res.status(404).json({ message: "No se ha encontrado al propietario" });
            return;
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error al recuperar el propietario: ${error.message}` });
    }
});
exports.getManager = getManager;
// Crear propietario (usuario con tipo = Propietario)
const createManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const { cognitoId, email } = req.user;
        if (!nombre || !email) {
            res.status(400).json({ message: "Faltan datos obligatorios para crear el propietario." });
            return;
        }
        const existingUser = yield prisma.usuario.findUnique({ where: { cognitoId } });
        if (existingUser) {
            res.status(409).json({ message: "El usuario ya existe." });
            return;
        }
        const nuevoUsuario = yield prisma.usuario.create({
            data: {
                cognitoId,
                nombre,
                email,
                tipo: "Propietario",
            },
        });
        res.status(201).json(nuevoUsuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error creando propietario: ${error.message}` });
    }
});
exports.createManager = createManager;
// Actualizar los datos del propietario
const updateManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const { nombre, email, telefono } = req.body;
        const updatedUsuario = yield prisma.usuario.update({
            where: { cognitoId },
            data: { nombre, email, telefono },
        });
        res.json(updatedUsuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error al actualizar propietario: ${error.message}` });
    }
});
exports.updateManager = updateManager;
// Obtener todos los alojamientos de un propietario
const getManagerProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
        });
        if (!usuario || usuario.tipo !== "Propietario") {
            res.status(404).json({ message: "Propietario no encontrado" });
            return;
        }
        const properties = yield prisma.alojamiento.findMany({
            where: { managerUsuarioId: usuario.id },
            include: { ubicacion: true },
        });
        const enrichedProperties = yield Promise.all(properties.map((property) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const coordinates = yield prisma.$queryRaw `SELECT ST_asText(coordinates) as coordinates FROM "Ubicacion" WHERE id = ${property.ubicacion.id}`;
            const geoJSON = (0, wkt_1.wktToGeoJSON)(((_a = coordinates[0]) === null || _a === void 0 ? void 0 : _a.coordinates) || "");
            return Object.assign(Object.assign({}, property), { ubicacion: Object.assign(Object.assign({}, property.ubicacion), { coordinates: {
                        longitude: geoJSON.coordinates[0],
                        latitude: geoJSON.coordinates[1],
                    } }) });
        })));
        // Orden personalizado por estado: Rechazado -> Pendiente -> Publicado
        const estadoOrden = {
            Rechazado: 0,
            Pendiente: 1,
            Publicado: 2,
        };
        enrichedProperties.sort((a, b) => estadoOrden[a.estado] - estadoOrden[b.estado]);
        res.json(enrichedProperties);
    }
    catch (err) {
        res.status(500).json({ message: `Error al recuperar alojamientos: ${err.message}` });
    }
});
exports.getManagerProperties = getManagerProperties;
