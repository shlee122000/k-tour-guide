"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const emergencyContacts = [
  { icon: "🚔", number: "112", labelKey: "police", descKey: "policeDesc", color: "from-blue-500 to-blue-600" },
  { icon: "🚒", number: "119", labelKey: "fire", descKey: "fireDesc", color: "from-red-500 to-red-600" },
  { icon: "🏥", number: "1339", labelKey: "medical", descKey: "medicalDesc", color: "from-green-500 to-green-600" },
  { icon: "✈️", number: "1330", labelKey: "tourism", descKey: "tourismDesc", color: "from-purple-500 to-purple-600" },
  { icon: "🌐", number: "120", labelKey: "government", descKey: "governmentDesc", color: "from-teal-500 to-teal-600" },
  { icon: "🏢", number: "1345", labelKey: "immigration", descKey: "immigrationDesc", color: "from-orange-500 to-orange-600" },
];

const quickSearchItems = [
  { icon: "💊", titleKey: "pharmacy", descKey: "pharmacyDesc", search: "약국" },
  { icon: "🏥", titleKey: "hospital", descKey: "hospitalDesc", search: "병원" },
  { icon: "🏧", titleKey: "atm", descKey: "atmDesc", search: "ATM" },
  { icon: "🏪", titleKey: "convenience", descKey: "convenienceDesc", search: "편의점" },
];

export default function EmergencyPage() {
  const t = useTranslations("emergency");
  const locale = useLocale();
  const router = useRouter();

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
              <h1 className="text-xl font-bold">🆘 {t("title")}</h1>
              <p className="text-red-200 text-xs mt-0.5">{t("subtitle")}</p>
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
                  <h3 className="font-bold text-gray-800 text-sm">{t(contact.labelKey)}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{t(contact.descKey)}</p>
                </div>
                <button
                  onClick={() => handleCall(contact.number)}
                  className={`px-5 py-3 bg-gradient-to-r ${contact.color} text-white rounded-xl text-lg font-bold hover:opacity-90 transition-opacity active:scale-95 flex-shrink-0`}
                >
                  📞 {contact.number}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nearby Search */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          🔍 {t("quickSearch")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickSearchItems.map((item) => (
            <button
              key={item.search}
              onClick={() => handleSearchOnMap(item.search)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-gray-800 text-sm mt-2">{t(item.titleKey)}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{t(item.descKey)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Useful Tips */}
      <div className="px-4 mt-6 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="font-bold text-amber-800 text-sm mb-2">
            💡 {t("tips")}
          </h3>
          <div className="space-y-2 text-xs text-amber-700">
            <p>• {t("tip1")}</p>
            <p>• {t("tip2")}</p>
            <p>• {t("tip3")}</p>
            <p>• {t("tip4")}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
