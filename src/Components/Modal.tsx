import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  disableClose?: boolean
  children: ReactNode
}

export const Modal = ({ open, title, onClose, disableClose = false, children }: ModalProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={disableClose ? undefined : onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          {!disableClose && (
            <button type="button" className="modal-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
