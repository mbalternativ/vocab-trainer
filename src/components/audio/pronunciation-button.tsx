"use client";

import { Button } from "@/components/ui/button";
import { resolvePronunciationSource } from "@/domain/audio/audio.service";

type PronunciationButtonProps = {
  text: string;
  audioUrl?: string | null;
  customAudioPath?: string | null;
};

export function PronunciationButton({ text, audioUrl, customAudioPath }: PronunciationButtonProps) {
  const handleClick = () => {
    const source = resolvePronunciationSource({ text, audioUrl, customAudioPath });

    if (source.type === "tts") {
      const utterance = new SpeechSynthesisUtterance(source.text);
      utterance.lang = source.lang;
      window.speechSynthesis.speak(utterance);
      return;
    }

    const audio = new Audio(source.url);
    void audio.play();
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      Play pronunciation
    </Button>
  );
}
