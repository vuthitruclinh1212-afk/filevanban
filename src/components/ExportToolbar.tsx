import React, { useState } from 'react';
import {
  Download,
  FileText,
  Presentation,
  FileSpreadsheet,
  FileCheck,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentData, DocumentTheme, ExportFormat } from '../types';
import {
  exportWord,
  exportPowerPoint,
  exportExcel,
  exportPDF,
  exportAllFormats,
} from '../services/documentExport';

interface ExportToolbarProps {
  data: DocumentData;
  theme: DocumentTheme;
  pdfElementRef: React.RefObject<HTMLDivElement | null>;
  isExporting: boolean;
  setIsExporting: (exporting: boolean) => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  data,
  theme,
  pdfElementRef,
  isExporting,
  setIsExporting,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('docx');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  };

  const executeExport = async (formatToExport: ExportFormat) => {
    if (!data.content.trim()) {
      setErrorMessage('Vui lòng dán hoặc nhập nội dung văn bản trước khi xuất file!');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setIsExporting(true);
    setErrorMessage(null);

    try {
      switch (formatToExport) {
        case 'docx':
          setStatusMessage('Đang kết xuất Microsoft Word (.docx)...');
          await exportWord(data, theme);
          setStatusMessage('Đã tải xuống file Word thành công! 🎉');
          break;

        case 'pptx':
          setStatusMessage('Đang kết xuất PowerPoint (.pptx)...');
          await exportPowerPoint(data, theme);
          setStatusMessage('Đã tải xuống file PowerPoint thành công! 🎉');
          break;

        case 'pdf':
          setStatusMessage('Đang kết xuất tài liệu PDF (.pdf)...');
          await exportPDF(data, theme, pdfElementRef.current);
          setStatusMessage('Đã tải xuống file PDF thành công! 🎉');
          break;

        case 'xlsx':
          setStatusMessage('Đang kết xuất bảng tính Excel (.xlsx)...');
          await exportExcel(data, theme);
          setStatusMessage('Đã tải xuống file Excel thành công! 🎉');
          break;

        case 'zip':
          await exportAllFormats(data, theme, pdfElementRef.current, (msg) => {
            setStatusMessage(msg);
          });
          setStatusMessage('Đã xuất toàn bộ 4 định dạng vào file ZIP thành công! 🚀');
          break;
      }

      triggerConfetti();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Có lỗi xảy ra trong quá trình xuất file: ' + (err.message || 'Lỗi không xác định'));
      setTimeout(() => setErrorMessage(null), 6000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col gap-4">
      {/* Primary Generator Section (Matches original prompt form controls) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Định dạng & Tiến hành xuất file</h2>
        </div>
        <span className="text-xs text-slate-400">Xuất file trực tiếp trên trình duyệt</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <label htmlFor="formatSelect" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Định dạng xuất
          </label>
          <select
            id="formatSelect"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="docx">📄 Microsoft Word (.docx)</option>
            <option value="pptx">🖥️ PowerPoint (.pptx)</option>
            <option value="pdf">📑 Tài liệu PDF (.pdf)</option>
            <option value="xlsx">📊 Bảng tính Excel (.xlsx)</option>
            <option value="zip">📦 Trọn bộ 4 file (.zip)</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="button"
            id="btnGenerate"
            disabled={isExporting}
            onClick={() => executeExport(selectedFormat)}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: `#${theme.primaryHex}`,
            }}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý tài liệu...</span>
              </>
            ) : (
              <>
                <span>🚀 Tạo & Tải File Ngay</span>
                <span className="text-xs opacity-90 font-normal">
                  ({selectedFormat.toUpperCase()})
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick 1-Click format buttons */}
      <div className="pt-3 border-t border-slate-100">
        <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Hoặc tải nhanh trực tiếp:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Word Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => executeExport('docx')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.docx)</span>
          </button>

          {/* PPTX Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => executeExport('pptx')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-amber-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
            <span>PowerPoint (.pptx)</span>
          </button>

          {/* PDF Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => executeExport('pdf')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF (.pdf)</span>
          </button>

          {/* Excel Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => executeExport('xlsx')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Notifications / Toast */}
      {statusMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
