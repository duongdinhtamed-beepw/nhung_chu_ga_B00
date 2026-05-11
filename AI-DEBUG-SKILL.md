# 🔧 AI Debug & Code Review Skill v2.0
## Chuyên Gia Debug Thông Minh - Execution Engine & Surgical Fixes

---

## 📋 Mô Tả Skill

Skill này cung cấp một **quy trình debug tiên tiến** với khả năng:
- ✅ **Chạy code thực tế** trên nền tảng execution để phát hiện runtime errors
- ✅ **Phân tích chính xác** từng lỗi tại dòng code cụ thể
- ✅ **Sửa surgical** - chỉ sửa dòng code cần sửa
- ✅ **Bảo vệ bộ khung** - 100% giữ nguyên cấu trúc code
- ✅ **Validation & Rollback** - Kiểm tra trước/sau, có thể quay lại

**Qui trình chính:**
```
1️⃣ Phân Tích → 2️⃣ Execution Test → 3️⃣ Error Mapping → 4️⃣ Surgical Analysis 
→ 5️⃣ Targeted Fixes → 6️⃣ Validation → 7️⃣ Verification
```

---

## 🎯 Mục Tiêu Skill

- ✅ Chạy code thực tế để phát hiện runtime errors
- ✅ Phân tích lỗi cú pháp, logic và runtime chính xác
- ✅ Sửa ONLY những dòng code cần sửa (Surgical Fixes)
- ✅ Bảo vệ 100% cấu trúc & framework của code
- ✅ Kiểm tra trước/sau (Before/After validation)
- ✅ Có khả năng rollback nếu sửa sai
- ✅ Báo cáo chi tiết về trạng thái ứng dụng

---

## 📐 QUI TRÌNH 7 BƯỚC NÂNG CẤP

### **BƯỚC 1️⃣: STATIC CODE ANALYSIS (Phân Tích Tĩnh)**

**Mục đích:** Quét code để tìm lỗi tiềm ẩn mà không cần chạy

**Công việc:**
- 📖 Scan tất cả files (HTML, CSS, JS, JSON)
- 🔍 Tìm syntax errors (cú pháp sai)
- 🔍 Tìm reference errors (biến/function không define)
- 🔍 Tìm logic errors (logic không hợp lý)
- 🔍 Tìm performance issues
- 🔍 Tìm security vulnerabilities

**Checklist:**
```
□ Cú pháp HTML/CSS/JS đúng không?
□ Tất cả function đều được define?
□ Tất cả variable đều được khai báo?
□ Imports/exports đúng không?
□ Dependencies có missing không?
□ Naming conventions đúng không?
□ Dead code có không?
□ Security issues có không?
```

**Output:**
```
🔍 STATIC ANALYSIS RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Syntax errors: 0
⚠️ Reference errors: X (Chi tiết...)
⚠️ Logic issues: X (Chi tiết...)
⚠️ Performance: X (Chi tiết...)
📊 Files scanned: X
```

---

### **BƯỚC 2️⃣: EXECUTION ENGINE (Chạy Code Thực Tế)**

**Mục đích:** Chạy code trên nền tảng execution để phát hiện runtime errors

**Nền Tảng Execution Available:**
```
✅ Node.js Environment
   - Chạy backend (server.js, API, utilities)
   - Chạy tests
   - Check dependencies

✅ Browser Environment
   - Chạy frontend (HTML/CSS/JS)
   - Test DOM manipulation
   - Test event handlers
   - Check console errors

✅ Full Stack Testing
   - Start server
   - Run web interface
   - Test interactions
   - Capture network errors
```

**Công Việc Execution:**

