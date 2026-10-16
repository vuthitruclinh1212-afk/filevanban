export interface ThemeCoverConfig {
  badge: string;
  icons: string;
  motif: string;
  quote: string;
  sealText?: string;
  borderStyle: 'ornate' | 'classical' | 'modern' | 'minimal' | 'cyber' | 'playful';
}

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
  // High-contrast specific fields for paper and slide readability
  paperTextHex: string;
  paperAccentHex: string;
  slideTextHex: string;
  slideAccentHex: string;
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
  category?: 'classic' | 'modern' | 'creative';
  cover: ThemeCoverConfig;
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
  includeCoverPage: boolean;
  includeHeaderFooter: boolean;
  includePageNumber: boolean;
  customHeaderText?: string;
  customFooterText?: string;
}

export type ExportFormat = 'docx' | 'pptx' | 'pdf' | 'xlsx' | 'zip';
