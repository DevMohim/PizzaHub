import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(),],
});

// Convenience exports for direct use (e.g. signUp.email, signIn.email)
export const { signUp, signIn, signOut, useSession } = authClient;
