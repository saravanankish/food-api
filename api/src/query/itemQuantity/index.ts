export default {
    createItemQuantity: `
        INSERT INTO item_quantity_mapper (id, itemId, orderId, quantity) VALUES (?, ?, ?, ?)
    `,
    createOptionSelected: `
        INSERT INTO item_options_selected (orderId, itemQuantityId, optionId) VALUES ?
    `
}