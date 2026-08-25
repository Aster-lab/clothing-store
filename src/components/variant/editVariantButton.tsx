"use client";

import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";

interface EditVariantButtonProps{
    variant:any;
    onEdit: (variant:any) => void;
}

export function EditVariantButton({variant,onEdit}:EditVariantButtonProps){
    return(
    <Button
    variant ="ghost"
    size ="icon"
    onClick={()=>onEdit(variant)}
    className = "h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
    title = "Edit Variant"
    >
        <Pencil className = "h-4 w-4"/>
    </Button>
    )
}