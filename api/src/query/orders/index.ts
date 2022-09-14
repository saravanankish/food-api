export default {
    getAllOrders: `
        SELECT * FROM orders WHERE orderDate > ? AND orderDate < ?
    `,
    getOrderById: `
        SELECT * FROM orders WHERE orderId=?
    `,
    placeOrder: `
        INSERT INTO orders (orderId, customerId, total, orderStatus, paymentType, deliveryAddress) VALUES (?, ?, ?, ?, ?, ?)
    `,
    getOrderItemAndOptions: `
        SELECT iqm.itemId, iqm.quantity, i.title as itemName, i.price, group_concat('{"id":',ios.optionId,',"name":"', vo.text, '","price": ' ,vo.price, '}' SEPARATOR '||') as options, sum(vo.price) as optionPrice from item_quantity_mapper iqm JOIN items i ON i.itemId=iqm.itemId JOIN item_options_selected ios ON iqm.id=ios.itemQuantityId JOIN variant_options vo ON ios.optionId=vo.id WHERE iqm.orderId=? GROUP BY iqm.itemId;
    `,
    updateOrderStatus: `
        UPDATE orders SET orderStatus=? WHERE orderId=?
    `,
    updateOrderStatusToDelivered: `
        UPDATE orders SET orderStatus=?, deliveryDate=? WHERE orderId=?
    `
}