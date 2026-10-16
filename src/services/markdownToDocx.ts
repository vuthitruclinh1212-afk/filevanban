import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
  Footer,
  PageNumber,
  PageBreak,
} from 'docx';
import { marked, Tokens, Token } from 'marked';
import { DocumentData, DocumentTheme } from '../types';
import { normalizeAndCleanMarkdown } from './markdownParser';

// Clean hex colors without '#'
function cleanHex(hex: string): string {
  return hex.replace(/^#/, '');
}

// Universal Word font pairings guaranteed to render 100% Vietnamese characters
function getWordFont(theme: DocumentTheme, isTitle = false): string {
  if (theme.category === 'classic') {
    return isTitle ? 'Georgia' : 'Times New Roman';
  }
  return 'Segoe UI';
}

// Subtle callout background for Word paper
function getCalloutBgFill(theme: DocumentTheme): string {
  switch (theme.id) {
    case 'cophong': return 'FAF5EB';
    case 'candy': return 'FFF1F5';
    case 'sakura': return 'FFF5F7';
    case 'vintage': return 'FDF8F0';
    case 'cyberpunk': return 'F0FDF4';
    case 'ocean': return 'F0F9FF';
    case 'baroque': return 'FFFBEB';
    case 'emerald': return 'ECFDF5';
    case 'minimal': return 'F8FAFC';
    default: return 'F8FAFC';
  }
}

interface InlineStyles {
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  color?: string;
  size?: number;
  font?: string;
}

// Parse inline tokens into docx TextRun[]
function parseInlineTokens(
  tokens: Token[] | undefined,
  theme: DocumentTheme,
  inheritedStyles: InlineStyles = {}
): TextRun[] {
  if (!tokens || tokens.length === 0) return [];

  const runs: TextRun[] = [];
  const defaultFont = getWordFont(theme, false);

  for (const token of tokens) {
    if (token.type === 'strong') {
      const strongToken = token as Tokens.Strong;
      runs.push(
        ...parseInlineTokens(strongToken.tokens, theme, {
          ...inheritedStyles,
          bold: true,
          color: inheritedStyles.color || theme.paperAccentHex,
        })
      );
    } else if (token.type === 'em') {
      const emToken = token as Tokens.Em;
      runs.push(
        ...parseInlineTokens(emToken.tokens, theme, {
          ...inheritedStyles,
          italics: true,
        })
      );
    } else if (token.type === 'codespan') {
      const codeToken = token as Tokens.Codespan;
      runs.push(
        new TextRun({
          text: codeToken.text,
          font: 'Consolas',
          size: inheritedStyles.size ? inheritedStyles.size - 2 : 20,
          color: '7C3AED',
          shading: {
            fill: 'F5F3FF',
          },
        })
      );
    } else if (token.type === 'del') {
      const delToken = token as Tokens.Del;
      runs.push(
        ...parseInlineTokens(delToken.tokens, theme, {
          ...inheritedStyles,
          strike: true,
        })
      );
    } else if (token.type === 'link') {
      const linkToken = token as Tokens.Link;
      runs.push(
        ...parseInlineTokens(linkToken.tokens, theme, {
          ...inheritedStyles,
          color: theme.primaryHex,
        })
      );
    } else if (token.type === 'text') {
      const textToken = token as Tokens.Text;
      if (textToken.tokens && textToken.tokens.length > 0) {
        runs.push(...parseInlineTokens(textToken.tokens, theme, inheritedStyles));
      } else {
        runs.push(
          new TextRun({
            text: textToken.text,
            font: inheritedStyles.font || defaultFont,
            bold: inheritedStyles.bold,
            italics: inheritedStyles.italics,
            strike: inheritedStyles.strike,
            color: inheritedStyles.color || theme.paperTextHex,
            size: inheritedStyles.size || 24, // 12pt
          })
        );
      }
    } else if (token.type === 'html') {
      const rawHtml = (token as any).raw || (token as any).text || '';
      if (/<br\s*\/?>/i.test(rawHtml)) {
        runs.push(new TextRun({ break: 1 }));
      } else {
        const clean = rawHtml.replace(/<[^>]+>/g, '').trim();
        if (clean) {
          runs.push(
            new TextRun({
              text: clean,
              font: inheritedStyles.font || defaultFont,
              bold: inheritedStyles.bold || /<(?:b|strong)\b/i.test(rawHtml),
              italics: inheritedStyles.italics || /<(?:i|em)\b/i.test(rawHtml),
              strike: inheritedStyles.strike,
              color: inheritedStyles.color || theme.paperTextHex,
              size: inheritedStyles.size || 24,
            })
          );
        }
      }
    } else {
      const rawText = ((token as any).text || (token as any).raw || '').replace(/<[^>]+>/g, '');
      if (rawText) {
        runs.push(
          new TextRun({
            text: rawText,
            font: inheritedStyles.font || defaultFont,
            bold: inheritedStyles.bold,
            italics: inheritedStyles.italics,
            strike: inheritedStyles.strike,
            color: inheritedStyles.color || theme.paperTextHex,
            size: inheritedStyles.size || 24,
          })
        );
      }
    }
  }

  return runs;
}

// Convert a Markdown table token into a styled Word Table
function buildDocxTable(tableToken: Tokens.Table, theme: DocumentTheme): Table {
  const colCount = tableToken.header.length || 1;
  const colWidthPct = Math.floor(100 / colCount);

  // 1. Header row
  const headerCells = tableToken.header.map((cell) => {
    const runs = parseInlineTokens(cell.tokens, theme, {
      bold: true,
      color: 'FFFFFF',
      size: 22,
    });

    return new TableCell({
      children: [
        new Paragraph({
          children: runs,
          alignment:
            cell.align === 'center'
              ? AlignmentType.CENTER
              : cell.align === 'right'
              ? AlignmentType.RIGHT
              : AlignmentType.LEFT,
        }),
      ],
      shading: {
        fill: cleanHex(theme.primaryHex),
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: cleanHex(theme.primaryHex) },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: cleanHex(theme.primaryHex) },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'FFFFFF' },
      },
      margins: { top: 140, bottom: 140, left: 180, right: 180 },
      width: { size: colWidthPct, type: WidthType.PERCENTAGE },
    });
  });

  const headerRow = new TableRow({
    children: headerCells,
    tableHeader: true,
  });

  // 2. Data rows with zebra striping
  const dataRows = tableToken.rows.map((rowCells, rowIdx) => {
    const isEven = rowIdx % 2 === 1;
    const rowBg = isEven ? 'F8FAFC' : 'FFFFFF';

    const cells = rowCells.map((cell) => {
      const runs = parseInlineTokens(cell.tokens, theme, {
        size: 22,
        color: theme.paperTextHex,
      });

      return new TableCell({
        children: [
          new Paragraph({
            children: runs,
            alignment:
              cell.align === 'center'
                ? AlignmentType.CENTER
                : cell.align === 'right'
                ? AlignmentType.RIGHT
                : AlignmentType.LEFT,
          }),
        ],
        shading: {
          fill: rowBg,
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        width: { size: colWidthPct, type: WidthType.PERCENTAGE },
      });
    });

    return new TableRow({
      children: cells,
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    alignment: AlignmentType.CENTER,
  });
}

// Convert a blockquote into a styled callout box
function buildDocxCallout(blockquoteToken: Tokens.Blockquote, theme: DocumentTheme): Table {
  const childParagraphs: Paragraph[] = [];

  for (const innerToken of blockquoteToken.tokens) {
    if (innerToken.type === 'paragraph') {
      const pToken = innerToken as Tokens.Paragraph;
      const runs = parseInlineTokens(pToken.tokens, theme, {
        italics: true,
        size: 22,
        color: theme.paperTextHex,
      });
      childParagraphs.push(
        new Paragraph({
          children: runs,
          spacing: { after: 100, line: 320 },
        })
      );
    } else {
      const rawText = (innerToken as any).text || (innerToken as any).raw || '';
      if (rawText.trim()) {
        childParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: rawText,
                italics: true,
                size: 22,
                color: theme.paperTextHex,
              }),
            ],
            spacing: { after: 100, line: 320 },
          })
        );
      }
    }
  }

  if (childParagraphs.length === 0) {
    childParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: blockquoteToken.text,
            italics: true,
            size: 22,
            color: theme.paperTextHex,
          }),
        ],
      })
    );
  }

  const bgFill = getCalloutBgFill(theme);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: childParagraphs,
            shading: {
              fill: cleanHex(bgFill),
            },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: cleanHex(theme.primaryHex) },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
            },
            margins: { top: 140, bottom: 140, left: 220, right: 180 },
          }),
        ],
      }),
    ],
  });
}

