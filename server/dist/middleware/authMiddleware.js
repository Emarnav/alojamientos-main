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
exports.extractUserFromToken = exports.authMiddleware = void 0;
const client_1 = require("@prisma/client");
const jwtVerification_1 = require("../utils/jwtVerification");
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
            // ✅ Verificar token con claves públicas de Cognito
            const tokenPayload = yield (0, jwtVerification_1.verifyToken)(token);
            if (!tokenPayload) {
                res.status(401).json({ message: "Token inválido" });
                return;
            }
            const userInfo = (0, jwtVerification_1.extractUserInfo)(tokenPayload);
            if (!userInfo.email || !userInfo.cognitoId) {
                res.status(400).json({ message: "Token inválido o incompleto" });
                return;
            }
            const user = yield prisma.usuario.findUnique({
                where: { cognitoId: userInfo.cognitoId },
                select: { tipo: true },
            });
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
                return;
            }
            const role = user.tipo.toLowerCase();
            req.user = {
                cognitoId: userInfo.cognitoId,
                email: userInfo.email,
                role
            };
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
const extractUserFromToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No autorizado: falta token" });
        return;
    }
    try {
        // ✅ Verificar token con claves públicas de Cognito
        const tokenPayload = yield (0, jwtVerification_1.verifyToken)(token);
        if (!tokenPayload) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }
        const userInfo = (0, jwtVerification_1.extractUserInfo)(tokenPayload);
        if (!userInfo.cognitoId || !userInfo.email) {
            res.status(400).json({ message: "Token inválido o incompleto" });
            return;
        }
        req.user = {
            cognitoId: userInfo.cognitoId,
            email: userInfo.email,
            role: "pendiente",
        };
        next();
    }
    catch (err) {
        console.error("Error al verificar token:", err);
        res.status(400).json({ message: "Error al verificar token" });
        return;
    }
});
exports.extractUserFromToken = extractUserFromToken;
