import { useEffect, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth.tsx";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export function useSocket(reportId: string, startDate: string | null, endDate: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReport] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    console.log("Connecting to socket", user.token);
    const socketInstance = io("http://localhost:3000", {
      query: { reportId, startDate, endDate },
      extraHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setSocket(socketInstance);

    socketInstance.emit("start", { reportId });

    socketInstance.on("assistant", (token) => {
      if (token.toString().includes("~~~~")) {
        setMessages((prev) => [...prev, { content: "", isUser: false }]);
      } else {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          console.log(lastMessage);
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + token,
          };
          return [...prev.slice(0, -1), updatedMessage];
        });
      }
    });

    socketInstance.on("user", (token) => {
      console.log(token);
      if (token.toString().includes("~~~~")) {
        setMessages((prev) => [...prev, { content: "", isUser: true }]);
      } else {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage) {
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + token,
            };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return prev;
        });
      }
    });

    socketInstance.on("report", (token) => {
      if (token.toString().includes("~~~~")) {
        setReport("");
      } else {
        setReport((prev) => prev + token);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [reportId, user.token]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket) return;

      setMessages((prev) => [...prev, { content: message, isUser: true }]);

      socket.emit("message", message);
    },
    [socket]
  );

  return { messages, sendMessage, report };
}
