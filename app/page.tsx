"use client"

import { useState } from "react"
import FormComponent from "@/components/form-component"
import SuccessScreen from "@/components/success-screen"

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFormSuccess = () => {
    setShowSuccess(true)
  }

  return <>{showSuccess ? <SuccessScreen /> : <FormComponent onSuccess={handleFormSuccess} />}</>
}
