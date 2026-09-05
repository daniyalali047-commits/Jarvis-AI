
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
        throw new Error("OPENROUTER_API_KEY is not configured in .env");
    }

    const response = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        max_tokens: 300,
        messages: [
            {
                role: "system",
                content: "Reply naturally and conversationally as Jarvis. Keep the answer short, using 4 to 5 complete sentences. Put each sentence on its own line. Do not use Markdown, bullet points, numbered lists, headings, emojis, or special formatting."
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
