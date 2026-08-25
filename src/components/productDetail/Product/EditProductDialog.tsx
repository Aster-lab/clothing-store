"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProductStyles as styles } from "@/styles/productDetails";
import { ProductData } from "@/types/productdata";
import { EditProductForm } from "./EditProductForm";

interface EditProductDialogProps {
  initialData: ProductData;
  onOptimisticUpdate: (update:Partial<ProductData>)=>void;
  onSuccess: (updatedFields: {
    name: string;
    productCode: string;
    category: string | null;
    description: string | null;
  }) => void;
}

export function EditProductDialog({
  initialData,
  onOptimisticUpdate,
  onSuccess,
}: EditProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className={styles.editButton}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Edit Product Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify core profile fields below
          </DialogDescription>
        </DialogHeader>

        <EditProductForm
          initialData={initialData}
          onOptimisticUpdate={onOptimisticUpdate}
          onSuccess={onSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}