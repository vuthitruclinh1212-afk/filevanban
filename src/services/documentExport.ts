import { Packer } from 'docx';
import pptxgen from 'pptxgenjs';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { DocumentData, DocumentTheme } from '../types';
import { convertMarkdownToDocx } from './markdownToDocx';
import {
  normalizeAndCleanMarkdown,
  stripMarkdown,
  parsePptxSlideContent,
} from './markdownParser';
import { resolveMarkdownImagesForExport } from './aiImageService';
import { getThemeSvgDataUrl } from '../data/themeArtwork';

// Helper to sanitize file names
export function sanitizeFilename(name: string): string {
  return (
    name
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 60) || 'Tai_lieu'
  );
}

// Split content into slide chunks
export function chunkContentForSlides(
  content: string,
  chunkMode: 'charLimit' | 'paragraph' | 'heading' = 'charLimit',
  maxChars: number = 400
): string[] {
  const normalized = normalizeAndCleanMarkdown(content);
  const rawParagraphs = normalized
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (rawParagraphs.length === 0) return ['Nội dung tài liệu'];

  if (chunkMode === 'paragraph') {
    return rawParagraphs;
  }

  if (chunkMode === 'heading') {
    const chunks: string[] = [];
    let currentChunk = '';
    rawParagraphs.forEach((p) => {
      const isHeading = p.startsWith('#') || /^(Chương|Phần|Mục)\s+[0-9IVXLCDM]+/i.test(p);
      if (isHeading && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = p;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + p;
      }
    });
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.length > 0 ? chunks : rawParagraphs;
  }

  // Default: charLimit
  const chunks: string[] = [];
  let currentChunk = '';
  rawParagraphs.forEach((p) => {
    if ((currentChunk + '\n\n' + p).length > maxChars) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  });
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks.length > 0 ? chunks : ['Nội dung tài liệu'];
}

