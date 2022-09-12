export default {
    selectUserByUsername: `
        SELECT * FROM users WHERE username = ?
    `,
    selectUserByUserId: `
        SELECT * FROM users WHERE userId = ?
    `,
}
