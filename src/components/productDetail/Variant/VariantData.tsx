"use client";

import React,{useState} from "react";

import { VariantHeader } from "./VariantHeader";
import { VariantTableData } from "@/components/variant/VariantTableData";
import type {ProductData} from "@/types/productdata";

import {Card} from "@/components/ui/card";

interface VariantDataProps {
    product: ProductData;
    cacheKey ?: any[];
    mutate? : any;
}

export function VariantDetails({product,cacheKey,mutate}:VariantDataProps){
    const [searchQuery,setSearchQuery] = useState("");

    return (
        <Card className = "border border-border/80 rounded-xl bg-card overflow-hidden shadow-sm">
            <VariantHeader
            productId = {product.id}
            cacheKey = {cacheKey}
            variants = {product.variants||[]}
            searchQuery = {searchQuery}
            onSearchChange = {setSearchQuery}
            onSuccess = {()=>mutate?.()}
            />

            <VariantTableData
            product = {product}
            searchQuery = {searchQuery}
            mutate = {mutate}
            />
        </Card> 
    )
}