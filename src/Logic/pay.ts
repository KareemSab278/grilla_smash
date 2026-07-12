// file will handle stripe payments here

export const pay = async (amount: number): Promise<PaymentIntentResponse> => {
    if (amount <= 0) {
        return { success: false, error: 'Amount must be greater than zero.' };
    }

    try {


        const response = {
            success: true,
            client_secret: 'test_client_secret',
            payment_intent_id: 'test_payment_intent_id',
            amount,
            currency: 'gbp'
        };

        console.log('=====================================');
        console.log('PaymentIntent response:', response);
        console.log('=====================================');
        return response as PaymentIntentResponse;
    } catch (e) {
        console.error('Error creating PaymentIntent:', e);
        return { success: false, error: 'Failed to start payment. Please try again.' };
    }
}

export type PaymentIntentResponse = {
    success: boolean;
    client_secret?: string;
    payment_intent_id?: string;
    amount?: number;
    currency?: string;
    error?: string;
};