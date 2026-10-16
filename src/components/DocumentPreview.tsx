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
  BookOpen,
} from 'lucide-react';
import { marked } from 'marked';
import { DocumentData, DocumentTheme } from '../types';
import { chunkContentForSlides } from '../services/documentExport';
import {
  normalizeAndCleanMarkdown,
  stripMarkdown,
  parsePptxSlideContent,
} from '../services/markdownParser';

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
  const [wordViewMode, setWordViewMode] = useState<'content' | 'cover'>('content');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Normalize markdown text and remove raw asterisk glitches
  const normalizedContent = React.useMemo(() => {
    return normalizeAndCleanMarkdown(data.content);
  }, [data.content]);

  // Parse markdown into clean HTML
  const parsedMarkdownHtml = React.useMemo(() => {
    if (!normalizedContent.trim()) return '';
    try {
      return marked.parse(normalizedContent, { gfm: true, breaks: true }) as string;
    } catch (e) {
      return normalizedContent;
    }
  }, [normalizedContent]);

  // PowerPoint Slide Chunks
  const slideChunks = React.useMemo(() => {
    return chunkContentForSlides(
      data.content,
      data.chunkMode,
      data.maxCharsPerSlide || 400
    );
  }, [data.content, data.chunkMode, data.maxCharsPerSlide]);

  const totalContentSlides = slideChunks.length;
  const hasCoverSlide = data.includeCoverPage;
  const totalSlides = (hasCoverSlide ? 1 : 0) + totalContentSlides;

  // Slide navigation
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Header & Footer preview strings
  const headerPreviewText = data.customHeaderText?.trim() || data.title || 'Tài Liệu Văn Bản';
  const footerPreviewText = data.customFooterText?.trim() || `${theme.name} Edition`;

  // Parsed current slide items for PPTX preview
  const currentChunkIndex = hasCoverSlide ? currentSlideIndex - 1 : currentSlideIndex;
  const currentChunk = slideChunks[currentChunkIndex] || '';
  const currentSlideItems = React.useMemo(() => {
    if (hasCoverSlide && currentSlideIndex === 0) return [];
    return parsePptxSlideContent(currentChunk, theme);
  }, [currentChunk, theme, hasCoverSlide, currentSlideIndex]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
      {/* Top Preview Bar with Format Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Xem trước trực quan (Live Preview)
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-bold shadow-2xs"
            style={{ backgroundColor: `#${theme.primaryHex}20`, color: `#${theme.primaryHex}` }}
          >
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
            onClick={() => {
              setActiveTab('pptx');
              setCurrentSlideIndex(0);
            }}
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
      <div className="p-4 sm:p-6 bg-slate-100/70 min-h-[520px] flex items-center justify-center overflow-auto">
        {/* ===================== TAB 1: WORD PREVIEW ===================== */}
        {activeTab === 'word' && (
          <div className="w-full max-w-[640px] flex flex-col gap-3">
            {/* View Mode Switcher: Cover Page vs Content */}
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Bản in Microsoft Word (.docx) chuẩn:
              </span>
              {data.includeCoverPage ? (
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setWordViewMode('content')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      wordViewMode === 'content'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 Trang Nội Dung
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordViewMode('cover')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      wordViewMode === 'cover'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📖 Trang Bìa {theme.name}
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Trang bìa đang tắt</span>
              )}
            </div>

            {/* Simulated A4 Page */}
            <div className="bg-white rounded-lg shadow-xl border border-slate-200/90 p-8 sm:p-12 transition-all min-h-[580px] flex flex-col justify-between">
              {data.includeCoverPage && wordViewMode === 'cover' ? (
                /* THEME-SPECIFIC COVER PAGE VIEW */
                <div className="flex flex-col items-center justify-center text-center my-auto py-6">
                  {/* Theme Motif Crest */}
                  <div className="text-3xl mb-2">{theme.cover.icons}</div>

                  {/* Theme Badge */}
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full border shadow-2xs"
                    style={{
                      borderColor: `#${theme.primaryHex}40`,
                      color: `#${theme.primaryHex}`,
                      backgroundColor: `#${theme.primaryHex}10`,
                    }}
                  >
                    {theme.cover.badge}
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`}
                    style={{ color: `#${theme.primaryHex}` }}
                  >
                    {data.title || 'Tiêu Đề Tài Liệu'}
                  </h1>

                  {/* Subtitle */}
                  {data.subtitle && (
                    <p
                      className="italic text-sm sm:text-base mb-4 max-w-md font-medium"
                      style={{ color: `#${theme.paperAccentHex}` }}
                    >
                      {data.subtitle}
                    </p>
                  )}

                  {/* Divider */}
                  <div
                    className="text-sm font-bold my-2"
                    style={{ color: `#${theme.primaryHex}` }}
                  >
                    ✦ ──────────────────────── ✦
                  </div>

                  {/* Theme Quote */}
                  {theme.cover.quote && (
                    <p
                      className="text-xs italic max-w-md my-3 px-4 py-1.5 rounded-lg border border-dashed"
                      style={{
                        borderColor: `#${theme.primaryHex}30`,
                        color: `#${theme.paperAccentHex}`,
                        backgroundColor: `#${theme.primaryHex}06`,
                      }}
                    >
                      “{theme.cover.quote}”
                    </p>
                  )}

                  {/* Metadata Card Table */}
                  <div className="w-full max-w-sm mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-2xs text-left text-xs divide-y divide-slate-100 bg-slate-50/50">
                    <div className="flex px-4 py-2.5">
                      <span className="w-36 font-bold text-slate-500">Tác giả biên soạn:</span>
                      <span className="font-semibold text-slate-900">{data.author || 'Chưa đặt'}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-36 font-bold text-slate-500">Đơn vị thực hiện:</span>
                      <span className="text-slate-800">{data.organization || 'Hệ thống Quản trị Tài liệu'}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-36 font-bold text-slate-500">Ngày phát hành:</span>
                      <span className="text-slate-800">{data.date || new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex px-4 py-2.5">
                      <span className="w-36 font-bold text-slate-500">Chủ đề thiết kế:</span>
                      <span className="font-bold" style={{ color: `#${theme.primaryHex}` }}>
                        {theme.name} • {theme.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-8 italic">
                    [ Bắt đầu nội dung chính tại Trang 2 ]
                  </p>
                </div>
              ) : (
                /* MAIN CONTENT VIEW */
                <div>
                  {/* Running Header (if enabled) */}
                  {data.includeHeaderFooter && (
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-[11px] text-slate-500 font-sans mb-6">
                      <span className="truncate max-w-[280px] font-medium">{headerPreviewText}</span>
                      <span className="italic">{footerPreviewText}</span>
                    </div>
                  )}

                  {/* Title & Metadata Header */}
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h1
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${theme.fontClassTitle}`}
                      style={{ color: `#${theme.primaryHex}` }}
                    >
                      {data.title || 'Tiêu Đề Tài Liệu'}
                    </h1>
                    {data.subtitle && (
                      <p className="italic text-sm font-medium mb-3" style={{ color: `#${theme.paperAccentHex}` }}>
                        {data.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span
                        className="font-bold px-2 py-0.5 rounded text-[10px]"
                        style={{ backgroundColor: `#${theme.primaryHex}15`, color: `#${theme.primaryHex}` }}
                      >
                        {theme.name}
                      </span>
                      {data.author && <span>• Tác giả: {data.author}</span>}
                      {data.date && <span>• Ngày: {data.date}</span>}
                    </div>
                  </div>

                  {/* Body Content with rich Markdown formatting & NO raw asterisks */}
                  {parsedMarkdownHtml ? (
                    <div
                      className={`markdown-preview ${theme.fontClassBody}`}
                      style={
                        {
                          '--theme-primary': `#${theme.primaryHex}`,
                          '--theme-accent': `#${theme.paperAccentHex}`,
                          color: `#${theme.paperTextHex}`,
                        } as React.CSSProperties
                      }
                      dangerouslySetInnerHTML={{ __html: parsedMarkdownHtml }}
                    />
                  ) : (
                    <div className="text-center py-16 text-slate-400 italic text-sm">
                      Chưa có nội dung văn bản. Hãy dán nội dung ở khung bên trái hoặc sử dụng tính năng "✨ Làm Đẹp & Xử Lý Dấu Sao"!
                    </div>
                  )}
                </div>
              )}

              {/* Running Footer with Page Numbers */}
              {(data.includeHeaderFooter || data.includePageNumber) && (
                <div className="mt-12 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{data.includeHeaderFooter ? footerPreviewText : ''}</span>
                  {data.includePageNumber && (
                    <span className="font-semibold" style={{ color: `#${theme.primaryHex}` }}>
                      Trang {wordViewMode === 'cover' ? 'Bìa' : '2'} / {wordViewMode === 'cover' ? 'Tập' : '2'}
                    </span>
                  )}
                </div>
              )}
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
              {/* SLIDE 0: TITLE SLIDE (Only if includeCoverPage === true) */}
              {hasCoverSlide && currentSlideIndex === 0 ? (
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
                    <span className="text-3xl mb-1 inline-block">{theme.cover.icons}</span>
                    <span
                      className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: `#${theme.slideAccentHex}` }}
                    >
                      {theme.cover.badge}
                    </span>
                    <h1
                      className={`text-xl sm:text-3xl font-extrabold tracking-tight mb-2 ${theme.fontClassTitle}`}
                      style={{ color: `#${theme.primaryHex}` }}
                    >
                      {data.title || 'Tiêu Đề Bài Thuyết Trình'}
                    </h1>
                    {data.subtitle && (
                      <p
                        className="text-xs sm:text-sm font-medium mb-3 italic"
                        style={{ color: `#${theme.slideAccentHex}` }}
                      >
                        {data.subtitle}
                      </p>
                    )}
                    {theme.cover.quote && (
                      <p
                        className="text-[11px] italic mb-4 max-w-md opacity-90"
                        style={{ color: `#${theme.slideTextHex}` }}
                      >
                        “{theme.cover.quote}”
                      </p>
                    )}
                    <div
                      className="text-[11px] font-sans flex items-center justify-center gap-2 flex-wrap"
                      style={{ color: `#${theme.slideTextHex}` }}
                    >
                      {data.author && <span>Tác giả: {data.author}</span>}
                      {data.date && <span>• Ngày: {data.date}</span>}
                      <span>• Ấn bản: {theme.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* CONTENT SLIDES (Clean parsed markdown without raw syntax) */
                <div className="h-full flex flex-col justify-between relative z-10">
                  {/* Decorative inner card */}
                  <div
                    className="absolute inset-0 border rounded-xl pointer-events-none"
                    style={{
                      borderColor: `#${theme.borderHex || theme.primaryHex}50`,
                      backgroundColor: `#${theme.cardBgHex}40`,
                    }}
                  />

                  <div className="relative z-10 p-2 sm:p-3 overflow-y-auto">
                    {/* Slide Top Tag (Running Header) */}
                    <div
                      className="flex items-center justify-between border-b pb-2 mb-3"
                      style={{ borderColor: `#${theme.primaryHex}30` }}
                    >
                      <span
                        className="text-xs font-bold tracking-wide"
                        style={{ color: `#${theme.primaryHex}` }}
                      >
                        {data.includeHeaderFooter ? headerPreviewText : data.title}
                      </span>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: `#${theme.primaryHex}20`,
                          color: `#${theme.primaryHex}`,
                        }}
                      >
                        Phần {currentChunkIndex + 1} / {totalContentSlides}
                      </span>
                    </div>

                    {/* Parsed slide items */}
                    <div className="space-y-2.5">
                      {currentSlideItems.map((item, iIdx) => {
                        if (item.type === 'heading') {
                          return (
                            <h2
                              key={iIdx}
                              className="font-bold text-sm sm:text-base border-b pb-1"
                              style={{
                                color: item.level === 1 ? `#${theme.primaryHex}` : `#${theme.slideAccentHex}`,
                                borderColor: `#${theme.primaryHex}30`,
                              }}
                            >
                              {item.runs.map((r) => r.text).join(' ')}
                            </h2>
                          );
                        } else if (item.type === 'callout') {
                          return (
                            <div
                              key={iIdx}
                              className="p-2 rounded-lg border-l-4 italic text-xs sm:text-sm bg-black/20"
                              style={{
                                borderColor: `#${theme.primaryHex}`,
                                color: `#${theme.slideTextHex}`,
                              }}
                            >
                              {item.runs.map((r) => r.text).join(' ')}
                            </div>
                          );
                        } else if (item.type === 'bullet') {
                          return (
                            <div key={iIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                              <span style={{ color: `#${theme.primaryHex}` }}>•</span>
                              <span style={{ color: `#${theme.slideTextHex}` }}>
                                {item.runs.map((r, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className={`${r.options?.bold ? 'font-bold' : ''} ${
                                      r.options?.italic ? 'italic' : ''
                                    }`}
                                    style={{ color: r.options?.color ? `#${r.options.color}` : undefined }}
                                  >
                                    {r.text}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <p key={iIdx} className="text-xs sm:text-sm leading-relaxed" style={{ color: `#${theme.slideTextHex}` }}>
                              {item.runs.map((r, rIdx) => (
                                <span
                                  key={rIdx}
                                  className={`${r.options?.bold ? 'font-bold' : ''} ${
                                    r.options?.italic ? 'italic' : ''
                                  }`}
                                  style={{ color: r.options?.color ? `#${r.options.color}` : undefined }}
                                >
                                  {r.text}
                                </span>
                              ))}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div
                    className="relative z-10 pt-2 flex items-center justify-between text-[10px]"
                    style={{ color: `#${theme.slideAccentHex}` }}
                  >
                    <span>{data.includeHeaderFooter ? footerPreviewText : `${theme.name} Theme`}</span>
                    {data.includePageNumber && (
                      <span>
                        Trang {currentSlideIndex + 1} / {totalSlides}
                      </span>
                    )}
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
                <span>
                  Trang {currentSlideIndex + 1} / {totalSlides}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">
                  {hasCoverSlide && currentSlideIndex === 0 ? 'Slide Bìa' : `Nội dung phần ${currentChunkIndex + 1}`}
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
            id="pdf-render-target"
            ref={pdfContainerRef}
            className="pdf-preview-container w-full max-w-[620px] rounded-lg shadow-xl p-8 sm:p-12 relative overflow-hidden transition-all"
            style={{
              backgroundColor: `#${theme.bgHex}`,
              color: `#${theme.slideTextHex}`,
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
              {/* Running Header */}
              {data.includeHeaderFooter && (
                <div
                  className="flex items-center justify-between text-[11px] pb-3 border-b mb-6 font-mono"
                  style={{ borderColor: `#${theme.primaryHex}40` }}
                >
                  <span style={{ color: `#${theme.primaryHex}` }}>★ {headerPreviewText}</span>
                  <span style={{ color: `#${theme.slideAccentHex}` }}>{theme.name.toUpperCase()}</span>
                </div>
              )}

              {/* Cover Elements (If includeCoverPage === true) */}
              {data.includeCoverPage && (
                <div className="text-center mb-6 pb-6 border-b border-dashed" style={{ borderColor: `#${theme.primaryHex}40` }}>
                  <div className="text-2xl mb-1">{theme.cover.icons}</div>
                  <div
                    className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                    style={{ backgroundColor: `#${theme.primaryHex}20`, color: `#${theme.primaryHex}` }}
                  >
                    {theme.cover.badge}
                  </div>
                </div>
              )}

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
                  style={{ color: `#${theme.slideAccentHex}` }}
                >
                  {data.subtitle}
                </p>
              )}

              {/* Metadata */}
              <div
                className="text-center text-[11px] mb-6 pb-2"
                style={{ color: `#${theme.slideTextHex}cc` }}
              >
                {data.author && <span>Tác giả: {data.author} | </span>}
                {data.date && <span>Ngày: {data.date} | </span>}
                <span>Phong cách: {theme.name}</span>
              </div>

              {/* Parsed Markdown Body in PDF Preview (NO raw markdown) */}
              {parsedMarkdownHtml ? (
                <div
                  className={`markdown-preview ${theme.fontClassBody}`}
                  style={
                    {
                      '--theme-primary': `#${theme.primaryHex}`,
                      '--theme-accent': `#${theme.slideAccentHex}`,
                      color: `#${theme.slideTextHex}`,
                    } as React.CSSProperties
                  }
                  dangerouslySetInnerHTML={{ __html: parsedMarkdownHtml }}
                />
              ) : (
                <p className="text-center italic opacity-60 py-6">
                  Chưa có nội dung văn bản để hiển thị trên PDF.
                </p>
              )}

              {/* Running Footer & Page Numbering */}
              {(data.includeHeaderFooter || data.includePageNumber) && (
                <div
                  className="mt-10 pt-4 border-t flex items-center justify-between text-[10px]"
                  style={{ borderColor: `#${theme.primaryHex}40`, color: `#${theme.slideAccentHex}` }}
                >
                  <span>{data.includeHeaderFooter ? footerPreviewText : 'Định dạng chuẩn PDF'}</span>
                  {data.includePageNumber && <span>Trang 1 / 1</span>}
                </div>
              )}
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
              <div className="bg-white flex-1 px-2 py-0.5 rounded border border-slate-200 text-slate-700 truncate font-mono">
                {stripMarkdown(data.title ? data.title.toUpperCase() : 'BẢN GHI CHÉP TÀI LIỆU')}
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
                {stripMarkdown(data.title ? data.title.toUpperCase() : 'BẢN GHI CHÉP TÀI LIỆU')}
              </div>
            </div>

            {/* Row 3: Metadata Row */}
            <div className="grid grid-cols-12 border-b border-slate-300 bg-slate-50">
              <div className="col-span-1 bg-slate-200 text-slate-500 font-bold flex items-center justify-center border-r border-slate-300 text-[10px]">
                3
              </div>
              <div className="col-span-11 px-3 py-1 text-center text-[10px] text-slate-500 italic">
                {theme.cover.badge} | Tác giả: {data.author || 'Chưa đặt'} | Ngày: {data.date || 'Hôm nay'}
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
              <div className="col-span-6 border-r border-white/20 py-1.5 text-[10px]">Nội dung (Đã Lọc Markdown)</div>
              <div className="col-span-2 py-1.5 text-[10px]">Ký tự</div>
            </div>

            {/* Content Rows without any markdown artifacts */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-200">
              {normalizedContent
                .split('\n')
                .map((p) => p.trim())
                .filter(Boolean)
                .map((rawLine, index) => {
                  const isHeading = rawLine.startsWith('#') || /^(Chương|Phần|Mục)\s+[0-9IVXLCDM]+/i.test(rawLine);
                  const cleanText = stripMarkdown(rawLine);
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
                        {isHeading ? 'Đầu mục #' : rawLine.startsWith('- ') ? 'Gạch đầu dòng' : `Đoạn ${index + 1}`}
                      </div>
                      <div
                        className={`col-span-6 border-r border-slate-200 py-2 px-3 text-slate-800 ${
                          isHeading ? 'font-bold' : ''
                        }`}
                        style={{ color: isHeading ? `#${theme.primaryHex}` : undefined }}
                      >
                        {cleanText}
                      </div>
                      <div className="col-span-2 py-2 text-center text-slate-400 font-mono">
                        {cleanText.length}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Sheet Tabs Bar */}
            <div className="bg-slate-200 border-t border-slate-300 px-3 py-1 flex items-center gap-1 text-[11px]">
              {data.includeCoverPage && (
                <span className="px-3 py-1 bg-white font-semibold text-slate-800 rounded-t border-t-2 border-indigo-600 shadow-2xs">
                  Trang Bìa
                </span>
              )}
              <span className="px-3 py-1 bg-white font-semibold text-emerald-800 rounded-t border-t-2 border-emerald-600 shadow-2xs">
                Dữ Liệu Chi Tiết
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
