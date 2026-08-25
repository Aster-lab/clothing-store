"use client";

import {useState,Fragment} from 'react';
import useSWR from 'swr';
import {mutate} from 'swr';

import SortHeader from '@/components/product/SortHeader';
import PaginationFooter from "@/components/product/PaginationFooter";
import { VariantTableData } from '../variant/VariantTableData';

import { getProduct } from "@/app/actions/product";
import { tableStyles} from "@/styles/product";

import {ChevronDown,ChevronRight,Layers,Loader2} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {Button} from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

//This is for interative data fetching
interface ProductTableDataProps{
    searchQuery?: string;
    category?:string;
    page:number;
    sortBy? : string;
    sortOrder?: 'asc' |'desc'
}

export default function ProductTableData({ 
    searchQuery, 
    page,
    category,
    sortBy,
    sortOrder }: ProductTableDataProps) {
    const pageSize = 10;        
    // Row expansion - local to client UI
    const [expandedRows,setExpendedRows] = useState<Record<string,boolean>>({});

    // Cache Key for swr (using reactiveProps)
    const cacheKey = [
        "products-registry",
        searchQuery || '',
        category || '',
        page,
        sortBy || 'createdAt',
        sortOrder || 'desc'
    ];

    //Swr for both useStae and useEffect
    const {data: response,error,isValidating} =useSWR(cacheKey,()=>
        getProduct({
            searchQuery :searchQuery,
            category :category,
            sortBy : sortBy,
            sortOrder : sortOrder,
            page :page,
            pageSize : pageSize
        })
    );
    
    let products: any[] = [];
    
   

    if (response?.success && response.data) {
        products = response.data;
    }

    //Initial fetch state
    const isInitialLoading = !response && !error;

    //Background loading
    const isSyncing = response && isValidating;

    // Row expension
    const toggleRow = (productId:string)=>{
        setExpendedRows(prev=>({...prev,[productId]:!prev[productId]}));
    };

    if (error) {
        return (
            <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const totalCount = response?.data?.length || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className = "relative space-y-2">
            {/* Transition Refresh */}
            {isSyncing && (
                <div className = {tableStyles.syncStatusBanner}>
                    <Loader2 className = 'h-3 w-3 animate-spin text-emerald-500'/>
                    <span>Refreshing products...</span>
                    </div>
            )}
        
        <div 
        className={`${tableStyles.wrapper} transition-opacity duration-200 ${
          isInitialLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
            <Table className={tableStyles.table}>
                <TableHeader className={tableStyles.thead}>
                    <TableRow className = "hover:bg-transparent">
                        {/* toggle column*/}
                        <TableHead className="w-[50px] p-3 md:p-4"></TableHead>
                        <TableHead className={tableStyles.th}>
                            <SortHeader label = 'Product Details' sortKey='name'/>
                        </TableHead>
                        <TableHead className={tableStyles.th}>Category</TableHead>
                        <TableHead className={tableStyles.th}>
                            <SortHeader label = "Variants & stock" sortKey='totalStock'/> 
                        </TableHead>
                        <TableHead className={`${tableStyles.th} text-right`}>
                            <SortHeader label = "Base Price" sortKey='price'/>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className={`${tableStyles.td} text-center py-8 text-muted-foreground`}>
                                No products found in the vault. Try adjusting your search or add a product!
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product: any) => {
                            const isExpended = !!expandedRows[product.id];
                        
                        return (
                            <Fragment key = {product.id}>
                                {/* core row element */}
                                <TableRow className = {`${tableStyles.tr} ${isExpended ? "bg-muted/20":"border-b"}`}>
                                    {/*Trigger button*/}
                                    <TableCell className = "p-3 md:p-4 text-center align-middle">
                                        <Button 
                                        variant = "ghost"
                                        size="icon"
                                        className = "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                                        onClick = {()=> toggleRow(product.id)}
                                        aria-contorls = {`variants-panel-${product.id}`}
                                        aria-label = {`${isExpended ? "Collapse": "Expand"} ${product.name} variants`}
                                        >
                                            {isExpended ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                
                                {/* Product Identity */}
                                <TableCell className={tableStyles.td}>
                                    <div className={tableStyles.productName}>{product.name}</div>
                                    <div className={tableStyles.productCode}>{product.productCode||product.sku}</div>
                                </TableCell>

                                {/* Category */}
                                <TableCell className={`${tableStyles.td} capitalize`}>
                                    {product.category}
                                </TableCell>

                                {/* Variants & Stock Badges */}
                                <TableCell className={tableStyles.td}>
                                    {(() => {
                                        // 📊 1. Dynamically compute the unified breakdown states per row element
                                        const totalStock = product.totalStock||0;
                                        const uniqueSizes = Array.from(new Set(product.variants?.map((v: any) => v.size).filter(Boolean) || []));
                                        const sizeList = uniqueSizes.length > 0 ? uniqueSizes.join(", ") : "—";
                                        const uniqueColors = Array.from(new Set(product.variants?.map((v: any) => v.color).filter(Boolean) || []));
                                        const colorCount = uniqueColors.length;

                                        return (
                                        // 🎯 2. Render the sleek vertical stacked configuration layer
                                        <div className={tableStyles.variantContainer}>
                                            <div>
                                            <span className={totalStock <= 5 ? tableStyles.stockCritical : tableStyles.stockNormal}>
                                                {totalStock} {totalStock === 1 ? 'item' : 'items'} in stock
                                            </span>
                                            </div>
                                            
                                            <div className={tableStyles.variantSummaryText}>
                                            <span>Sizes: <span className="text-foreground/80 font-medium">{sizeList}</span></span>
                                            <span className={tableStyles.variantDivider}>•</span>
                                            <span>{colorCount} {colorCount === 1 ? 'Color' : 'Colors'}</span>
                                            </div>
                                        </div>
                                        );
                                    })()}
                                </TableCell>

                                {/* Pricing */}
                                <TableCell className={`${tableStyles.td} text-right font-medium`}>
                                    ${Number(product.price || 0).toFixed(2)}
                                </TableCell>

                            </TableRow>

                            {/*variant expansion*/}
                            {isExpended && (
                                <VariantTableData
                                product = {product}
                                mutate = {mutate}
                                />
                            )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

            {totalPages > 1 && (
                <PaginationFooter currentPage={page} totalPages={totalPages} />
            )}
        </div>
    );
}
