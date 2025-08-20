import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DecodedToken extends JwtPayload {
  sub: string;
  email: string;
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

// 🔐 Middleware completo para proteger rutas con roles
export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken;
      const email = decoded?.email;
      const cognitoId = decoded?.sub;

      if (!email || !cognitoId) {
        res.status(400).json({ message: "Token inválido o incompleto" });
        return;
      }

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
export const extractUserFromToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No autorizado: falta token" });
    return;
  }

  try {
    const decoded = jwt.decode(token) as DecodedToken;

    if (!decoded?.sub || !decoded?.email) {
      res.status(400).json({ message: "Token inválido o incompleto" });
      return;
    }

    req.user = {
      cognitoId: decoded.sub,
      email: decoded.email,
      role: "pendiente",
    };

    next();
  } catch (err) {
    res.status(400).json({ message: "Error al decodificar token" });
    return;
  }
};
