import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, message, planName } = body;

    // Validate required fields
    if (!name || !email || !company || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send an email to your sales team
    // 2. Save to database
    // 3. Integrate with CRM system
    // For now, we'll just log it and return success

    console.log("Contact Sales Form Submission:", {
      name,
      email,
      company,
      phone,
      message,
      planName,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement actual email/CRM integration
    // Example: await sendEmail({ to: 'sales@example.com', subject: `Enterprise Inquiry from ${name}`, body: ... })

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. Our sales team will contact you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact sales form:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

