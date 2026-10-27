import Link from "next/link";

const steps = [
  {
    title: "اختر اللعبة وحدّد فكرتك",
    description:
      "ابدأ بتعديل صغير يناسب لعبة تحبها: عنصر جديد، تحسين واجهة، تعديل توازن، مهمة، خريطة أو تحسين جودة الحياة.",
  },
  {
    title: "تعرّف على أدوات اللعبة",
    description:
      "راجع موقع اللعبة الرسمي ووثائق مجتمع التعديل لتعرف المحرك والأدوات والصيغ المدعومة. تختلف الأدوات بين الألعاب؛ مثل Creation Kit لألعاب Bethesda وSMAPI لمودات Stardew Valley.",
  },
  {
    title: "أنشئ المود على نسخة اختبار",
    description:
      "احتفظ بنسخة احتياطية من ملفاتك، واعمل في مجلد منفصل. استخدم الأدوات الموثوقة والمصادر المصرح بها، ولا توزّع ملفات اللعبة الأصلية أو محتوى لا تملك حق نشره.",
  },
  {
    title: "اختبر التوافق والاستقرار",
    description:
      "جرّب المود بعد تثبيت نظيف، وتحقق من إصدار اللعبة والمتطلبات وترتيب التحميل. راقب الأخطاء، واختبر الحفظ والأداء، ثم اطلب من لاعب آخر تجربة المود إن أمكن.",
  },
  {
    title: "جهّز صفحة واضحة للمود",
    description:
      "اكتب وصفًا دقيقًا، واذكر إصدار اللعبة والمتطلبات وطريقة التثبيت والمشكلات المعروفة. أضف صورًا حقيقية، وانسب الفضل لأصحاب المكتبات أو الأعمال التي استخدمتها.",
  },
  {
    title: "انشره وشارك رابط المصدر",
    description:
      "اختر منصة تسمح بنوع المود واتبع شروطها ورخص الأصول المستخدمة. ارفع ملفاتك إلى المنصة، ثم أرسل للمكتبة رابط صفحة المود الرسمي ليراجعه المسؤول قبل ظهوره.",
  },
];

export const metadata = {
  title: "اصنع مودك | mode",
  description: "خطوات عملية للبدء في صناعة مودات الألعاب واختبارها ونشرها.",
};

export default function CreateModPage() {
  return (
    <section className="form-page section-wrap create-mod-page">
      <Link className="back-link" href="/">
        ← العودة للمكتبة
      </Link>
      <div className="form-heading">
        <span className="eyebrow dark-eyebrow">دليلك لصناعة الإضافات</span>
        <h1>اصنع مودك</h1>
        <p>حوّل فكرتك إلى إضافة قابلة للتجربة، خطوة بعد خطوة.</p>
      </div>
      <ol className="create-mod-steps">
        {steps.map((step, index) => (
          <li className="create-mod-step" key={step.title}>
            <span className="create-mod-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="create-mod-callout">
        <div>
          <h2>خلصت مودك؟</h2>
          <p>شارك صفحة المود الرسمية مع المجتمع، وستراجع الإضافة قبل نشرها في المكتبة.</p>
        </div>
        <Link className="button button-dark" href="/submit">
          أضف مودًا للمكتبة <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
