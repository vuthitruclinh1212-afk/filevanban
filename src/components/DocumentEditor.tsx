import React, { useState } from 'react';
import {
  FileEdit,
  Type,
  User,
  Calendar,
  Sliders,
  Trash2,
  Sparkles,
  Table,
  Quote,
  Bold,
  Italic,
  ListPlus,
  Loader2,
  CheckCircle2,
  Wand2,
  FileCheck2,
  Layers,
  Heading1,
  Heading2,
  BookOpen,
} from 'lucide-react';
import { DocumentData } from '../types';
import { normalizeAndCleanMarkdown } from '../services/markdownParser';
import { QUICK_AI_PROMPTS } from '../services/aiImageService';

interface DocumentEditorProps {
  data: DocumentData;
  onChange: (updates: Partial<DocumentData>) => void;
  onClear: () => void;
  currentThemeName: string;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  data,
  onChange,
  onClear,
  currentThemeName,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [showAiImageModal, setShowAiImageModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customAlt, setCustomAlt] = useState('');

  const wordCount = data.content.trim() ? data.content.trim().split(/\s+/).length : 0;
  const lineCount = data.content ? data.content.split('\n').filter((l) => l.trim()).length : 0;

  const insertText = (snippet: string) => {
    onChange({
      content: data.content ? `${data.content}\n\n${snippet}` : snippet,
    });
  };

  // AI-powered intelligent document restructuring & Markdown beautifier
  const handleAiBeautify = async () => {
    if (!data.content.trim()) {
      alert('Vui lòng dán hoặc nhập nội dung văn bản trước khi yêu cầu AI làm đẹp!');
      return;
    }

    setIsAiLoading(true);
    setAiSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/enhance-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: data.content,
          title: data.title,
          style: currentThemeName,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Không thể xử lý văn bản');
      }

