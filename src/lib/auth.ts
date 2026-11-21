import { betterAuth} from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from 'better-auth/plugins'

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);
const db = client.db('PizzaHub');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "customer",
        options: ["customer", "vendor"],
      },
      status: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "active",
        options: ["active", "blocked"],
      },
      plan: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "free",
      },
      
    },
  },
  plugins : [
    jwt()
  ],
  session : {
    cookieCache: {
      enabled:true,
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60
    }
  }
});
