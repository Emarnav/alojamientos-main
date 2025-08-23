import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractUserInfo } from "../utils/jwtVerification";

const prisma = new PrismaClient();

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

// 🔐 Middleware completo para proteger rutas con roles
export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    try {
      // ✅ Verificar token con claves públicas de Cognito
      const tokenPayload = await verifyToken(token);
      
      if (!tokenPayload) {
        res.status(401).json({ message: "Token inválido" });
        return;
      }

      const userInfo = extractUserInfo(tokenPayload);
      
      if (!userInfo.email || !userInfo.cognitoId) {
        res.status(400).json({ message: "Token inválido o incompleto" });
        return;
      }

      const user = await prisma.usuario.findUnique({
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
    } catch (err) {
      console.error("Error al procesar el token:", err);
      res.status(400).json({ message: "Token inválido" });
    }
  };
};

// 🔓 Middleware solo para extracción de datos del token (sin validación en BD)
export const extractUserFromToken = async (
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
    // ✅ Verificar token con claves públicas de Cognito
    const tokenPayload = await verifyToken(token);
    
    if (!tokenPayload) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    const userInfo = extractUserInfo(tokenPayload);

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
  } catch (err) {
    console.error("Error al verificar token:", err);
    res.status(400).json({ message: "Error al verificar token" });
    return;
  }
};
