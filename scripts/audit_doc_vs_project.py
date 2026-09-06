import os
import re
import sys

def audit():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('docs/design/EnglishCenterTOP.md', 'r', encoding='utf-8') as f:
        doc_text = f.read()

    print("================================================================")
    print("        AUDIT REPORT: EnglishCenterTOP.md vs LMS-AI PROJECT")
    print("================================================================")

    # 1. Database Schema Models vs Prisma
    print("\n--- 1. CƠ SỞ DỮ LIỆU (14 BẢNG CHUẨN 3NF) ---")
    expected_tables = [
        ('NguoiDung', 'nguoi_dung'),
        ('HoSoHocVien', 'ho_so_hoc_vien'),
        ('HoSoGiaoVien', 'ho_so_giao_vien'),
        ('KhoaHoc', 'khoa_hoc'),
        ('LopHoc', 'lop_hoc'),
        ('LichHoc', 'lich_hoc'),
        ('PhanCongGiaoVien', 'phan_cong_giao_vien'),
        ('DangKyHoc', 'dang_ky_hoc'),
        ('HoaDon', 'hoa_don'),
        ('ThanhToan', 'thanh_toan'),
        ('BuoiHoc', 'buoi_hoc'),
        ('BanGhiDiemDanh', 'ban_ghi_diem_danh'),
        ('KetQuaHocTap', 'ket_qua_hoc_tap'),
        ('YeuCauAI', 'yeu_cau_ai')
    ]

    with open('backend/prisma/schema.prisma', 'r', encoding='utf-8') as f:
        schema_content = f.read()

    models_in_prisma = re.findall(r'model\s+(\w+)', schema_content)
    print(f"Models in schema.prisma ({len(models_in_prisma)}): {models_in_prisma}")

    mismatches_db = []
    for pascal, snake in expected_tables:
        found_in_doc = (pascal.lower() in doc_text.lower()) or (snake in doc_text.lower())
        found_in_prisma = any(m.lower() == pascal.lower() or m.lower() == snake.lower() for m in models_in_prisma)
        status = "KHỚP 100%" if (found_in_doc and found_in_prisma) else "CHÚ Ý"
        print(f"  + Bảng {pascal} ({snake}): Trong Doc={found_in_doc} | Trong Prisma={found_in_prisma} => {status}")
        if not (found_in_doc and found_in_prisma):
            mismatches_db.append(pascal)

    # 2. Tech Stack Verification
    print("\n--- 2. TECH STACK & PHIÊN BẢN ---")
    backend_pkg = ""
    if os.path.exists('backend/package.json'):
        with open('backend/package.json', 'r', encoding='utf-8') as f:
            backend_pkg = f.read()
    frontend_pkg = ""
    if os.path.exists('frontend/package.json'):
        with open('frontend/package.json', 'r', encoding='utf-8') as f:
            frontend_pkg = f.read()

    tech_checks = [
        ("NestJS", "@nestjs/core" in backend_pkg, "NestJS" in doc_text),
        ("Prisma ORM", "@prisma/client" in backend_pkg, "Prisma" in doc_text),
        ("PostgreSQL", "postgresql" in schema_content.lower(), "PostgreSQL" in doc_text),
        ("Next.js App Router", "next" in frontend_pkg, "Next.js" in doc_text),
        ("Tailwind CSS", "tailwindcss" in frontend_pkg, "Tailwind" in doc_text),
        ("Google Gemini API", "@google/genai" in backend_pkg or "gemini" in backend_pkg.lower(), "Gemini" in doc_text),
        ("Argon2 / Bcrypt", "argon2" in backend_pkg or "bcrypt" in backend_pkg, "Argon2" in doc_text or "bcrypt" in doc_text)
    ]
    for tech, in_code, in_doc in tech_checks:
        print(f"  + {tech}: Trong Code={in_code} | Trong Doc={in_doc} => {'ĐỒNG BỘ' if in_code and in_doc else 'CHÚ Ý'}")

    # 3. Core Business Rules
    print("\n--- 3. QUY TẮC NGHIỆP VỤ TRỌNG YẾU (BUSINESS RULES) ---")
    br_checks = [
        ("BR-01: Sĩ số tối đa 25 học viên", "25" in doc_text and "sĩ số" in doc_text.lower()),
        ("BR-02: Ràng buộc 4 điều kiện đăng ký lớp", "điều kiện" in doc_text.lower() and "đăng ký" in doc_text.lower()),
        ("BR-03: Trọng số điểm (20% CC + 30% GK + 50% CK)", "20%" in doc_text and "30%" in doc_text and "50%" in doc_text),
        ("BR-03: Điều kiện Đạt (Tổng kết >= 50.0 & Chuyên cần >= 80%)", "80%" in doc_text and ("50" in doc_text or "50%" in doc_text or "50.0" in doc_text)),
        ("BR-04: Chống trùng phòng học & trùng lịch giáo viên", "trùng" in doc_text.lower() and "phòng" in doc_text.lower()),
        ("BR-05: AI Zero-Trust & Fallback Cache", "zero-trust" in doc_text.lower() or "fallback" in doc_text.lower())
    ]
    for rule, satisfied in br_checks:
        print(f"  + {rule}: {'ĐÃ GHI NHẬN TRONG TÀI LIỆU' if satisfied else 'CHƯA RÕ'}")

    # 4. API Endpoints Check
    print("\n--- 4. RESTFUL API ENDPOINTS & BACKEND CONTROLLERS ---")
    import glob
    controllers = glob.glob('backend/src/modules/**/*.controller.ts', recursive=True)
    backend_routes = []
    for c in controllers:
        with open(c, 'r', encoding='utf-8') as f:
            content = f.read()
        c_match = re.search(r"@Controller\(['\"]([^'\"]*)['\"]", content)
        base_path = c_match.group(1) if c_match else ''
        methods = re.findall(r"@(Get|Post|Put|Patch|Delete)\(['\"]?([^'\")]*)['\"]?", content)
        for m, p in methods:
            full_route = f"/api/v1/{base_path}/{p}".replace('//', '/').rstrip('/')
            backend_routes.append((m.upper(), full_route))

    print(f"Tổng số routes thực tế trong Backend NestJS: {len(backend_routes)}")
    for m, r in sorted(backend_routes)[:20]:
        print(f"  + {m:6} {r}")

    # Check match with Doc
    print("\nKiểm tra đối chiếu API trong Tài liệu Doc vs Backend:")
    doc_apis = re.findall(r'\| (API-[A-Z]+-\d+) \| (GET|POST|PUT|PATCH|DELETE) \| ([^|]+) \|', doc_text)
    print(f"Số lượng API đặc tả trong Bảng 42 của Doc: {len(doc_apis)}")
    for code, m, endpoint in doc_apis:
        endpoint = endpoint.strip()
        print(f"  + {code:12} {m:6} {endpoint}")

    # 5. Roles & Navigation
    print("\n--- 5. 4 VAI TRÒ HỆ THỐNG & ĐIỀU HƯỚNG ---")
    roles = [
        ("QUAN_LY (Admin)", "/admin" in doc_text or "admin" in doc_text.lower()),
        ("GIAO_VIEN (Teacher)", "/teacher" in doc_text or "giáo viên" in doc_text.lower()),
        ("HOC_VIEN (Student)", "/student" in doc_text or "học viên" in doc_text.lower()),
        ("TU_VAN_VIEN (Counselor/Staff)", "/staff" in doc_text or "tư vấn viên" in doc_text.lower())
    ]
    for r, exists in roles:
        print(f"  + Vai trò {r}: Trong Doc={exists}")

    # 6. Test Cases (Chương 8)
    print("\n--- 6. TEST CASES & BÁO CÁO KIỂM THỬ (CHƯƠNG 8) ---")
    test_cases = re.findall(r'TC\d+', doc_text)
    print(f"Tổng số mã Test Case phát hiện trong Chương 8: {len(set(test_cases))} test cases duy nhất")
    print(f"Báo cáo Test Report: {'ĐÃ CÓ TRONG DOC' if 'Báo Cáo Kết Quả Kiểm Thử' in doc_text else 'CHƯA CÓ'}")

    print("\n================================================================")
    print("                    KẾT LUẬN AUDIT TỔNG THỂ")
    print("================================================================")

if __name__ == '__main__':
    audit()
