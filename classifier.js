// ============================================================
// Enhanced AI Classifier with TensorFlow.js support
// ============================================================

// Improved keyword database with weighted scoring
const SUBJECT_KEYWORDS = {
    math: {
        core: ['đạo hàm', 'tích phân', 'nguyên hàm', 'giới hạn', 'đồ thị'],
        secondary: ['hàm số', 'ma trận', 'vector', 'phương trình', 'hình học']
    },
    chemistry: {
        core: ['phản ứng', 'hóa học', 'phân tử', 'nguyên tử', 'mol'],
        secondary: ['hợp chất', 'axit', 'bazơ', 'oxit', 'ion']
    },
    biology: {
        core: ['tế bào', 'adn', 'di truyền', 'enzyme', 'quang hợp'],
        secondary: ['protein', 'gen', 'hô hấp', 'phiên mã', 'dịch mã']
    }
};

const TF_MODEL = {
    loaded: false,
    async load() {
        // Load TensorFlow.js model
        this.model = await tf.loadLayersModel('model/model.json');
        this.loaded = true;
    },
    async predict(text) {
        if (!this.loaded) await this.load();
        const input = preprocessText(text);
        const prediction = this.model.predict(input);
        return {
            subject: getTopSubject(prediction),
            confidence: prediction.max().dataSync()[0] * 100
        };
    }
};

function preprocessText(text) {
    // Convert text to numerical features
    const features = [];
    // Feature 1: Length of text
    features.push(text.length / 1000); 
    // Feature 2: Special character count
    features.push((text.match(/[^\w\s]/g) || []).length / 100);
    // Feature 3: Presence of math symbols
    features.push(/[+\-*/^=π√]/.test(text) ? 1 : 0);
    // Feature 4: Contains chemical notation
    features.push(/\b([A-Z][a-z]*\d*|\d+[A-Za-z]+)/.test(text) ? 1 : 0);
    
    return tf.tensor2d([features]);
}

function getTopSubject(prediction) {
    const labels = ['math', 'chemistry', 'biology'];
    const idx = prediction.argMax(1).dataSync()[0];
    return labels[idx];
}

// Enhanced classification algorithm with TF.js fallback
async function classifySubject(text) {
    if (!TF_MODEL.loaded) await TF_MODEL.load();
    
    try {
        // Simultaneous keyword and ML analysis
        const keywordResult = {
            subject: classifySubjectByKeywords(text).subject,
            confidence: classifySubjectByKeywords(text).confidence
        };
        
        const mlResult = await TF_MODEL.predict(text);
        
        // Combined confidence score
        const finalConfidence = Math.round(
            (keywordResult.confidence * 0.4 + mlResult.confidence * 0.6)
        );
        
        // Default to ML result unless keyword analysis is very confident
        let finalSubject = mlResult.subject;
        if (keywordResult.confidence > 80) {
            finalSubject = keywordResult.subject;
        } else if (keywordResult.confidence > 50 && mlResult.confidence < 70) {
            finalSubject = keywordResult.subject;
        }
        
        return {
            subject: finalSubject,
            confidence: finalConfidence,
            method: finalSubject === keywordResult.subject ? 'keywords' : 'ml'
        };
    } catch (error) {
        console.error('Classification error:', error);
        return classifySubjectByKeywords(text);
    }
}

function classifySubjectByKeywords(text) {
    const lower = String(text).toLowerCase();
    const scores = { math: 0, chemistry: 0, biology: 0 };
    
    // Score core keywords higher
    for (const [subj, {core, secondary}] of Object.entries(SUBJECT_KEYWORDS)) {
        for (const k of core) {
            if (lower.includes(k)) scores[subj] += 2;
        }
        for (const k of secondary) {
            if (lower.includes(k)) scores[subj] += 1;
        }
    }
    
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (entries[0][1] === 0) return { subject: 'unknown', confidence: 0 };
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return {
        subject: entries[0][0],
        confidence: Math.round((entries[0][1] / total) * 100),
        scores
    };
}

const DIFFICULTY_KEYWORDS = {
    easy: [
        'định nghĩa', 'là gì', 'nêu', 'phát biểu', 'liệt kê', 'kể tên',
        'công thức nào', 'khái niệm', 'đơn vị'
    ],
    medium: [
        'tính', 'tìm', 'xác định', 'so sánh', 'phân biệt', 'giải thích',
        'cho biết', 'cho ví dụ', 'áp dụng'
    ],
    hard: [
        'chứng minh', 'biện luận', 'tối ưu', 'khảo sát', 'tổng hợp',
        'phân tích', 'đánh giá', 'suy luận', 'nhiều bước', 'kết hợp',
        'tìm điều kiện để', 'với mọi', 'tồn tại'
    ]
};

function classifySubject(text) {
    const lower = String(text).toLowerCase();
    const scores = { math: 0, chemistry: 0, biology: 0 };
    for (const [subj, keys] of Object.entries(SUBJECT_KEYWORDS)) {
        for (const k of keys) {
            if (lower.includes(k.toLowerCase())) scores[subj]++;
        }
    }
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (entries[0][1] === 0) return { subject: 'unknown', confidence: 0 };
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return {
        subject: entries[0][0],
        confidence: Math.round((entries[0][1] / total) * 100),
        scores
    };
}

function classifyDifficulty(text) {
    const lower = String(text).toLowerCase();
    if (DIFFICULTY_KEYWORDS.hard.some(k => lower.includes(k))) return 'hard';
    if (DIFFICULTY_KEYWORDS.medium.some(k => lower.includes(k))) return 'medium';
    if (DIFFICULTY_KEYWORDS.easy.some(k => lower.includes(k))) return 'easy';
    // Fallback by length & complexity
    const len = text.length;
    const hasMultipleClauses = (text.match(/[,;]/g) || []).length >= 3;
    if (len > 500 || hasMultipleClauses) return 'hard';
    if (len > 200) return 'medium';
    return 'easy';
}

// Extract individual questions from a raw text blob
function extractQuestions(text) {
    if (!text || typeof text !== 'string') return [];
    // Common patterns for Vietnamese exam questions
    const pattern = /(?:^|\n)\s*(?:Câu|Bài|Question|Q)[\s._:\-]*\d+[\s.:\-)]/gi;
    const splits = [];
    let m;
    while ((m = pattern.exec(text)) !== null) {
        splits.push(m.index);
    }

    let questions = [];
    if (splits.length > 0) {
        for (let i = 0; i < splits.length; i++) {
            const start = splits[i];
            const end = splits[i + 1] || text.length;
            const q = text.slice(start, end).trim();
            if (q.length > 20 && q.length < 3000) questions.push(q);
        }
    } else {
        // Fallback: split by numbered lines like "1. ..." "2) ..."
        const numberedPattern = /(?:^|\n)\s*\d+[\.\)]\s+/g;
        const nsp = [];
        while ((m = numberedPattern.exec(text)) !== null) nsp.push(m.index);
        if (nsp.length >= 2) {
            for (let i = 0; i < nsp.length; i++) {
                const start = nsp[i];
                const end = nsp[i + 1] || text.length;
                const q = text.slice(start, end).trim();
                if (q.length > 20 && q.length < 3000) questions.push(q);
            }
        } else {
            // Last resort: treat whole text as one question block if short
            if (text.length < 3000) questions = [text.trim()];
            else questions = text.split('\n\n').filter(s => s.trim().length > 20);
        }
    }
    return questions;
}

window.ClassifierModule = {
    classifySubject, classifyDifficulty, extractQuestions,
    SUBJECT_KEYWORDS, DIFFICULTY_KEYWORDS
};
