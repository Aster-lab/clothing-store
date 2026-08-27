export const PageStyles = {
  container: "space-y-6 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto text-foreground min-h-screen bg-background",
  headerWrapper: "flex flex-col gap-3 border-b border-border pb-5",
  backLink: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  backIcon: "h-3.5 w-3.5",
  headerFlex: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
  title: "text-2xl font-semibold tracking-tight text-foreground",
  subtitle: "text-sm text-muted-foreground mt-1",
  badge: "text-xs font-mono px-2.5 py-1 rounded bg-muted text-muted-foreground border border-border w-fit select-none",
  grid: "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start",
  leftCol: "col-span-1 lg:col-span-5",
  rightCol: "col-span-1 lg:col-span-7",
  card: "border-border bg-card text-card-foreground shadow-2xl",
  placeholderBox: "h-[300px] sm:h-[450px] flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-muted/40 gap-2 text-muted-foreground",
  placeholderSubtext: "text-muted-foreground/70 text-xs",
};

export const ProductStyles = {
  // Container
  form: "space-y-5",
  fieldWrapper: "space-y-1.5",
  label: "text-xs font-medium text-muted-foreground uppercase tracking-wider select-none",
  
  // Editable Input
  input: "bg-background border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary",
  inputMonoUppercase: "bg-background border-input text-foreground font-mono uppercase placeholder:text-muted-foreground/60 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary",
  inputMono: "bg-background border-input text-foreground font-mono placeholder:text-muted-foreground/60 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary",
  gridTwoCols: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  textarea: "bg-background border-input text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary resize-none",

  // Action Buttons
  submitButton: "w-fit whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] font-medium transition-all h-9 px-4 flex items-center justify-center gap-2 text-sm rounded-md",
  secondaryButton: "w-fit whitespace-nowrap bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-input active:scale-[0.99] font-medium transition-all h-9 px-4 flex items-center justify-center gap-2 text-sm rounded-md",
  editButton: "w-fit whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] font-medium transition-all h-9 px-4 flex items-center justify-center gap-2 text-sm rounded-md",

  // Read-Only Display View Styles
  displayContainer: "space-y-5 divide-y divide-border",
  displayGroup: "pt-4 first:pt-0 space-y-1",
  displayValue: "text-sm text-foreground font-medium tracking-wide",
  displayValueMono: "text-sm text-foreground font-mono tracking-wider bg-muted/60 w-fit px-2 py-0.5 rounded border border-border",
  displayValueDescription: "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap",
};

//deleteButton Component
// 📁 style/productDetails.ts

export const deleteButtonStyles = {
  footer: "mt-6 pt-4 border-t border-border flex justify-end w-full",
  // Trigger Button Styles (Product vs. Variant mode)
    trigger: {
      product:
        "w-full border border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors text-xs font-medium h-9 flex items-center justify-center gap-2 rounded-md",
      variant:
        "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center rounded-md",
    },

    // Confirmation Modal Dialog Styles
    modal: {
      overlay:
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
      container:
        "w-full max-w-sm rounded-xl border border-border bg-card p-5 text-left shadow-xl animate-in zoom-in-95 duration-150",
      title: "text-base font-semibold text-foreground tracking-tight",
      description: "mt-2 text-xs leading-relaxed text-muted-foreground",
      actions: "mt-5 flex justify-end gap-2",
      cancelBtn:
        "h-9 px-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md border border-border",
      confirmBtn:
        "h-9 px-4 text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors rounded-md shadow-sm",
    },
};

//Variant header
export const variantHeaderStyles = {
  container: "border-b border-border/60 pb-4 space-y-3.5",
  topRow: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
  titleGroup: "flex items-center gap-2.5",
  title: "text-xl font-bold tracking-tight text-foreground",
  badge: "bg-accent/80 text-foreground font-mono text-xs px-2.5 py-0.5 rounded-full border border-border/80 shadow-none",
  addButton: "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 h-9 px-3.5 text-xs sm:text-sm",
  searchWrapper: "relative w-full",
  searchIcon: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none",
  searchInput: "pl-8 pr-8 h-8 text-xs bg-background/60 border-border/80 w-full focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground",
  clearButton: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors",
};

// Analytics styles
export const analyticsStyles = {
  ///mian grid layout
  
container: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6",
  card: "bg-card text-card-foreground border-border/60 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md",
  cardContent: "p-3.5 sm:p-4 flex items-center justify-between gap-2 overflow-hidden",
  //text styles
  label: "text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate",
  metricGroup: "flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1",
  marginValue: "text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight",
  subText: "text-[10px] sm:text-[11px] text-muted-foreground font-medium truncate",
  statValue: "text-lg sm:text-xl font-bold text-foreground mt-0.5 sm:mt-1 tracking-tight",
  unitText: "text-xs font-normal text-muted-foreground",
  
  // Icon
  iconBadge: {
    emerald: "p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0",
    blue: "p-2 sm:p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0",
    purple: "p-2 sm:p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0",
    amber: "p-2 sm:p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0",
  },
};