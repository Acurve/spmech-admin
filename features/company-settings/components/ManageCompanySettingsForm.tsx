"use client";

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

// UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/shared";
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import { SimpleLoader } from "@/components/loaders";
import { icons } from "@/constants/icons";

// Hooks and Data
import { manufacturerInfoSchema, ManufacturerInfo } from "@/features/company-settings/schema";
import { useUpdateManufacturerInfo } from "@/features/company-settings/hooks/useManufacturerInfo";

export default function ManageCompanySettingsForm({ companyData }: { companyData: ManufacturerInfo }) {
    const router = useRouter();
    const updateMutation = useUpdateManufacturerInfo();

    const { control, handleSubmit, formState: { errors, isDirty }, watch } = useForm<any>({
        resolver: zodResolver(manufacturerInfoSchema),
        defaultValues: {
            ...companyData,
            name: companyData.name || "",
            logoText: companyData.logoText || "",
            tagline: companyData.tagline || "",
            profileText: (companyData.profileText || []).length > 0 ? companyData.profileText : [""],
            contactDetails: {
                address: companyData.contactDetails?.address || "",
                email: companyData.contactDetails?.email || "",
                customerCareNo: companyData.contactDetails?.customerCareNo || "",
                mobileNo: companyData.contactDetails?.mobileNo || "",
            },
            stats: companyData.stats || [],
            timeline: companyData.timeline || [],
        }
    });

    const { fields: profileFields, append: appendProfile, remove: removeProfile } = useFieldArray({
        control,
        name: "profileText" as never,
    });

    const { fields: statsFields, append: appendStat, remove: removeStat } = useFieldArray({
        control,
        name: "stats",
    });

    const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
        control,
        name: "timeline",
    });

    const onSubmit = async (data: ManufacturerInfo) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            if (data.logoText) formData.append("logoText", data.logoText);
            if (data.tagline) formData.append("tagline", data.tagline);

            formData.append("contactDetails", JSON.stringify(data.contactDetails || {}));

            // Clean up empty profile strings
            const validProfileText = (data.profileText || []).filter((text: string) => typeof text === 'string' && text.trim() !== "");
            formData.append("profileText", JSON.stringify(validProfileText));

            formData.append("stats", JSON.stringify(data.stats || []));

            // Timeline mapping: The backend expects strict array brackets for multipart boundaries
            (data.timeline || []).forEach((item: ManufacturerInfo['timeline'][number], index: number) => {
                formData.append(`timeline[${index}][year]`, item.year);
                formData.append(`timeline[${index}][message]`, item.message);

                if (item.imageUrl instanceof File) {
                    formData.append(`timeline[${index}][imageUrl]`, item.imageUrl);
                } else if (typeof item.imageUrl === "string") {
                    formData.append(`timeline[${index}][imageUrl]`, item.imageUrl);
                }
            });

            await updateMutation.mutateAsync(formData);
        } catch (error) {
            console.error("Failed to update company settings:", error);
        }
    };

    return (
        <div className="w-full mx-auto relative h-full flex flex-col">
            <Header>
                <HeaderGroup className="gap-6">
                    <HeaderGroup className="flex-col">
                        <HeaderTitle>Company Settings</HeaderTitle>
                        <HeaderDescription>Manage public company details, history, and contact endpoints.</HeaderDescription>
                    </HeaderGroup>
                </HeaderGroup>
                <HeaderGroup className="gap-2">
                    <Button type="reset" variant="outline" size="lg" className="cursor-pointer" onClick={() => router.push('/')}>Cancel</Button>
                    <Button type="submit" form="company-settings-form" size="lg" className="cursor-pointer" disabled={updateMutation.isPending || !isDirty}>
                        {updateMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <SimpleLoader />
                                <span>Saving...</span>
                            </div>
                        ) : <span>Save Settings</span>}
                    </Button>
                </HeaderGroup>
            </Header>

            <div className="w-full mx-auto animate-in fade-in duration-500 overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} id="company-settings-form">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-20">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-5 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Identity</CardTitle>
                                    <CardDescription>Primary branding and introductory text.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Company Name <span className="text-red-500">*</span></FieldLabel>
                                                <Input placeholder="e.g. SP Mech" {...field} />
                                                <FieldError errors={[errors.name as any]} />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="logoText"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Logo Text</FieldLabel>
                                                <Input placeholder="e.g. SP/MECH" {...field} value={field.value || ""} />
                                                <FieldError errors={[errors.logoText as any]} />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="tagline"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Tagline</FieldLabel>
                                                <Textarea placeholder="Empowering manufacturing..." rows={3} {...field} value={field.value || ""} />
                                                <FieldError errors={[errors.tagline as any]} />
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Specifications</CardTitle>
                                    <CardDescription>Official channels displayed on the contact page.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="contactDetails.mobileNo"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Mobile Number</FieldLabel>
                                                    <Input placeholder="+91 99999..." {...field} value={field.value || ""} />
                                                    <FieldError errors={[(errors.contactDetails as any)?.mobileNo as any]} />
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="contactDetails.customerCareNo"
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Customer Care</FieldLabel>
                                                    <Input placeholder="1800-xxxx" {...field} value={field.value || ""} />
                                                    <FieldError errors={[(errors.contactDetails as any)?.customerCareNo as any]} />
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <Controller
                                        name="contactDetails.email"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Email Address</FieldLabel>
                                                <Input type="email" placeholder="contact@spmech.com" {...field} value={field.value || ""} />
                                                <FieldError errors={[(errors.contactDetails as any)?.email as any]} />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="contactDetails.address"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Physical Address</FieldLabel>
                                                <Textarea placeholder="Ind. Estate, Gujarat..." rows={4} {...field} value={field.value || ""} />
                                                <FieldError errors={[(errors.contactDetails as any)?.address as any]} />
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Company Stats</CardTitle>
                                            <CardDescription>Counters highlighting scope.</CardDescription>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ label: "", value: "", suffix: "" })}>
                                            <icons.plus size={16} className="mr-1" /> Add Stat
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {statsFields.map((item, index) => (
                                        <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 items-start">
                                            <div className="mt-2 text-slate-400"><GripVertical size={16} /></div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                                <div className="md:col-span-5">
                                                    <Controller
                                                        name={`stats.${index}.label`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input placeholder="Label (e.g. Staff)" className="bg-white text-sm" {...field} />
                                                        )}
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <Controller
                                                        name={`stats.${index}.value`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input placeholder="Value (e.g. 50)" className="bg-white text-sm" {...field} />
                                                        )}
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <Controller
                                                        name={`stats.${index}.suffix`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input placeholder="Suffix (e.g. +)" className="bg-white text-sm" {...field} />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(index)} className="text-slate-400 hover:text-red-500 mt-1 shrink-0">
                                                <icons.delete size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {statsFields.length === 0 && (
                                        <div className="text-center p-4 text-sm text-slate-500 bg-slate-50 border rounded-lg">No statistics added.</div>
                                    )}
                                    <FieldError errors={[errors.stats as any]} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-7 space-y-4">

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Profile Text</CardTitle>
                                            <CardDescription>Multi-paragraph description of the company.</CardDescription>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendProfile("")}>
                                            <icons.plus size={16} className="mr-1" /> Add Paragraph
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {profileFields.map((item, index) => (
                                        <div key={item.id} className="flex gap-3 relative">
                                            <div className="mt-2 text-slate-400"><GripVertical size={16} /></div>
                                            <div className="flex-1">
                                                <Controller
                                                    name={`profileText.${index}` as never}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Textarea placeholder={`Paragraph ${index + 1}...`} rows={3} {...field} />
                                                    )}
                                                />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeProfile(index)} className="text-slate-400 hover:text-red-500 mt-1 shrink-0">
                                                <icons.delete size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {profileFields.length === 0 && (
                                        <div className="text-center p-4 text-sm text-slate-500 border border-dashed rounded-lg">No profile content.</div>
                                    )}
                                    <FieldError errors={[errors.profileText as any]} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Company Timeline</CardTitle>
                                            <CardDescription>Historical milestones and journey.</CardDescription>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={() => appendTimeline({ year: "", message: "", imageUrl: "" })}>
                                            <icons.plus size={16} className="mr-1" /> Add Milestone
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {timelineFields.map((item, index) => (
                                        <div key={item.id} className="flex flex-col gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100 relative group">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeTimeline(index)}
                                                className="absolute -right-2 -top-2 h-7 w-7 rounded-full p-0 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <icons.delete size={14} />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                                <div className="md:col-span-3">
                                                    <Controller
                                                        name={`timeline.${index}.imageUrl`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Field>
                                                                <FieldLabel className="text-xs">Milestone Image <span className="text-red-500">*</span></FieldLabel>
                                                                <ImageUploader
                                                                    className="h-32 text-xs"
                                                                    label="Upload Image"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <FieldError errors={[(errors.timeline as any)?.[index]?.imageUrl as any]} />
                                                            </Field>
                                                        )}
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-4">
                                                    <Controller
                                                        name={`timeline.${index}.year`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Field>
                                                                <FieldLabel className="text-xs">Year <span className="text-red-500">*</span></FieldLabel>
                                                                <Input placeholder="e.g. 2005" className="bg-white font-medium" {...field} />
                                                                <FieldError errors={[(errors.timeline as any)?.[index]?.year as any]} />
                                                            </Field>
                                                        )}
                                                    />
                                                    <Controller
                                                        name={`timeline.${index}.message`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Field className="flex-1">
                                                                <FieldLabel className="text-xs">Event Description <span className="text-red-500">*</span></FieldLabel>
                                                                <Textarea placeholder="What happened?" className="bg-white" rows={3} {...field} />
                                                                <FieldError errors={[(errors.timeline as any)?.[index]?.message as any]} />
                                                            </Field>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {timelineFields.length === 0 && (
                                        <div className="text-center p-6 text-sm text-slate-500 border-2 border-dashed bg-slate-50/50 rounded-xl">
                                            No company milestones have been documented yet.
                                        </div>
                                    )}
                                    <FieldError errors={[errors.timeline as any]} />
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
