
import 'dotenv/config';

import { ChatGoogle } from '@langchain/google/node';

import {
    HumanMessage,
    AIMessage,
    SystemMessage
} from 'langchain';

import {
    tool,
    createAgent
} from 'langchain';

import * as z from 'zod';

import { sendEmail } from './mail.services.js';


// ============================================
// 1. CREATE EMAIL TOOL
// ============================================

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

            Required fields:
            - to: Recipient email address.
            - subject: Email subject.
            - html: Complete HTML email body.

            If the user explicitly asks you to send an email,
            generate a professional and meaningful HTML body.

            If the user only asks for an email draft,
            do not call this tool.

            Never call this tool without a valid recipient.
        `,

        schema: z.object({
            to: z.string()
                .email()
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


// ============================================
// 2. INITIALIZE GEMINI MODEL
// ============================================

const geminiModel = new ChatGoogle({
    model: 'gemini-3.1-flash-lite',
    apiKey: process.env.GEMINI_API_KEY,
});


// ============================================
// 3. CREATE AI AGENT
// ============================================

const agent = createAgent({
    model: geminiModel,
    tools: [emailTool],
});


// ============================================
// 4. GENERATE AI RESPONSE
// ============================================

export const generateAIResponse = async (input) => {

    let conversationMessages = [];

    // Handle a single message
    if (typeof input === 'string') {

        conversationMessages.push(
            new HumanMessage(input)
        );

    }

    // Handle conversation history
    else if (Array.isArray(input)) {

        conversationMessages = input.map((msg) => {

            switch (msg.role) {

                case 'user':
                    return new HumanMessage(msg.content);

                case 'ai':
                    return new AIMessage(msg.content);

                case 'system':
                    return new SystemMessage(msg.content);

                default:
                    throw new Error(
                        `Unsupported message role: ${msg.role}`
                    );
            }
        });

    } else {
        throw new Error(
            'Input must be a string or an array of messages'
        );
    }

    // Invoke AI agent
    const response = await agent.invoke({
        messages: conversationMessages
    });

    // Get final AI message
    const lastMessage = response.messages[
        response.messages.length - 1
    ];

    if (!lastMessage) {
        throw new Error('AI agent returned no response');
    }

    // Extract response content
    const content = lastMessage.content;

    if (typeof content === 'string') {
        return content;
    }

    // Handle multimodal / block-based content
    if (Array.isArray(content)) {
        return content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');
    }

    throw new Error('Invalid AI response format');
};


// ============================================
// 5. GENERATE CHAT TITLE
// ============================================

export const generateChatTitle = async (message) => {

    const response = await geminiModel.invoke([

        new SystemMessage(`
            You are a helpful assistant that generates concise
            and relevant titles for chat conversations.

            Generate a title based on the user's first message.

            Rules:
            - Keep the title short and meaningful.
            - Maximum 8 words.
            - Do not include quotation marks.
            - Do not include explanations.
            - Do not use offensive or vulgar language.
        `),

        new HumanMessage(
            `Generate a concise title for this message: ${message}`
        ),

    ]);

    const title = response.content;

    return typeof title === 'string'
        ? title.trim().replace(/^["']|["']$/g, '')
        : 'New chat';
};
