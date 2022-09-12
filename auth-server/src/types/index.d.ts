export type ErrorResponse = {
    status: number,
    message: string,
    stack?: string
}

export type TokenResponse = {
    success: boolean,
    access_token: string,
    refresh_token: string,
    token_type: "Bearer"
}


export type User = {
    userId?: string,
    username: string,
    password: string,
    creationDate?: string,
    modifiedDate?: string,
    lastLogin?: string,
    role: "CUSTOMER" | "ADMIN",
    email: string,
    mobile_number: string,
    account_active?: 1 | 0,
    email_verified?: 1 | 0,
}