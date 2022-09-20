const loginRequestOne = {
    username: "customer",
    password: "password"
}

const loginRequestTwo = {
    username: "",
    password: "password"
}

const loginRequestThree = {
    username: "customer",
    password: ""
}

const loginRequestInvalid = {
    username: "invalid",
    password: "invalid"
}

const bufferOne = Buffer.alloc(1)
bufferOne.writeInt8(1)

const bufferZero = Buffer.alloc(1)
bufferZero.writeInt8(0)

const userOne = {
    userId: "1234",
    username: "customer",
    password: "$2b$05$i2bERNAm1ypXhv1hFD38c.B42BHbQGAbCVIHz9RkGBrcEB6fbad8K", //password
    creationDate: new Date(),
    modifiedDate: new Date(),
    lastLogin: null,
    account_active: bufferOne,
    email_verified: bufferOne,
}
const userTwo = {
    userId: "5678",
    username: "admin",
    password: "$2b$05$F54XmKuM73C0Vfq02Jy2YOSWpkxlMoZd5V9L2LNuEEK6xTaAWiDyu", //invalid
    creationDate: new Date(),
    modifiedDate: new Date(),
    lastLogin: null,
    account_active: bufferOne,
    email_verified: bufferOne,
}
const userUnverifiedEmail = {
    userId: "5678",
    username: "admin",
    password: "$2b$05$F54XmKuM73C0Vfq02Jy2YOSWpkxlMoZd5V9L2LNuEEK6xTaAWiDyu", //invalid
    creationDate: new Date(),
    modifiedDate: new Date(),
    lastLogin: null,
    account_active: bufferOne,
    email_verified: bufferZero,
}
const userInActive = {
    userId: "5678",
    username: "admin",
    password: "$2b$05$F54XmKuM73C0Vfq02Jy2YOSWpkxlMoZd5V9L2LNuEEK6xTaAWiDyu", //invalid
    creationDate: new Date(),
    modifiedDate: new Date(),
    lastLogin: null,
    account_active: bufferZero,
    email_verified: bufferOne,
}


module.exports = {
    loginRequestOne,
    userOne,
    userTwo,
    userInActive,
    userUnverifiedEmail,
    loginRequestTwo,
    loginRequestThree,
    loginRequestInvalid
}