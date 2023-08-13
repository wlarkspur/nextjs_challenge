import { withIronSessionApiRoute } from "iron-session/next"

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number
        }
    }
}

const cookieOptions = {
    cookieName: "challengesession",
    password: "Codechallengecarrotmarketissuperchallenging!"
}

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions)
}