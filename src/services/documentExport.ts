import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import pptxgen from 'pptxgenjs';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { DocumentData, DocumentTheme } from '../types';
import { convertMarkdownToDocx } from './markdownToDocx';

// Helper to sanitize file names
export function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 60) || 'Tai_lieu';
}

// Split content into slide chunks
export function chunkContentForSlides(
  content: string,
  chunkMode: 'charLimit' | 'paragraph' | 'heading' = 'charLimit',
  maxChars: number = 400
): string[] {
  const rawParagraphs = content.split('\n').map((p) => p.trim()).filter((p) => p.length > 0);
  if (rawParagraphs.length === 0) return ['Nội dung tài liệu'];

  if (chunkMode === 'paragraph') {
    return rawParagraphs;
  }

  if (chunkMode === 'heading') {
    const chunks: string[] = [];
    let currentChunk = '';
    rawParagraphs.forEach((p) => {
      const isHeading = p.startsWith('#') || /^[0-9]+[.)]/.test(p);
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
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  });
  if (currentChunk) chunks.push(currentChunk);

  return chunks.length > 0 ? chunks : ['Nội dung tài liệu'];
}

// 1. EXPORT MICROSOFT WORD (.docx)
export async function exportWord(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false
): Promise<Blob> {
  const doc = convertMarkdownToDocx(docData, theme, docData.includeCoverPage ?? true);
  const blob = await Packer.toBlob(doc);
  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.docx`;
    saveAs(blob, filename);
  }
  return blob;
}

// 2. EXPORT POWERPOINT (.pptx)
export async function exportPowerPoint(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false
): Promise<Blob> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: theme.bgHex };

  // Decorative border
  titleSlide.addShape('rect', {
    x: 0.5,
    y: 0.5,
    w: 12.33,
    h: 6.5,
    line: { color: theme.primaryHex, width: 2 },
    fill: { color: theme.cardBgHex, transparency: 40 },
  });

  // Title
  titleSlide.addText(docData.title || 'Tài Liệu Thuyết Trình', {
    x: 1.0,
    y: 2.0,
    w: 11.33,
    h: 1.6,
    fontSize: 34,
    bold: true,
    color: theme.primaryHex,
    align: 'center',
    fontFace: theme.id === 'fairytale' || theme.id === 'cophong' ? 'Georgia' : 'Arial',
  });

  // Subtitle
  if (docData.subtitle) {
    titleSlide.addText(docData.subtitle, {
      x: 1.2,
      y: 3.6,
      w: 10.93,
      h: 0.8,
      fontSize: 18,
      italic: true,
      color: theme.secondaryHex || theme.accentHex,
      align: 'center',
      fontFace: 'Arial',
    });
  }

  // Meta info on title slide
  const metaText = [
    docData.author ? `Tác giả: ${docData.author}` : '',
    docData.organization ? `Đơn vị: ${docData.organization}` : '',
    docData.date ? `Ngày: ${docData.date}` : '',
    `Phong cách: ${theme.name}`,
  ]
    .filter(Boolean)
    .join('  |  ');

  titleSlide.addText(metaText, {
    x: 1.0,
    y: 5.2,
    w: 11.33,
    h: 0.6,
    fontSize: 13,
    color: theme.textHex,
    align: 'center',
    fontFace: 'Arial',
  });

  // Content Slides
  const chunks = chunkContentForSlides(
    docData.content,
    docData.chunkMode,
    docData.maxCharsPerSlide || 400
  );

  chunks.forEach((chunk, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: theme.bgHex };

    // Outer decorative card
    slide.addShape('roundRect', {
      x: 0.6,
      y: 0.5,
      w: 12.13,
      h: 6.5,
      rectRadius: 0.15,
      line: { color: theme.borderHex || theme.primaryHex, width: 1.5 },
      fill: { color: theme.cardBgHex, transparency: 30 },
    });

    // Slide Header Tag
    slide.addText(`${docData.title} • Phần ${index + 1}/${chunks.length}`, {
      x: 1.0,
      y: 0.75,
      w: 10.0,
      h: 0.45,
      fontSize: 13,
      bold: true,
      color: theme.primaryHex,
      fontFace: 'Arial',
    });

    // Slide Body Text
    slide.addText(chunk, {
      x: 1.0,
      y: 1.45,
      w: 11.33,
      h: 4.8,
      fontSize: 17,
      color: theme.textHex,
      lineSpacing: 26,
      align: 'left',
      valign: 'top',
      fontFace: theme.id === 'fairytale' || theme.id === 'cophong' ? 'Georgia' : 'Arial',
    });

    // Slide Footer
    slide.addText(`Chủ đề: ${theme.name}  —  Trang ${index + 2}`, {
      x: 1.0,
      y: 6.4,
      w: 11.33,
      h: 0.35,
      fontSize: 10,
      color: theme.accentHex,
      align: 'right',
      fontFace: 'Arial',
    });
  });

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  if (!returnBlobOnly) {
    const filename = `${sanitizeFilename(docData.title)}_${theme.name}.pptx`;
    saveAs(blob, filename);
  }
  return blob;
}

// 3. EXPORT EXCEL WORKBOOK (.xlsx)
export async function exportExcel(
  docData: DocumentData,
  theme: DocumentTheme,
  returnBlobOnly = false
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = docData.author || 'Trình Định Dạng Tài Liệu';
  workbook.created = new Date();

  // Sheet 1: Nội dung chi tiết
  const sheet = workbook.addWorksheet(theme.name, {
    views: [{ showGridLines: true }],
  });

  // Title Banner
  sheet.mergeCells('B2:F2');
  const titleCell = sheet.getCell('B2');
  titleCell.value = (docData.title || 'Tài Liệu Dữ Liệu').toUpperCase();
  titleCell.font = {
    name: 'Segoe UI',
    size: 16,
    bold: true,
    color: { argb: 'FF' + theme.primaryHex },
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF' + theme.bgHex },
  };
  sheet.getRow(2).height = 36;

  // Metadata Sub-banner
  sheet.mergeCells('B3:F3');
  const metaCell = sheet.getCell('B3');
  metaCell.value = `Chủ đề: ${theme.name}  |  Tác giả: ${docData.author || 'Không ghi'}  |  Ngày tạo: ${
    docData.date || new Date().toLocaleDateString('vi-VN')
  }`;
  metaCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FF64748B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(3).height = 20;

  // Table Headers
  const headerRow = sheet.getRow(5);
  headerRow.values = ['', 'STT', 'Tiêu đề / Đoạn', 'Nội dung chi tiết', '', 'Số ký tự'];
  sheet.mergeCells('D5:E5');

  ['B5', 'C5', 'D5', 'F5'].forEach((cellAddr) => {
    const c = sheet.getCell(cellAddr);
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
  headerRow.height = 28;

  // Content Rows
  const paragraphs = docData.content
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  paragraphs.forEach((p, index) => {
    const rowIdx = 6 + index;
    const row = sheet.getRow(rowIdx);
    sheet.mergeCells(`D${rowIdx}:E${rowIdx}`);

    const isHeading = p.startsWith('#') || /^[0-9]+[.)]/.test(p);

    const cellSTT = sheet.getCell(`B${rowIdx}`);
    cellSTT.value = index + 1;
    cellSTT.alignment = { horizontal: 'center', vertical: 'middle' };

    const cellSection = sheet.getCell(`C${rowIdx}`);
    cellSection.value = isHeading ? 'Mục / Đầu mục' : `Đoạn ${index + 1}`;
    cellSection.alignment = { horizontal: 'center', vertical: 'middle' };
    cellSection.font = { bold: isHeading, size: 10 };

    const cellContent = sheet.getCell(`D${rowIdx}`);
    cellContent.value = p;
    cellContent.alignment = { wrapText: true, vertical: 'middle' };
    cellContent.font = {
      name: 'Segoe UI',
      size: 11,
      bold: isHeading,
      color: { argb: isHeading ? 'FF' + theme.primaryHex : 'FF1E293B' },
    };

    const cellCount = sheet.getCell(`F${rowIdx}`);
    cellCount.value = p.length;
    cellCount.alignment = { horizontal: 'center', vertical: 'middle' };
    cellCount.font = { size: 10, color: { argb: 'FF64748B' } };

    // Row styling: zebra stripes
    if (index % 2 === 1) {
      const stripeFill: ExcelJS.Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' },
      };
      cellSTT.fill = stripeFill;
      cellSection.fill = stripeFill;
      cellContent.fill = stripeFill;
      cellCount.fill = stripeFill;
    }

    row.height = Math.max(26, Math.ceil(p.length / 55) * 18);
  });

  sheet.getColumn('B').width = 8;
  sheet.getColumn('C').width = 16;
  sheet.getColumn('D').width = 45;
  sheet.getColumn('E').width = 45;
  sheet.getColumn('F').width = 14;

  // Sheet 2: Thống kê & Tổng quan
  const summarySheet = workbook.addWorksheet('Tổng Quan');
  summarySheet.mergeCells('B2:E2');
  const sumTitle = summarySheet.getCell('B2');
  sumTitle.value = 'THỐNG KÊ TỔNG QUAN TÀI LIỆU';
  sumTitle.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF' + theme.primaryHex } };
  sumTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  sumTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + theme.bgHex } };
  summarySheet.getRow(2).height = 32;

  const stats = [
    ['Tiêu đề tài liệu', docData.title],
    ['Phụ đề', docData.subtitle || 'Không có'],
    ['Tác giả', docData.author || 'Chưa đặt'],
    ['Đơn vị thực hiện', docData.organization || 'Chưa đặt'],
    ['Chủ đề thẩm mỹ', theme.name],
    ['Mã màu chính (Primary)', `#${theme.primaryHex}`],
    ['Mã màu nền (Background)', `#${theme.bgHex}`],
    ['Tổng số đoạn văn', paragraphs.length],
    ['Tổng số từ ước tính', docData.content.trim().split(/\s+/).length],
    ['Tổng số ký tự', docData.content.length],
    ['Ngày xuất bản', docData.date || new Date().toLocaleDateString('vi-VN')],
  ];

  stats.forEach((item, idx) => {
    const rowIdx = 4 + idx;
    const keyCell = summarySheet.getCell(`B${rowIdx}`);
    const valCell = summarySheet.getCell(`C${rowIdx}`);
    summarySheet.mergeCells(`C${rowIdx}:E${rowIdx}`);

    keyCell.value = item[0];
    keyCell.font = { bold: true, color: { argb: 'FF334155' } };
    keyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

    valCell.value = String(item[1]);
    valCell.font = { color: { argb: 'FF0F172A' } };

    summarySheet.getRow(rowIdx).height = 24;
  });

  summarySheet.getColumn('B').width = 24;
  summarySheet.getColumn('C').width = 25;
  summarySheet.getColumn('D').width = 25;
  summarySheet.getColumn('E').width = 25;

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

