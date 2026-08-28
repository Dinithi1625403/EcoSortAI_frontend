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

    let res: Response;
    try {
      res = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: outgoing,
        signal: AbortSignal.timeout(45000),
      });
    } catch (primaryErr: any) {
      // If 127.0.0.1 failed, try localhost as fallback (or vice versa)
      const altUrl = apiUrl.includes("127.0.0.1")
        ? apiUrl.replace("127.0.0.1", "localhost")
        : apiUrl.includes("localhost")
        ? apiUrl.replace("localhost", "127.0.0.1")
        : null;

      if (altUrl) {
        try {
          const outgoingRetry = new FormData();
          outgoingRetry.append("file", file, file.name || "upload.jpg");
          res = await fetch(`${altUrl}/predict`, {
            method: "POST",
            body: outgoingRetry,
            signal: AbortSignal.timeout(45000),
          });
        } catch {
          throw primaryErr;
        }
      } else {
        throw primaryErr;
      }
    }

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
        error: `Could not connect to FastAPI model service at ${apiUrl}. Please make sure the Python server is running (e.g. py -3.11 -m uvicorn app:app --host 127.0.0.1 --port 8000).`,
      },
      { status: 502 }
    );
  }
}