```bash
1️⃣ PREPARE ENVIRONMENT:
   □ Check Node.js version
   □ Check npm/yarn
   □ Install dependencies: npm install
   □ Check .env files
   □ Verify file paths

2️⃣ START EXECUTION:
   □ Khởi động server: npm start
   □ Monitor process output
   □ Capture console.log/error
   □ Capture warnings

3️⃣ RUNTIME DETECTION:
   □ Chạy từng module
   □ Test từng API endpoint
   □ Test từng function
   □ Capture all errors
   □ Record stack traces
   □ Note error line numbers
   □ Screenshot error states

4️⃣ LOAD TEST (nếu cần):
   □ Send requests
   □ Check response times
   □ Monitor memory usage
   □ Check for memory leaks
   □ Test concurrent requests
```

**Output:**
```
🧪 EXECUTION TEST RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Dependencies: Installed
✅ Server: Running on port 3000
✅ Database: Connected
❌ Error #1: [Error message]
   Location: file.js:123
   Stack: [stack trace]
   
❌ Error #2: [Error message]
   Location: file.js:456
   
⚠️ Warning #1: Deprecated API
⚠️ Warning #2: Performance issue

📊 Total Errors: X
📊 Total Warnings: X
📊 Runtime: 5.2s
📊 Memory: 45MB
```

---

### **BƯỚC 3️⃣: ERROR MAPPING (Ánh Xạ Lỗi)**

**Mục đích:** Map tất cả errors tới dòng code cụ thể

**Công Việc:**
```
Cho mỗi error:
1. Đọc stack trace
2. Xác định file: [filename]
3. Xác định dòng: [line number]
4. Xác định column: [column number]
5. Lấy code context (5 dòng trước + dòng lỗi + 5 dòng sau)
6. Xác định scope (function, class)
7. Xác định root cause
```

**Output - Error Map:**
```
📍 ERROR MAPPING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ERROR #1: TypeError - Cannot read property 'map' of undefined
   File: [script.js]
   Line: 145
   Column: 8
   
   Code Context:
   142: const data = await fetchData();
   143: console.log(data);
   144: 
>  145: const result = data.map(item => item.id);  ⬅️ ERROR HERE
   146: 
   147: return result;
   
   Scope: function processData() {...}
   Root Cause: data is undefined, likely fetchData() failed
   
   Dependencies:
   - fetchData() from api.js:25
   - Uses: Array.map()
   - Expected: data should be an array
   - Actual: data is undefined

🔴 ERROR #2: ReferenceError - userService is not defined
   File: [auth.js]
   Line: 89
   ...

📊 Total Errors Mapped: X
📊 Errors with root cause: X
```

---

### **BƯỚC 4️⃣: SURGICAL ERROR ANALYSIS (Phân Tích Lỗi Chi Tiết)**

**Mục đích:** Phân tích sâu từng lỗi để xác định FIX cần thiết

**Với mỗi lỗi, analyze:**

```
1️⃣ ERROR CLASSIFICATION:
   • Type: Syntax / Logic / Runtime / Performance
   • Severity: 🔴 High / 🟠 Medium / 🟡 Low
   • Impact: App crash / Feature broken / Minor issue
   • Scope: Global / Component / Function

2️⃣ ROOT CAUSE ANALYSIS:
   • Nguyên nhân trực tiếp (Immediate cause)
   • Nguyên nhân gốc (Root cause)
   • Contributing factors
   • When it happens (always / sometimes / edge case)

3️⃣ FIX STRATEGY:
   • Fix approach (patch / refactor / rewrite)
   • Lines to change: [Exact line numbers]
   • Lines to keep: [Exact line numbers to preserve]
   • Dependencies to check
   • Side effects to watch

4️⃣ RISK ASSESSMENT:
   • Risk level: 🟢 Low / 🟠 Medium / 🔴 High
   • Might break: [Features that might break]
   • Need to test: [Test cases]
```

