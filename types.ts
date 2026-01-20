export interface DocumentMetadata {
  id: string;
  title: string;
  lastModified: number;
  preview?: string;
}

export interface EditorConfig {
  fontFamily: string;
  fontSize: string;
  margins: string;
  orientation: 'portrait' | 'landscape';
  showRuler: boolean;
  showStatusBar: boolean;
  theme: 'light' | 'dark' | 'system';
  viewMode: 'paginated' | 'web';
  lineSpacing: string;
  spellCheck: boolean;
  watermarkText?: string;
  isFocusMode: boolean;
}

export type FileHandle = FileSystemFileHandle | null;

export interface RecentFile extends DocumentMetadata {
  content: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  author: string;
  highlightId: string;
}

export type TabName = 'File' | 'Home' | 'Insert' | 'Layout' | 'Review' | 'View';

declare global {
  interface Window {
    mammoth: any;
    htmlDocx: any;
    TurndownService: any;
    marked: any;
    showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (options?: any) => Promise<FileSystemFileHandle[]>;
    queryLocalFonts?: () => Promise<AsyncIterableIterator<any>>;
    find?: (
      aString?: string,
      aCaseSensitive?: boolean,
      aBackwards?: boolean,
      aWrapAround?: boolean,
      aWholeWord?: boolean,
      aSearchInFrames?: boolean,
      aShowDialog?: boolean
    ) => boolean;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