// 4. EXPORT PDF (.pdf) WITH HIGH ACCURACY
export async function exportPDF(
  docData: DocumentData,
  theme: DocumentTheme,
  previewElement?: HTMLElement | null,
  returnBlobOnly = false
): Promise<Blob> {
  // If an element is provided, we can render via html2canvas to ensure 100% faithful Vietnamese font rendering & borders
  if (previewElement) {
    const canvas = await html2canvas(previewElement, {
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

  // Fallback direct jsPDF generation
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const maxLineWidth = pageWidth - margin * 2;

  // Background
  doc.setFillColor(theme.rgb.bg[0], theme.rgb.bg[1], theme.rgb.bg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(theme.rgb.primary[0], theme.rgb.primary[1], theme.rgb.primary[2]);
  doc.setLineWidth(1.5);
  doc.rect(25, 25, pageWidth - 50, pageHeight - 50);

  // Title
  doc.setTextColor(theme.rgb.primary[0], theme.rgb.primary[1], theme.rgb.primary[2]);
  doc.setFontSize(22);
  doc.text(docData.title || 'Tai Lieu', margin, 70);

  // Subtitle
  if (docData.subtitle) {
    doc.setTextColor(theme.rgb.accent[0], theme.rgb.accent[1], theme.rgb.accent[2]);
    doc.setFontSize(13);
    doc.text(docData.subtitle, margin, 92);
  }

  // Body Content
  doc.setTextColor(theme.rgb.text[0], theme.rgb.text[1], theme.rgb.text[2]);
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(docData.content, maxLineWidth);
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
