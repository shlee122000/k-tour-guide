"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";

const PROMO_TEXTS: Record<string, Record<string, string>> = {
  title: {
    en:"Try our related apps!", ja:"関連アプリも使ってみてください！",
    zh:"试试我们的相关应用！", es:"¡Prueba nuestras apps relacionadas!",
    fr:"Essayez nos applications connexes!", th:"ลองแอปที่เกี่ยวข้อง!",
    vi:"Thử các ứng dụng liên quan!", id:"Coba aplikasi terkait kami!",
    de:"Probieren Sie unsere verwandten Apps!", ko:"관련 앱도 사용해보세요!"
  },
  studyDesc: {
    en:"Learn Korean with AI!", ja:"AIで韓国語を楽しく学習！",
    zh:"用AI有趣地学习韩语！", es:"¡Aprende coreano con IA!",
    fr:"Apprenez le coréen avec l'IA!", th:"เรียนภาษาเกาหลีด้วย AI!",
    vi:"Học tiếng Hàn với AI!", id:"Belajar bahasa Korea dengan AI!",
    de:"Koreanisch mit KI lernen!", ko:"AI로 한국어를 즐겁게 학습!"
  },
  kpopDesc: {
    en:"Learn Korean with K-POP!", ja:"K-POPで韓国語を学ぼう！",
    zh:"用K-POP学习韩语！", es:"¡Aprende coreano con K-POP!",
    fr:"Apprenez le coréen avec K-POP!", th:"เรียนภาษาเกาหลีด้วย K-POP!",
    vi:"Học tiếng Hàn với K-POP!", id:"Belajar bahasa Korea dengan K-POP!",
    de:"Koreanisch mit K-POP lernen!", ko:"K-POP으로 한국어 학습!"
  },
  btn: {
    en:"Get Started 🗺️", ja:"はじめる 🗺️",
    zh:"开始使用 🗺️", es:"¡Empezar 🗺️",
    fr:"Commencer 🗺️", th:"เริ่มต้น 🗺️",
    vi:"Bắt đầu 🗺️", id:"Mulai 🗺️",
    de:"Loslegen 🗺️", ko:"시작하기 🗺️"
  },
};

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale | null>(null);
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const t = (key: string, loc?: string) =>
    PROMO_TEXTS[key]?.[loc || locale] || PROMO_TEXTS[key]?.en || "";

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setIsOpen(false);
    setCurrentLocale(newLocale);

    // 24시간 체크
    const last = localStorage.getItem("cross_promo_shown");
    if (!last || Date.now() - parseInt(last) > 24 * 60 * 60 * 1000) {
      setTimeout(() => setShowPromo(true), 300);
    }
  };

  const closePromo = () => {
    setShowPromo(false);
    localStorage.setItem("cross_promo_shown", Date.now().toString());
  };

  const loc = currentLocale || locale;

  return (
    <>
      {/* 크로스 프로모션 팝업 */}
      {showPromo && (
        <div style={{position:"fixed",inset:0,zIndex:9999,
          background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div style={{background:"linear-gradient(135deg,#1A1A2E,#2D1B69)",
            borderRadius:24,padding:"24px 20px",maxWidth:400,width:"100%",
            border:"1.5px solid rgba(108,99,255,.5)",
            boxShadow:"0 20px 60px rgba(0,0,0,.5)",position:"relative"}}>

            {/* 닫기 */}
            <button onClick={closePromo} style={{position:"absolute",top:16,right:16,
              background:"none",border:"none",color:"rgba(255,255,255,.5)",
              fontSize:20,cursor:"pointer"}}>✕</button>

            {/* 제목 */}
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:32,marginBottom:8}}>🇰🇷</div>
              <div style={{fontSize:17,fontWeight:900,color:"#A29BFE",marginBottom:6}}>
                {t("title", loc)}
              </div>
            </div>

            {/* Korean Study */}
            <div style={{borderRadius:16,padding:"14px 16px",marginBottom:10,
              background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,flexShrink:0,
                  background:"linear-gradient(135deg,#6C63FF,#4ECDC4)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📚</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>
                    Korean Study Level-Up
                  </div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                    {t("studyDesc", loc)}
                  </div>
                </div>
              </div>
            </div>

            {/* K-POP Korean */}
            <div style={{borderRadius:16,padding:"14px 16px",marginBottom:20,
              background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,flexShrink:0,
                  background:"linear-gradient(135deg,#E84393,#FD79A8)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎵</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>
                    K-POP Korean
                  </div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                    {t("kpopDesc", loc)}
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <button onClick={closePromo} style={{width:"100%",padding:"14px",
              borderRadius:14,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#6C63FF,#4ECDC4)",
              color:"#fff",fontWeight:900,fontSize:15}}>
              {t("btn", loc)}
            </button>
          </div>
        </div>
      )}

      {/* 언어 선택 버튼 */}
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors">
          <span className="text-lg">{localeFlags[locale]}</span>
          <span>{localeNames[locale]}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-100">
              <div className="max-h-80 overflow-y-auto">
                {locales.map((loc) => (
                  <button key={loc} onClick={() => switchLocale(loc)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      locale === loc ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                    }`}>
                    <span className="text-xl">{localeFlags[loc]}</span>
                    <span className="text-sm">{localeNames[loc]}</span>
                    {locale === loc && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}