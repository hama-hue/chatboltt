export type PaymentIntent = {
  amount: number;
  recipient: string;
  app: "gpay";
};

export function detectPaymentIntent(text: string): PaymentIntent | null {
  const regex =
    /(pay|send)\s*(₹|rs\.?|rupees?)?\s*(\d+)\s*(to)?\s*(.+?)\s*(using)?\s*(google pay|gpay)/i;

  const match = text.match(regex);
  if (!match) return null;

  return {
    amount: Number(match[3]),
    recipient: match[5].trim(),
    app: "gpay",
  };
}
