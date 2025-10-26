import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;


  return (
    <div className="fixed overflow-auto inset-0 z-[10000] bg-black/30 backdrop-blur-sm flex items-center justify-center select-none">
      <div
        ref={modalRef}
        className={`bg-[#1b2330] rounded-lg shadow-2xl w-full ${width} relative animate-fadeIn`}
      >
        <div
          className="flex items-center justify-between px-4 py-3 bg-[#234] rounded-t"
        >
          <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-100 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-5">{children}</div>

      </div>
    </div>
  );
};

export default Modal;
