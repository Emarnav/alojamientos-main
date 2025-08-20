import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";
import { authMiddleware, extractUserFromToken } from "../middleware/authMiddleware";

const router = express.Router();

// Rutas protegidas
router.get("/:cognitoId", authMiddleware(["propietario"]), getManager);
router.put("/:cognitoId", authMiddleware(["propietario"]), updateManager);
router.get("/:cognitoId/alojamientos", authMiddleware(["propietario"]), getManagerProperties);

// Ruta abierta para registro (sin necesidad de que exista en la BD todavía)
router.post("/", extractUserFromToken, createManager);

export default router;
