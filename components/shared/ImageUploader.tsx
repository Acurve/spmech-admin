"use client";

import React, { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploaderProps {
    value: string | File | null;
    onChange: (file: File | null) => void;
    label: string;
    className?: string;
}

const ImageUploader = ({ value, onChange, label, className = "" }: ImageUploaderProps) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (value && value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof value === "string") {
            setPreview(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        onChange(null);
    };

    return (
        <div className={`relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group ${className}`}>
            {preview ? (
                <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                    >
                        <X size={16} />
                    </button>
                </>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4">
                    <ImagePlus size={28} className="text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-500">{label}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            )}
        </div>
    );
};

export { ImageUploader };
