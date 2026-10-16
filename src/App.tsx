/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  });

  const currentTheme = THEMES[selectedThemeId] || THEMES.fairytale;

  // Calculate live statistics
  const wordCount = documentData.content.trim()
    ? documentData.content.trim().split(/\s+/).length
    : 0;
  const charCount = documentData.content.length;
  const slideCount =
    1 +
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
                <span>💡 Mẹo Định Dạng Nhanh:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  Bắt đầu một dòng bằng <code># Tiêu đề</code> để tạo đề mục lớn trong Word & ngắt slide mới trong PowerPoint.
                </li>
                <li>
                  Hệ thống tự động điều chỉnh độ cao dòng và căn đều lề chuẩn văn bản hành chính.
                </li>
                <li>
                  File Excel tự động tích hợp 2 trang tính: Trang dữ liệu chi tiết và Trang thống kê tổng quan.
                </li>
                <li>
                  Nhấn nút <strong>Xuất trọn bộ (ZIP)</strong> để tải cùng lúc cả 4 định dạng chỉ với 1 lượt bấm.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-400">
        <p>
          Trình Định Dạng & Xuất File Đa Định Dạng • Hỗ trợ Microsoft Word (.docx), PowerPoint (.pptx), PDF (.pdf), Excel (.xlsx)
        </p>
      </footer>
    </div>
  );
}
