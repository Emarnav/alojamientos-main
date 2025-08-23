import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";
import { testAuthMiddleware, testExtractUserFromToken } from "../middleware/testAuthMiddleware";

const router = express.Router();

// Rutas protegidas
router.get("/:cognitoId", testAuthMiddleware(["propietario"]), getManager);
router.put("/:cognitoId", testAuthMiddleware(["propietario"]), updateManager);
router.get("/:cognitoId/alojamientos", testAuthMiddleware(["propietario"]), getManagerProperties);

// Ruta abierta para registro (sin necesidad de que exista en la BD todavía)
router.post("/", testExtractUserFromToken, createManager);

export default router;
