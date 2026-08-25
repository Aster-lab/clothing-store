"use server";

import {db} from '@/lib/db';

// to update and sync products stock in one place
export async function syncProductMetrics(productId: string,tx:any=db): Promise<number>{
    // sum up the stock column
        const aggregation = await tx.productVariant.aggregate({
        where: {productId: productId},
        _sum : {stock: true,},
        _min : {price: true,}
        });

        // check the null values
        const exactStock = aggregation._sum.stock || 0;
        const minPrice = aggregation._min.price !==null? aggregation._min.price: 0;

        await tx.product.update({
            where: {id: productId},
            data : {
                totalStock : exactStock,
                price : minPrice,
            },
        });
        return exactStock;
};


