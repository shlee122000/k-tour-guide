"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSelector from "@/components/LanguageSelector";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const categories = [
  { key: "attractions", icon: "🏛️", color: "bg-blue-100 text-blue-600", mapCategory: "attractions" },
  { key: "restaurants", icon: "🍽️", color: "bg-orange-100 text-orange-600", mapCategory: "restaurants" },
  { key: "transport", icon: "🚌", color: "bg-green-100 text-green-600", route: "/transport" },
  { key: "culture", icon: "🎭", color: "bg-purple-100 text-purple-600", mapCategory: "culture" },
  { key: "shopping", icon: "🛍️", color: "bg-pink-100 text-pink-600", mapCategory: "shopping" },
  { key: "emergency", icon: "🆘", color: "bg-red-100 text-red-600", route: "/emergency" },
];

const popularPlaces = [
  { id: 1, searchName: "경복궁",
    name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫", es: "Palacio Gyeongbokgung", fr: "Palais Gyeongbokgung", th: "พระราชวังคยองบกกุง", vi: "Cung điện Gyeongbokgung", id: "Istana Gyeongbokgung", de: "Gyeongbokgung-Palast" },
    image: "🏯", rating: 4.8, city: "Seoul" },
  { id: 2, searchName: "해운대해수욕장",
    name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场", es: "Playa Haeundae", fr: "Plage Haeundae", th: "หาดแฮอุนแด", vi: "Bãi biển Haeundae", id: "Pantai Haeundae", de: "Haeundae-Strand" },
    image: "🏖️", rating: 4.6, city: "Busan" },
  { id: 3, searchName: "성산일출봉",
    name: { ko: "제주 성산일출봉", en: "Seongsan Sunrise Peak", ja: "城山日出峰", zh: "城山日出峰", es: "Pico Seongsan", fr: "Pic Seongsan", th: "ยอดเขาซองซาน", vi: "Đỉnh Seongsan", id: "Puncak Seongsan", de: "Seongsan-Gipfel" },
    image: "🌋", rating: 4.7, city: "Jeju" },
  { id: 4, searchName: "남산타워",
    name: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔", es: "Torre N Seoul", fr: "Tour N Seoul", th: "หอคอยเอ็นโซล", vi: "Tháp N Seoul", id: "Menara N Seoul", de: "N Seoul Tower" },
    image: "🗼", rating: 4.5, city: "Seoul" },
];

interface KpopSpot {
  icon: string;
  name: { ko: string; en: string };
  desc: { ko: string; en: string };
  address: string;
  mapUrl: string;
  photo: string;
  link?: string;
}
interface KpopZone {
  id: string;
  title: { ko: string; en: string };
  subtitle: { ko: string; en: string };
  gradient: string;
  emoji: string;
  spots: KpopSpot[];
}

