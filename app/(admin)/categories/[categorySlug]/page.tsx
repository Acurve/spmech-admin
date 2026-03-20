import ManageCategory from "@/features/categories/components/ManageCategory"


type PageParams = {
    params: Promise<{
        categorySlug: string
    }>
}

const CategoryDetailsPage = async ({ params }: PageParams) => {
    const { categorySlug } = await params
    return (
        <ManageCategory categorySlug={categorySlug} />
    )
}

export default CategoryDetailsPage