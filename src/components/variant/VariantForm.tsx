"use client";

import {useState,useTransition,useRef} from 'react';
import {useSWRConfig} from "swr";
import {createVariantInternal,editVariant} from "@/app/actions/variant";

import {formStyles as styles} from '@/styles/variant'; 
import {toast} from 'sonner';
import {Loader2} from 'lucide-react';

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Alert,AlertDescription} from "@/components/ui/alert";

interface CreateVariantFormProps {
    productId : string;
    cacheKey ?: any[];
    onCloseDialog : () => void;
    onOptimisticAction ?: (variant:any) => void;
    onSuccess?:(realVariant: any) => void;
    variant?:any;
}

export function VariantForm({productId,cacheKey,onCloseDialog,onOptimisticAction,onSuccess,variant,} : CreateVariantFormProps){
    console.log("DEBUG - Variant data inside form:", variant)
    const [isPending,startTransition] = useTransition();
    const {mutate} = useSWRConfig();
    const [error,setError] = useState<string|null>(null);
    const sizeInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!variant;
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        const data = {
            productId : productId,
            size : (formData.get("size") as string).trim().toUpperCase(),
            color : (formData.get("color") as string).trim(),
            costPrice : parseFloat(formData.get("costPrice") as string),
            price : parseFloat(formData.get("price") as string),
            stock : parseInt(formData.get("stock") as string),
        };

        if(!data.size ||!data.color){
            setError("Size and Color are required parameters");
            return;
        }
        if (isNaN(data.costPrice)|| isNaN(data.price) || isNaN(data.stock)){
            setError("Please Fill out all pricing and stock with valid number");
            return;
        }

         if(data.costPrice > data.price) {
            const errorMsg = 'Selling price must be Higher than the cost price';
            setError(errorMsg);
            toast.error('Invalid Pricing',{description: errorMsg});
            return;
        }
        startTransition( async()=>{
            onOptimisticAction?.({
                id: isEditMode? variant.id :crypto.randomUUID(),
                sku: isEditMode? variant.sku: "Pending...",
                size: data.size,
                color: data.color,
                costPrice: data.costPrice,
                price: data.price,
                stock: data.stock,
            })
            const result = isEditMode? 
                        await editVariant({id:variant.id,...data})
                        :await createVariantInternal(data);

            if(!result.success){
                toast.error(result?.error|| 'An error occured while creating this variant');
            } else {
                toast.success(isEditMode? "Variant Updated Successfully":
                    `Variant (${data.size.trim().toUpperCase()} - ${data.color.trim().toUpperCase()}) added successfully!`);
                onSuccess?.(result.data);
                formElement.reset();
            }
            sizeInputRef.current?.focus();
        });
    };

    return (
            <form key={variant?.id||"create"} onSubmit={handleSubmit} className={styles.formContainer}>
            {error && (
                <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Identifiers Group: Size & Color */}
            <div className={styles.fieldGrid}>
                <div className={styles.inputWrapper}>
                <Label htmlFor="size" className= {styles.label}>Size</Label>
                <Input 
                    id="size" 
                    name="size" 
                    type="text" 
                    required 
                    ref={sizeInputRef}
                    defaultValue = {variant?.size||""}
                    placeholder="M, L, XL, 10" 
                    disabled={isPending} 
                    className = {styles.inputField}
                    autoComplete = "off"
                />
                </div>
                <div className={styles.inputWrapper}>
                <Label htmlFor="color" className ={styles.label}>Color</Label>
                <Input 
                    id="color" 
                    name="color" 
                    type="text" 
                    required 
                    defaultValue = {variant?.color||""}
                    placeholder="Black, Navy, White" 
                    disabled={isPending} 
                    className = {styles.inputField}
                    autoComplete = "off"
                />
                </div>
            </div>

            {/* Financials Group: Cost & Retail Prices */}
            <div className={styles.fieldGrid}>
                <div className={styles.inputWrapper}>
                <Label htmlFor="costPrice" className = {styles.label}>Cost Price ($)</Label>
                <Input 
                    id="costPrice" 
                    name="costPrice" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    defaultValue={variant? variant.costPrice:""}
                    placeholder="0.00" 
                    disabled={isPending} 
                    className={styles.monoText} 
                />
                </div>
                <div className={styles.inputWrapper}>
                <Label htmlFor="price" className = {styles.label}>Selling Price ($)</Label>
                <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    defaultValue = {variant? variant.price:""}
                    placeholder="0.00" 
                    disabled={isPending} 
                    className={styles.monoText} 
                />
                </div>
            </div>

            {/* Inventory Tracking */}
            <div className={styles.inputWrapper}>
                <Label htmlFor="stock" className = {styles.label}>Initial Stock Inventory</Label>
                <Input 
                id="stock" 
                name="stock" 
                type="number" 
                min="0" 
                required 
                defaultValue = {variant?variant.stock:""}
                placeholder="0" 
                disabled={isPending} 
                className={styles.monoText} 
                />
            </div>

            {/* 🛠️ Sticky Bottom Actions Footer Bar */}
            <div className={styles.actionsWrapper}>
                <Button 
                type="button" 
                variant="outline"
                disabled={isPending} 
                onClick={onCloseDialog} 
                className="h-9"
                >
                Cancel / Done
                </Button>
                <Button 
                type="submit" 
                disabled={isPending}
                className={styles.cancelButton}
                >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode? "Edit":"Create"}
                </Button>
            </div>
            </form>
  );
}