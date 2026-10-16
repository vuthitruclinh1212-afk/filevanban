import { DocumentTheme } from '../types';

/**
 * Normalizes user markdown, fixes spacing around asterisks, converts LaTeX symbols,
 * converts special markers (*, _, **) into proper semantic hierarchy (h1-h6, b, i),
 * and ensures nested bullets and lists parse correctly without any leftover syntax errors.
 */
export function normalizeAndCleanMarkdown(content: string): string {
  if (!content) return '';

  // 1. Line endings and invisible character sanitization
  let text = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '') // remove zero-width spaces
    .replace(/\u00A0/g, ' '); // non-breaking space to regular space

  // 2. Convert common LaTeX and math symbols to clean Unicode
  text = text
    .replace(/\$?(\\(?:rightarrow|to))\$?|->/g, '→')
    .replace(/\$?(\\(?:leftarrow|gets))\$?|<-/g, '←')
    .replace(/\$?(\\(?:Rightarrow))\$?|=>/g, '⇒')
    .replace(/\$?(\\(?:Leftarrow))\$?|<=/g, '⇐')
    .replace(/\$?(\\(?:Leftrightarrow))\$?|<=>/g, '⇔')
    .replace(/\$?(\\(?:ldots|dots))\$?|\.\.\./g, '…')
    .replace(/\$?(\\(?:approx))\$?|~=/g, '≈')
    .replace(/\$?(\\(?:neq|ne))\$?|!=/g, '≠')
    .replace(/\$?(\\(?:leq|le))\$?|<=/g, '≤')
    .replace(/\$?(\\(?:geq|ge))\$?|>=/g, '≥')
    .replace(/\$?(\\(?:pm))\$?|\+\/-/g, '±');

  // Convert math multiplication between numbers (e.g. "5 * 10" -> "5 × 10") so it doesn't break italics
  text = text.replace(/(\d+)\s*\*\s*(\d+)/g, '$1 × $2');

  // 3. Pre-convert HTML heading and formatting tags to clean standard markdown
  text = text
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
    .replace(/<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi, '**$1**')
    .replace(/<(?:em|i)[^>]*>(.*?)<\/(?:em|i)>/gi, '*$1*')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // 4. Fix asterisk & underscore spacing and formatting:
  // Normalize spaced asterisks like "* * text * *" to "**text**"
  text = text.replace(/\*\s+\*\s*([^*\n]+?)\s*\*\s+\*/g, '**$1**');

  // Triple asterisks / bold-italic (***text***, **_text_**, ___text___)
  text = text
    .replace(/\*\*\*\s*([^*\n]+?)\s*\*\*\*/g, '***$1***')
    .replace(/\*\*_\s*([^*\n]+?)\s*_\*\*/g, '***$1***')
    .replace(/___\s*([^_<\n]+?)\s*___/g, '***$1***');

  // Double asterisks (bold) with whitespace or colons inside
  text = text.replace(/\*\*\s*([^*\n]+?)\s*\*\*/g, '**$1**');
  text = text.replace(/__\s*([^_<\n]+?)\s*__/g, '**$1**');

  // Single asterisks (italic) with whitespace inside
  text = text.replace(/(?<!\*)\*\s*([^*\s\n][^*\n]*?)\s*\*(?!\*)/g, '*$1*');
  text = text.replace(/(?<![a-zA-Z0-9_])_\s*([^_<\s\n][^_<\n]*?)\s*_(?![a-zA-Z0-9_])/g, '*$1*');

  // Colon placement inside bold/italic (e.g. "**Mục tiêu:**" instead of "**Mục tiêu**: ")
  text = text.replace(/\*\*\s*([^:*\n]+?)\s*:\s*\*\*/g, '**$1:**');
  text = text.replace(/\*\s*([^:*\n]+?)\s*:\s*\*/g, '*$1:*');

  // 5. Line-by-line processing for structure, hierarchy (H1-H6), bullets, and stray cleaning
  const lines = text.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trimEnd();

    // Preserve empty lines
    if (!line.trim()) {
      processedLines.push('');
      continue;
    }

    // Detect horizontal rules written as * * *, ***, ---, _ _ _
    if (/^\s*(\*\s*){3,}$/.test(line) || /^\s*(-\s*){3,}$/.test(line) || /^\s*(_\s*){3,}$/.test(line)) {
      processedLines.push('---');
      continue;
    }

    // Clean stray trailing asterisks or underscores at end of line (e.g., "văn bản *")
    line = line.replace(/\s+[\*_]{1,3}$/, '');

    // Bullet lists starting with *, -, +, •, ◦, ▪, ▫
    const bulletMatch = line.match(/^(\s*)([•*+\-–◦▪▫])\s+(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1];
      let rest = bulletMatch[3].trim();

      // Clean redundant asterisks right after bullet (e.g., "- * *Tiêu đề:* Nội dung")
      rest = rest.replace(/^\*\s+\*\s*/, '**');
      // Fix unclosed bold at bullet start: "- **Tiêu đề: Nội dung" -> "- **Tiêu đề:** Nội dung"
      if (/^\*\*[^*]+:/.test(rest) && !/^\*\*[^*]+\*\*/.test(rest)) {
        rest = rest.replace(/^(\*\*[^*:]+):/, '$1:**');
      }

      const indentSpaces = indent.length;
      if (indentSpaces === 0) {
        processedLines.push(`- ${rest}`);
      } else {
        const level = Math.max(1, Math.floor(indentSpaces / 2));
        processedLines.push(`${'  '.repeat(level)}- ${rest}`);
      }
      continue;
    }

    // Check if line already has markdown '#' headings
    const hashHeadingMatch = line.match(/^(#{1,6})\s*(.*)$/);
    if (hashHeadingMatch) {
      const hashes = hashHeadingMatch[1];
      let headingText = hashHeadingMatch[2].trim();
      // Remove redundant enclosing bold/italic inside heading text: "## **Tiêu đề**" -> "## Tiêu đề"
      headingText = headingText.replace(/^\*\*(.+?)\*\*$/, '$1').replace(/^\*(.+?)\*$/, '$1');
      processedLines.push(`${hashes} ${headingText}`);
      continue;
    }

    // Convert full-line bold/italic patterns into appropriate heading levels:
    // e.g. "*** TIÊU ĐỀ CHÍNH ***" or "** 1. TỔNG QUAN **"
    const fullBoldMatch = line.match(/^\s*\*{2,3}\s*(.+?)\s*\*{2,3}\s*$/) || line.match(/^\s*_{2,3}\s*(.+?)\s*_{2,3}\s*$/);
    if (fullBoldMatch) {
      const innerText = fullBoldMatch[1].trim();

      // Check if innerText has hierarchical markers
      const convertedHeading = convertTextToHierarchicalHeading(innerText);
      if (convertedHeading) {
        processedLines.push(convertedHeading);
        continue;
      }

      // If standalone all-caps or title without period (length < 90)
      if (innerText.length <= 90 && !/[.!?]$/.test(innerText)) {
        processedLines.push(`## ${innerText}`);
        continue;
      }

      // Otherwise retain clean bold markdown
      processedLines.push(`**${innerText}**`);
      continue;
    }

    // Convert plain text headings without '#' into standard Markdown hierarchy (H1 - H6)
    const hierarchicalHeading = convertTextToHierarchicalHeading(line.trim());
    if (hierarchicalHeading) {
      processedLines.push(hierarchicalHeading);
      continue;
    }

    // Blockquote callouts normalization: "> **Lưu ý:** ..."
    if (line.startsWith('>')) {
      let quoteContent = line.substring(1).trim();
      // If quote starts without bold tag but has label: "> Lưu ý: ..." -> "> 💡 **Lưu ý:** ..."
      if (/^(Lưu ý|Ghi chú|Quan trọng|Chú ý|Tổng kết|Cốt lõi)\s*:\s*(.+)$/i.test(quoteContent)) {
        quoteContent = quoteContent.replace(/^(Lưu ý|Ghi chú|Quan trọng|Chú ý|Tổng kết|Cốt lõi)\s*:\s*(.+)$/i, '💡 **$1:** $2');
      }
      processedLines.push(`> ${quoteContent}`);
      continue;
    }

    // Fix unclosed bold at beginning of sentence: e.g. "**Lưu ý: đây là văn bản..."
    if (/^\*\*[^*:\n]+:\s+/.test(line) && !/^\*\*[^*:\n]+\*\*:\s+/.test(line)) {
      line = line.replace(/^(\*\*[^*:\n]+):/, '$1:**');
    }

    // Clean stray unmatched asterisks on plain lines:
    // If a line contains a single unmatched asterisk surrounded by spaces, remove it
    if ((line.match(/\*/g) || []).length === 1 && !line.includes('×')) {
      line = line.replace(/\s+\*\s+/g, ' ');
    }

    processedLines.push(line);
  }

  // 6. Ensure clean spacing between blocks
  let result = processedLines.join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Intelligent helper: recognizes textual numbering & section headers
 * and transforms them into strict Markdown H1 - H6 levels.
 */
function convertTextToHierarchicalHeading(text: string): string | null {
  const clean = text.replace(/^[\*_]{1,3}|[\*_]{1,3}$/g, '').trim();
  if (!clean) return null;

  // Level 1: Chương / Phần (e.g. "Chương 1: Mở đầu", "PHẦN I: GIỚI THIỆU", "BÀI 1: KHỞI ĐỘNG")
  if (/^(?:Chương|Phần|Bài)\s+[0-9IVXLCDM]+(?:\s*[:.-]\s*|\s+)(.+)$/i.test(clean)) {
    return `# ${clean}`;
  }

  // Level 2: Roman Numerals (e.g. "I. TỔNG QUAN", "II. MỤC TIÊU VÀ PHẠM VI")
  if (/^(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\.\s+(.+)$/i.test(clean)) {
    return `## ${clean}`;
  }

  // Level 2: Legal articles (e.g. "Điều 1. Phạm vi áp dụng")
  if (/^Điều\s+[0-9]+(?:\s*[:.-]\s*|\s+)(.+)$/i.test(clean)) {
    return `## ${clean}`;
  }

  // Level 2: Major numbered section if capitalized or title-like (e.g. "1. ĐẶT VẤN ĐỀ", "2. KẾT QUẢ THỰC NGHIỆM")
  if (/^[0-9]+\.\s+([A-ZÀ-Ỹ0-9\s:_-]{3,80})$/.test(clean)) {
    return `## ${clean}`;
  }

  // Level 3: Decimal 2-tier numbering (e.g. "1.1 Khái niệm", "1.2. Phương pháp tiếp cận", "2.3 Đánh giá")
  if (/^[0-9]+\.[0-9]+\.?\s+(.+)$/.test(clean)) {
    return `### ${clean}`;
  }

  // Level 3: Uppercase Letter sections (e.g. "A. Cơ sở lý luận", "B. Phân tích thực trạng")
  if (/^[A-Z]\.\s+([A-ZÀ-Ỹ].{2,80})$/.test(clean)) {
    return `### ${clean}`;
  }

  // Level 3: Mục / Tiểu phần (e.g. "Mục 1: ...", "Mục A: ...")
  if (/^(?:Mục|Phần phụ)\s+[0-9IVXLCDM|A-Z]+(?:\s*[:.-]\s*|\s+)(.+)$/i.test(clean)) {
    return `### ${clean}`;
  }

  // Level 4: Decimal 3-tier numbering (e.g. "1.1.1 Nhiệm vụ cụ thể", "2.1.2 Kết quả sơ bộ")
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.?\s+(.+)$/.test(clean)) {
    return `#### ${clean}`;
  }

  // Level 4: Lowercase letter with closing parenthesis as subsection (e.g. "a) Giai đoạn chuẩn bị", "b) Giai đoạn triển khai")
  if (/^[a-z]\)\s+([A-ZÀ-Ỹ].{2,60}):?$/.test(clean)) {
    return `#### ${clean}`;
  }

  // Level 4: Tiểu mục (e.g. "Tiểu mục 1. ...")
  if (/^Tiểu\s*mục\s+[0-9IVXLCDM]+(?:\s*[:.-]\s*|\s+)(.+)$/i.test(clean)) {
    return `#### ${clean}`;
  }

  // Level 5: Decimal 4-tier numbering (e.g. "1.1.1.1. Bước khởi động")
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\.?\s+(.+)$/.test(clean)) {
    return `##### ${clean}`;
  }

  // Level 6: Decimal 5-tier numbering (e.g. "1.1.1.1.1. Chi tiết bước nhỏ")
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\.?\s+(.+)$/.test(clean)) {
    return `###### ${clean}`;
  }

  return null;
}

