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
    const [orderNumber, setOrderNumber] = useState<string | null>(null)

    useEffect(() => {
        const submitOrder = async () => {
            const pendingOrder = parsePendingOrder()
            if (!pendingOrder) {
                setOrderNumber(null)
                return
            }

            const parsedPaymentId = getPaymentIdFromQuery()
            const payload: KdsOrderPayload = {
                ...pendingOrder,
                paymentId: parsedPaymentId ?? pendingOrder.paymentId,
            }

            console.log('[Order] sending to backend:', JSON.stringify(payload, null, 2))

            try {
                const result = await orders.new(payload as KdsOrderPayload)
                if (result.order_id) {
                    setOrderNumber(result.order_id)
                    sessionStorage.removeItem(ORDER_STORAGE_KEY)
                } else {
                    setOrderNumber(null)
                }
            } catch (error) {
                console.error('Error submitting order after payment:', error)
                setOrderNumber(null)
            }
        }

        void submitOrder()
    }, [])

    const handleOrderAgain = () => {
        navigate('/')
    }

    return (
        <>
            <SuccessMessage
                orderNumber={orderNumber}
                handleOrderAgain={handleOrderAgain}
            />
        </>
    )
}