"use client"

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, GripVertical, X, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/shared";
import { Header, HeaderBackNavigation, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";

// Hooks and Data
import { useCategories, useCategory } from "@/features/categories/hooks/useCategory";
import { type MachineResponse, machineSchema } from "@/features/machines/schema";
import { useUpdateMachine, useDeleteMachine, useMachineKeys, useMachine } from "@/features/machines/hooks/useMachine";
import { icons } from "@/constants/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageSkeleton from "@/components/loaders/PageSkeleton";
import { SimpleLoader } from "@/components/loaders";

// Helper component for nested specifications
const NestedSpecArray = ({ control, specIndex, watch }: { control: any; specIndex: number, watch: any }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `specifications.${specIndex}.value` as never,
    });

    return (
        <div className="pl-4 ml-2 border-l-2 border-slate-200 mt-3 space-y-3">
            {fields.map((subField, subIndex) => (
                <div key={subField.id} className="flex items-start gap-3">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <Controller
                            name={`specifications.${specIndex}.value.${subIndex}.subKey` as const}
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Sub-key (e.g. X-Axis)" className="bg-white" {...field} />
                            )}
                        />
                        <Controller
                            name={`specifications.${specIndex}.value.${subIndex}.subValue` as const}
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Sub-value (e.g. 500mm)" className="bg-white" {...field} />
                            )}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(subIndex)}
                        className="text-slate-400 hover:text-red-500 shrink-0"
                    >
                        <icons.delete size={16} />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ subKey: "", subValue: "" })}
                className="mt-2 text-xs"
            >
                <icons.plus size={14} className="mr-1" /> Add Sub-Item
            </Button>
        </div>
    );
};