**Output - Surgical Analysis:**
```
🔬 SURGICAL ERROR ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ERROR #1: data.map() - Cannot read property 'map'
   
   Classification:
   • Type: Runtime Error
   • Severity: 🔴 HIGH
   • Impact: App crash
   
   Root Cause Analysis:
   • Immediate: data is undefined
   • Root: fetchData() returned undefined instead of array
   • Contributing: No error handling in fetchData()
   
   Fix Strategy:
   ✓ Line 145 - Add null check
   ✓ Line 25 (api.js) - Add error handling
   ✓ Line 142 - Add default value
   
   Options:
   A) data?.map(...) - Optional chaining (1 line fix)
   B) if (data && data.map) - Conditional (2 line fix)
   C) data || [] - Fallback (1 line fix)
   
   Best Fix: data?.map(...) - Modern, concise, safe
   
   Lines to Change:
   • Line 145 ONLY (data.map → data?.map)
   
   Lines to Preserve:
   • Line 142-144 (context)
   • Line 146-147 (rest of function)
   • Line 1-141 (before)
   • Line 148+ (after)
   
   Risk Assessment:
   • Risk: 🟢 LOW
   • Why: Only adding safe operator
   • Test: Normal cases, null/undefined cases
```

---

### **BƯỚC 5️⃣: TARGETED CODE FIXES (Sửa Chỉ Dòng Cần Sửa)**

**Mục đích:** Sửa ONLY dòng code cần sửa, không sửa thêm, không đổi bộ khung

**Quy Tắc Vàng (Golden Rules):**
```
🎯 RULE 1: Minimal Changes
   ✅ Sửa ONLY dòng lỗi
   ❌ Không refactor code
   ❌ Không đổi style
   ❌ Không thêm comment không cần

🎯 RULE 2: Structure Preservation
   ✅ Giữ nguyên indentation
   ✅ Giữ nguyên line breaks
   ✅ Giữ nguyên function structure
   ✅ Giữ nguyên variable names
   ❌ Không rename variables
   ❌ Không move code

🎯 RULE 3: Scope Protection
   ✅ Chỉ sửa dòng lỗi
   ✅ Giữ dòng trước/sau
   ✅ Giữ nguyên scope
   ✅ Giữ nguyên dependencies
   ❌ Không add new dependencies
   ❌ Không change import/export

🎯 RULE 4: Backward Compatibility
   ✅ Fix không break feature cũ
   ✅ Fix compatible với code hiện tại
   ✅ Fix không change behavior
   ❌ Không change API
   ❌ Không change return types
```

**Khi Sửa - Quy Trình:**

```
1️⃣ PREPARATION:
   □ Backup original file
   □ Identify exact lines to change
   □ Prepare before/after code
   □ Calculate impact

2️⃣ APPLYING FIX:
   □ Load file
   □ Replace ONLY target line(s)
   □ Preserve whitespace/indentation
   □ Save file

3️⃣ VALIDATION:
   □ Syntax check (no parse errors)
   □ Structure check (code structure same)
   □ Dependency check (no broken imports)
   □ Context check (surrounding code intact)

4️⃣ QUICK TEST:
   □ Run file again
   □ Check if error fixed
   □ Check no new errors
   □ Check performance acceptable
```

**Fix Output Template:**

```
🔧 FIX #1: Null check for data.map()
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 File: script.js
📍 Lines: 145

📋 BEFORE:
142: const data = await fetchData();
143: console.log(data);
144: 
145: const result = data.map(item => item.id);
146: 
147: return result;

📋 AFTER:
142: const data = await fetchData();
143: console.log(data);
144: 
145: const result = data?.map(item => item.id);
146: 
147: return result;

🔄 CHANGES:
   Line 145: data.map → data?.map (+1 character: ?)

✅ Validation:
   ✓ Syntax: Valid JavaScript
   ✓ Structure: Preserved
   ✓ Indentation: Preserved (8 spaces)
   ✓ Dependencies: No change

⚠️ Impact:
   ✓ Fixes: data is undefined error
   ✓ Breaks: Nothing
   ✓ Performance: No impact
   ✓ Behavior: Returns undefined instead of error
```

---

### **BƯỚC 6️⃣: CODE STRUCTURE VALIDATION (Kiểm Tra Bộ Khung)**

