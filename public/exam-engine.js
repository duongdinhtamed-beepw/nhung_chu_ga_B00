// ============================================================
// exam-engine.js - Practice and official exam generation
// Builds structured questions from the local question bank.
// ============================================================

(function () {
    'use strict';

    const SUBJECT_NAMES = {
        math: 'Toán',
        chemistry: 'Hóa học',
        biology: 'Sinh học'
    };

    const OFFICIAL_BLUEPRINTS = {
        math: {
            durationMinutes: 90,
            commandCount: 34,
            parts: [
                { key: 'mcq', label: 'Phần I - Trắc nghiệm nhiều lựa chọn', count: 12 },
                { key: 'truefalse', label: 'Phần II - Trắc nghiệm đúng/sai', count: 4 },
                { key: 'short', label: 'Phần III - Trả lời ngắn', count: 6 }
            ]
        },
        chemistry: {
            durationMinutes: 50,
            commandCount: 40,
            parts: [
                { key: 'mcq', label: 'Phần I - Trắc nghiệm nhiều lựa chọn', count: 18 },
                { key: 'truefalse', label: 'Phần II - Trắc nghiệm đúng/sai', count: 4 },
                { key: 'short', label: 'Phần III - Trả lời ngắn', count: 6 }
            ]
        },
        biology: {
            durationMinutes: 50,
            commandCount: 40,
            parts: [
                { key: 'mcq', label: 'Phần I - Trắc nghiệm nhiều lựa chọn', count: 18 },
                { key: 'truefalse', label: 'Phần II - Trắc nghiệm đúng/sai', count: 4 },
                { key: 'short', label: 'Phần III - Trả lời ngắn', count: 6 }
            ]
        }
    };

    const SAMPLE_IMAGES = {
        math: 'https://placehold.co/720x420/ffffff/2563eb?text=Do+thi+hoac+hinh+ve',
        chemistry: 'https://placehold.co/720x420/ffffff/2fa872?text=So+do+thi+nghiem',
        biology: 'https://placehold.co/720x420/ffffff/8b7cf6?text=So+do+sinh+hoc'
    };

    function clamp(num, min, max) {
        return Math.max(min, Math.min(max, Number(num) || min));
    }

    function shuffle(list) {
        const arr = [...list];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function normalizeSymbols(text) {
        return String(text || '')
            .replace(/\bpi\b/gi, 'π')
            .replace(/sqrt\s*\(([^)]+)\)/gi, '√($1)')
            .replace(/sqrt/gi, '√')
            .replace(/->/g, '→')
            .replace(/<=/g, '≤')
            .replace(/>=/g, '≥')
            .replace(/\+-/g, '±')
            .replace(/\bdelta\b/gi, 'Δ')
            .replace(/\balpha\b/gi, 'α')
            .replace(/\bbeta\b/gi, 'β')
            .replace(/\bgamma\b/gi, 'γ')
            .replace(/\btheta\b/gi, 'θ')
            .replace(/\binf\b/gi, '∞')
            .replace(/\bH2O\b/g, 'H₂O')
            .replace(/\bCO2\b/g, 'CO₂')
            .replace(/\bO2\b/g, 'O₂')
            .replace(/\bH2\b/g, 'H₂')
            .replace(/\bH2SO4\b/g, 'H₂SO₄')
            .replace(/\bHNO3\b/g, 'HNO₃')
            .replace(/\bNH3\b/g, 'NH₃')
            .replace(/\bCaCO3\b/g, 'CaCO₃')
            .replace(/\bAgNO3\b/g, 'AgNO₃')
            .replace(/\bKMnO4\b/g, 'KMnO₄')
            .replace(/\bADN\b/g, 'DNA')
            .replace(/\bARN\b/g, 'RNA');
    }

    function inferTopic(text, subject) {
        const keywords = window.ClassifierModule?.SUBJECT_KEYWORDS?.[subject] || [];
        const lower = String(text || '').toLowerCase();
        for (const keyword of keywords) {
            if (lower.includes(String(keyword).toLowerCase())) return keyword;
        }
        return SUBJECT_NAMES[subject] || 'Chủ đề tổng hợp';
    }

    function imageFor(question) {
        if (question.imageUrl) return question.imageUrl;
        const text = String(question.text || '').toLowerCase();
        if (/hình|đồ thị|bảng|sơ đồ|biểu đồ|graph/.test(text)) return SAMPLE_IMAGES[question.subject] || null;
        return null;
    }

    function optionSet(question, index) {
        const text = normalizeSymbols(question.text);
        const numbers = text.match(/-?\d+(?:[,.]\d+)?/g) || [];
        const base = numbers.length ? Number(String(numbers[numbers.length - 1]).replace(',', '.')) : NaN;
        if (Number.isFinite(base)) {
            const correct = String(base);
            return shuffle([correct, String(base + 1), String(Math.max(0, base - 1)), String(base + 2)])
                .map((value, i) => ({ key: 'ABCD'[i], text: value, correct: value === correct }));
        }
        const correct = 'Kết luận phù hợp nhất với dữ kiện đề bài';
        return shuffle([
            { text: correct, correct: true },
            { text: 'Kết luận chưa đủ điều kiện' },
            { text: 'Mệnh đề trái với dữ kiện đã cho' },
            { text: 'Không xác định từ dữ kiện đề bài' }
        ]).map((option, i) => ({ ...option, key: 'ABCD'[i] }));
    }

    function trueFalseStatements(question) {
        const topic = inferTopic(question.text, question.subject);
        return [
            { key: 'a', text: `Mệnh đề liên quan đến ${topic} phù hợp với dữ kiện chính.`, correct: true },
            { key: 'b', text: 'Có thể kết luận ngay mà không cần xét điều kiện xác định.', correct: false },
            { key: 'c', text: 'Nếu thay đổi dữ kiện ban đầu, kết quả có thể thay đổi.', correct: true },
            { key: 'd', text: 'Mọi cách suy luận đều luôn cho cùng một kết quả.', correct: false }
        ];
    }

    function shortAnswer(question) {
        const text = normalizeSymbols(question.text);
        const numbers = text.match(/-?\d+(?:[,.]\d+)?/g) || [];
        if (numbers.length) return numbers[numbers.length - 1].replace(',', '.');
        return inferTopic(question.text, question.subject).slice(0, 32);
    }

    function detailedSolution(question, type) {
        const topic = inferTopic(question.text, question.subject);
        const subjectName = SUBJECT_NAMES[question.subject] || 'môn học';
        const steps = [
            `Xác định chủ đề: ${topic} (${subjectName}).`,
            'Tách dữ kiện, chuẩn hóa kí hiệu toán/hóa/sinh và kiểm tra điều kiện áp dụng.',
            'Chọn công thức hoặc quy luật phù hợp, sau đó thay số hoặc đối chiếu từng mệnh đề.',
            'Kết luận đáp án cuối cùng và rà lại đơn vị/kí hiệu.'
        ];
        if (type === 'mcq') steps.push('Với câu nhiều lựa chọn, loại nhanh các phương án sai trước khi chọn đáp án.');
        if (type === 'truefalse') steps.push('Với câu đúng/sai, xét độc lập từng ý a, b, c, d.');
        if (type === 'short') steps.push('Với câu trả lời ngắn, chỉ nhập kết quả cuối cùng nếu đề không yêu cầu đơn vị.');
        return steps;
    }

    function toStructuredQuestion(question, type, index) {
        const base = {
            id: `${type}_${question.id || crypto.randomUUID()}_${index}`,
            sourceId: question.id || null,
            type,
            subject: question.subject,
            difficulty: question.difficulty || 'medium',
            topic: question.topic || inferTopic(question.text, question.subject),
            text: normalizeSymbols(question.text),
            imageUrl: imageFor(question),
            explanation: detailedSolution(question, type)
        };
        if (type === 'mcq') {
            const options = optionSet(question, index);
            return { ...base, options, answer: options.find(o => o.correct)?.key || 'A' };
        }
        if (type === 'truefalse') {
            const statements = trueFalseStatements(question);
            return { ...base, statements, answer: Object.fromEntries(statements.map(s => [s.key, Boolean(s.correct)])) };
        }
        return { ...base, answer: shortAnswer(question) };
    }

    function pickPool(bank, { subjects = [], difficulties = [], count = 20, weaknessKeys = [] }) {
        const filtered = bank.filter(q => {
            if (subjects.length && !subjects.includes(q.subject)) return false;
            if (difficulties.length && !difficulties.includes(q.difficulty)) return false;
            return q.subject && q.subject !== 'unknown';
        });
        const weakLower = weaknessKeys.map(k => String(k).toLowerCase());
        const scored = filtered.map(q => {
            const txt = String(q.text || '').toLowerCase();
            let score = Math.random();
            for (const key of weakLower) if (txt.includes(key)) score += 4;
            if (q.imageUrl) score += 0.5;
            return { q, score };
        }).sort((a, b) => b.score - a.score);
        return scored.slice(0, count).map(item => item.q);
    }

    function generatePracticeExam({ bank, count, subjects, difficulties, weaknessKeys }) {
        const safeCount = clamp(count, 5, 50);
        const pool = pickPool(bank, { subjects, difficulties, count: safeCount, weaknessKeys });
        const types = ['mcq', 'truefalse', 'short'];
        const questions = pool.map((q, index) => toStructuredQuestion(q, types[index % types.length], index));
        return {
            mode: 'practice',
            title: 'Đề ôn luyện tự tạo',
            durationMinutes: null,
            commandCount: questions.reduce((sum, q) => sum + (q.type === 'truefalse' ? 4 : 1), 0),
            questions
        };
    }

    function generateOfficialExam({ bank, subject }) {
        const blueprint = OFFICIAL_BLUEPRINTS[subject] || OFFICIAL_BLUEPRINTS.math;
        const needed = blueprint.parts.reduce((sum, part) => sum + part.count, 0);
        const pool = pickPool(bank, { subjects: [subject], difficulties: [], count: needed });
        let cursor = 0;
        const sections = blueprint.parts.map(part => {
            const raw = pool.slice(cursor, cursor + part.count);
            cursor += part.count;
            return {
                ...part,
                questions: raw.map((q, i) => toStructuredQuestion(q, part.key, cursor + i))
            };
        });
        return {
            mode: 'official',
            title: `Đề thi thật mô phỏng THPT 2026 - ${SUBJECT_NAMES[subject]}`,
            durationMinutes: blueprint.durationMinutes,
            commandCount: blueprint.commandCount,
            sections,
            questions: sections.flatMap(section => section.questions)
        };
    }

    function scoreExam(exam, answers) {
        let correct = 0;
        let total = 0;
        for (const q of exam.questions || []) {
            if (q.type === 'mcq') {
                total++;
                if (answers[q.id] === q.answer) correct++;
            } else if (q.type === 'short') {
                total++;
                const expected = String(q.answer || '').trim().toLowerCase();
                const actual = String(answers[q.id] || '').trim().toLowerCase();
                if (actual && actual === expected) correct++;
            } else if (q.type === 'truefalse') {
                for (const statement of q.statements || []) {
                    total++;
                    if (answers[`${q.id}_${statement.key}`] === Boolean(q.answer?.[statement.key])) correct++;
                }
            }
        }
        return {
            correct,
            total,
            score10: total ? Math.round((correct / total) * 1000) / 100 : 0
        };
    }

    window.ExamEngine = {
        SUBJECT_NAMES,
        OFFICIAL_BLUEPRINTS,
        normalizeSymbols,
        generatePracticeExam,
        generateOfficialExam,
        scoreExam
    };
})();

