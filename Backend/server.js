import app from "./src/app.js";
import dotenv from "dotenv";
import dns from "dns";
import connectDB from "./src/config/database.js";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB();


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});