// Convert code block into a styled box
function buildDocxCodeBlock(codeToken: Tokens.Code): Table {
  const codeLines = codeToken.text.split('\n');
  const paragraphs = codeLines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            font: 'Consolas',
            size: 20,
            color: '0F172A',
          }),
        ],
        spacing: { line: 260 },
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: paragraphs,
            shading: {
              fill: 'F1F5F9',
            },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
          }),
        ],
      }),
    ],
  });
}

// Build paragraphs for nested lists
function buildListParagraphs(
  listToken: Tokens.List,
  theme: DocumentTheme,
  level: number = 1
): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const isOrdered = listToken.ordered;

  listToken.items.forEach((item, itemIdx) => {
    const textTokens: Token[] = [];
    const childListTokens: Tokens.List[] = [];

    if (item.tokens) {
      item.tokens.forEach((t) => {
        if (t.type === 'list') {
          childListTokens.push(t as Tokens.List);
        } else {
          textTokens.push(t);
        }
      });
    }

    const itemRuns = parseInlineTokens(textTokens, theme);

    let prefix = '';
    let prefixColor = theme.primaryHex;
    if (isOrdered) {
      prefix =
        level === 1
          ? `${itemIdx + 1}. `
          : level === 2
          ? `${String.fromCharCode(97 + itemIdx)}. `
          : `${itemIdx + 1}) `;
    } else {
      if (level === 1) {
        prefix = '• ';
        prefixColor = theme.primaryHex;
      } else if (level === 2) {
        prefix = '◦ ';
        prefixColor = theme.paperAccentHex;
      } else {
        prefix = '▪ ';
        prefixColor = theme.paperAccentHex;
      }
    }

    const leftIndent = 320 + (level - 1) * 320;
    const hangingIndent = 220;

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: prefix,
            bold: true,
            color: cleanHex(prefixColor),
            size: 24,
            font: getWordFont(theme, false),
          }),
          ...itemRuns,
        ],
        indent: { left: leftIndent + hangingIndent, hanging: hangingIndent },
        spacing: { after: 100, line: 320 },
      })
    );

    childListTokens.forEach((childList) => {
      paragraphs.push(...buildListParagraphs(childList, theme, level + 1));
    });
  });

  return paragraphs;
}

