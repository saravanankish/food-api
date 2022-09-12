export default {
    getAddressByUserId: `
        SELECT * FROM address WHERE userId = ?;
    `,
    addAddress: `
        INSERT INTO address (door_no, street, area, city, state, pincode, contact_number, landmark, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
}