"use client";

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

// Local imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/shared";
import { categorySchema } from "@/features/categories/schema";
import { useCreateCategory } from "@/features/categories/hooks/useCategory";
import { Header, HeaderBackNavigation, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";

export default function AddCategoryPage() {
    const router = useRouter();
    const createCategoryMutation = useCreateCategory();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(categorySchema.extend({
            primaryImage: typeof window === "undefined" ? categorySchema.shape.primaryImage : categorySchema.shape.primaryImage.optional(),
            secondaryImage: typeof window === "undefined" ? categorySchema.shape.secondaryImage : categorySchema.shape.secondaryImage.optional(),
            thirdImage: typeof window === "undefined" ? categorySchema.shape.thirdImage : categorySchema.shape.thirdImage.optional(),
        }) as any),
        defaultValues: {
            categoryName: "",
            slug: "",
            description: "",
            commonAdvantages: [""],
            primaryImage: null,
            secondaryImage: null,
            thirdImage: null,
            videoUrl: "",
            pdfUrl: "",
            order: 0,
            status: "active",
        }
    });

    const { fields: advantageFields, append: appendAdvantage, remove: removeAdvantage } = useFieldArray({
        control,
        // @ts-ignore
        name: "commonAdvantages" as never
    });

    // Auto-generate slug from category name
    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
        onChange(e);
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setValue("slug", slug, { shouldValidate: true });
    };

    const onSubmit = async (data: any) => {
        try {
            // Our mutation expects FormData when files are involved:
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                if (key === 'commonAdvantages') {
                    // Send array elements properly
                    data[key].forEach((adv: string) => {
                        if (adv.trim() !== '') formData.append('commonAdvantages[]', adv);
                    });
                } else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                    formData.append(key, String(data[key]));
                }
            });

            await createCategoryMutation.mutateAsync(formData as any);
            router.push("/categories");
        } catch (error) {
            console.error("Failed to create category:", error);
        }
    };

    return (
        <>
            <Header>
                <HeaderGroup className="gap-6">
                    <HeaderBackNavigation href="/categories" />
                    <HeaderGroup className="flex-col">
                        <HeaderTitle>Add New Category</HeaderTitle>
                        <HeaderDescription>Create a new category for your machines</HeaderDescription>
                    </HeaderGroup>
                </HeaderGroup>
                <HeaderGroup className="gap-2">
                    <Button type="reset" form="create-category-form" variant="outline" size="lg" className="cursor-pointer">Reset</Button>

                    <Button type="submit" form="create-category-form" size="lg" className="cursor-pointer">Create Category</Button>
                </HeaderGroup>
            </Header>


            <form onSubmit={handleSubmit(onSubmit)} id="create-category-form">
                {/* FORM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* LEFT COLUMN: Media & Visibility */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Media Card */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <Controller
                                            name="primaryImage"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <ImageUploader
                                                        className="h-64"
                                                        label="Primary Image *"
                                                        value={field.value as any}
                                                        onChange={field.onChange}
                                                    />
                                                    <FieldError errors={[errors.primaryImage as any]} />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Controller
                                            name="secondaryImage"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <ImageUploader
                                                        className="h-32"
                                                        label="Secondary *"
                                                        value={field.value as any}
                                                        onChange={field.onChange}
                                                    />
                                                    <FieldError errors={[errors.secondaryImage as any]} />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Controller
                                            name="thirdImage"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <ImageUploader
                                                        className="h-32"
                                                        label="Third Image *"
                                                        value={field.value as any}
                                                        onChange={field.onChange}
                                                    />
                                                    <FieldError errors={[errors.thirdImage as any]} />
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visibility Card */}
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>Visibility</CardTitle>
                                    <CardDescription>Toggle the visibility of this category on the website.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Field orientation="horizontal" className="flex items-center justify-between mt-2">
                                            <FieldLabel className="text-sm font-medium text-slate-700 cursor-pointer" htmlFor="status-toggle">
                                                Visible to customers
                                            </FieldLabel>
                                            <Switch
                                                id="status-toggle"
                                                checked={field.value === "active"}
                                                onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                                            />
                                        </Field>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Details */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Category Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Details</CardTitle>
                                <CardDescription>Key info to describe and identify your category.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Controller
                                        name="categoryName"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Category Name <span className="text-red-500">*</span></FieldLabel>
                                                <Input
                                                    placeholder="e.g. Industrial Mixers"
                                                    {...field}
                                                    onChange={(e) => handleCategoryNameChange(e, field.onChange)}
                                                />
                                                <FieldError errors={[errors.categoryName as any]} />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="slug"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Slug <span className="text-red-500">*</span></FieldLabel>
                                                <Input readOnly className="cursor-not-allowed" placeholder="e.g. industrial-mixers" {...field} />
                                                <FieldError errors={[errors.slug as any]} />
                                            </Field>
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Description <span className="text-red-500">*</span></FieldLabel>
                                            <Textarea placeholder="Write a comprehensive description about this category..." {...field} />
                                            <FieldError errors={[errors.description as any]} />
                                        </Field>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Common Advantages */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <CardTitle>Common Advantages <span className="text-red-500">*</span></CardTitle>
                                        <CardDescription>List the key benefits of machines in this category.</CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendAdvantage("")}
                                    >
                                        <Plus size={16} className="mr-1.5" /> Add Advantage
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Field>
                                    {advantageFields.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <GripVertical className="text-slate-400" size={16} />
                                            <div className="flex-1">
                                                <Controller
                                                    name={`commonAdvantages.${index}`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            placeholder={`Advantage ${index + 1}`}
                                                            className="bg-white"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                                {/* @ts-ignore */}
                                                <FieldError errors={[errors.commonAdvantages?.[index] as any]} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeAdvantage(index)}
                                                className="text-slate-400 hover:text-red-500 shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                    {/* @ts-ignore */}
                                    {errors.commonAdvantages && !Array.isArray(errors.commonAdvantages) && <FieldError errors={[errors.commonAdvantages as any]} />}
                                </Field>
                            </CardContent>
                        </Card>

                        {/* Media URLs & Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Media Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <Controller
                                        name="videoUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Video URL</FieldLabel>
                                                <Input placeholder="https://youtube.com/..." {...field} />
                                                <FieldError errors={[errors.videoUrl as any]} />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="pdfUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>PDF Brochure URL</FieldLabel>
                                                <Input placeholder="https://example.com/brochure.pdf" {...field} />
                                                <FieldError errors={[errors.pdfUrl as any]} />
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Display Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Controller
                                        name="order"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Sort Order</FieldLabel>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                                <p className="text-xs text-slate-500">
                                                    Determines the sequence in which categories appear. Lower numbers appear first.
                                                </p>
                                                <FieldError errors={[errors.order as any]} />
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
