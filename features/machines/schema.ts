import * as z from "zod";

const fileSchema = z.instanceof(File);

const constrainedFilesSchema = z
    .array(fileSchema)
    .min(1, "At least one file is required")
    .max(5, "Maximum of 5 files allowed");

const FeatureKeyValueSchema = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
});
const SpecificationskeyValueSchema = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.union([
        z.string().min(1, "Value is required"),
        z.record(z.string(), z.any()),
        z.array(z.any())
    ]),
});



export const machineSchema = z.object({
    _id: z.string().optional(),

    categoryId: z.string().min(1, "Category is required"),

    modelName: z.string().min(2, "Model name must be at least 2 characters"),

    slug: z.string().min(2, "Slug is required"),

    specifications: z
        .array(SpecificationskeyValueSchema)
        .min(1, "At least one specification is required")
        .refine((arr) => {
            const keys = arr.map((i) => i.key);
            return new Set(keys).size === keys.length;
        }, "Duplicate specification keys not allowed"),

    description: z.string().min(10, { message: "Description is required" }),

    featureDescriptions: z.array(FeatureKeyValueSchema).optional(),

    image1: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]),
    image2: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]).optional(),
    image3: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]).optional(),
    outlineImage: z.union([
        z.string().min(1, "Existing image URL is required"),
        z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
            .refine(
                (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
                "Only JPG, PNG, WEBP allowed"
            )
    ]),

    order: z.coerce.number().min(0, "Order must be a positive number"),

    status: z.enum(["active", "inactive"]),

    videoUrl: z.string().url("Valid URL required").optional().or(z.literal("")),

    createdAt: z.string().optional(),

    updatedAt: z.string().optional(),
});

export type Machine = z.infer<typeof machineSchema>;

export type MachineCreateInput = Omit<
    Machine,
    "_id" | "createdAt" | "updatedAt"
>;
export type MachineResponse = Omit<Machine, "categoryId"> & {
    categoryId: {
        _id: string;
        categoryName: string;
        slug: string;
        commonAdvantages: string[];
    };
};

export const machineUpdateSchema = machineSchema
    .partial()
    .omit({ _id: true, createdAt: true, updatedAt: true });

export type MachineUpdateInput = z.infer<typeof machineUpdateSchema>;
