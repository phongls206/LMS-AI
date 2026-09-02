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

// Xử lý lỗi tập trung (401 redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('etc_access_token');
      localStorage.removeItem('etc_user_session');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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
      localStorage.setItem('etc_access_token', res.data.accessToken);
      localStorage.setItem('etc_user_session', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => (await api.get('/auth/me')).data,
  changePassword: async (matKhauCu: string, matKhauMoi: string) =>
    (await api.post('/auth/change-password', { matKhauCu, matKhauMoi })).data,
  logout: () => {
    localStorage.removeItem('etc_access_token');
    localStorage.removeItem('etc_user_session');
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
  addSchedule: async (id: number, data: any) => (await api.post(`/classes/${id}/schedules`, data)).data,
  assignTeacher: async (id: number, data: any) =>
    (await api.post(`/classes/${id}/assign-teacher`, data)).data,
  getTeacherSchedule: async () => (await api.get('/teachers/me/schedule')).data,
};

export const usersService = {
  getStudents: async (page = 1, limit = 10, search?: string, cefr?: string) =>
    (await api.get('/students', { params: { page, limit, search, cefr } })).data,
  getStudentById: async (id: number) => (await api.get(`/students/${id}`)).data,
  createStudent: async (data: any) => (await api.post('/students', data)).data,
  updateStudent: async (id: number, data: any) => (await api.put(`/students/${id}`, data)).data,
  getTeachers: async () => (await api.get('/teachers')).data,
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
};

export const attendancesService = {
  getClassSessions: async (classId: number) => (await api.get(`/classes/${classId}/sessions`)).data,
  getSessionAttendance: async (sessionId: number) => (await api.get(`/sessions/${sessionId}`)).data,
  submitAttendance: async (sessionId: number, danhSach: any[]) =>
    (await api.post(`/sessions/${sessionId}/attendance`, { danhSach })).data,
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
  consultClasses: async (cefr: string, lichRanhJson?: any) =>
    (await api.post('/ai/consult-classes', { cefr, lichRanhJson })).data,
  generateExercises: async (chuDe: string, trinhDo: string) =>
    (await api.post('/ai/generate-exercises', { chuDe, trinhDo })).data,
  summarizeProgress: async (hocVienId: number, lopHocId: number) =>
    (await api.post('/ai/summarize-progress', { hocVienId, lopHocId })).data,
};
