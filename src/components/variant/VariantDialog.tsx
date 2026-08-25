"use client";

import { VariantForm } from "./VariantForm";
import {dialogStyles} from "@/styles/variant";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CreateVariantDialogProps{
    productId: string;
    cacheKey?: any[];
    open: boolean;
    setOpen: (open: boolean) => void;
    onOptimisticAction?: (variant:any) => void;
    onSuccess ?: (realVariant:any)=>void;
    variant? :any;
}

export function VariantDialog({ productId,cacheKey,open,setOpen,onOptimisticAction ,onSuccess,variant,}: CreateVariantDialogProps) {
  const isEditMode = !!variant;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={dialogStyles.contentShell}
        onOpenAutoFocus={(e) => {
          const firstInput = document.getElementById("size");
          if (firstInput) {
            e.preventDefault();
            firstInput.focus();
          }
        }}
      >
        {/* Header Block Layer */}
        <DialogHeader className={dialogStyles.headerBlock}>
          <DialogTitle className={dialogStyles.title}>
            {isEditMode ? "Edit Product Variant": "Add Product Variants"}
            </DialogTitle>
          <DialogDescription className={dialogStyles.description}>
            {isEditMode ? 
            "Update your variant configurations.The changes will be saved to database":
            "Type out variant configurations. The dialog stays open so you can quickly enter as many combinations as you need."}
          </DialogDescription>
        </DialogHeader>

        {/* 3. Entire Form Container */}
        {open && (
          <VariantForm 
            key = {variant?.id||"create"}
            productId={productId} 
            cacheKey={cacheKey} 
            onCloseDialog={() => setOpen(false)} 
            onOptimisticAction={onOptimisticAction}
            onSuccess = {onSuccess}
            variant = {variant}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}