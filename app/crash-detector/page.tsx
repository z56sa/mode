"use client";

import { useState } from "react";
import Link from "next/link";

interface CrashResult {
  gameDetected: string | null;
  severity: "critical" | "warning" | "info";
  culpritMod: string | null;
  probableCause: string;
  solutionSteps: string[];
  extractedErrors: string[];
  crashType: string;
}

export default function CrashDetectorPage() {
  const [logText, setLogText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrashResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const sampleLogs = [
    {
      title: "مثال كراش BepInEx / Unity",
      text: `[Error  : Unity Log] System.TypeLoadException: Could not load type 'HarmonyLib.Harmony' from assembly '0Harmony, Version=2.2.2.0'.
at ValheimMod.Plugin.Awake () [0x00012] in <c93881>:0
at UnityEngine.GameObject.AddComponent (System.Type componentType)
Crash in mono_assembly_load_from_full`
    },
    {
      title: "مثال كراش Stardew Valley (SMAPI)",
      text: `[SMAPI] An error occurred in the overridden update loop:
System.NullReferenceException: Object reference not set to an instance of an object.
   at Automate.Framework.Machines.Objects.ChestMachine.GetState() in Automate:line 42
   at StardewValley.Game1.UpdateOther(GameTime time)`
    },
    {
      title: "مثال كراش Skyrim / بيثيسدا",
      text: `[04/14/2024 - 11:22:15PM] Master file "Campfire.esm" is missing or failed to load.
[04/14/2024 - 11:22:16PM] error: Property FrostfallWeather on script _Frost_PlayerQuest cannot be bound.
Fatal Exception: Memory Access Violation 0xC0000005`
    }
  ];

  async function handleAnalyze() {
    if (!logText.trim()) {
      setErrorMsg("يرجى لصق نص سجل الخطأ أو الكراش أولاً.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/crash-detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: logText })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "فشل التحليل");
      } else {
        setResult(data.result);
      }
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-wrap form-page">
      <Link className="back-link" href="/">
        ← العودة للمكتبة
      </Link>

      <div className="form-heading">
        <span className="eyebrow dark-eyebrow">أداة الفحص الذكي للأخطاء</span>
        <h1>كاشف أخطاء وتعليق المودات (Crash Detector)</h1>
        <p>
          كرشت معك اللعبة أو علقت فجأة؟ الصق نص ملف السجل (Log / Crash Report) هنا وسيقوم الكاشف الذكي بتحديد المود المسبب للمشكلة وطريقة حله فوراً.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.8, alignSelf: "center" }}>جرب تقرير جاهز:</span>
        {sampleLogs.map((s, idx) => (
          <button
            key={idx}
            type="button"
            className="button button-outline"
            style={{ fontSize: "0.8rem", padding: "0.3rem 0.7rem" }}
            onClick={() => setLogText(s.text)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <textarea
          rows={10}
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          placeholder="الصق تقرير الكراش هنا (مثال: crash.log أو SMAPI-crash.txt أو BepInEx LogOutput.log)..."
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "12px",
            background: "#151c19",
            border: "1px solid #2e3c35",
            fontFamily: "monospace",
            fontSize: "0.95rem",
            color: "#f0f5f2",
            direction: "ltr",
            textAlign: "left"
          }}
        />

        {errorMsg && (
          <div style={{ padding: "0.8rem", borderRadius: "8px", background: "rgba(255, 60, 60, 0.15)", border: "1px solid rgba(255,60,60,0.3)", color: "#ff6b6b" }}>
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="button button-dark"
          style={{ alignSelf: "flex-start", padding: "0.7rem 1.8rem", fontSize: "1rem" }}
        >
          {loading ? "جاري الفحص الذكي للتقرير..." : "افحص التقرير واكتشف المود المسبب ↗"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div>
              <span className="eyebrow" style={{ color: result.severity === "critical" ? "#ff6b6b" : "#4ade80" }}>
                {result.crashType}
              </span>
              <h2 style={{ margin: "0.3rem 0 0", fontSize: "1.4rem" }}>
                نتيجة الفحص والتشخيص
              </h2>
            </div>
            {result.gameDetected && (
              <span style={{ padding: "0.3rem 0.8rem", borderRadius: "20px", background: "rgba(255,255,255,0.1)", fontSize: "0.85rem" }}>
                البيئة: {result.gameDetected}
              </span>
            )}
          </div>

          {result.culpritMod && (
            <div style={{ padding: "1rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>المود أو الملف المرجح أنه سبب المشكلة:</div>
              <strong style={{ fontSize: "1.2rem", color: "#f87171" }}>{result.culpritMod}</strong>
            </div>
          )}

          <div style={{ marginBottom: "1.2rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>السبب المحتمل:</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>{result.probableCause}</p>
          </div>

          {result.extractedErrors.length > 0 && (
            <div style={{ marginBottom: "1.2rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem", opacity: 0.8 }}>أسطر الخطأ الملتقطة:</h3>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "0.8rem", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", direction: "ltr", textAlign: "left" }}>
                {result.extractedErrors.map((err, i) => (
                  <div key={i} style={{ color: "#fca5a5" }}>▶ {err}</div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem" }}>خطوات الحل المقترحة:</h3>
            <ul style={{ paddingRight: "1.2rem", lineHeight: 1.8 }}>
              {result.solutionSteps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: "0.3rem" }}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
