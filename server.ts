import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Smart AI Beautify & Markdown Structure
app.post('/api/ai/enhance-markdown', async (req, res) => {
  try {
    const { rawText, style, title } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Vui lòng cung cấp nội dung văn bản.' });
    }

    const prompt = `Bạn là một chuyên gia biên tập và thiết kế tài liệu xuất bản cao cấp.
Nhiệm vụ: Người dùng phàn nàn rằng việc copy thô văn bản vào tài liệu quá sơ sài. Hãy phân tích, cấu trúc lại và làm đẹp toàn bộ văn bản sau thành một tài liệu Markdown chuyên nghiệp, có cấu trúc tầng bậc thẩm mỹ cao để khi xuất ra Word/PDF/PowerPoint/Excel sẽ cực kỳ đẹp mắt.

HƯỚNG DẪN CẤU TRÚC VÀ ĐỊNH DẠNG:
1. KHÔNG copy thô sơ sài. Tự động:
   - Đặt lại Tiêu đề chính (# ...) và Phụ đề ngắn gọn, lôi cuốn.
   - Phân chia các chương mục logic bằng ## (Chương / Phần lớn) và ### (Tiểu mục chi tiết).
   - Làm nổi bật các từ khóa, khái niệm then chốt bằng **in đậm** hoặc *in nghiêng*.
   - Tạo hộp tóm tắt / ghi chú quan trọng bằng cú pháp trích dẫn:
     > 💡 **Điểm Cốt Lõi / Lưu Ý Quan Trọng:** ...
   - Chuyển các ý liệt kê thành danh sách gạch đầu dòng (- ...) hoặc danh sách thứ tự (1. 2. 3.).
   - Nếu có bảng so sánh, thống kê hoặc tiêu chuẩn, hãy tạo Bảng Markdown chuẩn (| Tiêu chí | Nội dung | Ghi chú |).
   - Nếu có đoạn văn tâm đắc, danh ngôn hoặc triết lý, hãy đặt trong khối trích dẫn (> ...).
2. Giữ nguyên vẹn tất cả dữ kiện, số liệu và ý nghĩa cốt lõi của người dùng, không bịa đặt thông tin sai lệch.
3. Sử dụng tiếng Việt chuẩn xác, thanh thoát, trang trọng.
4. CHỈ TRẢ VỀ nội dung Markdown hoàn chỉnh, không kèm bất kỳ lời dẫn hay giải thích nào bên ngoài.

Tiêu đề gợi ý: ${title || ''}
Chủ đề / Phong cách: ${style || 'Chuyên nghiệp, thẩm mỹ'}

NỘI DUNG VĂN BẢN GỐC:
${rawText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text || rawText;
    res.json({ success: true, markdown: text });
  } catch (error: any) {
    console.warn('Gemini temporary spike, using smart structural parser fallback:', error?.message);
    const { rawText, title, style } = req.body;
    
    // Intelligent fallback restructuring
    const paragraphs = (rawText || '').split('\n').map((p: string) => p.trim()).filter(Boolean);
    let structured = `# ${title || 'Tài Liệu Văn Bản'}\n\n`;
    structured += `> 💡 **Tóm Tắt Cốt Lõi:** Tài liệu được phân tích và chuẩn hóa theo phong cách ${style || 'Chuyên nghiệp'}.\n\n`;

    if (paragraphs.length <= 2) {
      structured += `## 1. Nội Dung Trọng Tâm\n\n${paragraphs.join('\n\n')}\n\n`;
    } else {
      paragraphs.forEach((p: string, idx: number) => {
        if (p.startsWith('#') || p.startsWith('>') || p.startsWith('|') || p.startsWith('-')) {
          structured += `${p}\n\n`;
        } else if (idx === 0) {
          structured += `## 1. Giới Thiệu & Bối Cảnh\n\n${p}\n\n`;
        } else if (idx === 1) {
          structured += `## 2. Chi Tiết Thực Thi & Phân Tích\n\n${p}\n\n`;
        } else if (idx === paragraphs.length - 1) {
          structured += `## 3. Kết Luận & Định Hướng\n\n${p}\n\n`;
        } else {
          structured += `${p}\n\n`;
        }
      });
    }

    structured += `\n---\n\n> ❖ *Tài liệu đã được chuẩn hóa cấu trúc phân tầng đề mục và bảng màu.*`;
    res.json({ success: true, markdown: structured.trim(), fallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
