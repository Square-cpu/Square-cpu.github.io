export interface RecognitionEntry {
  name: string;
  result: string;
  year?: number;
  level?: string;
  link?: string;
  featured?: boolean;
}

// Populate only with verified records. The homepage renders featured entries.
export const recognitionEntries: RecognitionEntry[] = [];
