'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { GiaoVien } from '../../../types';
import { UserCheck, Award, Mail, Phone } from 'lucide-react';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const list = await usersService.getTeachers();
        setTeachers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Đội Ngũ Giáo Viên & Giảng Viên"
      subtitle="Danh sách giảng viên giảng dạy, trình độ bằng cấp và chuyên môn phụ trách"
    >
      <div className="space-y-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {teachers.length} giáo viên đang công tác
        </span>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-lg">
                      {t.hoTen.split(' ').slice(-1)[0][0]}
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                      {t.maGiaoVien}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{t.hoTen}</h3>
                  <div className="flex items-center text-xs text-indigo-400 font-medium mb-3">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    <span>Chuyên môn: {t.chuyenMon}</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    🎓 <span className="text-slate-300 font-semibold">Bằng cấp:</span> {t.bangCap || 'Cử nhân Sư phạm Tiếng Anh'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    <span>{t.nguoiDung?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    <span>{t.nguoiDung?.soDienThoai || 'Chưa cập nhật SĐT'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
