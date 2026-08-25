"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useTransition } from "react";
import {searchStyles as s } from '@/styles/product';

import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Loader2, Search} from 'lucide-react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // 1. Hold the typed text in local state (doesn't trigger the URL yet)
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    // 2. Only run this function when the user explicitly submits (presses Enter)
    const handleSearch = (e: FormEvent) => {
        e.preventDefault(); // Prevents the browser from doing a hard page refresh

        const params = new URLSearchParams(searchParams.toString());
        
        if (searchTerm.trim()) {
            params.set("search", searchTerm.trim());
        } else {
            params.delete("search"); // Clear the URL if they search an empty box
        }

        // 3. Update the URL securely in the background
        startTransition(() => {
            router.replace(`?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className={s.form}>
            <div className={s.inputWrapper}>
                <Search className={s.searchIcon} />
                <Input
                    type="text"
                    placeholder="Search products and press Enter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={s.input}
                    disabled={isPending}
                />
                {isPending && (
                    <Loader2 className={s.inputLoader} />
                )}
            </div>

            {/* Submit button is optional since the user can just press Enter */}
            <Button type="submit" className={s.button} disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className={s.buttonLoader} />
                        Searching...
                    </>
                ) : (
                    "Search"
                )}
            </Button>
        </form>
    );
}