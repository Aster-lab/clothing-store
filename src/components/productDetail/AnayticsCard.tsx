"use client";

import React from "react";
import {TrendingUp, DollarSign, ShoppingCart, Calendar} from "lucide-react";
import {Card,CardContent} from "@/components/ui/card";

import type{ProductVariant,ProductStats} from "@/types/productdata";
import { analyticsStyles as s } from "@/styles/productDetails";

interface AnalyticsProps{
    variants: ProductVariant[];
    stats? : ProductStats;
}

export function AnalyticsCard(
    {
    variants =[],
    stats= {week:0,month:0,year:0},
    }: AnalyticsProps ){
    
    //calculate the weighted formula
    const Totals = variants.reduce(
        (acc,v) =>{
            const variantStock = v.stock ||0;
            const variantPrice = Number(v.price) ||0;
            const variantCost = Number(v.costPrice) || 0;

            acc.totalRevenue += variantPrice *variantStock;
            acc.totalCost += variantCost * variantStock;
            acc. totalUnits += variantStock;
            return acc;
        },
        {totalRevenue: 0,totalCost:0,totalUnits :0}
    );
    
    //calculate the total Profit
    const totalProfit = Totals.totalRevenue - Totals.totalCost;

    //calculate the percentage
    const profitMargin = 
        Totals.totalRevenue > 0 
        ? ((totalProfit/Totals.totalRevenue)*100).toFixed(1)
        : "0.0";

    // avg profit
    const avgProfit = 
    Totals.totalUnits >0
    ? totalProfit/ Totals.totalUnits
    : 0;

    return (
        <div className = {s.container}>
            {/* profitMargin */}
            <Card className = {s.card}>
                <CardContent className = {s.cardContent}>
                    <div>
                        <p className = {s.label}>Avg Gross Margin</p>
                        <div className = {s.metricGroup}>
                            <span className = {s.marginValue}>{profitMargin}</span>
                            <span className = {s.subText} >
                                (+${avgProfit.toFixed(2)}/unit)
                            </span>
                        </div>
                    </div>
                    <div className = {s.iconBadge.emerald}>
                        <DollarSign className = "w-5 h-5"/>
                    </div>
                </CardContent>
            </Card>

            {/* 30-day */}
            <Card className = {s.card}>
                <CardContent className = {s.cardContent}>
                    <div>
                        <p className = {s.label}>30-Day Sales</p>
                        <p className = {s.statValue}>
                            {stats.month} 
                            <span className = {s.unitText}>  units</span>
                        </p>
                    </div>
                    <div className = {s.iconBadge.purple}>
                        <ShoppingCart className = "w-5 h-5"/>
                    </div>
                </CardContent>
            </Card>

            {/* Yearly*/}
            <Card className = {s.card}>
                <CardContent className = {s.cardContent}>
                    <div>
                        <p className = {s.label}>Annual Volume</p>
                        <p className = {s.statValue}>
                            {stats.year} 
                            <span className = {s.unitText}>  units</span>
                        </p>
                    </div>
                    <div className = {s.iconBadge.amber}>
                        <Calendar className = "w-5 h-5"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};