// 1. EXPORT MICROSOFT WORD (.docx)
export async function exportWord(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false,
  onProgress?: (msg: string) => void
): Promise<Blob> {
  // Pre-resolve any AI image prompts into real image data URLs
  const { resolvedMarkdown } = await resolveMarkdownImagesForExport(docData.content, theme, onProgress);
  const updatedDocData = { ...docData, content: resolvedMarkdown };

  const doc = convertMarkdownToDocx(updatedDocData, theme);
  const blob = await Packer.toBlob(doc);
  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.docx`;
    saveAs(blob, filename);
  }
  return blob;
}

// 2. EXPORT POWERPOINT (.pptx) - Clean, parsed typography with theme cover artwork & tables
export async function exportPowerPoint(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false,
  onProgress?: (msg: string) => void
): Promise<Blob> {
  // Pre-resolve any AI image prompts into real image data URLs
  const { resolvedMarkdown } = await resolveMarkdownImagesForExport(docData.content, theme, onProgress);
  const updatedDocData = { ...docData, content: resolvedMarkdown };

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const titleFont = theme.category === 'classic' ? 'Georgia' : 'Arial';
  const bodyFont = 'Arial';

  // ===================== TITLE SLIDE (Only if includeCoverPage === true) =====================
  if (updatedDocData.includeCoverPage) {
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: theme.bgHex };

    // Decorative theme border card
    titleSlide.addShape('rect', {
      x: 0.6,
      y: 0.5,
      w: 12.13,
      h: 6.5,
      line: { color: theme.primaryHex, width: 2 },
      fill: { color: theme.cardBgHex, transparency: 15 },
    });

    // Embed Dedicated Theme Vector Illustration on Right
    try {
      const artworkDataUrl = getThemeSvgDataUrl(theme.id);
      titleSlide.addImage({
        data: artworkDataUrl,
        x: 7.2,
        y: 1.4,
        w: 5.0,
        h: 2.81,
      });
    } catch (e) {
      console.warn('Title slide artwork embed error:', e);
    }

    // Left Column Content:
    // Theme Motif Icons
    titleSlide.addText(theme.cover.icons, {
      x: 1.0,
      y: 1.0,
      w: 5.8,
      h: 0.5,
      fontSize: 22,
      color: theme.primaryHex,
      align: 'left',
    });

    // Theme Badge
    titleSlide.addText(theme.cover.badge, {
      x: 1.0,
      y: 1.6,
      w: 5.8,
      h: 0.45,
      fontSize: 12,
      bold: true,
      color: theme.slideAccentHex,
      align: 'left',
      fontFace: titleFont,
    });

    // Document Title
    titleSlide.addText(updatedDocData.title || 'Tài Liệu Thuyết Trình', {
      x: 1.0,
      y: 2.2,
      w: 5.8,
      h: 1.4,
      fontSize: 28,
      bold: true,
      color: theme.primaryHex,
      align: 'left',
      fontFace: titleFont,
    });

    // Subtitle
    if (updatedDocData.subtitle) {
      titleSlide.addText(updatedDocData.subtitle, {
        x: 1.0,
        y: 3.7,
        w: 5.8,
        h: 0.6,
        fontSize: 15,
        italic: true,
        color: theme.slideAccentHex,
        align: 'left',
        fontFace: bodyFont,
      });
    }

    // Theme Quote
    if (theme.cover.quote) {
      titleSlide.addText(`“${theme.cover.quote}”`, {
        x: 1.5,
        y: 4.6,
        w: 10.33,
        h: 0.6,
        fontSize: 12,
        italic: true,
        color: theme.slideTextHex,
        align: 'center',
        fontFace: titleFont,
      });
    }

    // Meta details footer on title slide
    const metaDetails = [
      docData.author ? `Tác giả: ${docData.author}` : '',
      docData.organization ? `Đơn vị: ${docData.organization}` : '',
      docData.date ? `Ngày: ${docData.date}` : '',
      `Ấn bản: ${theme.name}`,
    ]
      .filter(Boolean)
      .join('  •  ');

    titleSlide.addText(metaDetails, {
      x: 1.0,
      y: 5.6,
      w: 11.33,
      h: 0.5,
      fontSize: 12,
      color: theme.slideTextHex,
      align: 'center',
      fontFace: bodyFont,
    });
  }

  // ===================== CONTENT SLIDES =====================
  const chunks = chunkContentForSlides(
    docData.content,
    docData.chunkMode,
    docData.maxCharsPerSlide || 400
  );

  const totalContentSlides = chunks.length;

  chunks.forEach((chunk, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: theme.bgHex };

    // Card frame
    slide.addShape('roundRect', {
      x: 0.6,
      y: 0.5,
      w: 12.13,
      h: 6.5,
      rectRadius: 0.12,
      line: { color: theme.borderHex || theme.primaryHex, width: 1.5 },
      fill: { color: theme.cardBgHex, transparency: 15 },
    });

    // Running Header (if enabled)
    if (docData.includeHeaderFooter) {
      const headerText = docData.customHeaderText?.trim() || docData.title || 'Tài Liệu Thuyết Trình';
      slide.addText(`${headerText}  •  Phần ${index + 1}/${totalContentSlides}`, {
        x: 1.0,
        y: 0.7,
        w: 11.33,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: theme.primaryHex,
        fontFace: bodyFont,
      });
    }

    // Parse slide items to avoid raw markdown
    const parsedItems = parsePptxSlideContent(chunk, theme);

    let currentY = 1.35;
    const maxY = 6.2;

    parsedItems.forEach((item) => {
      if (currentY >= maxY) return;

      if (item.type === 'heading') {
        const hText = item.runs.map((r) => r.text).join(' ');
        const hSize = item.level === 1 ? 22 : item.level === 2 ? 18 : 16;
        slide.addText(hText, {
          x: 1.0,
          y: currentY,
          w: 11.33,
          h: 0.6,
          fontSize: hSize,
          bold: true,
          color: item.level === 1 ? theme.primaryHex : theme.slideAccentHex,
          fontFace: titleFont,
        });
        currentY += 0.65;
      } else if (item.type === 'callout') {
        // Draw callout box
        const calloutText = item.runs.map((r) => r.text).join(' ');
        slide.addShape('roundRect', {
          x: 1.0,
          y: currentY,
          w: 11.33,
          h: 0.9,
          rectRadius: 0.08,
          line: { color: theme.primaryHex, width: 2 },
          fill: { color: theme.bgHex, transparency: 40 },
        });
        slide.addText(calloutText, {
          x: 1.2,
          y: currentY + 0.1,
          w: 10.93,
          h: 0.7,
          fontSize: 14,
          italic: true,
          color: theme.slideTextHex,
          fontFace: bodyFont,
        });
        currentY += 1.05;
      } else if (item.type === 'bullet') {
        const textRuns = item.runs.map((r) => ({
          text: r.text,
          options: {
            bold: r.options?.bold,
            italic: r.options?.italic,
            color: r.options?.color || theme.slideTextHex,
            fontSize: 15,
            fontFace: bodyFont,
          },
        }));

        slide.addText(textRuns, {
          x: 1.2,
          y: currentY,
          w: 11.13,
          h: 0.45,
          bullet: { type: 'bullet', code: '2022' },
          color: theme.slideTextHex,
          fontFace: bodyFont,
        });
        currentY += 0.45;
      } else if (item.type === 'table' && item.tableData && item.tableData.length > 0) {
        // High-contrast PowerPoint table rendering
        const numCols = Math.max(...item.tableData.map((r) => r.length), 1);
        const colWidth = 11.33 / numCols;

        const tableRows = item.tableData.map((row, rIdx) => {
          const isHeader = rIdx === 0;
          return row.map((cellText) => ({
            text: cellText,
            options: {
              fontSize: isHeader ? 12 : 11,
              bold: isHeader,
              color: isHeader ? 'FFFFFF' : theme.slideTextHex,
              fill: isHeader
                ? { color: theme.primaryHex }
                : rIdx % 2 === 0
                ? { color: theme.cardBgHex }
                : { color: theme.bgHex },
              align: 'left' as const,
              valign: 'middle' as const,
              fontFace: bodyFont,
            },
          }));
        });

        try {
          slide.addTable(tableRows, {
            x: 1.0,
            y: currentY,
            w: 11.33,
            colW: Array(numCols).fill(colWidth),
            border: { type: 'solid', pt: 1, color: theme.borderHex || theme.primaryHex },
          });
          currentY += Math.min(2.8, tableRows.length * 0.38 + 0.3);
        } catch (tableErr) {
          console.warn('PowerPoint slide addTable error:', tableErr);
          currentY += 0.5;
        }
      } else if (item.type === 'image' && item.imageUrl) {
        try {
          slide.addImage({
            data: item.imageUrl,
            x: 2.2,
            y: currentY,
            w: 8.93,
            h: 3.2,
          });
          currentY += 3.35;
        } catch (imgErr) {
          console.warn('PowerPoint slide image add error:', imgErr);
        }
      } else {
        // Normal paragraph
        const textRuns = item.runs.map((r) => ({
          text: r.text,
          options: {
            bold: r.options?.bold,
            italic: r.options?.italic,
            color: r.options?.color || theme.slideTextHex,
            fontSize: 15,
            fontFace: bodyFont,
          },
        }));

        slide.addText(textRuns, {
          x: 1.0,
          y: currentY,
          w: 11.33,
          h: 0.55,
          fontFace: bodyFont,
          lineSpacing: 22,
        });
        currentY += 0.6;
      }
    });

    // Running Footer & Page Numbering
    if (docData.includeHeaderFooter || docData.includePageNumber) {
      const footerParts: string[] = [];
      if (docData.includeHeaderFooter) {
        footerParts.push(docData.customFooterText?.trim() || `${theme.name} Edition`);
      }
      if (docData.includePageNumber) {
        footerParts.push(`Trang ${index + 1} / ${totalContentSlides}`);
      }

      slide.addText(footerParts.join('  •  '), {
        x: 1.0,
        y: 6.4,
        w: 11.33,
        h: 0.35,
        fontSize: 11,
        color: theme.slideAccentHex,
        align: 'right',
        fontFace: bodyFont,
      });
    }
  });

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.pptx`;
    saveAs(blob, filename);
  }
  return blob;
}

