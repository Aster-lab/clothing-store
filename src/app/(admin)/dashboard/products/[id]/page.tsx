export const dynamic = "force-dynamic";
import {Suspense} from "react";
import {getProductbyId,getProductStats} from '@/app/actions/product';
import {ProductDetails} from "@/components/productDetail/Product/ProductData";
import {VariantDetails} from "@/components/productDetail/Variant/VariantData";
import { AnalyticsCard } from "@/components/productDetail/AnayticsCard";
import {ThemeToggle} from "@/components/theme-toggle";
import{notFound} from 'next/navigation';
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {PageStyles as styles} from '@/styles/productDetails';
import { Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
 } from "@/components/ui/card";
import ProductSkeleton from "@/components/productDetail/ProductSkeleton";

interface ProductPageProps{
    params: Promise<{
        id: string;
    }> |{id:string};
}

//Optimizes SEO and browser tab
export async function generateMetaData({params}:ProductPageProps){
    const {id} = await params;
    return {title:`Manage Product ${id}`};
}

export default async function ProductDetailPage({params}:ProductPageProps){
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const [product,stats] = await Promise.all([
      getProductbyId(id),
      getProductStats(id),
    ]);
    if(!product) notFound();
    
    
    return (
    <div className={styles.container}>
      
      {/* Header section with back navigation */}
      <div className={styles.headerWrapper}>
        <Link href="/dashboard/products" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          Back to Products
        </Link>
        
        <div className={styles.headerFlex}>
          <div>
            <h1 className={styles.title}>Manage Product</h1>
            <p className={styles.subtitle}>
              Configure your parent product details and manage its stock variations.
            </p>
          </div>

          <div className = "flex items-center gap-3">
            <ThemeToggle/>
          <span className={styles.badge}>
            ID: {id}
          </span>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AnalyticsCard 
      variants = {product.varints || []}/>
      {/* Core Split-Screen Layout */}
      <div className={styles.grid}>
        
        {/* LEFT COLUMN: Parent Product Container */}
        <div className={styles.leftCol}>
            <div className="mb-4 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Parent Product Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Main attributes, categories, and master price points.
              </p>
            </div>
            <Suspense fallback = {<ProductSkeleton/>}>
              <ProductDetails initialData = {product}/>
            </Suspense>
        </div>

        {/* RIGHT COLUMN: Variant Master List Container */}
        <div className={styles.rightCol}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Variant Inventory Master List</CardTitle>
              <CardDescription>
                Manage SKUs, unique pricing structures, attributes, and physical stock metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Variant Table */}
              <VariantDetails
              product = {product}/>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );   
}