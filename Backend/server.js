import app from "./src/app.js";
import dotenv from "dotenv";
import dns from "dns";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const server = http.createServer(app);

initSocket(server);

connectDB();

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});