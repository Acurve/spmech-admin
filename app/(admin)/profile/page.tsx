"use client";

import { useUser } from "@/features/auth/hooks/useUser";
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import PageSkeleton from "@/components/loaders/PageSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Clock, CalendarDays, Activity } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserSchemaType } from "@/features/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
    const { data: response, isLoading, isError } = useUser();

    if (isLoading) return <PageSkeleton />;

    if (isError || !response?.data?.user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-2">Profile Error</h2>
                <p className="text-muted-foreground mb-6">Could not load user authentication details.</p>
            </div>
        );
    }

    const user = response.data.user;

    const initials = user.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
        : "CN";

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            });
        } catch {
            return "Unknown date";
        }
    };


    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            password: ""
        }
    })

    const submit = (data: UpdateUserSchemaType) => {
        api.put(`/auth/${user._id}`, data).then((res) => {
            setShowPasswordForm(false);
        }).catch((err) => {
        })
    }

    return (
        <div className="w-full mx-auto relative h-full flex flex-col">
            <Header>
                <HeaderGroup className="flex-col">
                    <HeaderTitle>My Profile</HeaderTitle>
                    <HeaderDescription>Manage your account settings and view active session details.</HeaderDescription>
                </HeaderGroup>
            </Header>

            <div className="w-full mx-auto animate-in fade-in duration-500 overflow-y-auto pt-6 px-1">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">

                    {/* ID & Avatar Display Card */}
                    <div className="md:col-span-4 space-y-6">
                        <Card className="text-center overflow-hidden border-orange-100 shadow-sm relative">
                            <div className="h-24 bg-linear-to-r from-orange-400 to-orange-500 absolute top-0 w-full z-0 opacity-20"></div>
                            <CardContent className="pt-10 pb-8 relative z-10 flex flex-col items-center">
                                <Avatar className="h-28 w-28 border-4 border-white shadow-md mb-4">
                                    <AvatarImage src={user.avatar || ""} />
                                    <AvatarFallback className="text-3xl bg-orange-100 text-orange-700 font-bold">{initials}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">@{user.username}</p>

                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-1">
                                    <Shield className="w-3 h-3 mr-1 inline" />
                                    <span className="uppercase tracking-wider text-[10px] font-bold">{user.role}</span>
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Information Map Card */}
                    <div className="md:col-span-8 space-y-6">
                        <Card>
                            <CardHeader className="pb-4 border-b border-slate-100">
                                <CardTitle className="text-lg">Account Information</CardTitle>
                                <CardDescription>Technical details strictly associated with this active session.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    <div className="flex items-center p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Email Address</p>
                                            <p className="text-sm font-medium text-slate-900">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Account Status</p>
                                            <p className="text-sm font-medium text-slate-900 flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                                <span className="capitalize">{user.status}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Last Login Session</p>
                                            <p className="text-sm font-medium text-slate-900">{formatDate(user.lastLogin)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                                            <CalendarDays className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Date Joined</p>
                                            <p className="text-sm font-medium text-slate-900">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                                            <CalendarDays className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Password</p>
                                            <p className="text-sm font-medium text-slate-900">********</p>
                                            <Button onClick={() => setShowPasswordForm(true)}>Edit</Button>
                                            {
                                                showPasswordForm && (
                                                    <form onSubmit={handleSubmit(submit)} className="absolute inset-0 hidden z-10 bg-white">
                                                        <Controller
                                                            name="password"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    type="password"
                                                                    placeholder="Enter new password"
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        />
                                                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                                                        <Button type="submit">Update Password</Button>
                                                    </form>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
