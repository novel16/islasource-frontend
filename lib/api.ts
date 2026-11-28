export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
)
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/i, "");

export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export const apiEndpoints = {
  seafood: "/seafood",
  seafoodDetail: (slug: string) => `/seafood/${encodeURIComponent(slug)}`,
  quoteRequests: "/quote-requests",
  quoteRequestSendCode: "/quote-requests/send-code",
  quoteRequestSchedule: (token: string) =>
    `/quote-requests/schedule/${encodeURIComponent(token)}`,
  quoteRequestScheduleRespond: (token: string) =>
    `/quote-requests/schedule/${encodeURIComponent(token)}/respond`,
  quotation: (token: string) => `/quotations/${encodeURIComponent(token)}`,
  quotationAccept: (token: string) =>
    `/quotations/${encodeURIComponent(token)}/accept`,
  quotationDecline: (token: string) =>
    `/quotations/${encodeURIComponent(token)}/decline`,
  order: (token: string) => `/orders/${encodeURIComponent(token)}`,
  orderCheckout: (token: string) =>
    `/orders/${encodeURIComponent(token)}/checkout`,
  orderVerifyPayment: (token: string) =>
    `/orders/${encodeURIComponent(token)}/verify-payment`,
  orderMessages: (token: string) =>
    `/orders/${encodeURIComponent(token)}/messages`,
} as const;

export class PublicApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

export async function publicApiRequest<T>(
  path: string,
  init: RequestInit = {},
  networkError = "We couldn’t connect to the seafood catalog. Please try again shortly.",
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_V1_URL}${path}`, {
      ...init,
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new PublicApiError(0, networkError);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const record =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};
    const rawErrors = record.errors;
    const errors: Record<string, string[]> = {};
    if (typeof rawErrors === "object" && rawErrors !== null) {
      for (const [key, value] of Object.entries(rawErrors)) {
        if (
          Array.isArray(value) &&
          value.every((item) => typeof item === "string")
        ) {
          errors[key] = value;
        }
      }
    }
    throw new PublicApiError(
      response.status,
      typeof record.message === "string"
        ? record.message
        : "We couldn’t complete that request. Please try again.",
      errors,
    );
  }
  if (body === null) {
    throw new PublicApiError(
      502,
      "We couldn’t read the response. Please try again.",
    );
  }
  return body as T;
}
