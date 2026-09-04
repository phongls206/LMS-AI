'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { EtcLogo } from './EtcLogo';

interface FooterProps {
  compact?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <footer className="bg-slate-900/95 dark:bg-[#070b14]/95 border-t border-slate-800 text-slate-300 text-xs mt-auto shrink-0 w-full backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]">
          {/* Contact details in compact row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
              <span>Tổ 1, P. Phan Đình Phùng, Thái Nguyên</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-teal-400 shrink-0" />
              <a href="tel:0787304341" className="hover:text-teal-400 font-mono font-medium">
                0787304341
              </a>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-teal-400 shrink-0" />
              <a href="mailto:lehongphong2108@outlook.com" className="hover:text-teal-400">
                lehongphong2108@outlook.com
              </a>
            </span>
          </div>

          <div className="text-[10px] text-slate-400 text-center md:text-right">
            etcedu.vercel.app ©2026 ETC English Center
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 text-xs mt-auto shrink-0 w-full">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
          {/* Left Column: Contact info */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider mb-2">
              LIÊN HỆ
            </h4>
            <p className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                <strong>Địa chỉ:</strong> Tổ 1, Phường Phan Đình Phùng, Tỉnh Thái Nguyên
              </span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                <strong>Điện thoại:</strong>{' '}
                <a
                  href="tel:0787304341"
                  className="hover:text-teal-400 transition font-mono font-medium"
                >
                  0787304341
                </a>
              </span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:lehongphong2108@outlook.com"
                  className="hover:text-teal-400 transition underline underline-offset-2"
                >
                  lehongphong2108@outlook.com
                </a>
              </span>
            </p>
          </div>

          {/* Right Column: Clean Brand Logo */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <EtcLogo size="md" />
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-slate-800/90 py-2.5 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-slate-400">
          <p>
            etcedu.vercel.app ©2026. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500">
            Hệ thống Quản lý Trung tâm Ngoại ngữ tích hợp Trí tuệ Nhân tạo ETC English
          </p>
        </div>
      </div>
    </footer>
  );
};
