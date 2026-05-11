// ============================================================
// ai.js - Chatbot + Weakness tracking + Exam generator
// Local knowledge base by default; optionally calls external AI API
// ============================================================

const AI_CONFIG_KEY = 'b00_ai_config';

function getAIConfig() {
    try { return JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || '{}'); }
    catch { return {}; }
}

function setAIConfig(cfg) {
    // Minimal validation - never log the key
    if (cfg.apiKey && typeof cfg.apiKey !== 'string') return false;
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg));
    return true;
}

// Built-in knowledge base (pre-stored "đáp án" for fast retrieval)
const KNOWLEDGE_BASE = [
    // Math
    { keys: ['đạo hàm', 'derivative', "f'"], subject: 'math', answer: 'Đạo hàm của f(x) tại x₀ là giới hạn (f(x)-f(x₀))/(x-x₀) khi x→x₀. Công thức cơ bản: (xⁿ)\' = n·xⁿ⁻¹; (sin x)\' = cos x; (cos x)\' = -sin x; (eˣ)\' = eˣ; (ln x)\' = 1/x.' },
    { keys: ['tích phân', 'integral', '∫'], subject: 'math', answer: 'Tích phân xác định: ∫ₐᵇ f(x)dx = F(b) - F(a) với F là nguyên hàm. Tích phân từng phần: ∫u dv = uv - ∫v du. Đổi biến: đặt u = g(x) → du = g\'(x)dx.' },
    { keys: ['số phức', 'complex number'], subject: 'math', answer: 'Số phức z = a + bi với i² = -1. Mô đun |z| = √(a²+b²). Số phức liên hợp: z̄ = a - bi. z·z̄ = |z|².' },
    { keys: ['xác suất', 'probability'], subject: 'math', answer: 'Xác suất của biến cố A: P(A) = n(A)/n(Ω). Quy tắc cộng: P(A∪B) = P(A)+P(B)-P(A∩B). Độc lập: P(A∩B) = P(A)·P(B).' },
    { keys: ['tổ hợp', 'chỉnh hợp'], subject: 'math', answer: 'Hoán vị Pₙ = n!. Chỉnh hợp Aₙᵏ = n!/(n-k)!. Tổ hợp Cₙᵏ = n!/[k!(n-k)!].' },
    // Chemistry
    { keys: ['este', 'ester'], subject: 'chemistry', answer: 'Este có công thức R-COO-R\'. Phản ứng xà phòng hóa: RCOOR\' + NaOH → RCOONa + R\'OH. Este no, đơn chức, mạch hở: CₙH₂ₙO₂ (n≥2).' },
    { keys: ['ancol', 'alcohol'], subject: 'chemistry', answer: 'Ancol có nhóm -OH gắn vào C no. Phản ứng với Na: R-OH + Na → R-ONa + ½H₂. Tách nước tạo anken (H₂SO₄ đặc, 170°C).' },
    { keys: ['kim loại kiềm', 'na', 'k'], subject: 'chemistry', answer: 'Kim loại kiềm (Li, Na, K, Rb, Cs) có 1e lớp ngoài cùng. Tính khử rất mạnh. Tác dụng mãnh liệt với nước: 2Na + 2H₂O → 2NaOH + H₂↑.' },
    { keys: ['amino axit', 'amin'], subject: 'chemistry', answer: 'Amino axit có -NH₂ và -COOH. Lưỡng tính: tác dụng cả axit và bazơ. Glyxin H₂N-CH₂-COOH. Điểm đẳng điện pI: số -NH₂ = số -COOH.' },
    { keys: ['điện phân'], subject: 'chemistry', answer: 'Điện phân dung dịch: tại catot, cation kim loại sau Al³⁺ bị khử; tại anot, anion không có oxi (Cl⁻, Br⁻...) bị oxi hóa trước. Định luật Faraday: m = (A·I·t)/(n·F).' },
    // Biology
    { keys: ['adn', 'dna'], subject: 'biology', answer: 'ADN gồm 2 mạch xoắn kép, cấu tạo từ nuclêôtit (A, T, G, X). Nguyên tắc bổ sung: A-T (2 LK H), G-X (3 LK H). Nhân đôi theo nguyên tắc bán bảo toàn.' },
    { keys: ['quang hợp', 'photosynthesis'], subject: 'biology', answer: 'Quang hợp: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Pha sáng ở tilacoit (tạo ATP, NADPH). Pha tối ở chất nền lục lạp (chu trình Canvin).' },
    { keys: ['gen', 'mã di truyền'], subject: 'biology', answer: 'Gen là đoạn ADN mang thông tin mã hóa chuỗi pôlipeptit. Mã di truyền gồm bộ ba (codon), đặc điểm: phổ biến, đặc hiệu, thoái hóa. 3 codon kết thúc: UAA, UAG, UGA.' },
    { keys: ['mendel', 'menđen'], subject: 'biology', answer: 'Quy luật phân li: mỗi tính trạng do cặp alen quy định, giảm phân mỗi alen đi về một giao tử. Phân li độc lập: các cặp gen phân li độc lập khi nằm trên các cặp NST khác nhau.' },
    { keys: ['nguyên phân', 'giảm phân'], subject: 'biology', answer: 'Nguyên phân: tạo 2 tế bào con có bộ NST 2n giống nhau. Giảm phân: qua 2 lần phân bào, tạo 4 giao tử có bộ NST n. Ý nghĩa: tạo biến dị tổ hợp.' }
];

