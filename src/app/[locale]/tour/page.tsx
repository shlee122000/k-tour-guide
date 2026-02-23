"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import {
  seoulCourses, busanCourses,
  seoulRestaurants, busanRestaurants,
  seoulPhotoSpots, busanPhotoSpots,
  seoulTransport, busanTransport,
  type TourCourse, type Restaurant, type PhotoSpot, type TransportInfo, type TourSpot,
} from "@/data/tourData";

type City = "seoul" | "busan";
type Tab = "course" | "food" | "photo" | "transport";

const L = (obj: Record<string, string>, locale: string) => obj[locale] || obj.en || obj.ko || "";

export default function TourPage() {
  const t = useTranslations("tour");
  const locale = useLocale();

  const [city, setCity] = useState<City>("seoul");
  const [tab, setTab] = useState<Tab>("course");
  const [selectedCourse, setSelectedCourse] = useState<TourCourse | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<TourSpot | Restaurant | PhotoSpot | null>(null);

  const courses = city === "seoul" ? seoulCourses : busanCourses;
  const restaurants = city === "seoul" ? seoulRestaurants : busanRestaurants;
  const photoSpots = city === "seoul" ? seoulPhotoSpots : busanPhotoSpots;
  const transport = city === "seoul" ? seoulTransport : busanTransport;

  const tabs: { key: Tab; icon: string }[] = [
    { key: "course", icon: "🗺️" },
    { key: "food", icon: "🍽️" },
    { key: "photo", icon: "📸" },
    { key: "transport", icon: "🚇" },
  ];

  const openKakaoMap = (lat: number, lng: number, name: string) => {
    window.open(`https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`, "_blank");
  };

  const openDirections = (lat: number, lng: number, name: string) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.open(
          `https://map.kakao.com/link/from/내 위치,${pos.coords.latitude},${pos.coords.longitude}/to/${encodeURIComponent(name)},${lat},${lng}`,
          "_blank"
        );
      },
      () => {
        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`, "_blank");
      }
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", maxWidth: "448px", margin: "0 auto", paddingBottom: "80px" }}>

      {/* 헤더 */}
      <div style={{
        background: city === "seoul"
          ? "linear-gradient(135deg, #3b82f6, #6366f1)"
          : "linear-gradient(135deg, #06b6d4, #0891b2)",
        color: "white", padding: "48px 16px 20px",
        borderRadius: "0 0 24px 24px",
      }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>
          {city === "seoul" ? "🏙️" : "🏖️"} {t(city === "seoul" ? "seoulTitle" : "busanTitle")}
        </h1>
        <p style={{ fontSize: "12px", opacity: 0.8 }}>{t(city === "seoul" ? "seoulDesc" : "busanDesc")}</p>

        {/* 도시 선택 */}
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          {(["seoul", "busan"] as City[]).map((c) => (
            <button key={c} onClick={() => { setCity(c); setSelectedCourse(null); setSelectedSpot(null); }}
              style={{
                flex: 1, padding: "10px", borderRadius: "12px", fontSize: "14px", fontWeight: "bold",
                border: "2px solid", cursor: "pointer", transition: "all 0.2s",
                background: city === c ? "white" : "transparent",
                color: city === c ? (c === "seoul" ? "#4f46e5" : "#0891b2") : "rgba(255,255,255,0.8)",
                borderColor: city === c ? "white" : "rgba(255,255,255,0.3)",
              }}>
              {c === "seoul" ? `🏙️ ${t("seoul")}` : `🏖️ ${t("busan")}`}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: "flex", gap: "6px", padding: "12px 16px 0", overflowX: "auto" }}>
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => { setTab(tb.key); setSelectedCourse(null); setSelectedSpot(null); }}
            style={{
              flex: 1, padding: "10px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold",
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
              background: tab === tb.key ? "#4f46e5" : "white",
              color: tab === tb.key ? "white" : "#6b7280",
              boxShadow: tab === tb.key ? "0 2px 8px rgba(79,70,229,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
            }}>
            {tb.icon} {t(`tab${tb.key.charAt(0).toUpperCase() + tb.key.slice(1)}`)}
          </button>
        ))}
      </div>

      {/* ===== 추천 코스 ===== */}
      {tab === "course" && !selectedCourse && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {courses.map((course) => (
            <button key={course.id} onClick={() => setSelectedCourse(course)}
              style={{
                background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)", cursor: "pointer", textAlign: "left", width: "100%",
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold",
                      background: course.duration === "1" ? "#dbeafe" : course.duration === "2" ? "#e0e7ff" : "#ede9fe",
                      color: course.duration === "1" ? "#2563eb" : course.duration === "2" ? "#4338ca" : "#6d28d9",
                    }}>
                      {course.duration}{t("dayUnit")}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>📍 {course.spots.length}{t("spotsUnit")}</span>
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1f2937" }}>{L(course.title, locale)}</h3>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{L(course.desc, locale)}</p>
                </div>
                <span style={{ fontSize: "20px", color: "#d1d5db" }}>›</span>
              </div>
              {/* 미니 스팟 프리뷰 */}
              <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                {course.spots.slice(0, 4).map((spot) => (
                  <span key={spot.id} style={{
                    padding: "3px 8px", background: "#f9fafb", borderRadius: "8px",
                    fontSize: "11px", color: "#6b7280",
                  }}>
                    {spot.image} {L(spot.name, locale)}
                  </span>
                ))}
                {course.spots.length > 4 && (
                  <span style={{ padding: "3px 8px", fontSize: "11px", color: "#9ca3af" }}>+{course.spots.length - 4}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ===== 코스 상세 ===== */}
      {tab === "course" && selectedCourse && (
        <div style={{ padding: "12px 16px" }}>
          <button onClick={() => setSelectedCourse(null)}
            style={{
              padding: "8px 14px", borderRadius: "10px", background: "#f3f4f6", border: "none",
              fontSize: "13px", color: "#4f46e5", fontWeight: "bold", cursor: "pointer", marginBottom: "12px",
            }}>
            ← {t("backToList")}
          </button>

          <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}>{L(selectedCourse.title, locale)}</h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>{L(selectedCourse.desc, locale)}</p>

            {/* 코스 타임라인 */}
            {selectedCourse.spots.map((spot, idx) => (
              <div key={spot.id} style={{ display: "flex", gap: "12px", marginBottom: idx < selectedCourse.spots.length - 1 ? "0" : "0" }}>
                {/* 타임라인 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "32px", flexShrink: 0 }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: "bold", color: "white",
                    background: city === "seoul" ? "#4f46e5" : "#0891b2",
                  }}>
                    {idx + 1}
                  </div>
                  {idx < selectedCourse.spots.length - 1 && (
                    <div style={{ width: "2px", height: "100%", minHeight: "40px", background: "#e5e7eb" }} />
                  )}
                </div>

                {/* 스팟 카드 */}
                <div style={{
                  flex: 1, background: "#f9fafb", borderRadius: "14px", padding: "12px",
                  marginBottom: "8px", border: "1px solid #f0f0f0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "20px" }}>{spot.image}</span>
                    <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>{L(spot.name, locale)}</h4>
                    {spot.time && (
                      <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "auto", background: "#f3f4f6", padding: "2px 6px", borderRadius: "6px" }}>
                        ⏱ {spot.time}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>{L(spot.desc, locale)}</p>
                  {spot.tip && (
                    <p style={{ fontSize: "11px", color: "#f59e0b", background: "#fffbeb", padding: "6px 8px", borderRadius: "8px", marginBottom: "8px" }}>
                      💡 {L(spot.tip, locale)}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => openKakaoMap(spot.lat, spot.lng, L(spot.name, locale))}
                      style={{ padding: "6px 10px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
                      🗺️ {t("viewMap")}
                    </button>
                    <button onClick={() => openDirections(spot.lat, spot.lng, L(spot.name, locale))}
                      style={{ padding: "6px 10px", borderRadius: "8px", background: "#f0fdf4", color: "#16a34a", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
                      🚶 {t("directions")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 맛집 리스트 ===== */}
      {tab === "food" && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {restaurants.map((r) => (
            <div key={r.id} style={{
              background: "white", borderRadius: "16px", padding: "14px", border: "1px solid #f0f0f0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px", background: "#fef3c7",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0,
                }}>
                  {r.image}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>{L(r.name, locale)}</h4>
                    <span style={{ fontSize: "11px", color: "#f59e0b" }}>{r.price}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>{L(r.desc, locale)}</p>
                </div>
              </div>
              <div style={{
                margin: "10px 0 8px", padding: "8px 10px", background: "#fef3c7", borderRadius: "10px",
                fontSize: "12px", color: "#92400e",
              }}>
                ⭐ {t("mustTry")}: <b>{L(r.mustTry, locale)}</b>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => openKakaoMap(r.lat, r.lng, L(r.name, locale))}
                  style={{ flex: 1, padding: "8px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  🗺️ {t("viewMap")}
                </button>
                <button onClick={() => openDirections(r.lat, r.lng, L(r.name, locale))}
                  style={{ flex: 1, padding: "8px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  🚶 {t("directions")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 포토스팟 ===== */}
      {tab === "photo" && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {photoSpots.map((p) => (
            <div key={p.id} style={{
              background: "white", borderRadius: "16px", padding: "14px", border: "1px solid #f0f0f0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px", background: "#fce7f3",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0,
                }}>
                  {p.image}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>{L(p.name, locale)}</h4>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>{L(p.desc, locale)}</p>
                </div>
              </div>
              <div style={{
                margin: "10px 0 8px", padding: "8px 10px", background: "#fdf2f8", borderRadius: "10px",
                fontSize: "12px", color: "#9d174d",
              }}>
                📷 {t("bestTime")}: <b>{L(p.bestTime, locale)}</b>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => openKakaoMap(p.lat, p.lng, L(p.name, locale))}
                  style={{ flex: 1, padding: "8px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  🗺️ {t("viewMap")}
                </button>
                <button onClick={() => openDirections(p.lat, p.lng, L(p.name, locale))}
                  style={{ flex: 1, padding: "8px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  🚶 {t("directions")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 교통 가이드 ===== */}
      {tab === "transport" && (
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {transport.map((tr) => (
            <div key={tr.id} style={{
              background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f0f0f0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px", background: "#ecfdf5",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
                }}>
                  {tr.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#1f2937" }}>{L(tr.title, locale)}</h4>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>{L(tr.desc, locale)}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(tr.tips[locale] || tr.tips.en || tr.tips.ko).map((tip, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "flex-start", gap: "8px",
                    padding: "8px 10px", background: "#f0fdf4", borderRadius: "10px",
                  }}>
                    <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "12px", color: "#374151", lineHeight: "1.4" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
