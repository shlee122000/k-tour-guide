import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";
const API_KEY = process.env.NEXT_PUBLIC_TOUR_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  // Build query string manually
  const queryParts: string[] = [];
  queryParts.push(`serviceKey=${API_KEY}`);
  queryParts.push(`MobileOS=ETC`);
  queryParts.push(`MobileApp=KTourGuide`);
  queryParts.push(`_type=json`);

  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  const url = `${BASE_URL}/${endpoint}?${queryParts.join("&")}`;
  console.log("Tour API URL:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log("Tour API Response status:", response.status);
    console.log("Tour API Response:", text.substring(0, 500));

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Invalid JSON", raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (error) {
    console.error("Tour API proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}