/**
 * Builds the theme-specific cover page elements based on theme.cover configuration
 */
function buildThemeCoverPage(
  docData: DocumentData,
  theme: DocumentTheme
): (Paragraph | Table)[] {
  const coverElements: (Paragraph | Table)[] = [];
  const titleFont = getWordFont(theme, true);
  const coverConfig = theme.cover;

  // Top spacing
  coverElements.push(new Paragraph({ spacing: { before: 1400 } }));

  // Theme-specific Crest / Motif Icons
  coverElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: coverConfig.icons,
          size: 32,
          color: cleanHex(theme.primaryHex),
        }),
      ],
    })
  );

  // Theme-specific Badge
  coverElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: coverConfig.badge,
          bold: true,
          size: 20,
          color: cleanHex(theme.primaryHex),
          font: titleFont,
        }),
      ],
    })
  );

  // Document Title
  coverElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: docData.title || 'Tài Liệu Văn Bản',
          bold: true,
          size: 54, // 27pt
          color: cleanHex(theme.primaryHex),
          font: titleFont,
        }),
      ],
    })
  );

  // Document Subtitle
  if (docData.subtitle) {
    coverElements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: docData.subtitle,
            italics: true,
            size: 26,
            color: cleanHex(theme.paperAccentHex),
            font: titleFont,
          }),
        ],
      })
    );
  }

  // Centered Theme Divider
  coverElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: '✦ ──────────────────────── ✦',
          bold: true,
          color: cleanHex(theme.primaryHex),
          size: 20,
        }),
      ],
    })
  );

  // Theme Philosophy / Quote
  if (coverConfig.quote) {
    coverElements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 500 },
        children: [
          new TextRun({
            text: `“ ${coverConfig.quote} ”`,
            italics: true,
            size: 20,
            color: cleanHex(theme.paperAccentHex),
          }),
        ],
      })
    );
  }

  // Metadata Table Card
  const metaRows: TableRow[] = [];
  const metaFields = [
    ['Tác giả biên soạn:', docData.author || 'Chưa đặt'],
    ['Đơn vị thực hiện:', docData.organization || 'Hệ thống Quản trị Tài liệu'],
    ['Ngày phát hành:', docData.date || new Date().toLocaleDateString('vi-VN')],
    ['Chủ đề ấn bản:', `${theme.name} • ${theme.subtitle}`],
  ];

  metaFields.forEach(([label, val]) => {
    metaRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, bold: true, size: 20, color: '64748B' })],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: val, size: 20, color: cleanHex(theme.paperTextHex) })],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 60, type: WidthType.PERCENTAGE },
          }),
        ],
      })
    );
  });

  const metaTable = new Table({
    width: { size: 75, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: metaRows,
  });

  coverElements.push(metaTable);

  // Page break to start body content on page 2
  coverElements.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  return coverElements;
}

