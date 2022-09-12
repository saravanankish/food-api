export default {
    getAllItems: `
        SELECT 
            i.itemId as itemId, 
            title, 
            description,
            image,
            price, 
            creationDate, 
            modifiedDate,
            group_concat(img.url) as images
            FROM items i 
            LEFT JOIN items_images img ON i.itemId=img.itemId
            WHERE i.deleted=0
            GROUP BY img.itemId
    `,
    addItems: `
        INSERT INTO items (itemId, title, description, image, price) VALUES ?
    `,
    findItemById: `
        SELECT 
        i.itemId as itemId, 
        title, 
        description,
        image,
        price, 
        creationDate, 
        modifiedDate,
        group_concat(img.url) as images
        FROM items i 
        LEFT JOIN items_images img ON i.itemId=img.itemId 
        WHERE i.itemId=?
        GROUP BY img.itemId
    `,
    updateItem: `
        UPDATE items SET title=?, description=?, image=?, price=? WHERE itemId=?
    `,
    deleteItemById: `
        UPDATE items SET deleted=1 WHERE itemId=?
    `
}