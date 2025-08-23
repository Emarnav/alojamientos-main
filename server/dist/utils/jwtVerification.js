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
exports.extractUserInfo = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_client_1 = __importDefault(require("jwks-client"));
// Cliente JWKS para obtener las claves públicas de Cognito
let client;
const initializeClient = () => {
    if (!client) {
        const region = process.env.AWS_REGION || 'us-east-1';
        const userPoolId = process.env.COGNITO_USER_POOL_ID;
        if (!userPoolId) {
            throw new Error('COGNITO_USER_POOL_ID environment variable is required');
        }
        client = (0, jwks_client_1.default)({
            jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: 600000, // 10 minutos
        });
    }
    return client;
};
// Función para obtener la clave de firma
const getSigningKey = (kid) => {
    return new Promise((resolve, reject) => {
        const jwksClient = initializeClient();
        jwksClient.getSigningKey(kid, (err, key) => {
            if (err) {
                reject(err);
            }
            else {
                const signingKey = key === null || key === void 0 ? void 0 : key.getPublicKey();
                resolve(signingKey);
            }
        });
    });
};
/**
 * Verifica un token JWT de AWS Cognito
 * @param token - El token JWT a verificar
 * @returns Promise con el payload decodificado o null si es inválido
 */
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Decodificar el header para obtener el kid (key ID)
        const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        if (!decoded || !decoded.header || !decoded.header.kid) {
            console.error("Token no válido: falta kid en el header");
            return null;
        }
        // Obtener la clave pública correspondiente
        const signingKey = yield getSigningKey(decoded.header.kid);
        // Verificar el token con la clave pública
        const verified = jsonwebtoken_1.default.verify(token, signingKey, {
            algorithms: ['RS256'],
            audience: process.env.COGNITO_CLIENT_ID,
            issuer: `https://cognito-idp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        });
        return verified;
    }
    catch (error) {
        console.error("Error verificando token:", error);
        return null;
    }
});
exports.verifyToken = verifyToken;
/**
 * Extrae información básica del usuario desde un token verificado
 * @param tokenPayload - Payload del token verificado
 * @returns Información del usuario
 */
const extractUserInfo = (tokenPayload) => {
    return {
        cognitoId: tokenPayload.sub,
        email: tokenPayload.email,
        name: tokenPayload.name,
        role: tokenPayload["custom:role"],
    };
};
exports.extractUserInfo = extractUserInfo;
