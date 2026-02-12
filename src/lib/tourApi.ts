export const CONTENT_TYPES = {
  attractions: 12,
  culture: 14,
  festivals: 15,
  travel: 25,
  leisure: 28,
  accommodation: 32,
  shopping: 38,
  restaurants: 39,
} as const;

export const AREA_CODES = {
  서울: 1, 인천: 2, 대전: 3, 대구: 4, 광주: 5, 부산: 6, 울산: 7,
  세종: 8, 경기: 31, 강원: 32, 충북: 33, 충남: 34,
  경북: 35, 경남: 36, 전북: 37, 전남: 38, 제주: 39,
} as const;

export const AREA_NAMES: Record<number, Record<string, string>> = {
  1: { ko: "서울", en: "Seoul", ja: "ソウル", zh: "首尔" },
  2: { ko: "인천", en: "Incheon", ja: "仁川", zh: "仁川" },
  3: { ko: "대전", en: "Daejeon", ja: "大田", zh: "大田" },
  4: { ko: "대구", en: "Daegu", ja: "大邱", zh: "大邱" },
  5: { ko: "광주", en: "Gwangju", ja: "光州", zh: "光州" },
  6: { ko: "부산", en: "Busan", ja: "釜山", zh: "釜山" },
  7: { ko: "울산", en: "Ulsan", ja: "蔚山", zh: "蔚山" },
  8: { ko: "세종", en: "Sejong", ja: "世宗", zh: "世宗" },
  31: { ko: "경기", en: "Gyeonggi", ja: "京畿", zh: "京畿" },
  32: { ko: "강원", en: "Gangwon", ja: "江原", zh: "江原" },
  33: { ko: "충북", en: "Chungbuk", ja: "忠北", zh: "忠北" },
  34: { ko: "충남", en: "Chungnam", ja: "忠南", zh: "忠南" },
  35: { ko: "경북", en: "Gyeongbuk", ja: "慶北", zh: "庆北" },
  36: { ko: "경남", en: "Gyeongnam", ja: "慶南", zh: "庆南" },
  37: { ko: "전북", en: "Jeonbuk", ja: "全北", zh: "全北" },
  38: { ko: "전남", en: "Jeonnam", ja: "全南", zh: "全南" },
  39: { ko: "제주", en: "Jeju", ja: "済州", zh: "济州" },
};

export interface TourItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2: string;
  areacode: string;
  sigungucode: string;
  firstimage: string;
  firstimage2: string;
  mapx: string;
  mapy: string;
  tel: string;
  zipcode: string;
  dist?: string;
}

export interface TourDetailItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  overview: string;
  addr1: string;
  addr2: string;
  homepage: string;
  tel: string;
  mapx: string;
  mapy: string;
  firstimage: string;
  firstimage2: string;
}

export interface TourDetailIntro {
  contentid: string;
  contenttypeid: string;
  infocenter?: string;
  usetime?: string;
  restdate?: string;
  parking?: string;
  opentimefood?: string;
  firstmenu?: string;
  treatmenu?: string;
  packing?: string;
  usefee?: string;
  usetimeculture?: string;
  restdateculture?: string;
  infocenterculture?: string;
  opentime?: string;
  restdateshopping?: string;
  infocentershopping?: string;
}

