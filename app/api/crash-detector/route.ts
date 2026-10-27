import { NextRequest, NextResponse } from "next/server";
import { analyzeCrashLog } from "@/lib/crash-analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = body.log || "";
    
    if (!log || typeof log !== "string" || log.trim().length === 0) {
      return NextResponse.json(
        { error: "يرجى لصق نص تقرير الكراش أو سجل الأخطاء (Log) للفحص." },
        { status: 400 }
      );
    }

    const result = analyzeCrashLog(log);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة التقرير: " + (err.message || "خطأ غير متوقع") },
      { status: 500 }
    );
  }
}
