"use client";

import {useRouter,useSearchParams} from 'next/navigation';
import {useTransition} from 'react';
import {ArrowUpDown,ArrowUp,ArrowDown} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface SortHeaderProps{
    label : string;
    sortKey : string;
}

export default function SortHeader({label,sortKey}:SortHeaderProps){
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending,startTransition] = useTransition();

    const currentSortBy = searchParams.get('sortBy') || 'createdAt';
    const currentSortOrder = searchParams.get('sortOrder') || 'desc';

    const isCurrentField = currentSortBy === sortKey;
    let nextSortOrder : 'asc' | 'desc' | null = null;
    if(!isCurrentField){
        nextSortOrder = 'asc';
    } else if (currentSortOrder === 'asc'){
        nextSortOrder = 'desc';
    } else nextSortOrder = null;

    const getSortIcon = ()=>{
        if(!isCurrentField){
            return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
        }
        if(currentSortOrder === 'asc'){
            return <ArrowUp className="h-3.5 w-3.5 text-white animate-in fade-in duration-200" />;
        }
        return <ArrowDown className="h-3.5 w-3.5 text-white animate-in fade-in duration-200" />;
    }
  
    const handleSort = ()=>{
        startTransition(()=>{
            const params = new URLSearchParams(searchParams.toString());

            if(nextSortOrder){
                params.set('sortBy',sortKey);
                params.set('sortOrder',nextSortOrder);
            } else {
                params.delete('sortBy');
                params.delete('sortOrder');
            }
            params.set('page','1');
            router.push(`?${params.toString()}`);
        });
    };

    const handlePrefetch = ()=>{
        const params = new URLSearchParams(searchParams.toString());
        if(nextSortOrder){
            params.set('sortBy',sortKey);
            params.set('sortOrder',nextSortOrder);
        } else {
            params.delete('sortBy');
            params.delete('sortOrder');
        }
        params.set('page','1');
        router.prefetch(`?${params.toString()}`);
    };

    return (
        <Button 
            variant = 'ghost'
            size = 'sm'
            className = {`-ml-3 h-8 font-semibold text-xs tracking-wider uppercase hover:bg-transparent hover:text-white transition-colors ${
                isCurrentField ? "text-white" : "text-muted-foreground"
            }`}
            onClick = {handleSort}
            onMouseEnter = {handlePrefetch}
            disabled = {isPending}
        >
        <span>{label}</span>
            <span className="ml-2 flex h-4 w-4 items-center justify-center">
                {getSortIcon()}
            </span>
        </Button>
    );
}