      if (result.markdown) {
        const cleaned = normalizeAndCleanMarkdown(result.markdown);
        onChange({ content: cleaned });
        setAiSuccessMsg('Đã tự động tái cấu trúc văn bản thành Markdown chuẩn xuất bản! ✨');
        setTimeout(() => setAiSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback rule-based beautifier if API fails
      handleRuleBasedBeautify();
      setAiSuccessMsg('Đã chuẩn hóa văn bản & xử lý toàn bộ dấu sao, định dạng thẩm mỹ! ✨');
      setTimeout(() => setAiSuccessMsg(null), 5000);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Rule-based smart beautifier (Cleans asterisks, normalizes headings and callouts)
  const handleRuleBasedBeautify = () => {
    const raw = data.content.trim();
    if (!raw) return;

    const cleanedRaw = normalizeAndCleanMarkdown(raw);
    const lines = cleanedRaw.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let formatted = `# ${data.title || 'Tài Liệu Văn Bản'}\n\n`;
    if (data.subtitle) {
      formatted += `*${data.subtitle}*\n\n`;
    }

    formatted += `> 💡 **Tóm Tắt Tổng Quan:** Bản tài liệu được chuẩn hóa và biên soạn theo phong cách ${currentThemeName}.\n\n`;

    lines.forEach((line, idx) => {
      if (line.startsWith('#') || line.startsWith('>') || line.startsWith('|') || line.startsWith('-')) {
        formatted += `${line}\n\n`;
      } else if (idx === 0 && !line.startsWith('#')) {
        formatted += `## 1. Giới Thiệu & Tổng Quan\n\n${line}\n\n`;
      } else if (idx === Math.floor(lines.length / 2)) {
        formatted += `## 2. Nội Dung Trọng Tâm & Đánh Giá\n\n${line}\n\n`;
      } else {
        formatted += `${line}\n\n`;
      }
    });

    formatted += `\n---\n\n> ❖ **Ghi chú ấn bản:** Tài liệu được khởi tạo ngày ${data.date || 'hôm nay'}.`;
    onChange({ content: formatted.trim() });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Thông tin & Cấu hình tài liệu</h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer px-2.5 py-1 bg-indigo-50/70 hover:bg-indigo-100/70 rounded-lg transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Thu gọn tùy chọn' : '⚙️ Tùy chọn trang in & Header/Footer'}</span>
        </button>
      </div>

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tiêu đề tài liệu <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Type className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Nhập tiêu đề tài liệu..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phụ đề / Thuyết minh
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="Mô tả ngắn hoặc phụ đề (không bắt buộc)..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tác giả / Người biên soạn
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={data.author}
              onChange={(e) => onChange({ author: e.target.value })}
              placeholder="Tên tác giả hoặc phòng ban..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ngày lập tài liệu
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              placeholder="Ví dụ: 16/10/2026 hoặc Hôm nay"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Dedicated Page Setup: Cover Page, Header/Footer, Page Numbers */}
      <div className="p-4 bg-slate-50/90 border border-slate-200/90 rounded-xl flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">
            Thiết lập Trang Bìa, Đánh Số Trang & Header / Footer
          </span>
        </div>

        {/* 3 Core Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Cover Page Toggle */}
          <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={data.includeCoverPage}
              onChange={(e) => onChange({ includeCoverPage: e.target.checked })}
              className="rounded accent-indigo-600 cursor-pointer w-4 h-4"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">Trang bìa thẩm mỹ</span>
              <span className="block text-[10px] text-slate-500">Thiết kế bìa riêng theo chủ đề</span>
            </div>
          </label>

          {/* Page Numbering Toggle */}
          <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={data.includePageNumber}
              onChange={(e) => onChange({ includePageNumber: e.target.checked })}
              className="rounded accent-indigo-600 cursor-pointer w-4 h-4"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">Đánh số trang</span>
              <span className="block text-[10px] text-slate-500">Hiển thị "Trang X / Y"</span>
            </div>
          </label>

          {/* Header & Footer Toggle */}
          <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white hover:bg-slate-50/80 cursor-pointer transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={data.includeHeaderFooter}
              onChange={(e) => onChange({ includeHeaderFooter: e.target.checked })}
              className="rounded accent-indigo-600 cursor-pointer w-4 h-4"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">Bật Header & Footer</span>
              <span className="block text-[10px] text-slate-500">Đầu trang & chân trang</span>
            </div>
          </label>
        </div>

        {/* Custom Header & Footer text inputs (Shown when Header/Footer is enabled) */}
        {data.includeHeaderFooter && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nội dung Header tùy chỉnh (Mặc định: Tiêu đề tài liệu)
              </label>
              <input
                type="text"
                value={data.customHeaderText || ''}
                onChange={(e) => onChange({ customHeaderText: e.target.value })}
                placeholder={data.title || 'Tiêu đề tài liệu'}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nội dung Footer tùy chỉnh (Mặc định: Tên chủ đề ấn bản)
              </label>
              <input
                type="text"
                value={data.customFooterText || ''}
                onChange={(e) => onChange({ customFooterText: e.target.value })}
                placeholder={`${currentThemeName} Edition`}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Slide Splitting Settings */}
      {showAdvanced && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3.5 transition-all text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chế độ tự động ngắt Slide (PowerPoint)
            </label>
            <select
              value={data.chunkMode}
              onChange={(e) =>
                onChange({
                  chunkMode: e.target.value as 'charLimit' | 'paragraph' | 'heading',
                })
              }
              className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 text-xs focus:outline-hidden focus:border-indigo-500"
            >
              <option value="charLimit">Tự động theo số ký tự (~{data.maxCharsPerSlide} ký tự)</option>
              <option value="paragraph">Mỗi đoạn văn bản là một slide</option>
              <option value="heading">Ngắt trang theo dòng bắt đầu bằng # (Tiêu đề)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Giới hạn ký tự mỗi slide ({data.maxCharsPerSlide} ký tự)
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={data.maxCharsPerSlide}
              onChange={(e) => onChange({ maxCharsPerSlide: Number(e.target.value) })}
              className="w-full accent-indigo-600 mt-2 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* AI Beautify Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-indigo-950">
              Nhận diện Markdown & Tự Động Định Dạng Thông Minh
            </h3>
            <p className="text-[11px] text-indigo-700/80">
              Tự động làm sạch các dấu sao (*), phân cấp đề mục, đóng hộp trích dẫn và dựng bảng biểu đẹp mắt
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAiBeautify}
          disabled={isAiLoading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {isAiLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang cấu trúc lại...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>✨ Làm Đẹp & Xử Lý Dấu Sao</span>
            </>
          )}
        </button>
      </div>

      {aiSuccessMsg && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{aiSuccessMsg}</span>
        </div>
      )}

      {/* Main Text Area & Quick Formatting Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">
            Nội dung văn bản (Hỗ trợ # đề mục, **đậm**, *nghiêng*, &gt; trích dẫn, bảng biểu |)
          </label>

          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-rose-500 hover:text-rose-700 font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Xóa trắng nội dung"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa trắng</span>
          </button>
        </div>

        {/* Quick Markdown Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5 p-2 bg-slate-100/90 border border-slate-200 rounded-t-xl text-xs">
          <button
            type="button"
            onClick={() => insertText('# Tiêu Đề Chương 1')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Thêm Đề mục Lớn (#)"
          >
            <Heading1 className="w-3 h-3" />
            <span>H1</span>
          </button>
          <button
            type="button"
            onClick={() => insertText('## 1.1 Tiểu Mục Chi Tiết')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Thêm Tiểu mục (##)"
          >
            <Heading2 className="w-3 h-3" />
            <span>H2</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => insertText('> 💡 **Lưu ý cốt lõi:** Nội dung cần ghi nhớ đặc biệt.')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
            title="Thêm Khối Callout Trích dẫn"
          >
            <Quote className="w-3 h-3 text-amber-500" />
            <span>Hộp Callout</span>
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                '| Tiêu Chí | Nội Dung | Đánh Giá |\n| :--- | :--- | :---: |\n| Tốc độ | Cực nhanh | 9.8/10 |\n| Định dạng | Chuẩn xuất bản | 10/10 |'
              )
            }
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            title="Thêm Bảng Markdown"
          >
            <Table className="w-3 h-3 text-blue-500" />
            <span>Bảng biểu</span>
          </button>
          <button
            type="button"
            onClick={() => insertText('- Ý thứ nhất\n- Ý thứ hai\n- Ý thứ ba')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
            title="Thêm Danh sách Gạch đầu dòng"
          >
            <ListPlus className="w-3 h-3 text-emerald-500" />
            <span>Danh sách</span>
          </button>
          <button
            type="button"
            onClick={() => insertText('**Nội dung in đậm**')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            title="In đậm từ khóa"
          >
            <Bold className="w-3 h-3" />
            <span>Đậm</span>
          </button>
          <button
            type="button"
            onClick={() => insertText('*Nội dung in nghiêng*')}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded italic text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            title="In nghiêng"
          >
            <Italic className="w-3 h-3" />
            <span>Nghiêng</span>
          </button>
          <span className="text-slate-300">|</span>
          {/* AI Image Placeholder Tool */}
          <button
            type="button"
            onClick={() => setShowAiImageModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer hover:opacity-95"
            title="Chèn placeholder hình ảnh từ nguồn AI (![Image](prompt:...))"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🤖 Chèn Ảnh AI (prompt:...)</span>
          </button>
          <button
            type="button"
            onClick={() => insertText('---\n')}
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Đường phân cách"
          >
            ───
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Dán văn bản thô hoặc Markdown vào đây. Nhấn '✨ Làm Đẹp & Xử Lý Dấu Sao' để hệ thống tự động nhận diện và biến hóa thành tài liệu chuẩn chỉnh..."
          rows={11}
          className="w-full p-3.5 border-x border-b border-slate-200 rounded-b-xl text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-y font-mono bg-white"
        />

        {/* Bottom status bar in textarea */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-x border-b border-slate-200 rounded-b-xl -mt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-slate-700">{lineCount}</strong> dòng
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-700">{wordCount}</strong> từ
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-700">{data.content.length}</strong> ký tự
            </span>
          </div>
          <span className="text-slate-400 italic">Được tối ưu cho Word, PowerPoint, PDF & Excel</span>
        </div>
      </div>

      {/* AI Image Placeholder Insert Modal */}
      {showAiImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Chèn Placeholder Hình Ảnh AI
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cú pháp chuẩn: <code className="bg-slate-100 text-purple-700 px-1 py-0.5 rounded font-mono">![Mô tả](prompt:...)</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiImageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu đề / Chú thích ảnh (Alt text):
              </label>
              <input
                type="text"
                value={customAlt}
                onChange={(e) => setCustomAlt(e.target.value)}
                placeholder="Ví dụ: Hình ảnh minh họa vương quốc"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Câu lệnh mô tả hình ảnh muốn AI tạo (Prompt):
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Lâu đài ánh sao kỳ ảo lấp lánh dưới trăng lưỡi liềm vàng rực rỡ..."
                rows={3}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {/* Quick Presets Carousel */}
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Hoặc chọn mẫu prompt gợi ý theo phong cách:
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {QUICK_AI_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomAlt(p.title);
                      setCustomPrompt(p.prompt);
                    }}
                    className="w-full text-left p-2 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/60 transition-all flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 group-hover:text-purple-700 block">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[320px] block">
                        {p.prompt}
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-semibold px-2 py-0.5 rounded bg-purple-100/60 shrink-0">
                      Chọn
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiImageModal(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!customPrompt.trim()}
                onClick={() => {
                  const alt = customAlt.trim() || 'Minh họa AI';
                  const prompt = customPrompt.trim();
                  insertText(`![${alt}](prompt:${prompt})`);
                  setShowAiImageModal(false);
                  setCustomPrompt('');
                  setCustomAlt('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm cursor-pointer disabled:opacity-50"
              >
                ✦ Chèn Thẻ Vào Văn Bản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
