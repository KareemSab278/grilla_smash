import { API } from './API';
import type { KdsOrderPayload, orderResponse, PayloadToSend } from '../Types';


export const orders = {
    new: async (order: KdsOrderPayload): Promise<orderResponse> => {
        const payloadToSend: PayloadToSend = {
            ...order,
            orderData: {
                ...order.orderData,
                items: order.orderData.items.map((item) => ({
                    ...item,
                    extras: item.extras?.map((extra) => ({
                        ...extra,
                        is_protein: extra.is_protein ?? extra.isProtein,
                        isProtein: extra.isProtein ?? extra.is_protein,
                    })),
                })),
            },
            paymentId: order.paymentId ?? 'ERROR GETTING PAYMENT ID',
        }

        console.log('[Order] payload sent to backend:', JSON.stringify(payloadToSend, null, 2));
        console.log("=====================================");
        console.log('[Order] payload.paymentId sent to backend (raw):', payloadToSend.paymentId);


        try {
            const response = await API.post('orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadToSend as PayloadToSend),
            });

            console.log('Order response:', response);

            return response as orderResponse;

        } catch (error) {
            console.error('Error making order:', error);
            throw new Error('Failed to make order. Please try again.');
        }
    }
}