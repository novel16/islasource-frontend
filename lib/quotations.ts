import { apiEndpoints, publicApiRequest } from "./api";
import type { ProductUnit } from "./products";

export type PublicQuotationStatus =
  | "Sent"
  | "Accepted"
  | "Declined"
  | "Expired"
  | "Superseded"
  | "Cancelled";

export type PublicQuotationItem = {
  id: number;
  product_name: string;
  unit: ProductUnit;
  quantity: string;
  specs: string;
  is_available: boolean;
  line_selling_centavos: number;
};

export type PublicQuotation = {
  reference: string;
  rfq_reference: string;
  version: number;
  status: PublicQuotationStatus;
  customer_name: string;
  delivery_location: string;
  requested_delivery_date: string | null;
  items: PublicQuotationItem[];
  subtotal_centavos: number;
  delivery_centavos: number;
  total_centavos: number;
  deposit_percent: number;
  deposit_centavos: number;
  balance_centavos: number;
  validity_hours: number;
  valid_until: string | null;
  terms: string;
  sent_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  decline_reason: string;
  cancelled_at: string | null;
  order_reference: string | null;
  order_token: string | null;
};

const quoteNetworkError =
  "We couldn’t reach IslaSource Seafoods right now. Please try again shortly.";

export function isLiveQuoteToken(value: string): boolean {
  return /^[A-Za-z0-9]{64}$/.test(value);
}

export async function getPublicQuotation(
  token: string,
  signal?: AbortSignal,
): Promise<PublicQuotation> {
  const result = await publicApiRequest<{ data: PublicQuotation }>(
    apiEndpoints.quotation(token),
    { signal },
    quoteNetworkError,
  );
  return result.data;
}

export async function acceptPublicQuotation(
  token: string,
): Promise<PublicQuotation> {
  const result = await publicApiRequest<{ data: PublicQuotation }>(
    apiEndpoints.quotationAccept(token),
    {
      method: "POST",
      body: JSON.stringify({ terms_accepted: true }),
    },
    quoteNetworkError,
  );
  return result.data;
}

export async function declinePublicQuotation(
  token: string,
  reason = "",
): Promise<PublicQuotation> {
  const result = await publicApiRequest<{ data: PublicQuotation }>(
    apiEndpoints.quotationDecline(token),
    {
      method: "POST",
      body: JSON.stringify({ reason: reason.trim() }),
    },
    quoteNetworkError,
  );
  return result.data;
}
