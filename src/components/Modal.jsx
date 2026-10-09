import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';

export function Modal({ open, onClose, label, children, onPrev, onNext }) {
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const handlers = useRef({ onClose, onPrev, onNext });
  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  });

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e) => {
      const h = handlers.current;
      if (e.key === 'Escape') h.onClose();
      if (e.key === 'ArrowLeft' && h.onPrev) h.onPrev();
      if (e.key === 'ArrowRight' && h.onNext) h.onNext();
      if (e.key === 'Tab') {
        const nodes = document.querySelectorAll('.modal button, .modal a, .modal video[controls]');
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
          <motion.div
            className="modal__panel"
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function VideoModal({ item, onClose }) {
  return (
    <Modal open={!!item} onClose={onClose} label={item ? `${item.title}, ${item.kind}` : ''}>
      {item ? (
        <>
          <div className="modal__media">
            <video src={item.full} poster={item.poster} controls autoPlay playsInline preload="metadata" />
          </div>
          <div className="modal__bar">
            <div>
              <p className="modal__title">{item.title}</p>
              <p className="body-dim">
                {item.artist} · {item.kind} · {item.genre}
              </p>
            </div>
            <a className="btn btn--ghost btn--sm" href={item.href || item.full} target="_blank" rel="noopener noreferrer">
              Open the file <Icon name="arrowUp" size={16} />
            </a>
          </div>
        </>
      ) : null}
    </Modal>
  );
}
