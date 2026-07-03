import { io } from "socket.io-client";
import { env } from "@/config/env";

export const socket = io(env.wsUrl, {
  autoConnect: false,
  transports: ["websocket"],
});

export function connectSocket(token?: string) {
  if (token) {
    socket.auth = {
      token,
    };
  }

  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
