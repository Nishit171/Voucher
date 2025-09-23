import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// In-memory storage for demo purposes
const userData = []

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, mobile, email, occupation } = body

    if (!name || !mobile) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate mobile number format (Indian 10-digit starting with 6-9)
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({ success: false, error: "Invalid mobile number format" }, { status: 400 })
    }

    if (email && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
      }
    }

    // Create user data object
    const userEntry = {
      id: Date.now(),
      name,
      mobile,
      email: email || "",
      occupation: occupation || "",
      timestamp: new Date().toISOString(),
    }

    // Store in memory (in production, you'd use a database)
    userData.push(userEntry)

    // Optionally save to file (for persistence)
    try {
      const dataPath = path.join(process.cwd(), "data.json")
      fs.writeFileSync(dataPath, JSON.stringify(userData, null, 2))
    } catch (fileError) {
      console.log("File write error (non-critical):", fileError.message)
    }

    try {
      const formId = process.env.GOOGLE_FORM_ID
      const entryName = process.env.GOOGLE_ENTRY_NAME
      const entryMobile = process.env.GOOGLE_ENTRY_MOBILE
      const entryEmail = process.env.GOOGLE_ENTRY_EMAIL
      const entryOccupation = process.env.GOOGLE_ENTRY_OCCUPATION

      if (formId && entryName && entryMobile && entryEmail && entryOccupation) {
        const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`
        const params = new URLSearchParams()
        params.append(`entry.${entryName}`, name)
        params.append(`entry.${entryMobile}`, mobile)
        if (email) params.append(`entry.${entryEmail}`, email)
        if (occupation) params.append(`entry.${entryOccupation}`, occupation)

        const res = await fetch(formUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: params.toString(),
        })

        console.log("[v0] Google Forms submission status:", res.status)
        // Note: Google Forms often returns 200 or 302 on success.
      } else {
        console.log("[v0] Google Forms env vars missing. Skipping Google submission.")
      }
    } catch (gfErr) {
      console.log("[v0] Google Forms submission error:", gfErr?.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
