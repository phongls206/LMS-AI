---
name: implementation
description: Concise, production-grade Fullstack coding guide (NestJS, Next.js App Router, Prisma PostgreSQL, Gemini GenAI) for ETC English Center.
---

# 🚀 Implementation Skill — Fullstack Engineering Guide

## 1. Tech Stack & Architecture
- **Backend:** NestJS, TypeScript, Prisma ORM, Neon PostgreSQL, Argon2, JWT.
- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Lucide Icons, Axios.
- **GenAI:** `@google/genai` (Gemini 2.5 Flash), structured JSON output, fallback engine.

---

## 2. Core Coding Standards

### 2.1 Backend Authority
- All critical business logic, validations (capacity $\le 25$, conflict-free scheduling, CEFR eligibility, 20/30/50 grade computation), and access control **MUST** be enforced in Backend Services.

### 2.2 ACID Transactions (`prisma.$transaction`)
Wrap all multi-table mutations in an atomic transaction:
- **Enrollment (`UC006`):** Create `DangKyHoc` (`CHO_THANH_TOAN`) $\rightarrow$ Increment `LopHoc.siSoHienTai` $\rightarrow$ Auto-generate `HoaDon` (`CHUA_THANH_TOAN`).
- **Tuition Payment (`UC007`):** Create `ThanhToan` $\rightarrow$ Update `HoaDon.soTienDaTra` $\rightarrow$ If fully paid, set `HoaDon` to `DA_HOAN_THANH` and auto-activate `DangKyHoc` to `DA_XAC_NHAN`.
- **User Creation (`UC002`/`UC003`):** Hash password $\rightarrow$ Create `NguoiDung` $\rightarrow$ Create `HoSoHocVien` or `HoSoGiaoVien`.

### 2.3 PostgreSQL BigInt Serialization
Prisma PostgreSQL returns `bigint` for IDs. Always serialize before returning JSON:
```typescript
private serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? Number(value) : value,
    ),
  );
}
```

### 2.4 Soft Deletion & Status Transitions
Never hard-delete entities with historical relationships (teachers, courses, classes):
- **Teachers:** `DANG_LAM_VIEC` $\rightarrow$ `TAM_NGHI` $\rightarrow$ `DA_NGHI_VIEC`
- **Classes:** `SAP_MO` $\rightarrow$ `DANG_MO_DANG_KY` $\rightarrow$ `DANG_HOC` $\rightarrow$ `DA_KET_THUC` | `DA_HUY`
- **Courses:** `DANG_MO` $\rightarrow$ `NGUNG_HOAT_DONG`

---

## 3. Backend Implementation Patterns

### 3.1 DTO Validation (`class-validator`)
```typescript
export class CreateClassDto {
  @IsNumber()
  khoaHocId: number;

  @IsString()
  @IsNotEmpty()
  maLopHoc: string;

  @IsOptional()
  @Min(1)
  @Max(25)
  siSoToiDa?: number;
}
```

### 3.2 RBAC Guarded Controller
```typescript
@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(VaiTro.QUAN_LY)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.createClass(dto);
  }
}
```

---

## 4. Frontend Implementation Patterns

### 4.1 Protected App Layout with Role Guard
```tsx
'use client';

export default function AdminPage() {
  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Page Title"
      subtitle="Brief description"
    >
      {/* Page Content */}
    </AppLayout>
  );
}
```

### 4.2 Centralized API Client (`services/api.ts`)
```typescript
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 5. Production-Grade GenAI Pipeline (3-Tier Defense)

1. **Tier 1 (Invocation):** Call Gemini SDK with structured JSON prompt, schema, and 30s timeout via `Promise.race()`.
2. **Tier 2 (Post-Validation):** Filter out any hallucinated class IDs against actual database records.
3. **Tier 3 (Fallback & Audit):** On timeout/API error, instantly return deterministic curated data from `fallback-data.ts`. Always write audit logs to `YeuCauAI`.

---

## 6. End-to-End Implementation Workflow
1. **Design Check:** Review SRS requirements, DB schema, and API DTO contracts.
2. **Prisma Schema:** Update `schema.prisma` and run `npx prisma db push` if needed.
3. **Backend Service:** Write business logic with validation, BigInt serialization, and ACID transactions.
4. **Backend Controller:** Add Swagger decorators, endpoints, and `@Roles()` guards.
5. **Frontend UI:** Build role-scoped App Router page with `<AppLayout>` and `services/api.ts`.
6. **Verify:** Run `npm run build` on both `backend` and `frontend`, then test end-to-end.
