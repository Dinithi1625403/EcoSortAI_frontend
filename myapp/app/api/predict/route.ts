import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

  try {
    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.append("file", file, file.name || "upload.jpg");

    const res = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      body: outgoing,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Python model service returned status ${res.status}: ${errorText}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("Predict proxy error:", err);
    return NextResponse.json(
      {
        error: `Could not connect to FastAPI model service at ${apiUrl}. Make sure Uvicorn is running on port 8000.`,
      },
      { status: 502 }
    );
  }
}
