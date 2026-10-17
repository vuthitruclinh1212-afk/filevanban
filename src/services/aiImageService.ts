import { DocumentTheme } from '../types';

/**
 * In-memory cache of generated AI images by prompt string
 */
const imageCache = new Map<string, string>();

export interface ParsedAiImagePlaceholder {
  raw: string;
  alt: string;
  prompt: string;
  index: number;
}

/**
 * Extracts all AI image placeholder tags:
 * ![Alt text](prompt:Your detailed prompt description)
 * or ![Alt text](ai:Your prompt)
 */
export function extractAiImagePlaceholders(markdown: string): ParsedAiImagePlaceholder[] {
  const placeholders: ParsedAiImagePlaceholder[] = [];
  const regex = /!\[([^\]]*)\]\((?:prompt|ai):([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(markdown)) !== null) {
    placeholders.push({
      raw: match[0],
      alt: match[1].trim() || 'Hình ảnh minh họa AI',
      prompt: match[2].trim(),
      index: match.index,
    });
  }

  return placeholders;
}

/**
 * Client-side generative canvas synthesizer that creates a rich, high-resolution (1200x675)
 * PNG Data URL representing the visual concept of the prompt.
 */
export function synthesizeArtisticImageFromPrompt(
  prompt: string,
  theme?: DocumentTheme
): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const lower = prompt.toLowerCase();

  // Palette selection based on keywords in prompt
  let gradColor1 = '#1E1B4B';
  let gradColor2 = '#312E81';
  let gradColor3 = '#4338CA';
  let accentColor = '#818CF8';
  let motifIcon = '✨';

  if (lower.includes('biển') || lower.includes('đại dương') || lower.includes('ocean') || lower.includes('nước') || lower.includes('san hô')) {
    gradColor1 = '#082F49';
    gradColor2 = '#0369A1';
    gradColor3 = '#0284C7';
    accentColor = '#38BDF8';
    motifIcon = '🌊';
  } else if (lower.includes('cổ tích') || lower.includes('thần tiên') || lower.includes('castle') || lower.includes('sao') || lower.includes('fairytale')) {
    gradColor1 = '#0F172A';
    gradColor2 = '#1E293B';
    gradColor3 = '#334155';
    accentColor = '#FDE047';
    motifIcon = '🏰';
  } else if (lower.includes('trà') || lower.includes('sơn thủy') || lower.includes('cổ phong') || lower.includes('thư pháp') || lower.includes('núi')) {
    gradColor1 = '#292524';
    gradColor2 = '#44403C';
    gradColor3 = '#78350F';
    accentColor = '#F59E0B';
    motifIcon = '🎋';
  } else if (lower.includes('kẹo') || lower.includes('pastel') || lower.includes('ngọt') || lower.includes('hoa') || lower.includes('bánh')) {
    gradColor1 = '#831843';
    gradColor2 = '#BE185D';
    gradColor3 = '#DB2777';
    accentColor = '#F472B6';
    motifIcon = '🍬';
  } else if (lower.includes('cyber') || lower.includes('công nghệ') || lower.includes('ai') || lower.includes('neon') || lower.includes('tương lai')) {
    gradColor1 = '#090D16';
    gradColor2 = '#111827';
    gradColor3 = '#1F2937';
    accentColor = '#06B6D4';
    motifIcon = '⚡';
  } else if (lower.includes('rừng') || lower.includes('ngọc') || lower.includes('cây') || lower.includes('emerald') || lower.includes('thiên nhiên')) {
    gradColor1 = '#064E3B';
    gradColor2 = '#047857';
    gradColor3 = '#059669';
    accentColor = '#34D399';
    motifIcon = '🌿';
  } else if (theme) {
    gradColor1 = `#${theme.bgHex}`;
    gradColor2 = `#${theme.cardBgHex}`;
    gradColor3 = `#${theme.cardBgHex}`;
    accentColor = `#${theme.primaryHex}`;
    motifIcon = theme.icon || '✨';
  }

  // Draw smooth cosmic gradient background
  const grad = ctx.createLinearGradient(0, 0, 1200, 675);
  grad.addColorStop(0, gradColor1);
  grad.addColorStop(0.5, gradColor2);
  grad.addColorStop(1, gradColor3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 675);

  // Decorative ambient circles
  ctx.save();
  const radGrad = ctx.createRadialGradient(600, 300, 50, 600, 300, 450);
  radGrad.addColorStop(0, `${accentColor}33`);
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 1200, 675);
  ctx.restore();

  // Geometric grid / constellation particles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 40; i++) {
    const x = ((i * 137.5) % 1160) + 20;
    const y = ((i * 223.7) % 635) + 20;
    const r = (i % 3) + 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Card container in center
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.strokeStyle = `${accentColor}80`;
  ctx.lineWidth = 2.5;

  // Rounded rectangle
  const cx = 100;
  const cy = 80;
  const cw = 1000;
  const ch = 515;
  const cr = 24;
  ctx.beginPath();
  ctx.moveTo(cx + cr, cy);
  ctx.lineTo(cx + cw - cr, cy);
  ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + cr);
  ctx.lineTo(cx + cw, cy + ch - cr);
  ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - cr, cy + ch);
  ctx.lineTo(cx + cr, cy + ch);
  ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - cr);
  ctx.lineTo(cx, cy + cr);
  ctx.quadraticCurveTo(cx, cy, cx + cr, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Top AI badge
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ HÌNH ẢNH MINH HỌA ĐƯỢC TẠO TỰ ĐỘNG BỞI AI ✦', 600, 160);

  // Central Motif Icon
  ctx.font = '72px system-ui, sans-serif';
  ctx.fillText(motifIcon, 600, 260);

  // Prompt Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';

  // Word wrap prompt text
  const words = prompt.split(' ');
  let line = '';
  const lines: string[] = [];
  const maxWidth = 880;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startY = 340;
  lines.slice(0, 3).forEach((l, idx) => {
    ctx.fillText(l.trim(), 600, startY + idx * 46);
  });

  // Bottom prompt caption
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'italic 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('Cú pháp Markdown: ![Minh họa](prompt:...) • Tự động kết xuất vào tài liệu', 600, 530);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Generates or retrieves an image from cache for a given prompt.
 * First queries backend /api/ai/generate-image; falls back gracefully
 * to synthesized canvas generative artwork.
 */
export async function generateImageFromPrompt(
  prompt: string,
  theme?: DocumentTheme
): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return '';

  // 1. Check in-memory cache
  if (imageCache.has(cleanPrompt)) {
    return imageCache.get(cleanPrompt)!;
  }

  // 2. Try calling backend API
  try {
    const res = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: cleanPrompt,
        themeId: theme?.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.imageUrl) {
        imageCache.set(cleanPrompt, data.imageUrl);
        return data.imageUrl;
      }
    }
  } catch (err) {
    console.warn('Backend image generation endpoint unavailable, using synthesis fallback:', err);
  }

  // 3. Fallback to client synthesis
  const syntheticUrl = synthesizeArtisticImageFromPrompt(cleanPrompt, theme);
  if (syntheticUrl) {
    imageCache.set(cleanPrompt, syntheticUrl);
    return syntheticUrl;
  }

  return '';
}

