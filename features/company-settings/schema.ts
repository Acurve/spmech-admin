import { z } from "zod";

export const manufacturerInfoSchema = z.object({
    _id: z.string().optional(),
    name: z
        .string()
        .min(1, "Manufacturer name is required")
        .max(200, "Name cannot exceed 200 characters"),
    logoText: z
        .string()
        .optional()
        .nullable(),
    tagline: z
        .string()
        .max(300, "Tagline cannot exceed 300 characters")
        .optional()
        .nullable(),
    profileText: z
        .array(z.string())
        .default([]),
    contactDetails: z.object({
        address: z.string().optional().nullable(),
        email: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
        customerCareNo: z.string().optional().nullable(),
        mobileNo: z.string().optional().nullable(),
    }).optional(),
    stats: z.array(
        z.object({
            label: z.string().min(1, 'Stat label is required (e.g., "Accuracy", "Machines Installed")'),
            value: z.string().min(1, 'Stat value is required (e.g., "99.8", "200")'),
            suffix: z.string().optional().default(''),
        })
    ).default([]),
    timeline: z.array(
        z.object({
            year: z.string().min(1, 'Timeline year is required'),
            message: z.string().min(1, 'Timeline message is required').max(500, 'Timeline message cannot exceed 500 characters'),
            imageUrl: z.union([
                z.string().min(1, 'Timeline image is required'),
                z.instanceof(File) // To accept File objects for uploads
            ]),
        })
    ).default([]),
});

export const updateManufacturerInfoSchema = manufacturerInfoSchema.partial();

export type ManufacturerInfo = z.infer<typeof manufacturerInfoSchema>;
export type UpdateManufacturerInfo = z.infer<typeof updateManufacturerInfoSchema>;
