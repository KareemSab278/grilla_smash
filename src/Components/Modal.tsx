import { useEffect, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  disableClose?: boolean
  children: ReactNode
}

export const Modal = ({ open, title, onClose, disableClose = false, children }:
ModalProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 508px)')
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  if (!open) {
    return null
  }

  const boxStyle: CSSProperties = {
    ...styles.box,
    width: isMobile ? '95vw' : '520px',
    maxHeight: isMobile ? 'calc(100vh - 40px)' : styles.box.maxHeight,
    borderRadius: isMobile ? '20px' : styles.box.borderRadius,
  }

  const handleOverlayClick = () => {
    if (!disableClose) {
      onClose()
    }
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={boxStyle} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          {!disableClose && (
            <button type="button" style={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}


const styles: {
  overlay: CSSProperties
  box: CSSProperties
  header: CSSProperties
  title: CSSProperties
  closeButton: CSSProperties
} = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  box: {
    width: '520px',
    minWidth: '320px',
    maxWidth: '95vw',
    maxHeight: 'calc(100vh - 40px)',
    background: '#1a1a1a',
    borderRadius: '24px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '20px',
    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.45)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px',
    borderBottom: '1px solid #333',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.8rem',
    margin: 0,
    width: 'auto',
    display: 'inline',
    textAlign: 'left',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'var(--white)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'var(--transition)',
    flexShrink: 0,
  },
}