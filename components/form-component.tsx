"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  name: string
  mobile: string
  email: string
  occupation: string
}

interface FormErrors {
  name?: string
  mobile?: string
  email?: string
}

interface FormComponentProps {
  onSuccess: () => void
}

export default function FormComponent({ onSuccess }: FormComponentProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    occupation: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real-time validation
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : undefined
      case "mobile":
        if (value === "") return "Mobile number is required"
        if (!/^[6-9]\d{9}$/.test(value)) return "Enter valid 10-digit mobile number starting with 6-9"
        return undefined
      case "email":
        // Only validate format if email is provided
        if (value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address"
        return undefined
      default:
        return undefined
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const isFormValid = () => {
    const requiredFields = ["name", "mobile"]
    return requiredFields.every((field) => {
      const value = formData[field as keyof FormData]
      return value.trim() !== "" && !validateField(field, value)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) return

    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting form data:", formData)

      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Response status:", response.status)

      const result = await response.json()
      console.log("[v0] Response data:", result)

      if (result.success) {
        console.log("[v0] Form submission successful, calling onSuccess")
        onSuccess()
      } else {
        console.error("Submission failed:", result.error)
        alert(`Submission failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/hplogo.png" alt="HP World Logo" width={40} height={40} className="rounded-full" />
            <h1 className="text-2xl font-bold text-gray-800">HP World</h1>
          </div>
          <p className="text-gray-600 mb-6">Sign up and get a gift voucher of Upto Rs 5000</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`h-12 text-base transition-colors ${
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:ring-ring"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm font-medium text-foreground">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleInputChange}
              className={`h-12 text-base transition-colors ${
                errors.mobile
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:ring-ring"
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {errors.mobile && <p className="text-destructive text-sm">{errors.mobile}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email Address <span className="text-xs">(Optional)</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`h-12 text-base transition-colors ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:ring-ring"
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-sm font-medium text-muted-foreground">
              Occupation <span className="text-xs">(Optional)</span>
            </Label>
            <Input
              id="occupation"
              name="occupation"
              type="text"
              value={formData.occupation}
              onChange={handleInputChange}
              className="h-12 text-base border-border focus-visible:ring-ring transition-colors"
              placeholder="Enter your occupation"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Claim Your Voucher"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">Your information is secure and will not be shared</p>
        </div>
      </div>
    </div>
  )
}
