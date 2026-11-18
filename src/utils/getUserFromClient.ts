'use client'
import { useSession } from "@/lib/auth-client";

export const useUserFromClient = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return user;
};