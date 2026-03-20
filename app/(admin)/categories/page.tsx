"use client";


import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";
import { useCategories } from "@/features/categories/hooks/useCategory";
import { Card } from "@/components/ui/card";
import { AlertCircle, Plus } from "lucide-react";
import { type CategoryOutput } from "@/features/categories";
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import { LinkTag } from "@/components/shared";
import PageSkeleton from "@/components/loaders/PageSkeleton";

export default function CategoriesPage() {
    const { data, isLoading } = useCategories();
    if (isLoading) return <PageSkeleton />
    const categoryList = data.data.data

    return (
        <div>
            <Header>
                <HeaderGroup className="flex-col">
                    <HeaderTitle>Categories Library</HeaderTitle>
                    <HeaderDescription>Manage, add, and organize your complete categories.</HeaderDescription>
                </HeaderGroup>
                <LinkTag href={"/categories/add"} variant="button-brand" className="flex bg-primary text-white gap-2 items-center rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Category</span>
                </LinkTag>
            </Header>

            {categoryList.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="size-12 text-muted-foreground mb-4 opacity-20" />
                    <h2 className="text-xl font-medium">No categories found</h2>
                    <p className="text-muted-foreground mb-6">Create your first category to get started.</p>
                    <Link href="/categories/add">Create First Category</Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoryList.map((category: CategoryOutput) => (
                        <ProductCard
                            key={category._id}
                            href={`/categories/${category.slug}`}
                            imageSrc={category.primaryImage}
                            name={category.categoryName}
                            description={category.description}
                            id={category.slug.split("-")[0]}
                            linkText="View Category"
                        />
                    ))}
                </div>
            )}


        </div>
    );
}
