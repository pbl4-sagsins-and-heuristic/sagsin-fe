import { io, Socket } from "socket.io-client";

export class SocketConnection {
    private static socket: Socket;

    private constructor() { }

    public static getInstance(): Socket {
        if (!SocketConnection.socket) {
            SocketConnection.socket = io("http://localhost:3000", {
                transports: ["websocket"],
            });
        }
        return SocketConnection.socket;
    }
}