/**
 * Completely strips markdown syntax, HTML tags, and formatting artifacts
 * for Excel cells, plain titles, and clean summaries.
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/<[^>]+>/g, '') // remove any HTML tags (<b>, <i>, <br>, etc.)
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1') // bold italic
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/___([^_]+)___/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1') // strikethrough
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/^\s*>\s*/gm, '') // blockquotes
    .replace(/^\s*[-*+•◦▪▫]\s+/gm, '• ') // list bullets
    .replace(/^\s*\d+\.\s+/gm, '') // numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/\|/g, ' ') // table pipes
    .replace(/^-{3,}$/gm, '') // hr
    .replace(/[\*_~`]/g, '') // strip any residual lone formatting marks
    .trim();
}

export interface PptxTextRun {
  text: string;
  options?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    fontSize?: number;
    breakLine?: boolean;
  };
}

export interface PptxSlideItem {
  type: 'heading' | 'bullet' | 'paragraph' | 'callout' | 'table';
  level?: number;
  runs: PptxTextRun[];
  rawText?: string;
  tableData?: string[][];
}

/**
 * Parses markdown into structured items for native PowerPoint slides with formatted runs.
 */
export function parsePptxSlideContent(
  markdownChunk: string,
  theme: DocumentTheme
): PptxSlideItem[] {
  const normalized = normalizeAndCleanMarkdown(markdownChunk);
  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: PptxSlideItem[] = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      items.push({
        type: 'heading',
        level: 1,
        runs: [{ text: stripMarkdown(line), options: { bold: true, fontSize: 24, color: theme.primaryHex } }],
      });
    } else if (line.startsWith('## ')) {
      items.push({
        type: 'heading',
        level: 2,
        runs: [{ text: stripMarkdown(line), options: { bold: true, fontSize: 20, color: theme.slideAccentHex } }],
      });
    } else if (line.startsWith('### ')) {
      items.push({
        type: 'heading',
        level: 3,
        runs: [{ text: stripMarkdown(line), options: { bold: true, fontSize: 17, color: theme.slideAccentHex } }],
      });
    } else if (line.startsWith('#### ') || line.startsWith('##### ') || line.startsWith('###### ')) {
      items.push({
        type: 'heading',
        level: 4,
        runs: [{ text: stripMarkdown(line), options: { bold: true, fontSize: 15, color: theme.slideAccentHex } }],
      });
    } else if (line.startsWith('>')) {
      const quoteText = stripMarkdown(line.replace(/^>\s*/, ''));
      items.push({
        type: 'callout',
        runs: [{ text: quoteText, options: { italic: true, fontSize: 14, color: theme.slideTextHex } }],
      });
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      const bulletContent = line.replace(/^[-•]\s+/, '');
      const runs = parseInlineRunsForPptx(bulletContent, theme, { fontSize: 15 });
      items.push({
        type: 'bullet',
        runs,
      });
    } else if (line.startsWith('|') && line.endsWith('|')) {
      // Table row
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => stripMarkdown(c));
      // If it's a separator line |---|---| ignore it
      if (cells.every((c) => /^[-:\s]+$/.test(c))) {
        continue;
      }
      items.push({
        type: 'table',
        runs: [],
        tableData: [cells],
      });
    } else {
      const runs = parseInlineRunsForPptx(line, theme, { fontSize: 15 });
      items.push({
        type: 'paragraph',
        runs,
      });
    }
  }

  return items;
}

/**
 * Converts inline bold/italic markdown and HTML tags into PowerPoint text runs without syntax leftovers.
 */
function parseInlineRunsForPptx(
  text: string,
  theme: DocumentTheme,
  baseOpts: { fontSize?: number } = {}
): PptxTextRun[] {
  const runs: PptxTextRun[] = [];
  const baseFontSize = baseOpts.fontSize || 15;

  // First convert any HTML tags in text to markdown format
  const sanitizedText = text
    .replace(/<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi, '**$1**')
    .replace(/<(?:em|i)[^>]*>(.*?)<\/(?:em|i)>/gi, '*$1*')
    .replace(/<[^>]+>/g, '');

  // Tokenize bold, italic, and regular text
  // Match ***bold italic***, **bold**, or *italic*
  const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sanitizedText)) !== null) {
    if (match.index > lastIdx) {
      const plain = sanitizedText.substring(lastIdx, match.index).replace(/[\*_]/g, '');
      if (plain) {
        runs.push({
          text: plain,
          options: { fontSize: baseFontSize, color: theme.slideTextHex },
        });
      }
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('***')) {
      runs.push({
        text: matchedStr.slice(3, -3),
        options: { bold: true, italic: true, fontSize: baseFontSize, color: theme.slideAccentHex },
      });
    } else if (matchedStr.startsWith('**')) {
      runs.push({
        text: matchedStr.slice(2, -2),
        options: { bold: true, fontSize: baseFontSize, color: theme.slideAccentHex },
      });
    } else if (matchedStr.startsWith('*')) {
      runs.push({
        text: matchedStr.slice(1, -1),
        options: { italic: true, fontSize: baseFontSize, color: theme.slideTextHex },
      });
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < sanitizedText.length) {
    const trailing = sanitizedText.substring(lastIdx).replace(/[\*_]/g, '');
    if (trailing) {
      runs.push({
        text: trailing,
        options: { fontSize: baseFontSize, color: theme.slideTextHex },
      });
    }
  }

  return runs.length > 0
    ? runs
    : [{ text: stripMarkdown(text), options: { fontSize: baseFontSize, color: theme.slideTextHex } }];
}
