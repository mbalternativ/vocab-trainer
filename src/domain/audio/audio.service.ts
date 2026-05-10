export type PronunciationSource =
  | { type: "custom"; url: string }
  | { type: "external"; url: string }
  | { type: "tts"; text: string; lang: string };

export function resolvePronunciationSource(input: {
  customAudioPath?: string | null;
  audioUrl?: string | null;
  text: string;
}): PronunciationSource {
  if (input.customAudioPath) {
    return { type: "custom", url: input.customAudioPath };
  }

  if (input.audioUrl) {
    return { type: "external", url: input.audioUrl };
  }

  return { type: "tts", text: input.text, lang: "en-US" };
}
