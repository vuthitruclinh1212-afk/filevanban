import React, { useState } from 'react';
import {
  FileText,
  Presentation,
  FileSpreadsheet,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { DocumentData, DocumentTheme } from '../types';
import { chunkContentForSlides } from '../services/documentExport';

interface DocumentPreviewProps {
  data: DocumentData;
  theme: DocumentTheme;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  data,
  theme,
  pdfContainerRef,
}) => {
  const [activeTab, setActiveTab] = useState<'word' | 'pptx' | 'pdf' | 'xlsx'>('word');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const paragraphs = data.content
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const slideChunks = chunkContentForSlides(
    data.content,
    data.chunkMode,
    data.maxCharsPerSlide || 400
  );

  // Total slides = 1 title cover slide + content slides
  const totalSlides = 1 + slideChunks.length;

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
      {/* Top Preview Bar with Format Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Xem trước trực quan (Live Preview)
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 font-medium">
            {theme.name}
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('word')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'word'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Word</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pptx')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'pptx'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
            <span>PowerPoint</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-white text-rose-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('xlsx')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'xlsx'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="p-4 sm:p-6 bg-slate-100/70 min-h-[500px] flex items-center justify-center overflow-auto">
        {/* ===================== TAB 1: WORD PREVIEW ===================== */}
        {activeTab === 'word' && (
          <div className="w-full max-w-[620px] bg-white rounded-lg shadow-lg border border-slate-200/90 p-8 sm:p-12 transition-all">
            {/* Page Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-[11px] text-slate-400 font-sans mb-8">
              <span>{data.title || 'Tài Liệu Văn Bản'}</span>
              <span>Phong cách: {theme.name}</span>
            </div>

            {/* Document Title */}
            <h1
              className={`text-2xl sm:text-3xl font-bold text-center tracking-tight mb-2 ${theme.fontClassTitle}`}
              style={{ color: `#${theme.primaryHex}` }}
            >
              {data.title || 'Tiêu Đề Tài Liệu'}
            </h1>

            {/* Subtitle */}
            {data.subtitle && (
              <p
                className="text-center italic text-sm mb-4"
                style={{ color: `#${theme.accentHex}` }}
              >
                {data.subtitle}
              </p>
            )}

            {/* Metadata Pill */}
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500 mb-6">
              <span
                className="px-2.5 py-0.5 rounded-full font-semibold text-[11px]"
                style={{
                  backgroundColor: `#${theme.bgHex}20`,
                  color: `#${theme.primaryHex}`,
                }}
              >
                {theme.name}
              </span>
              {data.author && <span>• Tác giả: {data.author}</span>}
              {data.date && <span>• Ngày: {data.date}</span>}
            </div>

            {/* Decorative Divider */}
            <div
              className="w-24 h-0.5 mx-auto mb-8 rounded-full"
              style={{ backgroundColor: `#${theme.primaryHex}` }}
            />

            {/* Body Text */}
            <div
              className={`space-y-4 text-sm leading-relaxed ${theme.fontClassBody}`}
              style={{
                color: theme.id === 'fairytale' ? '#1B263B' : `#${theme.textHex}`,
              }}
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((para, index) => {
                  const isHeading = para.startsWith('#') || /^[0-9]+[.)]/.test(para);
                  return isHeading ? (
                    <h2
                      key={index}
                      className="text-base font-bold pt-3 pb-1"
                      style={{ color: `#${theme.primaryHex}` }}
                    >
                      {para.replace(/^#+\s*/, '')}
                    </h2>
                  ) : (
                    <p key={index} className="text-justify indent-6">
                      {para}
                    </p>
                  );
                })
              ) : (
                <p className="text-slate-400 italic text-center py-8">
                  Chưa có nội dung văn bản. Hãy dán nội dung ở khung bên trái hoặc chọn mẫu có sẵn!
                </p>
              )}
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Được tạo bởi Trình Định Dạng Đa Năng</span>
              <span>Trang 1 / 1</span>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: POWERPOINT PREVIEW ===================== */}
        {activeTab === 'pptx' && (
          <div className="w-full max-w-[720px] flex flex-col items-center gap-3">
            {/* Slide container in 16:9 */}
            <div
              className="w-full aspect-video rounded-xl shadow-2xl relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between border-2 transition-all duration-300"
              style={{
                backgroundColor: `#${theme.bgHex}`,
                borderColor: `#${theme.primaryHex}`,
              }}
            >
              {/* SLIDE 0: TITLE SLIDE */}
              {currentSlideIndex === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  {/* Decorative Frame */}
                  <div
                    className="absolute inset-4 sm:inset-6 border-2 rounded-xl pointer-events-none"
                    style={{
                      borderColor: `#${theme.primaryHex}60`,
                      backgroundColor: `#${theme.cardBgHex}30`,
                    }}
                  />

                  <div className="relative z-10 max-w-lg">
                    <span className="text-2xl mb-2 inline-block">{theme.icon}</span>
                    <h1
                      className={`text-xl sm:text-3xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`}
                      style={{ color: `#${theme.primaryHex}` }}
                    >
                      {data.title || 'Tiêu Đề Bài Thuyết Trình'}
                    </h1>
                    {data.subtitle && (
                      <p
                        className="text-xs sm:text-sm font-medium mb-6 italic"
                        style={{ color: `#${theme.secondaryHex || theme.accentHex}` }}
                      >
                        {data.subtitle}
                      </p>
                    )}
                    <div
                      className="text-[11px] font-sans flex items-center justify-center gap-2 flex-wrap"
                      style={{ color: `#${theme.textHex}` }}
                    >
                      {data.author && <span>Tác giả: {data.author}</span>}
                      {data.date && <span>• Ngày: {data.date}</span>}
                      <span>• Chủ đề: {theme.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* CONTENT SLIDES */
                <div className="h-full flex flex-col justify-between relative z-10">
                  {/* Decorative inner card */}
                  <div
                    className="absolute inset-0 border rounded-xl pointer-events-none"
                    style={{
                      borderColor: `#${theme.borderHex || theme.primaryHex}50`,
                      backgroundColor: `#${theme.cardBgHex}40`,
                    }}
                  />

                  <div className="relative z-10 p-2 sm:p-3">
                    {/* Slide Top Tag */}
                    <div className="flex items-center justify-between border-b pb-2 mb-4" style={{ borderColor: `#${theme.primaryHex}30` }}>
                      <span
                        className="text-xs font-bold tracking-wide"
                        style={{ color: `#${theme.primaryHex}` }}
                      >
                        {data.title}
                      </span>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `#${theme.primaryHex}20`,
                          color: `#${theme.primaryHex}`,
                        }}
                      >
                        Phần {currentSlideIndex} / {slideChunks.length}
                      </span>
                    </div>

                    {/* Slide Content */}
                    <div
                      className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${theme.fontClassBody}`}
                      style={{ color: `#${theme.textHex}` }}
                    >
                      {slideChunks[currentSlideIndex - 1] || 'Nội dung trang chiếu...'}
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div
                    className="relative z-10 pt-2 flex items-center justify-between text-[10px]"
                    style={{ color: `#${theme.accentHex}` }}
                  >
                    <span>{theme.name} Theme</span>
                    <span>Trang {currentSlideIndex + 1} / {totalSlides}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between w-full px-2">
              <button
                type="button"
                onClick={prevSlide}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trang trước</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span>Trang {currentSlideIndex + 1} / {totalSlides}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">
                  {currentSlideIndex === 0 ? 'Slide Bìa' : `Nội dung phần ${currentSlideIndex}`}
                </span>
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
              >
                <span>Trang sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: PDF PREVIEW ===================== */}
        {activeTab === 'pdf' && (
          <div
            ref={pdfContainerRef}
            className="w-full max-w-[600px] rounded-lg shadow-xl p-8 sm:p-12 relative overflow-hidden transition-all"
            style={{
              backgroundColor: `#${theme.bgHex}`,
              color: `#${theme.textHex}`,
            }}
          >
            {/* Outer Decorative Double Border for PDF */}
            <div
              className="absolute inset-3 sm:inset-4 border-2 rounded-sm pointer-events-none"
              style={{ borderColor: `#${theme.primaryHex}` }}
            />
            <div
              className="absolute inset-4 sm:inset-5 border border-dashed rounded-xs pointer-events-none opacity-60"
              style={{ borderColor: `#${theme.primaryHex}` }}
            />

            {/* PDF Content Area */}
            <div className="relative z-10">
              {/* Header */}
              <div
                className="flex items-center justify-between text-[11px] pb-3 border-b mb-6 font-mono"
                style={{ borderColor: `#${theme.primaryHex}40` }}
              >
                <span style={{ color: `#${theme.primaryHex}` }}>★ TÀI LIỆU CHUẨN XUẤT</span>
                <span style={{ color: `#${theme.accentHex}` }}>{theme.name.toUpperCase()}</span>
              </div>

              {/* Title */}
              <h1
                className={`text-2xl sm:text-3xl font-bold text-center tracking-tight mb-2 ${theme.fontClassTitle}`}
                style={{ color: `#${theme.primaryHex}` }}
              >
                {data.title || 'Tài Liệu Văn Bản'}
              </h1>

              {data.subtitle && (
                <p
                  className="text-center italic text-xs sm:text-sm mb-4"
                  style={{ color: `#${theme.accentHex}` }}
                >
                  {data.subtitle}
                </p>
              )}

              {/* Metadata */}
              <div
                className="text-center text-[11px] mb-6 pb-2"
                style={{ color: `#${theme.textHex}aa` }}
              >
                {data.author && <span>Tác giả: {data.author} | </span>}
                {data.date && <span>Ngày: {data.date} | </span>}
                <span>Phong cách: {theme.name}</span>
              </div>

              {/* Paragraphs */}
              <div className={`space-y-3.5 text-xs sm:text-sm leading-relaxed ${theme.fontClassBody}`}>
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => (
                    <p key={idx} className="indent-4 text-justify">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-center italic opacity-60 py-6">
                    Chưa có nội dung văn bản để hiển thị trên PDF.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div
                className="mt-10 pt-4 border-t flex items-center justify-between text-[10px]"
                style={{ borderColor: `#${theme.primaryHex}40`, color: `#${theme.accentHex}` }}
              >
                <span>Xuất bản tự động theo định dạng chuẩn PDF</span>
                <span>Trang 1 / 1</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: EXCEL PREVIEW ===================== */}
        {activeTab === 'xlsx' && (
          <div className="w-full max-w-[720px] bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden text-xs font-sans">
            {/* Excel Formula Bar Mock */}
            <div className="bg-slate-100 border-b border-slate-300 px-3 py-1.5 flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
                B2
              </span>
              <span className="font-serif italic text-slate-400">fx</span>
              <div className="bg-white flex-1 px-2 py-0.5 rounded border border-slate-200 text-slate-700 truncate">
                {data.title ? data.title.toUpperCase() : 'BẢN GHI CHÉP TÀI LIỆU'}
              </div>
            </div>

            {/* Excel Grid Header Columns (A - F) */}
            <div className="grid grid-cols-12 bg-slate-200 text-slate-600 font-semibold text-center border-b border-slate-300 text-[11px]">
              <div className="col-span-1 border-r border-slate-300 py-1 bg-slate-300">#</div>
              <div className="col-span-1 border-r border-slate-300 py-1">A</div>
              <div className="col-span-1 border-r border-slate-300 py-1">B</div>
              <div className="col-span-2 border-r border-slate-300 py-1">C</div>
              <div className="col-span-5 border-r border-slate-300 py-1">D</div>
              <div className="col-span-2 py-1">E</div>
            </div>

            {/* Row 2: Merged Title Cell */}
            <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-1 bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-r border-slate-300 text-[10px]">
                2
              </div>
              <div
                className="col-span-11 p-3 text-center font-bold text-sm tracking-wide"
                style={{
                  backgroundColor: `#${theme.bgHex}`,
                  color: `#${theme.primaryHex}`,
                }}
              >
                {data.title ? data.title.toUpperCase() : 'BẢN GHI CHÉP TÀI LIỆU'}
              </div>
            </div>

            {/* Row 3: Metadata Row */}
            <div className="grid grid-cols-12 border-b border-slate-300 bg-slate-50">
              <div className="col-span-1 bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-r border-slate-300 text-[10px]">
                3
              </div>
              <div className="col-span-11 px-3 py-1 text-center text-[10px] text-slate-500 italic">
                Chủ đề: {theme.name} | Tác giả: {data.author || 'Chưa đặt'} | Ngày: {data.date || 'Hôm nay'}
              </div>
            </div>

            {/* Row 5: Table Column Headers */}
            <div
              className="grid grid-cols-12 text-white font-bold text-center border-b border-slate-300"
              style={{ backgroundColor: `#${theme.primaryHex}` }}
            >
              <div className="col-span-1 bg-slate-200 text-slate-700 font-bold flex items-center justify-center border-r border-slate-300 text-[10px]">
                5
              </div>
              <div className="col-span-1 border-r border-white/20 py-1.5 text-[10px]">STT</div>
              <div className="col-span-2 border-r border-white/20 py-1.5 text-[10px]">Phân loại</div>
              <div className="col-span-6 border-r border-white/20 py-1.5 text-[10px]">Nội dung đoạn</div>
              <div className="col-span-2 py-1.5 text-[10px]">Ký tự</div>
            </div>

            {/* Content Rows */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-200">
              {paragraphs.map((para, index) => {
                const isHeading = para.startsWith('#') || /^[0-9]+[.)]/.test(para);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`grid grid-cols-12 text-[11px] ${
                      isEven ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <div className="col-span-1 bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-r border-slate-300 text-[10px]">
                      {6 + index}
                    </div>
                    <div className="col-span-1 border-r border-slate-200 py-2 text-center text-slate-600 font-mono">
                      {index + 1}
                    </div>
                    <div className="col-span-2 border-r border-slate-200 py-2 px-2 text-center text-slate-500 font-medium">
                      {isHeading ? 'Đầu mục #' : `Đoạn ${index + 1}`}
                    </div>
                    <div
                      className={`col-span-6 border-r border-slate-200 py-2 px-3 text-slate-800 ${
                        isHeading ? 'font-bold' : ''
                      }`}
                      style={{ color: isHeading ? `#${theme.primaryHex}` : undefined }}
                    >
                      {para}
                    </div>
                    <div className="col-span-2 py-2 text-center text-slate-400 font-mono">
                      {para.length}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sheet Tabs Bar */}
            <div className="bg-slate-200 border-t border-slate-300 px-3 py-1 flex items-center gap-1 text-[11px]">
              <span className="px-3 py-1 bg-white font-semibold text-emerald-800 rounded-t border-t-2 border-emerald-600 shadow-2xs">
                {theme.name}
              </span>
              <span className="px-3 py-1 text-slate-600 hover:bg-slate-300/60 rounded-t transition-colors cursor-pointer">
                Tổng Quan
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
