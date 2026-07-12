import type { orderData } from '../Types'


const stores: { [key: string]: { MID: string, TEL: string } } = {
    WALSALL: { MID: '0022887842', TEL: '08000668986' }
};

const sendOrderToStore = async (storeName: string, orderData: orderData): Promise<void> => {
    const store = stores[storeName.toUpperCase()];

    if (!store) {
        throw new Error(`Store ${storeName} not found.`);
    }

    const payload = {
        MID: store.MID,
        TEL: store.TEL,
        orderData
    };
    
    const shift4Url = '';

    try {
        const response = await fetch(shift4Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to send order to store ${storeName}.`);
        }
    } catch (error) {
        console.error('Error sending order to store:', error);
        throw error;
    }
}