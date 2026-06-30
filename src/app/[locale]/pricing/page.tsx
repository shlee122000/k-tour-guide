"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { isPro, getTrialDaysLeft, openCheckout } from "@/lib/paddle";
import BottomNav from "@/components/BottomNav";

const TEXTS: Record<string, Record<string, string>> = {
  title: {
    ko:"🗺️ K-Tour Guide Pro", en:"🗺️ K-Tour Guide Pro",
    ja:"🗺️ K-Tour Guide Pro", zh:"🗺️ K-Tour Guide Pro",
    es:"🗺️ K-Tour Guide Pro", fr:"🗺️ K-Tour Guide Pro",
    de:"🗺️ K-Tour Guide Pro", th:"🗺️ K-Tour Guide Pro",
    vi:"🗺️ K-Tour Guide Pro", id:"🗺️ K-Tour Guide Pro",
  },
  trial: {
    ko:"3일 무료 체험 후 $9.99", en:"3-day free trial, then $9.99",
    ja:"3日間無料体験後 $9.99", zh:"3天免费试用后 $9.99",
    es:"Prueba gratuita 3 días, luego $9.99", fr:"Essai gratuit 3 jours, puis $9.99",
    de:"3 Tage kostenlos, dann $9.99", th:"ทดลองฟรี 3 วัน แล้ว $9.99",
    vi:"Dùng thử 3 ngày, sau đó $9.99", id:"Coba gratis 3 hari, lalu $9.99",
  },
  daysLeft: {
    ko:"무료 체험 남은 기간", en:"Trial days left",
    ja:"無料体験残り日数", zh:"试用剩余天数",
    es:"Días de prueba restantes", fr:"Jours d'essai restants",
    de:"Verbleibende Testtage", th:"วันทดลองที่เหลือ",
    vi:"Ngày dùng thử còn lại", id:"Sisa hari percobaan",
  },
  alreadyPro: {
    ko:"🎉 Pro 이용 중!", en:"🎉 You are Pro!",
    ja:"🎉 Proプラン利用中!", zh:"🎉 您已是Pro会员!",
    es:"🎉 ¡Eres Pro!", fr:"🎉 Vous êtes Pro!",
    de:"🎉 Sie sind Pro!", th:"🎉 คุณเป็น Pro!",
    vi:"🎉 Bạn đang dùng Pro!", id:"🎉 Anda adalah Pro!",
  },
  alreadyProDesc: {
    ko:"모든 기능을 무제한으로 사용하세요!", en:"Enjoy all features without limits!",
    ja:"すべての機能が無制限で使えます!", zh:"无限制享受所有功能!",
    es:"¡Disfruta todas las funciones sin límites!", fr:"Profitez de toutes les fonctionnalités!",
    de:"Genießen Sie alle Funktionen!", th:"เพลิดเพลินกับทุกฟีเจอร์ไม่จำกัด!",
    vi:"Tận hưởng tất cả tính năng!", id:"Nikmati semua fitur tanpa batas!",
  },
  free: {
    ko:"무료", en:"Free", ja:"無料", zh:"免费",
    es:"Gratis", fr:"Gratuit", de:"Kostenlos",
    th:"ฟรี", vi:"Miễn phí", id:"Gratis",
  },
  pro: {
    ko:"Pro - $9.99 (평생)", en:"Pro - $9.99 (Lifetime)",
    ja:"Pro - $9.99（永久）", zh:"Pro - $9.99（终身）",
    es:"Pro - $9.99 (De por vida)", fr:"Pro - $9.99 (À vie)",
    de:"Pro - $9.99 (Lebenslang)", th:"Pro - $9.99 (ตลอดชีพ)",
    vi:"Pro - $9.99 (Trọn đời)", id:"Pro - $9.99 (Seumur hidup)",
  },
  cta: {
    ko:"지금 구매하기 $9.99", en:"Buy Now $9.99",
    ja:"今すぐ購入 $9.99", zh:"立即购买 $9.99",
    es:"Comprar ahora $9.99", fr:"Acheter maintenant $9.99",
    de:"Jetzt kaufen $9.99", th:"ซื้อเลย $9.99",
    vi:"Mua ngay $9.99", id:"Beli Sekarang $9.99",
  },
};

