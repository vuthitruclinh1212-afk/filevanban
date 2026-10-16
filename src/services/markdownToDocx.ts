import {
  Document,
  Packer,
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

// Convert hex colors without '#'
function cleanHex(hex: string): string {
  return hex.replace(/^#/, '');
}

// Convert inline tokens into docx TextRun[]
function parseInlineTokens(
  tokens: Token[] | undefined,
  theme: DocumentTheme,
  inheritedStyles: { bold?: boolean; italics?: boolean; color?: string; size?: number } = {}
): TextRun[] {
  if (!tokens || tokens.length === 0) return [];

  const runs: TextRun[] = [];

  for (const token of tokens) {
    if (token.type === 'strong') {
      const strongToken = token as Tokens.Strong;
      runs.push(
        ...parseInlineTokens(strongToken.tokens, theme, {
          ...inheritedStyles,
          bold: true,
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
          color: '9333EA', // purple code text
          shading: {
            fill: 'F3E8FF', // subtle purple tint
          },
        })
      );
    } else if (token.type === 'del') {
      const delToken = token as Tokens.Del;
      runs.push(
        ...parseInlineTokens(delToken.tokens, theme, {
          ...inheritedStyles,
        }).map(
          (r) =>
            new TextRun({
              text: (r as any).text || '',
              strike: true,
              ...inheritedStyles,
            })
        )
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
            bold: inheritedStyles.bold,
            italics: inheritedStyles.italics,
            color: inheritedStyles.color || (theme.id === 'fairytale' ? '1B263B' : theme.textHex),
            size: inheritedStyles.size || 24, // 12pt
          })
        );
      }
    } else {
      // Fallback raw text
      const rawText = (token as any).text || (token as any).raw || '';
      if (rawText) {
        runs.push(
          new TextRun({
            text: rawText,
            bold: inheritedStyles.bold,
            italics: inheritedStyles.italics,
            color: inheritedStyles.color || (theme.id === 'fairytale' ? '1B263B' : theme.textHex),
            size: inheritedStyles.size || 24,
          })
        );
      }
    }
  }

  return runs;
}

// Convert a single Markdown table token into a styled Word Table
function buildDocxTable(tableToken: Tokens.Table, theme: DocumentTheme): Table {
  const colCount = tableToken.header.length || 1;
  const colWidthPct = Math.floor(100 / colCount);

  // 1. Header row
  const headerCells = tableToken.header.map((cell) => {
    const runs = parseInlineTokens(cell.tokens, theme, {
      bold: true,
      color: 'FFFFFF',
      size: 22, // 11pt
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
        fill: theme.primaryHex,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: theme.primaryHex },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: theme.primaryHex },
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

  // 2. Data rows
  const dataRows = tableToken.rows.map((rowCells, rowIdx) => {
    const isEven = rowIdx % 2 === 1;
    const rowBg = isEven ? 'F8FAFC' : 'FFFFFF';

    const cells = rowCells.map((cell, cellIdx) => {
      const runs = parseInlineTokens(cell.tokens, theme, {
        size: 22,
        color: theme.id === 'fairytale' ? '1B263B' : theme.textHex,
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
          top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
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

// Convert a blockquote into a styled callout box (Single-cell Table with colored left bar)
function buildDocxCallout(blockquoteToken: Tokens.Blockquote, theme: DocumentTheme): Table {
  // Extract text or paragraph tokens inside blockquote
  const childParagraphs: Paragraph[] = [];

  for (const innerToken of blockquoteToken.tokens) {
    if (innerToken.type === 'paragraph') {
      const pToken = innerToken as Tokens.Paragraph;
      const runs = parseInlineTokens(pToken.tokens, theme, {
        italics: true,
        size: 22,
        color: theme.id === 'fairytale' ? '1B263B' : theme.textHex,
      });
      childParagraphs.push(
        new Paragraph({
          children: runs,
          spacing: { after: 120, line: 340 },
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
                color: theme.id === 'fairytale' ? '1B263B' : theme.textHex,
              }),
            ],
            spacing: { after: 120, line: 340 },
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
          }),
        ],
      })
    );
  }

  // Callout background: subtle theme tint or slate-50
  const bgFill =
    theme.id === 'cophong' ? 'FDF9EE' : theme.id === 'candy' ? 'FFF5F8' : 'F8FAFC';

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: childParagraphs,
            shading: {
              fill: bgFill,
            },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: theme.primaryHex }, // 3pt accent bar
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
            },
            margins: { top: 160, bottom: 160, left: 240, right: 180 },
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
            size: 20, // 10pt
            color: '1E293B',
          }),
        ],
        spacing: { line: 280 },
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
              fill: 'F1F5F9', // light gray
            },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
          }),
        ],
      }),
    ],
  });
}

