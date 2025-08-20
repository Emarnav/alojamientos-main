"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMulterForAlojamiento = getMulterForAlojamiento;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
/**
 * Devuelve una instancia de multer configurada para un alojamiento específico
 * o una carpeta temporal si se pasa "temp".
 */
function getMulterForAlojamiento(alojamientoId) {
    let targetPath;
    if (alojamientoId === "temp") {
        const tempFolder = (0, crypto_1.randomUUID)();
        targetPath = path_1.default.join(process.cwd(), "public", "alojamientos", "temp", tempFolder);
    }
    else {
        targetPath = path_1.default.join(process.cwd(), "public", "alojamientos", String(alojamientoId));
    }
    // Creamos la carpeta si no existe
    fs_1.default.mkdirSync(targetPath, { recursive: true });
    const storage = multer_1.default.diskStorage({
        destination: (_, __, cb) => cb(null, targetPath),
        filename: (_, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    });
    return (0, multer_1.default)({ storage });
}
