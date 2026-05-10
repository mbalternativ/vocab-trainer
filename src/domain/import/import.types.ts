export type ImportItem = {
  id: string;
  importId?: string;
  english: string;
  german: string;
  ipa?: string | null;
  exampleSentence?: string | null;
  partOfSpeech?: string | null;
  isApproved: boolean;
  sortOrder?: number;
};

export type ImportJob = {
  id: string;
  imagePath: string;
  previewUrl: string | null;
  parseStatus: "pending" | "processing" | "parsed" | "failed";
  reviewStatus: "pending" | "reviewed" | "imported";
  createdAt: string;
};

export type OcrPreparation = {
  importId: string;
  imagePath: string;
  signedImageUrl: string | null;
  fileName: string;
  contentType: string;
  suggestedProvider: "ocr-space" | "google-vision" | "aws-textract" | "custom";
  status: "ready" | "missing-image-access";
};

export type UploadImportImageResult = {
  importId: string;
  imagePath: string;
  previewUrl: string | null;
  fileName: string;
  contentType: string;
  ocrPreparation: OcrPreparation;
};

export type FinalizeImportResult = {
  importId: string;
  importedCount: number;
};


export type OcrRunResult = {
  importId: string;
  provider: "ocr-space" | "mock";
  rawText: string;
  parsedCount: number;
  approvedCount: number;
};
