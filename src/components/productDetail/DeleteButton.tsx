"use client";

import{useState,useTransition} from "react";
import {useRouter} from "next/navigation";

import { deleteProduct } from "@/app/actions/product";
import { deleteVariant } from "@/app/actions/variant";

import {cn} from "@/lib/utils";
import { deleteButtonStyles as styles } from "@/styles/productDetails";

import {Trash2,Loader2} from "lucide-react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps{
    id:string;
    type: "product"|"variant";
    itemName?:string;
    showLabel?:boolean;
    onSuccess?:()=>void;
    className?:string;
}

export function DeleteButton({
    id,type,itemName,showLabel= false,onSuccess,className,}:
    DeleteButtonProps){
        const [isPending,startTransition] = useTransition();
        const [isOpen,setOpen] = useState(false);
        const router = useRouter();

        const isProduct = type === "product";

        const title = isProduct? "Delete Product":"Delete Variant";
        const description = isProduct
        ? `Are you sure you want to delete ${itemName? `"${itemName}"` : "this proudct"}? All linked variants will be removed,Stock logs will remain intact.`
        : `Are you sure you want to delete ${itemName ? `"${itemName}"` : "this variant"}? This action cannot be undone.`;

        const baseTriggerStyle = isProduct
        ? styles.trigger.product 
        : styles.trigger.variant;
        
        const triggerClassName = `${baseTriggerStyle} ${className || ""}`.trim();

        const handleDelete = ()=>{
            startTransition(async()=>{
                const response = isProduct
                ? await deleteProduct(id)
                : await deleteVariant(id);

                if (response.success){
                    toast.success(
                        isProduct? "Product deleted Successfully." : "Variant deleted successfully."
                    );

                    setOpen(false);
                    if(onSuccess) onSuccess();

                    if(isProduct) {router.push("/dashboard/products");}
                    else {router.refresh();}
                } else {
                    toast.error(
                        response?.error || `Failed to delete ${isProduct ? "product" : "variant"}.`
                    );
                }
            });
        };
    
    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                type = 'button'
                variant={isProduct? "outline":"ghost"}
                size={showLabel?"sm":"icon"}
                disabled = {isPending}
                className={triggerClassName}
                >
                    {isPending? (
                       <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : ( 
                        <Trash2 className = "h-4 w-4"/>
                    )}
                    {showLabel && <span>Delete {isProduct ? "Product" : ""}</span>}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className = {styles.modal.container}>
                <AlertDialogHeader>
                    <AlertDialogTitle className = {styles.modal.title}>{title}</AlertDialogTitle>
                    <AlertDialogDescription className={styles.modal.description}>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className={styles.modal.actions}>
                    <AlertDialogCancel disabled={isPending} className={styles.modal.cancelBtn}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    onClick = {(e)=>{
                        e.preventDefault();
                        handleDelete();
                    }}
                    disabled={isPending}
                    className = {styles.modal.confirmBtn}
                    >
                        {isPending?(
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </span>
                            ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}