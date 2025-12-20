"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";

type QrPaymentModalProps = {
  open: boolean;
  amount: number;
  name: string;
  upiUrl: string;
  onClose: () => void;
};

export function QrPaymentModal({
  open,
  amount,
  name,
  upiUrl,
  onClose,
}: QrPaymentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[340px] rounded-xl bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-center">
          Pay ₹{amount} to {name}
        </h2>

        <p className="mt-1 text-center text-xs text-muted-foreground">
          Scan with Google Pay, PhonePe, or Paytm
        </p>

        <div className="my-4 flex justify-center">
          <QRCodeCanvas
            value={upiUrl}
            size={220}
            includeMargin
            level="M"
          />
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
