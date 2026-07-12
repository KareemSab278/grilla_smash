export const chargeDeliveryFee = (distance: number | null) => {
    if (distance === null || distance <= 0) {
        return 0; // this is a pickup order, no delivery fee
    }

    // Calculate delivery fee based on distance
    if (distance <= 5) {
        return 2.5; // £2.50 for distances up to 5 miles
    } else if (distance <= 10) {
        return 5; // £5 for distances between 5 and 10 miles
    } else {
        return 10; // £10 for distances over 10 miles
    }

}