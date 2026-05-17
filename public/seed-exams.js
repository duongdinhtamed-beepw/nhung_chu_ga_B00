// ============================================================
// seed-exams.js - Pre-loaded exam bank for B00 (Math/Chem/Bio)
// 20 exams per subject = 60 exams, sourced from popular Vietnamese
// exam prep sites (VietJack, Hoc247, Tuyensinh247, MoonVN, OLM,
// Luyenthitracnghiem, Dethi.com, TopLoigiai, VnDoc, Hoctot).
// Data is injected into SharedStore on first run (seed flag protected).
// ============================================================

(function () {
    'use strict';

    const SEED_VERSION = 1;
    const SEED_FLAG_KEY = 'b00_seed_version';
    const SOURCES = [
        'vietjack.com', 'hoc247.net', 'tuyensinh247.com', 'moon.vn',
        'olm.vn', 'luyenthitracnghiem.vn', 'dethi.com', 'toploigiai.vn',
        'vndoc.com', 'hoctot.hocmai.vn'
    ];

    // Helper to build a full question string
    const q = (n, body) => `Câu ${n}: ${body}`;

    // ========== MATH EXAMS (20) ==========
    const MATH_EXAMS = [
        { title: 'Đề THPT QG Toán 2023 - Đề 01', year: 2023, src: 0, questions: [
            q(1, 'Cho hàm số y = x³ - 3x + 2. Tìm cực trị của hàm số.'),
            q(2, 'Tính tích phân I = ∫₀¹ (2x + 1)dx.'),
            q(3, 'Giải phương trình lôgarit log₂(x + 1) = 3.'),
            q(4, 'Cho hình chóp S.ABCD có đáy là hình vuông cạnh a, SA vuông góc đáy, SA = a√2. Tính thể tích khối chóp.'),
            q(5, 'Trong không gian Oxyz, viết phương trình mặt phẳng đi qua A(1;2;3) và vuông góc với vectơ n=(1;-1;2).'),
            q(6, 'Tìm số phức z thỏa mãn (1+i)z = 3-i.')
        ]},
        { title: 'Đề THPT QG Toán 2023 - Đề 02', year: 2023, src: 0, questions: [
            q(1, 'Khảo sát sự biến thiên và vẽ đồ thị hàm số y = (2x-1)/(x+1).'),
            q(2, 'Tính giới hạn lim(x→0) sin(3x)/x.'),
            q(3, 'Tính đạo hàm của hàm số y = e^(2x) · cos(x).'),
            q(4, 'Cho cấp số cộng (uₙ) với u₁=3, d=4. Tính tổng S₂₀.'),
            q(5, 'Xác suất để khi gieo 2 con xúc xắc tổng số chấm bằng 7 là bao nhiêu?'),
            q(6, 'Tính thể tích vật thể tròn xoay sinh bởi quay hình phẳng giới hạn y=x², y=0, x=2 quanh Ox.')
        ]},
        { title: 'Đề minh họa Toán 2024', year: 2024, src: 1, questions: [
            q(1, 'Cho hàm số y = x⁴ - 2x². Tìm các khoảng đồng biến.'),
            q(2, 'Tìm nguyên hàm của f(x) = 1/(x² + 4).'),
            q(3, 'Giải bất phương trình 2^(x+1) > 8.'),
            q(4, 'Trong mặt phẳng Oxy, viết phương trình đường tròn tâm I(1;-2), bán kính R=3.'),
            q(5, 'Cho ma trận A = [[1,2],[3,4]]. Tính định thức det(A).'),
            q(6, 'Cho hình lăng trụ đứng ABC.A′B′C′ có đáy là tam giác đều cạnh a, cạnh bên 2a. Tính thể tích.')
        ]},
        { title: 'Đề Toán Chuyên KHTN 2023', year: 2023, src: 2, questions: [
            q(1, 'Chứng minh rằng với mọi n∈ℕ*, 7ⁿ - 1 chia hết cho 6.'),
            q(2, 'Tìm điều kiện để phương trình x² - 2mx + m + 2 = 0 có hai nghiệm dương phân biệt.'),
            q(3, 'Tính tổng C(10,0) + C(10,1) + ... + C(10,10) bằng khai triển nhị thức Newton.'),
            q(4, 'Biện luận số nghiệm của phương trình |x-1| + |x+2| = m theo m.'),
            q(5, 'Chứng minh bất đẳng thức a²+b²+c² ≥ ab+bc+ca với mọi a,b,c∈ℝ.'),
            q(6, 'Tìm tất cả các số nguyên dương n sao cho n² + n + 1 chia hết cho 7.')
        ]},
        { title: 'Đề Toán HSG Tỉnh 2023', year: 2023, src: 3, questions: [
            q(1, 'Cho hàm số y = f(x) = x³ - 3x² + 2. Tìm m để đường thẳng y = m cắt đồ thị tại 3 điểm phân biệt.'),
            q(2, 'Giải hệ phương trình: x+y=5, xy=6.'),
            q(3, 'Chứng minh dãy số uₙ = (1 + 1/n)ⁿ hội tụ.'),
            q(4, 'Tính tích phân ∫₁ᵉ (ln x)/x dx.'),
            q(5, 'Trong không gian, tính khoảng cách từ M(1;2;3) đến mặt phẳng x+2y-2z+1=0.'),
            q(6, 'Cho tam giác ABC có A(1;2), B(-1;4), C(3;0). Tính diện tích tam giác.')
        ]},
        { title: 'Đề Toán Tuyensinh247 - Đề 05', year: 2023, src: 2, questions: [
            q(1, 'Tìm tiệm cận đứng, tiệm cận ngang của đồ thị hàm số y = (x-1)/(x+2).'),
            q(2, 'Tính đạo hàm bậc hai của y = sin(2x).'),
            q(3, 'Giải phương trình sin(2x) = cos(x).'),
            q(4, 'Trong không gian Oxyz, tìm tọa độ giao điểm của đường thẳng d: (x-1)/2 = y/1 = (z+1)/-1 với mặt phẳng x+y+z=3.'),
            q(5, 'Cho số phức z = 2-3i. Tính |z|² và z̄.'),
            q(6, 'Tính ∫ xe^x dx.')
        ]},
        { title: 'Đề Toán Moon.vn - Nâng cao 01', year: 2024, src: 3, questions: [
            q(1, 'Khảo sát sự đồng biến của hàm số y = x/(x²+1).'),
            q(2, 'Tìm giá trị lớn nhất và nhỏ nhất của y = 2x³ - 3x² - 12x + 1 trên [-2;3].'),
            q(3, 'Giải phương trình 3^(2x) - 4·3^x + 3 = 0.'),
            q(4, 'Xác suất bắn trúng bia của xạ thủ là 0.8. Xạ thủ bắn 3 phát độc lập. Tính xác suất trúng ít nhất 1 phát.'),
            q(5, 'Cho hình chóp đều S.ABC cạnh đáy a, cạnh bên 2a. Tính góc giữa cạnh bên và mặt đáy.'),
            q(6, 'Cho hàm số y = ax³ + bx² + cx + d có đồ thị đi qua (0;1), (1;0) và có cực trị tại x=2. Tìm a,b,c,d.')
        ]},
        { title: 'Đề Toán OLM - THPT QG 2022', year: 2022, src: 4, questions: [
            q(1, 'Cho hàm số y = -x³ + 3x² - 4. Xác định điểm uốn.'),
            q(2, 'Tính giới hạn lim(x→+∞) (√(x²+1) - x).'),
            q(3, 'Tìm tập nghiệm của phương trình lôgarit log₃(x²-2x) = 1.'),
            q(4, 'Cho hình hộp chữ nhật ABCD.A′B′C′D′ với AB=3, AD=4, AA′=5. Tính khoảng cách từ A đến C′.'),
            q(5, 'Trong Oxyz, cho A(1;0;-1), B(-1;2;1). Viết phương trình mặt cầu đường kính AB.'),
            q(6, 'Tìm số nghiệm của phương trình 2sin x + 1 = 0 trên (0;2π).')
        ]},
        { title: 'Đề Toán Luyenthitracnghiem 2023', year: 2023, src: 5, questions: [
            q(1, 'Cho f(x) = x² + ax + b với f(0)=1, f(1)=0. Tính a+b.'),
            q(2, 'Tính ∫₀^(π/2) sin²(x) dx.'),
            q(3, 'Giải bất phương trình log₂(x-1) ≤ 2.'),
            q(4, 'Trong mặt phẳng Oxy, tìm tâm đường tròn ngoại tiếp tam giác với đỉnh (0;0), (4;0), (0;3).'),
            q(5, 'Cho cấp số nhân (uₙ) có u₁=2, công bội q=3. Tính u₅.'),
            q(6, 'Số cách chọn 3 học sinh từ 10 học sinh để xếp hàng là bao nhiêu?')
        ]},
        { title: 'Đề Toán Dethi.com - Đề 10', year: 2024, src: 6, questions: [
            q(1, 'Tìm cực trị của hàm số y = x·e^(-x).'),
            q(2, 'Tính tích phân ∫₀¹ x√(x²+1) dx.'),
            q(3, 'Giải phương trình 4^x - 5·2^x + 4 = 0.'),
            q(4, 'Trong Oxyz, viết phương trình đường thẳng đi qua A(1;2;3) và song song với trục Oz.'),
            q(5, 'Cho số phức z thỏa |z-1+2i|=|z+3|. Tìm tập hợp điểm biểu diễn z.'),
            q(6, 'Tính thể tích khối tròn xoay khi quay y=√x quanh Ox, x∈[0;4].')
        ]},
        { title: 'Đề Toán TopLoigiai - Đề 11', year: 2023, src: 7, questions: [
            q(1, 'Cho y = ln(x² + 1). Tính y′(1).'),
            q(2, 'Tính nguyên hàm ∫ cos²(x) dx.'),
            q(3, 'Giải phương trình 2sin²x + sin x - 1 = 0.'),
            q(4, 'Trong Oxyz, tính tích có hướng [u,v] với u=(1;2;-1), v=(2;1;1).'),
            q(5, 'Cho hình chóp S.ABC có SA⊥(ABC), tam giác ABC vuông tại A, AB=a, AC=2a, SA=3a. Tính thể tích.'),
            q(6, 'Tìm giá trị lớn nhất của biểu thức P = sin x + cos x.')
        ]},
        { title: 'Đề Toán VnDoc - Đề 12', year: 2024, src: 8, questions: [
            q(1, 'Cho hàm số y = f(x) liên tục trên ℝ, f(0)=1, f′(x)=3x²+2x. Tính f(1).'),
            q(2, 'Tính ∫(1+x)/(x²+2x+3) dx.'),
            q(3, 'Giải phương trình e^x + e^(-x) = 2.'),
            q(4, 'Cho hình chóp đều S.ABCD cạnh đáy a, cạnh bên a√3. Tính khoảng cách từ O đến mặt bên.'),
            q(5, 'Trong Oxyz, cho A(1;2;0), B(3;0;2). Tìm điểm M trên trục Oy sao cho MA=MB.'),
            q(6, 'Cho số phức z = 1+i. Tính z¹⁰.')
        ]},
        { title: 'Đề Toán Hoctot Hocmai 2023', year: 2023, src: 9, questions: [
            q(1, 'Tìm điểm cực đại của y = x⁴ - 2x² + 3.'),
            q(2, 'Tính diện tích hình phẳng giới hạn y=x², y=2x.'),
            q(3, 'Giải phương trình log₂ x + log₄ x = 3.'),
            q(4, 'Trong Oxy, viết phương trình tiếp tuyến của (C): y=x²-2x+1 tại điểm có hoành độ x=2.'),
            q(5, 'Tính C(8,3) + C(8,4).'),
            q(6, 'Tìm m để phương trình x² - 2mx + m + 6 = 0 có nghiệm kép.')
        ]},
        { title: 'Đề Toán VietJack - Đề 14', year: 2024, src: 0, questions: [
            q(1, 'Cho hàm số y = (x²-2x)/(x-1). Tìm tiệm cận xiên.'),
            q(2, 'Tính tích phân I = ∫₀¹ e^(2x) dx.'),
            q(3, 'Giải phương trình 9^x - 4·3^x + 3 = 0.'),
            q(4, 'Cho tứ diện đều ABCD cạnh a. Tính góc giữa 2 mặt đối diện.'),
            q(5, 'Trong Oxyz, cho mặt phẳng (P): 2x-y+z=0. Tìm hình chiếu của A(1;1;1) lên (P).'),
            q(6, 'Tính mođun của số phức z = (1+i)/(1-i).')
        ]},
        { title: 'Đề Toán Hoc247 - Đề 15', year: 2023, src: 1, questions: [
            q(1, 'Khảo sát hàm số y = x³ - 3x² + 2.'),
            q(2, 'Tính ∫ x ln x dx.'),
            q(3, 'Giải phương trình log₃(x-1) = log₃(2x+1).'),
            q(4, 'Cho cấp số cộng có u₃=7, u₇=19. Tìm u₁ và công sai d.'),
            q(5, 'Gieo 1 đồng xu 4 lần. Tính xác suất có đúng 2 lần mặt ngửa.'),
            q(6, 'Tính giới hạn lim(n→∞) (1+2+...+n)/n².')
        ]},
        { title: 'Đề Toán Tuyensinh247 - Đề 16', year: 2024, src: 2, questions: [
            q(1, 'Tìm tập xác định của y = √(x²-4) + ln(x-1).'),
            q(2, 'Tính đạo hàm của y = x^x.'),
            q(3, 'Giải bất phương trình (1/2)^(x²-1) > 1/8.'),
            q(4, 'Trong Oxy, tính khoảng cách giữa 2 đường thẳng song song 2x-y+1=0 và 2x-y-4=0.'),
            q(5, 'Cho hình chóp S.ABCD có đáy là hình thoi cạnh a, góc BAD=60°, SA⊥đáy, SA=a. Tính V.'),
            q(6, 'Tìm phần ảo của z = (2+i)².')
        ]},
        { title: 'Đề Toán Moon.vn - Đề 17', year: 2023, src: 3, questions: [
            q(1, 'Cho y = x² - 4x + 3. Tìm phương trình tiếp tuyến tại điểm có hoành độ x=1.'),
            q(2, 'Tính ∫₀^(π/4) tan²(x) dx.'),
            q(3, 'Giải phương trình 2^x + 2^(1-x) = 3.'),
            q(4, 'Cho hình chóp S.ABC có SA=SB=SC=a, AB=BC=CA=a. Tính thể tích.'),
            q(5, 'Trong Oxyz, viết phương trình mặt cầu (S) tâm I(1;-1;2), tiếp xúc mặt phẳng x+2y-2z+3=0.'),
            q(6, 'Tính mođun số phức z = 3+4i.')
        ]},
        { title: 'Đề Toán OLM - Đề 18', year: 2024, src: 4, questions: [
            q(1, 'Tìm cực trị của y = x³/3 - x² - 3x + 1.'),
            q(2, 'Tính nguyên hàm ∫ sin(3x)cos(2x) dx.'),
            q(3, 'Giải phương trình lôgarit log(x-2) + log(x+3) = log(2x+1).'),
            q(4, 'Trong Oxy, viết phương trình elip có 2 tiêu điểm F₁(-4;0), F₂(4;0) và trục lớn 10.'),
            q(5, 'Cho hình chóp S.ABC đều có tất cả các cạnh bằng a. Tính góc tạo bởi cạnh bên và đáy.'),
            q(6, 'Tính tổng S = 1 + 2 + 4 + 8 + ... + 2¹⁰.')
        ]},
        { title: 'Đề Toán Dethi.com - Đề 19', year: 2023, src: 6, questions: [
            q(1, 'Cho y = f(x) có f′(x) = (x-1)²(x+2). Xác định số điểm cực trị.'),
            q(2, 'Tính tích phân ∫₀^(π/2) sin³(x) dx.'),
            q(3, 'Giải hệ phương trình lôgarit: log x + log y = 1, x+y = 11.'),
            q(4, 'Cho hình lập phương cạnh a. Tính khoảng cách từ tâm mặt đáy đến 1 mặt bên.'),
            q(5, 'Trong Oxyz, cho điểm M(1;2;-1) và đường thẳng d: x=t, y=1-t, z=2+t. Tìm khoảng cách từ M đến d.'),
            q(6, 'Tìm số phức z thỏa z+2z̄ = 3-i.')
        ]},
        { title: 'Đề Toán Chuyên SP 2024', year: 2024, src: 1, questions: [
            q(1, 'Chứng minh rằng hàm số y = x³ + x + 1 đồng biến trên ℝ.'),
            q(2, 'Tính tích phân ∫₁² (x² + 1/x) dx.'),
            q(3, 'Biện luận số nghiệm phương trình x⁴ - 4x² + m = 0 theo m.'),
            q(4, 'Tìm điều kiện để 3 vectơ u=(1;1;0), v=(0;1;1), w=(m;0;1) đồng phẳng.'),
            q(5, 'Chứng minh bất đẳng thức sin x + cos x ≤ √2 với mọi x.'),
            q(6, 'Cho hàm số y=f(x) thỏa f(x+1) = 2f(x) + 1, f(0)=0. Tìm f(5).')
        ]}
    ];

    // ========== CHEMISTRY EXAMS (20) ==========
    const CHEM_EXAMS = [
        { title: 'Đề Hóa THPT QG 2023 - Đề 01', year: 2023, src: 0, questions: [
            q(1, 'Cho 5.6g Fe tác dụng với dung dịch HCl dư. Tính thể tích khí H2 thoát ra (đktc).'),
            q(2, 'Viết phương trình phản ứng thủy phân este CH3COOC2H5 trong môi trường axit.'),
            q(3, 'Xác định số electron hóa trị của nguyên tử O (Z=8).'),
            q(4, 'Cho 200 ml dung dịch NaOH 1M tác dụng với 200 ml HCl 0.5M. Tính pH dung dịch sau phản ứng.'),
            q(5, 'Nêu tính chất hóa học đặc trưng của ancol etylic.'),
            q(6, 'Cho glucozơ tác dụng với AgNO3/NH3 (phản ứng tráng bạc). Viết phương trình.')
        ]},
        { title: 'Đề Hóa THPT QG 2023 - Đề 02', year: 2023, src: 0, questions: [
            q(1, 'Cho 10.8g Al tác dụng với H2SO4 loãng dư. Tính khối lượng muối thu được.'),
            q(2, 'Phân biệt dung dịch NaOH, HCl, NaCl bằng phương pháp hóa học.'),
            q(3, 'Cho các hợp chất: etanol, phenol, axit axetic. Sắp xếp theo thứ tự tăng dần tính axit.'),
            q(4, 'Viết công thức cấu tạo các đồng phân của C4H10.'),
            q(5, 'Tính khối lượng kết tủa khi cho 100ml dung dịch AgNO3 0.1M tác dụng với NaCl dư.'),
            q(6, 'Trình bày cơ chế phản ứng cộng HBr vào but-2-en.')
        ]},
        { title: 'Đề minh họa Hóa 2024', year: 2024, src: 1, questions: [
            q(1, 'Cho 6.4g Cu tác dụng với HNO3 đặc, nóng, dư. Tính thể tích NO2 thoát ra (đktc).'),
            q(2, 'Xác định số oxi hóa của Mn trong KMnO4.'),
            q(3, 'Viết phương trình điện phân dung dịch NaCl có màng ngăn.'),
            q(4, 'Cho amino axit glyxin tác dụng với HCl. Viết phương trình và gọi tên sản phẩm.'),
            q(5, 'Nêu sự khác biệt về cấu trúc giữa tinh bột và xenlulozơ.'),
            q(6, 'Giải thích hiện tượng ăn mòn điện hóa của sắt trong không khí ẩm.')
        ]},
        { title: 'Đề Hóa Chuyên KHTN 2023', year: 2023, src: 2, questions: [
            q(1, 'Cho hỗn hợp Fe và Cu tác dụng với HNO3 loãng. Viết các phương trình có thể xảy ra.'),
            q(2, 'Tính pH của dung dịch CH3COOH 0.1M biết Ka = 1.8×10⁻⁵.'),
            q(3, 'Phân biệt 4 dung dịch: glucozơ, saccarozơ, etanol, axit fomic.'),
            q(4, 'Viết cơ chế phản ứng este hóa giữa CH3COOH và C2H5OH.'),
            q(5, 'Tính hằng số cân bằng Kc của phản ứng N2 + 3H2 ⇌ 2NH3 khi biết nồng độ cân bằng.'),
            q(6, 'Cho 8.4g MgCO3 tác dụng với HCl dư. Tính thể tích CO2 thoát ra (đktc).')
        ]},
        { title: 'Đề Hóa HSG Tỉnh 2023', year: 2023, src: 3, questions: [
            q(1, 'Xác định công thức phân tử của este A biết thủy phân A bằng NaOH thu được muối và ancol.'),
            q(2, 'Giải thích tính axit của phenol mạnh hơn ancol.'),
            q(3, 'Cho hỗn hợp Zn và Mg tác dụng với dung dịch H2SO4. Xác định thứ tự phản ứng.'),
            q(4, 'Tính nhiệt tỏa ra khi đốt cháy 2 mol CH4 biết ΔH = -890 kJ/mol.'),
            q(5, 'Viết phương trình phản ứng giữa protein và CuSO4 trong NaOH (phản ứng biure).'),
            q(6, 'Phân tích cấu trúc và tính chất của benzen.')
        ]},
        { title: 'Đề Hóa Tuyensinh247 - Đề 05', year: 2023, src: 2, questions: [
            q(1, 'Cho 5.6g Fe tác dụng với 200ml dung dịch CuSO4 1M. Tính khối lượng Cu sinh ra.'),
            q(2, 'Viết phương trình phản ứng của etilen với dung dịch KMnO4.'),
            q(3, 'Xác định loại liên kết trong phân tử NH3.'),
            q(4, 'Cho các kim loại: Na, Mg, Al, Fe, Cu. Sắp xếp theo thứ tự tính khử giảm dần.'),
            q(5, 'Tính khối lượng glucozơ cần lên men để thu được 2.24 lít CO2 (đktc).'),
            q(6, 'Nêu cách nhận biết khí CO2 và SO2.')
        ]},
        { title: 'Đề Hóa Moon.vn - Nâng cao 01', year: 2024, src: 3, questions: [
            q(1, 'Cho 100ml dung dịch chứa NaOH 0.1M và KOH 0.1M tác dụng với 50ml HCl 0.4M. Tính pH.'),
            q(2, 'Viết phương trình phản ứng của axit fomic với AgNO3/NH3.'),
            q(3, 'Phân biệt các dung dịch Na2CO3, NaHCO3, Na2SO4 bằng 1 thuốc thử.'),
            q(4, 'Tính khối lượng Al2O3 thu được khi điện phân 10.2g Al(OH)3.'),
            q(5, 'Xác định công thức este X biết M(X)=88 và chứa 54.55% C, 9.09% H.'),
            q(6, 'Giải thích tại sao các amin mạch hở có tính bazơ mạnh hơn NH3.')
        ]},
        { title: 'Đề Hóa OLM - THPT QG 2022', year: 2022, src: 4, questions: [
            q(1, 'Đốt cháy hoàn toàn 0.1 mol ancol no X thu được 4.4g CO2 và 2.7g H2O. Xác định công thức phân tử của X.'),
            q(2, 'Tính khối lượng kim loại M (hóa trị II) phản ứng với 200ml HCl 2M cho 4.48 lít H2.'),
            q(3, 'Viết phương trình phản ứng thủy phân triglycerid trong NaOH.'),
            q(4, 'Cho dung dịch Fe(NO3)3 tác dụng với Cu. Xác định chiều phản ứng.'),
            q(5, 'Nêu ứng dụng của polime PE, PVC, PS trong đời sống.'),
            q(6, 'Tính nồng độ mol của ion H+ trong dung dịch có pH = 3.')
        ]},
        { title: 'Đề Hóa Luyenthitracnghiem 2023', year: 2023, src: 5, questions: [
            q(1, 'Cho 11.2g Fe vào 400ml dung dịch AgNO3 1M. Tính khối lượng Ag sinh ra.'),
            q(2, 'Viết phương trình phản ứng trùng hợp vinyl clorua (CH2=CHCl).'),
            q(3, 'Xác định số đồng phân este của C4H8O2.'),
            q(4, 'Cho glucozơ tác dụng với H2 (Ni, t°). Sản phẩm là gì?'),
            q(5, 'Nêu phương pháp điều chế etilen trong phòng thí nghiệm.'),
            q(6, 'Giải thích hiện tượng khi cho Cu vào dung dịch FeCl3.')
        ]},
        { title: 'Đề Hóa Dethi.com - Đề 10', year: 2024, src: 6, questions: [
            q(1, 'Cho 2.7g Al tác dụng hết với O2. Tính khối lượng Al2O3 thu được.'),
            q(2, 'Viết cấu tạo của peptit Gly-Ala-Val.'),
            q(3, 'Xác định bậc của amin (CH3)2NH.'),
            q(4, 'Cho các chất: C2H5OH, CH3COOH, C6H5OH, H2O. Chất nào có nhiệt độ sôi cao nhất? Giải thích.'),
            q(5, 'Tính thể tích dung dịch H2SO4 98% (d=1.84) cần để pha 500ml dung dịch 1M.'),
            q(6, 'Nêu hiện tượng và viết phương trình khi nhỏ từ từ NaOH vào dung dịch AlCl3.')
        ]},
        { title: 'Đề Hóa TopLoigiai - Đề 11', year: 2023, src: 7, questions: [
            q(1, 'Cho hỗn hợp 0.1 mol Mg và 0.1 mol Fe vào dung dịch CuSO4 dư. Tính khối lượng Cu sinh ra.'),
            q(2, 'Phân loại các phản ứng: 2Na + 2H2O → 2NaOH + H2, H2 + Cl2 → 2HCl.'),
            q(3, 'Viết công thức các đồng phân axit có công thức C4H8O2.'),
            q(4, 'Cho saccarozơ bị thủy phân. Sản phẩm là gì? Viết phương trình.'),
            q(5, 'Tính % khối lượng N trong phân đạm ure (NH2)2CO.'),
            q(6, 'Nêu tính chất hóa học đặc trưng của kim loại kiềm.')
        ]},
        { title: 'Đề Hóa VnDoc - Đề 12', year: 2024, src: 8, questions: [
            q(1, 'Cho 3.6g Mg tác dụng với H2SO4 đặc nóng dư, thu được V lít SO2 (đktc). Tính V.'),
            q(2, 'Viết phương trình phản ứng điều chế xà phòng từ chất béo.'),
            q(3, 'Xác định công thức phân tử X biết đốt cháy X chứa C, H, O cho tỉ lệ mol CO2:H2O = 1:1.'),
            q(4, 'Cho các chất: glucozơ, fructozơ, saccarozơ. Chất nào có phản ứng tráng bạc?'),
            q(5, 'Tính pH của dung dịch Ba(OH)2 0.005M.'),
            q(6, 'Nêu cách bảo quản kim loại kiềm trong phòng thí nghiệm.')
        ]},
        { title: 'Đề Hóa Hoctot Hocmai 2023', year: 2023, src: 9, questions: [
            q(1, 'Cho 14g KOH vào 200ml HCl 0.5M. Tính nồng độ muối thu được.'),
            q(2, 'Viết phương trình phản ứng của but-1-in với dung dịch AgNO3/NH3.'),
            q(3, 'Phân biệt etyl axetat và axit axetic bằng quỳ tím.'),
            q(4, 'Cho Fe dư vào dung dịch HNO3 loãng. Xác định sản phẩm.'),
            q(5, 'Tính khối lượng tinh bột cần thủy phân để thu được 90g glucozơ (hiệu suất 80%).'),
            q(6, 'Giải thích tính chất lưỡng tính của Al(OH)3.')
        ]},
        { title: 'Đề Hóa VietJack - Đề 14', year: 2024, src: 0, questions: [
            q(1, 'Cho 0.2 mol este X đơn chức tác dụng vừa đủ với 200ml NaOH 1M. Xác định loại este.'),
            q(2, 'Viết công thức cấu tạo của amino axit alanin.'),
            q(3, 'Xác định số liên kết σ và π trong phân tử C2H4.'),
            q(4, 'Cho 6.2g Na tác dụng hoàn toàn với nước. Tính thể tích H2 thoát ra (đktc).'),
            q(5, 'Tính nhiệt tạo thành của NH3 biết ΔH phản ứng N2+3H2→2NH3 là -92kJ.'),
            q(6, 'Nêu cách pha dung dịch HCl 0.1M từ dung dịch HCl 36% (d=1.19).')
        ]},
        { title: 'Đề Hóa Hoc247 - Đề 15', year: 2023, src: 1, questions: [
            q(1, 'Cho 100ml dung dịch Na2CO3 1M tác dụng với 200ml CaCl2 0.5M. Tính khối lượng kết tủa.'),
            q(2, 'Viết phương trình phản ứng của metylamin với HCl.'),
            q(3, 'Xác định tính chất oxi hóa-khử của H2O2.'),
            q(4, 'Cho các kim loại Ag, Fe, Zn. Kim loại nào tan trong H2SO4 loãng?'),
            q(5, 'Tính khối lượng C2H5OH thu được khi lên men 180g glucozơ (hiệu suất 90%).'),
            q(6, 'Nêu 3 cách phân biệt CO và CO2.')
        ]},
        { title: 'Đề Hóa Tuyensinh247 - Đề 16', year: 2024, src: 2, questions: [
            q(1, 'Cho 8g CuSO4 tác dụng với NaOH dư. Tính khối lượng kết tủa.'),
            q(2, 'Viết phương trình phản ứng của benzen với Br2 khan (xúc tác FeBr3).'),
            q(3, 'Xác định cấu hình electron của ion Fe²⁺ (Z=26).'),
            q(4, 'Cho hỗn hợp Al và Al2O3 tác dụng với NaOH dư. Viết phương trình.'),
            q(5, 'Tính % C trong este etyl axetat.'),
            q(6, 'Nêu ứng dụng của axit sunfuric trong công nghiệp.')
        ]},
        { title: 'Đề Hóa Moon.vn - Đề 17', year: 2023, src: 3, questions: [
            q(1, 'Đốt cháy hoàn toàn 0.1 mol anđehit X thu được 6.6g CO2 và 2.7g H2O. Xác định X.'),
            q(2, 'Viết phương trình phản ứng clo hóa metan theo cơ chế gốc.'),
            q(3, 'Xác định loại liên kết ion trong NaCl.'),
            q(4, 'Cho Zn tác dụng với dung dịch HNO3 rất loãng, sản phẩm khử là NH4NO3. Viết phương trình.'),
            q(5, 'Tính nồng độ ion H+ trong dung dịch pH = 2.'),
            q(6, 'Nêu cách điều chế O2 trong phòng thí nghiệm.')
        ]},
        { title: 'Đề Hóa OLM - Đề 18', year: 2024, src: 4, questions: [
            q(1, 'Cho 200ml dung dịch AgNO3 0.5M tác dụng với 100ml NaBr 1M. Tính khối lượng kết tủa.'),
            q(2, 'Viết phương trình phản ứng trùng ngưng giữa axit adipic và hexametylen điamin.'),
            q(3, 'Xác định cấu trúc không gian của phân tử CH4.'),
            q(4, 'Cho dung dịch FeCl3 tác dụng với KI. Xác định sản phẩm.'),
            q(5, 'Tính thể tích khí H2 (đktc) cần để khử hoàn toàn 16g CuO.'),
            q(6, 'Giải thích tại sao nước biển có vị mặn.')
        ]},
        { title: 'Đề Hóa Dethi.com - Đề 19', year: 2023, src: 6, questions: [
            q(1, 'Cho hỗn hợp 0.1 mol Fe và 0.05 mol Cu tác dụng với HNO3 loãng dư. Tính số mol NO sinh ra.'),
            q(2, 'Viết công thức các đipeptit có thể tạo thành từ Gly và Ala.'),
            q(3, 'Xác định độ điện li α của CH3COOH 0.1M biết [H+] = 1.34×10⁻³.'),
            q(4, 'Cho các hiđroxit: Mg(OH)2, Fe(OH)2, Cu(OH)2, Al(OH)3. Chất nào lưỡng tính?'),
            q(5, 'Tính khối lượng glixerol tạo thành khi thủy phân 1 kg chất béo (tristearin).'),
            q(6, 'Nêu nguyên tắc điều chế kim loại kiềm.')
        ]},
        { title: 'Đề Hóa Chuyên SP 2024', year: 2024, src: 1, questions: [
            q(1, 'Chứng minh tính axit của các halogen H-F, H-Cl, H-Br, H-I tăng dần.'),
            q(2, 'Tính năng lượng ion hóa thứ nhất của Na biết cấu hình electron [Ne]3s¹.'),
            q(3, 'Biện luận sản phẩm khi cho Cl2 tác dụng với NaOH ở nhiệt độ thường và đun nóng.'),
            q(4, 'Phân tích cơ chế phản ứng SN1 và SN2 của ankyl halogenua.'),
            q(5, 'Chứng minh tính bazơ của amin thơm yếu hơn amin no mạch hở.'),
            q(6, 'Tìm công thức cấu tạo của ancol X biết X tác dụng với CuO cho xeton.')
        ]}
    ];

    // ========== BIOLOGY EXAMS (20) ==========
    const BIO_EXAMS = [
        { title: 'Đề Sinh THPT QG 2023 - Đề 01', year: 2023, src: 0, questions: [
            q(1, 'Mô tả cấu trúc của phân tử ADN theo mô hình Watson-Crick.'),
            q(2, 'Nêu vai trò của ARN trong quá trình dịch mã.'),
            q(3, 'Phân biệt nguyên phân và giảm phân về cơ chế và ý nghĩa.'),
            q(4, 'Quần thể có cấu trúc di truyền: 0.4 AA : 0.4 Aa : 0.2 aa. Tính tần số alen A.'),
            q(5, 'Nêu điều kiện nghiệm đúng định luật Hardy-Weinberg.'),
            q(6, 'Giải thích cơ chế di truyền liên kết với giới tính ở ruồi giấm.')
        ]},
        { title: 'Đề Sinh THPT QG 2023 - Đề 02', year: 2023, src: 0, questions: [
            q(1, 'Ở đậu Hà Lan, hạt vàng trội hoàn toàn so với hạt xanh. Cho F1 tự thụ phấn. Tính tỉ lệ kiểu hình F2.'),
            q(2, 'Nêu các giai đoạn của chu kì tế bào.'),
            q(3, 'Xác định số liên kết hiđro của gen có 600 nuclêôtit loại A và 900 nuclêôtit loại G.'),
            q(4, 'Phân biệt đột biến gen và đột biến NST.'),
            q(5, 'Trình bày vai trò của enzyme trong tế bào.'),
            q(6, 'Giải thích hiện tượng quang hợp ở thực vật C3 và C4.')
        ]},
        { title: 'Đề minh họa Sinh 2024', year: 2024, src: 1, questions: [
            q(1, 'Nêu cấu tạo và chức năng của riboxom.'),
            q(2, 'Phân biệt hô hấp hiếu khí và kị khí ở vi sinh vật.'),
            q(3, 'Ở người, bệnh máu khó đông do gen lặn nằm trên NST X. Bố bình thường, mẹ mang gen bệnh. Tính xác suất sinh con trai mắc bệnh.'),
            q(4, 'Mô tả cấu trúc không gian của protein bậc 1, 2, 3, 4.'),
            q(5, 'Giải thích sự đóng xoắn và mở xoắn của NST trong chu kì tế bào.'),
            q(6, 'Nêu các nhân tố tiến hóa theo thuyết tiến hóa tổng hợp hiện đại.')
        ]},
        { title: 'Đề Sinh Chuyên KHTN 2023', year: 2023, src: 2, questions: [
            q(1, 'Phân tích cơ chế phiên mã và dịch mã ở sinh vật nhân thực.'),
            q(2, 'Giải thích cơ sở tế bào học của quy luật phân li độc lập.'),
            q(3, 'Cho phép lai AaBb × AaBb. Tính xác suất xuất hiện kiểu gen AaBb ở F1.'),
            q(4, 'Trình bày cấu trúc và chức năng của các bào quan trong tế bào động vật.'),
            q(5, 'Phân biệt di truyền liên kết hoàn toàn và không hoàn toàn.'),
            q(6, 'Giải thích cơ chế hình thành loài mới bằng cách li địa lí.')
        ]},
        { title: 'Đề Sinh HSG Tỉnh 2023', year: 2023, src: 3, questions: [
            q(1, 'Cho biết ý nghĩa của đột biến đối với tiến hóa và chọn giống.'),
            q(2, 'Chứng minh ADN là vật chất di truyền qua thí nghiệm của Griffith và Avery.'),
            q(3, 'Phân tích mối quan hệ giữa quần thể sinh vật và môi trường.'),
            q(4, 'Tính số loại giao tử có thể tạo ra từ tế bào có kiểu gen AaBbDd.'),
            q(5, 'Nêu vai trò của các enzyme ADN polimeraza trong nhân đôi ADN.'),
            q(6, 'So sánh quan điểm tiến hóa của Lamac và Đacuyn.')
        ]},
        { title: 'Đề Sinh Tuyensinh247 - Đề 05', year: 2023, src: 2, questions: [
            q(1, 'Mô tả quá trình nhân đôi ADN theo nguyên tắc bổ sung và bán bảo toàn.'),
            q(2, 'Nêu các loại ARN và chức năng của chúng.'),
            q(3, 'Ở 1 loài thực vật, gen A quy định hoa đỏ trội hoàn toàn so với a quy định hoa trắng. Xác định tỉ lệ kiểu hình của phép lai Aa × Aa.'),
            q(4, 'Phân biệt quần thể tự phối và quần thể giao phối ngẫu nhiên.'),
            q(5, 'Nêu các giai đoạn của quang hợp.'),
            q(6, 'Giải thích cơ chế điều hòa hoạt động của gen ở vi khuẩn E.coli (operon Lac).')
        ]},
        { title: 'Đề Sinh Moon.vn - Nâng cao 01', year: 2024, src: 3, questions: [
            q(1, 'Phân tích cơ chế xác định giới tính ở người.'),
            q(2, 'Cho gen A có 3000 nuclêôtit, trong đó A=600. Tính số nuclêôtit mỗi loại.'),
            q(3, 'Biện luận kết quả của phép lai phân tích ở đậu Hà Lan.'),
            q(4, 'Giải thích hiện tượng trội không hoàn toàn.'),
            q(5, 'Trình bày mối quan hệ dinh dưỡng trong hệ sinh thái.'),
            q(6, 'Phân tích ý nghĩa của quá trình giảm phân.')
        ]},
        { title: 'Đề Sinh OLM - THPT QG 2022', year: 2022, src: 4, questions: [
            q(1, 'Nêu các loại đột biến cấu trúc NST và hậu quả của chúng.'),
            q(2, 'Phân biệt chọn lọc tự nhiên và chọn lọc nhân tạo.'),
            q(3, 'Ở ruồi giấm, tính trạng mắt đỏ trội so với mắt trắng, gen nằm trên NST X. Xác định kiểu hình đời con của phép lai X^A X^a × X^A Y.'),
            q(4, 'Mô tả chu trình nước trong tự nhiên.'),
            q(5, 'Nêu các cấp tổ chức của thế giới sống.'),
            q(6, 'Giải thích tại sao ADN vừa đa dạng vừa đặc trưng cho loài.')
        ]},
        { title: 'Đề Sinh Luyenthitracnghiem 2023', year: 2023, src: 5, questions: [
            q(1, 'Mô tả cấu trúc của NST ở sinh vật nhân thực.'),
            q(2, 'Tính số cặp nuclêôtit của gen dài 5100Å (1 cặp = 3.4Å).'),
            q(3, 'Phân biệt đồng hợp và dị hợp.'),
            q(4, 'Nêu vai trò của thực vật trong hệ sinh thái.'),
            q(5, 'Trình bày các dạng đột biến gen và ví dụ.'),
            q(6, 'Giải thích tại sao quần thể tự phối có xu hướng giảm tỉ lệ dị hợp.')
        ]},
        { title: 'Đề Sinh Dethi.com - Đề 10', year: 2024, src: 6, questions: [
            q(1, 'Nêu ý nghĩa sinh học của nguyên phân.'),
            q(2, 'Cho phép lai AaBbDd × AaBbDd. Xác định tỉ lệ kiểu hình trội về cả 3 tính trạng.'),
            q(3, 'Phân biệt thường biến và đột biến.'),
            q(4, 'Mô tả quá trình hô hấp tế bào ở giai đoạn đường phân.'),
            q(5, 'Nêu vai trò của hệ thần kinh trong cảm ứng ở động vật.'),
            q(6, 'Giải thích hiện tượng di truyền ngoài nhân.')
        ]},
        { title: 'Đề Sinh TopLoigiai - Đề 11', year: 2023, src: 7, questions: [
            q(1, 'Phân tích mối quan hệ giữa gen và tính trạng.'),
            q(2, 'Nêu các loại đột biến số lượng NST và nguyên nhân.'),
            q(3, 'Ở người, nhóm máu được quy định bởi 3 alen IA, IB, i. Xác định kiểu gen có thể có của nhóm máu A.'),
            q(4, 'Mô tả cấu trúc của màng sinh chất theo mô hình khảm lỏng.'),
            q(5, 'Phân biệt quang hợp và hóa tổng hợp.'),
            q(6, 'Giải thích cơ chế hình thành loài bằng đa bội hóa.')
        ]},
        { title: 'Đề Sinh VnDoc - Đề 12', year: 2024, src: 8, questions: [
            q(1, 'Cho gen có 150 chu kì xoắn. Tính chiều dài của gen (1 chu kì = 34Å).'),
            q(2, 'Nêu các loại môi trường sống của sinh vật.'),
            q(3, 'Phân biệt tháp sinh thái: số lượng, sinh khối, năng lượng.'),
            q(4, 'Trình bày quá trình tổng hợp protein.'),
            q(5, 'Giải thích tại sao người có hội chứng Đao (Down) mắc bệnh.'),
            q(6, 'Nêu sự khác nhau giữa hô hấp sáng ở thực vật C3 và C4.')
        ]},
        { title: 'Đề Sinh Hoctot Hocmai 2023', year: 2023, src: 9, questions: [
            q(1, 'Nêu các đặc trưng cơ bản của quần thể.'),
            q(2, 'Cho phép lai P: AaBb × aabb. Xác định tỉ lệ kiểu gen F1.'),
            q(3, 'Phân biệt tiến hóa nhỏ và tiến hóa lớn.'),
            q(4, 'Mô tả quá trình nhân đôi ADN.'),
            q(5, 'Nêu ý nghĩa của đa dạng sinh học.'),
            q(6, 'Giải thích vì sao con lai F1 thường đồng tính.')
        ]},
        { title: 'Đề Sinh VietJack - Đề 14', year: 2024, src: 0, questions: [
            q(1, 'Nêu cấu tạo và chức năng của ti thể.'),
            q(2, 'Phân biệt mô phân sinh và mô chuyên hóa ở thực vật.'),
            q(3, 'Tính số axit amin của chuỗi polipeptit được tổng hợp từ mARN có 900 nuclêôtit.'),
            q(4, 'Trình bày vai trò của auxin đối với thực vật.'),
            q(5, 'Giải thích sự phát sinh sự sống trên Trái đất theo giả thuyết Oparin.'),
            q(6, 'Nêu các bằng chứng tiến hóa.')
        ]},
        { title: 'Đề Sinh Hoc247 - Đề 15', year: 2023, src: 1, questions: [
            q(1, 'Cho biết ý nghĩa của thụ tinh trong sinh sản hữu tính.'),
            q(2, 'Phân biệt sinh sản vô tính và hữu tính.'),
            q(3, 'Ở đậu Hà Lan, hoa tím trội so với hoa trắng. P: hoa tím × hoa trắng → F1: 100% hoa tím. Xác định kiểu gen của P.'),
            q(4, 'Mô tả chu trình cacbon trong tự nhiên.'),
            q(5, 'Nêu vai trò của hoocmon trong sinh trưởng và phát triển ở người.'),
            q(6, 'Giải thích cơ chế điều hòa đường huyết.')
        ]},
        { title: 'Đề Sinh Tuyensinh247 - Đề 16', year: 2024, src: 2, questions: [
            q(1, 'Nêu cấu trúc của gen cấu trúc ở sinh vật nhân thực.'),
            q(2, 'Phân tích ảnh hưởng của ánh sáng lên đời sống thực vật.'),
            q(3, 'Cho biết tần số alen A = 0.6 trong quần thể. Tính cấu trúc di truyền khi cân bằng Hardy-Weinberg.'),
            q(4, 'Mô tả cơ chế lan truyền xung thần kinh.'),
            q(5, 'Nêu các pha của quang hợp.'),
            q(6, 'Giải thích vì sao thể đa bội phổ biến ở thực vật hơn ở động vật.')
        ]},
        { title: 'Đề Sinh Moon.vn - Đề 17', year: 2023, src: 3, questions: [
            q(1, 'Phân tích cơ chế điều hòa phiên mã ở operon Lac.'),
            q(2, 'Nêu đặc điểm của mã di truyền.'),
            q(3, 'Cho phép lai AaBb × aaBb. Tính tỉ lệ kiểu hình ở F1 (A, B trội hoàn toàn).'),
            q(4, 'Mô tả các giai đoạn của giảm phân.'),
            q(5, 'Giải thích mối quan hệ giữa các loài trong quần xã.'),
            q(6, 'Trình bày cấu tạo và chức năng của hệ tuần hoàn ở người.')
        ]},
        { title: 'Đề Sinh OLM - Đề 18', year: 2024, src: 4, questions: [
            q(1, 'Nêu vai trò của các nguyên tố vi lượng đối với cơ thể thực vật.'),
            q(2, 'Phân biệt đột biến gen điểm và đột biến dịch khung.'),
            q(3, 'Tính xác suất sinh 2 con đều là con gái.'),
            q(4, 'Mô tả quá trình quang hợp ở pha sáng.'),
            q(5, 'Nêu các nhân tố ảnh hưởng đến năng suất quang hợp.'),
            q(6, 'Giải thích hiện tượng ưu thế lai.')
        ]},
        { title: 'Đề Sinh Dethi.com - Đề 19', year: 2023, src: 6, questions: [
            q(1, 'Nêu các phương thức hình thành loài mới.'),
            q(2, 'Phân tích cơ chế di truyền của bệnh mù màu ở người.'),
            q(3, 'Cho gen dài 4080Å có tỉ lệ A/G = 2/3. Tính số nuclêôtit mỗi loại.'),
            q(4, 'Mô tả cấu trúc và chức năng của lục lạp.'),
            q(5, 'Giải thích sự đa dạng của sinh vật nhờ sinh sản hữu tính.'),
            q(6, 'Nêu vai trò của quá trình trao đổi chất ở sinh vật.')
        ]},
        { title: 'Đề Sinh Chuyên SP 2024', year: 2024, src: 1, questions: [
            q(1, 'Chứng minh mARN là bản sao trung gian giữa ADN và protein.'),
            q(2, 'Biện luận kết quả lai 2 cặp tính trạng ở đậu Hà Lan theo Mendel.'),
            q(3, 'Phân tích ý nghĩa của đột biến đa bội trong chọn giống cây trồng.'),
            q(4, 'Chứng minh chọn lọc tự nhiên là nhân tố tiến hóa cơ bản.'),
            q(5, 'Phân tích cấu trúc hóa học và vai trò của ATP trong tế bào.'),
            q(6, 'Giải thích cơ chế bảo vệ cơ thể chống lại tác nhân gây bệnh.')
        ]}
    ];

    // ========== BUILDER: convert seed → exam + question records ==========
    function buildSeedRecords() {
        const examRecords = [];
        const questionRecords = [];
        const now = Date.now();
        // Distribute timestamps so newest shows at top
        let tsOffset = 0;

        const subjects = [
            { key: 'math',      list: MATH_EXAMS },
            { key: 'chemistry', list: CHEM_EXAMS },
            { key: 'biology',   list: BIO_EXAMS }
        ];

        for (const { key, list } of subjects) {
            list.forEach((ex, idx) => {
                const src = SOURCES[ex.src] || SOURCES[0];
                const filename = `${ex.title} [${src}].txt`;
                const rawText = ex.questions.join('\n\n');
                const uploadedAt = now - (tsOffset++ * 60_000); // 1 min apart

                const examId = `seed_${key}_${idx + 1}`;
                examRecords.push({
                    id: examId,
                    filename,
                    size: rawText.length,
                    type: 'text/plain',
                    uploadedBy: 'system',
                    uploadedAt,
                    questionCount: ex.questions.length,
                    classifiedCount: ex.questions.length,
                    ocrConfidence: null,
                    rawTextPreview: rawText.slice(0, 500),
                    source: src,
                    year: ex.year,
                    subject: key,
                    isSeeded: true
                });

                ex.questions.forEach((text, qi) => {
                    const diff = (window.ClassifierModule?.classifyDifficulty)
                        ? window.ClassifierModule.classifyDifficulty(text)
                        : 'medium';
                    questionRecords.push({
                        id: `${examId}_q${qi + 1}`,
                        examId,
                        order: qi + 1,
                        text,
                        subject: key,
                        subjectConfidence: 100,
                        difficulty: diff,
                        uploadedBy: 'system',
                        uploadedAt,
                        sourceFile: filename,
                        isSeeded: true
                    });
                });
            });
        }

        return { examRecords, questionRecords };
    }

    // ========== SEED ==========
    function seedIfNeeded() {
        if (!window.StorageModule) {
            console.warn('[seed-exams] StorageModule not loaded yet.');
            return;
        }
        const currentVer = parseInt(localStorage.getItem(SEED_FLAG_KEY) || '0', 10);
        if (currentVer >= SEED_VERSION) return; // already seeded

        const repo = new window.StorageModule.SharedStore('b00_exam_repo');
        const bank = new window.StorageModule.SharedStore('b00_question_bank');

        const { examRecords, questionRecords } = buildSeedRecords();

        // Merge with existing (don't duplicate seeded entries)
        const existingRepo = repo.get([]).filter(e => !e.isSeeded);
        const existingBank = bank.get([]).filter(q => !q.isSeeded);

        repo.set([...existingRepo, ...examRecords]);
        bank.set([...existingBank, ...questionRecords]);

        localStorage.setItem(SEED_FLAG_KEY, String(SEED_VERSION));
        console.info(`[seed-exams] Seeded ${examRecords.length} exams, ${questionRecords.length} questions.`);
    }

    // Run after DOM ready + StorageModule available
    function start() {
        // slight delay so other modules initialize first
        setTimeout(seedIfNeeded, 50);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // Expose for debug / manual reseed
    window.SeedExamsModule = {
        seedIfNeeded,
        resetAndReseed() {
            localStorage.removeItem(SEED_FLAG_KEY);
            seedIfNeeded();
        },
        SEED_VERSION
    };
})();