**Mục đích:** Đảm bảo bộ khung code vẫn nguyên vẹn

**Validation Checklist:**

```
✅ BEFORE/AFTER COMPARISON:

1️⃣ FILE STRUCTURE:
   □ Same number of lines? (except changed lines)
   □ Same file size? (±10%)
   □ Same imports/exports?
   □ Same class/function definitions?

2️⃣ CODE STRUCTURE:
   □ Same indentation? (spaces/tabs)
   □ Same line breaks?
   □ Same nesting level?
   □ Same function structure?

3️⃣ SCOPE INTEGRITY:
   □ All variables still defined?
   □ All functions still defined?
   □ All imports still valid?
   □ All exports still valid?

4️⃣ LOGIC INTEGRITY:
   □ Function flow same?
   □ Return statements intact?
   □ Conditionals intact?
   □ Loops intact?

5️⃣ DEPENDENCIES:
   □ All used modules available?
   □ No circular dependencies?
   □ No broken imports?
   □ External APIs accessible?

6️⃣ SYNTAX:
   □ No parse errors?
   □ Balanced brackets?
   □ Balanced quotes?
   □ Valid JavaScript/HTML/CSS?
```

**Validation Output:**

```
✔️ CODE STRUCTURE VALIDATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 FILE METRICS:
   Before: 487 lines, 12.3 KB
   After:  487 lines, 12.3 KB
   ✅ Lines: Same
   ✅ Size: Same

🔍 STRUCTURE CHECK:
   ✅ Indentation: Preserved
   ✅ Line breaks: Preserved
   ✅ Nesting: Preserved
   ✅ Functions: 25 functions, same count
   ✅ Classes: 3 classes, same count
   ✅ Variables: All defined

📦 DEPENDENCIES:
   ✅ Imports: 12 imports, all valid
   ✅ Exports: 5 exports, all valid
   ✅ External APIs: Accessible
   ✅ No circular deps

🧪 SYNTAX:
   ✅ No parse errors
   ✅ All brackets balanced: { } [ ] ( )
   ✅ All quotes balanced: " ' `
   ✅ Valid JavaScript

📈 OVERALL:
   ✅ Bộ khung 100% nguyên vẹn
   ✅ Ready for deployment
```

---

### **BƯỚC 7️⃣: VERIFICATION & RE-EXECUTION (Xác Nhận & Chạy Lại)**

**Mục đích:** Xác nhận lỗi đã được sửa, không có lỗi mới

**Công Việc:**

```
1️⃣ RE-EXECUTION:
   □ Chạy code again (giống Bước 2)
   □ Capture new output
   □ Check for errors
   □ Compare with before

2️⃣ ERROR COMPARISON:
   □ Error #1 cũ - Fixed? ✓
   □ Error #2 cũ - Fixed? ✓
   □ Error mới có không? ✗
   □ Warning thay đổi? 

3️⃣ FEATURE TESTING:
   □ Original features still work?
   □ UI responsive?
   □ API endpoints working?
   □ Database queries ok?

4️⃣ ROLLBACK PLAN:
   □ Keep backup of old version
   □ Can revert if needed
   □ Document changes
```

**Verification Output:**

```
✅ VERIFICATION RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ERROR COMPARISON:
   
   BEFORE FIX:
   ❌ TypeError: data.map is not a function (Line 145)
   ❌ ReferenceError: userService is not defined (Line 89)
   ⚠️ Deprecated API warning

   AFTER FIX:
   ✅ TypeError: FIXED ✓
   ✅ ReferenceError: FIXED ✓
   ✅ Deprecated warning: Still there (not critical)
   
   🟢 Status: 2/2 critical errors fixed (100%)

🧪 FEATURE TESTING:
   ✅ Login: Works
   ✅ Upload: Works
   ✅ Search: Works
   ✅ Export: Works
   ✅ Charts: Display correctly
   
   🟢 Status: All features working

