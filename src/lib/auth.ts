import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB_NAME ?? "PizzaHub");

const ALLOWED_SIGNUP_ROLES = ["customer", "vendor"] as const;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "https://pizza-hub-black.vercel.app",
  ],
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
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
      },
      isBlocked: {
        type: "boolean",
        required: false,
        input: false,
        defaultValue: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "free",
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Public sign-up এ admin হওয়া যাবে না
          const requested = (user as { role?: string }).role;
          const role = ALLOWED_SIGNUP_ROLES.includes(requested as never)
            ? requested
            : "customer";

          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
            },
          };
        },
      },
      update: {
        before: async (data) => {
          // Profile update দিয়ে role বদলানো যাবে না
          const rest = Object.fromEntries(
            Object.entries(data as Record<string, unknown>).filter(
              ([key]) => key !== "role",
            ),
          );
          return { data: rest };
        },
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password ?? "");
        const valid =
          password.length >= 6 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password);

        if (!valid) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 6 characters with one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },

  plugins: [jwt()],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