const MachineDangerZone = ({ machineId, machineName }: { machineId: string; machineName: string }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const deleteMutation = useDeleteMachine()
    const router = useRouter()

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(machineId);
            router.push('/machines');
        } catch (error) {
            console.error('Failed to delete machine:', error);
        }
    };

    return (
        <Card className="border-destructive/20 bg-destructive/5 mt-8">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <icons.alertTriangle className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Irreversible actions for this machine.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-sm text-slate-600 font-medium">Delete "{machineName}" securely.</span>
                <Button variant="destructive" onClick={() => setIsDialogOpen(true)} type="button">
                    <icons.delete className="mr-2 h-4 w-4" />
                    Delete Machine
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This will permanently delete the machine <strong>{machineName}</strong>.
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={deleteMutation.isPending}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                                {deleteMutation.isPending && <SimpleLoader className="mr-2" />}
                                Yes, delete machine
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

type ManageMachineProps = {
    slug: string,
    category: string
}
export default function ManageMachine({ slug, category }: ManageMachineProps) {
    const {
        isError: isCategoryError,
        isLoading: categoryLoading } = useCategory(category)
    const {
        data,
        isError: isMachineError,
        isLoading: machineLoading } = useMachine(slug)

    const isLoading = machineLoading || categoryLoading
    const isError = isMachineError || isCategoryError
    if (isLoading) return <PageSkeleton />
    if (isError) {
        return (
            <div>not found</div>
        )
    }
    const machine = data.data
    return (
        <ManageMachineForm machine={machine} />
    )
}
export function ManageMachineForm({ machine }: { machine: MachineResponse }) {
    const router = useRouter();
    const updateMachineMutation = useUpdateMachine();

    const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();
    const categories = categoriesResponse?.data?.data || [];

    const { data: keysResponse, isLoading: keysLoading } = useMachineKeys();
    const predefinedSpecKeys: string[] = keysResponse?.data?.specifications || [];
    const predefinedFeatKeys: string[] = keysResponse?.data?.featureDescriptions || [];


    // Track which items are actively using the "Other" custom input field
    const [customSpecKeys, setCustomSpecKeys] = useState<Record<number, boolean>>({});
    const [customFeatKeys, setCustomFeatKeys] = useState<Record<number, boolean>>({});

    const specificationObjectToArray = Object.entries(machine.specifications).map(([key, value]) => ({ key, value: typeof value === "string" ? value : Object.entries(value).map(([subKey, subValue]) => ({ subKey, subValue })) }))

    useEffect(() => {
        if (!keysLoading && predefinedSpecKeys.length > 0 && machine?.specifications) {
            const initialCustomSpecs: Record<number, boolean> = {};
            specificationObjectToArray.forEach((spec: any, index: number) => {
                if (spec.key && !predefinedSpecKeys.includes(spec.key)) {
                    initialCustomSpecs[index] = true;
                }
            });
            setCustomSpecKeys(initialCustomSpecs);
        }
    }, [keysLoading, predefinedSpecKeys, machine]);

    const featureDescriptionsObjectToArray = machine.featureDescriptions ? Object.entries(machine.featureDescriptions).map(([key, value]) => ({ key, value })) : []

    useEffect(() => {
        // if (!featureDescriptionsObjectToArray.length) return
        if (!keysLoading && predefinedFeatKeys.length > 0 && machine?.featureDescriptions) {
            const initialCustomFeats: Record<number, boolean> = {};
            featureDescriptionsObjectToArray.forEach((feat: any, index: number) => {
                if (feat.key && !predefinedFeatKeys.includes(feat.key)) {
                    initialCustomFeats[index] = true;
                }
            });
            setCustomFeatKeys(initialCustomFeats);
        }
    }, [keysLoading, predefinedFeatKeys, machine]);

    const formatKeyForDisplay = (key: string) => {
        if (!key) return "";
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatKeyForBackend = (key: string) => {
        if (!key) return "";
        return key.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    };


    const { control, handleSubmit, formState: { errors, isDirty }, watch } = useForm<any>({
        resolver: zodResolver(machineSchema),
        defaultValues: {
            ...machine,
            categoryId: typeof machine.categoryId === 'string' ? machine.categoryId : (machine.categoryId?._id || ""),
            specifications: (specificationObjectToArray).map((spec: any) => {
                if (typeof spec.value === 'object' && spec.value !== null && !Array.isArray(spec.value)) {
                    return {
                        key: spec.key,
                        value: Object.entries(spec.value).map(([subKey, subValue]) => ({ subKey, subValue }))
                    };
                }
                return spec;
            }),
            featureDescriptions: (featureDescriptionsObjectToArray).map((feat: any) => {
                return feat;
            }),
            image1: machine.image1 || null,
            image2: machine.image2 || null,
            image3: machine.image3 || null,
            outlineImage: machine.outlineImage || null,
        }
    });

    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
        control,
        name: "specifications" as never,
    });

    const { fields: featFields, append: appendFeat, remove: removeFeat } = useFieldArray({
        control,
        name: "featureDescriptions" as never,
    });

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            const formattedSpecs = Object.fromEntries(
                data.specifications!.map(({ key, value }: { key: string, value: any }) => [key, typeof value === "string" ? value : Object.fromEntries(value.map(({ subKey, subValue }: { subKey: string, subValue: string }) => [subKey, subValue]))]))


            if (data.featureDescriptions) {

                const formattedFeats = Object.fromEntries(
                    data.featureDescriptions.map(({ key, value }: { key: string, value: any }) => [key, value]))
                formData.append("featureDescriptions", JSON.stringify(formattedFeats));
            }

            // Append text fields
            formData.append("modelName", data.modelName);
            formData.append("slug", data.slug);
            formData.append("categoryId", data.categoryId);
            formData.append("description", data.description);
            formData.append("order", (data.order || 0).toString());
            formData.append("status", data.status);
            formData.append("videoUrl", data.videoUrl || "");

            // Stringify JSON fields
            formData.append("specifications", JSON.stringify(formattedSpecs));

            // Append images ONLY if they are File instances, otherwise they remain string URLs handled by backend maybe?
            // Actually, if backend allows string URLs for unedited files, we can just append them.
            if (data.image1 instanceof File) formData.append("image1", data.image1);
            else if (typeof data.image1 === 'string') formData.append("image1", data.image1);

            if (data.image2 instanceof File) formData.append("image2", data.image2);
            else if (typeof data.image2 === 'string') formData.append("image2", data.image2);

            if (data.image3 instanceof File) formData.append("image3", data.image3);
            else if (typeof data.image3 === 'string') formData.append("image3", data.image3);

            if (data.outlineImage instanceof File) formData.append("outlineImage", data.outlineImage);
            else if (typeof data.outlineImage === 'string') formData.append("outlineImage", data.outlineImage);

            await updateMachineMutation.mutateAsync({ id: machine._id!, updates: formData as any });
            router.push("/machines");
        } catch (error) {
            console.error("Failed to update machine:", error);
        }
    };



    return (
        <div className="w-full mx-auto relative h-full flex flex-col">
            <Header>
                <HeaderGroup className="gap-6">
                    <HeaderBackNavigation href="/machines" />
                    <HeaderGroup className="flex-col">
                        <HeaderTitle>Manage Machine</HeaderTitle>
                        <HeaderDescription>Edit details for {machine?.modelName}</HeaderDescription>
                    </HeaderGroup>
                </HeaderGroup>
                <HeaderGroup className="gap-2 ml-auto">
                    <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => router.push('/machines')}>Cancel</Button>
                    <Button type="submit" form="manage-machine-form" size="lg" className="cursor-pointer" disabled={updateMachineMutation.isPending || !isDirty}>
                        {updateMachineMutation.isPending ?
                            <div className="flex items-center gap-2">
                                <SimpleLoader />
                                <span>Saving...</span>
                            </div>
                            : <span>Save Changes</span>}
                    </Button>
                </HeaderGroup>
            </Header>

            <div className="w-full mx-auto animate-in fade-in duration-500 overflow-y-auto pt-6 px-1">
                <form onSubmit={handleSubmit(onSubmit)} id="manage-machine-form">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
                        {/* LEFT COLUMN: Media & Visibility */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Machine Images</CardTitle>
                                    <CardDescription>Upload up to 3 gallery images and 1 outline image.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1">
                                            <Controller
                                                name="image1"
                                                control={control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <ImageUploader
                                                            className="h-48"
                                                            label="Primary Image *"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                        <FieldError errors={[errors.image1 as any]} />
                                                    </Field>
                                                )}
                                            />
                                        </div>

                                        <Controller
                                            name="image2"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <ImageUploader
                                                        className="h-32"
                                                        label="Image 2"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                    <FieldError errors={[errors.image2 as any]} />
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="image3"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <ImageUploader
                                                        className="h-32"
                                                        label="Image 3"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                    <FieldError errors={[errors.image3 as any]} />
                                                </Field>
                                            )}
                                        />

                                        <div className="col-span-2 mt-2">
                                            <Controller
                                                name="outlineImage"
                                                control={control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <ImageUploader
                                                            className="h-40 border-dashed border-slate-300"
                                                            label="Outline Drawing *"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                        <FieldError errors={[errors.outlineImage as any]} />
                                                    </Field>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div>
                                        <CardTitle>Visibility</CardTitle>
                                        <CardDescription>Toggle the visibility of this machine on the website.</CardDescription>
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
                        <div className="lg:col-span-8 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Machine Details</CardTitle>
                                    <CardDescription>Key info to describe and organize this machine.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Controller
                                            name="modelName"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Model Name <span className="text-red-500">*</span></FieldLabel>
                                                    <Input placeholder="e.g. SP-5000" {...field} />
                                                    <FieldError errors={[errors.modelName as any]} />
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="slug"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Slug</FieldLabel>
                                                    <Input placeholder="auto-generated-slug" readOnly className="cursor-not-allowed text-muted-foreground bg-slate-50" {...field} />
                                                    <FieldError errors={[errors.slug as any]} />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <Controller
                                            name="categoryId"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Category <span className="text-red-500">*</span></FieldLabel>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((cat: any) => (
                                                                <SelectItem key={cat._id} value={cat._id}>
                                                                    {cat.categoryName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FieldError errors={[errors.categoryId as any]} />
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
                                                <Textarea placeholder="Write a comprehensive description about this machine..." rows={5} {...field} />
                                                <FieldError errors={[errors.description as any]} />
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Specifications */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <CardTitle>Specifications</CardTitle>
                                            <CardDescription>Technical details for this machine.</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => appendSpec({ key: "", value: "" })}
                                            >
                                                <Plus size={16} className="mr-1.5" /> Simple Spec
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="bg-slate-50 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                                                onClick={() => appendSpec({ key: "", value: [{ subKey: "", subValue: "" }] })}
                                            >
                                                <Plus size={16} className="mr-1.5" /> Nested Spec
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {specFields.map((item, index) => {
                                        const specValue = watch(`specifications.${index}.value`);
                                        const isNested = Array.isArray(specValue);

                                        return (
                                            <div key={item.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-2 text-slate-400">
                                                        <GripVertical size={16} />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        {/* Top level Key and Value */}
                                                        <div className="flex gap-3 items-start">
                                                            <div className="flex-1">
                                                                <Controller
                                                                    name={`specifications.${index}.key`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Field>
                                                                            {!isNested ? (
                                                                                customSpecKeys[index] ? (
                                                                                    <div className="flex gap-2">
                                                                                        <Input placeholder="Custom Spec Name" className="font-medium bg-white" {...field} />
                                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                                                                            setCustomSpecKeys(prev => ({ ...prev, [index]: false }));
                                                                                            field.onChange("");
                                                                                        }} className="shrink-0"><X size={16} /></Button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <Select
                                                                                        value={field.value}
                                                                                        onValueChange={(val) => {
                                                                                            if (val === 'other') {
                                                                                                setCustomSpecKeys(prev => ({ ...prev, [index]: true }));
                                                                                                field.onChange(formatKeyForBackend("")); // Init empty
                                                                                            } else {
                                                                                                field.onChange(val);
                                                                                            }
                                                                                        }}
                                                                                        disabled={keysLoading}
                                                                                    >
                                                                                        <SelectTrigger className="font-medium bg-white uppercase">
                                                                                            <SelectValue placeholder="Select specification" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {predefinedSpecKeys.map(k => (
                                                                                                <SelectItem
                                                                                                    className="uppercase" key={k} value={k}>{formatKeyForDisplay(k)}</SelectItem>
                                                                                            ))}
                                                                                            <SelectItem value="other" className="font-medium text-primary uppercase">Other (Custom)</SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                )
                                                                            ) : (
                                                                                <Input placeholder="Spec Name (e.g. Dimensions)" className="font-medium bg-white" {...field} />
                                                                            )}
                                                                        </Field>
                                                                    )}
                                                                />
                                                            </div>

                                                            {!isNested && (
                                                                <div className="flex-1">
                                                                    <Controller
                                                                        name={`specifications.${index}.value` as const}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input placeholder="Spec Value (e.g. 1500mm)" className="bg-white" {...field} />
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Nested values array */}
                                                        {isNested && (
                                                            <NestedSpecArray control={control} specIndex={index} watch={watch} />
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            removeSpec(index);
                                                            setCustomSpecKeys(prev => {
                                                                const newObj = { ...prev };
                                                                delete newObj[index];
                                                                return newObj;
                                                            });
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 shrink-0 mt-1"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {specFields.length === 0 && (
                                        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
                                            No specifications added yet. Click above to add some!
                                        </div>
                                    )}
                                    <FieldError errors={[errors.specifications as any]} />
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <CardTitle>Features <span className="text-muted-foreground font-normal text-sm font-sans">(Optional)</span></CardTitle>
                                            <CardDescription>Highlight specific functionalities or features.</CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendFeat({ key: "", value: "" })}
                                        >
                                            <Plus size={16} className="mr-1.5" /> Add Feature
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {featFields.map((item, index) => (
                                        <div key={item.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="mt-2 text-slate-400">
                                                <GripVertical size={16} />
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                <Controller
                                                    name={`featureDescriptions.${index}.key`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Field>
                                                            {customFeatKeys[index] ? (
                                                                <div className="flex gap-2">
                                                                    <Input placeholder="Custom Feature Name" className="font-medium bg-white" {...field} />
                                                                    <Button type="button" variant="ghost" size="icon" onClick={() => {
                                                                        setCustomFeatKeys(prev => ({ ...prev, [index]: false }));
                                                                        field.onChange("");
                                                                    }} className="shrink-0"><X size={16} /></Button>
                                                                </div>
                                                            ) : (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={(val) => {
                                                                        if (val === 'other') {
                                                                            setCustomFeatKeys(prev => ({ ...prev, [index]: true }));
                                                                            field.onChange(formatKeyForBackend(""));
                                                                        } else {
                                                                            field.onChange(val);
                                                                        }
                                                                    }}
                                                                    disabled={keysLoading}
                                                                >
                                                                    <SelectTrigger className="font-medium bg-white">
                                                                        <SelectValue placeholder="Select feature type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {predefinedFeatKeys.map(k => (
                                                                            <SelectItem key={k} value={k}>{formatKeyForDisplay(k)}</SelectItem>
                                                                        ))}
                                                                        <SelectItem value="other" className="font-medium text-primary">Other (Custom)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                    )}
                                                />
                                                <Controller
                                                    name={`featureDescriptions.${index}.value` as const}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input placeholder="Feature Details" className="bg-white" {...field} />
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    removeFeat(index);
                                                    setCustomFeatKeys(prev => {
                                                        const newObj = { ...prev };
                                                        delete newObj[index];
                                                        return newObj;
                                                    });
                                                }}
                                                className="text-slate-400 hover:text-red-500 shrink-0 mt-1"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                    {featFields.length === 0 && (
                                        <div className="text-center p-4 border rounded-lg text-slate-500 text-sm bg-slate-50/50">
                                            No features added.
                                        </div>
                                    )}
                                    <FieldError errors={[errors.featureDescriptions as any]} />
                                </CardContent>
                            </Card>

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
                                                    <FieldLabel>Video URL <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FieldLabel>
                                                    <Input placeholder="https://youtube.com/..." {...field} />
                                                    <FieldError errors={[errors.videoUrl as any]} />
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
                                                        Determines the sequence in which machines appear.
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

                <MachineDangerZone machineId={machine._id!} machineName={machine.modelName} />

            </div>
        </div>
    );
}