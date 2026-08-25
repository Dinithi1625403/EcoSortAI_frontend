import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiUrl = process.env.PYTHON_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "PYTHON_API_URL is not set in .env.local" },
      { status: 500 }
    );
  }

  try {
    const incoming = await request.formData();
    const file = incoming.get("file");

    // instanceof also narrows the type from FormDataEntryValue to File
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.append("file", file, file.name || "upload.jpg");

    const res = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      body: outgoing,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Model service error" },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not reach the model service" },
      { status: 502 }
    );
  }
}