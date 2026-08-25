'use client';

import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import CreateProductForm from './createProductForm';

export default function CreateDialog(){
    const [open,setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className='mr-2 h-4 w-4'/>
                    Add Product
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-none">
                    <CreateProductForm/>
            </DialogContent>
        </Dialog>
    );
}
