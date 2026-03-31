"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/shared";
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import { SimpleLoader } from "@/components/loaders";
import { icons } from "@/constants/icons";

// Hooks and Data
import { Clients, updateClientsSchema } from "@/features/clients/schema";
import { useUpdateClients } from "@/features/clients/hooks/useClients";
import { toast } from "sonner";

export default function ManageClientsForm({ clientsData }: { clientsData: Clients }) {
    const router = useRouter();
    const updateMutation = useUpdateClients();

    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<any>({
        resolver: zodResolver(updateClientsSchema),
        defaultValues: {
            clients: clientsData.clients || [],
        }
    });

    const { fields: clientFields, append: appendClient, remove: removeClient } = useFieldArray({
        control,
        name: "clients",
    });

    const onSubmit = async (data: Clients) => {
        try {
            const formData = new FormData();

            (data.clients || []).forEach((item: Clients['clients'][number], index: number) => {
                if (item.websiteUrl) {
                    formData.append(`clients[${index}][websiteUrl]`, item.websiteUrl);
                }
                else {
                    formData.append(`clients[${index}][websiteUrl]`, "");
                }

                if (item.imageUrl instanceof File) {
                    formData.append(`clients[${index}][imageUrl]`, item.imageUrl);
                } else if (typeof item.imageUrl === "string") {
                    formData.append(`clients[${index}][imageUrl]`, item.imageUrl);
                }
            });

            await updateMutation.mutateAsync(formData);
            toast.success("Success", {
                description: "Clients updated successfully",
                cancel: {
                    label: "Dismiss",
                    onClick: () => toast.dismiss()
                },
            });
        } catch (error) {
            console.error("Failed to update clients:", error);
            toast.error("Error", {
                description: "Failed to update clients",
                cancel: {
                    label: "Dismiss",
                    onClick: () => toast.dismiss()
                },
            });
        }
    };

    return (
        <div className="w-full mx-auto relative h-full flex flex-col">
            <Header>
                <HeaderGroup className="gap-6">
                    <HeaderGroup className="flex-col">
                        <HeaderTitle>Manage Clients</HeaderTitle>
                        <HeaderDescription>Add, update, and manage your partnered companies and clients.</HeaderDescription>
                    </HeaderGroup>
                </HeaderGroup>
                <HeaderGroup className="gap-2 ml-auto">
                    <Button type="reset" variant="outline" size="lg" className="cursor-pointer" onClick={() => router.push('/')}>Cancel</Button>
                    <Button type="submit" form="clients-form" size="lg" className="cursor-pointer" disabled={updateMutation.isPending || !isDirty}>
                        {updateMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <SimpleLoader />
                                <span>Saving...</span>
                            </div>
                        ) : <span>Save Changes</span>}
                    </Button>
                </HeaderGroup>
            </Header>

            <div className="w-full mx-auto animate-in fade-in duration-500 overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} id="clients-form">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-20">
                        <div className="lg:col-span-8 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Partnered Clients</CardTitle>
                                            <CardDescription>Upload client logos and provide their website links.</CardDescription>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendClient({ websiteUrl: "", imageUrl: "" })}>
                                            <icons.plus size={16} className="mr-1" /> Add Client
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {clientFields.map((item, index) => (
                                        <div key={item.id} className="flex flex-col gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100 relative group">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeClient(index)}
                                                className="absolute -right-2 -top-2 h-7 w-7 rounded-full p-0 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <icons.delete size={14} />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                                <div className="md:col-span-3">
                                                    <Controller
                                                        name={`clients.${index}.imageUrl`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Field>
                                                                <FieldLabel className="text-xs">Client Logo <span className="text-red-500">*</span></FieldLabel>
                                                                <ImageUploader
                                                                    className="h-32 text-xs"
                                                                    label="Upload Logo"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <FieldError errors={[(errors.clients as any)?.[index]?.imageUrl as any]} />
                                                            </Field>
                                                        )}
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-4 flex flex-col justify-center">
                                                    <Controller
                                                        name={`clients.${index}.websiteUrl`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Field>
                                                                <FieldLabel className="text-xs">Website URL</FieldLabel>
                                                                <Input placeholder="https://..." className="bg-white font-medium" {...field} />
                                                                <FieldError errors={[(errors.clients as any)?.[index]?.websiteUrl as any]} />
                                                            </Field>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {clientFields.length === 0 && (
                                        <div className="text-center p-6 text-sm text-slate-500 border-2 border-dashed bg-slate-50/50 rounded-xl">
                                            No clients have been added yet.
                                        </div>
                                    )}
                                    <FieldError errors={[errors.clients as any]} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
