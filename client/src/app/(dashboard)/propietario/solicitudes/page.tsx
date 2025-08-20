import { Metadata } from "next";
import Chats from "./Chats";

export const metadata: Metadata = {
  title: "Mis conversaciones | UCH-CEU",
  description: "Consulta el estado de tus conversaciones.",
};

export default function Page() {
  return <Chats />;
}