const kpopZones: KpopZone[] = [
  {
    id: "gangnam",
    title: { ko: "강남/압구정 권역", en: "Gangnam / Apgujeong" },
    subtitle: { ko: "BTS의 시작과 한류의 상징", en: "Birthplace of BTS & Hallyu Icon" },
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    emoji: "💜",
    spots: [
      { icon: "🏢", name: { ko: "HiKR Ground", en: "HiKR Ground" }, desc: { ko: "한국관광공사 서울센터, K-Culture 체험", en: "KTO Seoul Center, K-Culture Experience" }, address: "서울특별시 중구 청계천로 40", mapUrl: "https://map.kakao.com/link/search/하이커그라운드 청계천로", photo: "https://tong.visitkorea.or.kr/cms/resource/10/3097510_image2_1.jpg", link: "https://www.hikrground.kr" },
      { icon: "📺", name: { ko: "코엑스 K-POP Square", en: "COEX K-POP Square" }, desc: { ko: "초대형 LED 전광판, K-Pop 뮤비 상시 상영", en: "Giant LED screen with K-Pop MVs 24/7" }, address: "서울특별시 강남구 영동대로 513", mapUrl: "https://map.kakao.com/link/search/서울특별시 강남구 영동대로 513", photo: "https://tong.visitkorea.or.kr/cms/resource/49/3090049_image2_1.jpg" },
      { icon: "⭐", name: { ko: "K-Star Road", en: "K-Star Road" }, desc: { ko: "K-Pop 스타 동상·포토존, 한류 팬 필수 코스", en: "K-Pop star statues & photo zones, must-visit" }, address: "서울 강남구 압구정동 516", mapUrl: "https://map.kakao.com/link/search/K스타로드 압구정", photo: "https://tong.visitkorea.or.kr/cms/resource/23/2023523_image2_1.jpg" },
      { icon: "🍜", name: { ko: "유정식당 (BTS)", en: "Yujeong Restaurant (BTS)" }, desc: { ko: "BTS 연습생 시절 단골, 팬 포스트잇 가득", en: "BTS trainee favorite, covered in fan notes" }, address: "서울특별시 강남구 도산대로28길 14", mapUrl: "https://map.kakao.com/link/search/유정식당 도산대로", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200131_93%2F1580440595694X9Kqx_JPEG%2F_dOHLRvF1uM5TJwKWmFt-3fM.jpeg.jpg" },
      { icon: "🏗️", name: { ko: "청구빌딩 (구 빅히트)", en: "Old Big Hit Building" }, desc: { ko: "구 빅히트 사옥, 전 세계 팬 낙서 성지", en: "Former Big Hit HQ, fan graffiti pilgrimage" }, address: "서울특별시 강남구 도산대로16길 13-20", mapUrl: "https://map.kakao.com/link/search/청구빌딩 도산대로16길", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200709_267%2F1594264949498yrHTy_JPEG%2FoGawIqr-2tE7YXk8L4kRxwUi.jpeg.jpg" },
      { icon: "🌳", name: { ko: "학동공원", en: "Hakdong Park" }, desc: { ko: "BTS 멤버들 연습 중 휴식·안무 연습 장소", en: "Where BTS practiced dance during breaks" }, address: "서울특별시 강남구 논현동 22-1", mapUrl: "https://map.kakao.com/link/search/서울특별시 강남구 논현동 22-1", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20191009_91%2F15705313781067kF4F_JPEG%2FJLLKmKdV0IWPNLo37j1aN-Xt.jpeg.jpg" },
      { icon: "☕", name: { ko: "카페 휴가 (Cafe Hyuga)", en: "Cafe Hyuga" }, desc: { ko: "BTS 논현동 성지순례 종착지", en: "Final stop of BTS Nonhyeon pilgrimage" }, address: "서울특별시 강남구 논현로119길 16", mapUrl: "https://map.kakao.com/link/search/카페휴가 논현로", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_88%2F1646711920782Lbz13_JPEG%2F2O8RIhb6BoLq__Hh2bj-YkTf.jpeg.jpg" },
    ]
  },
  {
    id: "yongsan",
    title: { ko: "용산 K-Pop의 중심", en: "Yongsan K-Pop Hub" },
    subtitle: { ko: "BTS·세븐틴·뉴진스 소속 하이브 본사", en: "HYBE HQ – BTS, SEVENTEEN, NewJeans" },
    gradient: "linear-gradient(135deg, #2563eb, #7c3aed)",
    emoji: "🏢",
    spots: [
      { icon: "🎵", name: { ko: "HYBE INSIGHT & 용산 사옥", en: "HYBE INSIGHT & HQ" }, desc: { ko: "하이브 본사, 전시·체험·굿즈샵", en: "HYBE HQ with exhibition & goods shop" }, address: "서울특별시 용산구 한강대로 42", mapUrl: "https://map.kakao.com/link/search/서울특별시 용산구 한강대로 42", photo: "https://tong.visitkorea.or.kr/cms/resource/02/3348302_image2_1.jpg", link: "https://www.hybeinsight.com" },
    ]
  },
  {
    id: "seongsu",
    title: { ko: "성수동 K-Pop 중심", en: "Seongsu K-Pop & Hot Places" },
    subtitle: { ko: "SM·큐브 라인 + 핫플레이스 거리", en: "SM & Cube Line + Trendy Hot Spots" },
    gradient: "linear-gradient(135deg, #059669, #0d9488)",
    emoji: "🌳",
    spots: [
      { icon: "🎤", name: { ko: "광야@서울 (SM 사옥)", en: "KWANGYA@Seoul (SM)" }, desc: { ko: "SM 엔터 성수 사옥 지하, 플래그십 스토어", en: "SM Entertainment flagship store" }, address: "서울특별시 성동구 왕십리로 83-21", mapUrl: "https://map.kakao.com/link/search/서울특별시 성동구 왕십리로 83-21", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230404_275%2F1680569855197SKmm1_JPEG%2FIMG_0710.JPG" },
      { icon: "☕", name: { ko: "큐베이커 (큐브 사옥)", en: "Cubaker (Cube Ent.)" }, desc: { ko: "큐브 사옥 1층 카페, 팬들의 사랑방", en: "Cube HQ 1F cafe, fan meeting spot" }, address: "서울특별시 성동구 아차산로 83 1층", mapUrl: "https://map.kakao.com/link/search/서울특별시 성동구 아차산로 83", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230824_102%2F1692870489139DvYHk_JPEG%2F1692612746155.jpg" },
      { icon: "👗", name: { ko: "디올 성수", en: "Dior Seongsu" }, desc: { ko: "럭셔리 팝업 & 포토존", en: "Luxury pop-up & photo zone" }, address: "서울 성동구 연무장5길 7", mapUrl: "https://map.kakao.com/link/search/디올성수", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220607_10%2F1654586489671vLdhg_JPEG%2F2.jpg" },
      { icon: "🧪", name: { ko: "비이커 성수", en: "Beaker Seongsu" }, desc: { ko: "뷰티 편집숍", en: "Beauty select shop" }, address: "서울 성동구 연무장길 7-1", mapUrl: "https://map.kakao.com/link/search/서울 성동구 연무장길 7-1", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210729_227%2F1627527780929JYXMt_JPEG%2F-1fLk6b8sZHYTVi5z2uMnTa2.jpg" },
      { icon: "🛍️", name: { ko: "EQL GROVE", en: "EQL GROVE" }, desc: { ko: "트렌디 패션 편집숍", en: "Trendy fashion select shop" }, address: "서울 성동구 연무장15길 11", mapUrl: "https://map.kakao.com/link/search/서울 성동구 연무장15길 11", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220617_233%2F1655435063653gBFGI_JPEG%2FEQL.jpg" },
      { icon: "🏭", name: { ko: "대림창고", en: "Daelim Warehouse" }, desc: { ko: "성수동 대표 복합 문화공간", en: "Iconic Seongsu cultural complex" }, address: "서울 성동구 성수이로14길 11", mapUrl: "https://map.kakao.com/link/search/서울 성동구 성수이로14길 11", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200923_282%2F1600825820053p5Pxz_JPEG%2F3FVJRxGMjAuYXEi0Wr9P-gKY.jpeg.jpg" },
      { icon: "🍞", name: { ko: "어니언 성수", en: "Onion Seongsu" }, desc: { ko: "성수동 대표 베이커리 카페", en: "Iconic Seongsu bakery cafe" }, address: "서울 성동구 아차산로9길 8", mapUrl: "https://map.kakao.com/link/search/어니언 성수", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230719_288%2F16897159411568s7BT_JPEG%2FIMG_8508.JPG" },
      { icon: "🎨", name: { ko: "LCDC SEOUL", en: "LCDC SEOUL" }, desc: { ko: "복합 문화 편집숍", en: "Multi-cultural select shop" }, address: "서울 성동구 연무장17길 10", mapUrl: "https://map.kakao.com/link/search/LCDC 성수", photo: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220617_52%2F16554349750524IW5T_JPEG%2FLCDC.jpg" },
    ]
  }
];

const kbeautyItems = [
  { icon: "🏥", bgColor: "#a5f3fc", textColor: "#0e7490", name: { ko: "성형외과 정보", en: "Plastic Surgery" }, url: "https://my-doctor.io/hospital/deptHub/region/%EC%84%B1%ED%98%95%EC%99%B8%EA%B3%BC-%EC%84%9C%EC%9A%B8" },
  { icon: "💄", bgColor: "#bbf7d0", textColor: "#15803d", name: { ko: "올리브영", en: "Olive Young" }, mapUrl: "https://map.kakao.com/link/search/올리브영 명동" },
  { icon: "📋", bgColor: "#fecdd3", textColor: "#be123c", name: { ko: "시술 후기 참고", en: "Reviews" }, url: "https://www.babitalk.com" },
];

export default function HomePage() {
  const t = useTranslations();
  const tCat = useTranslations("categories");
  const tHome = useTranslations("home");
  const tApp = useTranslations("app");
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(50);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const locale = useLocale();
  const router = useRouter();

  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (cat.route) { router.push(`/${locale}${cat.route}`); }
    else if (cat.mapCategory) { router.push(`/${locale}/map?category=${cat.mapCategory}&radius=${radius}&gps=true`); }
  };
  const handleSearch = () => {
    if (searchQuery.trim()) { router.push(`/${locale}/map?search=${encodeURIComponent(searchQuery.trim())}&radius=${radius}&gps=true`); }
  };
  const handlePlaceClick = (place: { searchName: string }) => {
    router.push(`/${locale}/map?search=${encodeURIComponent(place.searchName)}`);
  };
  const getName = (nameObj: Record<string, string>) => nameObj[locale] || nameObj.en || "";
  const toggleZone = (zoneId: string) => { setExpandedZone(prev => prev === zoneId ? null : zoneId); };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="px-4 pt-12 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{tApp("title")}</h1>
              <p className="text-blue-200 text-sm mt-0.5">{tApp("subtitle")}</p>
            </div>
            <LanguageSelector />
          </div>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder={tApp("search")} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-14 py-3.5 bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg" />
            <button onClick={handleSearch}
              style={{ position:"absolute", right:"6px", top:"50%", transform:"translateY(-50%)", padding:"8px 14px", background:"linear-gradient(135deg, #f97316, #ef4444)", color:"white", borderRadius:"12px", fontSize:"14px", fontWeight:"bold", border:"none", cursor:"pointer", boxShadow:"0 2px 8px rgba(239,68,68,0.4)" }}>
              🔍
            </button>
          </div>
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">📍 {t("radius.title")}</span>
              <span className="text-sm font-bold text-white">{radius}km</span>
            </div>
            <input type="range" min="30" max="300" step="10" value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
            <div className="flex justify-between text-xs text-blue-200 mt-1">
              <span>30km</span><span>150km</span><span>300km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 -mt-1">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button key={cat.key} onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${cat.color} hover:scale-105 transition-transform active:scale-95`}>
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold">{tCat(cat.key)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ★ K-Pop Hot Spots - 3개 권역 */}
      <div className="px-4 mt-5">
        <div style={{ background:"linear-gradient(135deg, #faf5ff, #f3e8ff)", borderRadius:"16px", padding:"16px", boxShadow:"0 2px 12px rgba(124,58,237,0.1)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-gray-800">🎤 K-Pop Hot Spots</span>
            <span style={{ padding:"2px 8px", background:"#ef4444", color:"white", fontSize:"10px", fontWeight:"bold", borderRadius:"999px" }}>HOT</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {kpopZones.map((zone) => (
              <div key={zone.id}>
                <button onClick={() => toggleZone(zone.id)}
                  style={{ width:"100%", padding:"14px 16px", borderRadius: expandedZone===zone.id?"14px 14px 0 0":"14px", background:zone.gradient, color:"white", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"24px" }}>{zone.emoji}</span>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontWeight:"bold", fontSize:"14px" }}>{getName(zone.title)}</div>
                      <div style={{ fontSize:"11px", opacity:0.85, marginTop:"2px" }}>{getName(zone.subtitle)}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ background:"rgba(255,255,255,0.25)", padding:"2px 8px", borderRadius:"8px", fontSize:"11px", fontWeight:"bold" }}>{zone.spots.length}</span>
                    <span style={{ fontSize:"16px", transform: expandedZone===zone.id?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▼</span>
                  </div>
                </button>
                {expandedZone===zone.id && (
                  <div style={{ background:"white", borderRadius:"0 0 14px 14px", padding:"8px", border:"1px solid #e5e7eb", borderTop:"none" }}>
                    {zone.spots.map((spot, idx) => (
                      <div key={idx} onClick={() => window.open(spot.mapUrl, "_blank")}
                        style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px", borderRadius:"12px", cursor:"pointer", borderBottom: idx<zone.spots.length-1?"1px solid #f3f4f6":"none" }}>
                        <div style={{ width:"56px", height:"56px", borderRadius:"12px", overflow:"hidden", flexShrink:0, background:"#f3f4f6", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {spot.photo
                            ? <img src={spot.photo} alt={getName(spot.name)} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display="none"; (e.target as HTMLImageElement).parentElement!.innerHTML=`<span style="font-size:24px">${spot.icon}</span>`; }} />
                            : <span style={{ fontSize:"24px" }}>{spot.icon}</span>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:"bold", fontSize:"13px", color:"#1f2937" }}>{getName(spot.name)}</div>
                          <p style={{ fontSize:"11px", color:"#6b7280", marginTop:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{getName(spot.desc)}</p>
                          <p style={{ fontSize:"10px", color:"#9ca3af", marginTop:"2px" }}>📍 {spot.address}</p>
                        </div>
                        <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ fontSize:"16px" }}>🗺️</span>
                        </div>
                      </div>
                    ))}
                    {zone.spots.some(s => s.link) && (
                      <div style={{ padding:"8px 10px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
                        {zone.spots.filter(s => s.link).map((spot, i) => (
                          <a key={i} href={spot.link} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ padding:"4px 10px", background:"#f0f9ff", color:"#2563eb", borderRadius:"8px", fontSize:"10px", fontWeight:"bold", textDecoration:"none", border:"1px solid #bfdbfe" }}>
                            🔗 {getName(spot.name)}
                          </a>
                        ))}
                      </div>
                    )}
                    {zone.id==="gangnam" && (
                      <div style={{ margin:"6px 10px 8px", padding:"10px 12px", background:"#faf5ff", borderRadius:"10px", border:"1px solid #d8b4fe" }}>
                        <p style={{ fontSize:"11px", fontWeight:"bold", color:"#7c3aed" }}>{locale==="ko"?"📌 BTS 논현동 성지순례 루트":"📌 BTS Nonhyeon Pilgrimage Route"}</p>
                        <p style={{ fontSize:"10px", color:"#6d28d9", marginTop:"4px", lineHeight:"1.5" }}>{locale==="ko"?"유정식당 → 청구빌딩(구 빅히트) → 학동공원 → 카페 휴가":"Yujeong → Old Big Hit Bldg → Hakdong Park → Cafe Hyuga"}</p>
                      </div>
                    )}
                    {zone.id==="seongsu" && (
                      <div style={{ margin:"6px 10px 8px", padding:"10px 12px", background:"#ecfdf5", borderRadius:"10px", border:"1px solid #a7f3d0" }}>
                        <p style={{ fontSize:"11px", fontWeight:"bold", color:"#059669" }}>{locale==="ko"?"📌 추천 루트":"📌 Recommended Route"}</p>
                        <p style={{ fontSize:"10px", color:"#047857", marginTop:"4px", lineHeight:"1.5" }}>{locale==="ko"?"2호선 성수역 → 큐베이커 → 도보 15분 → 광야@서울 → 성수 카페거리":"Line 2 Seongsu Stn → Cubaker → 15min walk → KWANGYA → Cafe Street"}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* K-Beauty */}
      <div className="px-4 mt-4">
        <div className="bg-rose-50 rounded-2xl shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-800">💄 K-Beauty</span>
            <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full">TREND</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {kbeautyItems.map((item, idx) => (
              <div key={idx} onClick={() => { if ((item as any).url) { window.open((item as any).url, "_blank"); } else if ((item as any).mapUrl) { window.open((item as any).mapUrl, "_blank"); } }}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[11px] font-semibold text-center leading-tight">{getName(item.name)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Places */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("popular")}</h2>
          <button onClick={() => router.push(`/${locale}/explore`)} className="text-sm text-blue-600 font-medium hover:text-blue-800">{tHome("seeAll")} →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {popularPlaces.map((place) => {
            const name = place.name[locale as keyof typeof place.name] || place.name.en;
            return (
              <div key={place.id} onClick={() => handlePlaceClick(place)}
                className="flex-shrink-0 w-44 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]">
                <div className="h-28 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-5xl">{place.image}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">{name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">⭐</span>
                    <span className="text-xs text-gray-500">{place.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">• {place.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 도시별 관광가이드 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{locale === "ko" ? "🗺️ 도시별 관광가이드" : "🗺️ City Tour Guide"}</h2>
        <div className="flex gap-3">
          <div onClick={() => router.push(`/${locale}/tour`)} className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95" style={{ background:"linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <span className="text-3xl">🏙️</span>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "서울 투어" : "Seoul Tour"}</h3>
            <p className="text-blue-100 text-[10px] mt-1">{locale === "ko" ? "코스·맛집·포토·교통" : "Courses·Food·Photo·Transport"}</p>
          </div>
          <div onClick={() => router.push(`/${locale}/tour`)} className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95" style={{ background:"linear-gradient(135deg, #06b6d4, #0891b2)" }}>
            <span className="text-3xl">🏖️</span>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "부산 투어" : "Busan Tour"}</h3>
            <p className="text-cyan-100 text-[10px] mt-1">{locale === "ko" ? "코스·맛집·포토·교통" : "Courses·Food·Photo·Transport"}</p>
          </div>
        </div>
      </div>

      {/* 시티투어버스 */}
      <div className="px-4 mt-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{locale === "ko" ? "🚌 시티투어버스" : "🚌 City Tour Bus"}</h2>
        <div className="flex gap-3">
          <a href="https://www.seoulcitytourbus.co.kr" target="_blank" rel="noopener noreferrer" className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95 no-underline" style={{ background:"linear-gradient(135deg, #ef4444, #f97316)" }}>
            <div className="flex items-center gap-1"><span className="text-3xl">🚌</span><span className="px-1.5 py-0.5 bg-yellow-400 text-red-800 text-[8px] font-bold rounded-full">HOT</span></div>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "서울 시티투어" : "Seoul City Tour"}</h3>
            <p className="text-red-100 text-[10px] mt-1">{locale === "ko" ? "2층버스·코스예약" : "Double-decker·Book"}</p>
          </a>
          <a href="https://www.citytourbusan.com" target="_blank" rel="noopener noreferrer" className="flex-1 rounded-2xl p-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95 no-underline" style={{ background:"linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
            <div className="flex items-center gap-1"><span className="text-3xl">🚌</span><span className="px-1.5 py-0.5 bg-yellow-400 text-purple-800 text-[8px] font-bold rounded-full">NEW</span></div>
            <h3 className="text-white font-bold text-sm mt-2">{locale === "ko" ? "부산 시티투어" : "Busan City Tour"}</h3>
            <p className="text-purple-100 text-[10px] mt-1">{locale === "ko" ? "레드·그린·오렌지라인" : "Red·Green·Orange Line"}</p>
          </a>
        </div>
      </div>

      {/* 네이버·쿠팡 */}
      <div className="px-4 mt-4">
        <div className="flex gap-2">
          <a href="https://m.search.naver.com/search.naver?query=%EC%84%9C%EC%9A%B8+%EC%8B%9C%ED%8B%B0%ED%88%AC%EC%96%B4+%EC%98%88%EC%95%BD" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-50 border-2 border-green-300 rounded-xl hover:bg-green-100 transition-colors active:scale-[0.98]">
            <span className="text-lg">🟢</span><span className="text-xs font-bold text-green-700">{locale === "ko" ? "네이버 투어상품" : "Naver Tour"}</span>
          </a>
          <a href="https://www.coupang.com/np/search?q=%EC%84%9C%EC%9A%B8+%EC%8B%9C%ED%8B%B0%ED%88%AC%EC%96%B4" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-50 border-2 border-red-300 rounded-xl hover:bg-red-100 transition-colors active:scale-[0.98]">
            <span className="text-lg">🔴</span><span className="text-xs font-bold text-red-700">{locale === "ko" ? "쿠팡 투어상품" : "Coupang Tour"}</span>
          </a>
        </div>
      </div>

      {/* SOS */}
      <div className="px-4 mt-6">
        <div onClick={() => router.push(`/${locale}/emergency`)} className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-md cursor-pointer hover:from-red-600 hover:to-red-700 transition-colors active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><span className="text-2xl">🆘</span></div>
            <div className="flex-1"><h3 className="font-bold text-sm">Emergency / 긴급상황</h3><p className="text-red-100 text-xs mt-0.5">Police 112 · Fire 119 · Tourism 1330</p></div>
            <button className="px-4 py-2 bg-white text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">SOS</button>
          </div>
        </div>
      </div>

      {/* Nearby */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{tHome("nearby")}</h2>
          <button onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)} className="text-sm text-blue-600 font-medium hover:text-blue-800">{tHome("seeAll")} →</button>
        </div>
        <div onClick={() => router.push(`/${locale}/map?gps=true&radius=${radius}`)} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors active:scale-[0.99] border border-blue-100">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-gray-700 text-sm font-medium">{tApp("nearMe")}</p>
          <p className="text-gray-400 text-xs mt-1">{locale === "ko" ? "탭하여 내 주변 관광지 보기" : "Tap to find places near you"}</p>
          <button className="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">{locale === "ko" ? "🗺️ 주변 탐색" : "🗺️ Explore Nearby"}</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
