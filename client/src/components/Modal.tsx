import React, { useEffect, useRef, useState } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = modalRef.current?.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-sm flex items-center justify-center select-none">
      <div
        ref={modalRef}
        className={`bg-[#1b2330] rounded-lg shadow-2xl w-full ${width} relative animate-fadeIn`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3 cursor-move bg-[#234] rounded-t"
          onMouseDown={startDragging}
        >
          <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
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
