"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const emergencyContacts = [
  {
    icon: "🚔",
    number: "112",
    label: { ko: "경찰", en: "Police", ja: "警察", zh: "警察", es: "Policía", fr: "Police", th: "ตำรวจ", vi: "Cảnh sát", id: "Polisi", de: "Polizei" },
    desc: { ko: "범죄, 사건, 사고 신고", en: "Crime, accidents, emergencies", ja: "犯罪・事件・事故の通報", zh: "犯罪、事件、事故报警" },
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "🚒",
    number: "119",
    label: { ko: "소방/구급", en: "Fire/Ambulance", ja: "消防/救急", zh: "消防/急救", es: "Bomberos/Ambulancia", fr: "Pompiers/Ambulance", th: "ดับเพลิง/รถพยาบาล", vi: "Cứu hỏa/Cấp cứu", id: "Pemadam/Ambulans", de: "Feuerwehr/Rettung" },
    desc: { ko: "화재, 구급, 구조 요청", en: "Fire, medical, rescue", ja: "火災・救急・救助要請", zh: "火灾、急救、救援" },
    color: "from-red-500 to-red-600",
  },
  {
    icon: "🏥",
    number: "1339",
    label: { ko: "응급의료", en: "Medical Emergency", ja: "救急医療", zh: "急救医疗", es: "Emergencia Médica", fr: "Urgence Médicale", th: "ฉุกเฉินทางการแพทย์", vi: "Y tế khẩn cấp", id: "Darurat Medis", de: "Notarzt" },
    desc: { ko: "응급의료 정보센터", en: "Emergency medical info center", ja: "救急医療情報センター", zh: "急救医疗信息中心" },
    color: "from-green-500 to-green-600",
  },
  {
    icon: "✈️",
    number: "1330",
    label: { ko: "관광안내", en: "Tourism Helpline", ja: "観光案内", zh: "旅游咨询", es: "Turismo", fr: "Tourisme", th: "สายด่วนท่องเที่ยว", vi: "Hỗ trợ du lịch", id: "Bantuan Wisata", de: "Tourismus-Hilfe" },
    desc: { ko: "한국관광공사 다국어 안내", en: "Korea Tourism multilingual help", ja: "韓国観光公社 多言語案内", zh: "韩国旅游公社多语言服务" },
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: "🌐",
    number: "120",
    label: { ko: "다산콜센터", en: "Government Help", ja: "政府ヘルプ", zh: "政府帮助", es: "Ayuda Gubernamental", fr: "Aide Gouvernementale", th: "ช่วยเหลือรัฐบาล", vi: "Hỗ trợ chính phủ", id: "Bantuan Pemerintah", de: "Regierungshilfe" },
    desc: { ko: "서울시 생활정보, 다국어 지원", en: "Seoul city info, multilingual", ja: "ソウル市生活情報、多言語対応", zh: "首尔市生活信息，多语言支持" },
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: "🏢",
    number: "1345",
    label: { ko: "출입국/비자", en: "Immigration", ja: "出入国/ビザ", zh: "出入境/签证", es: "Inmigración", fr: "Immigration", th: "ตรวจคนเข้าเมือง", vi: "Nhập cảnh", id: "Imigrasi", de: "Einwanderung" },
    desc: { ko: "출입국·외국인 민원상담", en: "Immigration & visa help", ja: "出入国・外国人相談", zh: "出入境·外国人咨询" },
    color: "from-orange-500 to-orange-600",
  },
];

const quickSearch = [
  {
    icon: "💊",
    title: { ko: "약국 찾기", en: "Find Pharmacy", ja: "薬局検索", zh: "查找药房" },
    desc: { ko: "가까운 약국 지도에서 보기", en: "Nearby pharmacies on map", ja: "近くの薬局を地図で見る", zh: "在地图上查看附近药房" },
    search: "약국",
  },
  {
    icon: "🏥",
    title: { ko: "병원 찾기", en: "Find Hospital", ja: "病院検索", zh: "查找医院" },
    desc: { ko: "가까운 병원 지도에서 보기", en: "Nearby hospitals on map", ja: "近くの病院を地図で見る", zh: "在地图上查看附近医院" },
    search: "병원",
  },
  {
    icon: "🏧",
    title: { ko: "ATM 찾기", en: "Find ATM", ja: "ATM検索", zh: "查找ATM" },
    desc: { ko: "가까운 ATM/은행 찾기", en: "Nearby ATMs and banks", ja: "近くのATM/銀行を探す", zh: "查找附近ATM/银行" },
    search: "ATM",
  },
  {
    icon: "🏪",
    title: { ko: "편의점 찾기", en: "Convenience Store", ja: "コンビニ検索", zh: "查找便利店" },
    desc: { ko: "24시간 편의점 찾기", en: "24h convenience stores", ja: "24時間コンビニを探す", zh: "查找24小时便利店" },
    search: "편의점",
  },
];

export default function EmergencyPage() {
  const locale = useLocale();
  const router = useRouter();

  const getLocalText = (textObj: Record<string, string>) => {
    return textObj[locale] || textObj.en || Object.values(textObj)[0];
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleSearchOnMap = (keyword: string) => {
    router.push(`/${locale}/map?search=${encodeURIComponent(keyword)}&gps=true`);
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="px-4 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold">🆘 {locale === "ko" ? "긴급 도움" : "Emergency Help"}</h1>
              <p className="text-red-200 text-xs mt-0.5">
                {locale === "ko" ? "긴급 상황 시 아래 번호로 전화하세요" : "Call these numbers in an emergency"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="px-4 -mt-2">
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.number}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="flex items-center gap-3 p-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{contact.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm">{getLocalText(contact.label)}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{getLocalText(contact.desc)}</p>
                </div>
                <button
                  onClick={() => handleCall(contact.number)}
                  className={`px-4 py-3 bg-gradient-to-r ${contact.color} text-white rounded-xl text-base font-bold hover:opacity-90 transition-opacity active:scale-95 flex-shrink-0`}
                >
                  📞 {contact.number}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Search - Nearby Facilities */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          {locale === "ko" ? "🔍 주변 시설 빠른 검색" : "🔍 Quick Nearby Search"}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickSearch.map((info) => (
            <button
              key={info.search}
              onClick={() => handleSearchOnMap(info.search)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <span className="text-3xl">{info.icon}</span>
              <h3 className="font-bold text-gray-800 text-sm mt-2">{getLocalText(info.title)}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{getLocalText(info.desc)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Useful Tips */}
      <div className="px-4 mt-6 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="font-bold text-amber-800 text-sm mb-2">
            💡 {locale === "ko" ? "알아두면 좋은 팁" : "Useful Tips"}
          </h3>
          <div className="space-y-2 text-xs text-amber-700">
            <p>• {locale === "ko" ? "1330 관광안내는 영어, 일본어, 중국어 등 다국어 지원" : "1330 Tourism helpline supports English, Japanese, Chinese, and more"}</p>
            <p>• {locale === "ko" ? "119 구급대는 외국어 통역 서비스 제공" : "119 ambulance provides foreign language interpretation"}</p>
            <p>• {locale === "ko" ? "대부분의 경찰서에서 외국인 지원 가능" : "Most police stations can assist foreigners"}</p>
            <p>• {locale === "ko" ? "여권 분실 시 가까운 대사관/영사관에 연락하세요" : "If you lose your passport, contact the nearest embassy/consulate"}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
