import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-client";

interface CognitoTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  "custom:role"?: string;
  name?: string;
  token_use: "access" | "id";
}

// Cliente JWKS para obtener las claves públicas de Cognito
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutos
});

// Función para obtener la clave de firma
const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        resolve(signingKey!);
      }
    });
  });
};

/**
 * Verifica un token JWT de AWS Cognito
 * @param token - El token JWT a verificar
 * @returns Promise con el payload decodificado o null si es inválido
 */
export const verifyToken = async (token: string): Promise<CognitoTokenPayload | null> => {
  try {
    // Decodificar el header para obtener el kid (key ID)
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || !decoded.header || !decoded.header.kid) {
      console.error("Token no válido: falta kid en el header");
      return null;
    }

    // Obtener la clave pública correspondiente
    const signingKey = await getSigningKey(decoded.header.kid);

    // Verificar el token con la clave pública
    const verified = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: `https://cognito-idp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    }) as CognitoTokenPayload;

    return verified;
  } catch (error) {
    console.error("Error verificando token:", error);
    return null;
  }
};

/**
 * Extrae información básica del usuario desde un token verificado
 * @param tokenPayload - Payload del token verificado
 * @returns Información del usuario
 */
export const extractUserInfo = (tokenPayload: CognitoTokenPayload) => {
  return {
    cognitoId: tokenPayload.sub,
    email: tokenPayload.email,
    name: tokenPayload.name,
    role: tokenPayload["custom:role"],
  };
};