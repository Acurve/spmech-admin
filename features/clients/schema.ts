import { z } from "zod";

export const clientsSchema = z.object({
    _id: z.string().optional(),
    clients: z.array(
        z.object({
            websiteUrl: z.string().optional(),
            imageUrl: z.union([
                z.string().min(1, 'Client Logo is required'),
                z.instanceof(File) // To accept File objects for uploads
            ]),
        })
    ).default([]),
});

export const updateClientsSchema = clientsSchema.partial();

export type Clients = z.infer<typeof clientsSchema>;
export type UpdateClients = z.infer<typeof updateClientsSchema>;
