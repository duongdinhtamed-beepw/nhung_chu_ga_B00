// ============================================================
// upload.js - File upload + OCR + classification → question bank
// ============================================================

const SHARED_BANK = new StorageModule.SharedStore('b00_question_bank');
const SHARED_REPO = new StorageModule.SharedStore('b00_exam_repo');

const UPLOAD_LIMITS = {
    maxFileSize: 10 * 1024 * 1024,  // 10 MB
    allowedTypes: [
        'image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif',
        'text/plain'
    ],
    maxFilenameLen: 200
};

// Rate-limit uploads per user (10 uploads per hour)
const uploadLimiter = new SecurityUtils.RateLimiter('b00_upload_limits', 10, 60 * 60 * 1000);

function validateFile(file) {
    if (!file) throw new Error('Không có file nào được chọn.');
    if (file.size > UPLOAD_LIMITS.maxFileSize) {
        throw new Error(`File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Giới hạn ${UPLOAD_LIMITS.maxFileSize / 1024 / 1024}MB.`);
    }
    if (!UPLOAD_LIMITS.allowedTypes.includes(file.type)) {
        throw new Error(`Loại file không hỗ trợ: ${file.type}. Chỉ chấp nhận ảnh (JPG/PNG/WebP) hoặc TXT.`);
    }
    if (file.name.length > UPLOAD_LIMITS.maxFilenameLen) {
        throw new Error('Tên file quá dài.');
    }
    // Magic byte check for images (optional light check)
    return true;
}

async function processUpload(file, uploaderUsername, onProgress) {
    validateFile(file);

    // rate limit per user
    const rl = uploadLimiter.check(uploaderUsername);
    if (!rl.allowed) {
        const mins = Math.ceil(rl.retryIn / 60);
        throw new Error(`Bạn đã upload quá nhiều. Thử lại sau ${mins} phút.`);
    }

    onProgress?.({ stage: 'reading', progress: 0.05, label: 'Đọc file...' });

    let rawText = '';
    let ocrConfidence = null;

    if (file.type === 'text/plain') {
        rawText = await file.text();
        rawText = SecurityUtils.sanitizeText(rawText, 1000000);
    } else if (file.type.startsWith('image/')) {
        onProgress?.({ stage: 'ocr', progress: 0.1, label: 'Đang OCR (có thể mất 30-60s)...' });
        const result = await OCRModule.ocrFromFile(file, p => {
            onProgress?.({
                stage: 'ocr',
                progress: 0.1 + (p.progress || 0) * 0.7,
                label: `OCR: ${p.stage}`
            });
        });
        rawText = result.text;
        ocrConfidence = result.confidence;
    } else {
        throw new Error('Loại file chưa được hỗ trợ OCR.');
    }

    if (!rawText || rawText.trim().length < 10) {
        throw new Error('Không trích xuất được nội dung từ file. Vui lòng kiểm tra lại hình ảnh.');
    }

    onProgress?.({ stage: 'extract', progress: 0.85, label: 'Trích xuất câu hỏi...' });
    const rawQuestions = ClassifierModule.extractQuestions(rawText);

    onProgress?.({ stage: 'classify', progress: 0.92, label: 'Phân loại câu hỏi...' });
    const classified = rawQuestions.map(q => {
        const cleanQ = SecurityUtils.sanitizeText(q, 3000);
        const subjRes = ClassifierModule.classifySubject(cleanQ);
        const difficulty = ClassifierModule.classifyDifficulty(cleanQ);
        return {
            id: crypto.randomUUID(),
            text: cleanQ,
            subject: subjRes.subject,
            subjectConfidence: subjRes.confidence,
            difficulty,
            uploadedBy: uploaderUsername,
            uploadedAt: Date.now(),
            sourceFile: SecurityUtils.sanitizeFilename(file.name)
        };
    });

    const valid = classified.filter(q => q.subject !== 'unknown');

    // Save exam metadata to shared repo
    const examMeta = {
        id: crypto.randomUUID(),
        filename: SecurityUtils.sanitizeFilename(file.name),
        size: file.size,
        type: file.type,
        uploadedBy: uploaderUsername,
        uploadedAt: Date.now(),
        questionCount: classified.length,
        classifiedCount: valid.length,
        ocrConfidence,
        rawTextPreview: rawText.slice(0, 500)
    };
    SHARED_REPO.push(examMeta);

    // Save valid questions to shared bank
    const bank = SHARED_BANK.get([]);
    bank.push(...valid);
    SHARED_BANK.set(bank);

    onProgress?.({ stage: 'done', progress: 1, label: 'Hoàn tất!' });

    return {
        examMeta,
        totalExtracted: classified.length,
        totalClassified: valid.length,
        totalUnknown: classified.length - valid.length,
        rawText
    };
}

function getQuestionBank(filter = {}) {
    let bank = SHARED_BANK.get([]);
    if (filter.subject) bank = bank.filter(q => q.subject === filter.subject);
    if (filter.difficulty) bank = bank.filter(q => q.difficulty === filter.difficulty);
    if (filter.search) {
        const s = String(filter.search).toLowerCase();
        bank = bank.filter(q => (q.text || '').toLowerCase().includes(s));
    }
    return bank;
}

function getExamRepo() {
    return SHARED_REPO.get([]);
}

function deleteExam(examId, requesterUsername, requesterRole) {
    const repo = SHARED_REPO.get([]);
    const exam = repo.find(e => e.id === examId);
    if (!exam) throw new Error('Không tìm thấy đề.');
    if (exam.uploadedBy !== requesterUsername && requesterRole !== 'admin') {
        throw new Error('Bạn không có quyền xóa đề này.');
    }
    // Remove exam and its associated questions
    SHARED_REPO.set(repo.filter(e => e.id !== examId));
    const bank = SHARED_BANK.get([]);
    SHARED_BANK.set(bank.filter(q => q.sourceFile !== exam.filename || q.uploadedAt !== exam.uploadedAt));
    return true;
}

window.UploadModule = {
    processUpload, validateFile,
    getQuestionBank, getExamRepo, deleteExam,
    UPLOAD_LIMITS
};

