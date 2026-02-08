import { AnimatePresence, motion } from 'framer-motion'

type ToastProps = {
  toast: string | null
}

export const Toast = ({ toast }: ToastProps) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 right-6 rounded-none bg-[var(--page-surface-strong)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--page-ink)] shadow-glow"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
