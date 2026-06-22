import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const response = (data: any, status = 200) => NextResponse.json(data, { status });

//To generate Variant codes
function modifySku(value: string):string {
  return value.trim().toUpperCase().replace(/\s+/g,'-')
}

export function generateVaiantSku(
  productCode: string,
  color: string,
  size: string
): string {
  
    const safeCode = modifySku(productCode);
    const safeColor = modifySku(color);
    const safeSize = modifySku(size);

    return '${safeCode}-${safeColor}-${safeSize}';
  
}