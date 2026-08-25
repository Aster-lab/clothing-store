import { Suspense } from "react";
import CreateDialog from "@/components/product/createProductDialog";
import SearchInput from "@/components/product/SearchInput";
import TableSkeleton from "@/components/product/TableSkeleton";
import CategoryFilterBar from "@/components/product/CategoryFilterBar";
import ProductTableData from "@/components/product/ProductTableData";

import { getCategories } from "@/app/actions/product";
import { pageStyles} from "@/styles/product";

interface ProductsPageProps {
    searchParams: Promise<{ 
        search?: string; 
        page?:string; 
        category?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
     }> | 
    { search?: string;
        page?:string; 
        category?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
     }
}

//This is the static page
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const searchQuery = resolvedParams?.search || undefined;

    // pagination count
    const currentPage = Number(resolvedParams?.page) || 1;

    //Find category
    const selectedCategory = resolvedParams?.category || undefined;

    //fetch the unique catgories for the store
    const categoryResponse = await getCategories();
    const validCategories = categoryResponse.success ? (categoryResponse.data || []) :[];
    const categories: string [] =validCategories.filter((cat):cat is string => cat !== null && cat !=='');

    // Get the sortBy and sortOrder from searchParams, defaulting to 'createdAt' and 'desc' if not provided
    const sortBy = resolvedParams?.sortBy || 'createdAt';
    const sortOrder = resolvedParams?.sortOrder || 'desc';

    return (
        <div className={pageStyles.container}>
            <div className={pageStyles.headerContainer}>
                <div>
                    <h1 className={pageStyles.title}>Product Vault</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your inventory and create new product listings.
                    </p>
                </div>
                <CreateDialog />
            </div>

            <div className="mb-6">
                <SearchInput />
            </div>

            {/* Category Filter */}
            <CategoryFilterBar categories={categories} selectedCategory={selectedCategory} />

            {/* interacive data fetching 
            add index to key so that nextjs can properly track the component */}
            <Suspense key={`${searchQuery || "all"}-${currentPage}-${selectedCategory || "all"}`} fallback={<TableSkeleton />}>
                <ProductTableData searchQuery={searchQuery} 
                page={currentPage} 
                category={selectedCategory} 
                sortBy={sortBy} 
                sortOrder={sortOrder} />
            </Suspense>
        </div>
    );
}

