import { publicApiRequest } from "./products";
import { isLiveQuoteToken, type PublicQuotationItem } from "./quotations";

export type PublicOrderStatus =
  | "Awaiting Payment"
  | "Processing"
  | "Packed"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export type PublicOrder = {
  reference: string;
  quotation_reference: string;
  status: PublicOrderStatus;
  payment_status: "Unpaid" | "Paid";
  payment_method: string;
  customer_name: string;
  delivery_location: string;
  requested_delivery_date: string | null;
  items: PublicQuotationItem[];
  subtotal_centavos: number;
  delivery_centavos: number;
  total_centavos: number;
  paid_centavos: number;
  paid_at: string | null;
  packed_at: string | null;
  dispatched_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string | null;
};

const orderNetworkError =
  "We couldn’t reach IslaSource Seafoods right now. Please try again shortly.";

export function isLiveOrderToken(value: string): boolean {
  return isLiveQuoteToken(value);
}

export async function getPublicOrder(
  token: string,
  signal?: AbortSignal,
): Promise<PublicOrder> {
  const result = await publicApiRequest<{ data: PublicOrder }>(
    `/orders/${encodeURIComponent(token)}`,
    { signal },
    orderNetworkError,
  );
  return result.data;
}

export async function startOrderQrPhCheckout(
  token: string,
): Promise<{ checkout_url: string }> {
  const result = await publicApiRequest<{ data: { checkout_url: string } }>(
    `/orders/${encodeURIComponent(token)}/checkout`,
    { method: "POST" },
    orderNetworkError,
  );
  return result.data;
}

export async function verifyOrderPayment(token: string): Promise<PublicOrder> {
  const result = await publicApiRequest<{ data: PublicOrder }>(
    `/orders/${encodeURIComponent(token)}/verify-payment`,
    { method: "POST" },
    orderNetworkError,
  );
  return result.data;
}
