import { DocumentTheme } from '../types';

export const THEMES: Record<string, DocumentTheme> = {
  // 1. FAIRY TALES (Cổ tích & Thần tiên kỳ ảo)
  fairytale: {
    id: 'fairytale',
    name: 'Fairy Tales',
    subtitle: 'Cổ tích & Thần tiên kỳ ảo',
    bgHex: '0F172A',         // Deep obsidian midnight
    primaryHex: 'EAB308',    // Radiant fantasy gold (easy to see)
    textHex: 'F8FAFC',       // Crisp bright white on dark
    accentHex: '38BDF8',     // Sky blue starlight
    secondaryHex: 'CBD5E1',  // Silver mist
    cardBgHex: '1E293B',     // Card navy
    borderHex: 'EAB308',     // Gold border
    paperTextHex: '0F172A',  // Rich dark navy for paper
    paperAccentHex: 'B45309',// Amber gold for paper
    slideTextHex: 'F8FAFC',
    slideAccentHex: 'FDE047',
    rgb: {
      bg: [15, 23, 42],
      primary: [234, 179, 8],
      text: [248, 250, 252],
      accent: [56, 189, 248],
    },
    fontFamilyTitle: "'Cinzel', 'Times New Roman', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-cinzel',
    fontClassBody: 'font-noto-serif',
    icon: '✨',
    styleDescription: 'Bầu trời đêm huyền bí phối vàng ánh kim vương giả và bụi sao kỳ ảo',
    category: 'creative',
    cover: {
      motif: 'Vương Quốc Thần Tiên & Bụi Sao Kỳ Ảo',
      badge: '✦ HUYỀN THOẠI CỔ TÍCH • DI SẢN THẦN TIÊN ✦',
      icons: '✨ ⋆ 🌙 ⋆ 🌟',
      quote: 'Nơi trí tưởng tượng hóa thành ngôn từ vĩnh cửu giữa muôn ngàn tinh tú.',
      sealText: 'VƯƠNG QUỐC',
      borderStyle: 'ornate',
    },
  },

  // 2. CỔ PHONG (Phương Đông hoài niệm & Thư pháp)
  cophong: {
    id: 'cophong',
    name: 'Cổ phong',
    subtitle: 'Phương Đông hoài niệm & Giấy Dó',
    bgHex: 'F5EEDC',         // Authentic Do paper warm ivory
    primaryHex: 'A71D2A',    // Deep Cinnabar Red
    textHex: '1C1917',       // Chinese Calligraphy Black Ink
    accentHex: '78350F',     // Antiqued Cedar Wood
    secondaryHex: '854D0E',  // Aged Bronze
    cardBgHex: 'FFFDF7',     // Pure rice paper card
    borderHex: 'A71D2A',     // Cinnabar frame
    paperTextHex: '1C1917',
    paperAccentHex: 'A71D2A',
    slideTextHex: '1C1917',
    slideAccentHex: '78350F',
    rgb: {
      bg: [245, 238, 220],
      primary: [167, 29, 42],
      text: [28, 25, 23],
      accent: [120, 53, 15],
    },
    fontFamilyTitle: "'Noto Serif', 'Times New Roman', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-noto-serif',
    fontClassBody: 'font-noto-serif',
    icon: '🎋',
    styleDescription: 'Giấy dó màu mộc, nét mực tàu uyển chuyển và dấu triện son đỏ',
    category: 'classic',
    cover: {
      motif: 'Thư Pháp Thủy Mặc & Trúc Chỉ Phương Đông',
      badge: '【 國 風 雅 韻 • ĐIỂN TỊCH CỔ PHONG 】',
      icons: '🎋 ❖ 📜 ❖ 🏮',
      quote: 'Nét mực ngàn năm đọng bóng thời gian, câu chữ lưu truyền muôn đời sau.',
      sealText: '墨 寶',
      borderStyle: 'classical',
    },
  },

  // 3. KẸO NGỌT (Sweet Candy Pastel)
  candy: {
    id: 'candy',
    name: 'Kẹo ngọt',
    subtitle: 'Sweet Candy Pastel tươi trẻ',
    bgHex: 'FFF1F5',         // Soft macaron pink
    primaryHex: 'E11D48',    // Crisp strawberry rose (high contrast)
    textHex: '1F2937',       // Clear dark slate
    accentHex: '7C3AED',     // Soft lavender violet
    secondaryHex: '0D9488',  // Fresh mint
    cardBgHex: 'FFFFFF',     // Clean white card
    borderHex: 'FB7185',     // Soft berry border
    paperTextHex: '1F2937',
    paperAccentHex: 'BE123C',
    slideTextHex: '1F2937',
    slideAccentHex: '7C3AED',
    rgb: {
      bg: [255, 241, 245],
      primary: [225, 29, 72],
      text: [31, 41, 55],
      accent: [124, 58, 237],
    },
    fontFamilyTitle: "'Quicksand', 'Segoe UI', sans-serif",
    fontFamilyBody: "'Quicksand', 'Segoe UI', sans-serif",
    fontClassTitle: 'font-quicksand',
    fontClassBody: 'font-quicksand',
    icon: '🍬',
    styleDescription: 'Hồng dâu ngọt ngào, tím lavender mộng mơ cùng phông chữ bo tròn đáng yêu',
    category: 'creative',
    cover: {
      motif: 'Tiệm Bánh Ngọt Macaron & Cầu Vồng Pastel',
      badge: '🍭 SWEET PASTEL EDITION • TƯƠI TRẺ & SÁNG TẠO 🍭',
      icons: '🍬 ★ 🎀 ★ 🧁',
      quote: 'Mỗi ý tưởng ngọt ngào đều nở hoa rực rỡ và lan tỏa niềm hứng khởi tươi vui.',
      sealText: 'SWEET',
      borderStyle: 'playful',
    },
  },

  // 4. BẮC ÂU TỐI GIẢN (Nordic Minimalist)
  minimal: {
    id: 'minimal',
    name: 'Bắc Âu Tối Giản',
    subtitle: 'Nordic Scandinavian thanh lịch',
    bgHex: 'F8FAFC',         // Crisp nordic light
    primaryHex: '0F172A',    // Midnight Charcoal Slate
    textHex: '1E293B',       // Deep readable slate
    accentHex: '2563EB',     // Scandinavian Royal Cobalt Blue
    secondaryHex: '64748B',  // Nordic mist gray
    cardBgHex: 'FFFFFF',     // Pure white card
    borderHex: 'CBD5E1',     // Slate subtle border
    paperTextHex: '0F172A',
    paperAccentHex: '1D4ED8',
    slideTextHex: '0F172A',
    slideAccentHex: '2563EB',
    rgb: {
      bg: [248, 250, 252],
      primary: [15, 23, 42],
      text: [30, 41, 59],
      accent: [37, 99, 235],
    },
    fontFamilyTitle: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontFamilyBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontClassTitle: 'font-sans',
    fontClassBody: 'font-sans',
    icon: '🌲',
    styleDescription: 'Đẳng cấp kiến trúc Bắc Âu: Tối giản, khúc chiết, chuẩn mực xuất bản quốc tế',
    category: 'modern',
    cover: {
      motif: 'Kiến Trúc Tối Giản & Đường Kẻ Thụy Điển',
      badge: '// NORDIC EXECUTIVE EDITION • CHUẨN MỰC QUỐC TẾ //',
      icons: '🌲 ── 🏛️ ── 📐',
      quote: 'Sự hoàn hảo không phải là khi không còn gì để thêm, mà là khi không còn gì để bớt.',
      sealText: 'NORDIC',
      borderStyle: 'minimal',
    },
  },

  // 5. RỪNG NGỌC LỤC BẢO (Emerald Royal Forest)
  emerald: {
    id: 'emerald',
    name: 'Rừng Ngọc Lục Bảo',
    subtitle: 'Emerald Nature & Hoàng Gia Xanh Bích',
    bgHex: '062E25',         // Rich royal deep emerald
    primaryHex: '10B981',    // Vibrant luminous emerald green
    textHex: 'F0FDF4',       // Crisp bright mint white
    accentHex: 'FBBF24',     // Imperial warm gold
    secondaryHex: '6EE7B7',  // Pale jade
    cardBgHex: '0D3D32',     // Dark jade card
    borderHex: '10B981',     // Emerald border
    paperTextHex: '064E3B',  // Forest pine for paper
    paperAccentHex: '047857',// Rich emerald for paper
    slideTextHex: 'F0FDF4',
    slideAccentHex: 'FBBF24',
    rgb: {
      bg: [6, 46, 37],
      primary: [16, 185, 129],
      text: [240, 253, 244],
      accent: [251, 191, 36],
    },
    fontFamilyTitle: "'Playfair Display', 'Georgia', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-playfair',
    fontClassBody: 'font-noto-serif',
    icon: '🌿',
    styleDescription: 'Sắc xanh ngọc bích quý tộc điểm xuyết nhũ vàng ánh kim sang trọng',
    category: 'classic',
    cover: {
      motif: 'Vườn Địa Đàng Hoàng Gia & Lá Nguyệt Quế Vàng',
      badge: '🌿 THE ROYAL EMERALD • BẢN LƯU NIỆM CAO CẤP 🌿',
      icons: '👑 ❖ 🍃 ❖ 💎',
      quote: 'Vẻ đẹp vĩnh cửu như viên ngọc quý tỏa rạng giữa rừng già ngàn năm.',
      sealText: 'EMERALD',
      borderStyle: 'ornate',
    },
  },

  // 6. SAKURA KYOTO (Hoa Anh Đào & Wabi-Sabi)
  sakura: {
    id: 'sakura',
    name: 'Sakura Kyoto',
    subtitle: 'Anh Đào Phù Tang & Giấy Washi',
    bgHex: 'FFF8F5',         // Japanese warm cherry paper
    primaryHex: 'BE185D',    // Deep Sakura Crimson (crisp readability)
    textHex: '292524',       // Warm charcoal sumi ink
    accentHex: '9D174D',     // Rich plum rose
    secondaryHex: '059669',  // Matcha leaf green
    cardBgHex: 'FFFFFF',     // Clean paper card
    borderHex: 'F472B6',     // Petal pink border
    paperTextHex: '292524',
    paperAccentHex: 'BE185D',
    slideTextHex: '292524',
    slideAccentHex: '9D174D',
    rgb: {
      bg: [255, 248, 245],
      primary: [190, 24, 93],
      text: [41, 37, 36],
      accent: [157, 23, 77],
    },
    fontFamilyTitle: "'Noto Serif', 'Times New Roman', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-noto-serif',
    fontClassBody: 'font-noto-serif',
    icon: '🌸',
    styleDescription: 'Cánh hoa anh đào xứ Phù Tang rơi trên trang giấy Washi thanh nhã',
    category: 'classic',
    cover: {
      motif: 'Cổng Đền Torii & Cánh Hoa Anh Đào Mùa Xuân',
      badge: '🌸 KYOTO HERITAGE • TĨNH LẶNG & THANH THOÁT 🌸',
      icons: '🌸 ⛩️ 🍃 🌸',
      quote: 'Mỗi trang viết nhẹ nhàng và thanh khiết tựa cánh hoa anh đào trong gió sớm.',
      sealText: 'KYOTO',
      borderStyle: 'classical',
    },
  },

  // 7. CYBERPUNK 2077 (Tương Lai Viễn Tưởng Neon)
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    subtitle: 'Neon Viễn Tưởng & Đêm Obsidian',
    bgHex: '090D16',         // High-tech obsidian void
    primaryHex: '06B6D4',    // Bright cyber electric cyan
    textHex: 'F8FAFC',       // Pure white readout
    accentHex: 'F43F5E',     // Hot neon magenta
    secondaryHex: 'A855F7',  // Neon purple ray
    cardBgHex: '111827',     // Terminal console
    borderHex: '06B6D4',     // Cyan grid line
    paperTextHex: '090D16',  // Pure black on paper
    paperAccentHex: '0284C7',// Sharp deep cyan on paper
    slideTextHex: 'F8FAFC',
    slideAccentHex: '06B6D4',
    rgb: {
      bg: [9, 13, 22],
      primary: [6, 182, 212],
      text: [248, 250, 252],
      accent: [244, 63, 94],
    },
    fontFamilyTitle: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontFamilyBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontClassTitle: 'font-sans',
    fontClassBody: 'font-sans',
    icon: '⚡',
    styleDescription: 'Đêm than chì viễn tưởng, ánh sáng Cyan & Magenta Neon rực rỡ tương lai',
    category: 'modern',
    cover: {
      motif: 'Giao Diện HUD Terminal 2077 & Lưới Wireframe',
      badge: '[ SYSTEM_PROTOCOL // 2077_CYBER_EDITION // VER_4.0 ]',
      icons: '⚡ ▓▒░ 💾 ░▒▓ ⚡',
      quote: 'Dữ liệu là nguồn năng lượng tối thượng khai phóng vận mệnh nhân loại.',
      sealText: 'CYBER',
      borderStyle: 'cyber',
    },
  },

  // 8. BÁO CHÍ & SÁCH CŨ (Vintage Press & Old Book)
  vintage: {
    id: 'vintage',
    name: 'Báo Chí & Sách Cũ',
    subtitle: 'Góc Cà Phê & Bìa Da Thế Kỷ 19',
    bgHex: 'FAF4E8',         // Aged parchment sepia
    primaryHex: '78350F',    // Antique leather brown
    textHex: '292524',       // Typewriter ink charcoal
    accentHex: 'B45309',     // Warm caramel roasted coffee
    secondaryHex: '92400E',  // Aged woodblock
    cardBgHex: 'FFFDF9',     // Heavy cotton paper card
    borderHex: 'B45309',     // Warm leather border
    paperTextHex: '292524',
    paperAccentHex: '78350F',
    slideTextHex: '292524',
    slideAccentHex: '78350F',
    rgb: {
      bg: [250, 244, 232],
      primary: [120, 53, 15],
      text: [41, 37, 36],
      accent: [180, 83, 9],
    },
    fontFamilyTitle: "'Playfair Display', 'Times New Roman', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-playfair',
    fontClassBody: 'font-noto-serif',
    icon: '☕',
    styleDescription: 'Giấy ngả vàng hoài niệm, màu cà phê ấm cúng và phong cách in ấn cổ điển',
    category: 'classic',
    cover: {
      motif: 'Bìa Sách Khắc Da Cổ Điển & Nhà Xuất Bản 1920',
      badge: '📜 EX LIBRIS • GÓC THƯ VIỆN & CÀ PHÊ CỔ ĐIỂN 📜',
      icons: '☕ ✒️ 📖 🕰️',
      quote: 'Hương cà phê ấm nồng bên từng trang sách cũ nhuốm màu thời gian.',
      sealText: 'VINTAGE',
      borderStyle: 'classical',
    },
  },

  // 9. ĐẠI DƯƠNG & SAN HÔ (Deep Ocean & Living Coral)
  ocean: {
    id: 'ocean',
    name: 'Đại Dương & San Hô',
    subtitle: 'Deep Ocean & Coral Reef',
    bgHex: '0A192F',         // Oceanic Mariana abyss
    primaryHex: '38BDF8',    // Crystal azure blue
    textHex: 'F0F9FF',       // Crisp seafoam white
    accentHex: 'FB7185',     // Living coral pink
    secondaryHex: '0284C7',  // Deep marine wave
    cardBgHex: '112240',     // Sea trench card
    borderHex: '38BDF8',     // Azure border
    paperTextHex: '0A192F',  // Deep sea navy on paper
    paperAccentHex: '0369A1',// Marine blue on paper
    slideTextHex: 'F0F9FF',
    slideAccentHex: 'FB7185',
    rgb: {
      bg: [10, 25, 47],
      primary: [56, 189, 248],
      text: [240, 249, 255],
      accent: [251, 113, 133],
    },
    fontFamilyTitle: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontFamilyBody: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    fontClassTitle: 'font-sans',
    fontClassBody: 'font-sans',
    icon: '🌊',
    styleDescription: 'Xanh thẳm vực đại dương huyền bí kết hợp ánh san hô sống động đầy sức sống',
    category: 'creative',
    cover: {
      motif: 'La Bàn Hải Trình & Rạn San Hô Sống Động',
      badge: '🌊 OCEANIC EXPEDITION • BẢN ĐỒ THÁM HIỂM BIỂN SÂU 🌊',
      icons: '🐚 ⚓ 🧭 🐬',
      quote: 'Thám hiểm những tầng sâu thẳm của tri thức và sáng tạo vô tận.',
      sealText: 'OCEAN',
      borderStyle: 'modern',
    },
  },

  // 10. HOÀNG GIA CHÂU ÂU (European Baroque Palace)
  baroque: {
    id: 'baroque',
    name: 'Hoàng Gia Châu Âu',
    subtitle: 'Cung Điện Versailles & Nhung Quý Tộc',
    bgHex: '1F0611',         // Royal Burgundy velvet dark
    primaryHex: 'F59E0B',    // Ornate Versailles Gold
    textHex: 'FEF3C7',       // Warm champagne silk
    accentHex: 'FBBF24',     // Radiant Imperial gold
    secondaryHex: 'E11D48',  // Crimson rosette
    cardBgHex: '330B1E',     // Royal chamber card
    borderHex: 'F59E0B',     // Golden filigree border
    paperTextHex: '1F0611',  // Deep burgundy for paper
    paperAccentHex: 'B45309',// Gold amber for paper
    slideTextHex: 'FEF3C7',
    slideAccentHex: 'F59E0B',
    rgb: {
      bg: [31, 6, 17],
      primary: [245, 158, 11],
      text: [254, 243, 199],
      accent: [251, 191, 36],
    },
    fontFamilyTitle: "'Cinzel', 'Times New Roman', serif",
    fontFamilyBody: "'Noto Serif', 'Times New Roman', serif",
    fontClassTitle: 'font-cinzel',
    fontClassBody: 'font-noto-serif',
    icon: '👑',
    styleDescription: 'Nhung đỏ Burgundy diễm lệ phối vàng ròng Versailles quý phái tột đỉnh',
    category: 'classic',
    cover: {
      motif: 'Cung Điện Versailles & Vương Miện Hoàng Gia',
      badge: '🏛️ LE PALAIS ROYAL • HOÀNG GIA CHÂU ÂU 🏛️',
      icons: '⚜️ 👑 ⚜️',
      quote: 'Uy quyền lộng lẫy và đỉnh cao chuẩn mực nghệ thuật hoàng gia châu Âu.',
      sealText: 'ROYAL',
      borderStyle: 'ornate',
    },
  },
};
