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
  onBack,
  isSubmitting,
  disableCheckout,
  total,
}: Shift4PaymentProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const form = formRef.current
    if (!form || disableCheckout || isSubmitting) return

    form.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://dev.shift4.com/checkout.js'
    script.async = false
    script.className = 'shift4-button'
    script.setAttribute('data-class', 'primary_button')
    script.setAttribute('data-key', import.meta.env.VITE_SHIFT4_PUBLIC_KEY)
    script.setAttribute('data-client-secret', import.meta.env.VITE_SHIFT4_CLIENT_SECRET ?? '')
    script.setAttribute('data-name', 'Shift4')
    script.setAttribute('data-description', 'Checkout example')
    script.setAttribute('data-checkout-button', `Pay £${total.toFixed(2)}`)

    form.appendChild(script)

    script.onload = () => setLoadError(null)
    script.onerror = () => setLoadError('Failed to load Shift4 checkout widget.')

    return () => {
      form.innerHTML = ''
    }
  }, [disableCheckout, isSubmitting, total])

  const checkoutAction = import.meta.env.VITE_API_URL + 'checkout-callback';

  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        {loadError
          ? loadError
          : disableCheckout
            ? 'Checkout is disabled for now.'
            : isSubmitting
              ? 'Processing payment…'
              : 'Use the Shift4 checkout button below to complete payment.'}
      </p>

      <form ref={formRef} action={checkoutAction} method="post" />

      <div style={styles.buttonRow}>
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
  buttonRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    gap: '12px',
  },
}
