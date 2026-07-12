import { loadStripe } from '@stripe/stripe-js'

export const stripeInstance = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
)

