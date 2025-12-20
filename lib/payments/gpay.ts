import { isMobileDevice } from "./device";
import type { PaymentIntent } from "./intent";

export function openGooglePay(
  intent: PaymentIntent,
  options?: {
    upiId: string;
    note?: string;
    onDesktop?: (upiUrl: string) => void;
  }
) {
  const upiUrl =
    `upi://pay?pa=${options?.upiId}` +
    `&pn=${encodeURIComponent(intent.recipient)}` +
    `&am=${intent.amount}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(options?.note ?? "Payment")}`;

  if (isMobileDevice()) {
    window.location.href = upiUrl;
  } else {
    options?.onDesktop?.(upiUrl);
  }
}
