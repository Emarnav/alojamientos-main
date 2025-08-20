import { Router } from "express";
import { sendMessage, getChatMessages, createOrGetConversacion, marcarComoLeido, getConversacionesUsuario } from "../controllers/chatControllers";

const router = Router();

router.post("/mensajes", sendMessage);
router.get("/mensajes/:conversacionId", getChatMessages);
router.post("/conversaciones", createOrGetConversacion);
router.get("/conversaciones", getConversacionesUsuario);
router.patch("/conversaciones/:id/leido", marcarComoLeido);


export default router;
