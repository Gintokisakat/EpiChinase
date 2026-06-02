import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const safe = path.basename(filename);
  const audioDir = process.env.AUDIO_DIR;
  if (!audioDir) {
    return new NextResponse("Audio directory not configured", { status: 500 });
  }
  const filePath = path.join(audioDir, safe);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const ext = path.extname(safe).toLowerCase();
  const contentType: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
  };

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
