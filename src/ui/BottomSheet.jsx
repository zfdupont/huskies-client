export default function BottomSheet({ open = false, onClose, children }) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-[1099] bg-black/50" />}
      <div
        className={`fixed inset-x-0 bottom-0 z-[1100] flex max-h-[75vh] flex-col items-center overflow-auto rounded-t-xl bg-elevated p-3 transition-transform ${open ? "translate-y-0" : "translate-y-full invisible"}`}
      >
        {children}
      </div>
    </>
  );
}
