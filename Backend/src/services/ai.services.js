import { ChatGoogle } from "@langchain/google/node";
import "dotenv/config";

const model = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export default model;