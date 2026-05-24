import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { withAuth } from '@/lib/api-auth';
import Tesseract from 'tesseract.js';

export const POST = withAuth(async (req, user) => {
  try {
    const { bankDetails, documents } = await req.json();

    if (!documents || documents.length === 0) {
      return NextResponse.json({ success: false, message: 'No documents provided' }, { status: 400 });
    }

    // Default status is pending
    let kycStatus = 'pending';

    // Get the first document URL
    const docUrl = documents[0].url;

    if (docUrl) {
      try {
        // Run OCR on the document image
        const { data: { text } } = await Tesseract.recognize(docUrl, 'eng');
        const extractedText = text.toLowerCase();
        const userNameParts = user.name.toLowerCase().split(' ');

        // Check if at least 50% of the user's name parts are found in the OCR text
        let matchCount = 0;
        for (const part of userNameParts) {
          if (part.length > 2 && extractedText.includes(part)) {
            matchCount++;
          }
        }

        const matchRatio = matchCount / userNameParts.filter(p => p.length > 2).length;
        
        // Auto-approve if close to 50% match
        if (matchRatio >= 0.5) {
          kycStatus = 'approved';
        }
      } catch (ocrError) {
        console.error('[OCR Error]', ocrError);
        // Fallback to pending if OCR fails
        kycStatus = 'pending';
      }
    }

    // Update user's profile with new KYC status and bank details
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        kyc_status: kycStatus,
        bank_details: bankDetails,
        kyc_documents: documents,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ 
      success: true, 
      data: { kycStatus },
      message: kycStatus === 'approved' ? 'KYC Auto-Verified via OCR' : 'KYC submitted for review' 
    });

  } catch (err: any) {
    console.error('[KYC Submit Error]', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
});