const FREE_FEATURES: Record<string, string[]> = {
  ko: ["✅ 검색 반경 5km", "✅ 즐겨찾기 5개", "✅ 번역 10회/일", "✅ TTS 10회/일", "✅ 10개 언어"],
  en: ["✅ 5km search radius", "✅ 5 favorites", "✅ 10 translations/day", "✅ 10 TTS/day", "✅ 10 languages"],
  ja: ["✅ 検索半径5km", "✅ お気に入り5件", "✅ 翻訳10回/日", "✅ TTS10回/日", "✅ 10言語"],
  zh: ["✅ 搜索半径5km", "✅ 收藏5个", "✅ 翻译10次/天", "✅ TTS10次/天", "✅ 10种语言"],
  es: ["✅ Radio de búsqueda 5km", "✅ 5 favoritos", "✅ 10 traducciones/día", "✅ 10 TTS/día", "✅ 10 idiomas"],
  fr: ["✅ Rayon de recherche 5km", "✅ 5 favoris", "✅ 10 traductions/jour", "✅ 10 TTS/jour", "✅ 10 langues"],
  de: ["✅ Suchradius 5km", "✅ 5 Favoriten", "✅ 10 Übersetzungen/Tag", "✅ 10 TTS/Tag", "✅ 10 Sprachen"],
  th: ["✅ รัศมีค้นหา 5km", "✅ รายการโปรด 5 รายการ", "✅ แปล 10 ครั้ง/วัน", "✅ TTS 10 ครั้ง/วัน", "✅ 10 ภาษา"],
  vi: ["✅ Bán kính tìm kiếm 5km", "✅ 5 yêu thích", "✅ 10 bản dịch/ngày", "✅ 10 TTS/ngày", "✅ 10 ngôn ngữ"],
  id: ["✅ Radius pencarian 5km", "✅ 5 favorit", "✅ 10 terjemahan/hari", "✅ 10 TTS/hari", "✅ 10 bahasa"],
};

const PRO_FEATURES: Record<string, string[]> = {
  ko: ["✅ 검색 반경 무제한", "✅ 즐겨찾기 무제한", "✅ 번역 무제한", "✅ TTS 무제한", "✅ 10개 언어", "✅ 평생 이용"],
  en: ["✅ Unlimited search radius", "✅ Unlimited favorites", "✅ Unlimited translations", "✅ Unlimited TTS", "✅ 10 languages", "✅ Lifetime access"],
  ja: ["✅ 検索半径無制限", "✅ お気に入り無制限", "✅ 翻訳無制限", "✅ TTS無制限", "✅ 10言語", "✅ 永久利用"],
  zh: ["✅ 搜索半径无限", "✅ 收藏无限", "✅ 翻译无限", "✅ TTS无限", "✅ 10种语言", "✅ 终身使用"],
  es: ["✅ Radio ilimitado", "✅ Favoritos ilimitados", "✅ Traducciones ilimitadas", "✅ TTS ilimitado", "✅ 10 idiomas", "✅ Acceso de por vida"],
  fr: ["✅ Rayon illimité", "✅ Favoris illimités", "✅ Traductions illimitées", "✅ TTS illimité", "✅ 10 langues", "✅ Accès à vie"],
  de: ["✅ Unbegrenzter Radius", "✅ Unbegrenzte Favoriten", "✅ Unbegrenzte Übersetzungen", "✅ Unbegrenztes TTS", "✅ 10 Sprachen", "✅ Lebenslanger Zugang"],
  th: ["✅ รัศมีไม่จำกัด", "✅ รายการโปรดไม่จำกัด", "✅ แปลไม่จำกัด", "✅ TTS ไม่จำกัด", "✅ 10 ภาษา", "✅ ใช้ได้ตลอดชีพ"],
  vi: ["✅ Bán kính không giới hạn", "✅ Yêu thích không giới hạn", "✅ Dịch không giới hạn", "✅ TTS không giới hạn", "✅ 10 ngôn ngữ", "✅ Truy cập trọn đời"],
  id: ["✅ Radius tidak terbatas", "✅ Favorit tidak terbatas", "✅ Terjemahan tidak terbatas", "✅ TTS tidak terbatas", "✅ 10 bahasa", "✅ Akses seumur hidup"],
};

