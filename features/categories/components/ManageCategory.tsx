"use client"

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, GripVertical, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Shared & Local
import { ImageUploader } from "@/components/shared";
import { categorySchema, type Category, type CategoryOutput } from "@/features/categories/schema";
import { useCategory, useUpdateCategory, useDeleteCategory } from "@/features/categories/hooks/useCategory";
import { Header, HeaderBackNavigation, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import { SimpleLoader } from "@/components/loaders";
import { icons } from "@/constants/icons";
import PageSkeleton from "@/components/loaders/PageSkeleton";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/upload";

const CategoryDangerZone = ({ categoryId, categoryName }: { categoryId: string; categoryName: string }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const deleteMutation = useDeleteCategory()
    const router = useRouter()

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(categoryId)
        router.push('/categories')
    }

    return (
        <Card className="border-destructive/20 bg-destructive/5 mt-8">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <icons.alertTriangle className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Irreversible actions for this category.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h4 className="font-semibold">Delete Category</h4>
                    <p className="text-sm text-muted-foreground">
                        All machines in this category will be deleted too. This action cannot be undone.
                    </p>
                </div>
                <Button variant="destructive" onClick={() => setIsDialogOpen(true)} type="button">
                    <icons.delete className="mr-2 h-4 w-4" />
                    Delete Category
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete the category <strong>{categoryName}</strong>.
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={deleteMutation.isPending}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                                {deleteMutation.isPending && <SimpleLoader className="mr-2" />}
                                Yes, delete category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

const ManageCategoryForm = ({ category }: { category: Category }) => {
    const router = useRouter();
    const updateCategoryMutation = useUpdateCategory();
    const [isUploading, setIsUploading] = useState(false);

    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<CategoryOutput>({
        resolver: zodResolver(categorySchema as any),
        defaultValues: {
            categoryName: category.categoryName || "",
            slug: category.slug || "",
            description: category.description || "",
            commonAdvantages: category.commonAdvantages?.length ? category.commonAdvantages : [""],
            order: category.order || 0,
            status: category.status || "active",
            videoUrl: category.videoUrl || "",
            pdfUrl: category.pdfUrl || "",
            primaryImage: category.primaryImage as any,
            secondaryImage: category.secondaryImage as any,
            thirdImage: category.thirdImage as any,
        }
    });

    const { fields: advantageFields, append: appendAdvantage, remove: removeAdvantage } = useFieldArray({
        control,
        name: "commonAdvantages" as never,
    });

    const isSubmitting = isUploading || updateCategoryMutation.isPending;

    const onSubmit = async (data: CategoryOutput) => {
        try {
            // 1. Collect image fields that are File uploads
            const imageFields = ["primaryImage", "secondaryImage", "thirdImage"] as const;
            const filesToUpload = imageFields
                .filter((key) => data[key as keyof CategoryOutput] instanceof File)
                .map((key) => ({ fieldName: key, file: data[key as keyof CategoryOutput] as unknown as File, folder: "categories" }));

            // 2. Upload new files via presigned URLs
            if (filesToUpload.length > 0) {
                setIsUploading(true);
                const uploadedUrls = await uploadFiles(
                    filesToUpload.map((f) => ({ file: f.file, folder: f.folder })),
                );
                filesToUpload.forEach((f, i) => {
                    (data as any)[f.fieldName] = uploadedUrls[i];
                });
                setIsUploading(false);
            }

            // 3. Build clean JSON payload
            const payload = {
                categoryName: data.categoryName,
                slug: data.slug,
                description: data.description,
                commonAdvantages: data.commonAdvantages.filter((adv) => adv.trim() !== ""),
                order: data.order,
                status: data.status,
                videoUrl: data.videoUrl || "",
                pdfUrl: data.pdfUrl || "",
                primaryImage: typeof data.primaryImage === "string" ? data.primaryImage : undefined,
                secondaryImage: typeof data.secondaryImage === "string" ? data.secondaryImage : undefined,
                thirdImage: typeof data.thirdImage === "string" ? data.thirdImage : undefined,
            };

            await updateCategoryMutation.mutateAsync({ id: category._id as string, updates: payload as any });
            toast.success("Success", {
                description: "Category updated successfully",
                cancel: {
                    label: "Dismiss",
                    onClick: () => toast.dismiss(),
                },
            });
            router.push("/categories");
        } catch (error) {
            setIsUploading(false);
            console.error("Failed to update category:", error);
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Failed to update category",
                cancel: {
                    label: "Dismiss",
                    onClick: () => toast.dismiss(),
                },
            });
        }
    };


    return (
        <>
            <Header>
                <HeaderGroup className="gap-6">
                    <HeaderBackNavigation href="/categories" />
                    <HeaderGroup className="flex-col">
                        <HeaderTitle>Manage Category</HeaderTitle>
                        <HeaderDescription>Manage details and settings for this category</HeaderDescription>
                    </HeaderGroup>
                </HeaderGroup>
                <HeaderGroup className="gap-2 ml-auto">
                    <Button type="button" variant="outline" size="lg" className="cursor-pointer" onClick={() => router.push('/categories')} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" form="update-category-form" size="lg" className="cursor-pointer" disabled={isSubmitting || !isDirty}>
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                <span>Uploading Images...</span>
                            </div>
                        ) : updateCategoryMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                <span>Saving...</span>
                            </div>
                        ) : <span>Save Changes</span>}
                    </Button>
                </HeaderGroup>
            </Header>

            <div className="w-full mx-auto animate-in fade-in duration-500">
                <form onSubmit={handleSubmit(onSubmit)} id="update-category-form">
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
                                                            label="Primary Cover *"
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
                                                    <Input placeholder="e.g. industrial-mixers" {...field} readOnly className="cursor-not-allowed text-muted-foreground" />
                                                    <p className="text-xs text-slate-500">Slug cannot be changed after creation to preserve URLs.</p>
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
                <CategoryDangerZone categoryId={category._id as string} categoryName={category.categoryName} />
            </div>
        </>
    )
}

const ManageCategory = ({ categorySlug }: { categorySlug: string }) => {
    const { data: response, isLoading, error } = useCategory(categorySlug)

    if (isLoading) return <PageSkeleton />
    if (error) return <div className="p-8 text-center text-destructive">Error loading category details.</div>

    const category = response?.data
    if (!category) return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
            <h2 className="text-2xl font-bold mb-2">Category not found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find the category with slug: {categorySlug}</p>
            <Button asChild variant="outline">
                <Link href="/categories"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Categories</Link>
            </Button>
        </div>
    )

    return <ManageCategoryForm category={category} />
}

export default ManageCategory
