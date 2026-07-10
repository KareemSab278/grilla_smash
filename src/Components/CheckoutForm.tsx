import type { ChangeEvent } from 'react'
import { Buttons } from './Buttons'

type OrderForm = {
  fullName: string
  phone: string
  email: string
  address: string
  postcode: string
  cardNumber: string
  expiry: string
  cvv: string
}

type CheckoutFormProps = {
  form: OrderForm
  onChange: (field: keyof OrderForm, value: string) => void
  onSubmit: () => void
  onBack: () => void
  error?: string
  isSubmitting?: boolean
  subtotal: number
  delivery: number
  total: number
}

const field = (
  event: ChangeEvent<HTMLInputElement>,
  key: keyof OrderForm,
  onChange: (field: keyof OrderForm, value: string) => void,
) => onChange(key, event.target.value)

export const CheckoutForm = ({
  form, onChange, onSubmit, onBack, error, isSubmitting, subtotal, delivery, total,
}: CheckoutFormProps) => {
  return (
    <>
      <div className="modal-body">
        <h3 className="checkout-section-title">Delivery Details</h3>
        <div className="checkout-group">
          <input type="text" value={form.fullName} onChange={(e) => field(e, 'fullName', onChange)} placeholder="Full Name" />
          <input type="text" value={form.phone} onChange={(e) => field(e, 'phone', onChange)} placeholder="Phone Number" />
          <input type="text" value={form.address} onChange={(e) => field(e, 'address', onChange)} placeholder="Address" />
          <input type="text" value={form.postcode} onChange={(e) => field(e, 'postcode', onChange)} placeholder="Postcode" />
          <input type="text" value={form.email} onChange={(e) => field(e, 'email', onChange)} placeholder="Email (optional – for receipt)" />
        </div>

        <h3 className="checkout-section-title">Payment</h3>
        <div className="checkout-group">
          <input type="text" value={form.cardNumber} onChange={(e) => field(e, 'cardNumber', onChange)} placeholder="Card Number" maxLength={19} />
          <div className="inline-row">
            <input type="text" value={form.expiry} onChange={(e) => field(e, 'expiry', onChange)} placeholder="MM/YY" maxLength={5} />
            <input type="text" value={form.cvv} onChange={(e) => field(e, 'cvv', onChange)} placeholder="CVV" maxLength={3} />
          </div>
        </div>

        <div className="order-summary-box">
          <div className="summary-row"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery</span><span>£{delivery.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

        {error && <p className="form-error">{error}</p>}
      </div>

      <div className="modal-footer">
        <div className="checkout-actions">
          <Buttons.primary
            onClick={onSubmit}
            title={isSubmitting ? 'Placing Order…' : 'Complete Order'}
            disabled={isSubmitting}
          />
          <Buttons.secondary onClick={onBack} title="Back to Cart" disabled={isSubmitting} />
        </div>
      </div>
    </>
  )
}
