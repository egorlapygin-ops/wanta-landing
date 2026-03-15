import { NextRequest, NextResponse } from "next/server";

export type WaitlistBody = {
  email: string;
  category?: string;
};

/**
 * Waitlist API route.
 * TODO: Integrate with your backend (Supabase, Airtable, Notion, Google Sheets, Telegram webhook, etc.)
 * For now returns 200 and logs the payload.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WaitlistBody;
    const { email, category } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmed = email.trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // TODO: Persist to your storage:
    // - Supabase: insert into waitlist table
    // - Airtable: append row to base
    // - Notion: create page in database
    // - Google Sheets: append row via API
    // - Telegram: POST to bot webhook with message
    console.log("[Waitlist]", { email: trimmed, category });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
