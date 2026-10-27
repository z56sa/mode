"use client";

import { useState } from "react";
import Link from "next/link";

interface MatchedMod {
  title: string;
  game: string;
  slug: string;
  why: string;
}

interface GeneratedResult {
  title: string;
  game: string;
  framework: string;
  language: string;
  fileName: string;
  code: string;
  installationGuide: string[];
}

export default function AiHelperPage() {
  const [tab, setTab] = useState<"search" | "code">("search");
  
  // Search tab state
  const [searchIdea, setSearchIdea] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    category: string;
    relevanceExplanation: string;
    suggestedMods: MatchedMod[];
  } | null>(null);

  // Code generator state
  const [codeIdea, setCodeIdea] = useState("");
  const [gameFramework, setGameFramework] = useState("unity_bepinex");
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSearch() {
    if (!searchIdea.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", idea: searchIdea })
      });
      const data = await res.json();
      if (data.match) {
        setSearchResult(data.match);
      } else {
        setSearchResult({
          category: "بحث عام",
          relevanceExplanation: "لم نعثر على تطابق مباشر لهذه العبارة بالتحديد، يمكنك تصفح قسم الألعاب أو إعادة صياغة فكرتك.",
          suggestedMods: []
        });
      }
    } catch {
      alert("حدث خطأ أثناء البحث، حاول مجدداً.");
    } finally {
      setSearching(false);
    }
  }

  async function handleGenerate() {
    if (!codeIdea.trim()) return;
    setGenerating(true);
    setGeneratedCode(null);
    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", idea: codeIdea, gameType: gameFramework })
      });
      const data = await res.json();
      if (data.result) {
        setGeneratedCode(data.result);
      }
    } catch {
      alert("حدث خطأ أثناء توليد الكود، حاول مجدداً.");
    } finally {
      setGenerating(false);
    }
  }

  function copyCode() {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="section-wrap form-page">
      <Link className="back-link" href="/">
        ← العودة للمكتبة
      </Link>

      <div className="form-heading">
        <span className="eyebrow dark-eyebrow">مساعد المودات الذكي</span>
        <h1>الذكاء الاصطناعي للمودات (AI Mod Helper)</h1>
        <p>
          ابحث عن المود الذي في بالك عبر وصف فكرتك باللغة الطبيعية، أو اطلب كود وقالب برمجي جاهز للبدء بصناعة مودك الخاص.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setTab("search")}
          className={`button ${tab === "search" ? "button-dark" : "button-outline"}`}
          style={{ padding: "0.6rem 1.4rem" }}
        >
          🔍 ابحث عن مود بوصف فكرتك
        </button>
        <button
          type="button"
          onClick={() => setTab("code")}
          className={`button ${tab === "code" ? "button-dark" : "button-outline"}`}
          style={{ padding: "0.6rem 1.4rem" }}
        >
          ⚡ ولّد كود مود لفكرتك (للمطورين)
        </button>
      </div>

      {tab === "search" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              ما الذي تريده في لعبتك؟
            </label>
            <input
              type="text"
              value={searchIdea}
              onChange={(e) => setSearchIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="مثلاً: أبي مود يخليني أطير بسفينة، أو أسلحة واقعية ورصاص، أو تنظيم الصناديق..."
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "1rem",
                color: "inherit"
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="button button-dark"
            style={{ alignSelf: "flex-start", padding: "0.7rem 1.8rem" }}
          >
            {searching ? "جاري البحث في قاعدة المودات..." : "ابحث بالفكرة ↗"}
          </button>

          {searchResult && (
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ opacity: 0.9, marginBottom: "1rem", fontSize: "1.1rem" }}>
                {searchResult.relevanceExplanation}
              </p>

              {searchResult.suggestedMods.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {searchResult.suggestedMods.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1.2rem",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{mod.game}</span>
                      <h3 style={{ margin: "0.3rem 0 0.5rem", fontSize: "1.2rem" }}>{mod.title}</h3>
                      <p style={{ fontSize: "0.9rem", opacity: 0.85, lineHeight: 1.5, marginBottom: "1rem" }}>
                        {mod.why}
                      </p>
                      <Link
                        href={`/mods/${encodeURIComponent(mod.slug)}`}
                        className="button button-outline"
                        style={{ fontSize: "0.85rem", padding: "0.3rem 0.8rem", width: "100%", textAlign: "center" }}
                      >
                        عرض صفحة المود والتحميل ↗
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "1.5rem", borderRadius: "10px", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                  <p>جرب كلمات مفتاحية مثل: <b>أسلحة</b>، <b>مركبات</b>، <b>طيران</b>، <b>سحر</b>، <b>تخزين</b>، <b>غش وفلوس</b>.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "code" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              ما هي فكرة المود البرمجية؟
            </label>
            <input
              type="text"
              value={codeIdea}
              onChange={(e) => setCodeIdea(e.target.value)}
              placeholder="مثلاً: زيادة سرعة حركة اللاعب عند الضغط على Shift، أو كود إضافة سلاح جديد..."
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "1rem",
                color: "inherit"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              اختر محرك أو منصة اللعبة:
            </label>
            <select
              value={gameFramework}
              onChange={(e) => setGameFramework(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "0.95rem",
                color: "inherit"
              }}
            >
              <option value="unity_bepinex">Unity / BepInEx & Harmony (Valheim, Lethal Company, Bannerlord)</option>
              <option value="gmod_lua">Garry&apos;s Mod (GLua Scripting)</option>
              <option value="stardew">Stardew Valley (SMAPI C# API)</option>
              <option value="minecraft">Minecraft (DataPack / Function)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="button button-dark"
            style={{ alignSelf: "flex-start", padding: "0.7rem 1.8rem" }}
          >
            {generating ? "جاري كتابة الكود والقالب..." : "ولّد كود المود الذكي ⚡"}
          </button>

          {generatedCode && (
            <div style={{ marginTop: "1.5rem", padding: "1.5rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{generatedCode.title}</h3>
                  <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>الملف: {generatedCode.fileName} ({generatedCode.framework})</span>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="button button-outline"
                  style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
                >
                  {copied ? "تم النسخ ✓" : "نسخ الكود 📋"}
                </button>
              </div>

              <pre
                style={{
                  background: "rgba(0,0,0,0.5)",
                  padding: "1.2rem",
                  borderRadius: "10px",
                  overflowX: "auto",
                  direction: "ltr",
                  textAlign: "left",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  color: "#a7f3d0",
                  lineHeight: 1.5
                }}
              >
                <code>{generatedCode.code}</code>
              </pre>

              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>طريقة التركيب والاستخدام:</h4>
                <ol style={{ paddingRight: "1.2rem", lineHeight: 1.7, opacity: 0.9 }}>
                  {generatedCode.installationGuide.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
