import { type NextApiRequest, type NextApiResponse } from "next";
import { OpenAI } from "openai-streams";
import { getServerAuthSession } from "~/server/auth";
import { type ChatCompletionRequestMessage } from "openai";

// OpenAI.setApiKey(process.env.OPENAI_API_KEY);
interface response extends NextApiResponse {
    body: {
        messages: ChatCompletionRequestMessage[];
    }
}

export default async function handler(req: response) {
    const { messages } = req.body;
    // console.log("messages");
    // console.log(messages, "body");
    // console.log(messages)
    const chatStream = await OpenAI(
        "chat",
        {
            model: "gpt-3.5-turbo",
            messages,
        },

    );

    return new Response(chatStream);
}

export const config = {
    runtime: "edge"
};
