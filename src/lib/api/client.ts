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
  auth?: boolean;
  /** Server Component থেকে দিলে এটি ব্যবহার হবে */
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

  const token =
    givenToken ??
    (auth && typeof window !== "undefined"
      ? await getTokenFromClient()
      : undefined);

      console.log('token' , token)

  const hasBody = rest.body !== undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });
  console.log('respose ' , res)

  const body = await res.json().catch(() => ({}));
  console.log(res, "respose")

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
