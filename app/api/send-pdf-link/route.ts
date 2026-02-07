import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.TRADERS_MARKET_RESEND_API_KEY);

export async function POST(request: NextRequest) {
  console.log('[send-pdf-link] Request received');
  
  try {
    const { email } = await request.json();
    console.log('[send-pdf-link] Email:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.log('[send-pdf-link] Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get the base URL (for production, you'd use your actual domain)
    const baseUrl = process.env.NEXT_PUBLIC_TRADERS_MARKET_BASE_URL || 'http://localhost:3000';
    const pdfDownloadUrl = `${baseUrl}/pdf/Top5BotsPDF.pdf`;

    console.log('[send-pdf-link] PDF download URL:', pdfDownloadUrl);

    // Send email with download link
    console.log('[send-pdf-link] Sending email via Resend...');
    
    // TEMPORARY: For testing without domain, override recipient email
    // Remove this block after domain verification
    const isDevelopment = process.env.NODE_ENV === 'development';
    const testEmail = 'mperic2106@gmail.com'; // Your Resend account email
    const recipientEmail = isDevelopment ? testEmail : email;
    
    if (isDevelopment && email !== testEmail) {
      console.log(`[send-pdf-link] DEV MODE: Redirecting email from ${email} to ${testEmail}`);
    }
    
    const { data, error } = await resend.emails.send({
      from: "Traders Market <noreply@tradersmarket.io>", // Replace with your verified domain
      to: [recipientEmail],
      subject: 'Your Copy of "Top 5 Trading Bots for MT5" PDF',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Traders Market</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">Thank You for Your Interest!</h2>
              
              <p>Hi there,</p>
              
              <p>Thank you for requesting our <strong>"Top 5 Trading Bots for MT5"</strong> guide!</p>
              
              <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;"><strong>📥 Download Your Free PDF Guide</strong></p>
                <a href="${pdfDownloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Download PDF Now</a>
              </div>
              
              <p>This comprehensive guide will help you:</p>
              <ul style="color: #4b5563;">
                <li>Understand the most effective trading strategies for MetaTrader 5</li>
                <li>Learn how automated trading can improve your results</li>
                <li>Discover proven bots used by traders worldwide</li>
              </ul>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af;"><strong>Ready to take the next step?</strong></p>
                <p style="margin: 10px 0 0 0; color: #1e40af;">Get access to our complete bundle of 10+ expert-designed trading strategies for just <span style="text-decoration: line-through; color: #94a3b8;">$399</span> <strong style="color: #fcd34d;">$259</strong>.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/bundle-offer" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View Full Bundle</a>
              </div>
              
              <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The Traders Market Team</strong></p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p>© 2026 Traders Market. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('[send-pdf-link] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact support.' },
        { status: 500 }
      );
    }

    console.log('[send-pdf-link] Email sent successfully:', data);
    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[send-pdf-link] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