// MAIN CONVERTER: Markdown AST -> docx.Document
export function convertMarkdownToDocx(
  docData: DocumentData,
  theme: DocumentTheme
): Document {
  const rawContent = docData.content || '';
  const normalizedContent = normalizeAndCleanMarkdown(rawContent);
  const tokens = marked.lexer(normalizedContent);

  const documentChildren: (Paragraph | Table)[] = [];
  const titleFont = getWordFont(theme, true);

  // 1. COVER PAGE (Only if includeCoverPage === true)
  if (docData.includeCoverPage) {
    documentChildren.push(...buildThemeCoverPage(docData, theme));
  } else {
    // If NO cover page, start document directly with Title Header on Page 1
    documentChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: docData.title || 'Tài Liệu Văn Bản',
            bold: true,
            size: 44, // 22pt
            color: cleanHex(theme.primaryHex),
            font: titleFont,
          }),
        ],
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: cleanHex(theme.primaryHex) },
        },
      })
    );

    if (docData.subtitle) {
      documentChildren.push(
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: docData.subtitle,
              italics: true,
              size: 24,
              color: cleanHex(theme.paperAccentHex),
            }),
          ],
        })
      );
    }
  }

  // 2. BODY CONTENT
  for (const token of tokens) {
    if (token.type === 'heading') {
      const hToken = token as Tokens.Heading;
      const level = hToken.depth;

      if (level === 1) {
        const runs =
          hToken.tokens && hToken.tokens.length > 0
            ? parseInlineTokens(hToken.tokens, theme, {
                bold: true,
                size: 34,
                color: cleanHex(theme.primaryHex),
                font: titleFont,
              })
            : [
                new TextRun({
                  text: hToken.text || '',
                  bold: true,
                  size: 34,
                  color: cleanHex(theme.primaryHex),
                  font: titleFont,
                }),
              ];

        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 180 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 12, color: cleanHex(theme.primaryHex) },
            },
            children: runs,
          })
        );
      } else if (level === 2) {
        const runs =
          hToken.tokens && hToken.tokens.length > 0
            ? parseInlineTokens(hToken.tokens, theme, {
                bold: true,
                size: 28,
                color: cleanHex(theme.paperTextHex),
                font: titleFont,
              })
            : [
                new TextRun({
                  text: hToken.text || '',
                  bold: true,
                  size: 28,
                  color: cleanHex(theme.paperTextHex),
                  font: titleFont,
                }),
              ];

        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 140 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 24, color: cleanHex(theme.primaryHex) },
            },
            indent: { left: 140 },
            children: runs,
          })
        );
      } else {
        const runs =
          hToken.tokens && hToken.tokens.length > 0
            ? parseInlineTokens(hToken.tokens, theme, {
                bold: true,
                size: 24,
                color: cleanHex(theme.paperAccentHex),
                font: titleFont,
              })
            : [
                new TextRun({
                  text: hToken.text || '',
                  bold: true,
                  size: 24,
                  color: cleanHex(theme.paperAccentHex),
                  font: titleFont,
                }),
              ];

        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 100 },
            children: runs,
          })
        );
      }
    } else if (token.type === 'paragraph') {
      const pToken = token as Tokens.Paragraph;
      const runs = parseInlineTokens(pToken.tokens, theme);

      documentChildren.push(
        new Paragraph({
          children: runs,
          spacing: { after: 180, line: 340 },
          indent: { firstLine: 360 },
        })
      );
    } else if (token.type === 'list') {
      const listToken = token as Tokens.List;
      documentChildren.push(...buildListParagraphs(listToken, theme, 1));
    } else if (token.type === 'table') {
      const tToken = token as Tokens.Table;
      documentChildren.push(
        new Paragraph({ spacing: { before: 180 } }),
        buildDocxTable(tToken, theme),
        new Paragraph({ spacing: { after: 200 } })
      );
    } else if (token.type === 'blockquote') {
      const bToken = token as Tokens.Blockquote;
      documentChildren.push(
        new Paragraph({ spacing: { before: 160 } }),
        buildDocxCallout(bToken, theme),
        new Paragraph({ spacing: { after: 180 } })
      );
    } else if (token.type === 'code') {
      const cToken = token as Tokens.Code;
      documentChildren.push(
        new Paragraph({ spacing: { before: 140 } }),
        buildDocxCodeBlock(cToken),
        new Paragraph({ spacing: { after: 180 } })
      );
    } else if (token.type === 'hr') {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
          children: [
            new TextRun({
              text: '—'.repeat(30),
              color: cleanHex(theme.primaryHex),
              size: 20,
            }),
          ],
        })
      );
    }
  }

  // 3. HEADER & FOOTER CONFIGURATION
  const hasHeaderFooter = docData.includeHeaderFooter;
  const hasPageNumber = docData.includePageNumber;
  const headerText = docData.customHeaderText?.trim() || docData.title || 'Tài Liệu Văn Bản';
  const footerText = docData.customFooterText?.trim() || `${theme.name} Edition`;

  let runningHeader: Header | undefined = undefined;
  let runningFooter: Footer | undefined = undefined;

  if (hasHeaderFooter) {
    runningHeader = new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: headerText,
              size: 18,
              color: '94A3B8',
              font: 'Segoe UI',
            }),
          ],
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
          },
        }),
      ],
    });
  }

  if (hasHeaderFooter || hasPageNumber) {
    const footerRuns: TextRun[] = [];

    if (hasHeaderFooter) {
      footerRuns.push(
        new TextRun({
          text: footerText,
          size: 18,
          color: '94A3B8',
          font: 'Segoe UI',
        })
      );
    }

    if (hasPageNumber) {
      if (hasHeaderFooter) {
        footerRuns.push(
          new TextRun({
            text: '  |  Trang ',
            size: 18,
            color: '94A3B8',
            font: 'Segoe UI',
          })
        );
      } else {
        footerRuns.push(
          new TextRun({
            text: 'Trang ',
            size: 18,
            color: '94A3B8',
            font: 'Segoe UI',
          })
        );
      }

      footerRuns.push(
        new TextRun({
          children: [PageNumber.CURRENT],
          size: 18,
          color: cleanHex(theme.primaryHex),
          bold: true,
          font: 'Segoe UI',
        }),
        new TextRun({
          text: ' / ',
          size: 18,
          color: '94A3B8',
          font: 'Segoe UI',
        }),
        new TextRun({
          children: [PageNumber.TOTAL_PAGES],
          size: 18,
          color: '94A3B8',
          font: 'Segoe UI',
        })
      );
    }

    runningFooter = new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: footerRuns,
          border: hasHeaderFooter
            ? { top: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' } }
            : undefined,
        }),
      ],
    });
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers: runningHeader ? { default: runningHeader } : undefined,
        footers: runningFooter ? { default: runningFooter } : undefined,
        children: documentChildren,
      },
    ],
  });
}
