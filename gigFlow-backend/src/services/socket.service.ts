import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;
const userSockets = new Map<string, string>();

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const emitHireNotification = (
  freelancerId: string,
  data: { gigTitle: string; gigId: string }
) => {
  const socketId = userSockets.get(freelancerId);
  if (socketId && io) {
    io.to(socketId).emit("hired", {
      message: `You have been hired for ${data.gigTitle}!`,
      gigId: data.gigId,
      gigTitle: data.gigTitle,
    });
  }
};
