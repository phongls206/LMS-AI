'use client';

import React, { useState } from 'react';
import {
  Printer,
  X,
  FileCheck,
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface PaperExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examData: {
    chuDe: string;
    trinhDo: string;
    cauHoi: any[];
    mode?: string;
  } | null;
}

export const PaperExamModal: React.FC<PaperExamModalProps> = ({
  isOpen,
  onClose,
  examData,
}) => {
  const [includeAnswerSheet, setIncludeAnswerSheet] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);

  if (!isOpen || !examData || !examData.cauHoi) return null;

  const cauHoi = examData.cauHoi || [];
  const duration = Math.max(5, cauHoi.length * 2);

  const getRenderOptions = (q: any): [string, string][] => {
    const isTrueFalse =
      q.loaiCauHoi === 'TRUE_FALSE' ||
      (typeof q.noiDung === 'string' &&
        (q.noiDung.includes('(True or False)') ||
          q.noiDung.includes('True/False') ||
          q.noiDung.includes('(Đúng hay Sai)'))) ||
      (q.luaChon &&
        Object.keys(q.luaChon).length === 2 &&
        Object.values(q.luaChon).some(
          (v: any) =>
            typeof v === 'string' &&
            (v.toLowerCase().includes('true') || v.toLowerCase().includes('đúng')),
        ));

    if (isTrueFalse) {
      const trueVal =
        q.luaChon?.['A'] || q.luaChon?.['True'] || q.luaChon?.['TRUE'] || 'True (Đúng)';
      const falseVal =
        q.luaChon?.['B'] || q.luaChon?.['False'] || q.luaChon?.['FALSE'] || 'False (Sai)';
      return [
        ['A', String(trueVal)],
        ['B', String(falseVal)],
      ];
    }

    if (q.luaChon && typeof q.luaChon === 'object') {
      return Object.entries(q.luaChon).map(([k, v]) => [k, String(v)]);
    }

    return [];
  };

  const formatCorrectAnswer = (q: any) => {
    if (Array.isArray(q.dapAnDung)) return q.dapAnDung.join(', ');
    return String(q.dapAnDung);
  };

  /**
   * Cơ chế in chuyên biệt qua iframe ẩn: Đảm bảo 100% hiển thị đầy đủ nội dung bài tập,
   * không bị ảnh hưởng bởi CSS layout, Tailwind hay popup blocker của trình duyệt.
   */
  const handlePrint = () => {
    const printContent = document.getElementById('printable-practice-sheet');
    if (!printContent) return;

    let iframe = document.getElementById('etc-print-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.remove();
    }
    iframe = document.createElement('iframe');
    iframe.id = 'etc-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '100%';
    iframe.style.bottom = '100%';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Phieu_Bai_Tap_${(examData?.chuDe || 'ETC').replace(/\\s+/g, '_')}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body {
              font-family: 'Times New Roman', Times, Georgia, serif;
              font-size: 12pt;
              line-height: 1.45;
              color: #111827;
              background: #ffffff;
              margin: 0;
              padding: 0;
            }
            .practice-sheet-container {
              border: 2px solid #1e293b;
              border-radius: 4px;
              padding: 16px 20px;
              margin: 0;
              width: 100%;
              box-sizing: border-box;
              background: #ffffff;
            }
            .sheet-header-block {
              display: block;
              width: 100%;
              margin-bottom: 10px;
            }
            .header-top-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
              border-bottom: 2px solid #111827;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            .center-name {
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .center-sub {
              font-size: 9.5pt;
              color: #4b5563;
              margin-top: 1px;
            }
            .sheet-type {
              text-align: right;
            }
            .sheet-title {
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
              color: #0f766e;
            }
            .cefr-badge {
              font-size: 9.5pt;
              color: #374151;
              font-weight: bold;
              margin-top: 1px;
            }
            .header-title-block {
              display: block;
              text-align: center;
              width: 100%;
              margin: 8px 0 10px 0;
            }
            .main-title {
              text-align: center;
              font-size: 15pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 2px 0;
              color: #111827;
              letter-spacing: 0.5px;
            }
            .topic-name {
              text-align: center;
              font-size: 12pt;
              font-weight: bold;
              color: #0f766e;
              margin-bottom: 2px;
            }
            .meta-info {
              text-align: center;
              font-size: 9.5pt;
              font-style: italic;
              color: #4b5563;
              margin-bottom: 6px;
            }
            .student-box {
              display: block;
              width: 100%;
              border: 1.5px solid #475569;
              background-color: #f8fafc;
              padding: 6px 12px;
              font-size: 10.5pt;
              margin: 8px 0 12px 0;
              border-radius: 4px;
              box-sizing: border-box;
            }
            .student-row-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              margin-bottom: 4px;
            }
            .student-row-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              border-top: 1px dashed #cbd5e1;
              padding-top: 4px;
              font-size: 9.5pt;
            }
            .header-divider {
              width: 100%;
              border-bottom: 1.5px solid #111827;
              margin: 6px 0 12px 0;
            }
            .question-item {
              margin-bottom: 12px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .question-text {
              font-size: 11.5pt;
              font-weight: bold;
              margin-bottom: 4px;
              color: #0f172a;
              line-height: 1.4;
              text-align: justify;
            }
            .options-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px 24px;
              padding-left: 20px;
              font-size: 11pt;
            }
            .option-row {
              display: flex;
              align-items: baseline;
              gap: 6px;
            }
            .option-key {
              font-weight: bold;
            }
            .page-break {
              page-break-before: always;
              break-before: page;
              margin-top: 20px;
              padding-top: 16px;
              border-top: 1.5px dashed #9ca3af;
            }
            .section-heading {
              text-align: center;
              font-size: 13pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 10px;
              color: #0f766e;
            }
            .answer-grid {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 8px;
              margin-top: 10px;
            }
            .answer-cell {
              border: 1px solid #d1d5db;
              padding: 5px 8px;
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 10pt;
            }
            .answer-circle {
              width: 17px;
              height: 17px;
              border: 1px solid #6b7280;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 8pt;
              font-weight: bold;
            }
            .key-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              font-size: 10.5pt;
            }
            .key-table th, .key-table td {
              border: 1px solid #9ca3af;
              padding: 5px 8px;
              text-align: center;
            }
            .key-table th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            .explanation-box {
              border: 1px solid #e5e7eb;
              background-color: #f9fafb;
              padding: 8px 12px;
              margin-bottom: 8px;
              border-radius: 4px;
              font-size: 10pt;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .explanation-title {
              font-weight: bold;
              color: #111827;
              margin-bottom: 2px;
            }
            .explanation-correct {
              font-weight: bold;
              color: #065f46;
              margin-bottom: 2px;
            }
            .explanation-text {
              color: #374151;
              font-style: italic;
            }
            .footer-note {
              text-align: center;
              font-size: 9.5pt;
              font-weight: bold;
              margin-top: 16px;
              padding-top: 8px;
              border-top: 1px solid #cbd5e1;
              color: #4b5563;
              page-break-inside: avoid;
              break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 300);
  };

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
          {/* Top Control Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center space-x-2 sm:space-x-2.5">
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-teal-100 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <Printer className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>In / Tải Phiếu Bài Tập (A4)</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-none">
                    In ra giấy hoặc lưu file PDF để tự ôn tập
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Options & Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <label className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-900 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition">
                <input
                  type="checkbox"
                  checked={includeAnswerSheet}
                  onChange={(e) => setIncludeAnswerSheet(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Phiếu khoanh</span>
              </label>

              <label className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-900 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Đáp án & Lời giải</span>
              </label>

              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Bài Tập</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="hidden sm:block p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Paper Preview Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-100 dark:bg-slate-950 flex justify-center overflow-x-auto">
            {/* The Actual Printed Document - Wrapped in full border */}
            <div
              id="printable-practice-sheet"
              className="practice-sheet-container w-full h-full max-w-[210mm] bg-white text-slate-900 p-4 sm:p-10 rounded-lg shadow-md border-2 border-slate-800 space-y-3.5 sm:space-y-4 text-xs sm:text-sm"
              style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
            >
              {/* Worksheet Header - Clean, academic, not a formal exam */}
              <div className="sheet-header-block space-y-2 pb-1">
                {/* Top Row: Trung Tâm & Phiếu Tự Luyện */}
                <div className="header-top-row flex justify-between items-start border-b-2 border-slate-900 pb-2">
                  <div>
                    <p className="center-name font-bold text-xs uppercase tracking-tight text-slate-900">
                      TRUNG TÂM TIẾNG ANH ETC
                    </p>
                    <p className="center-sub text-[11px] text-slate-600">
                      Bộ phận Đào tạo & Khảo thí
                    </p>
                  </div>

                  <div className="sheet-type text-right">
                    <p className="sheet-title font-bold text-xs uppercase text-teal-800">
                      PHIẾU BÀI TẬP TỰ LUYỆN
                    </p>
                    <p className="cefr-badge text-[11px] font-bold text-slate-700">
                      Trình độ: CEFR {examData.trinhDo}
                    </p>
                  </div>
                </div>

                {/* Tiêu Đề Bài Tập */}
                <div className="header-title-block text-center space-y-1 my-2">
                  <h1 className="main-title text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900">
                    BÀI TẬP ÔN LUYỆN TIẾNG ANH
                  </h1>
                  <p className="topic-name font-bold text-sm text-teal-800">
                    Chủ đề: <span>{examData.chuDe}</span>
                  </p>
                  <p className="meta-info italic text-xs text-slate-500">
                    Thời gian gợi ý: ~{duration} phút • Số lượng câu hỏi: {cauHoi.length} câu
                  </p>
                </div>

                {/* Khung Thông Tin Học Sinh - Spans 100% width */}
                <div className="student-box border border-slate-500 p-2.5 text-xs rounded bg-slate-50/70 w-full">
                  <div className="student-row-top flex flex-wrap justify-between items-center gap-y-1 w-full pb-1">
                    <span className="w-full sm:w-auto">
                      <strong>Họ và tên:</strong> ................................................................................
                    </span>
                    <span className="w-full sm:w-auto">
                      <strong>Lớp:</strong> ........................................
                    </span>
                    <span className="w-full sm:w-auto">
                      <strong>Ngày làm:</strong> ....../....../202...
                    </span>
                    <span className="w-full sm:w-auto font-bold text-slate-900">
                      Điểm: ........ / {cauHoi.length}
                    </span>
                  </div>
                  <div className="student-row-bottom flex justify-between items-center pt-1 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                    <span>* Đọc kỹ từng câu hỏi và lựa chọn một phương án trả lời chính xác nhất.</span>
                    <span className="font-semibold text-slate-700">Phiếu tự ôn luyện cá nhân</span>
                  </div>
                </div>

                <div className="header-divider border-b-1.5 border-slate-900 pt-0.5"></div>
              </div>

              {/* Questions Content */}
              <div className="space-y-4 pt-1">
                {cauHoi.map((q: any, idx: number) => {
                  const options = getRenderOptions(q);

                  return (
                    <div key={idx} className="question-item space-y-1.5 text-justify break-inside-avoid">
                      <p className="question-text font-bold text-slate-900 leading-snug">
                        <span className="question-index mr-1">Câu {idx + 1}:</span>
                        {q.noiDung}
                      </p>

                      <div className="options-grid grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-5 text-xs sm:text-sm">
                        {options.map(([optKey, optVal]) => (
                          <div key={optKey} className="option-row flex items-baseline space-x-1.5">
                            <span className="option-key font-bold text-slate-900 shrink-0">{optKey}.</span>
                            <span className="text-slate-800">{optVal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* End of Sheet Marker */}
              <div className="footer-note text-center pt-3 pb-1 border-t border-slate-300">
                <p className="font-bold text-xs tracking-wider uppercase text-slate-700">
                  ---------- HẾT BÀI LUYỆN TẬP ----------
                </p>
                <p className="text-[10px] italic text-slate-500 mt-0.5">
                  (Chúc bạn ôn tập hiệu quả và nắm vững kiến thức!)
                </p>
              </div>

              {/* Answer Sheet (Phiếu Khoanh Đáp Án - Optional) */}
              {includeAnswerSheet && (
                <div className="page-break pt-4 border-t-2 border-dashed border-slate-400 space-y-3">
                  <div className="text-center space-y-0.5">
                    <h2 className="section-heading text-sm font-bold uppercase text-teal-800">
                      PHIẾU KHOANH ĐÁP ÁN NHANH (ANSWER GRID)
                    </h2>
                    <p className="text-xs italic text-slate-600">
                      Chủ đề: <strong>{examData.chuDe}</strong> (CEFR {examData.trinhDo}) — {cauHoi.length} câu
                    </p>
                  </div>

                  <div className="border border-slate-300 p-3 rounded bg-slate-50/40">
                    <p className="text-[11px] font-medium text-slate-600 mb-2">
                      * Khoanh tròn hoặc đánh dấu [X] vào phương án bạn chọn:
                    </p>

                    <div className="answer-grid grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                      {cauHoi.map((_: any, idx: number) => (
                        <div
                          key={idx}
                          className="answer-cell border border-slate-200 p-2 rounded bg-white flex items-center justify-between"
                        >
                          <span className="font-bold w-6 text-slate-700">{idx + 1}.</span>
                          <div className="flex space-x-1.5 font-bold">
                            <span className="answer-circle w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
                              A
                            </span>
                            <span className="answer-circle w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
                              B
                            </span>
                            <span className="answer-circle w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
                              C
                            </span>
                            <span className="answer-circle w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
                              D
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Key & Explanations (Đáp Án Tham Khảo - Optional) */}
              {includeAnswerKey && (
                <div className="page-break pt-4 border-t-2 border-dashed border-slate-400 space-y-3">
                  <div className="text-center space-y-0.5">
                    <h2 className="section-heading text-sm font-bold uppercase text-teal-800">
                      ĐÁP ÁN & LỜI GIẢI THAM KHẢO
                    </h2>
                    <p className="text-xs italic text-slate-600">
                      (Dành cho học viên tự kiểm tra và đối soát sau khi làm bài)
                    </p>
                  </div>

                  {/* Quick Answer Key Table */}
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <div className="bg-slate-100 p-1.5 font-bold text-xs text-center border-b border-slate-300">
                      BẢNG ĐÁP ÁN NHANH
                    </div>
                    <div className="key-table-grid grid grid-cols-5 sm:grid-cols-10 divide-x divide-y divide-slate-200 text-xs text-center">
                      {cauHoi.map((q: any, idx: number) => (
                        <div key={idx} className="p-1.5">
                          <div className="text-[10px] text-slate-500 font-medium">Câu {idx + 1}</div>
                          <div className="font-bold text-teal-800 text-sm mt-0.5">
                            {formatCorrectAnswer(q)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Explanations */}
                  <div className="space-y-2.5 pt-2">
                    <p className="font-bold text-xs uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-1">
                      Giải Thích Chi Tiết Từng Câu:
                    </p>
                    {cauHoi.map((q: any, idx: number) => (
                      <div
                        key={idx}
                        className="explanation-box p-2.5 border border-slate-200 rounded text-xs space-y-1 bg-slate-50/60 break-inside-avoid"
                      >
                        <p className="explanation-title font-bold text-slate-900">
                          Câu {idx + 1}: {q.noiDung}
                        </p>
                        <p className="explanation-correct font-semibold text-emerald-800">
                          Đáp án: [{formatCorrectAnswer(q)}]
                        </p>
                        <p className="explanation-text text-slate-700 italic">
                          <strong className="not-italic font-semibold">Lời giải:</strong> {q.giaiThich || 'Không có giải thích chi tiết.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Control */}
          <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>
              💡 Mẹo: Khi hộp thoại in mở ra, bạn có thể chọn máy in hoặc chọn <strong>"Save as PDF" (Lưu dưới dạng PDF)</strong> để tải về máy.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
