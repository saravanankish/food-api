export default {
    getAddressById: `
        SELECT * FROM address WHERE id = ?
    `,
    getAddressByUserId: `
        SELECT * FROM address WHERE userId = ?;
    `,
    addAddress: `
        INSERT INTO address (door_no, street, area, city, state, pincode, contact_number, landmark, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    updateAddress: `
        UPDATE address SET door_no=?, street=?, area=?, city=?, state=?, pincode=?, contact_number=?, landmark=?, userId=? WHERE id=?
    `
}