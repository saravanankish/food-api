export default {
    createAction: `
        INSERT INTO actions (userId, actionType, orderId, itemId, variantId) VALUES (?, ?, ?, ?, ?)
    `
}