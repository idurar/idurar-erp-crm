import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@aman-school/types";

export function createSocket(baseUrl: string, accessToken: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(baseUrl, {
    auth: { token: accessToken },
    transports: ["websocket"],
  });
}
