import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { connectToDatabase } from "../../../utils/database"
import mongoose, {ConnectOptions} from 'mongoose';
import { NextApiRequest, NextApiResponse } from "next"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const {db} = await connectToDatabase();
  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM
      }),
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
        async profile(profile) {
          profile.id = profile.sub;
          // console.log('picture: ',profile.picture);
          // profile.picture = await fetch(profile.picture).then(res => res);
          console.log('profile: ',profile);
          return profile;
        }
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        profile(profile) {
          console.log('profile: ',profile);
          return profile;
        }
      }),
    ],
    
    adapter: MongoDBAdapter({
      db: () => db,
      ObjectId: mongoose.Types.ObjectId,
    }),
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,
  
    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.SECRET,
  
    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      jwt: true,
  
      // Seconds - How long until an idle session expires and is no longer valid.
      // maxAge: 30 * 24 * 60 * 60, // 30 days
  
      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      // updateAge: 24 * 60 * 60, // 24 hours
    },
  
    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
      // Set to true to use encryption (default: false)
      // encryption: true,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },
  
    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
      // signIn: '/auth/signin',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },
  
    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      // async signIn(user, account, profile) { return true },
      // async redirect(url, baseUrl) { return baseUrl },
      session(session: any) { 
        console.log('session: ', session);
        // console.log('user: ', user);
        return session; 
      },
      // async jwt(token, user, account, profile, isNewUser) { return token }
    },
  
    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},
  
    // Enable debug messages in the console if you are having problems
    debug: false,
  });
}
