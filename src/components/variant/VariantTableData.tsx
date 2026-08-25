// 📁 src/components/product/VariantTableData.tsx
"use client";

import { useState ,useTransition,useOptimistic} from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tableStyles } from "@/styles/product";
import { Layers } from "lucide-react";
import { updateVariantStock } from "@/app/actions/variant";
import { VariantDialog } from "./VariantDialog";
import { DeleteVariantButton } from "./deleteVariantButton";
import { EditVariantButton } from "./editVariantButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Loader2} from 'lucide-react';

interface VariantTableDataProps {
  product: any;
  mutate: any;
}

export function VariantTableData({ product, mutate }: VariantTableDataProps) {
  const [variantModelOpen, setVariantModelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending,startTransition] = useTransition();
  const [typingValues,setTypingValues] = useState<Record<string,string>>({});

  type OptimisticAction = 
  | {type: "UPDATE_STOCK"; variantId:string;newStock:number}
  | {type: "DELETE_VARIANT";variantId:string}
  | {type: "ADD_VARIANT";variant: any}
  | {type: "UPDATE_VARIANT";variant:any};

  const [optimisticVariants,dispatchOptimistic] = useOptimistic(
    product.variants || [],
    (currentVariants,action: OptimisticAction) =>{
        switch (action.type) {
          case 'UPDATE_STOCK':
            return currentVariants.map((v:any)=>
            v.id === action.variantId? {...v,stock:action.newStock}:v
          );

          case "DELETE_VARIANT":
            return currentVariants.filter((v:any)=> v.id !==action.variantId);
          
          case "ADD_VARIANT":
            return [...currentVariants,action.variant];
          
          case "UPDATE_VARIANT":
            return currentVariants.map((v:any)=>
            v.id === action.variant.id? {...v,...action.variant}:v
          );

          default:
            return currentVariants;
        }
        });
  
  const [activeVariant,setActiveVariant] = useState<any|null>(null);

  const updateVariantCache  = (updateFn: (currentVariants: any[])=> any[]) =>{
    if(!mutate) return;

    mutate((currentResponse:any)=>{
      if (!currentResponse?.data) return currentResponse;

      const updatedProducts = currentResponse.data.map((p: any) => {
      // Only modify the product we are currently looking at
      if (p.id !== product.id) return p;

      // Run our specific update logic (map, filter, push) on its variants
      return {
        ...p,
        variants: updateFn(p.variants || []),
      };
    });

    return { ...currentResponse, data: updatedProducts };
  }, { revalidate: true }); // Keeps your { revalidate: true } to sync with the server
};
  const handleBlur = async(variant: any) =>{
    const rawValue = typingValues[variant.id];
    if(rawValue === undefined) return;

    const newStock = parseInt(rawValue,10);

    if(isNaN(newStock) || newStock === variant.stock || newStock<0) {
      setTypingValues( prev =>{
        const copy = {...prev};
        delete copy[variant.id];
        return copy;
      });
      return;
    }
    setError(null);

    startTransition( async() =>{
      dispatchOptimistic({
        type: "UPDATE_STOCK",
        variantId: variant.id,
        newStock})
      
      setTypingValues( prev =>{
        const copy = {...prev};
        delete copy[variant.id];
        return copy;
      });

      const result = await updateVariantStock({
        variantId: variant.id,
        newStock : newStock,
      });

      if (result.success) {
        updateVariantCache((variants)=>
        variants.map((v:any)=>
          v.id === variant.id ? {...v,stock:newStock} :v
        ));
      } else {
        setError(result.error || "Failed to update stock quantity.");
      }
  });
  };


  return (
    <>
      <TableRow className={`${tableStyles.subRowWrapper} hover:bg-transparent`}>
        <TableCell colSpan={5} className="p-4 bg-card/30">
          <div className={tableStyles.subCardFrame}>
            
            {/* Global Error banner section inside the sub-table frame if request fails */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>DETAILED VARIANT BREAKDOWN</span>
            </div>

            <Table className="w-full text-left text-xs border-collapse mt-3">
              {optimisticVariants && optimisticVariants.length>0 && (
              <TableHeader>
                <TableRow className={`${tableStyles.subTableHeader} hover:bg-transparent`}>
                  <TableHead className="pb-2 font-semibold h-auto px-2">SKU</TableHead>
                  <TableHead className="pb-2 font-semibold h-auto px-2">SIZE</TableHead>
                  <TableHead className="pb-2 font-semibold h-auto px-2">COLOR</TableHead>
                  <TableHead className="pb-2 font-semibold h-auto px-2">CURRENT STOCK</TableHead>
                  <TableHead className="pb-2 text-right font-semibold h-auto px-2">INDIVIDUAL PRICE</TableHead>
                  <TableHead className = "pb-2 w-10 h-auto px-2"></TableHead>
                </TableRow>
              </TableHeader>
              )}

              <TableBody className="divide-y divide-border/40 text-foreground/80">
              {!optimisticVariants || optimisticVariants.length === 0 ? (
                <TableRow className={`${tableStyles.subRowWrapper} hover:bg-transparent`}>
                  <TableCell colSpan={5} className="p-4 bg-card/30 text-center text-xs text-muted-foreground">
                    No variants found for this product.
                  </TableCell>
                </TableRow>
              ):(
                optimisticVariants.map((variant: any) => (
                  <TableRow key={variant.id} className={tableStyles.subTableRow}>
                    <TableCell className="py-2.5 px-2 font-mono text-muted-foreground">{variant.sku}</TableCell>
                    <TableCell className="py-2.5 px-2 font-bold uppercase">{variant.size}</TableCell>
                    <TableCell className="py-2.5 px-2 text-muted-foreground">{variant.color}</TableCell>
                    
                    {/* Input Field Container */}
                    <TableCell className="py-2.5 px-2 font-mono">
                      <div className = "flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        disabled = {isPending}
                        value = {typingValues[variant.id]?? String(variant.stock)}
                        onChange = {(e)=>  setTypingValues(prev=>({...prev,[variant.id]:e.target.value}))}
                        onBlur = {()=>handleBlur(variant)}
                        className={`w-24 px-2 py-1 bg-transparent border border-input rounded text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${
                          variant.stock <= 5 
                            ? "text-destructive font-semibold" 
                            : "text-foreground/90"
                        }`}
                        />
                       {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-50"/>}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-2.5 px-2 text-right font-mono text-foreground">
                      ${Number(variant.price || 0).toFixed(2)}
                    </TableCell>

                    <TableCell className="py-2.5 px-2 text-right w-20">
                    <div  className = "flex items-center justify-end gap-1">
                    <EditVariantButton
                    variant = {variant}
                    onEdit={(v)=>{
                      setActiveVariant(v);
                      setVariantModelOpen(true);
                    }}
                    />
                    <DeleteVariantButton 
                    variantId={variant.id}
                    onOptimisticDelete = {()=>
                      dispatchOptimistic({type:'DELETE_VARIANT',variantId:variant.id})
                    }
                    onSuccess={()=>{
                      updateVariantCache((variants)=>
                      variants.filter((v:any)=>v.id !== variant.id));
                    }
                    } />
                    </div>
                  </TableCell>

                  </TableRow>
                ))
              )}
              </TableBody>
              
            </Table>

            <div 
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-500 cursor-pointer hover:underline w-fit"
              onClick={() => {
                setActiveVariant(null);
                setVariantModelOpen(true);
              }}
            >
              <span>+ Add New Variant</span>
            </div>
          </div>
        </TableCell>
      </TableRow>

      <VariantDialog
        productId={product.id}
        cacheKey={["products", product.id, "variants"]}
        open={variantModelOpen}
        setOpen={(isOpen)=>{
          setVariantModelOpen(isOpen);
          if(!isOpen) setActiveVariant(null);
        }}
        onOptimisticAction={(newVariant: any)=>{
          if(activeVariant){
            dispatchOptimistic({type:"UPDATE_VARIANT",variant: newVariant});
          } else {
          dispatchOptimistic({type:"ADD_VARIANT",variant: newVariant});
          }
        }}
        onSuccess = {(realVariantForm: any)=>{
          if(activeVariant) {
            updateVariantCache((variants)=>
            variants.map((v)=>(v.id===realVariantForm.id ? realVariantForm:v)));
          } else{
          updateVariantCache((variants)=> [...variants,realVariantForm]);
          }
        }}
        variant = {activeVariant}
      />
    </>
  );
}