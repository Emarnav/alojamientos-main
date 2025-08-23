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
exports.testExtractUserFromToken = exports.testAuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");

const prisma = new client_1.PrismaClient();

// 🔧 Controlar modo de prueba desde variable de entorno
const USE_TEST_MODE = process.env.USE_TEST_AUTH === 'true';
const TEST_SECRET = "test-secret-key-only-for-development";

// 🔐 Middleware que funciona tanto con tokens de prueba como reales
const testAuthMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }
        try {
            let tokenPayload;
            if (USE_TEST_MODE) {
                // 🧪 Modo de prueba - verificar con clave de test
                console.log("🧪 Usando modo de prueba para autenticación");
                tokenPayload = jsonwebtoken_1.default.verify(token, TEST_SECRET);
            }
            else {
                // 🔒 Modo producción - usar verificación real de Cognito
                console.log("🔒 Usando verificación real de Cognito");
                const { verifyToken, extractUserInfo } = require("../utils/jwtVerification");
                const cognitoPayload = yield verifyToken(token);
                if (!cognitoPayload) {
                    res.status(401).json({ message: "Token inválido" });
                    return;
                }
                tokenPayload = cognitoPayload;
            }
            const cognitoId = tokenPayload.sub;
            const email = tokenPayload.email;
            if (!email || !cognitoId) {
                res.status(400).json({ message: "Token inválido o incompleto" });
                return;
            }
            // Buscar usuario en BD
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
            // Verificar permisos
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
exports.testAuthMiddleware = testAuthMiddleware;

// 🔓 Middleware ligero para extracción de datos
const testExtractUserFromToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No autorizado: falta token" });
        return;
    }
    try {
        let tokenPayload;
        if (USE_TEST_MODE) {
            tokenPayload = jsonwebtoken_1.default.verify(token, TEST_SECRET);
        }
        else {
            const { verifyToken } = require("../utils/jwtVerification");
            tokenPayload = yield verifyToken(token);
            if (!tokenPayload) {
                res.status(401).json({ message: "Token inválido" });
                return;
            }
        }
        req.user = {
            cognitoId: tokenPayload.sub,
            email: tokenPayload.email,
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
exports.testExtractUserFromToken = testExtractUserFromToken;