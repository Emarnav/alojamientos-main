import express from "express";
import {
  getAdmin,
  getAlojamientosPendientes,
  aprobarAlojamiento,
  rechazarAlojamiento,
} from "../controllers/adminControllers";
import { testAuthMiddleware } from "../middleware/testAuthMiddleware";

const router = express.Router();

router.get("/alojamientos", testAuthMiddleware(["admin"]), getAlojamientosPendientes); 
router.get("/:cognitoId", getAdmin);
router.put("/alojamientos/:id/aprobar", testAuthMiddleware(["admin"]), aprobarAlojamiento);
router.put("/alojamientos/:id/rechazar", testAuthMiddleware(["admin"]), rechazarAlojamiento);

export default router;
