'use client';

import {useState,useTransition,useRef } from 'react';
import {useRouter} from  'next/navigation';
import {createProduct} from '@/app/actions/product';

import {formStyles as s } from '@/styles/product';
import {toast} from 'sonner';

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Alert,AlertDescription} from '@/components/ui/alert';


export default function CreateProductForm(){
    const router = useRouter();
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState<string|null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);
        
        const data = {
            name :formData.get("name") as string,
            productCode : formData.get('productCode') as string,
            category: formData.get('category') as string,
            description : formData.get('description') as string,
            size : formData.get('size') as string,
            color : formData.get('color') as string,
            costPrice : parseFloat(formData.get('costPrice') as string),
            price : parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string,10),
        };

        //Check the logic
        if(data.costPrice > data.price) {
            const errorMsg = 'Selling price must be Higher than the cost price';
            setError(errorMsg);
            toast.error('Invalid Pricing',{description: errorMsg});
            return;
        }

        startTransition(async ()=> {
            const response = await createProduct(data);
        
        if(!response.success) {
            setError(response.error||'Failed to create product');
            //show the error toast
            toast.error('Action Failed',{description: response.error})
        } else {
            formElement.reset();
            toast.success('Product Created',{
                description : `${data.name} (${data.productCode}) has been created`
            });
            nameInputRef.current?.focus();
            router.refresh();
        }
        });
    };

    return (
        <div className = {s.container}>
                {/*--Header--*/}
                <div className = {s.headerWrapper}>
                    <h2 className = {s.heading}>Create New Product</h2>
                    <p className = {s.subheading}>Add a new product to your store's vault</p>
                </div>
            <form onSubmit = {handleSubmit} className={s.form}>
                
                {error &&(
                    <Alert variant = 'destructive'>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className = {s.scrollArea}>

                <div className = {s.rowTwoCol}>
                <div className = {s.fieldGroup}>
                        {/*--Name--*/}
                        <Label htmlFor= 'name' className = {s.label}>Product Name</Label>
                        <Input 
                            id='name'
                            required
                            name='name'
                            type='text'
                            placeholder = 'Classic Hoodie'
                            className= {s.input}
                            ref={nameInputRef}/>
                    </div>

                    <div className = {s.fieldGroup}>
                        {/*--ProductCode--*/}
                        <Label htmlFor= 'productCode' className = {s.label}>Product Code</Label>
                        <Input 
                            id='productCode'
                            required
                            name='productCode'
                            type='text'
                            placeholder = 'HD-01'
                            className = {s.input}/>
                    </div>
                    </div>

                    <div className = {s.rowTwoCol}>
                    <div className = {s.fieldGroup}>
                        {/*--Description--*/}
                        <Label htmlFor= 'description' className = {s.label}>Product Description</Label>
                        <Input 
                            id='description'
                            required
                            name='description'
                            type='text'
                            placeholder = 'classic swimwear'
                            className = {s.input}/>
                    </div>

                    <div className = {s.fieldGroup}>
                        {/*--Category--*/}
                        <Label htmlFor= 'category' className = {s.label}>Category</Label>
                        <Input 
                            id='category'
                            required
                            name='category'
                            type='text'
                            placeholder = 'Shirt'
                            className = {s.input}/>
                    </div>
                    </div>

                    <div className = {s.rowTwoCol}>

                    {/*--Varient==*/}
                    <div className = {s.fieldGroup}>
                        {/*--Size--*/}
                        <Label htmlFor= 'size' className = {s.label}>Size</Label>
                        <Input 
                            id='size'
                            required
                            name='size'
                            type='text'
                            placeholder = 'S'
                            className = {s.input}/>
                    </div>

                    <div className = {s.fieldGroup}>
                        {/*--Color--*/}
                        <Label htmlFor= 'color' className = {s.label}>Color</Label>
                        <Input 
                            id='color'
                            required
                            name='color'
                            type='text'
                            placeholder = 'red'
                            className = {s.input}/>
                    </div>
                    </div>

                    <div className = {s.rowThreeCol}>

                    {/*--Pricing and Logitics--*/}
                    <div className = {s.fieldGroup}>
                        {/*--CostPrice--*/}
                        <Label htmlFor= 'costPrice' className = {s.label}>Cost Price</Label>
                        <Input 
                            id='costPrice'
                            required
                            name='costPrice'
                            type='number'
                            placeholder = '20,000'
                            className = {s.input}/>
                    </div>

                    <div className = {s.fieldGroup}>
                        {/*--Price--*/}
                        <Label htmlFor= 'price' className = {s.label}>Selling Priice</Label>
                        <Input 
                            id='price'
                            required
                            name='price'
                            type='number'
                            placeholder = '20,000'
                            className = {s.input}/>
                    </div>

                    <div className = {s.fieldGroup}>
                        {/*--Initial Stock--*/}
                        <Label htmlFor= 'stock' className = {s.label}>Initial Stock</Label>
                        <Input 
                            id='stock'
                            required
                            name='stock'
                            type='number'
                            placeholder = '10'
                            className = {s.input}/>
                    </div>
                    </div>

                    </div>

                    <div className = {s.actionsWrapper}>
                    <Button type='button' variant = 'outline' onClick = {()=>router.back()} disabled={isPending} className = {s.cancelBtn}>
                        {isPending ? 'Cancelling...':'Cancel'}
                    </Button>
                    <Button type='submit' disabled={isPending} className = {s.submitBtn}>
                        {isPending ? 'Saving To Vault...':'Create Product'}
                    </Button>
                    
                </div>
                
            </form>
        </div>
    );
}
