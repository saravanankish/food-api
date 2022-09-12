export default {
    deleteItemImages: `
        DELETE FROM items_images WHERE itemId=?
    `,
    deleteItemImageByUrl: `
        DELETE FROM items_images WHERE url=?
    `,
    addItemImages: `
        INSERT INTO items_images (url, itemId) VALUES ?
    `,
    getAllItemImages: `
        SELECT url FROM items_images WHERE itemId=?
    `,
}