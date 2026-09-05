export interface ProductVariant {
  id?: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  costPrice: number;
  stock: number;
}

export interface ProductData {
  id: string;
  productCode: string;
  name: string;
  description: string | null;
  category: string | null;
  totalStock: number;
  price: number;
  variants: ProductVariant[];
}

// product stats
export interface ProductStats{
  week: number;
  month: number;
  year: number;
}

// stock analysis
export type StockLevel = "CRITICAL"|"LOW" | "MEDIUM" | "HIGH" | "NO_SALES";

export interface SalesVelocity{
  daily7d: number;
  daily30d: number;
  daysofReStock : number | null;
  trend : number;
  stockLevel: StockLevel;
}

//Centralized Optimistic action types
export type VariantOptimisticAction =
  | { type: "UPDATE_STOCK"; variantId: string; newStock: number }
  | { type: "DELETE_VARIANT"; variantId: string }
  | { type: "ADD_VARIANT"; variant: ProductVariant }
  | { type: "UPDATE_VARIANT"; variant: ProductVariant };

export function variantOptimisticReducer(
  currentVariants: ProductVariant[],
  action: VariantOptimisticAction
): ProductVariant[] {
  switch (action.type) {
    case "UPDATE_STOCK":
      return currentVariants.map((v) =>
        (v.id || v.sku) === action.variantId
          ? { ...v, stock: action.newStock }
          : v
      );

    case "DELETE_VARIANT":
      return currentVariants.filter(
        (v) => (v.id || v.sku) !== action.variantId
      );

    case "ADD_VARIANT":
      return [...currentVariants, action.variant];

    case "UPDATE_VARIANT":
      return currentVariants.map((v) =>
        (v.id || v.sku) === (action.variant.id || action.variant.sku)
          ? { ...v, ...action.variant }
          : v
      );

    default:
      return currentVariants;
  }
}