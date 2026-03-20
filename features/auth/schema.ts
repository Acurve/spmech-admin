import * as z from "zod"

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscore (_)",
        }),

    password: z
        .string()
        .min(1, { message: "Password is required" }),
})

export type LoginSchemaType = z.infer<typeof loginSchema>