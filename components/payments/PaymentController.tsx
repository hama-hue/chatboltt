"use client";

import { useEffect, useState } from "react";
import type { PaymentIntent } from "@/lib/payments/intent";
import { openGooglePay } from "@/lib/payments/gpay";
import { QrPaymentModal } from "./QrPaymentModal";

type Props = {
  intent: PaymentIntent | null;
  onComplete: () => void;
};

export function PaymentController({ intent, onComplete }: Props) {
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  // 🚫 No intent → do nothing
  if (!intent) return null;

  // ✅ Run payment only ONCE when intent becomes available
  useEffect(() => {
    openGooglePay(intent, {
      upiId: "merchant@okaxis", // TODO: replace with real UPI
      note: `Paying ${intent.recipient}`,
      onDesktop: (upiUrl) => {
        setUpiQrUrl(upiUrl);
      },
    });
  }, [intent]);

  return (
    <>
      {/* Desktop fallback QR */}
      {upiQrUrl && (
        <QrPaymentModal
          open={true}
          upiUrl={upiQrUrl}
          amount={intent.amount}
          name={intent.recipient}
          onClose={() => {
            setUpiQrUrl(null);
            onComplete();
          }}
        />
      )}
    </>
  );
}
