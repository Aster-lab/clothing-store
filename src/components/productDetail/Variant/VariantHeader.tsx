"use client";
 
import React,{useState} from "react";
import {Plus,Search,X} from "lucide-react";

import {CardHeader,CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import type{ProductVariant} from "@/types/productdata";
import { variantHeaderStyles} from "@/styles/productDetails";
import { VariantDialog } from "@/components/variant/VariantDialog";

interface VariantHeaderProps{
    productId:string;
    cacheKey?: any[];
    variants: ProductVariant[];
    searchQuery: string;
    onSearchChange: (query:string)=>void;
    onOptimisticAction? : (variant:any)=>void;
    onSuccess?: (reallVariant: any) =>void;
}

export function VariantHeader({
    productId,
    cacheKey,
    variants = [],
    searchQuery,
    onSearchChange,
    onOptimisticAction,
    onSuccess,
}:VariantHeaderProps){
    const [isCreateOpen,setIsCreateOpen] = useState(false);
    const showSearchBar = variants.length>=3;

    return (
    <CardHeader className={variantHeaderStyles.container}>
      <div className={variantHeaderStyles.topRow}>
        <div className={variantHeaderStyles.titleGroup}>
          <CardTitle className={variantHeaderStyles.title}>
            Variants
          </CardTitle>
          <Badge variant="secondary" className={variantHeaderStyles.badge}>
            {variants.length} Active
          </Badge>
        </div>

        <Button
          type="button"
          onClick={()=>setIsCreateOpen(true)}
          size="sm"
          className={variantHeaderStyles.addButton}
        >
          <Plus className="w-4 h-4" />
          Add Variant
        </Button>
      </div>

      {showSearchBar && (
        <div className={variantHeaderStyles.searchWrapper}>
          <Search className={variantHeaderStyles.searchIcon} />
          <Input
            placeholder="Filter by SKU, color, or size..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={variantHeaderStyles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className={variantHeaderStyles.clearButton}
              aria-label="Clear filter query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
      )}
      <VariantDialog
        productId={productId}
        cacheKey={["products", productId, "variants"]}
        open={isCreateOpen}
        setOpen={setIsCreateOpen}
        onOptimisticAction={onOptimisticAction}
        onSuccess={onSuccess}
      />
    </CardHeader>
  );
}