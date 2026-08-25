import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { tableStyles } from "@/styles/product";

export default function TableSkeleton() {
    // Generate 5 dummy rows to represent loading slots
    const placeholderRows = Array.from({ length: 5 });

    return (
        <div className={tableStyles.wrapper}>
            <Table>
                <TableHeader className={tableStyles.thead}>
                    <TableRow>
                        <TableHead className={tableStyles.th}>Product Details</TableHead>
                        <TableHead className={tableStyles.th}>Category</TableHead>
                        <TableHead className={tableStyles.th}>Variants & Stock</TableHead>
                        <TableHead className={`${tableStyles.th} text-right`}>Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {placeholderRows.map((_, index) => (
                        <TableRow key={index} className={tableStyles.tr}>
                            
                            {/* Product Identity Skeleton */}
                            <TableCell className={tableStyles.td}>
                                <Skeleton className="h-5 w-40 mb-2 bg-muted/60" />
                                <Skeleton className="h-4 w-24 bg-muted/40" />
                            </TableCell>

                            {/* Category Skeleton */}
                            <TableCell className={tableStyles.td}>
                                <Skeleton className="h-5 w-20 bg-muted/50" />
                            </TableCell>

                            {/* Variants & Badges Skeleton */}
                            <TableCell className={tableStyles.td}>
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full bg-muted/50" />
                                    <Skeleton className="h-6 w-16 rounded-full bg-muted/50" />
                                </div>
                            </TableCell>

                            {/* Price Skeleton */}
                            <TableCell className={`${tableStyles.td} text-right`}>
                                <div className="flex justify-end">
                                    <Skeleton className="h-5 w-16 bg-muted/60" />
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}