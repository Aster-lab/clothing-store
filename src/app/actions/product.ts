'use server';

import {db} from '@/lib/db';
import {withStore} from '@/lib/action-utils';
import {generateVariantSku,serializeProduct} from '@/lib/utils';
import { syncProductMetrics } from './syncVariant';
import {revalidatePath} from "next/cache";
import { abort } from 'process';

//Exact data that frontend will send
interface CreateProductInput{
    name: string;
    productCode: string;
    category?: string;
    description?: string;
    size: string;
    color :string;
    costPrice: number;
    price: number;
    stock: number;
}

//createProduct
const createProductInternal = withStore(
    async (storeId:string, product:CreateProductInput) =>{

        const newProduct = await db.product.create({
            data: {
                storeId,
                name: product.name,
                productCode : product.productCode,
                category: product.category?.trim().toLowerCase(),
                description : product.description,

                variants: {
                    create: {
                        sku : generateVariantSku(product.productCode,product.color,product.size),
                        size: product.size,
                        color: product.color,
                        costPrice : product.costPrice,
                        price: product.price,
                        stock : product.stock,

                        stockLogs: {
                            create: [
                                {
                                    quantityChange : product.stock,
                                    type: 'RESTOCK',
                                    reason : 'Initial product inventory setup',
                                },
                            ],
                        },
                    },
                },
            },
            include : {
                variants: true,
            },
        });
        return serializeProduct(newProduct);
    }
);

export async function createProduct(product: CreateProductInput) {
    const action = await createProductInternal;
    return action(product);
}

//Get Product
interface getProductProps{
    searchQuery? :string,
    category?: string,
    sortBy? :string,
    sortOrder? : 'asc' | 'desc',
    page : number,
    pageSize: number,
}
export const getIProductInternal = withStore(
    async (storeId:string, 
        params : getProductProps
    ) =>{

        const {searchQuery,category,page,pageSize,sortBy='createdAt',sortOrder='desc'} = params;

        // check the sorted list
        const validSortFields = ['name','totalStock','price'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
        //initialize where clause
        const whereClause = {
            storeId,
            ...(category ? {
                category : {
                    equals : category,
                    mode : 'insensitive' as const,
                }
            } : {}),
            ...(searchQuery ? {
                name: { 
                    contains : searchQuery,
                    mode: 'insensitive' as const,
                }
            }:{}),
        };
        const [rawProducts, totalCount] = await Promise.all([
            db.product.findMany({
                where: whereClause,
                include: {
                    variants: {
                        orderBy: {size: 'asc',},
                    }
                },
                orderBy : [
                    {[sortField]: sortOrder},
                    {id:'asc',}
                ],
                take : pageSize,
                skip : (page - 1) * pageSize,
            }),
            db.product.count({ where: whereClause }),
        ]);

        for (const product of rawProducts) {
      if (Number(product.price) === 0 && product.variants.length > 0) {
        await syncProductMetrics(product.id);
      }
    }
        const serializedProducts = rawProducts.map(serializeProduct);
        return serializedProducts;
        
    });

export async function getProduct({
    searchQuery,
    category,
    sortBy,
    sortOrder,
    page= 1, 
    pageSize = 10}
    :getProductProps) {
    const response = await getIProductInternal({searchQuery,category,sortBy,sortOrder,page,pageSize});
    return response;  
}

export const getProductbyIdInternal = withStore(
    async (storeId:string,productId:string)=>{
        const product = await db.product.findUnique({
            where: {
                id_storeId:{
                id: productId,
                storeId: storeId,
            },
            },
            include: {
                variants: {orderBy: {size:"asc"}},
            },
        });
    
        if(!product) return null;
        return serializeProduct(product);
    }
);

export async function getProductbyId(productId:string){
    const response = await getProductbyIdInternal(productId);
    if(response?.success && response.data){
        return response.data;
    }
    return null;
} 

interface UpdateProductInput{
    productId: string;
    name:string;
    productCode: string;
    category: string;
    description: string;
}
export const updateProductAction = withStore(
    async (storeId:string,data:UpdateProductInput)=>{
        const {productId,name,productCode,category,description} = data;

        if(!productId){
            return {success: false,error:"Product ID is required"};
        }
        //basic validation
        if(!name.trim()|| !productCode.trim()){
            return {success:false,error:"Product Name and Code are required."};
        }

        const newProductCode = productCode.trim().toUpperCase();

        const currentProduct = await db.product.findUnique({
            where: {
                id_storeId:{id:productId,storeId:storeId,},
            },
            select: {
                name: true,
                productCode:true,
                category: true,
                description: true,
                variants: {
                    select:{id:true,color:true,size:true}
                }
            }
        });

        if(!currentProduct){
            return {success:false,error:"Product Not Found."};
        }

        const isCodeChanged = currentProduct.productCode !== newProductCode;
        const isNameChanged = currentProduct.name !== name.trim();
        const isCategoryChanged = (currentProduct.category||"") !==(category.trim()||null);
        const isDescChanged = (currentProduct.description||"") !==(description.trim()||null);

        if(!isCodeChanged && !isNameChanged && !isCategoryChanged && !isDescChanged) return {success:true};
        
        const productUpdate = db.product.update({
            where: {
                id_storeId: {id:productId,storeId:storeId,}
            },
            data: {
                name: name.trim(),
                productCode: newProductCode,
                category: category.trim() ||null,
                description: description.trim() || null,
            },
        });

        const operations: any[]= [productUpdate];

        if(isCodeChanged){
            const variantUpdate = currentProduct.variants.map((v)=>{
                const newSku = generateVariantSku(newProductCode,v.color,v.size);
                return db.productVariant.update({
                    where:{id:v.id},
                    data: {sku: newSku},
                });
            });

            operations.push(...variantUpdate);
        }
        await db.$transaction(operations);
        revalidatePath(`/dashboard/products/${productId}`);
        return {success:true};
    }
)

//delete product
export const deleteProduct = withStore(
    async(storeId:string,productId:string)=>{
        if(!productId){
            return{success:false,error:"Product ID is required"};
        }

        const {count} = await db.product.deleteMany({
            where:{id:productId,storeId:storeId,}
        });
        if(count===0) return {success:false,error:"Product not found or unauthorized."}
        revalidatePath("/dashboard/products");
        return {success:true};
    }
)
// Category
export const getCategoriesInternal = withStore(
    async (storeId:string) =>{
        const categories = await db.product.findMany({
            where: {
                storeId,
                category: {not:''},
            },
            distinct: ['category'],
            select: {
                category: true,
            },
            orderBy: {
                category: 'asc',
            },
        });
        return categories.map((c) => c.category);
    }
);

export async function getCategories() {
    const response = await getCategoriesInternal({});
    return response;
}

