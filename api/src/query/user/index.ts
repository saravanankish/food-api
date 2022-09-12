export default {
    addUser: `
        INSERT INTO users (userId, username, password, role, email, mobile_number) VALUES (?, ?, ?, ?, ?, ?)
    `,
    selectUserByUsername: `
        SELECT * FROM users WHERE username = ?
    `,
}
