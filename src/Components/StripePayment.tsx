import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import type { CSSProperties } from 'react'
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { useState } from 'react'
import { Buttons } from './Buttons'

type StripePaymentProps = {
  onPay: (paymentMethod: any) => Promise<void>
  onBack: () => void
  isSubmitting?: boolean
  disableCheckout?: boolean
  total: number
}

export const StripePayment = ({
  onPay,
  onBack,
  isSubmitting,
  disableCheckout,
  total
}: StripePaymentProps) => {

  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const stripeReady = Boolean(stripe && elements);
  const payDisabled = isSubmitting || disableCheckout || !stripeReady || !cardComplete;

  const handleStripePay = async () => {
    if (!stripe || !elements || !cardComplete) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    await onPay(cardElement);
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
    setCardError(event.error?.message || null);
  };

  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        {cardError
          ? cardError
          : !cardComplete
            ? 'Enter your card details to enable payment.'
            : 'Card details are complete.'}
      </p>

      <div style={{ marginBottom: '20px' }}>
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": {
                  color: "#959595",
                },
              },
            },
          }}
          onChange={handleCardChange}
        />
      </div>

      <div style={styles.buttonRow}>
        <Buttons.primary
          onClick={handleStripePay}
          title={isSubmitting ? "Processing Payment…" : `Pay £${total.toFixed(2)}`}
          disabled={payDisabled}
        />

        <Buttons.secondary onClick={onBack} title="Go Back" />
      </div>
    </div>
  );
};

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
    alignContent: 'center',
    margin: 'auto',
    gap: '12px',
    flexWrap: 'wrap',
  },
}
