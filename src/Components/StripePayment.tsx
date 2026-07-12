import type { ChangeEvent, CSSProperties } from 'react'
import { Buttons } from './Buttons'
import type { OrderForm } from '../Types'

type StripePaymentProps = {
  form: OrderForm
  onChange: (field: keyof OrderForm, value: string) => void
  onPay: () => void
  onBack: () => void
  isSubmitting?: boolean
  disableCheckout?: boolean
}

const field = (
  event: ChangeEvent<HTMLInputElement>,
  key: keyof OrderForm,
  onChange: (field: keyof OrderForm, value: string) => void,
) => onChange(key, event.target.value)

export const StripePayment = ({ form, onChange, onPay, onBack, isSubmitting, disableCheckout }: StripePaymentProps) => {
  const payDisabled = isSubmitting || disableCheckout

  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        Stripe payment is handled here. Enter your card details and submit to pay.
      </p>
      <input
        type="text"
        autoComplete="cc-number"
        value={form.cardNumber}
        onChange={(e) => field(e, 'cardNumber', onChange)}
        style={styles.input}
        placeholder="Card Number"
        inputMode="numeric"
        maxLength={19}
      />
      <div style={styles.row}>
        <input
          type="text"
          autoComplete="cc-exp"
          value={form.expiry}
          onChange={(e) => field(e, 'expiry', onChange)}
          style={{ ...styles.input, flex: 1 }}
          placeholder="Expiry (MM/YY)"
          inputMode="numeric"
          maxLength={5}
        />
        <input
          type="password"
          autoComplete="cc-csc"
          value={form.cvv}
          onChange={(e) => field(e, 'cvv', onChange)}
          style={{ ...styles.input, flex: 1 }}
          placeholder="CVC"
          inputMode="numeric"
          maxLength={4}
        />
      </div>
      <div style={styles.buttonRow}>
        <Buttons.secondary onClick={onBack} title="Back" />
        <Buttons.primary
          onClick={onPay}
          title={isSubmitting ? 'Processing Payment…' : 'Pay with Stripe'}
          disabled={payDisabled}
        />
      </div>
      {disableCheckout && (
        <p style={styles.warningText}>
          Please select a sauce for all chicken items before placing your order.
        </p>
      )}
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  input: {
    width: '100%',
    padding: '14px',
    background: 'var(--dark-grey)',
    border: '1px solid #444',
    borderRadius: '8px',
    color: 'var(--white)',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  warningText: {
    margin: 0,
    color: '#ff7a7a',
    fontSize: '0.9rem',
  },
}
