import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    /** This is an example. You can find me in types/next-auth.d.ts */
    session?: {
      user: {
        name: string
        email: string
        image: string
      }
      token: {
        sub: string
      }
    }
  }
  /** The OAuth profile returned from your provider */
  interface Profile {}
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    bar: number
  }
}
