"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface PlanPlace {
  id: string; name: string; address: string; lat: number; lng: number;
  image: string; contentTypeId: number; memo: string; time: string;
}
interface PlanDay { date: string; places: PlanPlace[]; dayMemo: string; }
interface Trip {
  id: string; title: string; startDate: string; endDate: string;
  days: PlanDay[]; createdAt: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const days = ["일","월","화","수","목","금","토"];
  return `${d.getMonth()+1}/${d.getDate()} (${days[d.getDay()]})`;
};
const getDaysBetween = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const current = new Date(start);
  const last = new Date(end);
  while (current <= last) { dates.push(current.toISOString().split("T")[0]); current.setDate(current.getDate()+1); }
  return dates;
};
const getCatIcon = (ct: number) => {
  switch(ct) { case 12: return "🏛️"; case 39: return "🍽️"; case 38: return "🛍️"; case 14: return "🎭"; case 32: return "🏨"; default: return "📍"; }
};

export default function PlannerPage() {
  const t = useTranslations("planner");
  const locale = useLocale();
  const [view, setView] = useState<"list"|"create"|"detail"|"search"|"map">("list");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip|null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlanPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingMemo, setEditingMemo] = useState<string|null>(null);
  const [editingDayMemo, setEditingDayMemo] = useState(false);
  const [tempMemo, setTempMemo] = useState("");
  const [addedPlaceIds, setAddedPlaceIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string|null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => { try { const s = localStorage.getItem("k-tour-planner"); if (s) setTrips(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("k-tour-planner", JSON.stringify(trips)); } catch {} }, [trips]);

  const updateCurrentTrip = useCallback((u: Trip) => { setCurrentTrip(u); setTrips(p => p.map(t => t.id===u.id?u:t)); }, []);

  const createTrip = () => {
    if (!newTitle||!newStart||!newEnd) return;
    if (new Date(newEnd)<new Date(newStart)) return;
    const dates = getDaysBetween(newStart, newEnd);
    const trip: Trip = { id: Date.now().toString(), title: newTitle, startDate: newStart, endDate: newEnd,
      days: dates.map(date => ({ date, places: [], dayMemo: "" })), createdAt: new Date().toISOString() };
    setTrips(p => [trip,...p]); setCurrentTrip(trip); setSelectedDayIndex(0);
    setNewTitle(""); setNewStart(""); setNewEnd(""); setView("detail");
  };
  const deleteTrip = (id: string) => { if(!confirm("삭제하시겠습니까?")) return; setTrips(p=>p.filter(t=>t.id!==id)); if(currentTrip?.id===id){setCurrentTrip(null);setView("list");} };
  const searchPlaces = async () => {
    if (!searchQuery.trim()) return; setIsSearching(true);
    try {
      const res = await fetch(`/api/tour?endpoint=searchKeyword2&keyword=${encodeURIComponent(searchQuery)}&numOfRows=20&pageNo=1`);
      const data = await res.json(); const items = data?.response?.body?.items?.item || [];
      setSearchResults(items.map((item:any) => ({ id:item.contentid||Date.now().toString(), name:item.title||"", address:item.addr1||"",
        lat:parseFloat(item.mapy)||0, lng:parseFloat(item.mapx)||0, image:item.firstimage||"", contentTypeId:parseInt(item.contenttypeid)||0, memo:"", time:"" })));
    } catch { setSearchResults([]); } setIsSearching(false);
  };
  const addPlaceToDay = (place: PlanPlace) => { if(!currentTrip) return; const u={...currentTrip}; u.days[selectedDayIndex].places.push({...place,id:`${place.id}-${Date.now()}`,memo:"",time:""}); updateCurrentTrip(u); setAddedPlaceIds(prev => new Set(prev).add(place.id)); showToast(`✅ Day ${selectedDayIndex+1}에 "${place.name}" 추가!`); };
  const removePlaceFromDay = (di:number, pid:string) => { if(!currentTrip) return; const u={...currentTrip}; u.days[di].places=u.days[di].places.filter(p=>p.id!==pid); updateCurrentTrip(u); };
  const movePlaceInDay = (di:number, pi:number, dir:"up"|"down") => { if(!currentTrip) return; const u={...currentTrip}; const pl=[...u.days[di].places]; const ti=dir==="up"?pi-1:pi+1; if(ti<0||ti>=pl.length) return; [pl[pi],pl[ti]]=[pl[ti],pl[pi]]; u.days[di].places=pl; updateCurrentTrip(u); };
  const savePlaceMemo = (di:number, pid:string, memo:string) => { if(!currentTrip) return; const u={...currentTrip}; const p=u.days[di].places.find(p=>p.id===pid); if(p) p.memo=memo; updateCurrentTrip(u); setEditingMemo(null); };
  const saveDayMemo = (di:number, memo:string) => { if(!currentTrip) return; const u={...currentTrip}; u.days[di].dayMemo=memo; updateCurrentTrip(u); setEditingDayMemo(false); };
  const savePlaceTime = (di:number, pid:string, time:string) => { if(!currentTrip) return; const u={...currentTrip}; const p=u.days[di].places.find(p=>p.id===pid); if(p) p.time=time; updateCurrentTrip(u); };
  const showMapForDay = useCallback((di:number) => { if(!currentTrip) return; setSelectedDayIndex(di); setView("map"); }, [currentTrip]);

  useEffect(() => {
    if (view!=="map"||!mapRef.current||!currentTrip) return;
    const loadMap = () => {
      if (!window.kakao?.maps) { setTimeout(loadMap,300); return; }
      const places = currentTrip.days[selectedDayIndex]?.places||[];
      const center = places.length>0 ? new window.kakao.maps.LatLng(places[0].lat,places[0].lng) : new window.kakao.maps.LatLng(37.5665,126.9780);
      const map = new window.kakao.maps.Map(mapRef.current,{center,level:places.length>1?8:5}); mapInstanceRef.current=map;
      const bounds = new window.kakao.maps.LatLngBounds();
      places.forEach((place,idx) => {
        const pos = new window.kakao.maps.LatLng(place.lat,place.lng); bounds.extend(pos);
        new window.kakao.maps.CustomOverlay({position:pos,yAnchor:1,content:`<div style="background:linear-gradient(135deg,#6366f1,#a855f7);color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${idx+1}</div>`}).setMap(map);
        new window.kakao.maps.CustomOverlay({position:pos,yAnchor:0,content:`<div style="background:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.15);margin-top:6px;white-space:nowrap;color:#4f46e5;">${place.name}</div>`}).setMap(map);
      });
      if (places.length>1) { new window.kakao.maps.Polyline({path:places.map(p=>new window.kakao.maps.LatLng(p.lat,p.lng)),strokeWeight:4,strokeColor:"#6366f1",strokeOpacity:0.7,strokeStyle:"shortdash"}).setMap(map); map.setBounds(bounds,80); }
    };
    if (!document.querySelector("script[src*='kakao']")) { const s=document.createElement("script"); s.src=`//dapi.kakao.com/v2/maps/sdk.js?appkey=475acb61e3bd924d5b0183732981ecd6&autoload=false`; s.onload=()=>window.kakao.maps.load(loadMap); document.head.appendChild(s); }
    else if (window.kakao?.maps) loadMap(); else window.kakao.maps.load(loadMap);
  }, [view, currentTrip, selectedDayIndex]);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none} .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">📋 {t("title")}</h1>
            <p className="text-indigo-200 text-xs mt-0.5">{t("subtitle")}</p>
          </div>
          {view !== "list" && (
            <button onClick={() => { if(view==="search"||view==="map") {setView("detail");setAddedPlaceIds(new Set());setSearchResults([]);setSearchQuery("");} else {setView("list");setCurrentTrip(null);} }}
              style={{background:"rgba(255,255,255,0.3)",color:"white",padding:"8px 16px",borderRadius:"12px",fontSize:"14px",fontWeight:"bold",backdropFilter:"blur(4px)"}}>← {t("back")}</button>
          )}
        </div>
      </div>

      {/* ===== 여행 목록 ===== */}
      {view === "list" && (
        <div className="px-4 -mt-4">
          <button onClick={() => setView("create")}
            className="w-full py-5 bg-white rounded-2xl shadow-lg border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:shadow-xl active:scale-[0.98] transition-all flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl">✈️</span>
            </div>
            <span className="font-bold text-indigo-600 text-base">{t("createTrip")}</span>
          </button>

          {trips.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🗺️</span>
              </div>
              <p className="text-gray-500 text-sm font-medium">{t("noTrips")}</p>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {[{icon:"📝",label:"일정 작성",bg:"bg-blue-50"},{icon:"🔍",label:"장소 검색",bg:"bg-orange-50"},{icon:"🗺️",label:"지도 확인",bg:"bg-green-50"},{icon:"💾",label:"자동 저장",bg:"bg-purple-50"}].map(f=>(
                  <div key={f.icon} className="flex flex-col items-center gap-1.5">
                    <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center shadow-sm`}><span className="text-2xl">{f.icon}</span></div>
                    <span className="text-xs text-gray-500 font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {trips.map((trip) => {
                const totalPlaces = trip.days.reduce((s,d)=>s+d.places.length,0);
                const colors = ["from-blue-400 to-blue-500","from-purple-400 to-purple-500","from-pink-400 to-pink-500","from-teal-400 to-teal-500"];
                return (
                  <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${colors[parseInt(trip.id)%colors.length]}`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <button onClick={()=>{setCurrentTrip(trip);setSelectedDayIndex(0);setView("detail");}} className="flex-1 text-left">
                          <h3 className="font-bold text-gray-800 text-lg">{trip.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">📅 {formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-bold">📆 {trip.days.length}{t("days")}</span>
                            <span className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg font-bold">📍 {totalPlaces}{t("places")}</span>
                          </div>
                        </button>
                        <button onClick={()=>deleteTrip(trip.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 text-lg">🗑️</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== 여행 생성 ===== */}
      {view === "create" && (
        <div className="px-4 -mt-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl">✈️</span>
              </div>
              <h2 className="font-bold text-gray-800 text-lg">{t("newTrip")}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-600 mb-1.5 block">{t("tripName")}</label>
                <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder={t("tripNamePlaceholder")}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-base focus:outline-none focus:border-indigo-400 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-1.5 block">{t("startDate")}</label>
                  <input type="date" value={newStart} onChange={e=>setNewStart(e.target.value)}
                    className="w-full px-3 py-3.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-1.5 block">{t("endDate")}</label>
                  <input type="date" value={newEnd} onChange={e=>setNewEnd(e.target.value)} min={newStart}
                    className="w-full px-3 py-3.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-indigo-400" />
                </div>
              </div>
              {newStart && newEnd && new Date(newEnd)>=new Date(newStart) && (
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <span className="text-sm font-bold text-indigo-600">📆 {getDaysBetween(newStart,newEnd).length}일 여행</span>
                </div>
              )}
              {(!newTitle || !newStart || !newEnd) && (
                <div style={{background:"#fef3c7",borderRadius:"10px",padding:"8px 12px",textAlign:"center"}}>
                  <span style={{fontSize:"12px",color:"#d97706",fontWeight:"bold"}}>
                    ⚠️ {!newTitle ? "여행 이름을 입력하세요" : !newStart ? "시작일을 선택하세요" : "종료일을 선택하세요"}
                  </span>
                </div>
              )}
              <button onClick={createTrip} disabled={!newTitle||!newStart||!newEnd||new Date(newEnd)<new Date(newStart)}
                style={{
                  width:"100%", padding:"16px", borderRadius:"14px", fontSize:"16px", fontWeight:"bold",
                  border:"none", cursor: (!newTitle||!newStart||!newEnd) ? "not-allowed" : "pointer",
                  background: (!newTitle||!newStart||!newEnd) ? "#d1d5db" : "linear-gradient(135deg,#6366f1,#a855f7)",
                  color: (!newTitle||!newStart||!newEnd) ? "#9ca3af" : "white",
                  boxShadow: (!newTitle||!newStart||!newEnd) ? "none" : "0 4px 12px rgba(99,102,241,0.3)",
                }}>
                ✈️ {t("create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 여행 상세 ===== */}
      {view === "detail" && currentTrip && (
        <div style={{marginTop:"-16px"}}>
          <div className="px-4">
            {/* 뒤로가기 + 제목 */}
            <div style={{background:"white",borderRadius:"16px",padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:"1px solid #f0f0f0",marginBottom:"12px"}}>
              <button onClick={()=>{setView("list");setCurrentTrip(null);}}
                style={{background:"#f3f4f6",color:"#4f46e5",padding:"6px 14px",borderRadius:"10px",fontSize:"13px",fontWeight:"bold",marginBottom:"10px",cursor:"pointer",border:"none"}}>
                ← 목록으로
              </button>
              <h2 style={{fontWeight:"bold",color:"#1f2937",fontSize:"18px"}}>{currentTrip.title}</h2>
              <p style={{fontSize:"12px",color:"#9ca3af",marginTop:"4px"}}>📅 {formatDate(currentTrip.startDate)} ~ {formatDate(currentTrip.endDate)} · {currentTrip.days.length}{t("days")}</p>
            </div>
          </div>

          {/* 날짜 탭 - 좌우 화살표 포함 */}
          <div className="px-4" style={{marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <button onClick={()=>setSelectedDayIndex(Math.max(0,selectedDayIndex-1))} disabled={selectedDayIndex===0}
                style={{background:selectedDayIndex===0?"#e5e7eb":"#4f46e5",color:selectedDayIndex===0?"#9ca3af":"white",width:"32px",height:"32px",borderRadius:"50%",border:"none",fontSize:"16px",fontWeight:"bold",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ‹
              </button>
              <div style={{flex:1,display:"flex",gap:"6px",overflow:"hidden"}}>
                {currentTrip.days.map((day,idx)=>{
                  const isVisible = Math.abs(idx - selectedDayIndex) <= 1;
                  if (!isVisible && currentTrip.days.length > 3) return null;
                  return (
                    <button key={day.date} onClick={()=>setSelectedDayIndex(idx)}
                      style={{
                        background: selectedDayIndex===idx ? "#4f46e5" : "white",
                        color: selectedDayIndex===idx ? "white" : "#4b5563",
                        border: selectedDayIndex===idx ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                        flex: 1,
                        padding: "8px 4px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textAlign: "center" as const,
                        cursor: "pointer",
                        minWidth: 0,
                      }}>
                      <div style={{fontSize:"11px",opacity:0.8}}>Day {idx+1}</div>
                      <div style={{fontSize:"12px"}}>{formatDate(day.date)}</div>
                      {day.places.length>0 && <div style={{
                        background: selectedDayIndex===idx ? "rgba(255,255,255,0.3)" : "#eef2ff",
                        color: selectedDayIndex===idx ? "white" : "#4f46e5",
                        padding:"1px 6px",borderRadius:"8px",fontSize:"10px",marginTop:"2px",display:"inline-block"
                      }}>{day.places.length}곳</div>}
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>setSelectedDayIndex(Math.min(currentTrip.days.length-1,selectedDayIndex+1))} disabled={selectedDayIndex===currentTrip.days.length-1}
                style={{background:selectedDayIndex===currentTrip.days.length-1?"#e5e7eb":"#4f46e5",color:selectedDayIndex===currentTrip.days.length-1?"#9ca3af":"white",width:"32px",height:"32px",borderRadius:"50%",border:"none",fontSize:"16px",fontWeight:"bold",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ›
              </button>
            </div>
            {/* 전체 날짜 인디케이터 */}
            <div style={{display:"flex",justifyContent:"center",gap:"4px",marginTop:"8px"}}>
              {currentTrip.days.map((_,idx)=>(
                <button key={idx} onClick={()=>setSelectedDayIndex(idx)}
                  style={{width:selectedDayIndex===idx?"20px":"8px",height:"8px",borderRadius:"4px",border:"none",
                    background:selectedDayIndex===idx?"#4f46e5":"#d1d5db",transition:"all 0.2s",cursor:"pointer"}} />
              ))}
            </div>
          </div>

          <div className="px-4">
          <div className="mt-3">
            <button onClick={()=>setView("search")} className="w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-sm">🔍 {t("addPlace")}</button>
          </div>
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
            {editingDayMemo ? (
              <div>
                <textarea value={tempMemo} onChange={e=>setTempMemo(e.target.value)} className="w-full p-3 rounded-lg border-2 border-amber-300 text-sm focus:outline-none resize-none bg-white" rows={2} placeholder={t("dayMemoPlaceholder")} autoFocus />
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>saveDayMemo(selectedDayIndex,tempMemo)} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm">{t("save")}</button>
                  <button onClick={()=>setEditingDayMemo(false)} className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold">{t("cancel")}</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>{setTempMemo(currentTrip.days[selectedDayIndex].dayMemo);setEditingDayMemo(true);}} className="w-full text-left">
                <span className="text-xs font-bold text-amber-700">📝 Day {selectedDayIndex+1} {t("memo")}</span>
                <p className="text-xs text-amber-600 mt-0.5">{currentTrip.days[selectedDayIndex].dayMemo || t("tapToAddMemo")}</p>
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {currentTrip.days[selectedDayIndex].places.length===0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto"><span className="text-3xl">📍</span></div>
                <p className="text-gray-400 mt-3 text-sm font-medium">{t("noPlaces")}</p>
                <button onClick={()=>setView("search")} className="mt-3 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-sm">🔍 {t("searchAndAdd")}</button>
              </div>
            ) : (
              currentTrip.days[selectedDayIndex].places.map((place,idx)=>(
                <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center p-3 gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">{idx+1}</div>
                    {/* 장소 클릭 → 바로 카카오맵 열기 */}
                    <div onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}
                      className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-colors relative">
                      {place.image ? <img src={place.image} alt={place.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{getCatIcon(place.contentTypeId)}</span>}
                      <div style={{position:"absolute",bottom:"0",right:"0",background:"#3b82f6",borderRadius:"6px 0 0 0",padding:"1px 4px"}}><span style={{fontSize:"10px"}}>🗺️</span></div>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}>
                      <h4 className="font-bold text-blue-700 text-sm truncate hover:underline">{place.name}</h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">📍 {place.address}</p>
                      <div className="flex items-center gap-1 mt-1" onClick={e=>e.stopPropagation()}>
                        <span className="text-xs text-gray-400">⏰</span>
                        <input type="time" value={place.time} onChange={e=>savePlaceTime(selectedDayIndex,place.id,e.target.value)} className="text-xs text-indigo-600 font-bold border-none bg-transparent focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={()=>movePlaceInDay(selectedDayIndex,idx,"up")} disabled={idx===0} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 text-xs">▲</button>
                      <button onClick={()=>removePlaceFromDay(selectedDayIndex,place.id)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-100 text-xs">✕</button>
                      <button onClick={()=>movePlaceInDay(selectedDayIndex,idx,"down")} disabled={idx===currentTrip.days[selectedDayIndex].places.length-1} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 text-xs">▼</button>
                    </div>
                  </div>
                  <div className="px-3 pb-3 ml-12">
                    {editingMemo===place.id ? (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <textarea value={tempMemo} onChange={e=>setTempMemo(e.target.value)} className="w-full p-2 rounded-lg border-2 border-indigo-200 text-xs focus:outline-none resize-none" rows={2} placeholder={t("placeMemoPlaceholder")} autoFocus />
                        <div className="flex gap-2 mt-1">
                          <button onClick={()=>savePlaceMemo(selectedDayIndex,place.id,tempMemo)} className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold">{t("save")}</button>
                          <button onClick={()=>setEditingMemo(null)} className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs">{t("cancel")}</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={()=>{setTempMemo(place.memo);setEditingMemo(place.id);}} className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">💬 {place.memo||t("addMemo")}</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>{/* close px-4 */}
        </div>
      )}
      {view === "search" && currentTrip && (
        <div style={{marginTop:"-16px"}} className="px-4">
          {/* 상단 돌아가기 */}
          <div style={{background:"white",borderRadius:"16px",padding:"12px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",border:"1px solid #f0f0f0",marginBottom:"10px"}}>
            <button onClick={()=>{setView("detail");setAddedPlaceIds(new Set());setSearchResults([]);setSearchQuery("");}}
              style={{background:"#4f46e5",color:"white",padding:"8px 16px",borderRadius:"10px",fontSize:"13px",fontWeight:"bold",cursor:"pointer",border:"none"}}>
              ← 일정으로 돌아가기 {addedPlaceIds.size>0&&`(${addedPlaceIds.size}개 추가됨)`}
            </button>
          </div>

          {/* 날짜 선택 - 화살표 방식 */}
          <div style={{marginBottom:"10px"}}>
            <p style={{fontSize:"12px",fontWeight:700,color:"#6b7280",marginBottom:"6px"}}>📅 추가할 날짜 선택</p>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <button onClick={()=>{setSelectedDayIndex(Math.max(0,selectedDayIndex-1));setAddedPlaceIds(new Set());}} disabled={selectedDayIndex===0}
                style={{background:selectedDayIndex===0?"#e5e7eb":"#4f46e5",color:selectedDayIndex===0?"#9ca3af":"white",width:"32px",height:"32px",borderRadius:"50%",border:"none",fontSize:"16px",fontWeight:"bold",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ‹
              </button>
              <div style={{flex:1,display:"flex",gap:"6px",overflow:"hidden"}}>
                {currentTrip.days.map((day,idx)=>{
                  const isVisible = Math.abs(idx - selectedDayIndex) <= 1;
                  if (!isVisible && currentTrip.days.length > 3) return null;
                  return (
                    <button key={day.date} onClick={()=>{setSelectedDayIndex(idx);setAddedPlaceIds(new Set());}}
                      style={{
                        background: selectedDayIndex===idx ? "#4f46e5" : "white",
                        color: selectedDayIndex===idx ? "white" : "#4b5563",
                        border: selectedDayIndex===idx ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                        flex: 1, padding: "6px 4px", borderRadius: "10px", fontSize: "11px", fontWeight: 700,
                        textAlign: "center" as const, cursor: "pointer", minWidth: 0,
                      }}>
                      <div>Day {idx+1}</div>
                      <div>{formatDate(day.date)}</div>
                      {day.places.length>0 && <div style={{fontSize:"10px",opacity:0.7}}>{day.places.length}곳</div>}
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>{setSelectedDayIndex(Math.min(currentTrip.days.length-1,selectedDayIndex+1));setAddedPlaceIds(new Set());}} disabled={selectedDayIndex===currentTrip.days.length-1}
                style={{background:selectedDayIndex===currentTrip.days.length-1?"#e5e7eb":"#4f46e5",color:selectedDayIndex===currentTrip.days.length-1?"#9ca3af":"white",width:"32px",height:"32px",borderRadius:"50%",border:"none",fontSize:"16px",fontWeight:"bold",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ›
              </button>
            </div>
            {/* 점 인디케이터 */}
            <div style={{display:"flex",justifyContent:"center",gap:"4px",marginTop:"6px"}}>
              {currentTrip.days.map((_,idx)=>(
                <button key={idx} onClick={()=>{setSelectedDayIndex(idx);setAddedPlaceIds(new Set());}}
                  style={{width:selectedDayIndex===idx?"16px":"6px",height:"6px",borderRadius:"3px",border:"none",
                    background:selectedDayIndex===idx?"#4f46e5":"#d1d5db",transition:"all 0.2s",cursor:"pointer"}} />
              ))}
            </div>
          </div>

          {/* 현재 추가 대상 상태바 */}
          <div style={{background:"#4f46e5",color:"white",borderRadius:"14px",padding:"12px 16px",marginBottom:"10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <p style={{fontSize:"11px",opacity:0.7}}>현재 추가 대상</p>
              <p style={{fontWeight:"bold",fontSize:"14px"}}>📍 Day {selectedDayIndex+1} · {formatDate(currentTrip.days[selectedDayIndex].date)}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:"24px",fontWeight:"bold"}}>{currentTrip.days[selectedDayIndex].places.length}</p>
              <p style={{fontSize:"11px",opacity:0.7}}>장소</p>
            </div>
          </div>

          {/* 이미 추가된 장소 목록 */}
          {currentTrip.days[selectedDayIndex].places.length > 0 && (
            <div style={{background:"white",borderRadius:"14px",padding:"12px",border:"1px solid #e5e7eb",marginBottom:"10px"}}>
              <p style={{fontSize:"12px",fontWeight:"bold",color:"#4f46e5",marginBottom:"8px"}}>
                📋 Day {selectedDayIndex+1} 추가된 장소 ({currentTrip.days[selectedDayIndex].places.length})
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {currentTrip.days[selectedDayIndex].places.map((place,idx) => (
                  <div key={place.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 8px",background:"#f8fafc",borderRadius:"10px",border:"1px solid #f0f0f0"}}>
                    <div style={{width:"24px",height:"24px",borderRadius:"50%",background:"#4f46e5",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"bold",flexShrink:0}}>
                      {idx+1}
                    </div>
                    <div onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}
                      style={{width:"36px",height:"36px",borderRadius:"8px",overflow:"hidden",flexShrink:0,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid #bfdbfe"}}>
                      {place.image ? <img src={place.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <span style={{fontSize:"16px"}}>{getCatIcon(place.contentTypeId)}</span>}
                    </div>
                    <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}>
                      <p style={{fontSize:"12px",fontWeight:"bold",color:"#2563eb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{place.name}</p>
                      {place.time && <p style={{fontSize:"10px",color:"#6366f1"}}>⏰ {place.time}</p>}
                    </div>
                    <button onClick={()=>removePlaceFromDay(selectedDayIndex,place.id)}
                      style={{width:"24px",height:"24px",borderRadius:"6px",background:"#fef2f2",color:"#ef4444",border:"none",fontSize:"12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 검색 입력 */}
          <div style={{background:"white",borderRadius:"16px",padding:"12px",boxShadow:"0 2px 6px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",marginBottom:"10px"}}>
            <div style={{display:"flex",gap:"8px"}}>
              <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchPlaces()} placeholder={t("searchPlaceholder")}
                style={{flex:1,padding:"12px 16px",borderRadius:"12px",border:"2px solid #e5e7eb",fontSize:"14px",outline:"none"}} autoFocus />
              <button onClick={searchPlaces} disabled={isSearching}
                style={{padding:"12px 20px",background:"#4f46e5",color:"white",borderRadius:"12px",fontSize:"14px",fontWeight:"bold",border:"none",cursor:"pointer"}}>
                {isSearching?"⏳":"🔍"}
              </button>
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"8px",flexWrap:"wrap"}}>
              {[{label:"🏛️ "+t("qAttraction"),query:"관광지"},{label:"🍽️ "+t("qRestaurant"),query:"맛집"},{label:"☕ "+t("qCafe"),query:"카페"},{label:"🛍️ "+t("qShopping"),query:"쇼핑"}].map(q=>(
                <button key={q.query} onClick={()=>setSearchQuery(q.query)}
                  style={{padding:"6px 12px",background:"#f3f4f6",color:"#4b5563",borderRadius:"8px",fontSize:"12px",fontWeight:"bold",border:"none",cursor:"pointer"}}>{q.label}</button>
              ))}
            </div>
          </div>

          {/* 검색 결과 */}
          <div style={{display:"flex",flexDirection:"column",gap:"8px",paddingBottom:"80px"}}>
            {searchResults.map(place=>(
              <div key={place.id} style={{background:addedPlaceIds.has(place.id)?"#f0fdf4":"white",borderRadius:"16px",padding:"12px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:addedPlaceIds.has(place.id)?"2px solid #86efac":"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:"12px"}}>
                {/* 사진 클릭 → 지도 */}
                <div onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}
                  style={{width:"60px",height:"60px",borderRadius:"12px",overflow:"hidden",flexShrink:0,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #bfdbfe",cursor:"pointer",position:"relative"}}>
                  {place.image ? <img src={place.image} alt={place.name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <span style={{fontSize:"24px"}}>{getCatIcon(place.contentTypeId)}</span>}
                  <div style={{position:"absolute",bottom:"0",right:"0",background:"#3b82f6",borderRadius:"6px 0 0 0",padding:"1px 3px"}}><span style={{fontSize:"9px"}}>🗺️</span></div>
                </div>
                {/* 이름 클릭 → 지도 */}
                <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}}>
                  <h4 style={{fontWeight:"bold",color:"#2563eb",fontSize:"14px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{place.name}</h4>
                  <p style={{fontSize:"12px",color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:"2px"}}>📍 {place.address}</p>
                  {addedPlaceIds.has(place.id) && <p style={{fontSize:"12px",color:"#16a34a",fontWeight:"bold",marginTop:"2px"}}>✓ Day {selectedDayIndex+1}에 추가됨</p>}
                </div>
                <button onClick={(e)=>{e.stopPropagation();addPlaceToDay(place);}} disabled={addedPlaceIds.has(place.id)}
                  style={{padding:"10px 16px",borderRadius:"12px",fontSize:"12px",fontWeight:"bold",border:"none",cursor:"pointer",flexShrink:0,minWidth:"60px",textAlign:"center",
                    background:addedPlaceIds.has(place.id)?"#22c55e":"#3b82f6",color:"white"}}>
                  {addedPlaceIds.has(place.id) ? "✓" : `+ ${t("add")}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 지도 뷰 ===== */}
      {view === "map" && currentTrip && (
        <div className="px-4 -mt-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-700">🗺️ Day {selectedDayIndex+1} · {currentTrip.days[selectedDayIndex].places.length}{t("places")}</span>
              <div className="flex gap-1">
                <button onClick={()=>setSelectedDayIndex(Math.max(0,selectedDayIndex-1))} disabled={selectedDayIndex===0} className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold disabled:opacity-30 shadow-sm">◀</button>
                <button onClick={()=>setSelectedDayIndex(Math.min(currentTrip.days.length-1,selectedDayIndex+1))} disabled={selectedDayIndex===currentTrip.days.length-1} className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold disabled:opacity-30 shadow-sm">▶</button>
              </div>
            </div>
            <div ref={mapRef} className="w-full h-[400px]" />
          </div>
          <div className="mt-3 space-y-1.5">
            {currentTrip.days[selectedDayIndex].places.map((place,idx)=>(
              <div key={place.id} onClick={()=>{if(place.lat&&place.lng){window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`,"_blank");}}} className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-gray-100 shadow-sm cursor-pointer hover:bg-blue-50 transition-colors active:scale-[0.98]">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">{idx+1}</div>
                <span className="text-sm text-gray-700 truncate flex-1 font-medium">{place.name}</span>
                {place.time && <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">{place.time}</span>}
                <span className="text-xs text-blue-400">🗺️</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gray-800 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-bold">
            {toast}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
