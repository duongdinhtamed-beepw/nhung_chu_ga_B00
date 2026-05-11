// ============================================================
// ocr.js - Client-side OCR via Tesseract.js (loaded from CDN)
// Handles Vietnamese + English exam images
// ============================================================

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không đọc được file.'));
        reader.readAsDataURL(file);
    });
}

async function performOCR(input, onProgress) {
    if (typeof Tesseract === 'undefined') {
        throw new Error('Thư viện OCR (Tesseract.js) chưa tải xong. Vui lòng thử lại sau vài giây.');
    }
    // Progress: status='recognizing text' with progress 0..1
    const worker = await Tesseract.createWorker(['vie', 'eng'], 1, {
        logger: m => {
            if (onProgress && m && typeof m.progress === 'number') {
                onProgress({
                    stage: m.status || 'processing',
                    progress: m.progress
                });
            }
        }
    });
    try {
        const { data } = await worker.recognize(input);
        return {
            text: data.text || '',
            confidence: data.confidence || 0,
            lines: (data.lines || []).map(l => l.text)
        };
    } finally {
        await worker.terminate();
    }
}

async function ocrFromFile(file, onProgress) {
    const dataUrl = await readFileAsDataURL(file);
    return performOCR(dataUrl, onProgress);
}

window.OCRModule = {
    performOCR, ocrFromFile, readFileAsDataURL
};
