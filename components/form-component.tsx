"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  name: string
  mobile: string
  email: string
  interests: string
  ageGroup: string
  occupation: string
  pinCode: string
}

interface FormErrors {
  name?: string
  mobile?: string
  email?: string
  interests?: string
  pinCode?: string
}

interface FormComponentProps {
  onSuccess: (couponCode: string, interests: string) => void
}

export default function FormComponent({ onSuccess }: FormComponentProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    interests: "",
    ageGroup: "",
    occupation: "",
    pinCode: "",
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
      case "interests":
        return value.trim() === "" ? "Interests is required" : undefined
      case "pinCode":
        if (value !== "" && !/^\d{6}$/.test(value)) return "Enter a valid 6-digit PIN code"
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const isFormValid = () => {
    const requiredFields = ["name", "mobile", "interests"]
    return requiredFields.every((field) => {
      const value = formData[field as keyof FormData]
      return value.trim() !== "" && !validateField(field, value)
    })
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!isFormValid()) return

  //   setIsSubmitting(true)

  //   try {
  //     console.log("[v0] Submitting form data:", formData)

  //     // Existing Google Form submission
  //     const googleFormResponse = await fetch("/api/save", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     })

  //     console.log("[v0] Google Form response status:", googleFormResponse.status)

  //     const googleFormResult = await googleFormResponse.json()
  //     console.log("[v0] Google Form response data:", googleFormResult)

  //     if (!googleFormResult.success) {
  //       console.error("Google Form submission failed:", googleFormResult.error)
  //       alert(`Submission failed: ${googleFormResult.error}`)
  //       setIsSubmitting(false)
  //       return
  //     }

  //     // New API call for coupon issuance
  //     const couponApiPayload = {
  //       channelID: "WEB",
  //       requestID: "250000012",
  //       campaignID: "C100183",
  //       issuerMobileNo: formData.mobile,
  //       programID: "81",
  //     }

  //     const couponApiResponse = await fetch("https://test-cms.apeirosai.com/cms/api/v1/issueCoupon", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(couponApiPayload),
  //     })

  //     console.log("[v0] Coupon API response status:", couponApiResponse.status)

  //     const couponApiResult = await couponApiResponse.json()
  //     console.log("[v0] Coupon API response data:", couponApiResult)

  //     if (couponApiResponse.ok && couponApiResult.data?.couponCode) {
  //       console.log("[v0] Form submission successful, calling onSuccess with coupon code")
  //       onSuccess(couponApiResult.data.couponCode)
  //     } else {
  //       console.error("Coupon API submission failed:", couponApiResult.responseMessage || "No coupon code received")
  //       alert(`Coupon issuance failed: ${couponApiResult.responseMessage || "No coupon code received"}`)
  //     }
  //   } catch (error) {
  //     console.error("Network error:", error)
  //     alert("Network error occurred. Please try again.")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!isFormValid()) return
  setIsSubmitting(true)

  // Map Interests to Campaign IDs (replace with real IDs later)
  const campaignMap: Record<string, string> = {
    "Desktop & Laptops": "C100188", // default placeholder
    "Printers": "C100182",          // replace when you get real ID
    "Accessories": "C100184",       // replace when you get real ID
  }

  try {
    console.log("[v0] Submitting form data:", formData)

    // --- 1. Submit to Google Form ---
    const googleFormResponse = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    console.log("[v0] Google Form response status:", googleFormResponse.status)
    const googleFormResult = await googleFormResponse.json()
    console.log("[v0] Google Form response data:", googleFormResult)

    if (!googleFormResult.success) {
      console.error("Google Form submission failed:", googleFormResult.error)
      alert(`Submission failed: ${googleFormResult.error}`)
      return
    }

    // --- 2. Issue Coupon (Dynamic Campaign ID) ---
    const selectedCampaignID = campaignMap[formData.interests] || "C100183"
    const couponApiPayload = {
      channelID: "WEB",
      requestID: "250000012",
      campaignID: selectedCampaignID,
      issuerMobileNo: formData.mobile,
      programID: "81",
    }

    console.log("[v0] Coupon API payload:", couponApiPayload)

    const couponApiResponse = await fetch(
      "https://test-cms.apeirosai.com/cms/api/v1/issueCoupon",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponApiPayload),
      }
    )

    console.log("[v0] Coupon API response status:", couponApiResponse.status)
    const couponApiResult = await couponApiResponse.json()
    console.log("[v0] Coupon API response data:", couponApiResult)

    if (couponApiResponse.ok && couponApiResult.data?.couponCode) {
      console.log("[v0] Form submission successful, calling onSuccess with coupon code and interests:", formData.interests)
      onSuccess(couponApiResult.data.couponCode, formData.interests)
    } else {
      console.error("Coupon API submission failed:", couponApiResult.responseMessage || "No coupon code received")
      alert(`Coupon issuance failed: ${couponApiResult.responseMessage || "No coupon code received"}`)
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
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src="/hplogo.png" alt="HP World Logo" width={40} height={40} className="rounded-full" />
            <h1 className="text-2xl font-bold text-gray-800">HP World</h1>
            <p className="text-sm text-gray-500 -mt-1">- GEONET IT Mall</p>
          </div>
          <p className="text-gray-600 mb-0">Sign up and get a Gift Voucher of upto Rs&nbsp;5000</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
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
              Mobile Number <span className="text-destructive">*</span>
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
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address <span className="text-xs text-gray-500">(Optional)</span>
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
            <Label htmlFor="interests" className="text-sm font-medium text-foreground">
              Interests <span className="text-destructive">*</span>
            </Label>
            <Select
              name="interests"
              value={formData.interests}
              onValueChange={(value) => handleSelectChange("interests", value)}
            >
              <SelectTrigger
                className={`h-12 text-base transition-colors ${
                  errors.interests
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border focus-visible:ring-ring"
                }`}
              >
                <SelectValue placeholder="Select your interests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Desktop & Laptops">Desktop & Laptops</SelectItem>
                <SelectItem value="Printers">Printers</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            {errors.interests && <p className="text-destructive text-sm">{errors.interests}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageGroup" className="text-sm font-medium text-foreground">
              Age Group <span className="text-xs text-gray-500">(Optional)</span>
            </Label>
            <Select
              name="ageGroup"
              value={formData.ageGroup}
              onValueChange={(value) => handleSelectChange("ageGroup", value)}
            >
              <SelectTrigger
                className="h-12 text-base transition-colors border-border focus-visible:ring-ring"
              >
                <SelectValue placeholder="Select your age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-12">0-12</SelectItem>
                <SelectItem value="12-18">12-18</SelectItem>
                <SelectItem value="18-35">18-35</SelectItem>
                <SelectItem value="35-60">35-60</SelectItem>
                <SelectItem value="60+">60+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-sm font-medium text-foreground">
              Occupation <span className="text-xs text-gray-500">(Optional)</span>
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

          <div className="space-y-2">
            <Label htmlFor="pinCode" className="text-sm font-medium text-foreground">
              PIN Code <span className="text-xs text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="pinCode"
              name="pinCode"
              type="text"
              value={formData.pinCode}
              onChange={handleInputChange}
              className={`h-12 text-base transition-colors ${
                errors.pinCode
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:ring-ring"
              }`}
              placeholder="Enter 6-digit PIN code"
              maxLength={6}
            />
            {errors.pinCode && <p className="text-destructive text-sm">{errors.pinCode}</p>}
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