'use client';

import {useRouter,useSearchParams} from 'next/navigation';
import {useTransition} from 'react';
import {Button} from '@/components/ui/button';
import {categoryFilterStyles as c} from '@/styles/product'

interface CategoryFilterBarProps {
    categories: string[];
    selectedCategory?: string;
}

export default function CategoryFilterBar({ categories, selectedCategory }: CategoryFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const validCategories = categories.filter(Boolean) as string[];

    const handleCategoryClick = (category:string |null)=>{
        startTransition(()=>{
        const params = new URLSearchParams(searchParams.toString());
        if(category){
            params.set('category',category);
        }else{
            params.delete('category');
            
        }

        params.set('page','1'); // reset to first page when changing category
        router.push(`?${params.toString()}`);
    
    });
    };
    if(validCategories.length === 0)return null;

    return(
        <div className={`{c.container} ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
            <Button 
                variant={selectedCategory ? 'outline' : 'default'}
                size = 'sm'
                onClick={()=>handleCategoryClick(null)}
                className={c.button}>
                    ALL
                </Button>
                {validCategories.map((category)=>(
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size='sm'
                        onClick={()=>handleCategoryClick(category)}
                        onMouseEnter = {()=>{
                            const params = new URLSearchParams(searchParams.toString());
                            if(category){
                                params.set('category',category);
                            } else {
                                params.delete('category');
                            }
                            params.set('page','1'); // reset to first page when changing category
                            router.prefetch(`?${params.toString()}`);
                        }}
                        className={c.button}
                    >
                        {category}
                    </Button>
                ))}
    </div>
    );
}