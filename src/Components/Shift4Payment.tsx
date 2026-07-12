import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Buttons } from './Buttons'

type Shift4PaymentProps = {
  onPay: (token: string) => Promise<void>
  onBack: () => void
  isSubmitting?: boolean
  disableCheckout?: boolean
  total: number
}

export const Shift4Payment = ({
  onPay,
  onBack,
  isSubmitting,
  disableCheckout,
  total,
}: Shift4PaymentProps) => {
  const cardNumberRef = useRef<HTMLDivElement>(null)
  const expiryRef = useRef<HTMLDivElement>(null)
  const cvcRef = useRef<HTMLDivElement>(null)

  const shift4Ref = useRef<any>(null)
  const cardNumberComponentRef = useRef<any>(null)

  const [cardNumberComplete, setCardNumberComplete] = useState(false)
  const [expiryComplete, setExpiryComplete] = useState(false)
  const [cvcComplete, setCvcComplete] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const allComplete = cardNumberComplete && expiryComplete && cvcComplete
  const payDisabled = isSubmitting || disableCheckout || !allComplete

  useEffect(() => {
    let cardNumber: any, expiry: any, cvc: any

    const init = async () => {
      if (!(window as any).Shift4) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://js.shift4.com/shift4.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Shift4 script'))
          document.head.appendChild(script)
        })
      }

      const win = window as any
      const s4 = win.Shift4(import.meta.env.VITE_SHIFT4_PUBLIC_KEY)
      shift4Ref.current = s4

      const componentStyle = {
        base: {
          color: '#ffffff',
          fontSize: '16px',
          '::placeholder': { color: '#959595' },
        },
      }

      cardNumber = s4.createComponent('cardNumber', { style: componentStyle })
      expiry = s4.createComponent('expiry', { style: componentStyle })
      cvc = s4.createComponent('cvc', { style: componentStyle })

      cardNumberComponentRef.current = cardNumber

      if (cardNumberRef.current) cardNumber.mount(cardNumberRef.current)
      if (expiryRef.current) expiry.mount(expiryRef.current)
      if (cvcRef.current) cvc.mount(cvcRef.current)

      cardNumber.on('change', (e: any) => {
        setCardNumberComplete(e.complete ?? false)
        setCardError(e.error?.message ?? null)
      })
      expiry.on('change', (e: any) => {
        setExpiryComplete(e.complete ?? false)
        if (e.error?.message) setCardError(e.error.message)
      })
      cvc.on('change', (e: any) => {
        setCvcComplete(e.complete ?? false)
        if (e.error?.message) setCardError(e.error.message)
      })
    }

    init().catch((err) => {
      console.error('Error initialising Shift4:', err)
    })

    return () => {
      cardNumber?.unmount?.()
      expiry?.unmount?.()
      cvc?.unmount?.()
    }
  }, [])

  const handlePay = async () => {
    if (!shift4Ref.current || !cardNumberComponentRef.current) return

    const { token, error } = await shift4Ref.current.createToken(
      cardNumberComponentRef.current,
    )

    if (error) {
      setCardError(error.message)
      return
    }

    await onPay(token.id)
  }


  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        {cardError
          ? cardError
          : !allComplete
            ? 'Enter your card details to enable payment.'
            : 'Card details are complete.'}
      </p>

      <div style={styles.fieldWrapper}>
        <label style={styles.label}>Card Number</label>
        <div ref={cardNumberRef} style={styles.fieldContainer} />
      </div>

      <div style={styles.row}>
        <div style={{ ...styles.fieldWrapper, flex: 1 }}>
          <label style={styles.label}>Expiry</label>
          <div ref={expiryRef} style={styles.fieldContainer} />
        </div>
        <div style={{ ...styles.fieldWrapper, flex: 1 }}>
          <label style={styles.label}>CVC</label>
          <div ref={cvcRef} style={styles.fieldContainer} />
        </div>
      </div>

      <div style={styles.buttonRow}>
        <Buttons.primary
          onClick={handlePay}
          title={isSubmitting ? 'Processing Payment…' : `Pay £${total.toFixed(2)}`}
          disabled={payDisabled}
        />
        <Buttons.secondary onClick={onBack} title="Go Back" />
      </div>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  paymentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
  },
  paymentNotice: {
    margin: 0,
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#aaa',
    fontSize: '0.8rem',
  },
  fieldContainer: {
    height: '22px',
    padding: '12px',
    background: 'var(--dark-grey)',
    border: '1px solid #444',
    borderRadius: '8px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    gap: '12px',
  },
}
