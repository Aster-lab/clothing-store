import {Card,CardContent,CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {ProductStyles as styles} from "@/styles/productDetails";

export default function ProductSkeleton(){
   return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 w-full">
      <div className={styles.form}>
        
        {/* Header Section Skeleton */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-zinc-800 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-zinc-800" />
            <Skeleton className="h-4 w-72 bg-zinc-900" />
          </div>
          <Skeleton className="h-9 w-[140px] bg-zinc-800" />
        </CardHeader>

        {/* Form Body Fields Skeleton */}
        <CardContent className="pt-6 space-y-5">
          
          {/* Product Code */}
          <div className={styles.fieldWrapper}>
            <Skeleton className="h-3 w-24 bg-zinc-800 mb-1" />
            <Skeleton className="h-10 w-full bg-zinc-900/40 border border-zinc-800/80" />
          </div>

          {/* Product Name */}
          <div className={styles.fieldWrapper}>
            <Skeleton className="h-3 w-24 bg-zinc-800 mb-1" />
            <Skeleton className="h-10 w-full bg-zinc-900/40 border border-zinc-800/80" />
          </div>

          {/* Category */}
          <div className={styles.fieldWrapper}>
            <Skeleton className="h-3 w-16 bg-zinc-800 mb-1" />
            <Skeleton className="h-10 w-full bg-zinc-900/40 border border-zinc-800/80" />
          </div>

          {/* Derived Metrics Row */}
          <div className={styles.gridTwoCols}>
            <div className={styles.fieldWrapper}>
              <Skeleton className="h-3 w-40 bg-zinc-800 mb-1" />
              <Skeleton className="h-6 w-20 bg-zinc-900/60 mt-1" />
            </div>

            <div className={styles.fieldWrapper}>
              <Skeleton className="h-3 w-40 bg-zinc-800 mb-1" />
              <Skeleton className="h-6 w-20 bg-zinc-900/60 mt-1" />
            </div>
          </div>

          {/* Description Textarea */}
          <div className={styles.fieldWrapper}>
            <Skeleton className="h-3 w-20 bg-zinc-800 mb-1" />
            <Skeleton className="h-28 w-full bg-zinc-900/40 border border-zinc-800/80" />
          </div>

        </CardContent>
      </div>
    </Card>
  ); 
}