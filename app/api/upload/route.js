import { NextResponse } from 'next/server';
import { verifyGateCookieValue, GATE_COOKIE_NAME } from '../../../lib/gate';

// Parse PDF file
async function parsePdf(buffer) {
  try {
    // Dynamic import for Node.js environment
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF Parse Error:', error);
    throw new Error(`Lỗi đọc PDF: ${error.message}`);
  }
}

// Parse Word file (.docx) - Simple XML extraction
async function parseDocx(buffer) {
  try {
    // For DOCX files (which are ZIP archives), extract XML and parse text
    // This is a simplified approach - extracts text from document.xml
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(buffer);
    
    let fullText = '';
    
    // Try to extract from document.xml
    const docXml = await zip.file('word/document.xml')?.async('string');
    if (docXml) {
      // Remove XML tags and decode entities
      fullText = docXml
        .replace(/<[^>]+>/g, '')  // Remove XML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    }
    
    return fullText || '';
  } catch (error) {
    console.error('DOCX Parse Error:', error);
    throw new Error(`Lỗi đọc Word: ${error.message}`);
  }
}

// Parse text file
async function parseText(buffer) {
  return buffer.toString('utf-8');
}

// Main upload handler
export async function POST(req) {
  try {
    // Check auth
    const secret = process.env.GATE_COOKIE_SECRET || '';
    const cookie = req.cookies.get(GATE_COOKIE_NAME)?.value;
    
    if (!secret) {
      return NextResponse.json(
        { error: 'Server chưa cấu hình GATE_COOKIE_SECRET' },
        { status: 500 }
      );
    }

    if (!cookie || !verifyGateCookieValue(secret, cookie).ok) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để upload file' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const uploaderUsername = formData.get('username') || 'anonymous';

    if (!file) {
      return NextResponse.json(
        { error: 'Không có file nào được chọn' },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Giới hạn 20MB` },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Loại file không hỗ trợ: ${file.type}. Chỉ chấp nhận PDF, Word (.docx, .doc), hoặc TXT` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = '';

    // Parse based on file type
    if (file.type === 'application/pdf') {
      rawText = await parsePdf(buffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      rawText = await parseDocx(buffer);
    } else if (file.type === 'application/msword') {
      // .doc files - basic text extraction (limited support)
      rawText = buffer.toString('utf-8', 0, Math.min(100000, buffer.length))
        .replace(/[^\x20-\x7E\n]/g, ''); // Remove binary characters
    } else if (file.type === 'text/plain') {
      rawText = await parseText(buffer);
    }

    // Sanitize text
    rawText = rawText
      .slice(0, 1000000) // Limit to 1MB of text
      .trim();

    if (!rawText || rawText.length < 10) {
      return NextResponse.json(
        { error: 'Không trích xuất được nội dung từ file. Vui lòng kiểm tra lại' },
        { status: 400 }
      );
    }

    // Return parsed text and metadata
    return NextResponse.json({
      success: true,
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
      textLength: rawText.length,
      rawText: rawText,
      uploadedBy: uploaderUsername,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: `Lỗi upload: ${error.message}` },
      { status: 500 }
    );
  }
}
