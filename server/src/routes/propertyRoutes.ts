import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyControllers";
import { testAuthMiddleware } from "../middleware/testAuthMiddleware";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", testAuthMiddleware(["propietario"]), createProperty);
router.put("/:id", testAuthMiddleware(["propietario", "admin"]), updateProperty);
router.delete("/:id", testAuthMiddleware(["propietario"]), deleteProperty);

export default router;
