import {describe,it,expect} from "vitest";
import {calculateSalesVelocity, evaluateStockLevel, RestockThresholds} from "../../src/lib/utils/salesVelocity";

describe("Evaluating Stock Level",()=>{
    it("should return NO_SALES when velocity is 0",()=>{
        const result = evaluateStockLevel(0,null);
        expect(result).toBe("NO_SALES");
    });

    it("should return CRITICAL when days of restock is less than or equal to critical threshold",()=>{
        const thresholds: RestockThresholds = {criticalDays: 3, highDays: 7};
        const result = evaluateStockLevel(5,2,thresholds);
        expect(result).toBe("CRITICAL");
    });

    it("should return HIGH when days of restock is less than or equal to high threshold",()=>{
        const thresholds: RestockThresholds = {criticalDays: 3, highDays: 7};
        const result = evaluateStockLevel(5,5,thresholds);
        expect(result).toBe("HIGH");
    });

    it("should return MEDIUM when days of restock is greater than high threshold",()=>{
        const thresholds: RestockThresholds = {criticalDays: 3, highDays: 7};
        const result = evaluateStockLevel(5,10,thresholds);
        expect(result).toBe("MEDIUM");
    });
});

describe("Calculating Sales Velocity",()=>{
    it("should calculate sales velocity correctlly",()=>{
        const totalStock = 50;
        const stats = {week:70, month:150,year:300};

        const result = calculateSalesVelocity(totalStock,stats);

        expect(result.daily7d).toBeCloseTo(10);
        expect(result.daily30d).toBeCloseTo(5);
        expect(result.daysofReStock).toBe(5);
        expect(result.trend).toBeCloseTo(100);
        expect(result.stockLevel).toBe("HIGH");
    });

    it("should handle zero sales correctly",()=>{
        const totalStock = 100;
        const stats = {week:0, month:0,year:0};

        const result = calculateSalesVelocity(totalStock,stats);
        expect(result.daily7d).toBe(0);
        expect(result.daily30d).toBe(0);
        expect(result.daysofReStock).toBe(null);
        expect(result.trend).toBe(0);
        expect(result.stockLevel).toBe("NO_SALES");
    });

    it("falls back to 30-day if 7 day sales are zero",()=>{
        const totalStock = 10;
        const stats = {week:0, month:30, year:0};

        const result = calculateSalesVelocity(totalStock,stats);
        expect(result.daily30d).toBeCloseTo(1);
        expect(result.daysofReStock).toBe(10);
        expect(result.trend).toBe(-100);
        expect(result.stockLevel).toBe("MEDIUM");
    });

    it("should handle negative sales gracefully",()=>{
        const totalStock = 20;
        const stats = {week:-10, month:-30, year:0};

        const result = calculateSalesVelocity(totalStock,stats);
        expect(result.daysofReStock).toBe(null);
    });

    it("respects custom thresholds",()=>{
        const totalStock = 20;
        const stats = {week:70, month:150, year:0};
        const thresholds: RestockThresholds = {criticalDays: 2, highDays: 5};

        const result = calculateSalesVelocity(totalStock,stats,thresholds);
        expect(result.daysofReStock).toBe(2);
        expect(result.stockLevel).toBe("CRITICAL");
    });
});