/**
 * Resolves all `![...](prompt:...)` tags in markdown into real image data URLs
 * before file export (Word, PPTX, PDF, Excel).
 */
export async function resolveMarkdownImagesForExport(
  markdown: string,
  theme: DocumentTheme,
  onProgress?: (message: string) => void
): Promise<{ resolvedMarkdown: string; replacements: Map<string, string> }> {
  const placeholders = extractAiImagePlaceholders(markdown);
  const replacements = new Map<string, string>();

  if (placeholders.length === 0) {
    return { resolvedMarkdown: markdown, replacements };
  }

  if (onProgress) {
    onProgress(`Đang xử lý ${placeholders.length} hình ảnh AI từ cú pháp prompt:...`);
  }

  let updated = markdown;

  for (let i = 0; i < placeholders.length; i++) {
    const item = placeholders[i];
    if (onProgress) {
      onProgress(`Đang tạo hình ảnh AI ${i + 1}/${placeholders.length}: "${item.prompt.substring(0, 30)}..."`);
    }

    try {
      const imgDataUrl = await generateImageFromPrompt(item.prompt, theme);
      if (imgDataUrl) {
        replacements.set(item.prompt, imgDataUrl);
        // Replace this exact placeholder with markdown image referencing the resolved data URL
        const markdownReplacement = `![${item.alt}](${imgDataUrl})\n*Minh họa AI: ${item.prompt}*`;
        updated = updated.replace(item.raw, markdownReplacement);
      }
    } catch (e) {
      console.error('Failed to resolve AI image for prompt:', item.prompt, e);
    }
  }

  return { resolvedMarkdown: updated, replacements };
}

