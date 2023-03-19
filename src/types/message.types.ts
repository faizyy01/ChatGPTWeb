import { Role } from "@prisma/client";
import { z } from "zod";

export interface Messages {
    role: Role;
    content: string;
}

export const messagesSchema = z.object(
    {
        messages: z.array(
            z.object({
                role: z.nativeEnum(Role),
                content: z.string(),
            })
        ),
        chatId: z.string().optional(),
    }
)