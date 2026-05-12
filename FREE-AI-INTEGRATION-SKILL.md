# 🤖 FREE AI INTEGRATION SKILL v1.0
## Chuyên Gia Tích Hợp AI Miễn Phí - Tạo Code Nhanh & Chính Xác

---

## 📋 Mô Tả Skill

Skill này cung cấp **hệ thống tích hợp AI miễn phí** với khả năng:
- ✅ **Danh sách AI services miễn phí** (Hugging Face, Together.ai, OpenRouter, v.v.)
- ✅ **Code templates sẵn sàng** để copy-paste và chạy ngay
- ✅ **Error handling & rate limiting** tự động
- ✅ **Fallback & retry logic** thông minh
- ✅ **Performance optimization** cho request/response
- ✅ **Hỗ trợ Node.js, Python, JavaScript** không cần auth phức tạp

**Qui trình chính:**
```
1️⃣ Chọn AI Service → 2️⃣ Get API Key → 3️⃣ Select Template
→ 4️⃣ Copy Code → 5️⃣ Tích hợp vào Project → 6️⃣ Test & Deploy
```

---

## 🎯 Mục Tiêu Skill

- ✅ Giảm thời gian setup từ **1 giờ xuống 5 phút**
- ✅ Cung cấp code **production-ready** ngay từ đầu
- ✅ Hỗ trợ **10+ loại tác vụ AI** phổ biến
- ✅ **Zero config** hoặc config tối thiểu
- ✅ Error handling & logging tự động
- ✅ Khả năng **fallback** khi API down
- ✅ Giả lập offline nếu không có internet

---

## 🌟 NHỮNG SERVICE AI MIỄN PHÍ TỐTT NHẤT

### **1️⃣ HUGGING FACE INFERENCE API**
**📊 Mức free:** 30,000 requests/tháng (miễn phí vĩnh viễn)

```javascript
// 🔹 Model phổ biến:
// - text-generation: gpt2, distilgpt2
// - text2text-generation: t5-base
// - text-classification: distilbert-base-uncased-finetuned-sst-2-english
// - summarization: facebook/bart-large-cnn
// - translation: Helsinki-NLP/opus-mt-en-es
// - question-answering: deepset/roberta-base-squad2
// - named-entity-recognition: dslim/bert-base-NER
// - feature-extraction: sentence-transformers/all-MiniLM-L6-v2
// - zero-shot-classification: facebook/bart-large-mnli

// 🔑 Cách lấy token: https://huggingface.co/settings/tokens
```

---

### **2️⃣ TOGETHER.AI (BEST FOR TEXT GENERATION)**
**📊 Mức free:** 1 triệu tokens/tháng

```javascript
// 🔹 Model mạnh:
// - mistralai/Mistral-7B-Instruct-v0.1
// - meta-llama/Llama-2-70b-chat-hf
// - NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO
// - togethercomputer/RedPajama-INCITE-7B-Instruct

// 🔑 Cách lấy token: https://www.together.ai/
```

---

### **3️⃣ OPENROUTER.AI (MIX CÁC MODEL)**
**📊 Mức free:** $5 credit/tháng + free-tier models

```javascript
// 🔹 Free models:
// - mistralai/mistral-7b-instruct
// - meta-llama/llama-2-70b-chat
// - google/flan-t5-xl

// 🔑 Cách lấy token: https://openrouter.ai/
```

---

### **4️⃣ REPLICATE (CHO COMPUTER VISION & AUDIO)**
**📊 Mức free:** 1 triệu seconds compute/tháng

```javascript
// 🔹 Loại tác vụ:
// - Image generation (stable-diffusion)
// - Image upscaling
// - Background removal
// - Audio transcription

// 🔑 Cách lấy token: https://replicate.com/
```

---

### **5️⃣ ELEVENLABS (TEXT-TO-SPEECH)**
**📊 Mức free:** 10,000 characters/tháng

```javascript
// 🔑 Cách lấy token: https://elevenlabs.io/
```

---

### **6️⃣ OPENWEATHER API (DỰ BÁO THỜI TIẾT)**
**📊 Mức free:** Unlimited requests (nhưng 60 req/phút)

```javascript
// 🔑 Cách lấy token: https://openweathermap.org/api
```

---

