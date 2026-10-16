/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import { Navbar } from './components/Navbar';
import { ThemeSelector } from './components/ThemeSelector';
import { DocumentEditor } from './components/DocumentEditor';
import { DocumentPreview } from './components/DocumentPreview';
import { ExportToolbar } from './components/ExportToolbar';
import { THEMES } from './data/themes';
import { SAMPLE_CONTENTS } from './data/sampleContent';
import { DocumentData } from './types';
import { exportAllFormats } from './services/documentExport';
import { chunkContentForSlides } from './services/documentExport';
import { normalizeAndCleanMarkdown } from './services/markdownParser';

export default function App() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('fairytale');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize with initial sample content
  const initialSample = SAMPLE_CONTENTS[0];
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: initialSample.title,
    subtitle: initialSample.subtitle,
    author: initialSample.author,
    organization: initialSample.organization,
    date: '16/10/2026',
    content: initialSample.content,
    chunkMode: 'charLimit',
    maxCharsPerSlide: 400,
    includeCoverPage: true,
    includeHeaderFooter: true,
    includePageNumber: true,
    customHeaderText: '',
    customFooterText: '',
  });

  const currentTheme = THEMES[selectedThemeId] || THEMES.fairytale;

  // Calculate live statistics
  const wordCount = documentData.content.trim()
    ? documentData.content.trim().split(/\s+/).length
    : 0;
  const charCount = documentData.content.length;
  const slideCount =
    (documentData.includeCoverPage ? 1 : 0) +
    chunkContentForSlides(
      documentData.content,
      documentData.chunkMode,
      documentData.maxCharsPerSlide
    ).length;

  const handleUpdateDocument = (updates: Partial<DocumentData>) => {
    setDocumentData((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CONTENTS.find((s) => s.id === sampleId);
    if (sample) {
      setDocumentData((prev) => ({
        ...prev,
        title: sample.title,
        subtitle: sample.subtitle,
        author: sample.author,
        organization: sample.organization,
        content: sample.content,
      }));
      if (THEMES[sample.themeId]) {
        setSelectedThemeId(sample.themeId);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ nội dung để bắt đầu mới?')) {
      setDocumentData({
        title: 'Bản Ghi Chép Tài Liệu',
        subtitle: '',
        author: '',
        organization: '',
        date: new Date().toLocaleDateString('vi-VN'),
        content: '',
        chunkMode: 'charLimit',
        maxCharsPerSlide: 400,
        includeCoverPage: true,
        includeHeaderFooter: true,
        includePageNumber: true,
        customHeaderText: '',
        customFooterText: '',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
        setDocumentData((prev) => ({
          ...prev,
          title: cleanTitle || prev.title,
          content: text,
        }));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportAll = async () => {
    if (!documentData.content.trim()) {
      alert('Vui lòng nhập nội dung văn bản trước khi xuất file!');
      return;
    }
    setIsExporting(true);
    try {
      await exportAllFormats(documentData, currentTheme, pdfContainerRef.current);
    } catch (err: any) {
      console.error(err);
      alert('Lỗi xuất file: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Pre-parse markdown for offscreen PDF export target
  const parsedPdfHtml = React.useMemo(() => {
    const normalized = normalizeAndCleanMarkdown(documentData.content);
    try {
      return marked.parse(normalized, { gfm: true, breaks: true }) as string;
    } catch (e) {
      return normalized;
    }
  }, [documentData.content]);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTheme={currentTheme}
        wordCount={wordCount}
        charCount={charCount}
        slideCount={slideCount}
        onSelectSample={handleSelectSample}
        onReset={handleReset}
        onFileUpload={handleFileUpload}
        onExportAll={handleExportAll}
        isExporting={isExporting}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor & Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Theme Selector */}
            <ThemeSelector
              selectedThemeId={selectedThemeId}
              onSelectTheme={handleSelectTheme}
            />

            {/* Document Details & Raw Text Editor */}
            <DocumentEditor
              data={documentData}
              onChange={handleUpdateDocument}
              onClear={() => handleUpdateDocument({ content: '' })}
              currentThemeName={currentTheme.name}
            />

            {/* Export Toolbar */}
            <ExportToolbar
              data={documentData}
              theme={currentTheme}
              pdfElementRef={pdfContainerRef}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
            />
          </div>

          {/* Right Column: Live Document Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 flex flex-col gap-4">
            <DocumentPreview
              data={documentData}
              theme={currentTheme}
              pdfContainerRef={pdfContainerRef}
            />

            {/* Helper Tips Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-xs text-slate-500 flex flex-col gap-2">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <span>💡 Hướng Dẫn & Tối Ưu Định Dạng:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <strong>Xử lý dấu sao (*):</strong> Hệ thống tự động làm sạch các dấu sao bao quanh hoặc gạch đầu dòng thành in đậm/in nghiêng/bullet chuẩn chỉnh.
                </li>
                <li>
                  <strong>Trang bìa thẩm mỹ:</strong> Mỗi theme được thiết kế bố cục bìa, huy hiệu, biểu tượng và hoa văn độc bản riêng.
                </li>
                <li>
                  <strong>Đánh số trang & Header/Footer:</strong> Bật/tắt hoặc nhập nội dung tùy chỉnh theo ý muốn.
                </li>
                <li>
                  <strong>Tối ưu đa định dạng:</strong> Không còn sót ký tự Markdown trên PowerPoint, PDF hay Excel.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Off-screen dedicated high-fidelity target for background PDF rendering */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          minHeight: '1123px',
          zIndex: -100,
        }}
        aria-hidden="true"
      >
        <div
          id="pdf-render-target"
          className="p-12 relative overflow-hidden"
          style={{
            backgroundColor: `#${currentTheme.bgHex}`,
            color: `#${currentTheme.slideTextHex}`,
          }}
        >
          {/* Border */}
          <div
            className="absolute inset-4 border-2 pointer-events-none"
            style={{ borderColor: `#${currentTheme.primaryHex}` }}
          />
          <div
            className="absolute inset-5 border border-dashed pointer-events-none opacity-60"
            style={{ borderColor: `#${currentTheme.primaryHex}` }}
          />

          <div className="relative z-10">
            {/* Header */}
            {documentData.includeHeaderFooter && (
              <div
                className="flex items-center justify-between text-xs pb-3 border-b mb-6 font-mono"
                style={{ borderColor: `#${currentTheme.primaryHex}40` }}
              >
                <span style={{ color: `#${currentTheme.primaryHex}` }}>
                  ★ {documentData.customHeaderText || documentData.title}
                </span>
                <span style={{ color: `#${currentTheme.slideAccentHex}` }}>
                  {currentTheme.name.toUpperCase()}
                </span>
              </div>
            )}

            {/* Cover Motif */}
            {documentData.includeCoverPage && (
              <div className="text-center mb-6 pb-4 border-b border-dashed" style={{ borderColor: `#${currentTheme.primaryHex}40` }}>
                <div className="text-3xl mb-1">{currentTheme.cover.icons}</div>
                <div
                  className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                  style={{ backgroundColor: `#${currentTheme.primaryHex}20`, color: `#${currentTheme.primaryHex}` }}
                >
                  {currentTheme.cover.badge}
                </div>
              </div>
            )}

            {/* Title */}
            <h1
              className={`text-3xl font-bold text-center tracking-tight mb-2 ${currentTheme.fontClassTitle}`}
              style={{ color: `#${currentTheme.primaryHex}` }}
            >
              {documentData.title || 'Tài Liệu Văn Bản'}
            </h1>

            {documentData.subtitle && (
              <p
                className="text-center italic text-sm mb-4"
                style={{ color: `#${currentTheme.slideAccentHex}` }}
              >
                {documentData.subtitle}
              </p>
            )}

            <div
              className="text-center text-xs mb-6 pb-2"
              style={{ color: `#${currentTheme.slideTextHex}cc` }}
            >
              {documentData.author && <span>Tác giả: {documentData.author} | </span>}
              {documentData.date && <span>Ngày: {documentData.date} | </span>}
              <span>Chủ đề: {currentTheme.name}</span>
            </div>

            {/* Body */}
            <div
              className={`markdown-preview ${currentTheme.fontClassBody}`}
              style={
                {
                  '--theme-primary': `#${currentTheme.primaryHex}`,
                  '--theme-accent': `#${currentTheme.slideAccentHex}`,
                  color: `#${currentTheme.slideTextHex}`,
                } as React.CSSProperties
              }
              dangerouslySetInnerHTML={{ __html: parsedPdfHtml }}
            />

            {/* Footer */}
            {(documentData.includeHeaderFooter || documentData.includePageNumber) && (
              <div
                className="mt-10 pt-4 border-t flex items-center justify-between text-xs"
                style={{ borderColor: `#${currentTheme.primaryHex}40`, color: `#${currentTheme.slideAccentHex}` }}
              >
                <span>{documentData.includeHeaderFooter ? (documentData.customFooterText || `${currentTheme.name} Edition`) : ''}</span>
                {documentData.includePageNumber && <span>Trang 1 / 1</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-400">
        <p>
          Trình Định Dạng & Xuất File Đa Định Dạng • Hỗ trợ Microsoft Word (.docx), PowerPoint (.pptx), PDF (.pdf), Excel (.xlsx)
        </p>
      </footer>
    </div>
  );
}
