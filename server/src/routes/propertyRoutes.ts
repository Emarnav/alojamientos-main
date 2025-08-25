import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", authMiddleware(["propietario"]), createProperty);
router.put("/:id", authMiddleware(["propietario", "admin"]), updateProperty);
router.delete("/:id", authMiddleware(["propietario"]), deleteProperty);

export default router;
