"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export default function SuccessScreen() {
  const [copied, setCopied] = useState(false)
  const couponCode = "ABCD2000"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <img
          src="/giftvoucher.png"
          alt="Gift voucher worth ₹2000"
          className="w-full h-auto rounded-xl shadow-xl select-none"
          draggable={false}
        />

        {/* Bottom overlay with code and copy */}
        <div className="absolute inset-x-0 bottom-4 px-4">
          <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-[11px] uppercase tracking-wider opacity-80">Your Voucher Code</div>
            <div className="text-2xl font-extrabold tracking-[0.2em]">{couponCode}</div>
            <Button
              onClick={copyToClipboard}
              size="sm"
              variant="secondary"
              className="bg-white text-black hover:bg-white/90"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
