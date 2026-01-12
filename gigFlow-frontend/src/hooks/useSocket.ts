import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../store/hooks";

let socket: Socket | null = null;

export const useSocket = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && !socket) {
      socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Socket connected");
        socket?.emit("register", user.id);
      });

      socket.on(
        "hired",
        (data: { message: string; gigTitle: string; gigId: string }) => {
          setNotification(data.message);
          setTimeout(() => setNotification(null), 5000);
        }
      );

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    return () => {
      if (socket && !isAuthenticated) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isAuthenticated, user]);

  return { notification };
};
