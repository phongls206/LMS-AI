import * as XLSX from 'xlsx';

export interface GradeItem {
  cc: number | '' | null;
  gk: number | '' | null;
  ck: number | '' | null;
  nhanXet?: string;
}

export interface GradeExportOptions {
  classDetail: any;
  gradesMap: Record<number, GradeItem>;
  calculateFinal?: any;
  isPass?: any;
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
  gradesMap: Record<number, GradeItem>;
  sessions: any[];
  matrixData?: any;
  teacherName?: string;
}

// Chuyển đổi trạng thái điểm danh sang nhãn tiếng Việt
export const formatAttendanceStatus = (status?: string): string => {
  switch (status) {
    case 'CO_MAT':
      return '[✓] Có Mặt';
    case 'DI_MUON':
      return '[⏰] Đi Muộn';
    case 'CO_PHEP':
      return '[✉] Có Phép';
    case 'VANG':
      return '[✗] Vắng Mặt';
    default:
      return '[-] Chưa Điểm Danh';
  }
};

// Định dạng ngày hiển thị dd/MM/yyyy
export const formatDateVi = (dateVal: any, includeYear = true): string => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  if (!includeYear) return `${day}/${month}`;
  return `${day}/${month}/${d.getFullYear()}`;
};

// Phân loại xếp loại học lực theo thang điểm chuẩn
export const classifyAcademicRank = (score: number | null): string => {
  if (score === null || score === undefined || isNaN(score)) return 'Chưa đủ điểm';
  if (score >= 90.0) return 'Xuất Sắc (Excellent)';
  if (score >= 80.0) return 'Giỏi (Good)';
  if (score >= 65.0) return 'Khá (Fair)';
  if (score >= 50.0) return 'Trung Bình (Average)';
  return 'Yếu (Below Average)';
};

/**
 * 1. Xuất file Excel Bảng Điểm Đánh Giá Kết Quả Học Tập (CC 20% - GK 30% - CK 50%)
 */
