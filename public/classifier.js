// ============================================================
// classifier.js - Keyword-based subject & difficulty classifier
// Simulates FastAI classification (would be replaced with real model via backend API)
// ============================================================

const SUBJECT_KEYWORDS = {
    math: [
        'đạo hàm', 'tích phân', 'nguyên hàm', 'hàm số', 'ma trận', 'vector', 'vectơ',
        'hình học', 'tọa độ', 'xác suất', 'thống kê', 'phương trình', 'bất phương trình',
        'hệ phương trình', 'số phức', 'lôgarit', 'logarit', 'lũy thừa', 'mũ',
        'hình chóp', 'hình lăng trụ', 'mặt cầu', 'mặt phẳng', 'đường thẳng',
        'elip', 'parabol', 'hyperbol', 'cấp số', 'dãy số', 'giới hạn',
        'sin', 'cos', 'tan', 'cot', 'log', 'ln', 'đồ thị', 'cực trị',
        'tiệm cận', 'khoảng cách', 'góc giữa', 'thể tích', 'diện tích',
        'phân số', 'tổ hợp', 'chỉnh hợp', 'hoán vị', 'nhị thức', 'newton'
    ],
    chemistry: [
        'phản ứng', 'hợp chất', 'kim loại', 'phi kim', 'ancol', 'anđehit',
        'este', 'axit', 'bazơ', 'oxit', 'muối', 'ion', 'phân tử', 'nguyên tử',
        'electron', 'proton', 'nơtron', 'hóa trị', 'mol', 'nồng độ', 'dung dịch',
        'điện phân', 'thủy phân', 'polime', 'amino axit', 'amin', 'protein',
        'glucozơ', 'saccarozơ', 'tinh bột', 'xenlulozơ', 'cacbohidrat',
        'hữu cơ', 'vô cơ', 'xúc tác', 'cân bằng hóa học', 'tốc độ phản ứng',
        'naoh', 'hcl', 'h2so4', 'hno3', 'nh3', 'co2', 'h2o', 'fe', 'cu', 'al',
        'pH', 'bão hòa', 'kết tủa', 'khí thoát ra', 'chất khử', 'chất oxi hóa'
    ],
    biology: [
        'tế bào', 'adn', 'arn', 'gen', 'nhiễm sắc thể', 'nst', 'di truyền',
        'đột biến', 'quang hợp', 'hô hấp', 'enzyme', 'enzim', 'lục lạp',
        'ti thể', 'mARN', 'tARN', 'rARN', 'mendel', 'menđen', 'lamac', 'đacuyn',
        'tiến hóa', 'quần thể', 'quần xã', 'hệ sinh thái', 'sinh thái',
        'môi trường', 'sinh vật', 'cá thể', 'nuclêôtit', 'nucleotit',
        'axit amin', 'riboxom', 'ribôxôm', 'sinh sản', 'nguyên phân', 'giảm phân',
        'thụ tinh', 'trao đổi chất', 'cảm ứng', 'sinh trưởng', 'phát triển',
        'phiên mã', 'dịch mã', 'nhân đôi', 'codon', 'mã di truyền', 'alen',
        'kiểu gen', 'kiểu hình', 'lai', 'di truyền liên kết'
    ]
};

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

