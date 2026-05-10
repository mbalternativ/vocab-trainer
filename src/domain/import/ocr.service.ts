export type OcrProvider = "ocr-space" | "mock";

export type OcrResult = {
  provider: OcrProvider;
  rawText: string;
};

type OcrSpaceResponse = {
  ParsedResults?: Array<{ ParsedText?: string }>;
  OCRExitCode?: number;
  IsErroredOnProcessing?: boolean;
  ErrorMessage?: string | string[];
  ErrorDetails?: string;
};

function stringifyOcrSpaceError(payload: OcrSpaceResponse): string {
  if (Array.isArray(payload.ErrorMessage)) {
    return payload.ErrorMessage.join(" ");
  }
  return payload.ErrorMessage || payload.ErrorDetails || "OCR.space could not process the image.";
}

export async function extractTextFromImageUrl(imageUrl: string): Promise<OcrResult> {
  const mockText = process.env.OCR_MOCK_TEXT;
  if (mockText) {
    return { provider: "mock", rawText: mockText };
  }

  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OCR_SPACE_API_KEY. Add it to .env.local or set OCR_MOCK_TEXT for local development.",
    );
  }

  const formData = new FormData();
  formData.append("apikey", apiKey);
  formData.append("url", imageUrl);
  formData.append("language", "eng");
  formData.append("OCREngine", "2");
  formData.append("scale", "true");
  formData.append("isTable", "true");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`OCR request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as OcrSpaceResponse;

  if (payload.IsErroredOnProcessing) {
    throw new Error(stringifyOcrSpaceError(payload));
  }

  const rawText = (payload.ParsedResults ?? [])
    .map((result) => result.ParsedText ?? "")
    .join("\n")
    .trim();

  if (!rawText) {
    throw new Error("OCR finished, but no readable text was found in the image.");
  }

  return { provider: "ocr-space", rawText };
}
