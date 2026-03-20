import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LinkTag } from "./LinkTag"


type ProductCardProps = {
    imageSrc: string,
    name: string,
    description?: string,
    href: string,
    id?: string,
    linkText?: string
}
export default function ProductCard({ imageSrc, name, description, href, id, linkText = "view" }: ProductCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
            {/* <div className="absolute inset-0 z-30 aspect-video bg-black/35" /> */}
            <img
                src={imageSrc}
                alt={name}
                className="relative z-20 aspect-video w-full object-contain bg-border"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">{id}</Badge>
                </CardAction>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {`${description?.slice(0, 50)}...`}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <LinkTag href={href} variant="button-outline" className="w-full rounded-xl">{linkText}</LinkTag>
            </CardFooter>
        </Card>
    )
}
