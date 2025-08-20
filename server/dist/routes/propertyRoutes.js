"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyControllers_1 = require("../controllers/propertyControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", propertyControllers_1.getProperties);
router.get("/:id", propertyControllers_1.getProperty);
router.post("/", (0, authMiddleware_1.authMiddleware)(["propietario"]), propertyControllers_1.createProperty);
router.put("/:id", (0, authMiddleware_1.authMiddleware)(["propietario", "admin"]), propertyControllers_1.updateProperty);
router.delete("/:id", (0, authMiddleware_1.authMiddleware)(["propietario"]), propertyControllers_1.deleteProperty);
exports.default = router;
