import React from 'react';
import {
  FileText,
  Sparkles,
  BookOpen,
  RotateCcw,
  Upload,
  CheckCircle2,
  FileArchive,
} from 'lucide-react';
import { DocumentTheme } from '../types';
import { SAMPLE_CONTENTS } from '../data/sampleContent';

interface NavbarProps {
  currentTheme: DocumentTheme;
  wordCount: number;
  charCount: number;
  slideCount: number;
  onSelectSample: (sampleId: string) => void;
  onReset: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAll: () => void;
  isExporting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  wordCount,
  charCount,
  slideCount,
  onSelectSample,
  onReset,
  onFileUpload,
  onExportAll,
  isExporting,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, #${currentTheme.primaryHex}, #${currentTheme.accentHex})`,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">
                  Trình Định Dạng & Xuất File Đa Năng
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Word • PPTX • PDF • Excel
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tự động ngắt trang, phối màu theo chủ đề và tạo file tải về ngay lập tức
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Live Document Metrics */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <span title="Tổng số từ">
                <strong className="text-slate-800">{wordCount}</strong> từ
              </span>
              <span className="text-slate-300">|</span>
              <span title="Tổng số ký tự">
                <strong className="text-slate-800">{charCount}</strong> ký tự
              </span>
              <span className="text-slate-300">|</span>
              <span title="Ước tính số trang chiếu PPTX">
                <strong className="text-slate-800">{slideCount}</strong> slide
              </span>
            </div>

            {/* Presets dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nội dung mẫu</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chọn mẫu thử nhanh
                </div>
                {SAMPLE_CONTENTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample.id)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="font-semibold">{sample.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {sample.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload TXT file */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.md,.text"
              onChange={onFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Nhập văn bản từ máy tính (.txt, .md)"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Nhập file</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-xs text-slate-600 shadow-2xs transition-colors cursor-pointer"
              title="Xóa trắng nội dung"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Batch Export Button */}
            <button
              type="button"
              onClick={onExportAll}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              style={{
                backgroundColor: `#${currentTheme.primaryHex}`,
              }}
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>Xuất trọn bộ (ZIP)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
