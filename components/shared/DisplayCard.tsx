import { ReactNode } from "react";
import { Text } from "../typography/Text";
import { Card, CardContent } from "../ui/card";

type DisplayCardProps = {
    title: string;
    value: string | ReactNode;
    icon: React.ReactNode;
}
export const DisplayCard = ({ title, value, icon, }: DisplayCardProps) => (
    <Card className="hover:border-[#F5842A]/30 transition-colors rounded-2xl">
        <CardContent className="p-6 flex items-start justify-between">
            <div className="space-y-2">
                <Text as="p" size="sm" className="text-slate-500">{title}</Text>
                <Text as="h3" size="xl" className="font-bold text-slate-800">{value}</Text>

            </div>
            <div className="p-3 bg-[#F5842A]/10 text-[#F5842A] rounded-xl flex items-center justify-center">
                {icon}
            </div>
        </CardContent>
    </Card>
);
