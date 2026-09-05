
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Jarvis AI"
    }
});

async function askOpenAI(query) {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY or OPENAI_API_KEY is not configured in .env");
    }

    const response = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        max_tokens: 250,
        messages: [
            {
                role: "system",
                content: "Reply as Jarvis, a warm and helpful friend. Understand natural, informal questions and answer naturally, clearly, and directly. Match the length to the question: use one short sentence for a simple question and a few sentences when more explanation is useful. Use contractions when they sound natural. Do not use Markdown, bullet points, numbered lists, headings, emojis, or special formatting because your answer will be spoken aloud."
            },
            { role: "user", content: query }
        ]
    });

    const message = response.choices?.[0]?.message;
    const answer = Array.isArray(message?.content)
        ? message.content
            .filter((part) => part?.type === "text" && typeof part.text === "string")
            .map((part) => part.text)
            .join("\n")
            .trim()
        : typeof message?.content === "string"
            ? message.content.trim()
            : "";

    if (!answer) {
        throw new Error("The AI service returned an empty response.");
    }

    return { answer };
}

export default askOpenAI;
