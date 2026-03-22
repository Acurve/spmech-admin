import * as z from "zod"

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required" }),

    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }),
})

export type LoginSchemaType = z.infer<typeof loginSchema>

export const updateUserSchema = loginSchema.partial()

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>