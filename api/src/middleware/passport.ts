import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt"
import passport from "passport"
import jwksClient from "jwks-rsa"
import config from "config"
import { queryWithArgs } from "../utils/dbHelper"
import userQuery from "../query/user"
import { User } from "../types"

const cleanUserData = (user: any): void => {
    delete user.password
    delete user.creationDate
    delete user.modifiedDate
    delete user.lastLogin
    user.account_active = user.account_active.lastIndexOf(1) !== -1
    user.email_verified = user.email_verified.lastIndexOf(1) !== -1
}


const initPassport = async () => {
    const secret = await jwksClient({
        jwksUri: config.get("authServerUrl") as string + "/.well-known/jwks.json",
        cache: true,
        rateLimit: true,
    }).getSigningKey()



    var opts: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret.getPublicKey(),
    }

    passport.use(new Strategy(opts, async function (jwt_payload, done) {
        try {
            const result = await queryWithArgs(userQuery.selectUserByUsername, jwt_payload.username)
            if (result.length === 0)
                return done(null, false)
            if (result.length > 1)
                return done(null, false)
            const user: User = result[0]
            cleanUserData(user)
            return done(null, user)
        } catch (err) {
            done(err, false)
        }
    }));
}

export default initPassport