// MAIN CONVERTER: Markdown AST -> docx.Document elements
export function convertMarkdownToDocx(
  docData: DocumentData,
  theme: DocumentTheme,
  includeCoverPage = true
): Document {
  const content = docData.content || '';
  const tokens = marked.lexer(content);

  const documentChildren: (Paragraph | Table)[] = [];

  // ===================== SECTION 1: COVER PAGE (OPTIONAL) =====================
  if (includeCoverPage) {
    // Top Spacing
    documentChildren.push(
      new Paragraph({
        spacing: { before: 1800 },
      })
    );

    // Decorative theme tag
    documentChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [
          new TextRun({
            text: `❖ TÀI LIỆU BIÊN SOẠN CHUẨN • ${theme.name.toUpperCase()} ❖`,
            bold: true,
            size: 20,
            color: theme.primaryHex,
          }),
        ],
      })
    );

    // Cover Title
    documentChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: docData.title || 'Tài Liệu Văn Bản',
            bold: true,
            size: 54, // 27pt
            color: theme.primaryHex,
          }),
        ],
      })
    );

    // Cover Subtitle
    if (docData.subtitle) {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 500 },
          children: [
            new TextRun({
              text: docData.subtitle,
              italics: true,
              size: 26, // 13pt
              color: theme.accentHex,
            }),
          ],
        })
      );
    }

    // Centered Divider Line
    documentChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [
          new TextRun({
            text: '✦ ─────────────── ✦',
            bold: true,
            color: theme.primaryHex,
            size: 22,
          }),
        ],
      })
    );

    // Metadata Table Card
    const metaRows: TableRow[] = [];

    const metaFields = [
      ['Tác giả biên soạn:', docData.author || 'Chưa đặt'],
      ['Đơn vị thực hiện:', docData.organization || 'Hệ thống Quản trị Tài liệu'],
      ['Ngày phát hành:', docData.date || new Date().toLocaleDateString('vi-VN')],
      ['Chủ đề phong cách:', `${theme.name} (${theme.subtitle})`],
    ];

    metaFields.forEach(([label, val]) => {
      metaRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: 20, color: '475569' })],
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
                  children: [new TextRun({ text: val, size: 20, color: '0F172A' })],
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
      width: { size: 70, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      rows: metaRows,
    });

    documentChildren.push(metaTable);

    // Page Break to start real content on Page 2
    documentChildren.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );
  }

  // ===================== SECTION 2: BODY CONTENT =====================

  for (const token of tokens) {
    if (token.type === 'heading') {
      const hToken = token as Tokens.Heading;
      const level = hToken.depth;
      const runs = parseInlineTokens(hToken.tokens, theme, {
        bold: true,
      });

      if (level === 1) {
        // Heading 1: Large bold + colored bottom border
        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 180 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 12, color: theme.primaryHex },
            },
            children: runs.map(
              (r) =>
                new TextRun({
                  text: (r as any).text || '',
                  bold: true,
                  size: 34, // 17pt
                  color: theme.primaryHex,
                })
            ),
          })
        );
      } else if (level === 2) {
        // Heading 2: Medium bold + colored left bar
        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 140 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 24, color: theme.primaryHex },
            },
            indent: { left: 140 },
            children: runs.map(
              (r) =>
                new TextRun({
                  text: (r as any).text || '',
                  bold: true,
                  size: 28, // 14pt
                  color: theme.id === 'fairytale' ? '1B263B' : theme.textHex,
                })
            ),
          })
        );
      } else {
        // Heading 3 & deeper
        documentChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 100 },
            children: runs.map(
              (r) =>
                new TextRun({
                  text: (r as any).text || '',
                  bold: true,
                  size: 24, // 12pt
                  color: theme.accentHex,
                })
            ),
          })
        );
      }
    } else if (token.type === 'paragraph') {
      const pToken = token as Tokens.Paragraph;
      const runs = parseInlineTokens(pToken.tokens, theme);

      documentChildren.push(
        new Paragraph({
          children: runs,
          spacing: { after: 200, line: 360 }, // 1.5 line height
          indent: { firstLine: 360 }, // Standard paragraph indentation
        })
      );
    } else if (token.type === 'list') {
      const listToken = token as Tokens.List;
      const isOrdered = listToken.ordered;

      listToken.items.forEach((item, itemIdx) => {
        const itemRuns = parseInlineTokens(item.tokens, theme);
        const prefix = isOrdered ? `${itemIdx + 1}. ` : '• ';

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: prefix,
                bold: true,
                color: theme.primaryHex,
                size: 24,
              }),
              ...itemRuns,
            ],
            indent: { left: 540, hanging: 240 },
            spacing: { after: 120, line: 320 },
          })
        );
      });
    } else if (token.type === 'table') {
      const tToken = token as Tokens.Table;
      documentChildren.push(
        new Paragraph({ spacing: { before: 200 } }),
        buildDocxTable(tToken, theme),
        new Paragraph({ spacing: { after: 240 } })
      );
    } else if (token.type === 'blockquote') {
      const bToken = token as Tokens.Blockquote;
      documentChildren.push(
        new Paragraph({ spacing: { before: 180 } }),
        buildDocxCallout(bToken, theme),
        new Paragraph({ spacing: { after: 220 } })
      );
    } else if (token.type === 'code') {
      const cToken = token as Tokens.Code;
      documentChildren.push(
        new Paragraph({ spacing: { before: 160 } }),
        buildDocxCodeBlock(cToken),
        new Paragraph({ spacing: { after: 200 } })
      );
    } else if (token.type === 'hr') {
      documentChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
          children: [
            new TextRun({
              text: '—'.repeat(30),
              color: theme.primaryHex,
              size: 20,
            }),
          ],
        })
      );
    }
  }

  // Running Header & Footer
  const runningHeader = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: docData.title || 'Tài Liệu Văn Bản',
            size: 18,
            color: '94A3B8',
          }),
        ],
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
        },
      }),
    ],
  });

  const runningFooter = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${theme.name} Style  |  Trang `,
            size: 18,
            color: '94A3B8',
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 18,
            color: theme.primaryHex,
            bold: true,
          }),
          new TextRun({
            text: ' / ',
            size: 18,
            color: '94A3B8',
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 18,
            color: '94A3B8',
          }),
        ],
        border: {
          top: { style: BorderStyle.SINGLE, size: 2, color: 'E2E8F0' },
        },
      }),
    ],
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch = 1440 dxa
          },
        },
        headers: {
          default: runningHeader,
        },
        footers: {
          default: runningFooter,
        },
        children: documentChildren,
      },
    ],
  });
}
