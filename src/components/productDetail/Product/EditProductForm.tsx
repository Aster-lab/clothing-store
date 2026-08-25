"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProductAction } from "@/app/actions/product";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { ProductStyles as styles } from "@/styles/productDetails";
import { ProductData } from "@/types/productdata";

interface EditProductFormProps {
  initialData: ProductData;
  onOptimisticUpdate: (update: Partial<ProductData>)=>void;
  onSuccess: (updatedFields: {
    name: string;
    productCode: string;
    category: string | null;
    description: string | null;
  }) => void;
  onCancel: () => void;
}

export function EditProductForm({
  initialData,
  onOptimisticUpdate,
  onSuccess,
  onCancel,
}: EditProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const productCode = (formData.get("productCode") as string).trim();
    const category = (formData.get("category") as string) || null;
    const description = (formData.get("description") as string) || null;

    if (!name || !productCode) {
      toast.error("Product name and code cannot be empty");
      return;
    }

    const payload = {
      productId: initialData.id,
      name,
      productCode,
      category: category as string,
      description: description as string,
    };

    startTransition(async () => {
      onOptimisticUpdate({
        name,
        productCode: productCode.toUpperCase(),
        category,
        description,
      });
      onCancel();
      try {
        const response = await updateProductAction(payload);

        if (response?.success) {
          toast.success("Product updated successfully.");
          onSuccess({ name, productCode, category, description });
        } else {
          toast.error(response?.error || "Failed to update product");
        }
      } catch (error) {
        toast.error("An unexpected network error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Code and Name in Two Columns */}
      <div className={styles.gridTwoCols}>
        <div className={styles.fieldWrapper}>
          <Label htmlFor="productCode" className={styles.label}>
            Product Code
          </Label>
          <Input
            id="productCode"
            name="productCode"
            defaultValue={initialData.productCode}
            className={styles.inputMonoUppercase}
            disabled={isPending}
            required
            autoFocus
          />
        </div>

        <div className={styles.fieldWrapper}>
          <Label htmlFor="name" className={styles.label}>
            Product Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData.name}
            className={styles.input}
            disabled={isPending}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className={styles.fieldWrapper}>
        <Label htmlFor="category" className={styles.label}>
          Category
        </Label>
        <Input
          id="category"
          name="category"
          defaultValue={initialData.category || ""}
          className={styles.input}
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div className={styles.fieldWrapper}>
        <Label htmlFor="description" className={styles.label}>
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData.description || ""}
          className={styles.textarea}
          disabled={isPending}
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <Button
          type="button"
          disabled={isPending}
          onClick={onCancel}
          variant="outline"
          className={styles.secondaryButton}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}