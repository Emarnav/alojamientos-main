import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener datos del admin por cognitoId
export const getAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
    });

    if (!usuario) {
      res.status(404).json({ message: "No se encontró al admin" });
      return;
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error al recuperar el admin: ${error.message}` });
  }
};


export const getAlojamientosPendientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendientes = await prisma.alojamiento.findMany({
      where: { estado: "Pendiente" },
      include: {
        ubicacion: true,
      },
    });

    res.json(pendientes);
  } catch (err: any) {
    console.error("Error al obtener alojamientos pendientes:", err);
    res.status(500).json({ message: "Error interno al obtener alojamientos pendientes" });
  }
};

export const aprobarAlojamiento = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { esDestacado } = req.body;

  try {
    await prisma.alojamiento.update({
      where: { id },
      data: {
        estado: "Aprobado",
        motivoRechazo: null,
        esDestacado: esDestacado === true || esDestacado === "true", 
      },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error al aprobar alojamiento:", err.message);
    res.status(500).json({ message: "Error al aprobar alojamiento" });
  }
};


export const rechazarAlojamiento = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { motivo, esDestacado } = req.body;

  if (!motivo || motivo.trim().length < 5) {
    res.status(400).json({ message: "Motivo de rechazo inválido" });
    return;
  }

  try {
    await prisma.alojamiento.update({
      where: { id },
      data: {
        estado: "Rechazado",
        motivoRechazo: motivo.trim(),
        esDestacado: esDestacado === true || esDestacado === "true", 
      },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error al rechazar alojamiento:", err.message);
    res.status(500).json({ message: "Error al rechazar alojamiento" });
  }
};

