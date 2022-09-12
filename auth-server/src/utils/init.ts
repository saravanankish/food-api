import fs from "fs"
import convertPemToJwks from "./convertPemToJwk"

const initApp = () => {
    const result = fs.readFileSync("./public/.well-known/jwks.json")
    const keys = JSON.parse(result.toString())
    if (keys.keys.length === 0) {
        convertPemToJwks()
    }
}

export default initApp