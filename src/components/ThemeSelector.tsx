import React from 'react';
import { Palette, Check } from 'lucide-react';
import { DocumentTheme } from '../types';
import { THEMES } from '../data/themes';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeId,
  onSelectTheme,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Chủ đề thiết kế (Theme)</h2>
        </div>
        <span className="text-xs text-slate-400">Tự động đồng bộ màu & font chữ</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.values(THEMES).map((theme) => {
          const isSelected = theme.id === selectedThemeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-xs ring-2 ring-indigo-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Selected check badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Title & icon */}
              <div className="flex items-center gap-2 mb-1.5 pr-6">
                <span className="text-lg leading-none">{theme.icon}</span>
                <span className="font-bold text-sm text-slate-900">{theme.name}</span>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                {theme.styleDescription}
              </p>

              {/* Color dots & Preview bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: `#${theme.bgHex}` }}
                    title={`Màu nền: #${theme.bgHex}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: `#${theme.primaryHex}` }}
                    title={`Màu nhấn chính: #${theme.primaryHex}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: `#${theme.accentHex}` }}
                    title={`Màu phụ: #${theme.accentHex}`}
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  #{theme.primaryHex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
