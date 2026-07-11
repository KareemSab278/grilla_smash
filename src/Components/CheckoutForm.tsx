import { useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import { Buttons } from './Buttons'

import type { OrderForm, CheckoutFormProps } from '../Types'

const field = (
  event: ChangeEvent<HTMLInputElement>,
  key: keyof OrderForm,
  onChange: (field: keyof OrderForm, value: string) => void,
) => onChange(key, event.target.value)

export const CheckoutForm = ({
  form,
  onChange,
  onSubmit,
  onBack,
  error,
  isSubmitting,
  subtotal,
  delivery,
  total,
}: CheckoutFormProps) => {
  const [focusedField, setFocusedField] = useState<keyof OrderForm | null>(null)
  const [step, setStep] = useState<'info' | 'payment'>('info')
  const [localError, setLocalError] = useState('')

  const inputStyle = (field: keyof OrderForm) => ({
    ...styles.input,
    ...(focusedField === field ? styles.inputFocus : {}),
  })

  const handleContinue = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address1.trim() || !form.postcode.trim()) {
      setLocalError('Please fill in all delivery details before continuing.')
      return
    }
    setLocalError('')
    setStep('payment')
  }

  const handleBackToInfo = () => {
    setLocalError('')
    setStep('info')
  }

  const nextError = localError || error

  return (
    <>
      <div style={styles.body}>
        {step === 'info' ? (
          <>
            <h3 style={styles.sectionTitle}>Your Information</h3>
            <div style={styles.group}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => field(e, 'fullName', onChange)}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('fullName')}
                placeholder="Full Name"
              />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => field(e, 'phone', onChange)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('phone')}
                placeholder="Phone Number"
              />
              <input
                type="text"
                value={form.address1}
                onChange={(e) => field(e, 'address1', onChange)}
                onFocus={() => setFocusedField('address1')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('address1')}
                placeholder="Address"
              />
              <input
                type="text"
                value={form.address2 || ''}
                onChange={(e) => field(e, 'address2', onChange)}
                onFocus={() => setFocusedField('address2')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('address2')}
                placeholder="Address 2 (optional)"
              />
              <input
                type="text"
                value={form.city}
                onChange={(e) => field(e, 'city', onChange)}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('city')}
                placeholder="City"
              />
              
              <input
                type="text"
                value={form.postcode}
                onChange={(e) => field(e, 'postcode', onChange)}
                onFocus={() => setFocusedField('postcode')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('postcode')}
                placeholder="Postcode"
              />
              <input
                type="text"
                value={form.email}
                onChange={(e) => field(e, 'email', onChange)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('email')}
                placeholder="Email (optional – for receipt)"
              />
            </div>
          </>
        ) : (
          <>
            <h3 style={styles.sectionTitle}>Continue to Payment</h3>

            <div style={styles.group}>
              Stripe Payment impl here
            </div>

            <div style={styles.orderSummaryBox}>
              <div style={styles.summaryRow}><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div style={styles.summaryRow}><span>Delivery</span><span>£{delivery.toFixed(2)}</span></div>
              <div style={styles.summaryRowTotal}><span>Total</span><span style={styles.totalValue}>£{total.toFixed(2)}</span></div>
            </div>
          </>
        )}



        {nextError && <p style={styles.formError}>{nextError}</p>}
      </div >

      <div style={styles.footer}>
        <div style={styles.actions}>
          {step === 'info' ? (
            <Buttons.primary onClick={handleContinue} title="Continue to Payment" disabled={isSubmitting} />
          ) : (
            <Buttons.primary onClick={onSubmit} title={isSubmitting ? 'Placing Order…' : 'Complete Order'} disabled={isSubmitting} />
          )}
          <Buttons.secondary onClick={step === 'info' ? onBack : handleBackToInfo} title={step === 'info' ? 'Back to Cart' : 'Back to Info'} disabled={isSubmitting} />
        </div>
      </div>
    </>
  )
}

const styles: { [key: string]: CSSProperties } = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px 25px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: 'var(--orange)',
    marginBottom: '16px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    gap: '12px',
    marginBottom: '28px',
  },
  input: {
    width: '100%',
    padding: '15px',
    background: 'var(--dark-grey)',
    border: '1px solid #444',
    borderRadius: '8px',
    color: 'var(--white)',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    outline: 'none',
    border: '1px solid var(--orange)',
    boxShadow: '0 0 0 3px rgba(247, 147, 30, 0.1)',
  },
  inlineRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  orderSummaryBox: {
    background: 'var(--dark-grey)',
    border: '1px solid #333',
    borderRadius: '10px',
    padding: '18px',
    marginBottom: '16px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#aaa',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--white)',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.2rem',
    marginBottom: 0,
  },
  totalValue: {
    color: 'var(--orange)',
  },
  formError: {
    color: '#ff7a7a',
    fontSize: '0.9rem',
    marginBottom: '12px',
  },
  footer: {
    padding: '25px',
    borderTop: '1px solid #333',
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
}
