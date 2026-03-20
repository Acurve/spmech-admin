import { z } from "zod";

export const contactSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    message: z.string(),
    createdAt: z.string(),
});

export type ContactRequest = z.infer<typeof contactSchema>;
