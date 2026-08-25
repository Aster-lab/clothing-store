"use server";

import {db} from '@/lib/db';
import {withStore} from '@/lib/action-utils';
import {syncProductMetrics} from './syncVariant';
import { generateVariantSku,serializeVariant } from '@/lib/utils';
import {revalidatePath} from 'next/cache';


// Update the variant
interface UpdateVariantProps{
    variantId: string,
    newStock : number,
}
 
const updateVariantStockInternal = withStore(
    async ( storeId: string,update:UpdateVariantProps) =>{
        const variant = await db.productVariant.findUnique({
            where:{id:update.variantId},
            select: {productId:true}
        });

        if(!variant) throw new Error("Variant not found");
        
        await db.$transaction(async(tx)=>{
            await tx.productVariant.update({
            where: {
                id: update.variantId,
                product : {storeId: storeId}
            },
            data : {
                stock: update.newStock
            },
        });
        await syncProductMetrics(variant.productId,tx);
        });
        revalidatePath('/dashboard/products');

        return true;
    }
);

export async function updateVariantStock(payload : UpdateVariantProps){
    return await updateVariantStockInternal(payload);
}

//Create the variants
interface CreateVariantProps{
    productId : string;
    size : string;
    color: string;
    costPrice: number;
    price: number;
    stock: number;
}

export const createVariantInternal = withStore(
    async (storeId: string, variant:CreateVariantProps) =>{
        const {productId,size,color,costPrice,price,stock} = variant;

        const parentProduct = await db.product.findFirst({
            where:{id:productId,storeId}
        });

        if(!parentProduct) {
            return{
                success: false,
                error: 'Product access denied or record not found',
            };
        }

        const productCode = (parentProduct as any).productCode;
        const sku = generateVariantSku(productCode,size,color);

        const result = await db.$transaction(async (tx)=>{
            const newVariant = await tx.productVariant.create({
            data: {
                productId,
                sku: sku,
                size : size.trim().toUpperCase() || '-',
                color: color.trim() || '-',
                costPrice: costPrice,
                price : price,
                stock: Math.max(0,stock)
            }
        });
        
        await syncProductMetrics(productId,tx);
        return serializeVariant(newVariant);
        });
         revalidatePath('dashboard/product');
        return {success: true, data: result};
    }
)

//delete variant
export const deleteVariant = withStore(
    async(storeId:string,variantId:string) =>{
        await db.$transaction(async (tx) => {
            const result = await tx.productVariant.findUnique({
            where : {id:variantId},
            include: {
                product: {
                    select: {storeId: true,id:true}
                }
            }
        });

        if(!result || result.product.storeId !== storeId) {
           throw new Error("Variant not Found or Access denied.");
        }
        const productId = result.product.id;

        await tx.productVariant.delete({
            where:{id:variantId},
        });
            await syncProductMetrics(productId,tx);
        });
        revalidatePath('/dashboard/product');
        return {success:true};
    });

//updateVariant
interface EditVariantProps{
    id : string;
    size : string;
    color: string;
    costPrice: number;
    price: number;
    stock: number;
}

export const editVariant = withStore(
    async(storeId:string,variant:EditVariantProps) => {
        const {id,size,color,costPrice,price,stock} = variant;

        const currentVariant = await db.productVariant.findUnique({
            where: {id},
            include: {
                product:{
                    select: {storeId:true,productCode:true}
                }
                },
        });

        if(!currentVariant || currentVariant.product.storeId !==storeId){
            throw new Error("Variant not found or access denied.")
        }
        const cleanSize = size.trim().toUpperCase() ||'-';
        const cleanColor = color.trim() || '-';

        if (
        currentVariant.size.toUpperCase() !== cleanSize || 
        currentVariant.color.toUpperCase() !== cleanColor
        ) {
        const duplicateCheck = await db.productVariant.findFirst({
            where: {
                productId:currentVariant.productId,
                size: { equals:size.trim().toUpperCase(),mode:"insensitive"},
                color: {equals:color.trim(),mode:"insensitive"},
                NOT:{id:id},
            },
        });

        if (duplicateCheck){
            throw new Error(`A variant with Size "${size} and Color "${color} already exists. `)
        }}

        const newSku = generateVariantSku(currentVariant.product.productCode,cleanSize,cleanColor);

        const result = await db.$transaction(async(tx)=>{
            const updateVariant = await tx.productVariant.update({
            where: {id},
            data: {
                sku: newSku,
                size : size.trim().toUpperCase() || '-',
                color: color.trim() || '-',
                costPrice: costPrice,
                price : price,
                stock: Math.max(0,stock)
            },
        });
        await syncProductMetrics(currentVariant.productId,tx);
        return serializeVariant(updateVariant);
        });
        revalidatePath('dashboard/product');
        return {success: true, data: result}; 
    }
)