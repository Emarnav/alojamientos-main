"use client";

import React, { useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  useSendMessageMutation,
  useGetChatMessagesQuery,
  useMarcarComoLeidoMutation,
} from "@/state/api";

interface ChatWindowProps {
  conversacionId: number;
  remitenteId: number;
  nombreReceptor: string;
}

const ChatWindow = ({
  conversacionId,
  remitenteId,
  nombreReceptor,
}: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const [marcarComoLeido] = useMarcarComoLeidoMutation();
  const { data: mensajes, refetch } = useGetChatMessagesQuery(conversacionId);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    marcarComoLeido({ conversacionId, usuarioId: remitenteId });

    return () => clearInterval(interval);
  }, [refetch, conversacionId, remitenteId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        contenido: message,
        emisorId: remitenteId,
        conversacionId,
      }).unwrap();

      setMessage("");
      await refetch();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="my-6 mx-auto w-full max-w-xl h-[500px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Encabezado superior */}
      <div className="px-4 py-3 bg-primary-700 text-white font-semibold text-sm">
        Chateando con {nombreReceptor}
      </div>

      {/* Chat UI que ocupa el resto del espacio */}
      <div className="flex-1 min-h-0">
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {mensajes?.map((msg: any) => {
                const isMe = msg.emisorId === remitenteId;
                const hora = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Message
                    key={msg.id}
                    model={{
                      message: msg.contenido,
                      direction: isMe ? "outgoing" : "incoming",
                      position: "single",
                      sentTime: hora,
                      sender: isMe ? "Tú" : nombreReceptor,
                    }}
                  >
                  <Avatar size="sm">
                    <div
                      className={`rounded-full px-2 h-7 flex items-center justify-center text-xs font-semibold bg-gray-200${
                        isMe ? " bg-gray-300" : ""
                      }`}
                    >
                      {isMe ? "Tú" : nombreReceptor.charAt(0).toUpperCase()}
                    </div>
                  </Avatar>


                  </Message>
                );
              })}
            </MessageList>

            <MessageInput
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={setMessage}
              onSend={handleSend}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );

};

export default ChatWindow;
