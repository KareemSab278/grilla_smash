
export const pay = {
    startCheckout: async (total: number) => {

        if (total <= 0) {
            throw new Error("Total amount must be greater than zero.");
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}payments/checkout-session?amount=${Math.round(total * 100)}&currency=GBP`
        )

        console.log('Checkout session response:', response);
        const data = await response.json()

        if (!response.ok || !data?.success || !data?.clientSecret) {
            throw new Error(data?.error_message || 'Failed to create checkout session.')
        }

        return data
    },
    makePayment: async (
        amount: number,
        token: string
    ): Promise<PaymentResponse> => {
        if (amount <= 0) {
            return {
                success: false,
                error: "Amount must be greater than zero."
            };
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}charge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100),
                    currency: "gbp",
                    token,
                }),
            });

            if (!res.ok) {
                return { success: false, error: "Server error processing payment." };
            }

            const data = await res.json();

            console.log("Payment response:", data);

            return data;

        } catch (e) {
            console.error("Error processing payment:", e);

            return {
                success: false,
                error: "Failed to process payment. Please try again."
            };
        }
    }
}

interface PaymentResponse extends healthyResponse {
    success: boolean;
    error?: string;
    error_message?: Error | string;
}

interface healthyResponse {
    success: boolean;
    charge_id?: string;
    amount?: number;
    currency?: string;
    status?: number;
};