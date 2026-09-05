import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//function for Json utils
export const response = (data: any, status = 200) => NextResponse.json(data, { status });

//function for redirect util
export const redirect = (path:string,baseUrl:string | URL, status = 307) => {
  return NextResponse.redirect(new URL(path,baseUrl),status) }
  
//To generate Variant codes
function modifySku(value: string):string {
  return value.trim().toUpperCase().replace(/\s+/g,'-')
}

export function generateVariantSku(
  productCode: string,
  color: string,
  size: string
): string {
  
    const safeCode = modifySku(productCode);
    const safeColor = modifySku(color);
    const safeSize = modifySku(size);

    return `${safeCode}-${safeColor}-${safeSize}`;
  
}

//helper for json parsing
export function serializeProduct(product:any){
  if(!product) return null;

  return{
    ...product,
    price:Number(product.price),
    variants: (product.variants||[]).map((variant:any)=>({
      ...variant,
      costPrice: Number(variant.costPrice),
      price:Number(variant.price),
    })),
  };
}
export function serializeVariant(variant:any) {
  if(!variant) return null;

  return {
    id: String(variant.id),
    productId: String(variant.productId),
    sku: String(variant.sku),
    size: String(variant.size),
    color: String(variant.color),
    stock: Number(variant.stock),
    costPrice: Number(variant.costPrice),
    price: Number(variant.price),
    createdAt: variant.createdAt ? variant.createdAt.toISOString() : null,
    updatedAt: variant.updatedAt ? variant.updatedAt.toISOString() : null,
  };
}
