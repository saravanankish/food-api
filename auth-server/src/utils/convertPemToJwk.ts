import fs from "fs"
// @ts-ignore
import rsaPemToJwk from "rsa-pem-to-jwk"


const convertPemToJwks = () => {
    const privateKey = fs.readFileSync("./certificates/private.pem")
    if (!privateKey) throw new Error("private.pem not found")
    const jwk = rsaPemToJwk(privateKey.toString(), { use: "sig" }, "public")
    fs.writeFileSync("public/.well-known/jwks.json", JSON.stringify({ keys: [jwk] }))
}

export default convertPemToJwks