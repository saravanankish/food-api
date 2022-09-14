enum PaymentType {
    COD = 1,
    CREDIT_CARD,
    DEBIT_CARD,
    UPI,
    EMI,
}

export enum OrderStatus {
    PENDING_PAYMENT = 1,
    PLACED,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}

export default PaymentType