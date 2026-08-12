import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contactInfo, message } = body;

    // Validate required fields
    if (!name || !name.trim() || !contactInfo || !contactInfo.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, contact info, and message are required.' },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER || 'ntumankuhahire@gmail.com';
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || 'rpif reyn qtau ihvg').replace(/\s+/g, '');
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ntumankuhahire@gmail.com';
    const ccEmailsEnv = process.env.CONTACT_CC_EMAILS || 'fabimukundente@gmail.com,info@ntumankuhahire.com';
    const ccList = ccEmailsEnv.split(',').map((email) => email.trim()).filter(Boolean);

    // Create Nodemailer Transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Determine if contactInfo looks like an email to set replyTo
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.trim());
    const replyToHeader = isEmail ? contactInfo.trim() : undefined;

    // Formatted Plain Text Version
    const textContent = `
NEW CONTACT MESSAGE - NTUMA APP

Sender Name: ${name}
Contact Info: ${contactInfo}
Submitted At: ${new Date().toLocaleString()}

Message:
----------------------------------------
${message}
----------------------------------------
    `.trim();

    // Formatted HTML Email Body (Ntuma Branded)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 24px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 28px 24px; }
            .field-card { background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #10b981; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
            .value { font-size: 16px; font-weight: 600; color: #0f172a; word-break: break-word; }
            .message-box { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #334155; }
            .footer { background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Ntuma — New Contact Message</h1>
              <p>Direct submission from the contact page</p>
            </div>
            <div class="content">
              <div class="field-card">
                <div class="label">Sender Name</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              <div class="field-card">
                <div class="label">Contact Info (Email / Phone)</div>
                <div class="value">${escapeHtml(contactInfo)}</div>
              </div>
              <div style="margin-top: 24px; margin-bottom: 8px;">
                <div class="label">Message</div>
              </div>
              <div class="message-box">
                ${escapeHtml(message)}
              </div>
            </div>
            <div class="footer">
              <p>Sent via Ntuma Contact Form &bull; ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Kigali' })} (CAT)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Ntuma App" <${gmailUser}>`,
      to: receiverEmail,
      cc: ccList,
      replyTo: replyToHeader,
      subject: `[Ntuma Contact] New message from ${name}`,
      text: textContent,
      html: htmlContent,
    };


    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error: any) {
    console.error('Error sending contact email with Nodemailer:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
