"use strict";
// CONTROLADORES DE USUARIO ESTUDIANTE CENTRALIZADO
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
exports.removeFavoriteProperty = exports.addFavoriteProperty = exports.getCurrentResidences = exports.updateStudent = exports.createTenant = exports.getTenant = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const prisma = new client_1.PrismaClient();
// Obtener usuario por cognitoId
const getTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
            include: { alojamientosFavoritos: true },
        });
        if (!usuario || usuario.tipo !== "Estudiante") {
            res.status(404).json({ message: "No se encontró el estudiante" });
            return;
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error al recuperar el estudiante: ${error.message}` });
    }
});
exports.getTenant = getTenant;
// Crear estudiante
const createTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const { cognitoId, email } = req.user;
        if (!nombre || !email) {
            res.status(400).json({ message: "Faltan datos obligatorios para crear el estudiante." });
            return;
        }
        const existingUser = yield prisma.usuario.findUnique({ where: { cognitoId } });
        if (existingUser) {
            res.status(409).json({ message: "El usuario ya existe." });
            return;
        }
        const usuario = yield prisma.usuario.create({
            data: {
                cognitoId,
                email,
                nombre,
                tipo: "Estudiante",
            },
        });
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: `Error al crear el estudiante: ${error.message}` });
    }
});
exports.createTenant = createTenant;
// Actualizar usuario
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const { nombre, email, telefono } = req.body;
        const updated = yield prisma.usuario.update({
            where: { cognitoId },
            data: { nombre, email, telefono },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: `Error actualizando el estudiante: ${error.message}` });
    }
});
exports.updateStudent = updateStudent;
// Obtener alojamientos favoritos con coordenadas
const getCurrentResidences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
        });
        if (!usuario || usuario.tipo !== "Estudiante") {
            res.status(404).json({ message: "Estudiante no encontrado" });
            return;
        }
        const properties = yield prisma.usuario.findUnique({
            where: { id: usuario.id },
            include: {
                alojamientosFavoritos: {
                    include: {
                        ubicacion: true,
                    },
                },
            },
        });
        if (!properties) {
            res.status(404).json({ message: "No se encontraron alojamientos" });
            return;
        }
        const formatted = yield Promise.all(properties.alojamientosFavoritos.map((property) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const coordinates = yield prisma.$queryRaw `SELECT ST_asText(coordinates) as coordinates FROM "Ubicacion" WHERE id = ${property.ubicacion.id}`;
            const geoJSON = (0, wkt_1.wktToGeoJSON)(((_a = coordinates[0]) === null || _a === void 0 ? void 0 : _a.coordinates) || "");
            return Object.assign(Object.assign({}, property), { ubicacion: Object.assign(Object.assign({}, property.ubicacion), { coordinates: {
                        longitude: geoJSON.coordinates[0],
                        latitude: geoJSON.coordinates[1],
                    } }) });
        })));
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ message: `Error al recuperar alojamientos: ${error.message}` });
    }
});
exports.getCurrentResidences = getCurrentResidences;
// Añadir favorito
const addFavoriteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, propertyId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
            include: { alojamientosFavoritos: true },
        });
        if (!usuario || usuario.tipo !== "Estudiante") {
            res.status(404).json({ message: "Estudiante no encontrado" });
            return;
        }
        const alreadyFavorite = usuario.alojamientosFavoritos.some((fav) => fav.id === Number(propertyId));
        if (alreadyFavorite) {
            res.status(409).json({ message: "Ya está en favoritos" });
            return;
        }
        const updated = yield prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                alojamientosFavoritos: {
                    connect: { id: Number(propertyId) },
                },
            },
            include: { alojamientosFavoritos: true },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: `Error al añadir favorito: ${error.message}` });
    }
});
exports.addFavoriteProperty = addFavoriteProperty;
// Eliminar favorito
const removeFavoriteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, propertyId } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cognitoId },
        });
        if (!usuario || usuario.tipo !== "Estudiante") {
            res.status(404).json({ message: "Estudiante no encontrado" });
            return;
        }
        const updated = yield prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                alojamientosFavoritos: {
                    disconnect: { id: Number(propertyId) },
                },
            },
            include: { alojamientosFavoritos: true },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: `Error al eliminar favorito: ${error.message}` });
    }
});
exports.removeFavoriteProperty = removeFavoriteProperty;