/**
 * Preset Prompt suggestions for quick insertion
 */
export const QUICK_AI_PROMPTS = [
  {
    category: 'Vương Quốc & Cổ Tích',
    title: 'Lâu Đài Ánh Sao',
    prompt: 'Enchanting fairytale castle with golden stardust under glowing crescent moon, fantasy storybook digital art',
  },
  {
    category: 'Cổ Phong & Thư Pháp',
    title: 'Sơn Thủy Hữu Tình & Trà Đạo',
    prompt: 'Traditional East Asian misty mountains, bamboo grove, blooming lotus and ancient tea pavilion, ink wash watercolor',
  },
  {
    category: 'Kẹo Ngọt & Pastel',
    title: 'Thiên Đường Macaron',
    prompt: 'Delicious pastel macaron dessert tower with fluffy clouds, strawberry sweets and rainbow, cute 3D render',
  },
  {
    category: 'Bắc Âu Tối Giản',
    title: 'Kiến Trúc Tối Giản Rừng Thông',
    prompt: 'Minimalist Scandinavian architectural pavilion in snowy pine forest, serene natural morning daylight, geometric line art',
  },
  {
    category: 'Hoàng Gia Emerald',
    title: 'Vườn Địa Đàng Hoàng Gia',
    prompt: 'Lush neoclassical emerald botanical greenhouse with golden laurel leaves, luxury Victorian glass arches and ferns',
  },
  {
    category: 'Kyoto Sakura',
    title: 'Cổng Đền Torii & Hoa Anh Đào',
    prompt: 'Serene Kyoto pagoda framed by blossoming cherry blossoms and traditional red Torii gate with Mount Fuji in morning mist',
  },
  {
    category: 'Cyberpunk 2077',
    title: 'Đô Thị Viễn Tưởng Neon HUD',
    prompt: 'Futuristic cyberpunk neon city skyline at night with holographic cyan and magenta HUD telemetry interface and skyscrapers',
  },
  {
    category: 'Sách Cũ Thế Kỷ 19',
    title: 'Góc Thư Viện & Máy Đánh Chữ',
    prompt: 'Cozy antique 19th century library with vintage typewriter, leather-bound books, brass astrolabe and warm candlelight',
  },
  {
    category: 'Đại Dương San Hô',
    title: 'Rạn San Hô Phát Quang',
    prompt: 'Bioluminescent deep sea coral reef with swimming sea turtle and azure light rays piercing crystal turquoise waters',
  },
  {
    category: 'Hoàng Gia Châu Âu',
    title: 'Cung Điện Versailles',
    prompt: 'Opulent European Versailles baroque palace grand ballroom with crystal chandelier, gold rococo filigree and crimson velvet',
  },
];
