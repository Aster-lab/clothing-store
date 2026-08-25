"use client";

import {useTransition,useState} from 'react';
import { deleteVariant } from '@/app/actions/variant';
import {Trash2,Loader2} from "lucide-react";
import {Button} from '@/components/ui/button';
import {toast} from "sonner";

interface DeleteVariantButtonProps{
    variantId: string;
    onOptimisticDelete: ()=>void;
    onSuccess : ()=> void;
}

export function  DeleteVariantButton ({variantId,onOptimisticDelete,onSuccess}:DeleteVariantButtonProps){
    const [isPending,startTransition] = useTransition();
    const [isOpen,setOpen] = useState(false);

    const handleDelete= ()=>{
        setOpen(false);
        startTransition(async()=>{
            onOptimisticDelete();
            const response = await deleteVariant(variantId);

            if(response.success){
                toast.success("Variant Deleted successfully.");
                onSuccess();
            } else {
                toast.error(response?.error ||'Failed to delete Variant');
            }
        });        
    };

    return (
      <>
      <Button
        variant="ghost"
        size="icon"
        onClick={()=>setOpen(true)}
        disabled={isPending}
        className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 transition-colors"
        title="Delete variant"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-sm border border-zinc-800 bg-zinc-950 p-5 shadow-2xl rounded-xl animate-in zoom-in-95 duration-150 text-left">
          <h3 className="text-base font-semibold text-zinc-100">
            Delete Variant
          </h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Are you sure you want to delete this variant? This action cannot be undone.
          </p>
          
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 px-4"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
   
}