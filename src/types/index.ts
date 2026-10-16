export interface DocumentTheme {
  id: string;
  name: string;
  subtitle: string;
  bgHex: string;
  primaryHex: string;
  textHex: string;
  accentHex: string;
  secondaryHex: string;
  cardBgHex: string;
  borderHex: string;
  rgb: {
    bg: [number, number, number];
    primary: [number, number, number];
    text: [number, number, number];
    accent: [number, number, number];
  };
  fontFamilyTitle: string;
  fontFamilyBody: string;
  fontClassTitle: string;
  fontClassBody: string;
  icon: string;
  styleDescription: string;
}

export interface DocumentData {
  title: string;
  subtitle: string;
  author: string;
  organization: string;
  date: string;
  content: string;
  watermark?: string;
  chunkMode: 'charLimit' | 'paragraph' | 'heading';
  maxCharsPerSlide: number;
  includeCoverPage?: boolean;
}

export type ExportFormat = 'docx' | 'pptx' | 'pdf' | 'xlsx' | 'zip';