export function exportClassGradeBookExcel({
  classDetail,
  gradesMap,
  teacherName,
}: GradeExportOptions) {
  if (!classDetail) return;

  const students = (classDetail.dangKyHoc || [])
    .map((dk: any) => dk.hocVien)
    .filter(Boolean);

  const teacher =
    teacherName ||
    classDetail?.phanCong?.[0]?.giaoVien?.hoTen ||
    'Giảng viên phụ trách';

  const rows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — ETC ENGLISH CENTER'],
    ['BẢNG ĐIỂM ĐÁNH GIÁ KẾT QUẢ HỌC TẬP KHÓA HỌC'],
    [''],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
    ['Khóa Học:', `${classDetail.khoaHoc?.tenKhoaHoc || ''} — Chuẩn CEFR: ${classDetail.khoaHoc?.trinhDoYeuCau || 'B1'}`],
    ['Giảng Viên Phụ Trách:', teacher],
    ['Ngày Xuất Báo Cáo:', formatDateVi(new Date())],
    [
      'Quy Chuẩn Đánh Giá:',
      'Chuyên Cần (20%) + Giữa Kỳ (30%) + Cuối Kỳ (50%) | Điều kiện Đạt: Điểm tổng kết >= 50.0 & Điểm chuyên cần >= 80.0',
    ],
    [''],
    // Table Header (Row index 9)
    [
      'STT',
      'Mã Học Viên',
      'Họ Và Tên',
      'Trình Độ Đầu Vào',
      'Điểm Chuyên Cần (20%)',
      'Điểm Giữa Kỳ (30%)',
      'Điểm Cuối Kỳ (50%)',
      'Điểm Tổng Kết (100%)',
      'Xếp Loại Học Lực',
      'Kết Quả',
      'Nhận Xét / Đánh Giá Chi Tiết',
    ],
  ];

  let passedCount = 0;
  let failedCount = 0;
  let inProgressCount = 0;
  const completedScores: number[] = [];

  let rankXuatSac = 0;
  let rankGioi = 0;
  let rankKha = 0;
  let rankTrungBinh = 0;
  let rankYeu = 0;

  students.forEach((stu: any, idx: number) => {
    const g = gradesMap[stu.id] || { cc: '', gk: '', ck: '', nhanXet: '' };
    const hasAllGrades =
      g.cc !== '' && g.cc !== null && g.cc !== undefined && !isNaN(Number(g.cc)) &&
      g.gk !== '' && g.gk !== null && g.gk !== undefined && !isNaN(Number(g.gk)) &&
      g.ck !== '' && g.ck !== null && g.ck !== undefined && !isNaN(Number(g.ck));

    let finalScore: number | string = '—';
    let resultText = 'Chưa đủ điểm';
    let rankText = 'Chưa xếp loại';

    if (hasAllGrades) {
      const cc = Number(g.cc);
      const gk = Number(g.gk);
      const ck = Number(g.ck);
      const score = Number((cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2));
      finalScore = score;
      completedScores.push(score);

      rankText = classifyAcademicRank(score);
      if (score >= 90.0) rankXuatSac++;
      else if (score >= 80.0) rankGioi++;
      else if (score >= 65.0) rankKha++;
      else if (score >= 50.0) rankTrungBinh++;
      else rankYeu++;

      const isPassed = score >= 50.0 && cc >= 80.0;
      if (isPassed) {
        passedCount++;
        resultText = 'ĐẠT (Passed)';
      } else {
        failedCount++;
        resultText = 'KHÔNG ĐẠT (Failed)';
      }
    } else {
      inProgressCount++;
    }

    rows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      g.cc !== '' && g.cc !== null && g.cc !== undefined ? Number(Number(g.cc).toFixed(1)) : '—',
      g.gk !== '' && g.gk !== null && g.gk !== undefined ? Number(Number(g.gk).toFixed(1)) : '—',
      g.ck !== '' && g.ck !== null && g.ck !== undefined ? Number(Number(g.ck).toFixed(1)) : '—',
      finalScore,
      rankText,
      resultText,
      g.nhanXet || '',
    ]);
  });

  // Thống kê tổng hợp ở chân bảng
  const total = students.length;
  const totalEvaluated = passedCount + failedCount;
  const passRate = totalEvaluated > 0 ? ((passedCount / totalEvaluated) * 100).toFixed(1) : '0.0';
  const failRate = totalEvaluated > 0 ? ((failedCount / totalEvaluated) * 100).toFixed(1) : '0.0';
  const avgGpa =
    completedScores.length > 0
      ? (completedScores.reduce((a, b) => a + b, 0) / completedScores.length).toFixed(2)
      : '—';
  const maxGpa = completedScores.length > 0 ? Math.max(...completedScores).toFixed(2) : '—';
  const minGpa = completedScores.length > 0 ? Math.min(...completedScores).toFixed(2) : '—';

  rows.push(['']);
  rows.push(['TỔNG KẾT & PHÂN TÍCH CHẤT LƯỢNG ĐÀO TẠO LỚP HỌC:']);
  rows.push(['Tổng sĩ số lớp học:', total, 'học viên']);
  rows.push(['Số lượng học viên ĐẠT (Passed):', `${passedCount} học viên (${passRate}%)`]);
  rows.push(['Số lượng học viên KHÔNG ĐẠT (Failed):', `${failedCount} học viên (${failRate}%)`]);
  rows.push(['Số học viên đang học / chưa hoàn tất điểm:', `${inProgressCount} học viên`]);
  rows.push(['Điểm trung bình toàn lớp (GPA):', avgGpa]);
  rows.push(['Điểm tổng kết cao nhất (Max):', maxGpa]);
  rows.push(['Điểm tổng kết thấp nhất (Min):', minGpa]);
  rows.push(['']);
  rows.push(['PHÂN BỔ XẾP LOẠI HỌC LỰC:']);
  rows.push(['- Xuất sắc (>= 90.0):', `${rankXuatSac} học viên`]);
  rows.push(['- Giỏi (80.0 - 89.9):', `${rankGioi} học viên`]);
  rows.push(['- Khá (65.0 - 79.9):', `${rankKha} học viên`]);
  rows.push(['- Trung bình (50.0 - 64.9):', `${rankTrungBinh} học viên`]);
  rows.push(['- Yếu / Cần cải thiện (< 50.0):', `${rankYeu} học viên`]);
  rows.push(['']);
  rows.push([
    'GIẢNG VIÊN PHỤ TRÁCH',
    '',
    '',
    '',
    'TRƯỞNG BỘ PHẬN ĐÀO TẠO & KHẢO THÍ',
    '',
    '',
    'BAN GIÁM ĐỐC TRUNG TÂM',
  ]);
  rows.push([
    '(Ký và ghi rõ họ tên)',
    '',
    '',
    '',
    '(Ký và xác nhận)',
    '',
    '',
    '(Ký tên và đóng dấu)',
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã HV
    { wch: 26 }, // Họ Tên
    { wch: 18 }, // Trình Độ Đầu Vào
    { wch: 22 }, // Điểm Chuyên Cần (20%)
    { wch: 20 }, // Điểm Giữa Kỳ (30%)
    { wch: 20 }, // Điểm Cuối Kỳ (50%)
    { wch: 22 }, // Điểm Tổng Kết (100%)
    { wch: 24 }, // Xếp Loại Học Lực
    { wch: 22 }, // Kết Quả
    { wch: 38 }, // Nhận Xét
  ];

  // Row heights
  ws['!rows'] = [
    { hpt: 26 }, // Title 1
    { hpt: 22 }, // Subtitle
    { hpt: 12 }, // Blank
    { hpt: 18 }, // Class
    { hpt: 18 }, // Course
    { hpt: 18 }, // Teacher
    { hpt: 18 }, // Date
    { hpt: 18 }, // Rule
    { hpt: 12 }, // Blank
    { hpt: 25 }, // Table Header
  ];

  // Merges
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
    { s: { r: 4, c: 1 }, e: { r: 4, c: 5 } },
    { s: { r: 5, c: 1 }, e: { r: 5, c: 5 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
    { s: { r: 7, c: 1 }, e: { r: 7, c: 10 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bang_Diem_Tong_Ket');
  const fileName = `Bang_Diem_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 2. Xuất file Excel Điểm Danh: Điểm danh buổi học & Ma trận điểm danh toàn khóa
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

  const teacher =
    teacherName ||
    classDetail?.phanCong?.[0]?.giaoVien?.hoTen ||
    'Giảng viên phụ trách';

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Điểm danh buổi học chi tiết (nếu có chọn buổi) ───────────────
  if (selectedSessionId) {
    const rawSessions = (matrixData?.buoiHoc && matrixData.buoiHoc.length > 0)
      ? matrixData.buoiHoc
      : (sessions || []);
    const currentSession = rawSessions.find((s: any) => Number(s.id) === Number(selectedSessionId));

    if (currentSession) {
      const sessionDate = formatDateVi(currentSession.ngayHoc);
      const sessionRows: any[][] = [
        ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — BẢNG ĐIỂM DANH BUỔI HỌC'],
        [''],
        ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
        [
          'Buổi Học:',
          `Buổi ${currentSession.soThuTu || ''}: ${currentSession.chuDe || currentSession.noiDung || currentSession.tenBuoiHoc || 'Bài học thực hành trên lớp'}`,
        ],
        ['Thời Gian Học:', `${sessionDate} — ${currentSession.gioBatDau || ''} đến ${currentSession.gioKetThuc || ''}`],
        ['Giảng Viên Phụ Trách:', teacher],
        ['Phòng Học:', currentSession.phongHoc || classDetail.phongHoc || 'Phòng học ETC'],
        [''],
        // Header (Row index 8)
        ['STT', 'Mã Học Viên', 'Họ Và Tên', 'Trình Độ CEFR', 'Trạng Thái Điểm Danh', 'Ghi Chú Buổi Học'],
      ];

      const recordsMap: Record<number, any> = {};
      (currentSession.diemDanh || []).forEach((d: any) => {
        recordsMap[Number(d.hocVienId)] = d;
      });

      let coMat = 0;
      let diMuon = 0;
      let coPhep = 0;
      let vang = 0;

      students.forEach((stu: any, idx: number) => {
        const rec = recordsMap[Number(stu.id)];
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

      const totalStudents = students.length;
      const attendedTotal = coMat + diMuon + coPhep;
      const sessionAttendedRate = totalStudents > 0 ? ((attendedTotal / totalStudents) * 100).toFixed(1) : '0.0';

      sessionRows.push(['']);
      sessionRows.push(['TỔNG HỢP CHUYÊN CẦN BUỔI HỌC:']);
      sessionRows.push(['Sĩ số lớp:', totalStudents, 'học viên']);
      sessionRows.push(['Có mặt đúng giờ:', `${coMat} học viên`]);
      sessionRows.push(['Đi muộn:', `${diMuon} học viên`]);
      sessionRows.push(['Vắng có phép:', `${coPhep} học viên`]);
      sessionRows.push(['Vắng không phép:', `${vang} học viên`]);
      sessionRows.push(['Tỷ lệ tham gia buổi học:', `${sessionAttendedRate}%`]);
      sessionRows.push(['']);
      sessionRows.push(['GIẢNG VIÊN ĐIỂM DANH', '', '', '', 'CÁN BỘ QUẢN LÝ ĐÀO TẠO']);
      sessionRows.push(['(Ký và xác nhận)', '', '', '', '(Ký và lưu hồ sơ)']);

      const wsSession = XLSX.utils.aoa_to_sheet(sessionRows);
      wsSession['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 26 },
        { wch: 16 },
        { wch: 24 },
        { wch: 38 },
      ];
      wsSession['!rows'] = [
        { hpt: 26 }, // Title
        { hpt: 12 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 18 },
        { hpt: 12 },
        { hpt: 24 }, // Header
      ];
      wsSession['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } },
        { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
        { s: { r: 4, c: 1 }, e: { r: 4, c: 4 } },
      ];
      XLSX.utils.book_append_sheet(wb, wsSession, `Buoi_${currentSession.soThuTu || 1}`);
    }
  }

  // ── Sheet 2: Ma trận điểm danh toàn khóa học ─────────────────────────────
  // Ưu tiên lấy danh sách buổi học từ matrixData.buoiHoc có chứa diemDanh
  const rawSessions = (matrixData?.buoiHoc && matrixData.buoiHoc.length > 0)
    ? matrixData.buoiHoc
    : (sessions && sessions.length > 0 ? sessions : (classDetail?.buoiHoc || []));

  const sortedSessions = [...rawSessions].sort(
    (a, b) => (Number(a.soThuTu) || 0) - (Number(b.soThuTu) || 0)
  );

  const sessionHeaderLabels = sortedSessions.map((s: any) => {
    const dateStr = s.ngayHoc ? formatDateVi(s.ngayHoc, false) : '';
    return dateStr ? `B${s.soThuTu} (${dateStr})` : `Buổi ${s.soThuTu}`;
  });

  const matrixHeaders = [
    'STT',
    'Mã Học Viên',
    'Họ Và Tên',
    'CEFR',
    ...sessionHeaderLabels,
    'Có Mặt',
    'Đi Muộn',
    'Có Phép',
    'Vắng',
    '% Chuyên Cần',
    'Tình Trạng Dự Thi',
  ];

  const matrixRows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — BẢNG MA TRẬN ĐIỂM DANH TOÀN KHÓA'],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''}) — Tổng số buổi học: ${sortedSessions.length} buổi`],
    ['Khóa Học:', `${classDetail.khoaHoc?.tenKhoaHoc || ''} — Chuẩn CEFR: ${classDetail.khoaHoc?.trinhDoYeuCau || 'B1'}`],
    ['Giảng Viên:', teacher],
    ['Ngày Xuất:', formatDateVi(new Date())],
    [''],
    // Table Header (Row index 6)
    matrixHeaders,
  ];

  let eligibleCount = 0;
  let warningCount = 0;
  let totalClassAttendancePercentSum = 0;

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
        return '[✓] Có Mặt';
      }
      if (st === 'DI_MUON') {
        diMuon++;
        return '[⏰] Muộn';
      }
      if (st === 'CO_PHEP') {
        coPhep++;
        return '[✉] Phép';
      }
      if (st === 'VANG') {
        vang++;
        return '[✗] Vắng';
      }
      return '[-] Chưa học';
    });

    const attended = coMat + diMuon + coPhep;
    const totalSessionsCount = sortedSessions.length;
    const totalConducted = coMat + diMuon + coPhep + vang;
    const rateNumber = totalSessionsCount > 0 ? Number(((attended / totalSessionsCount) * 100).toFixed(1)) : 0;
    totalClassAttendancePercentSum += rateNumber;

    let examEligibility = 'Đang Theo Dõi';
    if (totalConducted > 0) {
      if (rateNumber >= 80.0) {
        eligibleCount++;
        examEligibility = 'ĐỦ ĐIỀU KIỆN DỰ THI';
      } else {
        warningCount++;
        examEligibility = 'CẢNH BÁO: NGUY CƠ CẤM THI (< 80%)';
      }
    }

    matrixRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      ...sessionCols,
      coMat,
      diMuon,
      coPhep,
      vang,
      totalSessionsCount > 0 ? `${rateNumber}%` : '—',
      examEligibility,
    ]);
  });

  const avgClassRate =
    students.length > 0 ? (totalClassAttendancePercentSum / students.length).toFixed(1) : '0.0';
  const eligiblePercent =
    students.length > 0 ? ((eligibleCount / students.length) * 100).toFixed(1) : '0.0';
  const warningPercent =
    students.length > 0 ? ((warningCount / students.length) * 100).toFixed(1) : '0.0';

  matrixRows.push(['']);
  matrixRows.push(['TỔNG KẾT & ĐÁNH GIÁ CHUYÊN CẦN TOÀN KHÓA:']);
  matrixRows.push(['Sĩ số lớp học:', students.length, 'học viên']);
  matrixRows.push(['Tổng số buổi học trong khóa:', sortedSessions.length, 'buổi']);
  matrixRows.push(['Tỷ lệ chuyên cần bình quân cả lớp:', `${avgClassRate}%`]);
  matrixRows.push([
    'Số học viên ĐỦ ĐIỀU KIỆN dự thi (>= 80%):',
    `${eligibleCount} học viên (${eligiblePercent}%)`,
  ]);
  matrixRows.push([
    'Số học viên CẢNH BÁO / NGUY CƠ CẤM THI (< 80%):',
    `${warningCount} học viên (${warningPercent}%)`,
  ]);
  matrixRows.push(['']);
  matrixRows.push(['QUY CHẾ ĐÀO TẠO & CHUYÊN CẦN (ETC ENGLISH CENTER):']);
  matrixRows.push([
    '* Học viên bắt buộc phải tham gia tối thiểu 80.0% tổng số buổi học của khóa để đủ điều kiện tham dự kỳ thi cuối khóa.',
  ]);
  matrixRows.push([
    '* Học viên vắng quá 20.0% số buổi sẽ bị đưa vào danh sách cảnh báo học vụ và đình chỉ tư cách dự thi cuối khóa.',
  ]);
  matrixRows.push(['']);
  matrixRows.push([
    'GIẢNG VIÊN PHỤ TRÁCH',
    '',
    '',
    '',
    'TRƯỞNG BỘ PHẬN ĐÀO TẠO & KHẢO THÍ',
  ]);
  matrixRows.push([
    '(Ký và ghi rõ họ tên)',
    '',
    '',
    '',
    '(Ký và đóng dấu xác nhận)',
  ]);

  const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);

  // Column widths for Matrix
  wsMatrix['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã HV
    { wch: 26 }, // Họ Tên
    { wch: 12 }, // CEFR
    ...sortedSessions.map(() => ({ wch: 15 })), // Buổi 1, 2, ...
    { wch: 11 }, // Có Mặt
    { wch: 11 }, // Đi Muộn
    { wch: 11 }, // Có Phép
    { wch: 11 }, // Vắng
    { wch: 18 }, // % Chuyên Cần
    { wch: 34 }, // Tình Trạng Dự Thi
  ];

  // Row heights for Matrix
  wsMatrix['!rows'] = [
    { hpt: 26 }, // Title 1
    { hpt: 18 }, // Class
    { hpt: 18 }, // Course
    { hpt: 18 }, // Teacher
    { hpt: 18 }, // Date
    { hpt: 12 }, // Blank
    { hpt: 24 }, // Table Header
  ];

  // Merges
  wsMatrix['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 6 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
  ];

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
    'Email Liên Hệ',
    'Tình Trạng Học Phí',
    'Ghi Chú',
  ];

  const listRows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — DANH SÁCH HỌC VIÊN LỚP HỌC'],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
    ['Giảng Viên:', teacher],
    ['Ngày Xuất:', formatDateVi(new Date())],
    [''],
    listHeaders,
  ];

  (classDetail.dangKyHoc || []).forEach((dk: any, idx: number) => {
    const stu = dk.hocVien;
    if (!stu) return;
    const isPaid = dk.hoaDon?.trangThai === 'DA_HOAN_THANH';
    listRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      stu.ngaySinh ? formatDateVi(stu.ngaySinh) : '',
      stu.gioiTinh || 'Nam',
      stu.nguoiDung?.soDienThoai || '',
      stu.nguoiDung?.email || '',
      isPaid ? 'Đã Nộp Đủ Học Phí' : 'Chưa Hoàn Tất Học Phí',
      dk.trangThai === 'DA_XAC_NHAN' ? 'Chính Thức' : 'Chờ Thanh Toán',
    ]);
  });

  const wsList = XLSX.utils.aoa_to_sheet(listRows);
  wsList['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 26 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
    { wch: 20 },
  ];
  wsList['!rows'] = [
    { hpt: 26 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 12 },
    { hpt: 24 },
  ];
  wsList['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } },
  ];

  XLSX.utils.book_append_sheet(wb, wsList, 'Danh_Sach_Lop');

  const fileName = `Diem_Danh_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 3. Xuất Trọn Bộ Hồ Sơ Lớp Đầy Đủ (Tab 1: Bảng Điểm 20-30-50, Tab 2: Ma Trận Điểm Danh, Tab 3: Danh Sách Học Viên)
 */
export function exportFullClassPackageExcel({
  classDetail,
  gradesMap,
  sessions,
  matrixData,
  teacherName,
}: FullClassExportOptions) {
  if (!classDetail) return;

  const wb = XLSX.utils.book_new();
  const students = (classDetail.dangKyHoc || [])
    .map((dk: any) => dk.hocVien)
    .filter(Boolean);

  const teacher =
    teacherName ||
    classDetail?.phanCong?.[0]?.giaoVien?.hoTen ||
    'Giảng viên phụ trách';

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 1: BẢNG ĐIỂM TỔNG KẾT
  // ══════════════════════════════════════════════════════════════════════════
  let passedCount = 0;
  let failedCount = 0;
  let inProgressCount = 0;
  const completedScores: number[] = [];

  const gradeRows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — BẢNG ĐIỂM TỔNG KẾT KHÓA HỌC'],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
    ['Khóa Học:', `${classDetail.khoaHoc?.tenKhoaHoc || ''} — Chuẩn CEFR: ${classDetail.khoaHoc?.trinhDoYeuCau || 'B1'}`],
    ['Giảng Viên:', teacher],
    ['Ngày Xuất:', formatDateVi(new Date())],
    ['Quy Chuẩn:', 'CC (20%) + GK (30%) + CK (50%) — Tiêu chuẩn Đạt: Điểm tổng >= 50.0 & CC >= 80.0'],
    [''],
    [
      'STT',
      'Mã Học Viên',
      'Họ Và Tên',
      'CEFR Đầu Vào',
      'Chuyên Cần (20%)',
      'Giữa Kỳ (30%)',
      'Cuối Kỳ (50%)',
      'Tổng Kết (100%)',
      'Xếp Loại',
      'Kết Quả',
      'Nhận Xét Chi Tiết',
    ],
  ];

  students.forEach((stu: any, idx: number) => {
    const g = gradesMap[stu.id] || { cc: '', gk: '', ck: '', nhanXet: '' };
    const hasAllGrades =
      g.cc !== '' && g.cc !== null && g.cc !== undefined && !isNaN(Number(g.cc)) &&
      g.gk !== '' && g.gk !== null && g.gk !== undefined && !isNaN(Number(g.gk)) &&
      g.ck !== '' && g.ck !== null && g.ck !== undefined && !isNaN(Number(g.ck));

    let finalScore: number | string = '—';
    let resultText = 'Chưa đủ điểm';
    let rankText = 'Chưa xếp loại';

    if (hasAllGrades) {
      const cc = Number(g.cc);
      const gk = Number(g.gk);
      const ck = Number(g.ck);
      const score = Number((cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2));
      finalScore = score;
      completedScores.push(score);

      rankText = classifyAcademicRank(score);
      const isPassed = score >= 50.0 && cc >= 80.0;
      if (isPassed) {
        passedCount++;
        resultText = 'ĐẠT (Passed)';
      } else {
        failedCount++;
        resultText = 'KHÔNG ĐẠT (Failed)';
      }
    } else {
      inProgressCount++;
    }

    gradeRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      g.cc !== '' && g.cc !== null && g.cc !== undefined ? Number(Number(g.cc).toFixed(1)) : '—',
      g.gk !== '' && g.gk !== null && g.gk !== undefined ? Number(Number(g.gk).toFixed(1)) : '—',
      g.ck !== '' && g.ck !== null && g.ck !== undefined ? Number(Number(g.ck).toFixed(1)) : '—',
      finalScore,
      rankText,
      resultText,
      g.nhanXet || '',
    ]);
  });

  const totalEvaluated = passedCount + failedCount;
  const passRate = totalEvaluated > 0 ? ((passedCount / totalEvaluated) * 100).toFixed(1) : '0.0';
  const avgGpa =
    completedScores.length > 0
      ? (completedScores.reduce((a, b) => a + b, 0) / completedScores.length).toFixed(2)
      : '—';

  gradeRows.push(['']);
  gradeRows.push(['TỔNG KẾT BẢNG ĐIỂM:']);
  gradeRows.push(['Sĩ số lớp:', students.length, 'học viên']);
  gradeRows.push(['Tỷ lệ ĐẠT khóa học:', `${passedCount}/${totalEvaluated} (${passRate}%)`]);
  gradeRows.push(['Điểm trung bình (GPA):', avgGpa]);
  gradeRows.push(['']);
  gradeRows.push(['GIẢNG VIÊN PHỤ TRÁCH', '', '', '', 'TRƯỞNG BỘ PHẬN ĐÀO TẠO']);
  gradeRows.push(['(Ký và ghi rõ họ tên)', '', '', '', '(Ký và xác nhận)']);

  const wsGrades = XLSX.utils.aoa_to_sheet(gradeRows);
  wsGrades['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 26 },
    { wch: 16 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 24 },
    { wch: 22 },
    { wch: 36 },
  ];
  wsGrades['!rows'] = [
    { hpt: 26 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 12 },
    { hpt: 24 },
  ];
  wsGrades['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsGrades, 'Bang_Diem_Tong_Ket');

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 2: MA TRẬN ĐIỂM DANH TOÀN KHÓA
  // ══════════════════════════════════════════════════════════════════════════
  const rawSessions = (matrixData?.buoiHoc && matrixData.buoiHoc.length > 0)
    ? matrixData.buoiHoc
    : (sessions && sessions.length > 0 ? sessions : (classDetail?.buoiHoc || []));

  const sortedSessions = [...rawSessions].sort(
    (a, b) => (Number(a.soThuTu) || 0) - (Number(b.soThuTu) || 0)
  );

  const sessionHeaderLabels = sortedSessions.map((s: any) => {
    const dateStr = s.ngayHoc ? formatDateVi(s.ngayHoc, false) : '';
    return dateStr ? `B${s.soThuTu} (${dateStr})` : `Buổi ${s.soThuTu}`;
  });

  const matrixHeaders = [
    'STT',
    'Mã Học Viên',
    'Họ Và Tên',
    'CEFR',
    ...sessionHeaderLabels,
    'Có Mặt',
    'Đi Muộn',
    'Có Phép',
    'Vắng',
    '% Chuyên Cần',
    'Tình Trạng Dự Thi',
  ];

  const attendanceRows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — BẢNG MA TRẬN ĐIỂM DANH TOÀN KHÓA'],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''}) — Tổng số: ${sortedSessions.length} buổi`],
    ['Giảng Viên:', teacher],
    ['Ngày Xuất:', formatDateVi(new Date())],
    [''],
    matrixHeaders,
  ];

  let eligibleCount = 0;
  let warningCount = 0;

  students.forEach((stu: any, idx: number) => {
    let coMat = 0;
    let diMuon = 0;
    let coPhep = 0;
    let vang = 0;

    const sessionCols = sortedSessions.map((s: any) => {
      const rec = (s.diemDanh || []).find((d: any) => Number(d.hocVienId) === Number(stu.id));
      const st = rec?.trangThai;
      if (st === 'CO_MAT') { coMat++; return '[✓] Có Mặt'; }
      if (st === 'DI_MUON') { diMuon++; return '[⏰] Muộn'; }
      if (st === 'CO_PHEP') { coPhep++; return '[✉] Phép'; }
      if (st === 'VANG') { vang++; return '[✗] Vắng'; }
      return '[-] Chưa học';
    });

    const attended = coMat + diMuon + coPhep;
    const totalSessionsCount = sortedSessions.length;
    const totalConducted = coMat + diMuon + coPhep + vang;
    const rateNumber = totalSessionsCount > 0 ? Number(((attended / totalSessionsCount) * 100).toFixed(1)) : 0;

    let examEligibility = 'Đang Theo Dõi';
    if (totalConducted > 0) {
      if (rateNumber >= 80.0) {
        eligibleCount++;
        examEligibility = 'ĐỦ ĐIỀU KIỆN DỰ THI';
      } else {
        warningCount++;
        examEligibility = 'CẢNH BÁO: NGUY CƠ CẤM THI (< 80%)';
      }
    }

    attendanceRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      ...sessionCols,
      coMat,
      diMuon,
      coPhep,
      vang,
      totalSessionsCount > 0 ? `${rateNumber}%` : '—',
      examEligibility,
    ]);
  });

  attendanceRows.push(['']);
  attendanceRows.push(['TỔNG KẾT CHUYÊN CẦN TOÀN KHÓA:']);
  attendanceRows.push(['Sĩ số lớp:', students.length, 'học viên']);
  attendanceRows.push(['Số học viên ĐỦ ĐIỀU KIỆN dự thi (>= 80%):', `${eligibleCount} học viên`]);
  attendanceRows.push(['Số học viên CẢNH BÁO NGUY CƠ CẤM THI (< 80%):', `${warningCount} học viên`]);
  attendanceRows.push(['Quy chế:', 'Chuyên cần >= 80% tổng số buổi học là điều kiện tiên quyết để dự thi cuối khóa.']);

  const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceRows);
  wsAttendance['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 26 },
    { wch: 12 },
    ...sortedSessions.map(() => ({ wch: 15 })),
    { wch: 11 },
    { wch: 11 },
    { wch: 11 },
    { wch: 11 },
    { wch: 18 },
    { wch: 34 },
  ];
  wsAttendance['!rows'] = [
    { hpt: 26 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 12 },
    { hpt: 24 },
  ];
  wsAttendance['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 6 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsAttendance, 'Ma_Tran_Diem_Danh');

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 3: DANH SÁCH HỌC VIÊN LỚP
  // ══════════════════════════════════════════════════════════════════════════
  const listRows: any[][] = [
    ['TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC — HỒ SƠ DANH SÁCH LỚP HỌC'],
    ['Lớp Học:', `${classDetail.tenLopHoc || ''} (${classDetail.maLopHoc || ''})`],
    ['Giảng Viên:', teacher],
    ['Ngày Xuất:', formatDateVi(new Date())],
    [''],
    ['STT', 'Mã Học Viên', 'Họ Và Tên', 'CEFR', 'Ngày Sinh', 'Giới Tính', 'Số Điện Thoại', 'Email', 'Tình Trạng Học Phí'],
  ];

  (classDetail.dangKyHoc || []).forEach((dk: any, idx: number) => {
    const stu = dk.hocVien;
    if (!stu) return;
    const isPaid = dk.hoaDon?.trangThai === 'DA_HOAN_THANH';
    listRows.push([
      idx + 1,
      stu.maHocVien || `HV${String(stu.id).padStart(3, '0')}`,
      stu.hoTen,
      stu.trinhDoCEFR ? `CEFR ${stu.trinhDoCEFR}` : 'B1',
      stu.ngaySinh ? formatDateVi(stu.ngaySinh) : '',
      stu.gioiTinh || 'Nam',
      stu.nguoiDung?.soDienThoai || '',
      stu.nguoiDung?.email || '',
      isPaid ? 'Đã Nộp Đủ' : 'Chưa Hoàn Tất',
    ]);
  });

  const wsList = XLSX.utils.aoa_to_sheet(listRows);
  wsList['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 26 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
  ];
  wsList['!rows'] = [
    { hpt: 26 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 18 },
    { hpt: 12 },
    { hpt: 24 },
  ];
  wsList['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsList, 'Danh_Sach_Lop');

  const fileName = `Ho_So_Lop_${classDetail.maLopHoc || 'ETC'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
