

export type MenuProduct = {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    popular?: boolean;
};


export type Branch = {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
};

export type MenuResponse = {
    products: MenuProduct[];

    mealSideOptions: MealOption[];

    drinkOptions: MealOption[];

    extrasByCategory: {
        burgers: Extra[];
        wraps: Extra[];
        chicken: Extra[];
        "loaded-fries": Extra[];
    };

    mealOptions: {
        name: string;
        price: number;
    }[];
};

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
    onBack: () => void
    onPrepareOrder: () => void
    error?: string
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
    storeId: string
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
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
    TEL?: string
    paymentId?: string
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
    order_id?: string
    message?: string
    error?: string
}


// export type MenuOption = {
//     name: string;
//     price: number;
//     is_protein?: boolean;
//     isProtein?: boolean;
//     category?: string;
// };


export type Extra = {
    id?: number;
    name: string;
    price: number;
    category?: string | undefined;
    isProtein?: boolean | undefined;
    is_protein?: boolean | undefined;
}


export type PayloadToSend = {
    orderData: {
        items: {
            extras: Extra[] | undefined;
            id: number;
            product: Product;
            quantity: number;
            meal?: MealSelection | null;
            sauceChoice?: string;
        }[];
        total: number;
        delivery: number;
        subtotal: number;
        isPickup: boolean;
        customer: customerInfo;
        storeId: string;
        status?: "pending" | "confirmed" | "completed" | "cancelled";
    };
    UID: string;
    TEL?: string;
    paymentId?: string;
}