"use client";

import { useCallback } from "react";

export function usePronunciation() {
  return useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }, []);
}
