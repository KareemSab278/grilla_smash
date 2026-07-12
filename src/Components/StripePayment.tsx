import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import type { CSSProperties } from 'react'
import { Buttons } from './Buttons'

type StripePaymentProps = {
  onPay: (paymentMethod: any) => Promise<void>
  onBack: () => void
  isSubmitting?: boolean
  disableCheckout?: boolean
}

export const StripePayment = ({
  onPay,
  onBack,
  isSubmitting,
  disableCheckout
}: StripePaymentProps) => {

  const stripe = useStripe();
  const elements = useElements();

  const payDisabled = isSubmitting || disableCheckout;

  const handleStripePay = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    await onPay(cardElement);
  };

  return (
    <div style={styles.paymentBody}>
      <p style={styles.paymentNotice}>
        Stripe payment is handled here. Enter your card details and submit to pay.
      </p>

      <CardElement
        options={{
          style: {
            base: {
              color: "#fff",
              fontSize: "16px",
              "::placeholder": {
                color: "#ccc",
              },
            },
          },
        }}
      />

      <div style={styles.buttonRow}>
        <Buttons.secondary onClick={onBack} title="Back" />

        <Buttons.primary
          onClick={handleStripePay}
          title={isSubmitting ? "Processing Payment…" : "Pay with Stripe"}
          disabled={payDisabled}
        />
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
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
}
