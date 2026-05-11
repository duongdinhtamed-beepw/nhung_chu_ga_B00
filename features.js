// ============================================================
// features.js - Wires up all advanced features
// Upload, Repo, Bank, Chatbot, Generate, Weakness, Settings
// ============================================================

(function () {
    'use strict';

    let currentSession = null;
    let currentUserStore = null;
    let currentWeaknessTracker = null;

    // Toast
    function toast(msg, type = 'info') {
        const c = document.getElementById('toastContainer');
        if (!c) return;
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'times-circle' : 'info-circle');
        el.innerHTML = `<i class="fas fa-${icon}"></i><span></span>`;
        el.querySelector('span').textContent = msg;
        c.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3500);
    }

    // Safe HTML rendering using textContent
    function setText(el, text) { if (el) el.textContent = text; }

    // ========== INIT ==========
    async function init() {
        currentSession = await AuthModule.verifySession();
        if (!currentSession) return; // auth guard will redirect
        currentUserStore = new StorageModule.UserStore(currentSession.username);
        currentWeaknessTracker = new AIModule.WeaknessTracker(currentUserStore);

        setupUserMenu();
        setupUpload();
        setupRepo();
        setupBank();
        setupChatbot();
        setupGenerate();
        setupWeakness();
        setupSettings();
    }

    // ========== USER MENU ==========
    function setupUserMenu() {
        const userAvatar = document.getElementById('userAvatar');
        const userMenu = userAvatar?.closest('.user-menu');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const btnLogout = document.getElementById('btnLogout');

        if (userName) setText(userName, currentSession.username);
        if (userRole) setText(userRole, currentSession.role === 'admin' ? 'Quản trị viên' : 'Học sinh');

        userAvatar?.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu?.classList.toggle('open');
        });
        document.addEventListener('click', () => userMenu?.classList.remove('open'));
        btnLogout?.addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn đăng xuất?')) AuthModule.logout();
        });
    }

    // ========== UPLOAD ==========
    function setupUpload() {
        const zone = document.getElementById('uploadZone');
        const input = document.getElementById('uploadInput');
        if (!zone || !input) return;

        zone.addEventListener('click', () => input.click());
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFile(e.target.files[0]);
        });
    }

    async function handleFile(file) {
        const progressEl = document.getElementById('uploadProgress');
        const labelEl = document.getElementById('progressLabel');
        const fillEl = document.getElementById('progressFill');
        const pctEl = document.getElementById('progressPercent');
        const resultEl = document.getElementById('uploadResult');

        progressEl.classList.remove('hidden');
        resultEl.classList.add('hidden');
        fillEl.style.width = '0%';
        pctEl.textContent = '0%';

        try {
            const result = await UploadModule.processUpload(file, currentSession.username, (p) => {
                setText(labelEl, p.label || p.stage);
                const pct = Math.round((p.progress || 0) * 100);
                fillEl.style.width = pct + '%';
                setText(pctEl, pct + '%');
            });
            progressEl.classList.add('hidden');
            resultEl.classList.remove('hidden');
            resultEl.innerHTML = '';
            const h = document.createElement('h3');
            h.textContent = '✓ Upload thành công';
            const info = document.createElement('p');
            info.textContent = `Trích xuất ${result.totalExtracted} câu hỏi, phân loại được ${result.totalClassified} (${result.totalUnknown} không xác định). Đã lưu vào kho đề chung.`;
            resultEl.appendChild(h);
            resultEl.appendChild(info);
            toast('Upload thành công!', 'success');
        } catch (err) {
            progressEl.classList.add('hidden');
            toast(err.message, 'error');
        }
    }

    // ========== REPO ==========
    function setupRepo() {
        const btn = document.getElementById('repoRefresh');
        const search = document.getElementById('repoSearch');
        btn?.addEventListener('click', renderRepo);
        search?.addEventListener('input', renderRepo);
        // Render when section becomes active
        document.querySelector('[data-section="repo"]')?.addEventListener('click', () => setTimeout(renderRepo, 50));
    }

    function renderRepo() {
        const list = document.getElementById('repoList');
        const searchEl = document.getElementById('repoSearch');
        if (!list) return;
        const q = (searchEl?.value || '').toLowerCase();
        let repo = UploadModule.getExamRepo().sort((a, b) => b.uploadedAt - a.uploadedAt);
        if (q) repo = repo.filter(r => r.filename.toLowerCase().includes(q));

        list.innerHTML = '';
        if (repo.length === 0) {
            const p = document.createElement('p');
            p.style.color = 'var(--text-muted)';
            p.textContent = 'Chưa có đề nào trong kho.';
            list.appendChild(p);
            return;
        }
        for (const exam of repo) {
            const item = document.createElement('div');
            item.className = 'repo-item';
            const icon = document.createElement('div');
            icon.className = 'repo-item-icon';
            icon.innerHTML = '<i class="fas fa-file-alt"></i>';
            const info = document.createElement('div');
            info.className = 'repo-item-info';
            const name = document.createElement('div');
            name.className = 'repo-item-name';
            name.textContent = exam.filename;
            const meta = document.createElement('div');
            meta.className = 'repo-item-meta';
            const date = new Date(exam.uploadedAt).toLocaleString('vi-VN');
            meta.textContent = `${exam.uploadedBy} • ${date} • ${(exam.size / 1024).toFixed(1)} KB • ${exam.classifiedCount}/${exam.questionCount} câu`;
            info.appendChild(name);
            info.appendChild(meta);
            const actions = document.createElement('div');
            actions.className = 'repo-item-actions';
            if (exam.uploadedBy === currentSession.username || currentSession.role === 'admin') {
                const del = document.createElement('button');
                del.className = 'icon-btn danger';
                del.innerHTML = '<i class="fas fa-trash"></i>';
                del.title = 'Xóa đề';
                del.addEventListener('click', () => {
                    if (!confirm('Xóa đề này? Các câu hỏi liên quan cũng sẽ bị xóa.')) return;
                    try {
                        UploadModule.deleteExam(exam.id, currentSession.username, currentSession.role);
                        renderRepo();
                        toast('Đã xóa.', 'success');
                    } catch (e) { toast(e.message, 'error'); }
                });
                actions.appendChild(del);
            }
            item.appendChild(icon);
            item.appendChild(info);
            item.appendChild(actions);
            list.appendChild(item);
        }
    }

    // ========== QUESTION BANK ==========
    function setupBank() {
        const subj = document.getElementById('bankSubject');
        const diff = document.getElementById('bankDifficulty');
        const search = document.getElementById('bankSearch');
        [subj, diff, search].forEach(el => el?.addEventListener('input', renderBank));
        document.querySelector('[data-section="bank"]')?.addEventListener('click', () => setTimeout(renderBank, 50));
    }

    function renderBank() {
        const list = document.getElementById('bankList');
        const stats = document.getElementById('bankStats');
        if (!list) return;
        const subject = document.getElementById('bankSubject')?.value || '';
        const difficulty = document.getElementById('bankDifficulty')?.value || '';
        const search = document.getElementById('bankSearch')?.value || '';
        const bank = UploadModule.getQuestionBank({ subject, difficulty, search });

        const total = UploadModule.getQuestionBank();
        const counts = { math: 0, chemistry: 0, biology: 0 };
        for (const q of total) if (counts[q.subject] != null) counts[q.subject]++;
        stats.innerHTML = '';
        const addChip = (t) => { const c = document.createElement('div'); c.className = 'chip'; c.textContent = t; stats.appendChild(c); };
        addChip(`Tổng: ${total.length}`);
        addChip(`Toán: ${counts.math}`);
        addChip(`Hóa: ${counts.chemistry}`);
        addChip(`Sinh: ${counts.biology}`);

        list.innerHTML = '';
        const shown = bank.slice(0, 200);
        if (shown.length === 0) {
            const p = document.createElement('p');
            p.style.color = 'var(--text-muted)';
            p.textContent = 'Không có câu hỏi phù hợp.';
            list.appendChild(p);
            return;
        }
        for (const q of shown) {
            const item = document.createElement('div');
            item.className = 'bank-item';
            const text = document.createElement('div');
            text.className = 'bank-item-text';
            text.textContent = q.text.slice(0, 300) + (q.text.length > 300 ? '...' : '');
            const tags = document.createElement('div');
            tags.style.display = 'flex';
            tags.style.flexDirection = 'column';
            tags.style.gap = '4px';
            const subjTag = document.createElement('span');
            subjTag.className = `tag ${q.subject}`;
            subjTag.textContent = q.subject === 'math' ? 'Toán' : (q.subject === 'chemistry' ? 'Hóa' : 'Sinh');
            const diffTag = document.createElement('span');
            diffTag.className = `tag ${q.difficulty}`;
            diffTag.textContent = q.difficulty === 'easy' ? 'Dễ' : (q.difficulty === 'medium' ? 'TB' : 'Khó');
            tags.appendChild(subjTag);
            tags.appendChild(diffTag);
            item.appendChild(text);
            item.appendChild(tags);
            list.appendChild(item);
        }
        if (bank.length > 200) {
            const more = document.createElement('p');
            more.style.color = 'var(--text-muted)';
            more.style.textAlign = 'center';
            more.textContent = `... và ${bank.length - 200} câu khác`;
            list.appendChild(more);
        }
    }

    // ========== CHATBOT ==========
    function setupChatbot() {
        const form = document.getElementById('chatForm');
        const input = document.getElementById('chatInput');
        const msgs = document.getElementById('chatMessages');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const q = input.value.trim();
            if (!q) return;
            appendMsg(msgs, q, 'user');
            input.value = '';
            input.disabled = true;
            const typing = appendMsg(msgs, 'Đang suy nghĩ...', 'bot', true);
            try {
                const res = await AIModule.chatbotAsk(q, { userStore: currentUserStore });
                typing.remove();
                appendMsg(msgs, res.answer, 'bot', false, res.source);
                // heuristic: if user asked about a known topic, track it (maybe wrong answer -> weakness)
                const cls = ClassifierModule.classifySubject(q);
                if (cls.subject !== 'unknown') {
                    await currentWeaknessTracker.addMistake({
                        subject: cls.subject,
                        topic: extractTopic(q),
                        difficulty: ClassifierModule.classifyDifficulty(q)
                    });
                }
            } catch (err) {
                typing.remove();
                appendMsg(msgs, 'Lỗi: ' + err.message, 'bot');
            } finally {
                input.disabled = false;
                input.focus();
            }
        });
    }

    function extractTopic(text) {
        const keywords = [...ClassifierModule.SUBJECT_KEYWORDS.math,
                          ...ClassifierModule.SUBJECT_KEYWORDS.chemistry,
                          ...ClassifierModule.SUBJECT_KEYWORDS.biology];
        const lower = text.toLowerCase();
        for (const k of keywords) {
            if (lower.includes(k.toLowerCase())) return k;
        }
        return text.slice(0, 30);
    }

    function appendMsg(container, text, who, isTyping = false, source = null) {
        const el = document.createElement('div');
        el.className = `chat-msg ${who}`;
        const av = document.createElement('div');
        av.className = 'msg-avatar';
        av.innerHTML = who === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        const wrap = document.createElement('div');
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = text;
        wrap.appendChild(bubble);
        if (source) {
            const meta = document.createElement('div');
            meta.className = 'msg-meta';
            meta.textContent = 'Nguồn: ' + source;
            wrap.appendChild(meta);
        }
        el.appendChild(av);
        el.appendChild(wrap);
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
        return el;
    }

    // ========== GENERATE EXAM ==========
    function setupGenerate() {
        const btn = document.getElementById('btnGenerate');
        btn?.addEventListener('click', async () => {
            const count = parseInt(document.getElementById('genCount').value) || 20;
            const subjects = Array.from(document.querySelectorAll('#generate .checkbox-group')[0].querySelectorAll('input:checked')).map(i => i.value);
            const difficulties = Array.from(document.querySelectorAll('#generate .checkbox-group')[1].querySelectorAll('input:checked')).map(i => i.value);
            const focusWeak = document.getElementById('genFocusWeak').checked;
            const bank = UploadModule.getQuestionBank();
            if (bank.length === 0) {
                toast('Ngân hàng câu hỏi trống. Upload đề trước!', 'error');
                return;
            }
            let weaknessKeys = [];
            if (focusWeak) {
                weaknessKeys = await AIModule.deriveFocusTopicsFromWeakness(currentUserStore);
            }
            const exam = AIModule.generateExam({ bank, count, subjects, difficulties, weaknessKeys });
            renderExam(exam, { focusWeak, weaknessKeys });
        });
    }

    function renderExam(exam, opts) {
        const el = document.getElementById('generatedExam');
        el.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'exam-header';
        header.textContent = `Đã tạo đề gồm ${exam.length} câu${opts.focusWeak && opts.weaknessKeys.length ? ' (ưu tiên điểm yếu: ' + opts.weaknessKeys.slice(0, 5).join(', ') + ')' : ''}`;
        el.appendChild(header);
        exam.forEach((q, i) => {
            const item = document.createElement('div');
            item.className = 'bank-item';
            const text = document.createElement('div');
            text.className = 'bank-item-text';
            text.textContent = `Câu ${i + 1}: ${q.text.slice(0, 400)}`;
            const subjTag = document.createElement('span');
            subjTag.className = `tag ${q.subject}`;
            subjTag.textContent = q.subject === 'math' ? 'Toán' : (q.subject === 'chemistry' ? 'Hóa' : 'Sinh');
            item.appendChild(text);
            item.appendChild(subjTag);
            el.appendChild(item);
        });
    }

    // ========== WEAKNESS ==========
    function setupWeakness() {
        document.querySelector('[data-section="weakness"]')?.addEventListener('click', () => setTimeout(renderWeakness, 50));
        document.getElementById('btnClearWeakness')?.addEventListener('click', async () => {
            if (!confirm('Xóa toàn bộ lịch sử điểm yếu?')) return;
            await currentWeaknessTracker.clear();
            renderWeakness();
            toast('Đã xóa lịch sử.', 'success');
        });
    }

    async function renderWeakness() {
        const summary = document.getElementById('weaknessSummary');
        const list = document.getElementById('weaknessList');
        if (!summary || !list) return;
        const bySubj = await currentWeaknessTracker.getWeakSubjects();
        summary.innerHTML = '';
        const subjNames = { math: 'Toán', chemistry: 'Hóa', biology: 'Sinh' };
        for (const [k, v] of Object.entries(bySubj)) {
            const card = document.createElement('div');
            card.className = `weakness-card ${k}`;
            const score = document.createElement('div');
            score.className = 'score';
            score.textContent = v;
            const label = document.createElement('div');
            label.textContent = subjNames[k];
            card.appendChild(score);
            card.appendChild(label);
            summary.appendChild(card);
        }

        const top = await currentWeaknessTracker.getTop(20);
        list.innerHTML = '';
        if (top.length === 0) {
            const p = document.createElement('p');
            p.style.color = 'var(--text-muted)';
            p.textContent = 'Chưa có dữ liệu điểm yếu. Hãy sử dụng chatbot hoặc làm đề để hệ thống học về bạn.';
            list.appendChild(p);
            return;
        }
        for (const w of top) {
            const item = document.createElement('div');
            item.className = 'weakness-item';
            const info = document.createElement('div');
            const subjTag = document.createElement('span');
            subjTag.className = `tag ${w.subject}`;
            subjTag.textContent = subjNames[w.subject] || w.subject;
            subjTag.style.marginRight = '10px';
            const topic = document.createElement('span');
            topic.textContent = w.topic;
            info.appendChild(subjTag);
            info.appendChild(topic);
            const cnt = document.createElement('div');
            cnt.className = 'weakness-count';
            cnt.textContent = `×${w.count}`;
            item.appendChild(info);
            item.appendChild(cnt);
            list.appendChild(item);
        }
    }

    // ========== SETTINGS ==========
    function setupSettings() {
        const endpointEl = document.getElementById('aiEndpoint');
        const modelEl = document.getElementById('aiModel');
        const keyEl = document.getElementById('aiApiKey');
        const btnSave = document.getElementById('btnSaveAI');
        const btnClear = document.getElementById('btnClearAI');
        const sessionInfo = document.getElementById('sessionInfo');

        // Load current config
        const cfg = AIModule.getAIConfig();
        if (cfg.endpoint) endpointEl.value = cfg.endpoint;
        if (cfg.model) modelEl.value = cfg.model;
        if (cfg.apiKey) keyEl.placeholder = '••••••••••• (đã lưu)';

        btnSave?.addEventListener('click', () => {
            const newCfg = {
                endpoint: endpointEl.value.trim() || 'https://api.openai.com/v1/chat/completions',
                model: modelEl.value.trim() || 'gpt-3.5-turbo',
                apiKey: keyEl.value.trim() || (cfg.apiKey || '')
            };
            if (newCfg.endpoint && !/^https:\/\//i.test(newCfg.endpoint)) {
                toast('Endpoint phải bắt đầu bằng https://', 'error');
                return;
            }
            AIModule.setAIConfig(newCfg);
            keyEl.value = '';
            keyEl.placeholder = '••••••••••• (đã lưu)';
            toast('Đã lưu cấu hình AI.', 'success');
        });

        btnClear?.addEventListener('click', () => {
            AIModule.setAIConfig({});
            keyEl.value = '';
            keyEl.placeholder = 'sk-...';
            endpointEl.value = '';
            modelEl.value = '';
            toast('Đã xóa cấu hình AI.', 'success');
        });

        // Session info
        if (sessionInfo && currentSession) {
            const expires = new Date(currentSession.expiresAt).toLocaleString('vi-VN');
            const created = new Date(currentSession.createdAt).toLocaleString('vi-VN');
            sessionInfo.innerHTML = '';
            const rows = [
                ['Tài khoản', currentSession.username],
                ['Vai trò', currentSession.role],
                ['Token', currentSession.token.slice(0, 16) + '...'],
                ['Đăng nhập lúc', created],
                ['Hết hạn lúc', expires],
                ['Fingerprint', currentSession.fingerprint.slice(0, 16) + '...']
            ];
            for (const [k, v] of rows) {
                const line = document.createElement('div');
                const ks = document.createElement('span');
                ks.className = 'k';
                ks.textContent = k + ': ';
                const vs = document.createElement('span');
                vs.className = 'v';
                vs.textContent = v;
                line.appendChild(ks);
                line.appendChild(vs);
                sessionInfo.appendChild(line);
            }
        }
    }

    // Initialize after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
