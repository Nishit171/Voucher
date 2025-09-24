"use client"

import { useState, useEffect } from "react"
import FormComponent from "@/components/form-component"
import SuccessScreen from "@/components/success-screen"

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [interests, setInterests] = useState("");

  useEffect(() => {
  console.log("Current interests state:", interests);
}, [interests]);

  const handleFormSuccess = (couponCode: string, interests: string) => {
  console.log("handleFormSuccess called with:", { couponCode, interests });
  setCouponCode(couponCode);
  setInterests(interests);
  setShowSuccess(true);
  console.log("Parent component set interests:", interests);
};

  return (
    <>
      {showSuccess && couponCode ? (
        <SuccessScreen couponCode={couponCode} interests={interests || ""} />
      ) : (
        <FormComponent onSuccess={handleFormSuccess} />
      )}
    </>
  )
}