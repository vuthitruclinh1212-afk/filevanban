import React from 'react';
import { DocumentData, DocumentTheme } from '../types';
import { THEME_COVER_LAYOUTS, getThemeSvgArtwork } from '../data/themeArtwork';

interface DocumentCoverViewProps {
  data: DocumentData;
  theme: DocumentTheme;
  mode?: 'preview' | 'pdf' | 'slide';
}

export const DocumentCoverView: React.FC<DocumentCoverViewProps> = ({
  data,
  theme,
  mode = 'preview',
}) => {
  const layoutMeta = THEME_COVER_LAYOUTS[theme.id] || THEME_COVER_LAYOUTS.fairytale;
  const svgArtwork = getThemeSvgArtwork(theme.id);

  // Common metadata values
  const authorText = data.author || 'Chưa đặt tác giả';
  const orgText = data.organization || 'Hệ thống Quản trị Tài liệu';
  const dateText = data.date || new Date().toLocaleDateString('vi-VN');
  const titleText = data.title || 'Tiêu Đề Tài Liệu';
  const subtitleText = data.subtitle;

  // Render SVG illustration element
  const renderArtwork = (className = 'w-full h-auto rounded-xl shadow-lg') => (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgArtwork }}
    />
  );

  // 1. FAIRY TALES: Starlight Portal & Floating Golden Parchment
  if (theme.id === 'fairytale') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.slideTextHex}`,
        }}
      >
        {/* Celestial Starfield Background Overlay */}
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Badge & Motif */}
        <div className="relative z-10 flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: `#${theme.primaryHex}40` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{theme.cover.icons}</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `#${theme.primaryHex}` }}>
              {theme.cover.badge}
            </span>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300">
            {layoutMeta.subBadge}
          </span>
        </div>

        {/* Asymmetrical Layout: Left Starlight Arch Image, Right Golden Floating Card */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[280px] p-2 rounded-2xl border-2 border-amber-400/60 shadow-2xl bg-slate-900/60 backdrop-blur-xs">
              {renderArtwork('w-full h-auto rounded-xl overflow-hidden')}
              <div className="text-center pt-2 text-[11px] italic text-amber-200">
                ✦ Vương Quốc Thần Tiên &amp; Bụi Sao Vĩnh Cửu ✦
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col text-left">
            <div className="inline-block px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-400/30 bg-amber-400/10 text-amber-300 w-fit">
              {theme.cover.motif}
            </div>

            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`} style={{ color: `#${theme.primaryHex}` }}>
              {titleText}
            </h1>

            {subtitleText && (
              <p className="text-sm sm:text-base italic mb-4 font-medium" style={{ color: `#${theme.slideAccentHex}` }}>
                {subtitleText}
              </p>
            )}

            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-xl border border-dashed mb-5 bg-slate-900/40" style={{ borderColor: `#${theme.primaryHex}40`, color: `#${theme.slideTextHex}` }}>
                “{theme.cover.quote}”
              </p>
            )}

            {/* Metadata Slate Card */}
            <div className="grid grid-cols-2 gap-3 text-xs border rounded-xl p-3.5 bg-slate-900/60" style={{ borderColor: `#${theme.primaryHex}30` }}>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tác giả biên soạn:</span>
                <span className="font-bold text-slate-100">{authorText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Đơn vị thực hiện:</span>
                <span className="text-slate-200">{orgText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Ngày phát hành:</span>
                <span className="text-slate-200">{dateText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Ấn bản phong cách:</span>
                <span className="font-bold text-amber-400">{theme.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Astrological Border */}
        <div className="relative z-10 pt-4 border-t flex items-center justify-between text-[11px] text-amber-300/70" style={{ borderColor: `#${theme.primaryHex}30` }}>
          <span>★ THE FAIRY TALES EDITION • VƯƠNG TRIỀU KỲ ẢO ★</span>
          <span>Bắt đầu nội dung tại trang kế tiếp</span>
        </div>
      </div>
    );
  }

  // 2. CỔ PHONG: Oriental Hanging Scroll & Cinnabar Seal Stamp
  if (theme.id === 'cophong') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.paperTextHex}`,
        }}
      >
        {/* Top Hanging Scroll Bar */}
        <div className="w-full flex items-center justify-between border-b-2 pb-3 mb-6" style={{ borderColor: `#${theme.primaryHex}` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎋</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `#${theme.primaryHex}` }}>
              {theme.cover.badge}
            </span>
          </div>
          <div className="px-3 py-1 bg-red-800 text-amber-50 text-[11px] font-bold rounded-sm shadow-xs">
            {layoutMeta.subBadge}
          </div>
        </div>

        {/* Center Section: Traditional Landscape Artwork & Title */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold tracking-widest text-amber-900 mb-1">
              ❖ {theme.cover.motif} ❖
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`} style={{ color: `#${theme.primaryHex}` }}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium" style={{ color: `#${theme.paperAccentHex}` }}>
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-lg border border-dashed mb-5 bg-amber-50/60" style={{ borderColor: `#${theme.primaryHex}40`, color: `#${theme.paperTextHex}` }}>
                “{theme.cover.quote}”
              </p>
            )}

            {/* Classical Chinese/Vietnamese Rice Paper Details */}
            <div className="border-t border-b py-3 my-2 space-y-1.5 text-xs text-stone-800" style={{ borderColor: `#${theme.primaryHex}30` }}>
              <div className="flex justify-between">
                <span className="font-bold text-stone-600">Thủ bút biên soạn:</span>
                <span className="font-semibold text-stone-900">{authorText}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-600">Trà quán / Viện quán:</span>
                <span>{orgText}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-600">Thời khắc chấp bút:</span>
                <span>{dateText}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center">
            <div className="p-2 bg-stone-100 rounded-lg border-2 shadow-xl" style={{ borderColor: `#${theme.primaryHex}` }}>
              {renderArtwork('w-full h-auto rounded-md overflow-hidden')}
            </div>
            {/* Red Cinnabar Seal Stamps */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-12 bg-red-800 text-amber-50 rounded-md border-2 border-amber-100 flex items-center justify-center font-bold text-xs shadow-md">
                墨寶
              </div>
              <div className="w-12 h-12 bg-red-800 text-amber-50 rounded-sm border-2 border-amber-100 flex items-center justify-center font-bold text-[10px] text-center leading-tight shadow-md">
                宣紙<br />典藏
              </div>
              <span className="text-xs italic text-stone-600">Dấu Triện Cổ Phong</span>
            </div>
          </div>
        </div>

        {/* Footer Ribbon */}
        <div className="pt-3 border-t-2 flex items-center justify-between text-xs font-serif" style={{ borderColor: `#${theme.primaryHex}` }}>
          <span>【 ĐIỂN TỊCH CỔ PHONG • PHƯƠNG ĐÔNG NGUYÊN BẢN 】</span>
          <span>Nét mực lưu truyền muôn đời sau</span>
        </div>
      </div>
    );
  }

  // 3. KẸO NGỌT (Candy): Sweet Macaron Pastel Bento & Diagonal Banner
  if (theme.id === 'candy') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-3xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.borderHex}`,
          color: `#${theme.paperTextHex}`,
        }}
      >
        {/* Playful Floating Candy Bubbles */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
            <span className="text-xl">🍬</span>
            <span className="text-xs font-bold text-rose-600 tracking-wide">
              {theme.cover.badge}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold shadow-2xs">
            🧁 Sweet Pastel
          </span>
        </div>

        {/* Center Bento Layout */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="p-3 bg-white rounded-3xl border-2 border-rose-300 shadow-xl relative">
              {renderArtwork('w-full h-auto rounded-2xl overflow-hidden')}
              <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-md">
                100% Sweet Joy 🍓
              </div>
            </div>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider text-rose-500 mb-1">
              ★ {theme.cover.motif} ★
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`} style={{ color: `#${theme.primaryHex}` }}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium" style={{ color: `#${theme.paperAccentHex}` }}>
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-2xl border border-dashed mb-5 bg-white/70" style={{ borderColor: `#${theme.primaryHex}40`, color: `#${theme.paperAccentHex}` }}>
                “{theme.cover.quote}”
              </p>
            )}

            {/* Cute Pastel Pill Tiles */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-rose-200 shadow-2xs">
                <span className="text-[10px] text-rose-400 font-bold block uppercase">Tác giả:</span>
                <span className="font-bold text-slate-800">{authorText}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-purple-200 shadow-2xs">
                <span className="text-[10px] text-purple-400 font-bold block uppercase">Đơn vị:</span>
                <span className="text-slate-800">{orgText}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-500 font-bold block uppercase">Ngày tạo:</span>
                <span className="text-slate-800">{dateText}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-amber-500 font-bold block uppercase">Bộ chủ đề:</span>
                <span className="font-bold text-rose-600">{theme.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-rose-200 flex items-center justify-between text-xs text-rose-500">
          <span>🍭 SWEET CANDY EDITION • NIỀM VUI SÁNG TẠO</span>
          <span>Lan tỏa năng lượng tích cực</span>
        </div>
      </div>
    );
  }

  // 4. BẮC ÂU TỐI GIẢN (Minimal): 60/40 Architectural Split Frame
  if (theme.id === 'minimal') {
    return (
      <div className="w-full relative overflow-hidden rounded-xl border border-slate-300 min-h-[580px] flex flex-col md:flex-row bg-white shadow-xl">
        {/* Left 40% Monochrome Slate Column */}
        <div className="md:w-5/12 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-blue-400 mb-4">
              // ARCHITECTURE • SCANDINAVIAN
            </div>
            <div className="w-12 h-1 bg-blue-500 mb-6" />
            <h2 className="text-xl font-bold tracking-tight mb-2">
              NORDIC<br />EXECUTIVE
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tối giản, khúc chiết, chuẩn mực xuất bản quốc tế. Thiết kế đề cao công năng và tính trật tự.
            </p>
          </div>

          <div className="my-4 p-2 bg-slate-800 rounded-lg border border-slate-700">
            {renderArtwork('w-full h-auto rounded-md overflow-hidden')}
          </div>

          <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-3">
            VER. 2026.04 // ISO STANDARD
          </div>
        </div>

        {/* Right 60% Pure White Clean Typography */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-between text-left">
          <div className="flex items-center justify-between border-b pb-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {layoutMeta.tagline}
            </span>
            <span className="text-xs font-bold text-blue-600">CHƯƠNG 01</span>
          </div>

          <div className="my-auto">
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 ${theme.fontClassTitle}`}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="text-sm sm:text-base text-slate-600 font-medium mb-4 italic">
                {subtitleText}
              </p>
            )}
            <div className="w-20 h-0.5 bg-blue-600 mb-6" />

            {theme.cover.quote && (
              <p className="text-xs italic text-slate-600 border-l-2 border-slate-900 pl-3 mb-6">
                “{theme.cover.quote}”
              </p>
            )}

            {/* Swiss Metadata Grid */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs divide-y divide-slate-100 bg-slate-50">
              <div className="flex px-3 py-2">
                <span className="w-32 font-bold text-slate-500">Tác giả:</span>
                <span className="font-semibold text-slate-900">{authorText}</span>
              </div>
              <div className="flex px-3 py-2">
                <span className="w-32 font-bold text-slate-500">Đơn vị:</span>
                <span className="text-slate-800">{orgText}</span>
              </div>
              <div className="flex px-3 py-2">
                <span className="w-32 font-bold text-slate-500">Ngày xuất bản:</span>
                <span className="text-slate-800">{dateText}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>HELSINKI DESIGN PRINCIPLES</span>
            <span>Trang 01 / Tập văn bản</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. RỪNG NGỌC LỤC BẢO (Emerald): Neoclassical Conservatory Arch & Golden Laurel
  if (theme.id === 'emerald') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.slideTextHex}`,
        }}
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-emerald-950/80 text-amber-300 text-xs font-bold tracking-widest shadow-lg">
            🌿 {theme.cover.badge} 🌿
          </div>
        </div>

        {/* Grand Conservatory Centerpiece */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="p-3 rounded-2xl border-2 border-emerald-400/50 shadow-2xl bg-emerald-950/70">
              {renderArtwork('w-full h-auto rounded-xl overflow-hidden')}
              <div className="text-center pt-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Imperium Botanic Conservatory
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              👑 {theme.cover.motif}
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`} style={{ color: `#${theme.slideAccentHex}` }}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium text-emerald-200">
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-xl border border-dashed mb-5 bg-emerald-950/60 border-amber-400/40 text-emerald-100">
                “{theme.cover.quote}”
              </p>
            )}

            {/* Regal Metadata Card */}
            <div className="border border-emerald-500/40 rounded-xl p-3.5 bg-emerald-950/80 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-emerald-400 uppercase font-semibold">Tác giả:</span>
                <span className="font-bold text-white">{authorText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-emerald-400 uppercase font-semibold">Đơn vị:</span>
                <span className="text-emerald-100">{orgText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-emerald-400 uppercase font-semibold">Ngày phát hành:</span>
                <span className="text-emerald-100">{dateText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-emerald-400 uppercase font-semibold">Chủ đề:</span>
                <span className="font-bold text-amber-300">{theme.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300/80">
          <span>🌿 ROYAL EMERALD FOREST • DI SẢN BẢO TỒN HOÀNG GIA</span>
          <span>Trang 01 / Bản lưu trữ</span>
        </div>
      </div>
    );
  }

  // 6. SAKURA KYOTO: Zen Ensō Moon & Asymmetrical Torii Gate
  if (theme.id === 'sakura') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.paperTextHex}`,
        }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-6" style={{ borderColor: `#${theme.primaryHex}40` }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
              {theme.cover.badge}
            </span>
          </div>
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
            京都雅韻 • Wabi-Sabi
          </span>
        </div>

        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold tracking-widest text-rose-700 mb-1">
              ⛩️ {theme.cover.motif}
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${theme.fontClassTitle}`} style={{ color: `#${theme.primaryHex}` }}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium" style={{ color: `#${theme.paperAccentHex}` }}>
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-lg border border-dashed mb-5 bg-rose-50/70" style={{ borderColor: `#${theme.primaryHex}30`, color: `#${theme.paperAccentHex}` }}>
                “{theme.cover.quote}”
              </p>
            )}

            {/* Zen Metadata Table */}
            <div className="border rounded-xl p-3.5 bg-white/80 shadow-2xs text-xs divide-y divide-rose-100" style={{ borderColor: `#${theme.primaryHex}30` }}>
              <div className="flex justify-between py-1.5">
                <span className="font-bold text-stone-500">Tác giả biên soạn:</span>
                <span className="font-semibold text-stone-900">{authorText}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-bold text-stone-500">Viện nghiên cứu:</span>
                <span className="text-stone-800">{orgText}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-bold text-stone-500">Thời điểm ấn hành:</span>
                <span className="text-stone-800">{dateText}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center">
            <div className="p-3 bg-white rounded-2xl border-2 shadow-xl" style={{ borderColor: `#${theme.primaryHex}` }}>
              {renderArtwork('w-full h-auto rounded-xl overflow-hidden')}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-rose-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                京都
              </div>
              <span className="text-xs italic text-stone-600">Ấn Chương Hoa Anh Đào Phù Tang</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t flex items-center justify-between text-xs text-rose-800" style={{ borderColor: `#${theme.primaryHex}40` }}>
          <span>🌸 SAKURA KYOTO HERITAGE • TĨNH LẶNG VÀ THANH KHIẾT</span>
          <span>Khởi đầu trang nội dung</span>
        </div>
      </div>
    );
  }

  // 7. CYBERPUNK 2077: HUD Telemetry Cockpit & Cyber Grid
  if (theme.id === 'cyberpunk') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px] font-mono"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.slideTextHex}`,
        }}
      >
        {/* Hologram HUD Top Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-6" style={{ borderColor: `#${theme.primaryHex}` }}>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 animate-pulse">⚡</span>
            <span className="text-xs font-bold text-cyan-400">
              [ SYSTEM_PROTOCOL // 2077_CYBER_EDITION ]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/50 rounded-xs text-[10px] font-bold">
              SYS_ID: #X7
            </span>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-xs text-[10px] font-bold">
              STATUS: ONLINE
            </span>
          </div>
        </div>

        {/* Center Cyber Interface */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="p-2 bg-slate-900 rounded-lg border-2 border-cyan-400 shadow-2xl relative">
              {renderArtwork('w-full h-auto rounded-xs overflow-hidden')}
              <div className="absolute top-3 left-3 text-[10px] font-bold px-1.5 bg-cyan-400 text-slate-950">
                LIVE_HUD
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold text-rose-500 mb-1">
              &gt; {theme.cover.motif}
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-cyan-400 ${theme.fontClassTitle}`}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium text-rose-300">
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs p-3 rounded-xs border-l-4 border-cyan-400 bg-slate-900/80 mb-5 text-slate-300">
                “{theme.cover.quote}”
              </p>
            )}

            {/* Monospace Telemetry Grid */}
            <div className="border border-cyan-500/40 rounded-xs p-3 bg-slate-950/80 text-xs space-y-1.5">
              <div className="flex justify-between text-cyan-300">
                <span className="text-slate-500">OPERATOR:</span>
                <span className="font-bold">{authorText}</span>
              </div>
              <div className="flex justify-between text-cyan-300">
                <span className="text-slate-500">ORG_NODE:</span>
                <span>{orgText}</span>
              </div>
              <div className="flex justify-between text-cyan-300">
                <span className="text-slate-500">TIMESTAMP:</span>
                <span>{dateText}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-cyan-500/40 flex items-center justify-between text-[11px] text-cyan-400">
          <span>[ MATRIX_CIPHER // OBSIDIAN NEON ENGINE ]</span>
          <span>PAGE 01 / TELEMETRY</span>
        </div>
      </div>
    );
  }

  // 8. BÁO CHÍ & SÁCH CŨ (Vintage): 19th Century Broadsheet Newspaper
  if (theme.id === 'vintage') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-xl p-6 sm:p-10 flex flex-col justify-between border-4 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.paperTextHex}`,
        }}
      >
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-double pb-3 mb-4 text-center" style={{ borderColor: `#${theme.primaryHex}` }}>
          <div className="flex justify-between text-[10px] text-stone-600 uppercase font-serif mb-1">
            <span>SỐ ĐẶC BIỆT THẾ KỶ 19</span>
            <span>ẤN BẢN ĐỘC QUYỀN</span>
            <span>GIÁ TRỊ VĂN HÓA VĨNH CỬU</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-widest font-serif" style={{ color: `#${theme.primaryHex}` }}>
            THE 19TH CENTURY GAZETTE
          </h2>
          <div className="flex items-center justify-between text-xs italic text-stone-700 border-t border-b py-1 mt-1 font-serif" style={{ borderColor: `#${theme.primaryHex}60` }}>
            <span>Phát hành: {dateText}</span>
            <span>Chuyên đề: Văn học, Triết học &amp; Cà phê</span>
            <span>Thư viện Cổ Đô</span>
          </div>
        </div>

        {/* Center Editorial Broadsheet */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <div className="p-2 bg-stone-200 border-2 shadow-lg" style={{ borderColor: `#${theme.primaryHex}` }}>
              {renderArtwork('w-full h-auto rounded-xs overflow-hidden')}
              <div className="text-center pt-1.5 text-[10px] font-serif italic text-stone-700">
                Bản khắc gỗ cổ điển • Thế kỷ 19
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col text-left font-serif">
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight ${theme.fontClassTitle}`} style={{ color: `#${theme.primaryHex}` }}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-3 font-semibold text-amber-900">
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 border-l-2 bg-amber-50/60 mb-4" style={{ borderColor: `#${theme.primaryHex}` }}>
                “{theme.cover.quote}”
              </p>
            )}

            {/* Newspaper Byline Box */}
            <div className="border p-3 text-xs space-y-1 bg-stone-50" style={{ borderColor: `#${theme.primaryHex}40` }}>
              <div><strong>Ký giả / Tác giả:</strong> {authorText}</div>
              <div><strong>Tòa soạn / Đơn vị:</strong> {orgText}</div>
              <div><strong>Lưu trữ tại:</strong> Thư viện Quốc Gia Cổ Điển</div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t-2 border-stone-400 flex items-center justify-between text-[11px] font-serif text-stone-600">
          <span>EX LIBRIS • GÓC THƯ VIỆN &amp; CÀ PHÊ CỔ ĐIỂN</span>
          <span>Trang 01 / Đại bản</span>
        </div>
      </div>
    );
  }

  // 9. ĐẠI DƯƠNG & SAN HÔ (Ocean): Deep Sea Bathymetric & Coral Panorama
  if (theme.id === 'ocean') {
    return (
      <div
        className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-2 min-h-[580px]"
        style={{
          backgroundColor: `#${theme.bgHex}`,
          borderColor: `#${theme.primaryHex}`,
          color: `#${theme.slideTextHex}`,
        }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-6" style={{ borderColor: `#${theme.primaryHex}40` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              {theme.cover.badge}
            </span>
          </div>
          <span className="px-3 py-1 bg-sky-950 border border-sky-400/40 text-sky-300 rounded-full text-xs font-mono font-bold">
            DEPTH: -11,034M
          </span>
        </div>

        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="p-3 bg-sky-950/80 rounded-2xl border-2 border-sky-400 shadow-2xl">
              {renderArtwork('w-full h-auto rounded-xl overflow-hidden')}
              <div className="text-center pt-2 text-[10px] text-sky-300 font-bold uppercase">
                Bioluminescent Mariana Trench
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold tracking-widest text-rose-400 mb-1">
              🧭 {theme.cover.motif}
            </span>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-sky-400 ${theme.fontClassTitle}`}>
              {titleText}
            </h1>
            {subtitleText && (
              <p className="italic text-sm sm:text-base mb-4 font-medium text-rose-300">
                {subtitleText}
              </p>
            )}
            {theme.cover.quote && (
              <p className="text-xs italic p-3 rounded-xl border border-dashed mb-5 bg-sky-950/70 border-sky-400/40 text-sky-100">
                “{theme.cover.quote}”
              </p>
            )}

            <div className="border border-sky-400/40 rounded-xl p-3.5 bg-sky-950/80 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-sky-400 uppercase font-semibold">Thuyền trưởng / Tác giả:</span>
                <span className="font-bold text-white">{authorText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-sky-400 uppercase font-semibold">Tàu thám hiểm / Đơn vị:</span>
                <span className="text-sky-100">{orgText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-sky-400 uppercase font-semibold">Hải trình:</span>
                <span className="text-sky-100">{dateText}</span>
              </div>
              <div>
                <span className="block text-[10px] text-sky-400 uppercase font-semibold">Chủ đề:</span>
                <span className="font-bold text-rose-400">{theme.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-sky-400/30 flex items-center justify-between text-xs text-sky-300">
          <span>🌊 OCEANIC EXPEDITION • HẢI TRÌNH BIỂN SÂU</span>
          <span>Trang 01 / Bản đồ</span>
        </div>
      </div>
    );
  }

  // 10. HOÀNG GIA CHÂU ÂU (Baroque): Versailles Palace Medallion & Gilded Rococo
  return (
    <div
      className="w-full relative overflow-hidden rounded-2xl p-6 sm:p-10 flex flex-col justify-between border-4 min-h-[580px]"
      style={{
        backgroundColor: `#${theme.bgHex}`,
        borderColor: `#${theme.primaryHex}`,
        color: `#${theme.slideTextHex}`,
      }}
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-amber-400 bg-amber-950/80 text-amber-300 text-xs font-bold tracking-widest shadow-xl">
          👑 {theme.cover.badge} 👑
        </div>
      </div>

      <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="p-3 bg-amber-950/60 rounded-3xl border-2 border-amber-400 shadow-2xl">
            {renderArtwork('w-full h-auto rounded-2xl overflow-hidden')}
            <div className="text-center pt-2 text-[10px] font-serif font-bold text-amber-300">
              ⚜️ Le Grand Salon de Versailles ⚜️
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            🏛️ {theme.cover.motif}
          </span>
          <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-amber-400 ${theme.fontClassTitle}`}>
            {titleText}
          </h1>
          {subtitleText && (
            <p className="italic text-sm sm:text-base mb-4 font-medium text-amber-200">
              {subtitleText}
            </p>
          )}
          {theme.cover.quote && (
            <p className="text-xs italic p-3 rounded-xl border border-dashed mb-5 bg-amber-950/70 border-amber-400/40 text-amber-100">
              “{theme.cover.quote}”
            </p>
          )}

          <div className="border-2 border-amber-400/50 rounded-xl p-3.5 bg-amber-950/80 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[10px] text-amber-400 uppercase font-semibold">Tác giả vương triều:</span>
              <span className="font-bold text-white">{authorText}</span>
            </div>
            <div>
              <span className="block text-[10px] text-amber-400 uppercase font-semibold">Điện vụ / Đơn vị:</span>
              <span className="text-amber-100">{orgText}</span>
            </div>
            <div>
              <span className="block text-[10px] text-amber-400 uppercase font-semibold">Thời điểm sắc phong:</span>
              <span className="text-amber-100">{dateText}</span>
            </div>
            <div>
              <span className="block text-[10px] text-amber-400 uppercase font-semibold">Ấn bản nghệ thuật:</span>
              <span className="font-bold text-amber-300">{theme.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-amber-400/40 flex items-center justify-between text-xs text-amber-300">
        <span>⚜️ LE PALAIS ROYAL • ĐỈNH CAO CHUẨN MỰC HOÀNG GIA CHÂU ÂU</span>
        <span>Trang 01 / Sách danh giá</span>
      </div>
    </div>
  );
};