## 📐 TEMPLATE LIBRARY - COPY & PASTE NGAY

### **TEMPLATE 1️⃣: HUGGING FACE TEXT GENERATION**

```javascript
// file: utils/ai-hf.js
const HF_API_KEY = process.env.HF_API_KEY || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models';

export async function generateText(prompt, model = 'gpt2', options = {}) {
  const {
    maxTokens = 100,
    temperature = 0.7,
    retry = 3,
    timeout = 30000
  } = options;

  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(
        `${HF_API_URL}/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: maxTokens,
              temperature: temperature,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false,
            },
            options: {
              wait_for_model: true,
            }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HF API error: ${response.status} - ${error.error || 'Unknown'}`);
      }

      const result = await response.json();
      return {
        success: true,
        text: result[0]?.generated_text || '',
        model: model,
        timestamp: new Date().toISOString()
      };

    } catch (err) {
      console.warn(`Attempt ${attempt}/${retry} failed:`, err.message);
      if (attempt === retry) {
        return {
          success: false,
          error: err.message,
          model: model,
          timestamp: new Date().toISOString()
        };
      }
      await new Promise(r => setTimeout(r, 1000 * attempt)); // exponential backoff
    }
  }
}

export async function classifyText(text, model = 'distilbert-base-uncased-finetuned-sst-2-english') {
  return generateText(text, model, { maxTokens: 50 });
}

export async function summarizeText(text, model = 'facebook/bart-large-cnn') {
  return generateText(`Tóm tắt: ${text}`, model, { maxTokens: 150 });
}
```

**Cách dùng:**
```javascript
import { generateText, summarizeText } from './utils/ai-hf.js';

// Text generation
const result = await generateText('Xin chào, tôi là', 'gpt2');
console.log(result.text);

// Summarize
const summary = await summarizeText('Văn bản dài...');
console.log(summary.text);
```

---

### **TEMPLATE 2️⃣: TOGETHER.AI (STRONG MODELS)**

```javascript
// file: utils/ai-together.js
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || '';
const TOGETHER_API_URL = 'https://api.together.xyz/inference';

export async function generateWithTogether(prompt, options = {}) {
  const {
    model = 'mistralai/Mistral-7B-Instruct-v0.1',
    maxTokens = 500,
    temperature = 0.7,
    topP = 0.9,
    retry = 3,
  } = options;

  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: temperature,
          top_p: topP,
          top_k: 40,
          repetition_penalty: 1.0,
          stop: ['<|end|>', '\n\n'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Together.ai API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        text: result.output?.choices?.[0]?.text || result.output || '',
        model: model,
        tokensUsed: result.output?.usage?.output_tokens || 0,
        timestamp: new Date().toISOString()
      };

    } catch (err) {
      console.warn(`Attempt ${attempt}/${retry} failed:`, err.message);
      if (attempt === retry) {
        return {
          success: false,
          error: err.message,
          model: model,
          timestamp: new Date().toISOString()
        };
      }
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// Wrapper cho chat
export async function chatWithAI(messages, options = {}) {
  const formattedMessages = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
  
  return generateWithTogether(formattedMessages, options);
}
```

**Cách dùng:**
```javascript
import { generateWithTogether, chatWithAI } from './utils/ai-together.js';

const response = await generateWithTogether('Viết một bài thơ về AI');
console.log(response.text);
```

---

### **TEMPLATE 3️⃣: OPENROUTER.AI (MULTI-MODEL)**

```javascript
// file: utils/ai-openrouter.js
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function chatWithOpenRouter(messages, options = {}) {
  const {
    model = 'mistralai/mistral-7b-instruct:free',
    temperature = 0.7,
    maxTokens = 1000,
    retry = 3,
  } = options;

  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://localhost:3000',
          'X-Title': 'MyApp',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenRouter error: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        text: result.choices?.[0]?.message?.content || '',
        model: model,
        tokensUsed: result.usage?.total_tokens || 0,
        timestamp: new Date().toISOString()
      };

    } catch (err) {
      console.warn(`Attempt ${attempt}/${retry} failed:`, err.message);
      if (attempt === retry) {
        return {
          success: false,
          error: err.message,
          model: model,
          timestamp: new Date().toISOString()
        };
      }
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}
```

