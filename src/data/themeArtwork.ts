/**
 * Theme Artwork & Cover Layout Engine
 * Provides dedicated, mastercrafted vector illustrations and layout architectures
 * for all 10 document themes.
 */

export interface ThemeCoverLayoutMeta {
  layoutId: string;
  layoutName: string;
  badgePosition: 'top' | 'floating' | 'banner' | 'corner' | 'monogram';
  imageStyle: 'arch' | 'circle' | 'split-hero' | 'floating-card' | 'stamp' | 'hud-frame' | 'broadsheet' | 'medallion' | 'full-bleed' | 'bento';
  aspectRatio: string;
  tagline: string;
  subBadge?: string;
  ornamentStyle: string;
}

export const THEME_COVER_LAYOUTS: Record<string, ThemeCoverLayoutMeta> = {
  fairytale: {
    layoutId: 'starlight-portal',
    layoutName: 'Cổng Bầu Trời & Vòm Tinh Tú Kỳ Ảo',
    badgePosition: 'floating',
    imageStyle: 'arch',
    aspectRatio: '16:9',
    tagline: '✦ BIÊN NIÊN SỬ VƯƠNG QUỐC HUYỀN THOẠI ✦',
    subBadge: 'Vương Triều Ánh Sao',
    ornamentStyle: 'stars',
  },
  cophong: {
    layoutId: 'eastern-scroll',
    layoutName: 'Trục Hoành Thư Pháp & Triện Son Giấy Dó',
    badgePosition: 'banner',
    imageStyle: 'stamp',
    aspectRatio: '16:9',
    tagline: '【 國 風 雅 韻 • ĐIỂN TỊCH CỔ PHONG 】',
    subBadge: '墨寶 • 宣紙典藏',
    ornamentStyle: 'bamboo',
  },
  candy: {
    layoutId: 'pastel-bento',
    layoutName: 'Bento Macaron & Dải Băng Ngọt Ngào',
    badgePosition: 'corner',
    imageStyle: 'bento',
    aspectRatio: '16:9',
    tagline: '🍭 SWEET PASTEL EDITION • TƯƠI TRẺ & SÁNG TẠO 🍭',
    subBadge: 'Macaron & Berries',
    ornamentStyle: 'candies',
  },
  minimal: {
    layoutId: 'nordic-split',
    layoutName: 'Khung Kiến Trúc 60/40 Thụy Điển Tối Giản',
    badgePosition: 'monogram',
    imageStyle: 'split-hero',
    aspectRatio: '16:9',
    tagline: '// NORDIC EXECUTIVE EDITION • CHUẨN MỰC QUỐC TẾ //',
    subBadge: 'Form Follows Function',
    ornamentStyle: 'lines',
  },
  emerald: {
    layoutId: 'royal-conservatory',
    layoutName: 'Vòm Kính Nhà Kính & Huy Hiệu Hoàng Gia',
    badgePosition: 'top',
    imageStyle: 'arch',
    aspectRatio: '16:9',
    tagline: '🌿 THE ROYAL EMERALD • BẢN LƯU NIỆM CAO CẤP 🌿',
    subBadge: 'Imperium Botanic',
    ornamentStyle: 'laurel',
  },
  sakura: {
    layoutId: 'zen-enso',
    layoutName: 'Vòng Tròn Thiền Ensō & Cổng Đền Torii',
    badgePosition: 'banner',
    imageStyle: 'circle',
    aspectRatio: '16:9',
    tagline: '🌸 KYOTO HERITAGE • TĨNH LẶNG & THANH THOÁT 🌸',
    subBadge: '京都雅韻 • 和敬清寂',
    ornamentStyle: 'petals',
  },
  cyberpunk: {
    layoutId: 'hud-terminal',
    layoutName: 'Bảng Điều Khiển HUD Viễn Tưởng 2077',
    badgePosition: 'corner',
    imageStyle: 'hud-frame',
    aspectRatio: '16:9',
    tagline: '[ SYSTEM_PROTOCOL // 2077_CYBER_EDITION // VER_4.0 ]',
    subBadge: 'NET_ID: #CYBER-X7',
    ornamentStyle: 'wireframe',
  },
  vintage: {
    layoutId: 'antique-broadsheet',
    layoutName: 'Manchette Báo Báo Chí Thế Kỷ 19 & Khắc Gỗ',
    badgePosition: 'top',
    imageStyle: 'broadsheet',
    aspectRatio: '16:9',
    tagline: '📜 EX LIBRIS • GÓC THƯ VIỆN & CÀ PHÊ CỔ ĐIỂN 📜',
    subBadge: 'The 19th Century Gazette',
    ornamentStyle: 'engraving',
  },
  ocean: {
    layoutId: 'oceanic-bathymetric',
    layoutName: 'Bình Đồ Độ Sâu Hải Dương & Rạn San Hô',
    badgePosition: 'floating',
    imageStyle: 'full-bleed',
    aspectRatio: '16:9',
    tagline: '🌊 OCEANIC EXPEDITION • BẢN ĐỒ THÁM HIỂM BIỂN SÂU 🌊',
    subBadge: 'Depth: -11,034m Mariana',
    ornamentStyle: 'waves',
  },
  baroque: {
    layoutId: 'versailles-palace',
    layoutName: 'Phù Điêu Khung Vàng Versailles & Nhung Đỏ',
    badgePosition: 'top',
    imageStyle: 'medallion',
    aspectRatio: '16:9',
    tagline: '🏛️ LE PALAIS ROYAL • HOÀNG GIA CHÂU ÂU 🏛️',
    subBadge: 'Versailles Grand Salon',
    ornamentStyle: 'filigree',
  },
};

