import { NextRequest, NextResponse } from "next/server";
import { resolvePronunciationSource } from "@/domain/audio/audio.service";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    text?: string;
    audioUrl?: string | null;
    customAudioPath?: string | null;
  };

  if (!body.text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  return NextResponse.json(
    resolvePronunciationSource({
      text: body.text,
      audioUrl: body.audioUrl,
      customAudioPath: body.customAudioPath,
    }),
  );
}
