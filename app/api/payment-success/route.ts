import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sessionId, amount, currency, timestamp } = body;

    // Validate required fields
    if (!email || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: email and sessionId are required', success: false },
        { status: 400 }
      );
    }

    // Find user by email
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'User not found with this email', success: false },
          { status: 404 }
        );
      }
      throw error;
    }

    const userId = userRecord.uid;

    // Update Firestore hasPaid field
    // Trusting momentum-digital callback - payment already verified on their end
    const userDocRef = adminDb.collection('users').doc(userId);
    const updateData = {
      hasPaid: true,
      paymentDate: timestamp || new Date().toISOString(),
      stripeSessionId: sessionId,
      paymentAmount: amount ? amount.toFixed(2) : null,
      paymentCurrency: currency || 'usd',
    };
    
    await userDocRef.set(updateData, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Payment recorded',
      userId,
      email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process payment', 
        success: false 
      },
      { status: 500 }
    );
  }
}
