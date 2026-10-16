import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
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
  const [filterCategory, setFilterCategory] = useState<'all' | 'classic' | 'modern' | 'creative'>('all');

  const allThemes = Object.values(THEMES);
  const filteredThemes =
    filterCategory === 'all'
      ? allThemes
      : allThemes.filter((t) => t.category === filterCategory);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100 gap-2.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Bộ 10 Chủ Đề Thiết Kế Thẩm Mỹ</h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {allThemes.length} phong cách
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({allThemes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('classic')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'classic'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cổ điển & Quý phái
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('modern')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'modern'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hiện đại & Viễn tưởng
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('creative')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filterCategory === 'creative'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sáng tạo & Biển khơi
          </button>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {filteredThemes.map((theme) => {
          const isSelected = theme.id === selectedThemeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-xs ring-2 ring-indigo-500/15'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Selected check badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Title & icon */}
                <div className="flex items-center gap-2 mb-1 pr-6">
                  <span className="text-xl leading-none">{theme.icon}</span>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block leading-tight">
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {theme.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 my-2.5">
                  {theme.styleDescription}
                </p>
              </div>

              {/* Color dots & Preview bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: `#${theme.bgHex}` }}
                    title={`Màu nền: #${theme.bgHex}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: `#${theme.primaryHex}` }}
                    title={`Màu nhấn chính: #${theme.primaryHex}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: `#${theme.accentHex}` }}
                    title={`Màu phụ: #${theme.accentHex}`}
                  />
                </div>

                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: `#${theme.primaryHex}15`,
                    color: `#${theme.primaryHex}`,
                  }}
                >
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
