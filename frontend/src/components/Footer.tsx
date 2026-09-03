'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 text-xs mt-auto shrink-0">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left Column: Contact info */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2.5">
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

          {/* Right Column: Logo Box & Domain */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-500 flex items-center justify-center font-black text-white text-sm">
                E
              </div>
              <div className="text-left">
                <span className="font-black text-slate-900 text-sm tracking-tight block leading-none">
                  ETC ENGLISH
                </span>
                <span className="text-[10px] text-teal-700 font-bold block mt-0.5">
                  Smart Center Management
                </span>
              </div>
            </div>

            <a
              href="https://etcedu.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition flex items-center gap-1.5 font-medium text-xs pt-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>https://etcedu.vercel.app</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-slate-800/90 py-3.5 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            etcedu.vercel.app @2026. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-500">
            Hệ thống Quản lý Trung tâm Ngoại ngữ tích hợp Trí tuệ Nhân tạo ETC English
          </p>
        </div>
      </div>
    </footer>
  );
};