export default function PricingPage() {
  const locale = useLocale();
  const [pro, setPro] = useState(false);
  const [trialDays, setTrialDays] = useState(3);

  useEffect(() => {
    setPro(isPro());
    setTrialDays(getTrialDaysLeft());

    // Paddle 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const t = (key: string) => TEXTS[key]?.[locale] || TEXTS[key]?.en || "";
  const freeFeatures = FREE_FEATURES[locale] || FREE_FEATURES.en;
  const proFeatures = PRO_FEATURES[locale] || PRO_FEATURES.en;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 style={{textAlign:"center",fontSize:24,fontWeight:900,color:"#1a3a5c",marginBottom:8}}>
          {t("title")}
        </h1>
        <p style={{textAlign:"center",color:"#666",marginBottom:32,fontSize:14}}>
          {t("trial")}
        </p>

        {pro && localStorage.getItem("ktour_pro") === "true" ? (
          <div style={{textAlign:"center",padding:"40px 20px",background:"white",borderRadius:16,boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
            <h2 style={{color:"#1a3a5c"}}>{t("alreadyPro")}</h2>
            <p style={{color:"#666"}}>{t("alreadyProDesc")}</p>
          </div>
        ) : (
          <>
            {/* 무료 체험 남은 기간 */}
            {trialDays > 0 && (
              <div style={{background:"#EFF6FF",borderRadius:12,padding:"12px 16px",marginBottom:20,
                display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:14,color:"#2563EB",fontWeight:600}}>{t("daysLeft")}</span>
                <span style={{fontSize:20,fontWeight:900,color:"#2563EB"}}>{trialDays}일</span>
              </div>
            )}

            {/* 무료 플랜 */}
            <div style={{border:"1px solid #E5E7EB",borderRadius:16,padding:20,marginBottom:16,background:"white"}}>
              <h3 style={{color:"#6B7280",marginBottom:12,fontSize:16}}>{t("free")}</h3>
              <ul style={{listStyle:"none",padding:0,margin:0}}>
                {freeFeatures.map((f, i) => (
                  <li key={i} style={{fontSize:14,color:"#444",lineHeight:2}}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Pro 플랜 */}
            <div style={{border:"2px solid #3B82F6",borderRadius:16,padding:20,marginBottom:24,
              background:"white",position:"relative"}}>
              <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",
                background:"#3B82F6",color:"white",padding:"4px 16px",borderRadius:20,fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>
                ⭐ LIFETIME
              </div>
              <h3 style={{color:"#3B82F6",marginBottom:12,fontSize:16}}>{t("pro")}</h3>
              <ul style={{listStyle:"none",padding:0,margin:0,marginBottom:16}}>
                {proFeatures.map((f, i) => (
                  <li key={i} style={{fontSize:14,color:"#444",lineHeight:2}}>{f}</li>
                ))}
              </ul>
              <button
                onClick={openCheckout}
                style={{width:"100%",padding:14,background:"linear-gradient(135deg,#3B82F6,#2563EB)",
                  color:"white",border:"none",borderRadius:12,fontSize:16,fontWeight:900,cursor:"pointer"}}>
                {t("cta")}
              </button>
              <p style={{fontSize:11,color:"#9CA3AF",textAlign:"center",marginTop:10,lineHeight:1.5}}>
                {locale === "ko"
                  ? "3일 무료 체험 후 평생 이용권 $9.99가 1회 청구됩니다. 세금이 부과될 수 있으며 결제 시 계산됩니다."
                  : "After a 3-day free trial, a one-time lifetime payment of $9.99 is charged. Taxes may apply and will be calculated at checkout."}
              </p>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}