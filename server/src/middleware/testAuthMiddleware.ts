import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔧 Controlar modo de prueba desde variable de entorno
const USE_TEST_MODE = process.env.USE_TEST_AUTH === 'true';
const TEST_SECRET = "test-secret-key-only-for-development";

interface TestTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  "custom:role"?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        cognitoId: string;
        email: string;
        role: string;
      };
    }
  }
}

// 🔐 Middleware que funciona tanto con tokens de prueba como reales
export const testAuthMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    try {
      let tokenPayload: TestTokenPayload;

      if (USE_TEST_MODE) {
        // 🧪 Modo de prueba - verificar con clave de test
        console.log("🧪 Usando modo de prueba para autenticación");
        tokenPayload = jwt.verify(token, TEST_SECRET) as TestTokenPayload;
      } else {
        // 🔒 Modo producción - usar verificación real de Cognito
        console.log("🔒 Usando verificación real de Cognito");
        const { verifyToken, extractUserInfo } = require("../utils/jwtVerification");
        const cognitoPayload = await verifyToken(token);
        
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
      const user = await prisma.usuario.findUnique({
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
    } catch (err) {
      console.error("Error al procesar el token:", err);
      res.status(400).json({ message: "Token inválido" });
    }
  };
};

// 🔓 Middleware ligero para extracción de datos
export const testExtractUserFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No autorizado: falta token" });
    return;
  }

  try {
    let tokenPayload: TestTokenPayload;

    if (USE_TEST_MODE) {
      tokenPayload = jwt.verify(token, TEST_SECRET) as TestTokenPayload;
    } else {
      const { verifyToken } = require("../utils/jwtVerification");
      tokenPayload = await verifyToken(token);
      
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
  } catch (err) {
    console.error("Error al verificar token:", err);
    res.status(400).json({ message: "Error al verificar token" });
    return;
  }
};