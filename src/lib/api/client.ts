import { getTokenFromClient } from "@/lib/getTokenFromClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "headers"> & {
  /** false হলে token পাঠানো হবে না (public route) */
  auth?: boolean;
  /** Server Component থেকে call করলে token এখানে দিতে হবে */
  token?: string;
  headers?: Record<string, string>;
};

export const apiFetch = async <T = unknown>(
  path: string,
  { auth = true, token: givenToken, headers, ...rest }: ApiOptions = {},
): Promise<T> => {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  // Server এ window নেই, তাই token না দিলে browser session থেকে নেওয়া হবে
  let token = givenToken;
  if (!token && auth && typeof window !== "undefined") {
    token = await getTokenFromClient();
  }

  if (auth && !token) {
    throw new ApiError(`Login করা নেই: ${path}`, 401);
  }

  const hasBody = rest.body !== undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      body.message || `Request failed (${res.status})`,
      res.status,
    );
  }

  return body as T;
};

export const withQuery = (
  path: string,
  params: Record<string, string | undefined> = {},
) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") sp.set(key, value);
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
};
