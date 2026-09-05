import type {ProductStats,StockLevel, SalesVelocity} from "@/types/productdata";

//get the stock
export function getProductStock(variants: {stock:number}[]):number{
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((total, variant) => total + variant.stock, 0);
}

export interface RestockThresholds {
    criticalDays :number;
    highDays : number;
}

const defaultRestockThresholds : RestockThresholds = {
    criticalDays: 3,
    highDays: 7
};

//math helper
const roundToTwoDecimals = (num: number):number => Math.round(num * 100) / 100;

//risk evaluation
export function evaluateStockLevel(
    velocity : number,
    daysofRestock: number | null, 
    thresholds: RestockThresholds = defaultRestockThresholds
): StockLevel {
    if (velocity <= 0) return "NO_SALES";
    if (daysofRestock !== null && daysofRestock <= thresholds.criticalDays) return "CRITICAL";
    if (daysofRestock !== null && daysofRestock <= thresholds.highDays) return "HIGH";
    return "MEDIUM";
}
//prediction and stock warning
export function calculateSalesVelocity(
    totalStock: number,
    stats: ProductStats,
    thresholds: RestockThresholds = defaultRestockThresholds
):SalesVelocity{
    
    //defensive guard
    const safeStock = Math.max(0, totalStock || 0);
    const weekSales = Math.max(0, stats.week ||0) ;
    const monthSales = Math.max(0, stats.month || 0);
    //daily rate
    const daily7d = roundToTwoDecimals(weekSales / 7);
    const daily30d = roundToTwoDecimals(monthSales / 30);

    const velocity = daily7d > 0 ? daily7d : daily30d;

    const daysofRestock = velocity > 0 
    ? Math.floor(safeStock /velocity) 
    : null;

    //trend calculation - get % fromm 7d to 30d
    let trend = 0;
    if (daily30d > 0){
        trend = Number(
            (((daily7d-daily30d)/daily30d) * 100).toFixed(1)
        );
    }

    // stock level
    const riskLevel = evaluateStockLevel(velocity, daysofRestock,thresholds);
    
    return {
        daily7d,
        daily30d,
        daysofReStock: daysofRestock,
        trend,
        stockLevel: riskLevel
    };
}
