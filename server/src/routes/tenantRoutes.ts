import express from "express";
import {
  getTenant,
  createTenant,
  updateStudent,
  getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,
} from "../controllers/tenantControllers";
import { testAuthMiddleware, testExtractUserFromToken } from "../middleware/testAuthMiddleware";

const router = express.Router();

// 🔓 Ruta abierta para registro (aún no existe en BD)
router.post("/", testExtractUserFromToken, createTenant);

// 🔐 Rutas protegidas: solo tipo 'estudiante'
router.get("/:cognitoId", testAuthMiddleware(["estudiante"]), getTenant);
router.put("/:cognitoId", testAuthMiddleware(["estudiante"]), updateStudent);
router.get("/:cognitoId/current-residences", testAuthMiddleware(["estudiante"]), getCurrentResidences);
router.post("/:cognitoId/favoritos/:propertyId", testAuthMiddleware(["estudiante"]), addFavoriteProperty);
router.delete("/:cognitoId/favoritos/:propertyId", testAuthMiddleware(["estudiante"]), removeFavoriteProperty);

export default router;
