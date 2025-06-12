// Search footer component
// Keyboard shortcuts and branding

export function SearchFooter() {
  return (
    <div className="border-t p-3 bg-muted/30">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded">↑</kbd>
            <kbd className="px-1.5 py-0.5 border rounded">↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 border rounded">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Powered by FARM Search</span>
        </div>
      </div>
    </div>
  );
}