// 3. EXPORT EXCEL WORKBOOK (.xlsx) - Completely stripped of raw markdown
export async function exportExcel(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = docData.author || 'Trình Định Dạng Tài Liệu';
  workbook.created = new Date();

  // ===================== SHEET 1: TRANG BÌA (If includeCoverPage === true) =====================
  if (docData.includeCoverPage) {
    const coverSheet = workbook.addWorksheet('Trang Bìa', {
      views: [{ showGridLines: true }],
    });

    coverSheet.mergeCells('B2:F2');
    const badgeCell = coverSheet.getCell('B2');
    badgeCell.value = theme.cover.badge;
    badgeCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF' + theme.primaryHex } };
    badgeCell.alignment = { horizontal: 'center', vertical: 'middle' };
    coverSheet.getRow(2).height = 24;

    coverSheet.mergeCells('B3:F4');
    const titleCell = coverSheet.getCell('B3');
    titleCell.value = (docData.title || 'TÀI LIỆU VĂN BẢN').toUpperCase();
    titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF' + theme.primaryHex } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + theme.bgHex } };

    if (docData.subtitle) {
      coverSheet.mergeCells('B5:F5');
      const subCell = coverSheet.getCell('B5');
      subCell.value = docData.subtitle;
      subCell.font = { name: 'Segoe UI', size: 12, italic: true, color: { argb: 'FF' + theme.paperAccentHex } };
      subCell.alignment = { horizontal: 'center', vertical: 'middle' };
      coverSheet.getRow(5).height = 22;
    }

    // Metadata Table on Cover Sheet
    const metaInfo = [
      ['Biểu tượng chủ đề', theme.cover.icons],
      ['Tác giả biên soạn', docData.author || 'Chưa đặt'],
      ['Đơn vị thực hiện', docData.organization || 'Hệ thống Quản trị Tài liệu'],
      ['Ngày phát hành', docData.date || new Date().toLocaleDateString('vi-VN')],
      ['Phong cách thẩm mỹ', `${theme.name} (${theme.subtitle})`],
      ['Châm ngôn chủ đề', `“${theme.cover.quote}”`],
    ];

    metaInfo.forEach(([label, val], idx) => {
      const r = 7 + idx;
      coverSheet.getCell(`B${r}`).value = label;
      coverSheet.getCell(`B${r}`).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF475569' } };
      coverSheet.getCell(`B${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

      coverSheet.mergeCells(`C${r}:F${r}`);
      coverSheet.getCell(`C${r}`).value = val;
      coverSheet.getCell(`C${r}`).font = { name: 'Segoe UI', color: { argb: 'FF0F172A' } };
      coverSheet.getRow(r).height = 24;
    });

    coverSheet.getColumn('B').width = 24;
    coverSheet.getColumn('C').width = 25;
    coverSheet.getColumn('D').width = 25;
    coverSheet.getColumn('E').width = 25;
  }

  // ===================== SHEET 2: DỮ LIỆU CHI TIẾT =====================
  const dataSheet = workbook.addWorksheet('Dữ Liệu Chi Tiết', {
    views: [{ showGridLines: true }],
  });

  // Table Headers
  const headerRow = dataSheet.getRow(2);
  headerRow.values = ['', 'STT', 'Phân Loại', 'Nội Dung Chi Tiết (Đã Lọc Markdown)', '', 'Ký Tự'];
  dataSheet.mergeCells('D2:E2');

  ['B2', 'C2', 'D2', 'F2'].forEach((cellAddr) => {
    const c = dataSheet.getCell(cellAddr);
    c.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + theme.primaryHex },
    };
    c.font = {
      name: 'Segoe UI',
      color: { argb: 'FFFFFFFF' },
      bold: true,
      size: 11,
    };
    c.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  headerRow.height = 30;

  // Split content and clean markdown
  const normalized = normalizeAndCleanMarkdown(docData.content);
  const rawParagraphs = normalized
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  rawParagraphs.forEach((rawLine, index) => {
    const rowIdx = 3 + index;
    const row = dataSheet.getRow(rowIdx);
    dataSheet.mergeCells(`D${rowIdx}:E${rowIdx}`);

    const isHeading = rawLine.startsWith('#') || /^(Chương|Phần|Mục)\s+[0-9IVXLCDM]+/i.test(rawLine);
    const cleanContent = stripMarkdown(rawLine);

    // STT
    const cellSTT = dataSheet.getCell(`B${rowIdx}`);
    cellSTT.value = index + 1;
    cellSTT.alignment = { horizontal: 'center', vertical: 'middle' };

    // Section Type
    const cellType = dataSheet.getCell(`C${rowIdx}`);
    cellType.value = isHeading ? 'Đầu Mục #' : rawLine.startsWith('- ') ? 'Gạch Đầu Dòng' : `Đoạn ${index + 1}`;
    cellType.alignment = { horizontal: 'center', vertical: 'middle' };
    cellType.font = { bold: isHeading, size: 10 };

    // Clean Content
    const cellContent = dataSheet.getCell(`D${rowIdx}`);
    cellContent.value = cleanContent;
    cellContent.alignment = { wrapText: true, vertical: 'middle' };
    cellContent.font = {
      name: 'Segoe UI',
      size: 11,
      bold: isHeading,
      color: { argb: isHeading ? 'FF' + theme.primaryHex : 'FF1E293B' },
    };

    // Character Count
    const cellCount = dataSheet.getCell(`F${rowIdx}`);
    cellCount.value = cleanContent.length;
    cellCount.alignment = { horizontal: 'center', vertical: 'middle' };
    cellCount.font = { size: 10, color: { argb: 'FF64748B' } };

    // Zebra striping
    if (index % 2 === 1) {
      const stripeFill: ExcelJS.Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
      cellSTT.fill = stripeFill;
      cellType.fill = stripeFill;
      cellContent.fill = stripeFill;
      cellCount.fill = stripeFill;
    }

    row.height = Math.max(26, Math.ceil(cleanContent.length / 55) * 18);
  });

  dataSheet.getColumn('B').width = 8;
  dataSheet.getColumn('C').width = 16;
  dataSheet.getColumn('D').width = 45;
  dataSheet.getColumn('E').width = 45;
  dataSheet.getColumn('F').width = 14;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.xlsx`;
    saveAs(blob, filename);
  }
  return blob;
}

// 4. EXPORT PDF (.pdf) - High Accuracy & zero character errors
export async function exportPDF(
  docData: DocumentData,
  theme: DocumentTheme,
  previewElement?: HTMLElement | null,
  returnBlobOnly = false,
  onProgress?: (msg: string) => void
): Promise<Blob> {
  // Pre-resolve any AI image prompts into real image data URLs
  const { resolvedMarkdown } = await resolveMarkdownImagesForExport(docData.content, theme, onProgress);
  const updatedDocData = { ...docData, content: resolvedMarkdown };

  // Locate print container if previewElement is not directly passed
  const targetElement =
    previewElement ||
    document.getElementById('pdf-render-target') ||
    document.querySelector('.pdf-preview-container');

  if (targetElement) {
    const canvas = await html2canvas(targetElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: `#${theme.bgHex}`,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const blob = pdf.output('blob');
    if (!returnBlobOnly) {
      const filename = `${sanitizeFilename(docData.title)}_${theme.name}.pdf`;
      saveAs(blob, filename);
    }
    return blob;
  }

  // Fallback high-contrast vector PDF with sanitized Vietnamese text
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFillColor(theme.rgb.bg[0], theme.rgb.bg[1], theme.rgb.bg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(theme.rgb.primary[0], theme.rgb.primary[1], theme.rgb.primary[2]);
  doc.setLineWidth(1.5);
  doc.rect(25, 25, pageWidth - 50, pageHeight - 50);

  doc.setTextColor(theme.rgb.primary[0], theme.rgb.primary[1], theme.rgb.primary[2]);
  doc.setFontSize(22);
  doc.text(stripMarkdown(docData.title || 'Tai Lieu'), margin, 70);

  if (docData.subtitle) {
    doc.setTextColor(theme.rgb.accent[0], theme.rgb.accent[1], theme.rgb.accent[2]);
    doc.setFontSize(13);
    doc.text(stripMarkdown(docData.subtitle), margin, 92);
  }

  const cleanBody = stripMarkdown(docData.content);
  const lines = doc.splitTextToSize(cleanBody, maxLineWidth);
  let y = docData.subtitle ? 120 : 100;

  for (let i = 0; i < lines.length; i++) {
    if (y > pageHeight - 60) {
      doc.addPage();
      doc.setFillColor(theme.rgb.bg[0], theme.rgb.bg[1], theme.rgb.bg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setDrawColor(theme.rgb.primary[0], theme.rgb.primary[1], theme.rgb.primary[2]);
      doc.rect(25, 25, pageWidth - 50, pageHeight - 50);
      y = 60;
    }
    doc.text(lines[i], margin, y);
    y += 18;
  }

  const blob = doc.output('blob');
  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.pdf`;
    saveAs(blob, filename);
  }
  return blob;
}

// 5. EXPORT ALL FORMATS IN A SINGLE ZIP
export async function exportAllFormats(
  docData: DocumentData,
  theme: DocumentTheme,
  previewElement?: HTMLElement | null,
  onProgress?: (msg: string) => void
): Promise<void> {
  const zip = new JSZip();
  const baseName = sanitizeFilename(docData.title);

  onProgress?.('Đang tạo Microsoft Word (.docx)...');
  const docxBlob = await exportWord(docData, theme, true);
  zip.file(`${baseName}_${theme.name}.docx`, docxBlob);

  onProgress?.('Đang tạo PowerPoint (.pptx)...');
  const pptxBlob = await exportPowerPoint(docData, theme, true);
  zip.file(`${baseName}_${theme.name}.pptx`, pptxBlob);

  onProgress?.('Đang tạo Bảng tính Excel (.xlsx)...');
  const xlsxBlob = await exportExcel(docData, theme, true);
  zip.file(`${baseName}_${theme.name}.xlsx`, xlsxBlob);

  onProgress?.('Đang tạo Tài liệu PDF (.pdf)...');
  const pdfBlob = await exportPDF(docData, theme, previewElement, true);
  zip.file(`${baseName}_${theme.name}.pdf`, pdfBlob);

  onProgress?.('Đang nén file ZIP trọn bộ...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${baseName}_TronBo_${theme.name}.zip`);
}
