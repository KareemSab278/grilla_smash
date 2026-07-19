// later impl
// shows the payment went through successfully and the user can now go back to the home page
// also shows the order number and the total amount paid

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SuccessMessage } from "../App/Helpers/Components"
import { orders } from "../../Helpers/order"
import type { KdsOrderPayload } from "../../Types"

const ORDER_STORAGE_KEY = 'grilla_pending_order'

const parsePendingOrder = (): KdsOrderPayload | null => {
    try {
        const raw = sessionStorage.getItem(ORDER_STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as KdsOrderPayload
    } catch (error) {
        console.error('Unable to parse pending order from storage:', error)
        return null
    }
}

const getPaymentIdFromQuery = () => {
    const params = new URLSearchParams(window.location.search)
    return (
        params.get('paymentId') ||
        params.get('session_id') ||
        params.get('checkoutSessionId') ||
        params.get('charge_id') ||
        params.get('id') ||
        undefined
    )
}

export const Success = () => {
    const navigate = useNavigate()
    const [orderNumber, setOrderNumber] = useState<number | null>(null)
    const [statusMessage, setStatusMessage] = useState('Finalizing your order...')

    useEffect(() => {
        const submitOrder = async () => {
            const pendingOrder = parsePendingOrder()
            if (!pendingOrder) {
                setStatusMessage('Payment succeeded, but no pending order was found.')
                setOrderNumber(0)
                return
            }

            const paymentId = getPaymentIdFromQuery()
            const payload: KdsOrderPayload = {
                ...pendingOrder,
                paymentId: paymentId ?? pendingOrder.paymentId,
            }

            try {
                const result = await orders.new(payload)
                if (result.order_id) {
                    setOrderNumber(Number(result.order_id) || 0)
                    setStatusMessage('Order created successfully.')
                    sessionStorage.removeItem(ORDER_STORAGE_KEY)
                } else {
                    setStatusMessage(result.message || 'Payment succeeded, but order ID was not returned.')
                    setOrderNumber(0)
                }
            } catch (error) {
                console.error('Error submitting order after payment:', error)
                setStatusMessage('Payment succeeded, but order submission failed. Please contact support.')
                setOrderNumber(0)
            }
        }

        void submitOrder()
    }, [])
    
    const handleOrderAgain = () => {
        navigate('/')
    }

    return (
        <>
            <SuccessMessage orderNumber={orderNumber ?? 0} handleOrderAgain={handleOrderAgain} />
            <p style={{ color: '#ccc', textAlign: 'center', marginTop: 12 }}>{statusMessage}</p>
        </>
    )
}