// ★ 핵심: /api/tour 프록시를 통해 호출 (CORS 우회)
async function fetchApi<T>(endpoint: string, params: Record<string, string | number>): Promise<T[]> {
  const searchParams = new URLSearchParams({
    endpoint,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const url = `/api/tour?${searchParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("API proxy error:", response.status);
      return [];
    }

    const data = await response.json();

    // v2 API error format (no response wrapper)
    if (data.resultCode && data.resultCode !== "0000") {
      console.error("Tour API Error:", data.resultMsg);
      return [];
    }

    // v2 API success format
    if (data.response?.header?.resultCode !== "0000") {
      console.error("Tour API Error:", data.response?.header?.resultMsg);
      return [];
    }

    const items = data.response?.body?.items?.item;
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error("Tour API fetch error:", error);
    return [];
  }
}

export async function getAreaBasedList(params: {
  contentTypeId?: number;
  areaCode?: number;
  sigunguCode?: number;
  numOfRows?: number;
  pageNo?: number;
  arrange?: string;
}): Promise<TourItem[]> {
  return fetchApi<TourItem>("areaBasedList2", {
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
    arrange: params.arrange || "Q",
    ...(params.contentTypeId && { contentTypeId: params.contentTypeId }),
    ...(params.areaCode && { areaCode: params.areaCode }),
    ...(params.sigunguCode && { sigunguCode: params.sigunguCode }),
  });
}

export async function getLocationBasedList(params: {
  mapX: number;
  mapY: number;
  radius: number;
  contentTypeId?: number;
  numOfRows?: number;
  pageNo?: number;
  arrange?: string;
}): Promise<TourItem[]> {
  return fetchApi<TourItem>("locationBasedList2", {
    mapX: params.mapX,
    mapY: params.mapY,
    radius: params.radius,
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
    arrange: params.arrange || "E",
    ...(params.contentTypeId && { contentTypeId: params.contentTypeId }),
  });
}

export async function searchKeyword(params: {
  keyword: string;
  contentTypeId?: number;
  areaCode?: number;
  numOfRows?: number;
  pageNo?: number;
  arrange?: string;
}): Promise<TourItem[]> {
  return fetchApi<TourItem>("searchKeyword2", {
    keyword: params.keyword,
    numOfRows: params.numOfRows || 20,
    pageNo: params.pageNo || 1,
    arrange: params.arrange || "A",
    ...(params.contentTypeId && { contentTypeId: params.contentTypeId }),
    ...(params.areaCode && { areaCode: params.areaCode }),
  });
}

export async function getDetailCommon(contentId: string): Promise<TourDetailItem | null> {
  const items = await fetchApi<TourDetailItem>("detailCommon2", {
    contentId,
  });
  return items[0] || null;
}

export async function getDetailIntro(contentId: string, contentTypeId: number): Promise<TourDetailIntro | null> {
  const items = await fetchApi<TourDetailIntro>("detailIntro2", {
    contentId,
    contentTypeId,
  });
  return items[0] || null;
}

export async function getDetailInfo(contentId: string, contentTypeId: number): Promise<any[]> {
  return fetchApi<any>("detailInfo2", {
    contentId,
    contentTypeId,
  });
}

export function getCategoryIcon(contentTypeId: string | number): string {
  const id = Number(contentTypeId);
  switch (id) {
    case 12: return "🏛️";
    case 14: return "🎭";
    case 15: return "🎉";
    case 25: return "🗺️";
    case 28: return "⛷️";
    case 32: return "🏨";
    case 38: return "🛍️";
    case 39: return "🍽️";
    default: return "📍";
  }
}

export function getCategoryName(contentTypeId: string | number, locale: string): string {
  const id = Number(contentTypeId);
  const names: Record<number, Record<string, string>> = {
    12: { ko: "관광지", en: "Attraction", ja: "観光地", zh: "景点" },
    14: { ko: "문화시설", en: "Culture", ja: "文化施設", zh: "文化设施" },
    15: { ko: "축제/행사", en: "Festival", ja: "祭り", zh: "节庆" },
    25: { ko: "여행코스", en: "Course", ja: "コース", zh: "路线" },
    28: { ko: "레포츠", en: "Leisure", ja: "レジャー", zh: "休闲" },
    32: { ko: "숙박", en: "Stay", ja: "宿泊", zh: "住宿" },
    38: { ko: "쇼핑", en: "Shopping", ja: "ショッピング", zh: "购物" },
    39: { ko: "음식점", en: "Restaurant", ja: "レストラン", zh: "餐厅" },
  };
  return names[id]?.[locale] || names[id]?.en || "Place";
}
