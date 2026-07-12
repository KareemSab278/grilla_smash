import { loadStripe } from '@stripe/stripe-js'

const stripeInstance = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
)

export default stripeInstance