"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface SuccessScreenProps {
  couponCode: string
  interests: string
}

export default function SuccessScreen({ couponCode, interests }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }
  console.log("Received interests in SuccessScreen:", interests);
  const imageMap: Record<string, string> = {
  "Desktop & Laptops": "/desktop.png",
  "Printers": "/printer.png",
  "Accessories": "/accessories.png",
};

const selectedImage = imageMap[interests] || "/giftvoucher.png";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <img
          src={selectedImage}
          alt={`Gift voucher for ${interests}`}
          className="w-full h-auto rounded-xl shadow-xl select-none"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-30 sm:bottom-30 px-3 sm:px-4">
          <div className="bg-black/60 backdrop-blur-sm text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-[11px] uppercase tracking-wider opacity-80 whitespace-nowrap">
              Code
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