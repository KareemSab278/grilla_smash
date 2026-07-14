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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)

  useEffect(() => {
    let isActive = true
    const form = formRef.current

    if (!form || disableCheckout || isSubmitting) {
      setClientSecret(null)
      return () => {
        isActive = false
      }
    }

    const fetchClientSecret = async () => {
      setIsPreparingCheckout(true)
      setLoadError(null)

      try {
        const amountInMinorUnits = Math.round(total * 100)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}checkout-session?amount=${amountInMinorUnits}&currency=GBP`
        )
        const data = await response.json()

        if (!response.ok || !data?.success || !data?.clientSecret) {
          throw new Error(data?.error_message || 'Failed to create checkout session.')
        }

        if (isActive) {
          setClientSecret(data.clientSecret)
        }
      } catch (error) {
        if (isActive) {
          setClientSecret(null)
          setLoadError(
            error instanceof Error ? error.message : 'Failed to prepare checkout.'
          )
        }
      } finally {
        if (isActive) {
          setIsPreparingCheckout(false)
        }
      }
    }

    void fetchClientSecret()

    return () => {
      isActive = false
    }
  }, [disableCheckout, isSubmitting, total])

  useEffect(() => {
    const form = formRef.current
    if (!form || disableCheckout || isSubmitting || !clientSecret) return

    form.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://dev.shift4.com/checkout.js'
    script.async = false
    script.className = 'shift4-button'
    script.setAttribute('data-class', 'primary_button')
    script.setAttribute('data-key', import.meta.env.VITE_SHIFT4_PUBLIC_KEY)
    script.setAttribute('data-checkout-request', clientSecret)
    script.setAttribute('data-name', 'Shift4')
    script.setAttribute('data-description', 'Checkout example')
    script.setAttribute('data-checkout-button', `Pay £${total.toFixed(2)}`)
    script.setAttribute('data-redirect', 'true')
    script.setAttribute('data-redirect-url', `${window.location.origin}/success`)

    form.appendChild(script)

    script.onload = () => setLoadError(null)
    script.onerror = () => setLoadError('Failed to load Shift4 checkout widget.')

    return () => {
      form.innerHTML = ''
    }
  }, [clientSecret, disableCheckout, isSubmitting, total])

  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        {loadError
          ? loadError
          : disableCheckout
            ? 'Checkout is disabled for now.'
            : isSubmitting
              ? 'Processing payment…'
              : isPreparingCheckout
                ? 'Preparing checkout…'
                : 'Use the Shift4 checkout button below to complete payment.'}
      </p>

      <form ref={formRef} method="post" />

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
