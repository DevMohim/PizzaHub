import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

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
  user: {
    additionalFields: {
      role: {
        type: ['customer' , 'vendor' , 'admin'],
        input: false,
        defaultValue: 'customer'
      },
    },
  },
});
