'use client';

import {useRouter,useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {ChevronLeft,ChevronRight} from 'lucide-react';

interface PaginationFooterProps{
    currentPage : number;
    totalPages : number;
}

export default function PaginationFooter({currentPage,totalPages}:PaginationFooterProps){
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage:number)=>{
        //Clone the current search params
        const params = new URLSearchParams(searchParams.toString());

        //set new page 
        params.set('page',newPage.toString());

        //navigate to the new page with updated search params
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-card">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
            </Button>
            
            <div className="text-sm font-medium text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    );
}