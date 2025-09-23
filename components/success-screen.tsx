"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export default function SuccessScreen() {
  const [copied, setCopied] = useState(false)

  const generateCouponCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let out = "HP-"
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
    return out
  }
  const couponCode = useMemo(() => generateCouponCode(), [])

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

        <div className="absolute inset-x-0 bottom-3 sm:bottom-4 px-3 sm:px-4">
          <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-[11px] uppercase tracking-wider opacity-80 whitespace-nowrap">
              Your Voucher Code
            </div>
            <div className="flex-1 min-w-0 text-center font-extrabold text-xl sm:text-2xl tracking-[0.12em] sm:tracking-[0.2em] truncate">
              {couponCode}
            </div>
            <Button
              onClick={copyToClipboard}
              size="icon"
              variant="secondary"
              className="bg-white text-black hover:bg-white/90 shrink-0 w-9 h-9 sm:w-auto sm:h-9 sm:px-3"
              aria-label={copied ? "Copied code" : "Copy code"}
              disabled={copied}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
              <span className="hidden sm:inline ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
