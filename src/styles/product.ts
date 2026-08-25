//Overall layout
export const pageStyles = {
    container: 'w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-300',
    headerContainer : 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
    title: 'text-2xl md:text-3xl font-bold tracking-tight',
};

//createProduct form
export const formStyles = {
    container: "w-full flex flex-col max-h-[85vh] p-6",
  
    // Header styles
    headerWrapper: "mb-6 flex-shrink-0",
    heading: "text-xl font-semibold text-foreground",
    subheading: "text-sm text-muted-foreground mt-1",
    
    // Form container
    form: "flex flex-col flex-1 min-h-0",

    scrollArea: "flex-1 overflow-y-auto pr-1 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full",
    
    // Grid layout rules (stacks on mobile, columns out on desktop)
    rowTwoCol: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    rowThreeCol: "grid grid-cols-1 sm:grid-cols-3 gap-4",
    
    // Form elements styling
    fieldGroup: "space-y-2",
    label: "text-xs font-bold tracking-wider uppercase text-muted-foreground",
    input: "w-full",
    
    // Pins the action panel to the bottom of the scroll container on mobile viewports
    actionsWrapper: "flex justify-end gap-3 pt-4 border-t bg-card mt-6 flex-shrink-0",
    cancelBtn: "",
    submitBtn: "bg-primary text-primary-foreground hover:bg-primary/90"
};

//Table
export const tableStyles = {
    // Main Frames
    wrapper : 'w-full overflow-x-auto rounded-xl border bg-card text-card-foreground shadow-sm',
    table: "w-full text-left text-sm border-collapse min-w-[800px]", // Forces scrolling instead of squishing text
    thead: "bg-muted/50 border-b text-muted-foreground font-medium text-xs uppercase tracking-wider",
    th: "p-3 md:p-4 font-semibold whitespace-nowrap",
    tr: "hover:bg-muted/30 transition-colors border-b last:border-0",
    td: "p-3 md:p-4 align-middle",

    // Background syncing
    syncStatusBanner: "absolute right-4 -top-8 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded border border-border backdrop-blur-sm z-10 font-mono",

    //Product details
    productName: "font-medium text-foreground",
    productCode: "text-xs text-muted-foreground font-mono mt-0.5",

    //variants
    variantContainer: "flex flex-col gap-1.5", 
    variantSummaryText: "text-[11px] text-muted-foreground tracking-wide",
    variantBadge: "text-[11px] font-medium border bg-background px-2 py-0.5 rounded-md inline-flex items-center gap-1 shadow-sm mr-1.5 mb-1.5 whitespace-nowrap",
    variantDivider: "text-muted-foreground/40 font-light",
    stockCritical: "text-destructive font-semibold bg-destructive/10 px-1.5 py-0.5 rounded whitespace-nowrap",
    stockNormal: "text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap",

    // subrows
    subRowWrapper: "bg-muted/5 border-t border-b border-border/60",
    subCardFrame: "rounded-xl border bg-card/50 p-4 shadow-sm space-y-3",
    subTableHeader: "border-b border-border text-muted-foreground/80 font-mono text-[11px] uppercase tracking-wider",
    subTableRow: "hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0",
}

//searchInput
export const searchStyles = {
    form: "flex items-center gap-2 w-full max-w-md",
    inputWrapper: "relative flex-1",
    searchIcon: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
    input: "pl-9 pr-10 bg-background",
    inputLoader: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground",
    button: "whitespace-nowrap",
    buttonLoader: "mr-2 h-4 w-4 animate-spin",
};

//CategoryFilterBar
export const categoryFilterStyles = {
    // mobile - horizontal scrollable list of categories
    // desktop - horizontal list of categories with wrap
    container : "flex w-full items-center gap-2 sm:gap-3 pb-4 overflow-x-auto md:overflow-x-visible md:flex-wrap scrollbar-none",

    // shrink-0 so buttons maintain their size and don't shrink when the container is smaller than the total width of the buttons
    button: "shrink-0 rounded-full transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2",
}

