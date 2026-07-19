

export type MenuProduct = {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    popular?: boolean;
};


export type MenuOption = {
    name: string;
    price: number;
    is_protein?: boolean;
    isProtein?: boolean;
    category?: string;
};


export type MenuResponse = {
    products: MenuProduct[];

    mealSideOptions: MealOption[];

    drinkOptions: MealOption[];

    extrasByCategory: {
        burgers: MenuOption[];
        wraps: MenuOption[];
        chicken: {
            name: string;
            price: number;
        }[];
        "loaded-fries": MenuOption[];
    };

    mealOptions: {
        name: string;
        price: number;
    }[];
};


export type Extra = {
    name: string
    price: number
    isProtein?: boolean
}

export type MealOption = {
    id: number
    name: string
    price: number
}

export type MealSelection = {
    drink: MealOption
    side: MealOption
}

export type Product = {
    id: number
    name: string
    category: string
    price: number
    description: string
    image: string
    popular?: boolean
    ingredients?: string[]
}

export type OrderForm = {
    fullName: string
    phone: string
    email: string
    address1: string
    address2?: string
    city: string
    postcode: string
    cardNumber: string
    expiry: string
    cvv: string
}

export type CheckoutFormProps = {
    form: OrderForm
    onChange: (field: keyof OrderForm, value: string) => void
    onSubmit: (token: string) => Promise<void>
    onBack: () => void
    error?: string
    isSubmitting?: boolean
    subtotal: number
    delivery: number
    total: number
    disableCheckout?: boolean
    isPickup: boolean
    onTogglePickup: () => void
}

export type orderData = {
    items: CartItem[]
    total: number
    delivery: number
    subtotal: number
    isPickup: boolean
    customer: customerInfo
    storeId: number
}

export type CartItem = {
    id: number
    product: Product
    quantity: number
    extras?: Extra[]
    meal?: MealSelection | null
    sauceChoice?: string
}

export type KdsOrderPayload = {
    UID: string
    orderData: orderData
}

export type customerInfo = {
    fullName: string
    phone: string
    email: string
    address1: string
    address2?: string
    city: string
    postcode: string
}

export type orderResponse = {
    status: 200 | 400 | 500 | number
    order_id?: number
    message?: string
    error?: string
}