/**
 * Returns raw standalone SVG string for each theme's cover artwork.
 * Beautifully detailed, high-contrast, perfectly scalable vector artwork.
 */
export function getThemeSvgArtwork(themeId: string): string {
  switch (themeId) {
    case 'fairytale':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="ft-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="50%" stop-color="#1C2541"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="ft-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <radialGradient id="ft-glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#818CF8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#ft-bg)"/>
  <circle cx="400" cy="180" r="220" fill="url(#ft-glow)"/>
  <!-- Stars -->
  <g fill="#F8FAFC" opacity="0.8">
    <circle cx="120" cy="80" r="1.5"/><circle cx="240" cy="50" r="2"/><circle cx="360" cy="90" r="1.5"/>
    <circle cx="680" cy="70" r="2"/><circle cx="560" cy="40" r="1.5"/><circle cx="720" cy="140" r="2.5"/>
    <circle cx="180" cy="160" r="2"/><circle cx="280" cy="110" r="1.5"/><circle cx="620" cy="120" r="2"/>
  </g>
  <!-- Glowing Crescent Moon -->
  <path d="M 640 60 A 45 45 0 1 0 690 120 A 40 40 0 1 1 640 60 Z" fill="url(#ft-gold)"/>
  <circle cx="670" cy="90" r="3" fill="#FFF" opacity="0.8"/>
  <!-- Misty Mountains -->
  <path d="M 0 350 L 150 240 L 300 320 L 480 210 L 640 300 L 800 230 L 800 450 L 0 450 Z" fill="#1E293B" opacity="0.8"/>
  <path d="M 0 380 L 180 300 L 380 370 L 560 280 L 720 360 L 800 320 L 800 450 L 0 450 Z" fill="#0B132B"/>
  <!-- Fantasy Castle Silhouette in Center -->
  <g fill="url(#ft-gold)">
    <rect x="360" y="220" width="80" height="130" rx="4"/>
    <polygon points="400,160 380,220 420,220"/>
    <rect x="330" y="250" width="35" height="100"/>
    <polygon points="347,190 330,250 365,250"/>
    <rect x="435" y="250" width="35" height="100"/>
    <polygon points="452,190 435,250 470,250"/>
    <!-- Castle Windows -->
    <rect x="393" y="240" width="14" height="24" rx="7" fill="#0B132B"/>
    <rect x="342" y="270" width="11" height="18" rx="5" fill="#0B132B"/>
    <rect x="447" y="270" width="11" height="18" rx="5" fill="#0B132B"/>
    <path d="M 390 350 A 15 15 0 0 1 410 350 Z" fill="#0B132B"/>
  </g>
  <!-- Floating Golden Sparkles -->
  <path d="M 400 130 Q 400 145 415 145 Q 400 145 400 160 Q 400 145 385 145 Q 400 145 400 130 Z" fill="#FDE047"/>
  <path d="M 320 180 Q 320 190 330 190 Q 320 190 320 200 Q 320 190 310 190 Q 320 190 320 180 Z" fill="#FDE047"/>
  <path d="M 480 170 Q 480 180 490 180 Q 480 180 480 190 Q 480 180 470 180 Q 480 180 480 170 Z" fill="#FDE047"/>
</svg>`;

    case 'cophong':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="cp-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBF7EE"/>
      <stop offset="100%" stop-color="#EDE2CA"/>
    </linearGradient>
    <radialGradient id="cp-sun" cx="30%" cy="40%" r="40%">
      <stop offset="0%" stop-color="#D97706" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#A71D2A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#cp-bg)"/>
  <!-- Morning Sun -->
  <circle cx="260" cy="180" r="90" fill="#A71D2A" opacity="0.18"/>
  <!-- Misty Ink Mountains -->
  <path d="M 50 320 Q 200 180 380 290 Q 550 160 750 310 L 800 450 L 0 450 Z" fill="#78350F" opacity="0.2"/>
  <path d="M 0 370 Q 180 260 360 340 Q 560 250 800 360 L 800 450 L 0 450 Z" fill="#44403C" opacity="0.45"/>
  <path d="M 120 410 Q 300 330 480 390 Q 660 320 800 400 L 800 450 L 0 450 Z" fill="#1C1917" opacity="0.8"/>
  <!-- Bamboo Grove on Left -->
  <g stroke="#1C1917" stroke-width="4" stroke-linecap="round">
    <line x1="70" y1="450" x2="65" y2="160"/>
    <line x1="100" y1="450" x2="95" y2="190"/>
    <line x1="130" y1="450" x2="135" y2="230"/>
  </g>
  <!-- Bamboo Leaves -->
  <g fill="#1C1917">
    <path d="M 65 240 C 40 230 20 220 10 215 C 30 228 50 235 65 240 Z"/>
    <path d="M 65 220 C 85 205 105 195 120 190 C 100 205 80 215 65 220 Z"/>
    <path d="M 95 270 C 120 255 145 245 160 240 C 135 255 110 265 95 270 Z"/>
    <path d="M 95 240 C 70 230 50 220 40 210 C 60 225 80 235 95 240 Z"/>
  </g>
  <!-- Flying Cranes -->
  <g fill="#A71D2A" opacity="0.85">
    <path d="M 340 140 Q 350 130 365 132 Q 355 136 345 145 Q 340 140 340 140 Z"/>
    <path d="M 370 120 Q 380 110 395 112 Q 385 116 375 125 Q 370 120 370 120 Z"/>
  </g>
  <!-- Red Cinnabar Seal Stamp (Triện son) -->
  <rect x="700" y="60" width="55" height="55" rx="6" fill="#A71D2A"/>
  <rect x="704" y="64" width="47" height="47" rx="3" fill="none" stroke="#FFF" stroke-width="2"/>
  <text x="727" y="94" font-size="20" font-family="'Noto Serif', serif" font-weight="bold" fill="#FFF" text-anchor="middle">墨寶</text>
</svg>`;

    case 'candy':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="candy-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE4E6"/>
      <stop offset="50%" stop-color="#FCE7F3"/>
      <stop offset="100%" stop-color="#EDE9FE"/>
    </linearGradient>
    <linearGradient id="candy-swirl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="50%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#candy-bg)"/>
  <!-- Floating Pastel Rainbow Arc -->
  <path d="M 150 450 A 250 250 0 0 1 650 450" fill="none" stroke="#FDA4AF" stroke-width="16" opacity="0.6"/>
  <path d="M 170 450 A 230 230 0 0 1 630 450" fill="none" stroke="#FDE047" stroke-width="16" opacity="0.6"/>
  <path d="M 190 450 A 210 210 0 0 1 610 450" fill="none" stroke="#A7F3D0" stroke-width="16" opacity="0.6"/>
  <path d="M 210 450 A 190 190 0 0 1 590 450" fill="none" stroke="#C4B5FD" stroke-width="16" opacity="0.6"/>
  <!-- Soft Clouds -->
  <g fill="#FFFFFF" opacity="0.9">
    <ellipse cx="200" cy="380" rx="90" ry="40"/>
    <ellipse cx="240" cy="360" rx="60" ry="45"/>
    <ellipse cx="600" cy="390" rx="95" ry="40"/>
    <ellipse cx="560" cy="370" rx="60" ry="45"/>
  </g>
  <!-- Huge Delicious 3D Macaron in Center -->
  <g transform="translate(400, 240)">
    <!-- Bottom Cookie Shell -->
    <ellipse cx="0" cy="40" rx="140" ry="38" fill="#F43F5E"/>
    <ellipse cx="0" cy="34" rx="136" ry="32" fill="#FB7185"/>
    <!-- Cream Filling -->
    <ellipse cx="0" cy="20" rx="132" ry="24" fill="#FEF08A"/>
    <!-- Top Cookie Shell -->
    <ellipse cx="0" cy="0" rx="140" ry="38" fill="#E11D48"/>
    <ellipse cx="0" cy="-6" rx="136" ry="34" fill="#FDA4AF"/>
    <!-- Light Reflection -->
    <ellipse cx="-40" cy="-15" rx="55" ry="14" fill="#FFFFFF" opacity="0.5"/>
  </g>
  <!-- Floating Candies & Lollipops -->
  <circle cx="160" cy="150" r="32" fill="#A855F7"/>
  <circle cx="160" cy="150" r="22" fill="#F472B6"/>
  <circle cx="160" cy="150" r="10" fill="#FFFFFF"/>
  <line x1="160" y1="182" x2="160" y2="260" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>

  <circle cx="640" cy="170" r="28" fill="#06B6D4"/>
  <circle cx="640" cy="170" r="18" fill="#FBBF24"/>
  <circle cx="640" cy="170" r="8" fill="#FFFFFF"/>
  <line x1="640" y1="198" x2="640" y2="270" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
</svg>`;

    case 'minimal':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="mn-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#mn-sky)"/>
  <!-- Minimalist Pine Forest Horizon Line -->
  <line x1="60" y1="360" x2="740" y2="360" stroke="#0F172A" stroke-width="2"/>
  <line x1="60" y1="366" x2="740" y2="366" stroke="#2563EB" stroke-width="1"/>
  <!-- Geometric Scandinavian Pine Trees -->
  <g fill="#0F172A">
    <polygon points="140,240 120,360 160,360"/>
    <polygon points="190,200 165,360 215,360"/>
    <polygon points="235,270 220,360 250,360"/>
    <polygon points="560,260 540,360 580,360"/>
    <polygon points="610,210 585,360 635,360"/>
    <polygon points="650,280 635,360 665,360"/>
  </g>
  <!-- Architectural Modernist Glass Pavilion in Center -->
  <rect x="310" y="220" width="180" height="140" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>
  <line x1="370" y1="220" x2="370" y2="360" stroke="#0F172A" stroke-width="2"/>
  <line x1="430" y1="220" x2="430" y2="360" stroke="#0F172A" stroke-width="2"/>
  <line x1="310" y1="280" x2="490" y2="280" stroke="#CBD5E1" stroke-width="1.5"/>
  <rect x="300" y="210" width="200" height="12" fill="#2563EB"/>
  <!-- Minimal Sun / Coordinate Grid -->
  <circle cx="400" cy="130" r="45" fill="none" stroke="#2563EB" stroke-width="2"/>
  <line x1="400" y1="70" x2="400" y2="190" stroke="#2563EB" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="340" y1="130" x2="460" y2="130" stroke="#2563EB" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="740" y="390" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#64748B" text-anchor="end">60°09'N 24°56'E // HELSINKI ARCHITECTURE</text>
</svg>`;

    case 'emerald':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="em-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#031F19"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
    <linearGradient id="em-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#em-bg)"/>
  <!-- Grand Botanical Conservatory Arch -->
  <path d="M 220 450 L 220 220 A 180 180 0 0 1 580 220 L 580 450" fill="none" stroke="url(#em-gold)" stroke-width="4"/>
  <path d="M 240 450 L 240 230 A 160 160 0 0 1 560 230 L 560 450" fill="none" stroke="url(#em-gold)" stroke-width="1.5" stroke-dasharray="5 5"/>
  <line x1="400" y1="40" x2="400" y2="450" stroke="url(#em-gold)" stroke-width="2"/>
  <!-- Spoke Rays from Arch -->
  <line x1="400" y1="220" x2="300" y2="120" stroke="url(#em-gold)" stroke-width="1.5"/>
  <line x1="400" y1="220" x2="500" y2="120" stroke="url(#em-gold)" stroke-width="1.5"/>
  <!-- Lush Botanical Monstera & Laurel Foliage -->
  <g fill="#10B981" opacity="0.85">
    <path d="M 120 450 C 130 380 180 340 260 360 C 230 400 190 430 120 450 Z"/>
    <path d="M 680 450 C 670 380 620 340 540 360 C 570 400 610 430 680 450 Z"/>
    <path d="M 60 410 C 80 330 150 300 220 330 C 180 370 140 400 60 410 Z" fill="#34D399"/>
    <path d="M 740 410 C 720 330 650 300 580 330 C 620 370 660 400 740 410 Z" fill="#34D399"/>
  </g>
  <!-- Royal Crest Medallion with Crown -->
  <g transform="translate(400, 220)">
    <circle cx="0" cy="0" r="50" fill="#047857" stroke="url(#em-gold)" stroke-width="3"/>
    <circle cx="0" cy="0" r="42" fill="none" stroke="url(#em-gold)" stroke-width="1" stroke-dasharray="3 3"/>
    <!-- Royal Crown -->
    <path d="M -22 -10 L -28 12 L 28 12 L 22 -10 L 10 2 L 0 -16 L -10 2 Z" fill="url(#em-gold)"/>
    <circle cx="-22" cy="-12" r="3" fill="#FFF"/>
    <circle cx="0" cy="-18" r="3.5" fill="#FFF"/>
    <circle cx="22" cy="-12" r="3" fill="#FFF"/>
  </g>
</svg>`;

    case 'sakura':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="sk-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF5F7"/>
      <stop offset="100%" stop-color="#FCE7F3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#sk-sky)"/>
  <!-- Ensō Zen Calligraphy Circle -->
  <circle cx="480" cy="200" r="140" fill="none" stroke="#F43F5E" stroke-width="8" stroke-linecap="round" opacity="0.25" stroke-dasharray="750 120"/>
  <!-- Mount Fuji in Distant Mist -->
  <polygon points="480,100 360,340 600,340" fill="#E2E8F0" opacity="0.6"/>
  <polygon points="480,100 440,180 520,180" fill="#FFFFFF"/>
  <!-- Traditional Red Torii Gate on Right -->
  <g fill="#BE185D">
    <rect x="520" y="200" width="14" height="180"/>
    <rect x="620" y="200" width="14" height="180"/>
    <!-- Curved Roof Header -->
    <path d="M 490 200 Q 575 190 660 200 L 660 216 Q 575 206 490 216 Z"/>
    <rect x="505" y="225" width="144" height="10"/>
  </g>
  <!-- Cherry Blossom Branch from Left -->
  <path d="M 0 60 Q 140 100 240 80 Q 320 65 380 120" fill="none" stroke="#44403C" stroke-width="7" stroke-linecap="round"/>
  <path d="M 160 85 Q 200 140 260 150" fill="none" stroke="#44403C" stroke-width="4" stroke-linecap="round"/>
  <!-- Blooming Sakura Petals -->
  <g fill="#F472B6">
    <circle cx="240" cy="75" r="12"/><circle cx="230" cy="88" r="12"/><circle cx="252" cy="85" r="12"/>
    <circle cx="380" cy="120" r="14"/><circle cx="365" cy="132" r="14"/><circle cx="395" cy="130" r="14"/>
    <circle cx="260" cy="150" r="10"/><circle cx="272" cy="145" r="10"/>
    <!-- Floating Petals -->
    <path d="M 320 220 C 310 210 325 195 335 210 C 345 225 330 230 320 220 Z"/>
    <path d="M 420 280 C 410 270 425 255 435 270 C 445 285 430 290 420 280 Z"/>
    <path d="M 280 320 C 270 310 285 295 295 310 C 305 325 290 330 280 320 Z"/>
  </g>
  <!-- Japanese Traditional Stamp -->
  <rect x="60" y="340" width="45" height="45" fill="#BE185D" rx="4"/>
  <text x="82" y="368" font-family="'Noto Serif', serif" font-size="18" font-weight="bold" fill="#FFF" text-anchor="middle">京都</text>
</svg>`;

    case 'cyberpunk':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="cy-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="100%" stop-color="#090D16"/>
    </linearGradient>
    <linearGradient id="cy-neon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#cy-bg)"/>
  <!-- Perspective Wireframe Cyber Grid Ground -->
  <g stroke="#06B6D4" stroke-width="1" opacity="0.35">
    <line x1="400" y1="240" x2="-200" y2="450"/>
    <line x1="400" y1="240" x2="0" y2="450"/>
    <line x1="400" y1="240" x2="200" y2="450"/>
    <line x1="400" y1="240" x2="400" y2="450"/>
    <line x1="400" y1="240" x2="600" y2="450"/>
    <line x1="400" y1="240" x2="800" y2="450"/>
    <line x1="400" y1="240" x2="1000" y2="450"/>
    <line x1="0" y1="270" x2="800" y2="270"/>
    <line x1="0" y1="310" x2="800" y2="310"/>
    <line x1="0" y1="370" x2="800" y2="370"/>
  </g>
  <!-- Cyber City Skyline Silhouette -->
  <g fill="#111827" stroke="#06B6D4" stroke-width="1.5">
    <rect x="80" y="160" width="60" height="160"/>
    <rect x="160" y="110" width="75" height="210"/>
    <rect x="250" y="190" width="50" height="130"/>
    <rect x="490" y="140" width="70" height="180"/>
    <rect x="580" y="90" width="85" height="230"/>
    <polygon points="622,40 618,90 626,90" fill="#06B6D4"/>
    <rect x="680" y="170" width="55" height="150"/>
  </g>
  <!-- Neon Glowing Horizon & Hologram Ring -->
  <line x1="0" y1="240" x2="800" y2="240" stroke="url(#cy-neon)" stroke-width="3"/>
  <circle cx="400" cy="180" r="70" fill="none" stroke="#F43F5E" stroke-width="2" stroke-dasharray="10 5"/>
  <circle cx="400" cy="180" r="50" fill="none" stroke="#06B6D4" stroke-width="2"/>
  <!-- HUD Diagnostics Overlay -->
  <text x="40" y="50" font-family="monospace" font-size="12" fill="#06B6D4" font-weight="bold">[ SYSTEM: SECURE // 2077_NET ]</text>
  <text x="760" y="50" font-family="monospace" font-size="12" fill="#F43F5E" font-weight="bold" text-anchor="end">[ CPU: 99.8% // MEM_OK ]</text>
  <!-- Corner Crosshairs -->
  <path d="M 30 70 L 30 30 L 70 30" fill="none" stroke="#06B6D4" stroke-width="2"/>
  <path d="M 770 70 L 770 30 L 730 30" fill="none" stroke="#06B6D4" stroke-width="2"/>
  <path d="M 30 380 L 30 420 L 70 420" fill="none" stroke="#06B6D4" stroke-width="2"/>
  <path d="M 770 380 L 770 420 L 730 420" fill="none" stroke="#06B6D4" stroke-width="2"/>
</svg>`;

    case 'vintage':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="vt-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAF4E8"/>
      <stop offset="100%" stop-color="#EADBBE"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#vt-bg)"/>
  <!-- Ornate Engraved Triple Border -->
  <rect x="25" y="25" width="750" height="400" fill="none" stroke="#78350F" stroke-width="3"/>
  <rect x="33" y="33" width="734" height="384" fill="none" stroke="#B45309" stroke-width="1"/>
  <rect x="38" y="38" width="724" height="374" fill="none" stroke="#78350F" stroke-width="1.5" stroke-dasharray="6 3"/>
  <!-- Vintage Newspaper / Broadsheet Masthead Banner -->
  <text x="400" y="85" font-family="'Playfair Display', serif" font-size="28" font-weight="bold" fill="#78350F" text-anchor="middle" letter-spacing="4">THE 19TH CENTURY CHRONICLE</text>
  <line x1="80" y1="100" x2="720" y2="100" stroke="#78350F" stroke-width="2"/>
  <line x1="80" y1="105" x2="720" y2="105" stroke="#78350F" stroke-width="0.8"/>
  <text x="400" y="122" font-family="'Noto Serif', serif" font-size="11" font-style="italic" fill="#292524" text-anchor="middle">Xuất bản tại Cổ Đô • Tinh hoa văn chương & Tư tưởng tri thức thế kỷ 19</text>
  <line x1="80" y1="130" x2="720" y2="130" stroke="#78350F" stroke-width="1"/>
  <!-- Center Woodblock Book & Quill Engraving -->
  <g transform="translate(400, 240)">
    <!-- Open Book -->
    <path d="M 0 30 Q -80 10 -150 25 L -150 110 Q -80 90 0 115 Q 80 90 150 110 L 150 25 Q 80 10 0 30 Z" fill="#FFFDF9" stroke="#78350F" stroke-width="3"/>
    <line x1="0" y1="30" x2="0" y2="115" stroke="#78350F" stroke-width="3"/>
    <!-- Book Spine Ribbons -->
    <path d="M -150 25 Q -80 10 0 30 Q 80 10 150 25" fill="none" stroke="#B45309" stroke-width="2"/>
    <!-- Quill Pen -->
    <path d="M 50 -20 Q 90 40 120 110 L 105 105 Q 80 50 40 -15 Z" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
    <!-- Antique Pocket Watch -->
    <circle cx="-100" cy="-10" r="32" fill="#FAF4E8" stroke="#78350F" stroke-width="3"/>
    <circle cx="-100" cy="-10" r="28" fill="none" stroke="#B45309" stroke-width="1"/>
    <line x1="-100" y1="-10" x2="-100" y2="-26" stroke="#78350F" stroke-width="2"/>
    <line x1="-100" y1="-10" x2="-86" y2="-10" stroke="#78350F" stroke-width="1.5"/>
  </g>
</svg>`;

    case 'ocean':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="oc-depth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="40%" stop-color="#0369A1"/>
      <stop offset="80%" stop-color="#0A192F"/>
      <stop offset="100%" stop-color="#040D1A"/>
    </linearGradient>
    <linearGradient id="oc-sunrays" x1="50%" y1="0%" x2="30%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#oc-depth)"/>
  <!-- Sun Rays Piercing Water -->
  <polygon points="360,0 200,450 260,450 400,0" fill="url(#oc-sunrays)"/>
  <polygon points="440,0 480,450 530,450 470,0" fill="url(#oc-sunrays)"/>
  <polygon points="520,0 660,450 710,450 550,0" fill="url(#oc-sunrays)"/>
  <!-- Sea Floor Coral Reefs -->
  <path d="M 0 380 Q 90 320 180 390 Q 280 340 380 410 Q 520 330 650 390 Q 730 350 800 370 L 800 450 L 0 450 Z" fill="#082F49"/>
  <!-- Living Coral Silhouettes -->
  <g fill="#FB7185" opacity="0.9">
    <path d="M 80 450 C 70 390 100 370 110 330 C 120 370 140 380 150 450 Z"/>
    <path d="M 120 450 C 130 400 150 380 170 350 C 180 400 190 410 200 450 Z" fill="#F43F5E"/>
    <path d="M 680 450 C 670 390 690 360 710 320 C 720 370 740 390 760 450 Z"/>
  </g>
  <!-- Swimming Sea Turtle -->
  <g transform="translate(380, 160)" fill="#38BDF8" opacity="0.95">
    <!-- Shell -->
    <ellipse cx="0" cy="0" rx="36" ry="24"/>
    <!-- Head -->
    <ellipse cx="44" cy="0" rx="10" ry="7"/>
    <!-- Flippers -->
    <path d="M 18 -18 C 30 -42 10 -46 -5 -24 Z"/>
    <path d="M 18 18 C 30 42 10 46 -5 24 Z"/>
    <path d="M -24 -14 C -36 -28 -24 -32 -16 -18 Z"/>
    <path d="M -24 14 C -36 28 -24 32 -16 18 Z"/>
  </g>
  <!-- Nautical Compass Rose Coordinates on Left -->
  <g transform="translate(100, 100)" stroke="#38BDF8" stroke-width="1.5" fill="none" opacity="0.7">
    <circle cx="0" cy="0" r="35"/>
    <circle cx="0" cy="0" r="28" stroke-dasharray="2 3"/>
    <polygon points="0,-35 4,0 -4,0" fill="#38BDF8"/>
    <polygon points="0,35 4,0 -4,0" fill="#FB7185"/>
    <polygon points="35,0 0,4 0,-4" fill="#38BDF8"/>
    <polygon points="-35,0 0,4 0,-4" fill="#38BDF8"/>
    <text x="0" y="-40" font-family="sans-serif" font-size="9" font-weight="bold" fill="#38BDF8" text-anchor="middle">N</text>
  </g>
</svg>`;

    case 'baroque':
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bq-velvet" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2A0818"/>
      <stop offset="100%" stop-color="#15030C"/>
    </linearGradient>
    <linearGradient id="bq-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bq-velvet)"/>
  <!-- Grand Baroque Filigree Corners -->
  <g stroke="url(#bq-gold)" stroke-width="2" fill="none">
    <!-- Top Left -->
    <path d="M 40 120 C 40 60 60 40 120 40"/>
    <path d="M 50 140 C 50 70 70 50 140 50"/>
    <circle cx="50" cy="50" r="14" fill="url(#bq-gold)"/>
    <!-- Top Right -->
    <path d="M 760 120 C 760 60 740 40 680 40"/>
    <path d="M 750 140 C 750 70 730 50 660 50"/>
    <circle cx="750" cy="50" r="14" fill="url(#bq-gold)"/>
    <!-- Bottom Left -->
    <path d="M 40 330 C 40 390 60 410 120 410"/>
    <circle cx="50" cy="400" r="14" fill="url(#bq-gold)"/>
    <!-- Bottom Right -->
    <path d="M 760 330 C 760 390 740 410 680 410"/>
    <circle cx="750" cy="400" r="14" fill="url(#bq-gold)"/>
  </g>
  <!-- Central Versailles Palace Medallion Cartouche -->
  <ellipse cx="400" cy="225" rx="190" ry="140" fill="#3B0C23" stroke="url(#bq-gold)" stroke-width="4"/>
  <ellipse cx="400" cy="225" rx="178" ry="128" fill="none" stroke="url(#bq-gold)" stroke-width="1.5" stroke-dasharray="6 4"/>
  <!-- Versailles Palace Chandelier Silhouette inside Cartouche -->
  <g transform="translate(400, 190)" fill="url(#bq-gold)">
    <circle cx="0" cy="-40" r="6"/>
    <line x1="0" y1="-40" x2="0" y2="0" stroke="url(#bq-gold)" stroke-width="3"/>
    <path d="M -60 20 Q 0 -10 60 20 L 50 35 Q 0 10 -50 35 Z"/>
    <circle cx="-60" cy="18" r="7"/><circle cx="-30" cy="24" r="7"/><circle cx="0" cy="26" r="8"/><circle cx="30" cy="24" r="7"/><circle cx="60" cy="18" r="7"/>
    <!-- Crystal Droplets -->
    <polygon points="-60,25 -58,45 -62,45"/>
    <polygon points="-30,31 -28,55 -32,55"/>
    <polygon points="0,34 2,65 -2,65"/>
    <polygon points="30,31 32,55 28,55"/>
    <polygon points="60,25 62,45 58,45"/>
  </g>
  <!-- Royal Fleur-de-lis Crest at Top -->
  <g transform="translate(400, 75)" fill="url(#bq-gold)">
    <path d="M 0 -22 C 8 -10 16 0 0 20 C -16 0 -8 -10 0 -22 Z"/>
    <path d="M -6 5 C -20 0 -30 15 -18 22 C -8 18 -6 12 -6 5 Z"/>
    <path d="M 6 5 C 20 0 30 15 18 22 C 8 18 6 12 6 5 Z"/>
    <rect x="-18" y="18" width="36" height="5" rx="2"/>
  </g>
</svg>`;
  }
}

/**
 * Returns a Data URL for the theme's SVG artwork so it can be passed into
 * DOCX ImageRun or PPTX slide.addImage.
 */
export function getThemeSvgDataUrl(themeId: string): string {
  const svg = getThemeSvgArtwork(themeId);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
