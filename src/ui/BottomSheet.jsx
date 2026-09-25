export default function BottomSheet({ open = false, onClose, children }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-[1099] bg-black/50" />}
      <div
        className={`fixed inset-x-0 bottom-0 z-[1100] flex max-h-[75vh] flex-col rounded-t-xl bg-elevated transition-transform ${open ? "translate-y-0" : "translate-y-full invisible"}`}
      >
        {/* Full-width close control: grab handle + label. The whole bar is a tap
            target so the sheet can always be dismissed without hunting for the scrim. */}
        <button
          type="button"
          aria-label="Close district data"
          onClick={onClose}
          className="flex w-full shrink-0 flex-col items-center gap-1 py-2 text-fg hover:bg-fg/5"
        >
          <span className="h-1 w-10 rounded-full bg-fg/30" />
          <span className="text-xs text-muted">Close ▾</span>
        </button>
        <div className="flex flex-1 flex-col items-center overflow-auto px-3 pb-3">
          {children}
        </div>
      </div>
    </>
  );
}