📈 PERFORMANCE:
   Before: 5.2s startup, 45MB memory
   After:  5.1s startup, 44MB memory
   ✅ Performance: Maintained

🎯 SUMMARY:
   ✅ All errors fixed
   ✅ No new errors
   ✅ All features work
   ✅ Performance ok
   ✅ Code structure preserved
   
   🟢 READY FOR PRODUCTION

📌 ROLLBACK INFO:
   Backup: backup_20260511_143022.js
   Changes: 3 lines in 2 files
   Time to revert: <1 minute
```

---

## 📋 CHECKLIST TOÀN BỘ QUI TRÌNH

---

## 📋 CHECKLIST TOÀN BỘ QUI TRÌNH

```
▢ BƯỚC 1: STATIC ANALYSIS
  ▢ Scan HTML/CSS/JS files
  ▢ Check syntax errors
  ▢ Check reference errors
  ▢ Check logic issues
  ▢ Ghi nhận tất cả findings

▢ BƯỚC 2: EXECUTION ENGINE
  ▢ Prepare environment
  ▢ Start execution (Node.js + Browser)
  ▢ Monitor output
  ▢ Capture all errors & warnings
  ▢ Record stack traces
  ▢ Load test (nếu cần)

▢ BƯỚC 3: ERROR MAPPING
  ▢ Map errors to line numbers
  ▢ Extract code context
  ▢ Identify dependencies
  ▢ Document error locations

▢ BƯỚC 4: SURGICAL ANALYSIS
  ▢ Classify errors (type, severity)
  ▢ Root cause analysis
  ▢ Determine fix strategy
  ▢ Risk assessment
  ▢ Identify exact lines to change

▢ BƯỚC 5: TARGETED FIXES
  ▢ Apply minimal changes
  ▢ Fix ONLY target lines
  ▢ Preserve structure
  ▢ Backup before changes
  ▢ Document changes

▢ BƯỚC 6: STRUCTURE VALIDATION
  ▢ Check file structure
  ▢ Check code structure
  ▢ Check scope integrity
  ▢ Check dependencies
  ▢ Check syntax
  ▢ Verify bộ khung nguyên vẹn

▢ BƯỚC 7: VERIFICATION
  ▢ Re-execute code
  ▢ Compare errors before/after
  ▢ Test all features
  ▢ Check performance
  ▢ Confirm fixes working
  ▢ Plan rollback if needed
