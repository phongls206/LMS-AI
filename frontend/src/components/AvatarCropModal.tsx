'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  Trash2,
  AlertCircle,
  Scissors,
  Eye,
} from 'lucide-react';

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Avatar: string | null) => Promise<void>;
  currentAvatar?: string | null;
  userName?: string;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAvatar,
  userName = 'User',
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [showDetailPreview, setShowDetailPreview] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CROP_SIZE = 260; // Kích thước khung hiển thị chỉnh sửa trên UI
  const OUTPUT_SIZE = 256; // Kích thước chuẩn Web tối ưu (256x256 px)

  // Khởi tạo trạng thái khi mở modal
  useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setErrorMessage(null);
      setPreviewDataUrl(null);
      setShowDetailPreview(false);
    }
  }, [isOpen]);

  // Xử lý chọn tệp từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP, SVG, GIF).');
      return;
    }

    // Giới hạn dung lượng tối đa 5MB chuẩn Web
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Dung lượng tệp vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn để hệ thống tối ưu tốc độ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);

    // Reset input để có thể chọn lại cùng 1 file
    e.target.value = '';
  };

  // Kéo di chuyển ảnh (Mouse / Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Tạo ảnh Base64 nén chuẩn Web từ Canvas
  const generateCroppedImage = useCallback((): string | null => {
    if (!imageSrc || !imageRef.current) return null;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Xóa nền
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Tỉ lệ scale giữa hiển thị UI và canvas xuất ra
    const scaleFactor = OUTPUT_SIZE / CROP_SIZE;

    ctx.save();
    // Di chuyển tới tâm canvas
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Tính kích thước vẽ ảnh tỉ lệ thuận với khung CROP_SIZE
    const aspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = CROP_SIZE;
    let drawHeight = CROP_SIZE;

    if (aspect > 1) {
      drawWidth = CROP_SIZE * aspect;
    } else {
      drawHeight = CROP_SIZE / aspect;
    }

    // Vẽ ảnh với offset pan
    ctx.drawImage(
      img,
      (-drawWidth / 2 + position.x) * scaleFactor,
      (-drawHeight / 2 + position.y) * scaleFactor,
      drawWidth * scaleFactor,
      drawHeight * scaleFactor,
    );

    ctx.restore();

    // Xuất định dạng WebP với quality 0.85 (dung lượng chỉ ~15KB - 40KB, siêu nhẹ)
    try {
      return canvas.toDataURL('image/webp', 0.85);
    } catch {
      return canvas.toDataURL('image/jpeg', 0.85);
    }
  }, [imageSrc, zoom, rotation, position]);

  // Cập nhật live preview khi zoom, xoay, kéo
  useEffect(() => {
    if (imageSrc) {
      const timer = setTimeout(() => {
        const preview = generateCroppedImage();
        if (preview) setPreviewDataUrl(preview);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [imageSrc, zoom, rotation, position, generateCroppedImage]);

  // Lưu avatar
  const handleSave = async () => {
    try {
      setLoading(true);
      const cropped = generateCroppedImage();
      if (!cropped) {
        setErrorMessage('Không thể tạo ảnh đại diện. Vui lòng thử lại.');
        return;
      }
      await onSave(cropped);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
    } finally {
      setLoading(false);
    }
  };

  // Xóa avatar về mặc định
  const handleRemoveAvatar = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện và quay về chữ cái mặc định?')) return;
    try {
      setLoading(true);
      await onSave(null);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Có lỗi xảy ra khi xóa ảnh đại diện.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[999] animate-fadeIn">
      <div className="bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-[#1e2d45] rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Chỉnh Sửa Ảnh Đại Diện
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cắt tỉ lệ chuẩn, zoom và căn chỉnh khuôn mặt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Khu vực Cropper hoặc Chọn tệp */}
        <div className="flex flex-col items-center justify-center">
          {imageSrc ? (
            <div className="space-y-4 w-full flex flex-col items-center">
              {/* Vùng Crop tương tác */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
                className="relative rounded-full overflow-hidden border-4 border-teal-500 shadow-xl cursor-grab active:cursor-grabbing bg-slate-900/90 select-none touch-none flex items-center justify-center"
              >
                {/* Ảnh được zoom & pan */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Avatar Edit"
                  draggable={false}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center center',
                    maxWidth: 'none',
                    maxHeight: 'none',
                  }}
                  className="transition-transform duration-75 select-none pointer-events-none"
                />

                {/* Tâm ngắm căn chỉnh */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/40"></div>
                </div>
              </div>

              {/* Hướng dẫn thao tác */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <Move className="w-3 h-3 text-teal-600" />
                <span>Kéo rê để định vị khuôn mặt • Dùng thanh trượt bên dưới để phóng to</span>
              </p>

              {/* Bộ điều khiển Phóng to / Thu nhỏ & Xoay */}
              <div className="w-full max-w-sm space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200/80 dark:border-[#1e2d45]">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="0.6"
                    max="3.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-teal-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition"
                    title="Phóng to"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition"
                    title="Xoay 90 độ"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPosition({ x: 0, y: 0 });
                      setZoom(1);
                      setRotation(0);
                    }}
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
                    title="Về mặc định"
                  >
                    Đặt lại
                  </button>
                </div>

                {/* Live Preview nhỏ các kích thước */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500">
                  <span>Xem trước thực tế:</span>
                  <div className="flex items-center space-x-3">
                    {previewDataUrl ? (
                      <>
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewDataUrl}
                            alt="32px"
                            className="w-8 h-8 rounded-lg object-cover border border-teal-500 mx-auto shadow-xs"
                          />
                          <span className="text-[9px] text-slate-400">Header</span>
                        </div>
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewDataUrl}
                            alt="48px"
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500 mx-auto shadow-sm"
                          />
                          <span className="text-[9px] text-slate-400">Hồ sơ</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] italic">Đang cập nhật...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút đổi ảnh khác */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold cursor-pointer"
              >
                Chọn ảnh khác từ máy tính
              </button>
            </div>
          ) : (
            /* Khi chưa chọn ảnh: Khung Dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 cursor-pointer bg-slate-50/60 dark:bg-[#0f172a]/60 hover:bg-teal-50/20 transition group"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Nhấn để tải ảnh lên hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Hỗ trợ JPG, PNG, WebP, SVG (Dung lượng tối đa 5MB)
                </p>
              </div>

              {currentAvatar && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetailPreview(true);
                  }}
                  className="pt-2 text-center group/current cursor-pointer"
                  title="Nhấn để xem chi tiết ảnh"
                >
                  <p className="text-[11px] text-slate-400 group-hover/current:text-teal-600 dark:group-hover/current:text-teal-400 mb-1.5 transition">
                    Ảnh hiện tại:
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="relative inline-block">
                    <img
                      src={currentAvatar}
                      alt={userName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 mx-auto shadow-md group-hover/current:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover/current:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Footer Buttons: Chỉ hiển thị khi có ảnh đang cắt hoặc đã có ảnh đại diện */}
        {(imageSrc || currentAvatar) && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {imageSrc ? (
              <>
                <button
                  type="button"
                  onClick={() => setImageSrc(null)}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-teal-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Đang lưu...' : 'Áp Dụng'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={loading}
                  className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa avatar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDetailPreview(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ml-auto"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Xem chi tiết </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal Lightbox Xem Chi Tiết Ảnh Đại Diện Hiện Tại */}
      {showDetailPreview && currentAvatar && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fadeIn"
          onClick={() => setShowDetailPreview(false)}
        >
          <div
            className="bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-[#1e2d45] rounded-3xl w-full max-w-sm sm:max-w-md p-5 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chi Tiết Ảnh Đại Diện Hiện Tại
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailPreview(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentAvatar}
                alt={userName}
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-lg border border-slate-200/60 dark:border-slate-700"
              />
              {userName && (
                <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300 text-center">
                  {userName}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowDetailPreview(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
