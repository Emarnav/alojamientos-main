import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

// Obtener un propietario por cognitoId
export const getManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
    });

    if (!usuario || usuario.tipo !== "Propietario") {
      res.status(404).json({ message: "No se ha encontrado al propietario" });
      return;
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error al recuperar el propietario: ${error.message}` });
  }
};

// Crear propietario (usuario con tipo = Propietario)
export const createManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    const { cognitoId, email } = req.user!;


    if (!nombre || !email) {
      res.status(400).json({ message: "Faltan datos obligatorios para crear el propietario." });
      return;
    }

    const existingUser = await prisma.usuario.findUnique({ where: { cognitoId } });
    if (existingUser) {
      res.status(409).json({ message: "El usuario ya existe." });
      return;
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        cognitoId,
        nombre,
        email,
        tipo: "Propietario",
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error creando propietario: ${error.message}` });
  }
};


// Actualizar los datos del propietario
export const updateManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { nombre, email, telefono } = req.body;

    const updatedUsuario = await prisma.usuario.update({
      where: { cognitoId },
      data: { nombre, email, telefono },
    });

    res.json(updatedUsuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error al actualizar propietario: ${error.message}` });
  }
};

// Obtener todos los alojamientos de un propietario
export const getManagerProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
    });

    if (!usuario || usuario.tipo !== "Propietario") {
      res.status(404).json({ message: "Propietario no encontrado" });
      return;
    }

    const properties = await prisma.alojamiento.findMany({
      where: { managerUsuarioId: usuario.id },
      include: { ubicacion: true },
    });

    const enrichedProperties = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Ubicacion" WHERE id = ${property.ubicacion.id}`;

        const geoJSON = wktToGeoJSON(coordinates[0]?.coordinates || "") as {
          type: "Point";
          coordinates: [number, number];
        };

        return {
          ...property,
          ubicacion: {
            ...property.ubicacion,
            coordinates: {
              longitude: geoJSON.coordinates[0],
              latitude: geoJSON.coordinates[1],
            },
          },
        };
      })
    );

    // Orden personalizado por estado: Rechazado -> Pendiente -> Publicado
    const estadoOrden = {
      Rechazado: 0,
      Pendiente: 1,
      Publicado: 2,
    };

    enrichedProperties.sort(
      (a, b) => estadoOrden[a.estado as keyof typeof estadoOrden] - estadoOrden[b.estado as keyof typeof estadoOrden]
    );

    res.json(enrichedProperties);
  } catch (err: any) {
    res.status(500).json({ message: `Error al recuperar alojamientos: ${err.message}` });
  }
};
