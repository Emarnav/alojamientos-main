import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/mensajes
 * Crear un mensaje entre dos usuarios para un alojamiento
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contenido, emisorId, conversacionId } = req.body;

    const nuevoMensaje = await prisma.mensaje.create({
      data: {
        contenido,
        emisorId,
        conversacionId,
      },
    });

    // Obtener la conversación para saber quién es quién
    const conversacion = await prisma.conversacion.findUnique({
      where: { id: conversacionId },
    });

    if (!conversacion) {
      res.status(404).json({ message: "Conversación no encontrada" });
      return;
    }

    const esPropietario = emisorId === conversacion.propietarioId;
    const esEstudiante = emisorId === conversacion.estudianteId;

    await prisma.conversacion.update({
      where: { id: conversacionId },
      data: {
        ultimoMensajeId: nuevoMensaje.id,
        propietarioVistoUltimo: esPropietario ? true : false,
        estudianteVistoUltimo: esEstudiante ? true : false,
      },
    });

    res.status(201).json(nuevoMensaje);
  } catch (error: any) {
    res.status(500).json({ message: `Error al enviar el mensaje: ${error.message}` });
  }
};


/**
 * GET /api/mensajes/:alojamientoId/:usuarioA/:usuarioB
 * Obtener historial de chat entre dos usuarios sobre un alojamiento
 */
export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversacionId } = req.params;

    const mensajes = await prisma.mensaje.findMany({
      where: {
        conversacionId: Number(conversacionId),
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(mensajes);
  } catch (error: any) {
    res.status(500).json({ message: `Error al obtener los mensajes: ${error.message}` });
  }
};

/**
 * POST /api/conversaciones
 * Crea una conversación si no existe ya entre estudiante y propietario sobre un alojamiento
 */
export const createOrGetConversacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alojamientoId, estudianteId, propietarioId } = req.body;

    let conversacion = await prisma.conversacion.findUnique({
      where: {
        alojamientoId_estudianteId_propietarioId: {
          alojamientoId,
          estudianteId,
          propietarioId,
        },
      },
    });

    if (!conversacion) {
      conversacion = await prisma.conversacion.create({
        data: {
          alojamientoId,
          estudianteId,
          propietarioId,
        },
      });
    }

    res.status(200).json(conversacion);
  } catch (error: any) {
    res.status(500).json({ message: `Error al crear/conseguir la conversación: ${error.message}` });
  }
};

export const getConversacionesUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = Number(req.query.usuarioId);

    const conversaciones = await prisma.conversacion.findMany({
      where: {
        OR: [
          { estudianteId: usuarioId },
          { propietarioId: usuarioId },
        ],
      },
      include: {
        alojamiento: {
          include: {
            ubicacion: true, 
          },
        },
        propietario: {
          select: { nombre: true },
        },
        estudiante: {
          select: { nombre: true },
        },
        mensajes: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    res.status(200).json(conversaciones);
  } catch (error: any) {
    res.status(500).json({ message: `Error al obtener conversaciones: ${error.message}` });
  }
};

export const marcarComoLeido = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversacionId = Number(req.params.id);
    const { usuarioId } = req.body;

    const conversacion = await prisma.conversacion.findUnique({
      where: { id: conversacionId },
    });

    if (!conversacion) {
      res.status(404).json({ message: "Conversación no encontrada" });
      return;
    }

    const data: any = {};
    if (usuarioId === conversacion.estudianteId) {
      data.estudianteVistoUltimo = true;
    } else if (usuarioId === conversacion.propietarioId) {
      data.propietarioVistoUltimo = true;
    } else {
      res.status(403).json({ message: "Usuario no autorizado en esta conversación" });
      return;
    }

    await prisma.conversacion.update({
      where: { id: conversacionId },
      data,
    });

    res.status(200).json({ message: "Mensaje marcado como leído" });
  } catch (error: any) {
    res.status(500).json({ message: `Error al marcar como leído: ${error.message}` });
  }
};
