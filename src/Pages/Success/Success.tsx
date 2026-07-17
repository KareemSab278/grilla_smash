// later impl
// shows the payment went through successfully and the user can now go back to the home page
// also shows the order number and the total amount paid

import { SuccessMessage } from "../App/Helpers/Components"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const Success = () => {
    const navigate = useNavigate()
    const [orderNumber, setOrderNumber] = useState<number | null>(null)

    const handleOrderAgain = () => {
        navigate('/')
    }

    return (
        <SuccessMessage orderNumber={orderNumber ?? 0} handleOrderAgain={handleOrderAgain} />
    )
}