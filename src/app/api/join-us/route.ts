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

function brandedEmail(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:0;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#c026d3);padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
      <img src="cid:logo" alt="Brand Lab" style="height:50px;margin-bottom:8px;" />
      <p style="color:rgba(255,255,255,0.8);margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Creative Video Agency</p>
    </div>
    <!-- Body -->
    <div style="background:#1a1a2e;padding:32px 24px;color:#f5f0eb;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="background:#12121f;padding:24px;text-align:center;border-radius:0 0 12px 12px;">
      <p style="color:#666;font-size:12px;margin:0 0 8px;">Brand Lab — Professional Video Editing & Montage Agency</p>
      <div style="margin-top:8px;">
        <a href="https://www.instagram.com/brandlab.agency/" style="color:#7c3aed;text-decoration:none;font-size:12px;margin:0 8px;">Instagram</a>
        <a href="https://wa.me/201227742865" style="color:#7c3aed;text-decoration:none;font-size:12px;margin:0 8px;">WhatsApp</a>
        <a href="mailto:brandlab12@gmail.com" style="color:#7c3aed;text-decoration:none;font-size:12px;margin:0 8px;">Email</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const logoAttachment = {
  filename: "logo.jpg",
  path: process.cwd() + "/public/logo.jpg",
  cid: "logo",
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, role, portfolio, message } = await req.json();

    if (!name || !email || !phone || !role || !portfolio) {
      return NextResponse.json(
        { error: "Name, email, phone, role, and portfolio are required." },
        { status: 400 },
      );
    }

    // Admin email
    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Job Application: ${name} — ${role}`,
      text: `New job application!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nRole: ${role}\nPortfolio: ${portfolio}${message ? `\nMessage: ${message}` : ""}`,
      html: brandedEmail(`
        <h2 style="color:#c026d3;margin:0 0 24px;font-size:22px;">New Job Application</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;border-bottom:1px solid #2a2a3e;width:120px;vertical-align:top;">Name</td>
            <td style="padding:12px 0;border-bottom:1px solid #2a2a3e;font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;border-bottom:1px solid #2a2a3e;vertical-align:top;">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid #2a2a3e;"><a href="mailto:${email}" style="color:#7c3aed;text-decoration:none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;border-bottom:1px solid #2a2a3e;vertical-align:top;">Phone</td>
            <td style="padding:12px 0;border-bottom:1px solid #2a2a3e;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;border-bottom:1px solid #2a2a3e;vertical-align:top;">Position</td>
            <td style="padding:12px 0;border-bottom:1px solid #2a2a3e;">
              <span style="background:linear-gradient(135deg,#7c3aed,#c026d3);color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">${role}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;border-bottom:1px solid #2a2a3e;vertical-align:top;">Portfolio</td>
            <td style="padding:12px 0;border-bottom:1px solid #2a2a3e;"><a href="${portfolio}" style="color:#7c3aed;text-decoration:none;">${portfolio}</a></td>
          </tr>
          ${message ? `
          <tr>
            <td style="padding:12px 0;color:#a0a0b0;vertical-align:top;">Message</td>
            <td style="padding:12px 0;line-height:1.6;">${message}</td>
          </tr>` : ""}
        </table>
      `),
      attachments: [logoAttachment],
    });

    // Client confirmation email
    await transporter.sendMail({
      from: `"Brand Lab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Application Received — Brand Lab",
      text: `Hi ${name},\n\nThank you for applying to join Brand Lab as a ${role}! We've received your application and will review it shortly.\n\nBest regards,\nThe Brand Lab Team`,
      html: brandedEmail(`
        <h2 style="color:#f5f0eb;margin:0 0 8px;font-size:22px;">Thank You, ${name}!</h2>
        <p style="color:#c026d3;font-size:14px;margin:0 0 24px;font-weight:600;">Application for ${role}</p>

        <p style="line-height:1.8;color:#d0d0d0;margin:0 0 16px;">
          We've received your application and our team will carefully review it. If your profile matches what we're looking for, we'll reach out to you soon.
        </p>

        <div style="background:#12121f;border-radius:8px;padding:16px;margin:24px 0;">
          <p style="color:#a0a0b0;font-size:13px;margin:0 0 8px;">Here's what you submitted:</p>
          <p style="color:#f5f0eb;margin:4px 0;font-size:14px;">Position: <strong>${role}</strong></p>
          <p style="color:#f5f0eb;margin:4px 0;font-size:14px;">Portfolio: <a href="${portfolio}" style="color:#7c3aed;text-decoration:none;">${portfolio}</a></p>
        </div>

        <p style="line-height:1.8;color:#d0d0d0;margin:0 0 24px;">
          In the meantime, feel free to reply to this email if you have any questions.
        </p>

        <p style="color:#a0a0b0;font-size:13px;margin:24px 0 0;">
          Best regards,<br/><strong style="color:#f5f0eb;">The Brand Lab Team</strong>
        </p>
      `),
      attachments: [logoAttachment],
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
