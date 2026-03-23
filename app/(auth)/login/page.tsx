"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { authApi, loginSchema, type LoginSchemaType } from "@/features/auth";
import { SimpleLoader } from "@/components/loaders";
import { toast } from "sonner";

export default function LoginPage() {
    // router is no longer needed since we use window.location.href for a hard redirect
    const router = useRouter()
    const [error, setError] = useState("");
    const [globalLoading, setGlobalLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginSchemaType) => {

        setError("");

        authApi.login(data)
            .then(() => {
                setGlobalLoading(true);
                toast.success("Success",
                    {
                        description: "Logged in successfully",
                        cancel: {
                            label: "Dismiss",
                            onClick: () => toast.dismiss()
                        },
                    });
            })
            .then(() => router.push("/"))
            .catch(err => {
                toast.error("Error",
                    {
                        description: "Failed to login",
                        cancel: {
                            label: "Dismiss",
                            onClick: () => toast.dismiss()
                        },
                    });
                setError(err.response?.data?.message || "Invalid credentials. Please try again.")

            })
            .finally(() => setGlobalLoading(false))





    };

    return (

        <>
            {globalLoading && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center gap-4">
                        <SimpleLoader className="h-12 w-12 animate-spin text-primary" />
                    </div>
                </div>
            )}
            <div className="min-h-screen flex items-center justify-center">

                <Card className="w-full max-w-md p-8 shadow-lg border-slate-200">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <CardTitle className="text-3xl font-bold tracking-tight">SP Mech Admin</CardTitle>
                        <CardDescription className="text-black">
                            Enter your credentials to access the panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <Field data-invalid={!!errors.username}>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="admin"
                                            {...field}
                                        />
                                        <FieldError errors={[errors.username]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Field data-invalid={!!errors.password}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                        <FieldError errors={[errors.password]} />
                                    </Field>
                                )}
                            />

                            {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="checkbox"
                                    id="show-password"
                                    className="rounded border-slate-300 w-4 h-4 text-primary accent-orange-600 checked:bg-primary cursor-pointer"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                />
                                <label htmlFor="show-password" className="text-sm text-slate-600 cursor-pointer select-none">
                                    Show Password
                                </label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={isSubmitting || globalLoading}
                            >
                                {isSubmitting ? <SimpleLoader className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}