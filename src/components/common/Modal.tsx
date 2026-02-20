import { type ReactNode, useEffect, useRef } from 'react'
import './Modal.css'

interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (open) {
            dialog.showModal()
        } else {
            dialog.close()
        }
    }, [open])

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-content animate-slide-up">
                {title && (
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button className="modal-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </dialog>
    )
}
