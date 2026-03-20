import * as z from "zod";

export const categorySchema = z.object({
    _id: z.string().optional(),
    categoryName: z.string().min(1, "Category name is required"),
    description: z.string().min(30, "Description is required (minimum 30 characters)"),
    slug: z.string().min(1, "Slug is required"),
    commonAdvantages: z.array(z.string().min(1, "Advantage cannot be empty")).min(1, "At least one advantage is required"),
    order: z.coerce.number().min(0, "Order must be a positive number"),
    status: z.enum(["active", "inactive"]),
    primaryImage: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]),
    secondaryImage: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]),
    thirdImage: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]),
    videoUrl: z.string().url("Valid URL required").optional().or(z.literal('')),
    pdfUrl: z.string().url("Valid URL required").optional().or(z.literal('')),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryOutput = Omit<Category, "primaryImage" | "secondaryImage" | "thirdImage"> & { primaryImage: string, secondaryImage: string, thirdImage: string };

export type CategoryCreateInput = Omit<Category, "_id" | "createdAt" | "updatedAt">;

// For individual field updates
export const categoryUpdateSchema = categorySchema.partial().omit({ _id: true, createdAt: true, updatedAt: true });
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
