import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "brandlab12@gmail.com";
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyDduU7cbH3nGR3GZT-2Gr9GjTjnwwJKbEY2iVu30NCdDI6_XC49xtRUWrJPqnOpa4WcA/exec";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, phone, businessField, planType, projectType } =
      await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    // Build detail rows
    const details = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      businessField ? `Business Field: ${businessField}` : "",
      planType ? `Plan Type: ${planType}` : "",
      projectType ? `Project Type: ${projectType}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // --- Email to admin ---
    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Lead: ${name}`,
      text: `You have a new lead!\n\n${details}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1a1a2e;color:#f5f0eb;border-radius:12px;">
          <h2 style="color:#7c3aed;margin-bottom:16px;">New Lead Received</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a0a0b0;">Name</td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a0a0b0;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7c3aed;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a0a0b0;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
            ${businessField ? `<tr><td style="padding:8px 0;color:#a0a0b0;">Business Field</td><td style="padding:8px 0;">${businessField}</td></tr>` : ""}
            ${planType ? `<tr><td style="padding:8px 0;color:#a0a0b0;">Plan Type</td><td style="padding:8px 0;">${planType}</td></tr>` : ""}
            ${projectType ? `<tr><td style="padding:8px 0;color:#a0a0b0;">Project Type</td><td style="padding:8px 0;">${projectType}</td></tr>` : ""}
          </table>
        </div>
      `,
    });

    // --- Log to Google Sheet (fire & forget) ---
    fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, businessField, planType, projectType }),
    }).catch((err) => console.error("Google Sheet error:", err));

    // --- Confirmation email to client ---
    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out — Brand Lab",
      text: `Hi ${name},\n\nThank you for booking a free call with Brand Lab! Our team will reach out to you shortly.\n\nBest regards,\nThe Brand Lab Team`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1a1a2e;color:#f5f0eb;border-radius:12px;">
          <h2 style="color:#7c3aed;margin-bottom:16px;">Thank You, ${name}!</h2>
          <p style="line-height:1.6;color:#d0d0d0;">
            We've received your request and our team will reach out to you shortly to schedule your free consultation call.
          </p>
          <p style="line-height:1.6;color:#d0d0d0;">
            In the meantime, feel free to reply to this email if you have any questions.
          </p>
          <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
          <p style="color:#a0a0b0;font-size:13px;">
            Best regards,<br/>The Brand Lab Team
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }
}
