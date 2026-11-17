import { useEffect } from "react";

/**
 * Close a dialog when the user presses Escape.
 *
 * Pass the current open state so the listener is only attached while the
 * dialog is mounted. This is the minimum keyboard affordance every modal
 * needs; without it keyboard users are trapped with no way to dismiss.
 */
export function useDismissOnEscape(open: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}