**Cách dùng:**
```javascript
import { chatWithOpenRouter } from './utils/ai-openrouter.js';

const response = await chatWithOpenRouter([
  { role: 'user', content: 'Hello, who are you?' }
]);
console.log(response.text);
```

---

### **TEMPLATE 4️⃣: REPLICATE (IMAGE GENERATION)**

```javascript
// file: utils/ai-replicate.js
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || '';
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

export async function generateImage(prompt, options = {}) {
  const {
    model = 'stability-ai/stable-diffusion',
    width = 512,
    height = 512,
    steps = 20,
    retry = 3,
    pollInterval = 1000,
  } = options;

  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      // Create prediction
      const createResponse = await fetch(REPLICATE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: model,
          input: {
            prompt: prompt,
            width: width,
            height: height,
            num_inference_steps: steps,
          },
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Replicate error: ${createResponse.statusText}`);
      }

      const prediction = await createResponse.json();
      const predictionId = prediction.id;

      // Poll until done
      let output;
      for (let poll = 0; poll < 300; poll++) { // 5 min timeout
        const pollResponse = await fetch(
          `${REPLICATE_API_URL}/${predictionId}`,
          { headers: { 'Authorization': `Token ${REPLICATE_API_KEY}` } }
        );

        const result = await pollResponse.json();
        if (result.status === 'succeeded') {
          output = result.output;
          break;
        }
        if (result.status === 'failed') {
          throw new Error(`Image generation failed: ${result.error}`);
        }

        await new Promise(r => setTimeout(r, pollInterval));
      }

      return {
        success: true,
        imageUrl: output?.[0] || null,
        prompt: prompt,
        timestamp: new Date().toISOString()
      };

    } catch (err) {
      console.warn(`Attempt ${attempt}/${retry} failed:`, err.message);
      if (attempt === retry) {
        return {
          success: false,
          error: err.message,
          prompt: prompt,
          timestamp: new Date().toISOString()
        };
      }
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}
```

---

### **TEMPLATE 5️⃣: UNIVERSAL AI WRAPPER (AUTO-FALLBACK)**

```javascript
// file: utils/ai-universal.js
import { generateText } from './ai-hf.js';
import { generateWithTogether } from './ai-together.js';
import { chatWithOpenRouter } from './ai-openrouter.js';

const AI_PROVIDERS = [
  { name: 'together', fn: generateWithTogether, active: !!process.env.TOGETHER_API_KEY },
  { name: 'openrouter', fn: chatWithOpenRouter, active: !!process.env.OPENROUTER_API_KEY },
  { name: 'huggingface', fn: generateText, active: !!process.env.HF_API_KEY },
];

export async function generateTextAuto(prompt, options = {}) {
  const { fallbackOnError = true, timeout = 30000 } = options;
  const activeProviders = AI_PROVIDERS.filter(p => p.active);

  if (activeProviders.length === 0) {
    return {
      success: false,
      error: 'No AI providers configured. Set API keys in .env',
      timestamp: new Date().toISOString()
    };
  }

  for (const provider of activeProviders) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const result = await Promise.race([
        provider.fn(prompt, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);

      if (result.success) {
        console.log(`[AI] ✅ Success with ${provider.name}`);
        return result;
      }
    } catch (err) {
      console.warn(`[AI] ❌ ${provider.name} failed: ${err.message}`);
      if (!fallbackOnError) break;
    }
  }

  return {
    success: false,
    error: 'All AI providers failed',
    providers: activeProviders.map(p => p.name),
    timestamp: new Date().toISOString()
  };
}
```

---

## 🚀 QUI TRÌNH SETUP NHANH (5 PHÚT)

### **BƯỚC 1️⃣: CHỌN SERVICE & LẤY API KEY**

```bash
# Ví dụ với Hugging Face
# 1. Vào https://huggingface.co/settings/tokens
# 2. Click "New token"
# 3. Copy token
# 4. Lưu vào .env

echo "HF_API_KEY=hf_xxxxxxxxxxxxx" >> .env
```

### **BƯỚC 2️⃣: CÀI DEPENDENCIES (nếu cần)**

```bash
npm install dotenv axios
# hoặc node fetch có sẵn từ Node 18+
```

### **BƯỚC 3️⃣: COPY TEMPLATE PHÙ HỢP**

```bash
# Tạo file utils/ai-hf.js và copy template từ trên
mkdir -p utils
cat > utils/ai-hf.js << 'EOF'
# paste template code here
EOF
```

### **BƯỚC 4️⃣: USE TRONG CODE**

```javascript
import { generateText } from './utils/ai-hf.js';

