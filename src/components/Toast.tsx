import { createPortal } from 'react-dom'

type ToastProps = {
  toast: string | null
}

export const Toast = ({ toast }: ToastProps) => {
  if (typeof document === 'undefined') {
    return null
  }

  if (!toast) {
    return null
  }

  const portalTarget = document.getElementById('toast-root') ?? document.body

  return createPortal(
    <div
      className="toast toast-message fixed bottom-6 right-6 z-[9999] rounded-none bg-black/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white shadow-[0_16px_32px_rgba(0,0,0,0.35)]"
      role="status"
      aria-live="polite"
    >
      {toast}
    </div>,
    portalTarget,
  )
}