function simulatedAnswer(question) {
    const lower = String(question).toLowerCase();
    const matches = KNOWLEDGE_BASE
        .map(item => ({
            item,
            score: item.keys.reduce((s, k) => s + (lower.includes(k.toLowerCase()) ? k.length : 0), 0)
        }))
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score);
    if (matches.length > 0) {
        const top = matches[0].item;
        return {
            answer: top.answer,
            source: 'Kho kiến thức cục bộ',
            subject: top.subject,
            isSimulated: true
        };
    }
    return {
        answer: 'Câu hỏi của bạn chưa có trong kho kiến thức cục bộ. Để nhận câu trả lời chi tiết từ AI nâng cao, vui lòng cấu hình API key trong phần Cài đặt (tab "AI"). Hệ thống hỗ trợ chuẩn OpenAI-compatible.',
        source: 'Kho kiến thức cục bộ',
        subject: 'unknown',
        isSimulated: true
    };
}

async function askRealAI(question, cfg) {
    const endpoint = cfg.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = cfg.model || 'gpt-3.5-turbo';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cfg.apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: 'Bạn là gia sư môn Toán - Hóa - Sinh (tổ hợp B00) cho học sinh ôn thi THPT Quốc gia Việt Nam. Trả lời ngắn gọn, chính xác, có công thức và ví dụ.' },
                    { role: 'user', content: question }
                ],
                max_tokens: 800,
                temperature: 0.3
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
            return { answer: `Lỗi API (${res.status}): ${res.statusText}`, source: 'AI API', isSimulated: false };
        }
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || 'Không có phản hồi.';
        return { answer, source: model, isSimulated: false };
    } catch (err) {
        clearTimeout(timeoutId);
        return { answer: `Lỗi kết nối AI: ${err.message}`, source: 'AI API', isSimulated: false };
    }
}

async function chatbotAsk(question, { userStore } = {}) {
    const clean = SecurityUtils.sanitizeText(question, 2000);
    if (!clean.trim()) return { answer: 'Vui lòng nhập câu hỏi.', source: '-', isSimulated: true };
    if (SecurityUtils.detectInjection(clean)) {
        return { answer: 'Câu hỏi chứa ký tự không hợp lệ.', source: '-', isSimulated: true };
    }

    const cfg = getAIConfig();
    let response;
    if (cfg.apiKey) response = await askRealAI(clean, cfg);
    else response = simulatedAnswer(clean);

    // Log conversation to user's history
    if (userStore) {
        const history = (await userStore.get('chat_history')) || [];
        history.push({
            q: clean,
            a: response.answer,
            at: Date.now(),
            source: response.source
        });
        if (history.length > 100) history.splice(0, history.length - 100);
        await userStore.set('chat_history', history);
    }
    return response;
}

// ====== Weakness tracking ======
class WeaknessTracker {
    constructor(userStore) { this.store = userStore; }
    async addMistake({ subject, topic, difficulty, questionId }) {
        const data = (await this.store.get('weaknesses')) || {};
        const key = `${subject}::${topic}`;
        if (!data[key]) {
            data[key] = { subject, topic, difficulty, count: 0, firstSeen: Date.now(), questionIds: [] };
        }
        data[key].count++;
        data[key].lastSeen = Date.now();
        if (questionId && !data[key].questionIds.includes(questionId)) {
            data[key].questionIds.push(questionId);
        }
        await this.store.set('weaknesses', data);
    }
    async getAll() {
        return (await this.store.get('weaknesses')) || {};
    }
    async getTop(n = 10) {
        const data = await this.getAll();
        return Object.values(data).sort((a, b) => b.count - a.count).slice(0, n);
    }
    async getWeakSubjects() {
        const data = await this.getAll();
        const bySubj = { math: 0, chemistry: 0, biology: 0 };
        for (const w of Object.values(data)) {
            if (bySubj[w.subject] != null) bySubj[w.subject] += w.count;
        }
        return bySubj;
    }
    async clear() { await this.store.remove('weaknesses'); }
}

// ====== Exam generator ======
// Picks questions from bank weighted by user's weaknesses
function generateExam({ bank, count = 20, subjects = [], difficulties = [], focusTopics = [], weaknessKeys = [] }) {
    let pool = bank.filter(q => {
        if (subjects.length && !subjects.includes(q.subject)) return false;
        if (difficulties.length && !difficulties.includes(q.difficulty)) return false;
        return true;
    });
    if (pool.length === 0) return [];

    const focusLower = focusTopics.map(t => String(t).toLowerCase()).filter(Boolean);
    const weakLower = weaknessKeys.map(t => String(t).toLowerCase()).filter(Boolean);

    // Score each question: higher = more priority
    const scored = pool.map(q => {
        const txt = String(q.text || '').toLowerCase();
        let score = Math.random(); // base randomness
        for (const t of focusLower) if (txt.includes(t)) score += 5;
        for (const t of weakLower) if (txt.includes(t)) score += 3;
        return { q, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, count).map(s => s.q);
}

// Returns list of topic keywords to focus on based on user's weakness data
async function deriveFocusTopicsFromWeakness(userStore, subject = null) {
    const tracker = new WeaknessTracker(userStore);
    const top = await tracker.getTop(15);
    return top
        .filter(w => !subject || w.subject === subject)
        .map(w => w.topic)
        .filter(Boolean);
}

window.AIModule = {
    getAIConfig, setAIConfig,
    chatbotAsk, simulatedAnswer,
    WeaknessTracker, generateExam,
    deriveFocusTopicsFromWeakness,
    KNOWLEDGE_BASE
};
