import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn JWT Bearer Token tự động vào mọi request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('etc_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Xử lý lỗi tập trung (401 Single Session Kickout & redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const msg = typeof error.response?.data?.message === 'string' ? error.response.data.message : '';
      const isKicked =
        msg.includes('thiết bị') ||
        msg.includes('khác') ||
        msg.includes('kết thúc') ||
        msg.includes('phiên làm việc');

      localStorage.removeItem('etc_access_token');
      localStorage.removeItem('etc_user_session');
      sessionStorage.clear();

      if (window.location.pathname !== '/login') {
        if (isKicked) {
          window.location.href = '/login?kicked=1';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// ============================================================================
// CÁC HÀM GỌI API THEO PHÂN HỆ
// ============================================================================

export const authService = {
  login: async (tenDangNhap: string, matKhau: string) => {
    const res = await api.post('/auth/login', { tenDangNhap, matKhau });
    if (res.data.accessToken) {
      sessionStorage.clear(); // Xóa phiên làm việc AI cũ khi đăng nhập mới
      localStorage.setItem('etc_access_token', res.data.accessToken);
      localStorage.setItem('etc_user_session', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => (await api.get('/auth/me')).data,
  changePassword: async (matKhauCu: string, matKhauMoi: string) =>
    (await api.post('/auth/change-password', { matKhauCu, matKhauMoi })).data,
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('etc_access_token');
    localStorage.removeItem('etc_user_session');
    sessionStorage.clear(); // Xóa sạch phiên AI khi đăng xuất
    window.location.href = '/login';
  },
};

export const coursesService = {
  getAll: async (trinhDo?: string, trangThai?: string) =>
    (await api.get('/courses', { params: { trinhDo, trangThai } })).data,
  getById: async (id: number) => (await api.get(`/courses/${id}`)).data,
  create: async (data: any) => (await api.post('/courses', data)).data,
  update: async (id: number, data: any) => (await api.put(`/courses/${id}`, data)).data,
};

export const classesService = {
  getAll: async (khoaHocId?: number, trangThai?: string) =>
    (await api.get('/classes', { params: { khoaHocId, trangThai } })).data,
  getById: async (id: number) => (await api.get(`/classes/${id}`)).data,
  create: async (data: any) => (await api.post('/classes', data)).data,
  update: async (id: number, data: any) => (await api.put(`/classes/${id}`, data)).data,
  updateStatus: async (id: number, trangThai: string) =>
    (await api.put(`/classes/${id}/status`, { trangThai })).data,
  addSchedule: async (id: number, data: any) => (await api.post(`/classes/${id}/schedules`, data)).data,
  assignTeacher: async (id: number, data: any) =>
    (await api.post(`/classes/${id}/assign-teacher`, data)).data,
  getTeacherSchedule: async () => (await api.get('/teachers/me/schedule')).data,
};

export const usersService = {
  getStudents: async (page = 1, limit = 10, search?: string, cefr?: string) =>
    (await api.get('/students', { params: { page, limit, search, cefr } })).data,
  getStudentById: async (id: number) => (await api.get(`/students/${id}`)).data,
  getNextStudentCode: async () => (await api.get('/students/next-code')).data,
  checkStudentDuplicate: async (params: {
    tenDangNhap?: string;
    email?: string;
    maHocVien?: string;
    soDienThoai?: string;
  }) => (await api.get('/students/check-duplicate', { params })).data,
  createStudent: async (data: any) => (await api.post('/students', data)).data,
  updateStudent: async (id: number, data: any) => (await api.put(`/students/${id}`, data)).data,
  deleteStudent: async (id: number) => (await api.delete(`/students/${id}`)).data,
  getTeachers: async () => (await api.get('/teachers')).data,
  getTeacherById: async (id: number) => (await api.get(`/teachers/${id}`)).data,
  getNextTeacherCode: async () => (await api.get('/teachers/next-code')).data,
  checkTeacherDuplicate: async (params: {
    tenDangNhap?: string;
    email?: string;
    maGiaoVien?: string;
    soDienThoai?: string;
  }) => (await api.get('/teachers/check-duplicate', { params })).data,
  createTeacher: async (data: any) => (await api.post('/teachers', data)).data,
  updateTeacher: async (id: number, data: any) => (await api.put(`/teachers/${id}`, data)).data,
  deleteTeacher: async (id: number) => (await api.delete(`/teachers/${id}`)).data,
};

export const enrollmentsService = {
  enroll: async (hocVienId: number, lopHocId: number) =>
    (await api.post('/enrollments', { hocVienId, lopHocId })).data,
  getAll: async (lopHocId?: number, hocVienId?: number) =>
    (await api.get('/enrollments', { params: { lopHocId, hocVienId } })).data,
  getInvoices: async (trangThai?: string, hocVienId?: number) =>
    (await api.get('/invoices', { params: { trangThai, hocVienId } })).data,
  createPayment: async (invoiceId: number, data: { soTien: number; phuongThuc: string; ghiChu?: string }) =>
    (await api.post(`/invoices/${invoiceId}/payments`, data)).data,
  getPayments: async (nguoiThuId?: number, hoaDonId?: number) =>
    (await api.get('/payments', { params: { nguoiThuId, hoaDonId } })).data,
};

export const attendancesService = {
  getClassSessions: async (classId: number) => (await api.get(`/classes/${classId}/sessions`)).data,
  getSessionAttendance: async (sessionId: number) => (await api.get(`/sessions/${sessionId}`)).data,
  getClassAttendanceMatrix: async (classId: number) => (await api.get(`/classes/${classId}/attendance-matrix`)).data,
  submitAttendance: async (sessionId: number, danhSach: any[]) =>
    (await api.post(`/sessions/${sessionId}/attendance`, { danhSach })).data,
  generateSessions: async (classId: number, data?: { soBuoiHoc?: number; chuDeMoi?: string }) =>
    (await api.post(`/classes/${classId}/generate-sessions`, data || {})).data,
  createSession: async (classId: number, data: any) =>
    (await api.post(`/classes/${classId}/sessions`, data)).data,
  updateSession: async (sessionId: number, data: any) =>
    (await api.put(`/sessions/${sessionId}`, data)).data,
  deleteSession: async (sessionId: number) =>
    (await api.delete(`/sessions/${sessionId}`)).data,
};

export const gradesService = {
  getClassGrades: async (classId: number) => (await api.get(`/classes/${classId}/grades`)).data,
  submitGrades: async (classId: number, bangDiem: any[]) =>
    (await api.post(`/classes/${classId}/grades`, { bangDiem })).data,
  getStudentSchedule: async () => (await api.get('/students/me/schedule')).data,
  getStudentGrades: async () => (await api.get('/students/me/grades')).data,
};

export const statisticsService = {
  getDashboard: async (year?: number) =>
    (await api.get('/reports/dashboard', { params: { year } })).data,
};

export const aiService = {
  consultClasses: async (cefr: string, lichRanhJson?: any, mucTieu?: string) =>
    (await api.post('/ai/consult-classes', { cefr, lichRanhJson, mucTieu })).data,
  generateExercises: async (chuDe: string, trinhDo: string, soLuong?: number, loaiCauHoi?: string) =>
    (await api.post('/ai/generate-exercises', { chuDe, trinhDo, soLuong, loaiCauHoi })).data,
  summarizeProgress: async (hocVienId: number, lopHocId: number) =>
    (await api.post('/ai/summarize-progress', { hocVienId, lopHocId })).data,
};
