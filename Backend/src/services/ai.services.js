import 'dotenv/config';

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { ChatGoogle } from '@langchain/google/node';
import { HumanMessage } from 'langchain';
import { tool, createAgent } from 'langchain';
import * as z from 'zod';

import { sendEmail } from './mail.services.js';


// 1. Create Email Tool
const emailTool = tool(
  async ({ to, subject, html }) => {

    console.log('\nEmail tool called with:', {
      to,
      subject,
      hasHtml: Boolean(html),
    });

    return await sendEmail({
      to,
      subject,
      html,
    });
  },
  {
    name: 'sendEmail',

    description: `
      Send an email to a specified recipient.

      You must provide:
      - to: Recipient email address.
      - subject: Email subject.
      - html: Complete HTML email body.

      If the user asks you to write the email body,
      generate a professional and meaningful HTML email.

      Never call this tool without a valid recipient email address.
    `,

    schema: z.object({
      to: z.string()
        .describe('Recipient email address'),

      subject: z.string()
        .min(1)
        .describe('Email subject'),

      html: z.string()
        .min(1)
        .describe('Complete HTML email body'),
    }),
  }
);


// 2. Initialize Gemini Model
const model = new ChatGoogle({
  model: 'gemini-3.1-flash-lite',
  apiKey: process.env.GEMINI_API_KEY,
});


// 3. Create AI Agent
const agent = createAgent({
  model,
  tools: [emailTool],
});


// 4. Initialize Readline
const rl = readline.createInterface({
  input,
  output,
});


// 5. Conversation History
const messages = [];


// 6. Run AI Agent
console.log('\nPerplexity AI Email Assistant Started!');
console.log('Type "exit" to close the application.\n');

while (true) {
  try {
    const userInput = await rl.question(
      '\x1b[32mYou:\x1b[0m '
    );

    if (!userInput.trim()) {
      continue;
    }

    if (userInput.toLowerCase().trim() === 'exit') {
      console.log('Goodbye!');
      break;
    }

    // Add user message to conversation history
    messages.push(new HumanMessage(userInput));

    // Invoke AI agent
    const response = await agent.invoke({
      messages,
    });

    // Update conversation history with the complete response
    messages.splice(0, messages.length, ...response.messages);

    // Get final AI response
    const lastMessage = response.messages[
      response.messages.length - 1
    ];

    console.log(
      `\n\x1b[34m[AI]\x1b[0m`,
      typeof lastMessage.content === 'string'
        ? lastMessage.content
        : JSON.stringify(lastMessage.content, null, 2)
    );

  } catch (error) {
    console.error('\n\x1b[31mError:\x1b[0m', error.message);
  }
}

// Close readline interface
rl.close();
