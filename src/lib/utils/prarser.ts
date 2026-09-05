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
