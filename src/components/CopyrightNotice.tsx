import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

const STORAGE_KEY = "wmw_copyright_seen_v1";
const NOTICE_TEXT =
  "All original music and video content copyright belongs to the respective owners. To know more, please check the description on each video where every credit is mentioned.";

export function CopyrightNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const showTimer = setTimeout(() => setOpen(true), 500);
    const hideTimer = setTimeout(() => {
      setOpen(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 6000);
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
          exit={{ opacity: 0, y: -18 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          role="status"
          aria-live="polite"
        >
          <div className="glass-strong ring-soft relative flex w-[min(92vw,640px)] items-start gap-3 rounded-2xl px-5 py-5 shadow-elevated md:px-6 md:py-6">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <Info className="size-4" />
            </div>
            <div className="flex-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
              <TypingText text={NOTICE_TEXT} />
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

function TypingText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.035, duration: 0.18 }}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
