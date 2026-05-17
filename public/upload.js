// ============================================================
// upload.js - File upload + OCR + classification → question bank
// ============================================================

const SHARED_BANK = new StorageModule.SharedStore('b00_question_bank');
const SHARED_REPO = new StorageModule.SharedStore('b00_exam_repo');

const UPLOAD_LIMITS = {
    maxFileSize: 20 * 1024 * 1024,  // 20 MB
    allowedTypes: [
        'image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif',
        'text/plain',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
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
        throw new Error(`Loại file không hỗ trợ: ${file.type}. Chỉ chấp nhận ảnh (JPG/PNG), PDF, Word (.docx/.doc), hoặc TXT.`);
    }
    if (file.name.length > UPLOAD_LIMITS.maxFilenameLen) {
        throw new Error('Tên file quá dài.');
    }
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
    let sourceImageUrl = null;

    // Handle PDF/Word files via API
    if (file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword') {
        
        onProgress?.({ stage: 'uploading', progress: 0.2, label: 'Đang upload file lên server...' });
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', uploaderUsername);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload thất bại');
            }
            
            const result = await response.json();
            rawText = result.rawText;
            
            onProgress?.({ stage: 'parsing', progress: 0.5, label: 'Xử lý nội dung...' });
        } catch (error) {
            throw new Error(`Lỗi upload: ${error.message}`);
        }
    } else if (file.type === 'text/plain') {
        rawText = await file.text();
        rawText = SecurityUtils.sanitizeText(rawText, 1000000);
        onProgress?.({ stage: 'parsing', progress: 0.5, label: 'Xử lý nội dung...' });
    } else if (file.type.startsWith('image/')) {
        if (file.size <= 2 * 1024 * 1024 && OCRModule.readFileAsDataURL) {
            sourceImageUrl = await OCRModule.readFileAsDataURL(file);
        }
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
        onProgress?.({ stage: 'parsing', progress: 0.85, label: 'Xử lý nội dung...' });
    } else {
        throw new Error('Loại file chưa được hỗ trợ.');
    }

    if (!rawText || rawText.trim().length < 10) {
        throw new Error('Không trích xuất được nội dung từ file. Vui lòng kiểm tra lại.');
    }

    onProgress?.({ stage: 'extract', progress: 0.85, label: 'Trích xuất câu hỏi...' });
    const rawQuestions = ClassifierModule.extractQuestions(rawText);
    const examId = crypto.randomUUID();

    onProgress?.({ stage: 'classify', progress: 0.92, label: 'Phân loại câu hỏi...' });
    const classified = rawQuestions.map((q, index) => {
        const cleanQ = SecurityUtils.sanitizeText(q, 3000);
        const subjRes = ClassifierModule.classifySubject(cleanQ);
        const difficulty = ClassifierModule.classifyDifficulty(cleanQ);
        return {
            id: crypto.randomUUID(),
            examId,
            order: index + 1,
            text: cleanQ,
            subject: subjRes.subject,
            subjectConfidence: subjRes.confidence,
            difficulty,
            uploadedBy: uploaderUsername,
            uploadedAt: Date.now(),
            sourceFile: SecurityUtils.sanitizeFilename(file.name),
            imageUrl: sourceImageUrl
        };
    });

    const valid = classified.filter(q => q.subject !== 'unknown');

    // Save exam metadata to shared repo
    const examMeta = {
        id: examId,
        filename: SecurityUtils.sanitizeFilename(file.name),
        size: file.size,
        type: file.type,
        uploadedBy: uploaderUsername,
        uploadedAt: Date.now(),
        questionCount: classified.length,
        classifiedCount: valid.length,
        ocrConfidence,
        rawTextPreview: rawText.slice(0, 500),
        imageUrl: sourceImageUrl
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
    SHARED_BANK.set(bank.filter(q => q.examId !== exam.id));
    return true;
}

window.UploadModule = {
    processUpload, validateFile,
    getQuestionBank, getExamRepo, deleteExam,
    UPLOAD_LIMITS
};

