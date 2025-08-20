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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserFromToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 🔐 Middleware completo para proteger rutas con roles
const authMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            const email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
            const cognitoId = decoded === null || decoded === void 0 ? void 0 : decoded.sub;
            if (!email || !cognitoId) {
                res.status(400).json({ message: "Token inválido o incompleto" });
                return;
            }
            const user = yield prisma.usuario.findUnique({
                where: { cognitoId },
                select: { tipo: true },
            });
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
                return;
            }
            const role = user.tipo.toLowerCase();
            req.user = { cognitoId, email, role };
            const hasAccess = allowedRoles.includes(role);
            if (!hasAccess) {
                res.status(403).json({ message: "Acceso denegado" });
                return;
            }
            next();
        }
        catch (err) {
            console.error("Error al procesar el token:", err);
            res.status(400).json({ message: "Token inválido" });
        }
    });
};
exports.authMiddleware = authMiddleware;
// 🔓 Middleware solo para extracción de datos del token (sin validación en BD)
const extractUserFromToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No autorizado: falta token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.sub) || !(decoded === null || decoded === void 0 ? void 0 : decoded.email)) {
            res.status(400).json({ message: "Token inválido o incompleto" });
            return;
        }
        req.user = {
            cognitoId: decoded.sub,
            email: decoded.email,
            role: "pendiente",
        };
        next();
    }
    catch (err) {
        res.status(400).json({ message: "Error al decodificar token" });
        return;
    }
};
exports.extractUserFromToken = extractUserFromToken;
