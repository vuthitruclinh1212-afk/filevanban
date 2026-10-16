import React from 'react';
import {
  FileEdit,
  Type,
  User,
  Calendar,
  Layers,
  Sliders,
  Heading,
  ListPlus,
  Trash2,
} from 'lucide-react';
import { DocumentData } from '../types';

interface DocumentEditorProps {
  data: DocumentData;
  onChange: (updates: Partial<DocumentData>) => void;
  onClear: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  data,
  onChange,
  onClear,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const wordCount = data.content.trim() ? data.content.trim().split(/\s+/).length : 0;
  const lineCount = data.content ? data.content.split('\n').filter((l) => l.trim()).length : 0;

  const insertTextAtCursor = (prefix: string) => {
    onChange({
      content: data.content ? `${data.content}\n${prefix}` : prefix,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Thông tin & Nội dung tài liệu</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Thu gọn tùy chọn' : 'Tùy chọn nâng cao'}</span>
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

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3.5 transition-all text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chế độ tự động ngắt Slide (PPTX)
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

      {/* Main Text Area */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Nội dung văn bản (không giới hạn độ dài) <span className="text-rose-500">*</span>
          </label>

          {/* Quick Helper Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => insertTextAtCursor('# Tiêu Đề Mục Mới')}
              className="text-[11px] text-slate-600 hover:text-indigo-600 font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Thêm dòng tiêu đề mục"
            >
              <Heading className="w-3 h-3" />
              <span>+ Mục</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] text-rose-500 hover:text-rose-700 font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Xóa trắng nội dung"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={data.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Dán hoặc gõ văn bản của bạn vào đây (hỗ trợ truyện ngắn, thơ ca, ghi chép, kế hoạch, bài học, báo cáo...)"
            rows={9}
            className="w-full p-3.5 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-y font-normal bg-white"
          />

          {/* Bottom status bar in textarea */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-x border-b border-slate-200 rounded-b-xl -mt-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                <strong className="text-slate-700">{lineCount}</strong> đoạn
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
            <span className="text-slate-400 italic">Tự động đồng bộ sang 4 định dạng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
