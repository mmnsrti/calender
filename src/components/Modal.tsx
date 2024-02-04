import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cc } from "../utils/cc";

export type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const [closing, setClosing] = useState(false )
  const pervIsOpen = useRef<boolean>();
  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Remove event listener when modal is closed
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  useLayoutEffect(() => {
    if (!isOpen && pervIsOpen.current) {
      setClosing(true);
    }

    pervIsOpen.current =isOpen
  }, [isOpen])

  if (!isOpen && !closing) return null;

  return createPortal(
    <div onAnimationEnd={()=>setClosing(false)} className={cc("modal",closing &&'closing')}>
      <div className="overlay" onClick={onClose} />
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as HTMLElement
  );
};

export default Modal;
