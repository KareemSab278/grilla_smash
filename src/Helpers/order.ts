import { API } from './API';
import type { KdsOrderPayload, orderResponse } from '../Types';

export const orders = {
    new: async (order: KdsOrderPayload): Promise<orderResponse> => {
        try {
            const response = await API.post('orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            console.log('Order response:', response);

            return response as orderResponse;

        } catch (error) {
            console.error('Error making order:', error);
            throw new Error('Failed to make order. Please try again.');
        }
    }
}