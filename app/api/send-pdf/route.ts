import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.TRADERS_MARKET_RESEND_API_KEY);

// Configure longer timeout for large file handling (in milliseconds)
export const maxDuration = 60; // 60 seconds for Pro plans, adjust as needed

// Maximum file size in bytes (10MB recommended for email attachments)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  console.log('[send-pdf] Request received');
  
  try {
    const { email } = await request.json();
    console.log('[send-pdf] Email:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.log('[send-pdf] Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get PDF file path
    const pdfPath = path.join(process.cwd(), 'public', 'pdf', 'Top5BotsPDF.pdf');
    console.log('[send-pdf] PDF path:', pdfPath);

    // Check if file exists and get size
    const stats = await fs.stat(pdfPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    
    console.log(`[send-pdf] PDF size: ${fileSizeInMB} MB (${fileSizeInBytes} bytes)`);

    // Check file size
    if (fileSizeInBytes > MAX_FILE_SIZE) {
      console.log(`[send-pdf] File too large: ${fileSizeInMB} MB`);
      return NextResponse.json(
        { error: `PDF file is too large (${fileSizeInMB} MB). Please contact support.` },
        { status: 413 }
      );
    }

    // Read the PDF file asynchronously
    console.log('[send-pdf] Reading PDF file...');
    const pdfBuffer = await fs.readFile(pdfPath);
    console.log('[send-pdf] PDF read successfully, converting to base64...');
    
    const pdfBase64 = pdfBuffer.toString('base64');
    const base64SizeInMB = (pdfBase64.length / (1024 * 1024)).toFixed(2);
    console.log(`[send-pdf] Base64 size: ${base64SizeInMB} MB`);

    // Send email with Resend
    console.log('[send-pdf] Sending email via Resend...');
    
    // TEMPORARY: For testing without domain, override recipient email
    // Remove this block after domain verification
    const isDevelopment = process.env.NODE_ENV === 'development';
    const testEmail = 'mperic2106@gmail.com'; // Your Resend account email
    const recipientEmail = isDevelopment ? testEmail : email;
    
    if (isDevelopment && email !== testEmail) {
      console.log(`[send-pdf] DEV MODE: Redirecting email from ${email} to ${testEmail}`);
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Traders Market <onboarding@resend.dev>', // Replace with your verified domain
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
              
              <p>Thank you for requesting our <strong>"Top 5 Trading Bots for MT5"</strong> guide! We've attached the PDF to this email.</p>
              
              <p>This comprehensive guide will help you:</p>
              <ul style="color: #4b5563;">
                <li>Understand the most effective trading strategies for MetaTrader 5</li>
                <li>Learn how automated trading can improve your results</li>
                <li>Discover proven bots used by traders worldwide</li>
              </ul>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af;"><strong>Ready to take the next step?</strong></p>
                <p style="margin: 10px 0 0 0; color: #1e40af;">Get access to our complete bundle of 10+ expert-designed trading strategies for just $259.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://tradersmarket.com/bundle-offer" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View Full Bundle</a>
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
      attachments: [
        {
          filename: 'Top5BotsPDF.pdf',
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error('[send-pdf] Resend error:', error);
      
      // Handle specific Resend errors
      if (error.message?.includes('too large')) {
        return NextResponse.json(
          { error: 'PDF file is too large to send via email. Please contact support.' },
          { status: 413 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact support.' },
        { status: 500 }
      );
    }

    console.log('[send-pdf] Email sent successfully:', data);
    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[send-pdf] Server error:', error);
    
    // Handle specific errors
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'PDF file not found. Please contact support.' },
        { status: 404 }
      );
    }
    
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. The PDF might be too large. Please contact support.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
