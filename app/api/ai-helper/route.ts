import { NextRequest, NextResponse } from "next/server";
import { generateSmartModCode } from "@/lib/smart-code-generator";
import { smartSearchMods } from "@/lib/smart-search";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action; // 'search' | 'generate'

    if (action === "search") {
      const idea = body.idea || "";
      if (!idea.trim()) {
        return NextResponse.json({ error: "اكتب الفكرة التي تبحث عنها." }, { status: 400 });
      }
      const match = await smartSearchMods(idea, 24);
      return NextResponse.json({ success: true, match });
    }

    if (action === "generate") {
      const idea = body.idea || "";
      const gameType = body.gameType || "unity_bepinex";
      if (!idea.trim()) {
        return NextResponse.json({ error: "اكتب فكرة المود المراد توليد كوده." }, { status: 400 });
      }
      const result = generateSmartModCode(idea, gameType);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: "إجراء غير معروف." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "حدث خطأ: " + (err.message || "خطأ غير متوقع") },
      { status: 500 }
    );
  }
}
