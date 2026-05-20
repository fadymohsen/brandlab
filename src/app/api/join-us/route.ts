import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "brandlab12@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, phone, role, portfolio, message } = await req.json();

    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { error: "Name, email, phone, and role are required." },
        { status: 400 },
      );
    }

    const details = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Role: ${role}`,
      portfolio ? `Portfolio: ${portfolio}` : "",
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Job Application: ${name} — ${role}`,
      text: `New job application!\n\n${details}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1a1a2e;color:#f5f0eb;border-radius:12px;">
          <h2 style="color:#7c3aed;margin-bottom:16px;">New Job Application</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a0a0b0;">Name</td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a0a0b0;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7c3aed;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a0a0b0;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#a0a0b0;">Role</td><td style="padding:8px 0;font-weight:bold;">${role}</td></tr>
            ${portfolio ? `<tr><td style="padding:8px 0;color:#a0a0b0;">Portfolio</td><td style="padding:8px 0;"><a href="${portfolio}" style="color:#7c3aed;">${portfolio}</a></td></tr>` : ""}
            ${message ? `<tr><td style="padding:8px 0;color:#a0a0b0;">Message</td><td style="padding:8px 0;">${message}</td></tr>` : ""}
          </table>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Application Received — Brand Lab",
      text: `Hi ${name},\n\nThank you for applying to join Brand Lab as a ${role}! We've received your application and will review it shortly.\n\nBest regards,\nThe Brand Lab Team`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1a1a2e;color:#f5f0eb;border-radius:12px;">
          <h2 style="color:#7c3aed;margin-bottom:16px;">Thank You, ${name}!</h2>
          <p style="line-height:1.6;color:#d0d0d0;">
            We've received your application for the <strong>${role}</strong> position at Brand Lab. Our team will review it and get back to you soon.
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
    console.error("Join-us email error:", error);
    return NextResponse.json(
      { error: "Failed to send application. Please try again." },
      { status: 500 },
    );
  }
}
