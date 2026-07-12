// handles Shift4 payments

export const pay = async (
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
        const res = await fetch("http://localhost:3000/api/payments/charge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
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
};

export type PaymentResponse = {
    success: boolean;
    error?: string;
};
