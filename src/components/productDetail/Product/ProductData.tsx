"use client";

import React,{useState,useOptimistic} from "react";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteButton } from "../DeleteButton";

import {Label} from "@/components/ui/label";
import {Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter} from "@/components/ui/card";
import {ProductStyles as styles,deleteButtonStyles as deleteStyles} from "@/styles/productDetails";
import {ProductData} from "@/types/productdata";

interface ProductFormProps{
    initialData: ProductData;
}

export function ProductDetails({initialData}:ProductFormProps){
    const [currentData,setCurrentData] =useState<ProductData>(initialData);

    //Optimistic Stage
    const [optimisticProduct,setOptimisticProduct] = useOptimistic(
      currentData,
      (state,update:Partial<ProductData>)=>({
        ...state,
        ...update,
      })
    );

    const handleUpdateSuccess = (updatedFields: Partial<ProductData>) => {
        setCurrentData((prev) => ({
          ...prev,
          ...updatedFields,
        }));
      };
    return (
    <Card className="bg-card border-border text-card-foreground w-full">
      <div>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-border pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Product Specifications
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              View primary attributes and base configuration
            </CardDescription>
          </div>

          <EditProductDialog
          initialData={currentData}
          onOptimisticUpdate={setOptimisticProduct}
          onSuccess={handleUpdateSuccess}/>
        </CardHeader>

        {/* Content fields using PageStyles object mappings */}
        <CardContent className="pt-4">
          
          {/* Product Code */}
         <div className={styles.displayContainer}>
            {/* Product Code & Product Name Row */}
            <div className={styles.displayGroup}>
              <div className={styles.gridTwoCols}>
                <div className={styles.fieldWrapper}>
                  <Label className={styles.label}>Product Code</Label>
                  <p className={styles.displayValueMono}>
                    {optimisticProduct.productCode}
                  </p>
                </div>

          {/* Product Name */}
          <div className={styles.fieldWrapper}>
                  <Label className={styles.label}>Product Name</Label>
                  <p className={styles.displayValue}>{currentData.name}</p>
                </div>
              </div>
            </div>

          {/* Category */}
          <div className={styles.displayGroup}>
              <div className={styles.fieldWrapper}>
                <Label className={styles.label}>Category</Label>
                <p className={styles.displayValue}>
                  {currentData.category || "Uncategorized"}
                </p>
              </div>
            </div>

          {/* Pricing & Stock Row */}
          <div className={styles.gridTwoCols}>
            <div className={styles.fieldWrapper}>
              <Label htmlFor="price" className={styles.label}>Base Price (From Variants)</Label>
              <p className={styles.displayValue}>
                ${Number(initialData.price).toFixed(2)}
              </p>
            </div>

            <div className={styles.fieldWrapper}>
              <Label htmlFor="stock" className={styles.label}>Total Stock (From Variants)</Label>
              <p className={styles.displayValue}>
                {initialData.totalStock} units
              </p>
            </div>
          </div>

          {/* Description */}
          <div className={styles.displayGroup}>
              <div className={styles.fieldWrapper}>
                <Label className={styles.label}>Description</Label>
                <p className={styles.displayValueDescription}>
                  {currentData.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className={deleteStyles.footer}>
        <DeleteButton
          id={currentData.id}
          type="product"
          itemName={currentData.name}
          showLabel={true}
        />
      </CardFooter>
      </div>
    </Card>
  );
}