```

---

## 🔧 ADVANCED FIX TEMPLATES

### **Template 1: Single Line Fix**

```
🔧 FIX: [Error name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 File: filename.js
📍 Line: 145

❌ BEFORE (Line 145):
   const result = data.map(item => item.id);

✅ AFTER (Line 145):
   const result = data?.map(item => item.id);

🔄 CHANGE: Add optional chaining operator (?)
📊 Impact: 1 character added, syntax valid
✓ Validated: Structure preserved, no breaking changes
```

### **Template 2: Multi-Line Fix (Same File)**

```
🔧 FIX: [Error name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 File: api.js
📍 Lines: 45-50

❌ BEFORE:
   45: const response = fetch(url);
   46: const data = await response.json();
   47: return data;

✅ AFTER:
   45: const response = await fetch(url);
   46: const data = await response.json();
   47: return data;

🔄 CHANGE: Add 'await' keyword on line 45
📊 Impact: Prevents race condition
✓ Validated: No structural changes, syntax valid
```

### **Template 3: Multiple File Fixes**

```
🔧 FIX BATCH: Handle undefined data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fix #1 - script.js:145
   data.map → data?.map

Fix #2 - api.js:25
   return data → return data || []

Fix #3 - utils.js:89
   Add null check in processData()

📊 Total Changes: 3 targeted fixes
✓ All validated: Structures preserved
✓ All tested: Re-execution successful
```

---

## 📊 ADVANCED STATUS REPORT TEMPLATE

**Báo cáo chi tiết với execution details:**

```
📈 EXECUTION DEBUG REPORT - ADVANCED v2.0
╔════════════════════════════════════════════════════════════╗
║ 📅 Ngày: [Date] | 🕐 Thời gian: [Time]                   ║
║ 🎯 Project: [Project] | Version: v[X.X]                 ║
║ 🔧 Mode: Execution + Surgical Fixes                      ║
╚════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EXECUTION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ENVIRONMENT:
   • Node.js: v[X.X.X] ✓
   • npm: v[X.X.X] ✓
   • Dependencies: [X packages] ✓
   • Database: [Status] ✓

✅ EXECUTION METRICS:
   • Startup time: 5.2s
   • Runtime memory: 45MB
   • Processes: [X] running
   • Connections: [X] active

❌ RUNTIME ERRORS:
   🔴 Error #1: TypeError - data.map is not a function
      Location: script.js:145
      Severity: HIGH
      
   🔴 Error #2: ReferenceError - userService undefined
      Location: auth.js:89
      Severity: HIGH

⚠️ WARNINGS:
   🟡 Warning #1: Deprecated API usage
      Location: api.js:32
      Severity: LOW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 ERROR MAPPING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Error #1 Details:
   Root Cause: data is undefined, fetchData() failed
   Impact: App crash when processing results
   Fix Strategy: Add null check with optional chaining
   Lines to change: [145 ONLY]
   Risk: 🟢 LOW

🔴 Error #2 Details:
   Root Cause: userService not imported
   Impact: Authentication fails
   Fix Strategy: Fix import statement or initialization
   Lines to change: [Line X]
   Risk: 🟢 LOW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 FIXES APPLIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Fix #1: Null check for data
   File: script.js | Line: 145
   Change: data.map → data?.map
   Status: ✓ Applied & Tested

✅ Fix #2: Import userService
   File: auth.js | Line: 89
   Change: Added import or initialization
   Status: ✓ Applied & Tested

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✔️ CODE STRUCTURE VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before:  487 lines, 12.3 KB, 25 functions, 3 classes
After:   487 lines, 12.3 KB, 25 functions, 3 classes

✅ File structure: 100% preserved
✅ Code structure: 100% preserved
✅ Indentation: 100% preserved
✅ Dependencies: All valid
✅ Syntax: No errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 VERIFICATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before Fixes:
   ❌ Error #1: TypeError at script.js:145
   ❌ Error #2: ReferenceError at auth.js:89
   ⚠️ Warning #1: Deprecated API

After Fixes:
   ✅ Error #1: FIXED ✓
   ✅ Error #2: FIXED ✓
   ⚠️ Warning #1: Still present (non-critical)

✅ Features Test:
   ✓ Login module: Working
   ✓ Data processing: Working
   ✓ API calls: Working
   ✓ UI rendering: Working

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY & VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Critical Errors: 2/2 FIXED (100%)
Code Structure: ✓ PRESERVED (100%)
Features: ✓ ALL WORKING
Performance: ✓ MAINTAINED
Code Quality: ✓ IMPROVED

🟢 STATUS: READY FOR PRODUCTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔙 ROLLBACK INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backup Location: backup_20260511_143022/
Files Changed: 2 (script.js, auth.js)
Lines Changed: 2
Time to Revert: <1 minute
Revert Command: git checkout HEAD script.js auth.js
```

---

## 🚀 CÁCH SỬ DỤNG SKILL v2.0

**Gọi skill này để:**

```
@mention @debug-skill-v2
"Debug với execution engine - chạy code thực tế, 
phát hiện lỗi, sửa chỉ những dòng cần sửa,
bảo vệ bộ khung code"

hoặc

@mention @debug-skill-v2
"Surgical debug - minimal changes, maximum reliability"

hoặc

"Chạy và fix - chỉ sửa những gì cần sửa"
```

**Skill sẽ:**
1. ✅ Static analysis (phân tích tĩnh)
2. ✅ Execution engine (chạy code thực tế)
3. ✅ Error mapping (ánh xạ lỗi chính xác)
4. ✅ Surgical analysis (phân tích chi tiết)
5. ✅ Targeted fixes (sửa chỉ dòng cần sửa)
6. ✅ Structure validation (kiểm tra bộ khung)
7. ✅ Verification (xác nhận fixes)

---

## ⚡ KEY DIFFERENCES - v1.0 vs v2.0

| Tiêu chí | v1.0 | v2.0 |
|---------|------|------|
| **Code Analysis** | Static only | Static + Dynamic |
| **Execution** | Manual testing | Automated engine |
| **Error Detection** | Heuristic | Precise line numbers |
| **Fix Scope** | Broad | Surgical (targeted) |
| **Structure Safety** | Manual check | Automated validation |
| **Changes Made** | Multiple lines | Minimal lines only |
| **Rollback** | Manual | Pre-planned & documented |
| **Report Detail** | Basic | Comprehensive |
| **Reliability** | Good | Excellent |
| **Speed** | Slow | Fast |

---

## 🎯 SURGICAL FIX PRINCIPLES

### **Principle 1: Minimal Delta**
```
✅ GOOD - Change only what's necessary
   data.map(item => item.id)
   ↓
   data?.map(item => item.id)  ← 1 char added

❌ BAD - Unnecessary refactoring
   data.map(item => item.id)
   ↓
   const safeData = data || [];
   return safeData.map(item => item.id);  ← Multiple changes
```

### **Principle 2: Context Preservation**
```
✅ GOOD - Surrounding code untouched
   140: function process(data) {
   141:   const items = [];
   142:   const result = data?.map(...);  ← Only this line changed
   143:   return result;
   144: }

❌ BAD - Touching surrounding code
   140: function process(data) {
   141:   const items = [];
   142:   if (data) {  ← Added context change
   143:     const result = data.map(...);
   144:   }
   145:   return result;
   146: }
```

### **Principle 3: Zero Side Effects**
```
✅ GOOD - No behavior change
   Original: data.map() → error
   Fixed:    data?.map() → undefined (safe)
   Behavior: Error prevented, same effect

❌ BAD - Changes behavior
   Original: throw error if null
   Fixed:    silently skip
   Behavior: Different error handling
```

---

## 📌 LƯU Ý QUAN TRỌNG

⚠️ **Critical Guidelines:**

1️⃣ **Execution First**
   - Luôn chạy code trước khi sửa
   - Capture chính xác line numbers
   - Record stack traces

2️⃣ **Surgical Only**
   - Chỉ sửa dòng lỗi
   - Không refactor
   - Không optimize (trừ khi fix yêu cầu)
   - Không thêm features

3️⃣ **Structure Protection**
   - Giữ indentation
   - Giữ line breaks
   - Giữ function structure
   - Giữ variable names

4️⃣ **Validation Always**
   - Check syntax before
   - Check syntax after
   - Validate structure
   - Test thoroughly

5️⃣ **Rollback Ready**
   - Backup trước sửa
   - Document changes
   - Keep git history
   - Test revert process

✅ **Khi xong:**
- Code chạy bình thường ✓
- Tất cả lỗi critical fixed ✓
- Bộ khung 100% nguyên vẹn ✓
- Không có lỗi mới ✓
- Ready for production ✓

---

**Phiên bản: 2.0 ADVANCED**
**Ngày tạo: 2026-05-11**
**Upgrade từ: v1.0 (2026-05-09)**
**Cho dự án: OnThi THPT 2026 & Universal Projects**
**Features: Execution Engine + Surgical Fixes + Structure Preservation**

## 🚀 CÁCH SỬ DỤNG SKILL v2.0

**Gọi skill này để:**

```
@mention @debug-skill-v2
"Debug với execution engine - chạy code thực tế, 
phát hiện lỗi, sửa chỉ những dòng cần sửa,
bảo vệ bộ khung code"

hoặc

@mention @debug-skill-v2
"Surgical debug - minimal changes, maximum reliability"

hoặc

"Chạy và fix - chỉ sửa những gì cần sửa"
```

**Skill sẽ:**
1. ✅ Static analysis (phân tích tĩnh)
2. ✅ Execution engine (chạy code thực tế)
3. ✅ Error mapping (ánh xạ lỗi chính xác)
4. ✅ Surgical analysis (phân tích chi tiết)
5. ✅ Targeted fixes (sửa chỉ dòng cần sửa)
6. ✅ Structure validation (kiểm tra bộ khung)
7. ✅ Verification (xác nhận fixes)

---

## ⚡ KEY DIFFERENCES - v1.0 vs v2.0

| Tiêu chí | v1.0 | v2.0 |
|---------|------|------|
| **Code Analysis** | Static only | Static + Dynamic |
| **Execution** | Manual testing | Automated engine |
| **Error Detection** | Heuristic | Precise line numbers |
| **Fix Scope** | Broad | Surgical (targeted) |
| **Structure Safety** | Manual check | Automated validation |
| **Changes Made** | Multiple lines | Minimal lines only |
| **Rollback** | Manual | Pre-planned & documented |
| **Report Detail** | Basic | Comprehensive |
| **Reliability** | Good | Excellent |
| **Speed** | Slow | Fast |

---

## 🎯 SURGICAL FIX PRINCIPLES

### **Principle 1: Minimal Delta**
```
✅ GOOD - Change only what's necessary
   data.map(item => item.id)
   ↓
   data?.map(item => item.id)  ← 1 char added

❌ BAD - Unnecessary refactoring
   data.map(item => item.id)
   ↓
   const safeData = data || [];
   return safeData.map(item => item.id);  ← Multiple changes
```

### **Principle 2: Context Preservation**
```
✅ GOOD - Surrounding code untouched
   140: function process(data) {
   141:   const items = [];
   142:   const result = data?.map(...);  ← Only this line changed
   143:   return result;
   144: }

❌ BAD - Touching surrounding code
   140: function process(data) {
   141:   const items = [];
   142:   if (data) {  ← Added context change
   143:     const result = data.map(...);
   144:   }
   145:   return result;
   146: }
```

### **Principle 3: Zero Side Effects**
```
✅ GOOD - No behavior change
   Original: data.map() → error
   Fixed:    data?.map() → undefined (safe)
   Behavior: Error prevented, same effect

❌ BAD - Changes behavior
   Original: throw error if null
   Fixed:    silently skip
   Behavior: Different error handling
```

---

## 📌 LƯU Ý QUAN TRỌNG

⚠️ **Critical Guidelines:**

1️⃣ **Execution First**
   - Luôn chạy code trước khi sửa
   - Capture chính xác line numbers
   - Record stack traces

2️⃣ **Surgical Only**
   - Chỉ sửa dòng lỗi
   - Không refactor
   - Không optimize (trừ khi fix yêu cầu)
   - Không thêm features

3️⃣ **Structure Protection**
   - Giữ indentation
   - Giữ line breaks
   - Giữ function structure
   - Giữ variable names

4️⃣ **Validation Always**
   - Check syntax before
   - Check syntax after
   - Validate structure
   - Test thoroughly

5️⃣ **Rollback Ready**
   - Backup trước sửa
   - Document changes
   - Keep git history
   - Test revert process

✅ **Khi xong:**
- Code chạy bình thường ✓
- Tất cả lỗi critical fixed ✓
- Bộ khung 100% nguyên vẹn ✓
- Không có lỗi mới ✓
- Ready for production ✓

---

**Phiên bản: 2.0 ADVANCED**
**Ngày tạo: 2026-05-11**
**Upgrade từ: v1.0 (2026-05-09)**
**Cho dự án: OnThi THPT 2026 & Universal Projects**
**Features: Execution Engine + Surgical Fixes + Structure Preservation**
