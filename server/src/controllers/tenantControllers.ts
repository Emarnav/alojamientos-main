// CONTROLADORES DE USUARIO ESTUDIANTE CENTRALIZADO

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

// Obtener usuario por cognitoId
export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
      include: { alojamientosFavoritos: true },
    });

    if (!usuario || usuario.tipo !== "Estudiante") {
      res.status(404).json({ message: "No se encontró el estudiante" });
      return;
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error al recuperar el estudiante: ${error.message}` });
  }
};

// Crear estudiante
export const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    const { cognitoId, email } = req.user!;

    if (!nombre || !email ) {
      res.status(400).json({ message: "Faltan datos obligatorios para crear el estudiante." });
      return;
    }

    const existingUser = await prisma.usuario.findUnique({ where: { cognitoId } });
    if (existingUser) {
      res.status(409).json({ message: "El usuario ya existe." });
      return;
    }

    const usuario = await prisma.usuario.create({
      data: {
        cognitoId,
        email,
        nombre,
        tipo: "Estudiante",
      },
    });

    res.status(201).json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: `Error al crear el estudiante: ${error.message}` });
  }
};


// Actualizar usuario
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { nombre, email, telefono } = req.body;

    const updated = await prisma.usuario.update({
      where: { cognitoId },
      data: { nombre, email, telefono },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error actualizando el estudiante: ${error.message}` });
  }
};

// Obtener alojamientos favoritos con coordenadas
export const getCurrentResidences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
    });

    if (!usuario || usuario.tipo !== "Estudiante") {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    const properties = await prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: {
        alojamientosFavoritos: {
          include: {
            ubicacion: true,
          },
        },
      },
    });

    if (!properties) {
      res.status(404).json({ message: "No se encontraron alojamientos" });
      return;
    }

    const formatted = await Promise.all(
      properties.alojamientosFavoritos.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Ubicacion" WHERE id = ${property.ubicacion.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
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

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: `Error al recuperar alojamientos: ${error.message}` });
  }
};

// Añadir favorito
export const addFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
      include: { alojamientosFavoritos: true },
    });

    if (!usuario || usuario.tipo !== "Estudiante") {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    const alreadyFavorite = usuario.alojamientosFavoritos.some(
      (fav) => fav.id === Number(propertyId)
    );

    if (alreadyFavorite) {
      res.status(409).json({ message: "Ya está en favoritos" });
      return;
    }

    const updated = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        alojamientosFavoritos: {
          connect: { id: Number(propertyId) },
        },
      },
      include: { alojamientosFavoritos: true },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error al añadir favorito: ${error.message}` });
  }
};

// Eliminar favorito
export const removeFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { cognitoId },
    });

    if (!usuario || usuario.tipo !== "Estudiante") {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }

    const updated = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        alojamientosFavoritos: {
          disconnect: { id: Number(propertyId) },
        },
      },
      include: { alojamientosFavoritos: true },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error al eliminar favorito: ${error.message}` });
  }
};
