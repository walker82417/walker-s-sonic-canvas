import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

const STORAGE_KEY = "wmw_copyright_seen_v1";

export function CopyrightNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const showTimer = setTimeout(() => setOpen(true), 600);
    const hideTimer = setTimeout(() => {
      setOpen(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          className="fixed left-1/2 top-4 z-[60] w-[min(92vw,560px)] -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="glass-strong flex items-start gap-3 rounded-2xl px-4 py-3 shadow-elevated">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <Info className="size-4" />
            </div>
            <div className="flex-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
              All original music and video content copyright belongs to the
              respective owners. To know more, please check the description on
              each video where every credit is mentioned.
            </div>
            <button
              onClick={close}
              className="rounded-md p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
