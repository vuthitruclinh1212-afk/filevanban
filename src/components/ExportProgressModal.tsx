import React, { useEffect, useState } from 'react';
import {
  FileText,
  Presentation,
  FileSpreadsheet,
  FileCheck,
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Palette,
} from 'lucide-react';
import { DocumentTheme, ExportFormat } from '../types';

interface ExportProgressModalProps {
  isOpen: boolean;
  format: ExportFormat;
  theme: DocumentTheme;
  customStatus?: string | null;
}

interface ExportStage {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  format,
  theme,
  customStatus,
}) => {
  const [progress, setProgress] = useState(15);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const stages: ExportStage[] = [
    {
      id: 1,
      label: 'Chuẩn hóa cú pháp Markdown & Tầng bậc',
      sublabel: 'Phân tích tiêu đề H1-H6, làm sạch dấu sao và khử ký tự thừa',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 2,
      label: 'Quét & Xử lý hình ảnh AI (prompt:...)',
      sublabel: 'Tự động tạo hình ảnh từ câu lệnh prompt và chuẩn bị nhúng vào tệp',
      icon: <Palette className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 3,
      label: `Dựng bố cục trang bìa độc quyền (${theme.name})`,
      sublabel: 'Áp dụng hình ảnh minh họa chủ đề và cấu trúc trang bìa riêng biệt',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 4,
      label: 'Đóng gói & Kết xuất tệp tin tương thích cao',
      sublabel: 'Nén dữ liệu nhị phân, kiểm định bảng tương phản và tải xuống máy',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
  ];

  // Timer & stage progression effect
  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setCurrentStageIndex(0);
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 0.1);
    }, 100);

    const pTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) return prev + 3;
        if (prev < 70) return prev + 2;
        if (prev < 92) return prev + 1;
        return prev;
      });
    }, 120);

    const sTimer1 = setTimeout(() => setCurrentStageIndex(1), 700);
    const sTimer2 = setTimeout(() => setCurrentStageIndex(2), 1600);
    const sTimer3 = setTimeout(() => setCurrentStageIndex(3), 2600);

    return () => {
      clearInterval(timer);
      clearInterval(pTimer);
      clearTimeout(sTimer1);
      clearTimeout(sTimer2);
      clearTimeout(sTimer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Format details
  const getFormatInfo = () => {
    switch (format) {
      case 'docx':
        return {
          name: 'Microsoft Word (.docx)',
          color: '#2563EB',
          bgBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <FileText className="w-6 h-6 text-blue-400" />,
        };
      case 'pptx':
        return {
          name: 'PowerPoint (.pptx)',
          color: '#D97706',
          bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Presentation className="w-6 h-6 text-amber-400" />,
        };
      case 'pdf':
        return {
          name: 'Tài Liệu PDF (.pdf)',
          color: '#E11D48',
          bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <FileCheck className="w-6 h-6 text-rose-400" />,
        };
      case 'xlsx':
        return {
          name: 'Bảng Tính Excel (.xlsx)',
          color: '#059669',
          bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
        };
      case 'zip':
      default:
        return {
          name: 'Trọn Bộ 4 File (.zip)',
          color: '#7C3AED',
          bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: <Package className="w-6 h-6 text-purple-400" />,
        };
    }
  };

  const fmt = getFormatInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Ambient Top Glow in Theme Color */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-3xl opacity-35 pointer-events-none"
          style={{ backgroundColor: fmt.color }}
        />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-inner">
              {fmt.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Đang tiến hành xuất file
                </h3>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${fmt.bgBadge}`}>
                  {format.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chủ đề: <strong style={{ color: `#${theme.primaryHex}` }}>{theme.name}</strong> • Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
            <span>{elapsedSeconds.toFixed(1)}s</span>
          </div>
        </div>

        {/* Shimmering Animated Progress Bar */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300">Tiến trình xử lý tự động:</span>
            <span className="font-mono font-bold text-sm" style={{ color: fmt.color }}>
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80 relative">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{
                width: `${Math.min(100, progress)}%`,
                backgroundColor: fmt.color,
                boxShadow: `0 0 15px ${fmt.color}80`,
              }}
            >
              {/* Shimmer line animation */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Multi-Stage Step Progress Indicators */}
        <div className="space-y-3 relative z-10 my-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`flex items-start gap-3 transition-all duration-300 ${
                  isCurrent ? 'opacity-100 scale-[1.01]' : isCompleted ? 'opacity-70' : 'opacity-40'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center animate-spin border-2 border-indigo-400 border-t-transparent" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500 font-mono">
                      {stage.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold leading-tight ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-semibold animate-pulse">
                        Đang thực hiện...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {stage.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Status Message */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate italic">
            {customStatus || 'Đang chuẩn bị gói dữ liệu xuất bản...'}
          </span>
          <span className="shrink-0 text-[11px] text-slate-500">
            Tự động tải xuống khi hoàn tất
          </span>
        </div>
      </div>
    </div>
  );
};
