import * as XLSX from 'xlsx';

export interface GradeExportOptions {
  classDetail: any;
  gradesMap: Record<number, { cc: number; gk: number; ck: number; nhanXet: string }>;
  teacherName?: string;
}

export interface AttendanceExportOptions {
  classDetail: any;
  sessions: any[];
  matrixData?: any;
  selectedSessionId?: number | null;
  teacherName?: string;
}

export interface FullClassExportOptions {
  classDetail: any;
  gradesMap: Record<number, { cc: number; gk: number; ck: number; nhanXet: string }>;
  sessions: any[];
  matrixData?: any;
  teacherName?: string;
}

// Chuyển đổi trạng thái điểm danh sang nhãn tiếng Việt
const formatAttendanceStatus = (status?: string) => {
  switch (status) {
    case 'CO_MAT':
      return 'Có Mặt';
    case 'DI_MUON':
      return 'Đi Muộn';
    case 'CO_PHEP':
      return 'Có Phép';
    case 'VANG':
      return 'Vắng Mặt';
    default:
      return 'Chưa Điểm Danh';
  }
};

/**
 * 1. Xuất file Excel Bảng Điểm Tổng Kết (20% - 30% - 50%)
 */
export function exportClassGradeBookExcel({ classDetail, gradesMap, teacherName }: GradeExportOptions) {
  if (!classDetail) return;

  const students = (classDetail.dangKyHoc || [])
    .map((dk: any) => dk.hocVien)
    .filter(Boolean);

  let passedCount = 0;
  let failedCount = 0;

  const rows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — ETC ENGLISH CENTER'],
    ['BẢNG ĐIỂM ĐÁNH GIÁ KẾT QUẢ HỌC TẬP KHÓA HỌC'],
    [''],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
    ['Khóa Học:', `${classDetail.khoaHoc?.tenKhoaHoc || ''} — Khung CEFR: ${classDetail.khoaHoc?.trinhDoYeuCau || 'B1'}`],
    ['Giảng Viên Phụ Trách:', teacherName || 'Giáo viên bộ môn'],
    ['Ngày Xuất Báo Cáo:', new Date().toLocaleDateString('vi-VN')],
    ['Quy Chuẩn Đánh Giá:', 'Chuyên Cần (20%) + Giữa Kỳ (30%) + Cuối Kỳ (50%) | Tiêu chuẩn Đạt: Tổng kết >= 50.0 & Chuyên cần >= 80.0'],
    [''],
    // Header Table
    [
      'STT',
      'Mã Học Viên',
      'Họ Và Tên',
      'Trình Độ Đầu Vào',
      'Điểm Chuyên Cần (20%)',
      'Điểm Giữa Kỳ (30%)',
      'Điểm Cuối Kỳ (50%)',
      'Điểm Tổng Kết (100%)',
      'Kết Quả',
      'Nhận Xét / Đánh Giá Chi Tiết',
    ],
  ];

  students.forEach((stu: any, idx: number) => {
    const g = gradesMap[stu.id] || { cc: 90, gk: 75, ck: 80, nhanXet: '' };
    const cc = Number(g.cc);
    const gk = Number(g.gk);
    const ck = Number(g.ck);
    const finalScore = Number((cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2));
    const isPass = finalScore >= 50.0 && cc >= 80.0;

    if (isPass) passedCount++;
    else failedCount++;

    rows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      cc,
      gk,
      ck,
      finalScore,
      isPass ? 'ĐẠT (Passed)' : 'KHÔNG ĐẠT (Failed)',
      g.nhanXet || '',
    ]);
  });

  // Thống kê tổng hợp ở cuối bảng
  const total = students.length;
  const passRate = total > 0 ? ((passedCount / total) * 100).toFixed(1) : '0';
  const failRate = total > 0 ? ((failedCount / total) * 100).toFixed(1) : '0';

  rows.push(['']);
  rows.push(['TỔNG KẾT & THỐNG KÊ LỚP HỌC:']);
  rows.push(['Tổng số học viên:', total]);
  rows.push(['Số lượng học viên ĐẠT:', `${passedCount} học viên (${passRate}%)`]);
  rows.push(['Số lượng học viên KHÔNG ĐẠT:', `${failedCount} học viên (${failRate}%)`]);
  rows.push(['']);
  rows.push([
    'Giảng Viên Phụ Trách',
    '',
    '',
    '',
    '',
    '',
    'Trưởng Bộ Phận Đào Tạo & Khảo Thí',
  ]);
  rows.push([
    '(Ký và ghi rõ họ tên)',
    '',
    '',
    '',
    '',
    '',
    '(Ký và xác nhận)',
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã HV
    { wch: 24 }, // Họ Tên
    { wch: 18 }, // Trình Độ
    { wch: 22 }, // CC
    { wch: 20 }, // GK
    { wch: 20 }, // CK
    { wch: 22 }, // Tổng Kết
    { wch: 20 }, // Kết Quả
    { wch: 35 }, // Nhận Xét
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bang_Diem_Tong_Ket');
  const fileName = `Bang_Diem_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 2. Xuất file Excel Bảng Điểm Danh (Buổi hiện tại hoặc Toàn bộ các buổi x Học viên)
 */
export function exportClassAttendanceExcel({
  classDetail,
  sessions,
  matrixData,
  selectedSessionId,
  teacherName,
}: AttendanceExportOptions) {
  if (!classDetail) return;

  const students = (classDetail.dangKyHoc || [])
    .map((dk: any) => dk.hocVien)
    .filter(Boolean);

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Điểm danh buổi hiện tại (nếu có chọn buổi) ───────────────────
  if (selectedSessionId) {
    const currentSession = sessions.find((s: any) => s.id === selectedSessionId);
    if (currentSession) {
      const sessionDate = currentSession.ngayHoc
        ? new Date(currentSession.ngayHoc).toLocaleDateString('vi-VN')
        : '';
      const sessionRows: any[][] = [
        ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — BẢNG ĐIỂM DANH BUỔI HỌC'],
        [''],
        ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc})`],
        ['Buổi Học:', `Buổi ${currentSession.soThuTu || ''}: ${currentSession.noiDung || currentSession.tenBuoiHoc || 'Bài học trên lớp'}`],
        ['Thời Gian Học:', `${sessionDate} — ${currentSession.gioBatDau || ''} đến ${currentSession.gioKetThuc || ''}`],
        ['Giảng Viên Phụ Trách:', teacherName || 'Giáo viên phụ trách'],
        ['Phòng Học:', currentSession.phongHoc || classDetail.phongHoc || 'Phòng học ETC'],
        [''],
        ['STT', 'Mã Học Viên', 'Họ Và Tên', 'Trình Độ CEFR', 'Trạng Thái Điểm Danh', 'Ghi Chú Buổi Học'],
      ];

      const recordsMap: Record<number, any> = {};
      (currentSession.diemDanh || []).forEach((d: any) => {
        recordsMap[d.hocVienId] = d;
      });

      let coMat = 0;
      let diMuon = 0;
      let coPhep = 0;
      let vang = 0;

      students.forEach((stu: any, idx: number) => {
        const rec = recordsMap[stu.id];
        const status = rec?.trangThai || 'CO_MAT';
        if (status === 'CO_MAT') coMat++;
        else if (status === 'DI_MUON') diMuon++;
        else if (status === 'CO_PHEP') coPhep++;
        else if (status === 'VANG') vang++;

        sessionRows.push([
          idx + 1,
          stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
          stu.hoTen,
          stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
          formatAttendanceStatus(status),
          rec?.ghiChu || '',
        ]);
      });

      sessionRows.push(['']);
      sessionRows.push(['TỔNG HỢP CHUYÊN CẦN BUỔI HỌC:']);
      sessionRows.push(['Sĩ số lớp:', students.length]);
      sessionRows.push(['Có mặt:', `${coMat} học viên`]);
      sessionRows.push(['Đi muộn:', `${diMuon} học viên`]);
      sessionRows.push(['Có phép:', `${coPhep} học viên`]);
      sessionRows.push(['Vắng mặt:', `${vang} học viên`]);

      const wsSession = XLSX.utils.aoa_to_sheet(sessionRows);
      wsSession['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 24 },
        { wch: 16 },
        { wch: 22 },
        { wch: 35 },
      ];
      XLSX.utils.book_append_sheet(wb, wsSession, `Buoi_${currentSession.soThuTu || 1}`);
    }
  }

  // ── Sheet 2: Ma trận điểm danh toàn khóa học ─────────────────────────────
  const sortedSessions = [...sessions].sort((a, b) => (a.soThuTu || 0) - (b.soThuTu || 0));
  const matrixHeaders = [
    'STT',
    'Mã Học Viên',
    'Họ Và Tên',
    ...sortedSessions.map((s: any) => `Buổi ${s.soThuTu}`),
    'Có Mặt',
    'Đi Muộn',
    'Có Phép',
    'Vắng',
    'Tỷ Lệ Chuyên Cần (%)',
  ];

  const matrixRows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — BẢNG MA TRẬN ĐIỂM DANH TOÀN KHÓA'],
    ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc}) — Tổng số buổi: ${sortedSessions.length}`],
    ['Giảng Viên:', teacherName || 'Giáo viên phụ trách'],
    ['Ngày Xuất:', new Date().toLocaleDateString('vi-VN')],
    [''],
    matrixHeaders,
  ];

  students.forEach((stu: any, idx: number) => {
    let coMat = 0;
    let diMuon = 0;
    let coPhep = 0;
    let vang = 0;

    const sessionCols = sortedSessions.map((s: any) => {
      const rec = (s.diemDanh || []).find((d: any) => Number(d.hocVienId) === Number(stu.id));
      const st = rec?.trangThai;
      if (st === 'CO_MAT') {
        coMat++;
        return '✓ Có Mặt';
      }
      if (st === 'DI_MUON') {
        diMuon++;
        return '⏰ Muộn';
      }
      if (st === 'CO_PHEP') {
        coPhep++;
        return '✉ Phép';
      }
      if (st === 'VANG') {
        vang++;
        return '✗ Vắng';
      }
      return '-';
    });

    const attended = coMat + diMuon + coPhep;
    const totalSessions = sortedSessions.length || 1;
    const rate = Math.round((attended / totalSessions) * 100);

    matrixRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      ...sessionCols,
      coMat,
      diMuon,
      coPhep,
      vang,
      `${rate}%`,
    ]);
  });

  const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);
  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Ma_Tran_Diem_Danh');

  // ── Sheet 3: Danh Sách Học Viên Lớp ──────────────────────────────────────
  const listHeaders = [
    'STT',
    'Mã Học Viên',
    'Họ Và Tên',
    'Trình Độ CEFR',
    'Ngày Sinh',
    'Giới Tính',
    'Số Điện Thoại',
    'Email',
    'Trạng Thái Học Phí',
    'Trạng Thái Lớp Học',
  ];

  const listRows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — DANH SÁCH HỌC VIÊN LỚP HỌC'],
    ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc})`],
    ['Sĩ Số:', `${students.length} / ${classDetail.siSoToiDa || 25} Học viên`],
    [''],
    listHeaders,
  ];

  (classDetail.dangKyHoc || []).forEach((dk: any, idx: number) => {
    const stu = dk.hocVien;
    if (!stu) return;
    const dob = stu.ngaySinh ? new Date(stu.ngaySinh).toLocaleDateString('vi-VN') : '';
    const invoiceStatus = dk.hoaDon?.trangThai === 'DA_HOAN_THANH' ? 'Đã Thanh Toán Đủ' : 'Chưa Thanh Toán Đủ';

    listRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR || 'B1',
      dob,
      stu.gioiTinh || 'Nam',
      stu.nguoiDung?.soDienThoai || '',
      stu.nguoiDung?.email || '',
      invoiceStatus,
      dk.trangThai || 'DA_XAC_NHAN',
    ]);
  });

  const wsList = XLSX.utils.aoa_to_sheet(listRows);
  wsList['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 24 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 26 },
    { wch: 20 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, wsList, 'Danh_Sach_Lop');

  const fileName = `Diem_Danh_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 3. Xuất Trọn Bộ Hồ Sơ Lớp Đầy Đủ (Bảng Điểm 20-30-50 + Ma Trận Điểm Danh + Danh Sách Lớp)
 */
export function exportFullClassPackageExcel({
  classDetail,
  gradesMap,
  sessions,
  teacherName,
}: FullClassExportOptions) {
  if (!classDetail) return;

  const wb = XLSX.utils.book_new();
  const students = (classDetail.dangKyHoc || [])
    .map((dk: any) => dk.hocVien)
    .filter(Boolean);

  // 1. Sheet Bảng Điểm
  let passedCount = 0;
  let failedCount = 0;
  const gradeRows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — BẢNG ĐIỂM TỔNG KẾT KHÓA HỌC'],
    ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc})`],
    ['Giảng Viên:', teacherName || 'Giáo viên phụ trách'],
    ['Ngày Xuất:', new Date().toLocaleDateString('vi-VN')],
    ['Quy Chuẩn:', 'CC (20%) + GK (30%) + CK (50%) — Đạt: Tổng >= 50.0 & CC >= 80.0'],
    [''],
    ['STT', 'Mã Học Viên', 'Họ Và Tên', 'CEFR', 'Chuyên Cần (20%)', 'Giữa Kỳ (30%)', 'Cuối Kỳ (50%)', 'Tổng Kết (100%)', 'Kết Quả', 'Nhận Xét'],
  ];

  students.forEach((stu: any, idx: number) => {
    const g = gradesMap[stu.id] || { cc: 90, gk: 75, ck: 80, nhanXet: '' };
    const cc = Number(g.cc);
    const gk = Number(g.gk);
    const ck = Number(g.ck);
    const finalScore = Number((cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2));
    const isPass = finalScore >= 50.0 && cc >= 80.0;
    if (isPass) passedCount++;
    else failedCount++;

    gradeRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR || 'B1',
      cc,
      gk,
      ck,
      finalScore,
      isPass ? 'ĐẠT' : 'KHÔNG ĐẠT',
      g.nhanXet || '',
    ]);
  });

  const wsGrades = XLSX.utils.aoa_to_sheet(gradeRows);
  XLSX.utils.book_append_sheet(wb, wsGrades, 'Bang_Diem_Tong_Ket');

  // 2. Sheet Điểm Danh
  const sortedSessions = [...sessions].sort((a, b) => (a.soThuTu || 0) - (b.soThuTu || 0));
  const matrixHeaders = [
    'STT',
    'Mã Học Viên',
    'Họ Và Tên',
    ...sortedSessions.map((s: any) => `Buổi ${s.soThuTu}`),
    'Có Mặt',
    'Đi Muộn',
    'Có Phép',
    'Vắng',
    '% Chuyên Cần',
  ];

  const attendanceRows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — BẢNG THEO DÕI ĐIỂM DANH TOÀN KHÓA'],
    ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc})`],
    [''],
    matrixHeaders,
  ];

  students.forEach((stu: any, idx: number) => {
    let coMat = 0;
    let diMuon = 0;
    let coPhep = 0;
    let vang = 0;

    const sessionCols = sortedSessions.map((s: any) => {
      const rec = (s.diemDanh || []).find((d: any) => Number(d.hocVienId) === Number(stu.id));
      const st = rec?.trangThai;
      if (st === 'CO_MAT') { coMat++; return 'Có Mặt'; }
      if (st === 'DI_MUON') { diMuon++; return 'Muộn'; }
      if (st === 'CO_PHEP') { coPhep++; return 'Phép'; }
      if (st === 'VANG') { vang++; return 'Vắng'; }
      return '-';
    });

    const attended = coMat + diMuon + coPhep;
    const totalSessions = sortedSessions.length || 1;
    const rate = Math.round((attended / totalSessions) * 100);

    attendanceRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      ...sessionCols,
      coMat,
      diMuon,
      coPhep,
      vang,
      `${rate}%`,
    ]);
  });

  const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceRows);
  XLSX.utils.book_append_sheet(wb, wsAttendance, 'Diem_Danh_Toan_Khoa');

  // 3. Sheet Danh Sách Lớp
  const listRows: any[][] = [
    ['TRUNG TÂM ANH NGỮ QUỐC TẾ ETC — DANH SÁCH LỚP'],
    ['Lớp Học:', `${classDetail.tenLopHoc} (${classDetail.maLopHoc})`],
    [''],
    ['STT', 'Mã Học Viên', 'Họ Và Tên', 'CEFR', 'Ngày Sinh', 'Giới Tính', 'SĐT', 'Email', 'Học Phí'],
  ];

  (classDetail.dangKyHoc || []).forEach((dk: any, idx: number) => {
    const stu = dk.hocVien;
    if (!stu) return;
    listRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR || 'B1',
      stu.ngaySinh ? new Date(stu.ngaySinh).toLocaleDateString('vi-VN') : '',
      stu.gioiTinh || 'Nam',
      stu.nguoiDung?.soDienThoai || '',
      stu.nguoiDung?.email || '',
      dk.hoaDon?.trangThai === 'DA_HOAN_THANH' ? 'Đã Nộp Đủ' : 'Chưa Hoàn Tất',
    ]);
  });

  const wsList = XLSX.utils.aoa_to_sheet(listRows);
  XLSX.utils.book_append_sheet(wb, wsList, 'Danh_Sach_Lop');

  const fileName = `Ho_So_Lop_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
