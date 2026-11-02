import 'dotenv/config';
import readline from "node:readline/promises";
import { ChatGoogle } from "@langchain/google/node";
import { stdin as input, stdout as output } from "node:process";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({ input, output });

const model = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const messages = [];

while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")

    messages.push(new HumanMessage(userInput))

    const response = await model.invoke(messages)

    messages.push(response)

    console.log(response.content)
    }

    rl.close()







