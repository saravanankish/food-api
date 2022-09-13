export type ErrorResponse = {
    status: number,
    message: string,
    stack?: string
}

export type User = {
    userId?: string,
    username: string,
    password: string,
    creationDate?: Date,
    modifiedDate?: Date,
    lastLogin?: string,
    role: "CUSTOMER" | "ADMIN",
    email: string,
    mobile_number: string,
    account_active?: 1 | 0,
    email_verified?: 1 | 0,
}

export type Address = {
    id?: number,
    area: string,
    city: string,
    door_no: string,
    landmark?: string,
    pincode: string,
    state: string,
    street: string,
    contact_number: string,
    userId: string,
}

export type Item = {
    itemId: string,
    title: string,
    description: string,
    image: string,
    price: number,
    creationDate?: Date,
    modifiedDate?: Date,
    images?: Array<string>
}

export type Variants = {
    id: string,
    title: string,
    itemId?: string,
    creationDate?: Date,
    modifiedDate?: Date,
    options?: Array<VariantOptions>
}

export type VariantOptions = {
    id: number,
    text: string,
    price: number,
    itemVariantsId?: string
}