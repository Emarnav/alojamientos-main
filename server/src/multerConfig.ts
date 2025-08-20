import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

/**
 * Devuelve una instancia de multer configurada para un alojamiento específico
 * o una carpeta temporal si se pasa "temp".
 */
export function getMulterForAlojamiento(alojamientoId: number | "temp") {
  let targetPath: string;

  if (alojamientoId === "temp") {
    const tempFolder = randomUUID();
    targetPath = path.join(process.cwd(), "public", "alojamientos", "temp", tempFolder);
  } else {
    targetPath = path.join(process.cwd(), "public", "alojamientos", String(alojamientoId));
  }

  // Creamos la carpeta si no existe
  fs.mkdirSync(targetPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, targetPath),
    filename: (_, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
}
