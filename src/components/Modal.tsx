import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-lg mx-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative z-50">
            <button
              onClick={onClose}
              className="absolute -right-2 -top-2 rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 
                       hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
