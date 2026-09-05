//To generate Variant codes
function modifySku(value: string):string {
  return value.trim().toUpperCase().replace(/\s+/g,'-')
}

export function generateVariantSku(
  productCode: string,
  color: string,
  size: string
): string {
  
    const safeCode = modifySku(productCode);
    const safeColor = modifySku(color);
    const safeSize = modifySku(size);

    return `${safeCode}-${safeColor}-${safeSize}`;
  
}