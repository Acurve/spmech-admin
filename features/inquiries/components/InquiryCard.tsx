import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Mail, MessageCircle, Phone } from 'lucide-react'
import React from 'react'
import { ContactRequest } from '../schema'
const InquiryCard = ({ enquiry }: { enquiry: ContactRequest }) => {
    return (
        <Card key={enquiry.id} className="flex flex-col h-full ring-1 ring-sidebar-border hover:ring-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-3 border-b border-sidebar-border">
                <div className="flex justify-between items-start w-full">
                    <div>
                        <CardTitle className="capitalize text-lg">{enquiry.name}</CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                            <Calendar size={13} />
                            {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-5 flex-1 flex flex-col gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Mail size={14} strokeWidth={2.5} />
                        </div>
                        <a href={`mailto:${enquiry.email}`} className="hover:text-primary transition-colors font-medium truncate">
                            {enquiry.email}
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Phone size={14} strokeWidth={2.5} />
                        </div>
                        <a href={`tel:${enquiry.phoneNumber}`} className="hover:text-primary transition-colors font-medium">
                            {enquiry.phoneNumber}
                        </a>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 mt-2 relative">
                    <div className="absolute top-3 left-3 text-slate-200">
                        <MessageCircle size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed relative z-10 pl-8 pt-1">
                        {enquiry.message}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default InquiryCard