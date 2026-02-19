"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import { useState, useEffect } from "react";

// 즐겨찾기 타입
interface FavoritePlace {
  id: string;
  name: string;
  address: string;
  image: string;
  contentTypeId: number;
  addedAt: string;
}

// 여행 통계 타입
interface TripStats {
  totalTrips: number;
  totalPlaces: number;
  totalDays: number;
  favorites: number;
}

const getCatIcon = (ct: number) => {
  switch (ct) {
    case 12: return "🏛️"; case 39: return "🍽️"; case 38: return "🛍️";
    case 14: return "🎭"; case 32: return "🏨"; default: return "📍";
  }
};

export default function MyPage() {
  const t = useTranslations("mypage");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"favorites" | "settings">("favorites");
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);
  const [stats, setStats] = useState<TripStats>({ totalTrips: 0, totalPlaces: 0, totalDays: 0, favorites: 0 });
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage에서 데이터 로드
  useEffect(() => {
    try {
      // 즐겨찾기 로드
      const savedFav = localStorage.getItem("k-tour-favorites");
      if (savedFav) setFavorites(JSON.parse(savedFav));

      // 여행 통계 계산
      const savedTrips = localStorage.getItem("k-tour-planner");
      if (savedTrips) {
        const trips = JSON.parse(savedTrips);
        const totalPlaces = trips.reduce((sum: number, trip: any) =>
          sum + trip.days.reduce((ds: number, day: any) => ds + day.places.length, 0), 0);
        const totalDays = trips.reduce((sum: number, trip: any) => sum + trip.days.length, 0);
        const favCount = savedFav ? JSON.parse(savedFav).length : 0;
        setStats({ totalTrips: trips.length, totalPlaces, totalDays, favorites: favCount });
      } else {
        const favCount = savedFav ? JSON.parse(savedFav).length : 0;
        setStats(prev => ({ ...prev, favorites: favCount }));
      }
    } catch { /* empty */ }
    setIsLoaded(true);
  }, []);

  // 즐겨찾기 저장 (초기 로드 후에만)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("k-tour-favorites", JSON.stringify(favorites));
      setStats(prev => ({ ...prev, favorites: favorites.length }));
    } catch { /* empty */ }
  }, [favorites, isLoaded]);

  // 즐겨찾기 삭제
  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // 언어 변경
  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setShowLangPicker(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", maxWidth: "448px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "white", padding: "48px 16px 24px", borderRadius: "0 0 24px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "56px", height: "56px", background: "rgba(255,255,255,0.2)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", backdropFilter: "blur(4px)",
          }}>
            👤
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>{t("title")}</h1>
            <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
              {localeFlags[locale]} {localeNames[locale]} · K-Tour Guide
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px",
          marginTop: "16px", background: "rgba(255,255,255,0.15)", borderRadius: "16px", padding: "12px",
        }}>
          {[
            { value: stats.totalTrips, label: t("statTrips"), icon: "✈️" },
            { value: stats.totalDays, label: t("statDays"), icon: "📅" },
            { value: stats.totalPlaces, label: t("statPlaces"), icon: "📍" },
            { value: stats.favorites, label: t("statFavorites"), icon: "❤️" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px" }}>{stat.icon}</div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>{stat.value}</div>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: "flex", gap: "8px", padding: "12px 16px 0" }}>
        {(["favorites", "settings"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "10px", borderRadius: "12px", fontSize: "14px", fontWeight: "bold",
              border: "none", cursor: "pointer",
              background: activeTab === tab ? "#4f46e5" : "white",
              color: activeTab === tab ? "white" : "#6b7280",
              boxShadow: activeTab === tab ? "0 2px 8px rgba(79,70,229,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
            }}>
            {tab === "favorites" ? `❤️ ${t("tabFavorites")}` : `⚙️ ${t("tabSettings")}`}
          </button>
        ))}
      </div>

      {/* ===== 즐겨찾기 탭 ===== */}
      {activeTab === "favorites" && (
        <div style={{ padding: "12px 16px" }}>
          {favorites.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 16px",
              background: "white", borderRadius: "16px", border: "2px dashed #e5e7eb",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>❤️</div>
              <p style={{ color: "#9ca3af", fontSize: "14px", fontWeight: "500" }}>{t("noFavorites")}</p>
              <p style={{ color: "#d1d5db", fontSize: "12px", marginTop: "4px" }}>{t("noFavoritesHint")}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {favorites.map((place) => (
                <div key={place.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "white", borderRadius: "16px", padding: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
                }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "12px", overflow: "hidden",
                    flexShrink: 0, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {place.image ? (
                      <img src={place.image} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "24px" }}>{getCatIcon(place.contentTypeId)}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: "bold", color: "#1f2937", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {place.name}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {place.address}
                    </p>
                  </div>
                  <button onClick={() => removeFavorite(place.id)}
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2",
                      color: "#ef4444", border: "none", fontSize: "14px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== 설정 탭 ===== */}
      {activeTab === "settings" && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* 언어 설정 */}
          <div style={{
            background: "white", borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
          }}>
            <button onClick={() => setShowLangPicker(!showLangPicker)}
              style={{
                width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", background: "#eef2ff", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                }}>🌐</div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "bold", color: "#1f2937", fontSize: "14px" }}>{t("language")}</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>{localeFlags[locale]} {localeNames[locale]}</p>
                </div>
              </div>
              <span style={{ color: "#9ca3af", fontSize: "18px", transform: showLangPicker ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
            </button>

            {showLangPicker && (
              <div style={{ borderTop: "1px solid #f3f4f6", padding: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {locales.map((loc) => (
                    <button key={loc} onClick={() => switchLocale(loc)}
                      style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                        background: locale === loc ? "#4f46e5" : "#f9fafb",
                        color: locale === loc ? "white" : "#374151",
                        fontSize: "13px", fontWeight: locale === loc ? "bold" : "normal",
                      }}>
                      <span style={{ fontSize: "18px" }}>{localeFlags[loc]}</span>
                      <span>{localeNames[loc]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 여행 통계 */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "40px", height: "40px", background: "#fef3c7", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>📊</div>
              <p style={{ fontWeight: "bold", color: "#1f2937", fontSize: "14px" }}>{t("travelStats")}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: "✈️", label: t("statTrips"), value: stats.totalTrips, unit: t("unitTrips"), color: "#6366f1" },
                { icon: "📅", label: t("statDays"), value: stats.totalDays, unit: t("unitDays"), color: "#8b5cf6" },
                { icon: "📍", label: t("statPlaces"), value: stats.totalPlaces, unit: t("unitPlaces"), color: "#ec4899" },
                { icon: "❤️", label: t("statFavorites"), value: stats.favorites, unit: t("unitPlaces"), color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", background: "#f9fafb", borderRadius: "10px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: item.color }}>
                    {item.value} <span style={{ fontSize: "11px", fontWeight: "normal", color: "#9ca3af" }}>{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 데이터 관리 */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "40px", height: "40px", background: "#fef2f2", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>🗑️</div>
              <p style={{ fontWeight: "bold", color: "#1f2937", fontSize: "14px" }}>{t("dataManage")}</p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => {
                if (confirm(t("confirmClearFavorites"))) {
                  setFavorites([]);
                  localStorage.removeItem("k-tour-favorites");
                }
              }}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #fecaca",
                  background: "#fff5f5", color: "#ef4444", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
                }}>
                {t("clearFavorites")}
              </button>
              <button onClick={() => {
                if (confirm(t("confirmClearTrips"))) {
                  localStorage.removeItem("k-tour-planner");
                  setStats(prev => ({ ...prev, totalTrips: 0, totalPlaces: 0, totalDays: 0 }));
                }
              }}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #fecaca",
                  background: "#fff5f5", color: "#ef4444", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
                }}>
                {t("clearTrips")}
              </button>
            </div>
          </div>

          {/* 앱 정보 */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "40px", height: "40px", background: "#ecfdf5", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              }}>ℹ️</div>
              <p style={{ fontWeight: "bold", color: "#1f2937", fontSize: "14px" }}>{t("appInfo")}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { label: t("appName"), value: "K-Tour Guide" },
                { label: t("version"), value: "1.0.0" },
                { label: t("languages"), value: `${t("supportLangs")}` },
                { label: t("developer"), value: "K-Tour Team" },
                { label: t("dataSource"), value: "Korea Tourism API" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: "1px solid #f9fafb",
                }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{item.label}</span>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "12px", padding: "10px", background: "#f0fdf4", borderRadius: "10px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "11px", color: "#16a34a" }}>
                {t("freeNotice")}
              </p>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
