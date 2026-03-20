import ManageMachine from "@/features/machines/components/ManageMachine"

type PageParams = {
    params: Promise<{
        slug: string,
        category: string
    }>
}



const Page = async ({ params }: PageParams) => {
    const { category, slug } = await params
    return (
        <ManageMachine category={category} slug={slug} />
    )
}

export default Page;