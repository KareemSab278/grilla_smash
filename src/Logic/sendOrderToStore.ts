import type { orderData } from '../Types'

const stores: { [key: string]: { UID: string, TEL: string } } = {
    WALSALL: { UID: '', TEL: '' }
}

export const sendOrderToStore = async (storeName: string, orderData: orderData): Promise<void> => {
    const store = stores[storeName.toUpperCase()]

    if (!store) {
        throw new Error(`Store ${storeName} not found.`)
    }

    const payload = {
        UID: store.UID,
        TEL: store.TEL,
        orderData
    }

    console.log('Sending order to store:', storeName, payload)

    const shift4Url = ''

    try {
        const response = await fetch(shift4Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`Failed to send order to store ${storeName}.`)
        }
    } catch (error) {
        console.error('Error sending order to store:', error)
        throw error
    }
}
