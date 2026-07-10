export type { Product, CartItem, OrderForm, CheckoutFormProps, Extra, MealSelection }

type Extra = {
    name: string
    price: number
    isProtein?: boolean
}

type MealSelection = {
    drink: Product
    side: Product
}

type Product = {
    id: number
    name: string
    category: string
    price: number
    description: string
    image: string
    popular?: boolean
    ingredients?: string[]
}

type CartItem = {
    product: Product
    quantity: number
    extras?: Extra[]
    meal?: MealSelection | null
    sauceChoice?: string
}

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
