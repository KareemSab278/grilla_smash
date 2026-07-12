// file will handle stripe payments here

export const pay = async (
    amount: number
): Promise<PaymentIntentResponse> => {
    if (amount <= 0) {
        return {
            success: false,
            error: "Amount must be greater than zero."
        };
    }

    try {
        const res = await fetch("http://localhost:3000/api/payments/create-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
                currency: "gbp",
            }),
        });

        if (!res.ok) {
            return { success: false, error: "Server error creating payment intent." };
        }

        const data = await res.json();

        console.log("PaymentIntent response:", data);

        return data;

    } catch (e) {
        console.error("Error creating PaymentIntent:", e);

        return {
            success: false,
            error: "Failed to start payment. Please try again."
        };
    }
};

export type PaymentIntentResponse = {
    success: boolean;
    client_secret?: string;
    payment_intent_id?: string;
    amount?: number;
    currency?: string;
    error?: string;
};