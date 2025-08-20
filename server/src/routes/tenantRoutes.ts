import express from "express";
import {
  getTenant,
  createTenant,
  updateStudent,
  getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,
} from "../controllers/tenantControllers";
import { authMiddleware, extractUserFromToken } from "../middleware/authMiddleware";

const router = express.Router();

// 🔓 Ruta abierta para registro (aún no existe en BD)
router.post("/", extractUserFromToken, createTenant);

// 🔐 Rutas protegidas: solo tipo 'estudiante'
router.get("/:cognitoId", authMiddleware(["estudiante"]), getTenant);
router.put("/:cognitoId", authMiddleware(["estudiante"]), updateStudent);
router.get("/:cognitoId/current-residences", authMiddleware(["estudiante"]), getCurrentResidences);
router.post("/:cognitoId/favoritos/:propertyId", authMiddleware(["estudiante"]), addFavoriteProperty);
router.delete("/:cognitoId/favoritos/:propertyId", authMiddleware(["estudiante"]), removeFavoriteProperty);

export default router;