const result = await generateText('Hello world');
console.log(result.text);
```

### **BƯỚC 5️⃣: DEPLOY ĐẾN VERCEL/NETLIFY**

```bash
# Thêm secret variables:
# Settings → Environment Variables
# HF_API_KEY: hf_xxxxx
# TOGETHER_API_KEY: xxxxxx
# etc.

git push origin main
```

---

## 📊 BẢNG SO SÁNH CÁC SERVICE

| Service | Free Tier | Tốc độ | Quality | Dễ dùng | Phù hợp cho |
|---------|-----------|--------|---------|---------|------------|
| **Hugging Face** | 30k req/tháng | 🟡 | 🟡 | ✅ | Text classification, basic NLP |
| **Together.ai** | 1M tokens/tháng | 🟢 | 🟢 | ✅ | Text generation, chat |
| **OpenRouter** | $5/tháng | 🟡 | 🟢 | ✅ | Multi-model access |
| **Replicate** | 1M seconds/tháng | 🟡 | 🟢 | 🟡 | Image, audio, video |
| **ElevenLabs** | 10k chars/tháng | 🟢 | 🟢 | ✅ | Text-to-speech |

---

## 💡 TIPS & TRICKS

### **TIP 1️⃣: RATE LIMITING**
```javascript
const rateLimiter = new Map();

export function checkRateLimit(userId, maxPerMinute = 10) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  const recent = userRequests.filter(t => now - t < 60000);
  if (recent.length >= maxPerMinute) return false;
  
  rateLimiter.set(userId, [...recent, now]);
  return true;
}
```

### **TIP 2️⃣: CACHING RESULTS**
```javascript
const cache = new Map();

export async function generateWithCache(prompt, ttl = 3600000) {
  if (cache.has(prompt)) return cache.get(prompt);
  
  const result = await generateText(prompt);
  cache.set(prompt, result);
  
  setTimeout(() => cache.delete(prompt), ttl);
  return result;
}
```

### **TIP 3️⃣: FALLBACK LOCAL**
```javascript
export function generateTextLocal(prompt) {
  // Khi API fail, dùng local rules
  if (prompt.includes('?')) return 'Tôi không biết.';
  if (prompt.includes('hello')) return 'Xin chào!';
  return 'Không thể trả lời.';
}
```

### **TIP 4️⃣: ASYNC QUEUE**
```javascript
class AIQueue {
  constructor(maxConcurrent = 3) {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
  }

  async add(fn) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      this.queue.shift()?.();
    }
  }
}

const aiQueue = new AIQueue(5);
// Usage: await aiQueue.add(() => generateText(prompt));
```

---

## 🔍 DEBUGGING & LOGGING

```javascript
export function enableAILogging(level = 'debug') {
  global.AI_LOG_LEVEL = level;
}

function log(level, message, data = {}) {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  if (levels[level] >= levels[global.AI_LOG_LEVEL || 'warn']) {
    console.log(`[AI/${level.toUpperCase()}]`, message, data);
  }
}

// Usage:
// enableAILogging('debug');
// log('debug', 'API call started', { model: 'gpt2' });
```

---

## ✅ CHECKLIST KHI TÍCH HỢP

- [ ] Tạo file `.env` và thêm API keys
- [ ] Copy template từ skill này
- [ ] Test API key trước khi deploy
- [ ] Thêm error handling & logging
- [ ] Setup rate limiting nếu cần
- [ ] Thêm fallback/cache strategy
- [ ] Test trên local trước
- [ ] Thêm environment variables vào Vercel
- [ ] Monitor API usage & costs
- [ ] Setup alerts nếu quá hạn mức free

---

## 📚 TỔNG KẾT

**Thời gian setup:** ~5 phút  
**Dòng code cần viết:** ~50-100  
**Tính năng có sẵn:** Error handling, retry, fallback, logging, caching  
**Chi phí:** **MIỄN PHÍ VĨNH VIỄN** (nếu giữ trong free tier)

✨ **Chúc bạn code vui!**
