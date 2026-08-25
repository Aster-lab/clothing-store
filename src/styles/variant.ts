//Create Form
export const formStyles = {
  // Main form wrapper
  formContainer: "space-y-4 py-2 overflow-y-auto max-h-[55vh] sm:max-h-[70vh] pr-1 relative",
  fieldGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  inputWrapper: "flex flex-col gap-1.5",
  label: "text-xs font-medium text-muted-foreground",
  inputField: "w-full px-3 py-2 bg-transparent border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 transition-shadow",
  monoText: "font-mono",

  // the button will always at the bottom
  actionsWrapper: "pt-4 mt-6 flex items-center justify-end gap-3 w-full",

  // button styles
  cancelButton: "px-4 py-2 border border-input hover:bg-muted text-sm font-medium rounded-md transition-colors disabled:opacity-50 h-9 text-foreground",
  submitButton: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 h-9"
};

export const dialogStyles = {
  tableRowTrigger: "border-t border-dashed border-neutral-800/60 cursor-pointer hover:bg-neutral-900/40 transition-colors group",
  triggerButton: "h-8 gap-1 border-emerald-600/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 text-xs font-medium",
  contentShell: "sm:max-w-[425px] p-6 gap-0",
  headerBlock: "pb-4",
  title: "text-lg font-bold tracking-tight",
  description: "text-xs text-muted-foreground mt-1"
};