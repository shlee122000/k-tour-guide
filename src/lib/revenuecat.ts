import { Purchases } from "@revenuecat/purchases-capacitor";

const TRIAL_DAYS = 2;

export async function purchaseLifetime() {
  const offerings = await Purchases.getOfferings();
  const pkg = offerings.current?.lifetime;
  if (!pkg) throw new Error("Lifetime package not found");
  await Purchases.purchasePackage({ aPackage: pkg });
}

async function hasProEntitlement(): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active["Pro"] !== undefined;
  } catch {
    return false;
  }
}

export function getTrialDaysLeft(): number {
  if (typeof window === "undefined") return TRIAL_DAYS;
  const installDate = localStorage.getItem("ktour_install_date");
  if (!installDate) {
    localStorage.setItem("ktour_install_date", Date.now().toString());
    return TRIAL_DAYS;
  }
  const daysPassed = (Date.now() - parseInt(installDate)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(TRIAL_DAYS - daysPassed));
}

export async function isPro(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (getTrialDaysLeft() > 0) return true;
  return await hasProEntitlement();
}

// 번역/TTS 일일 횟수 관리 (변경 없음)
export function getDailyCount(key: string): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toDateString();
  const stored = localStorage.getItem(`ktour_daily_${key}`);
  if (!stored) return 0;
  const { date, count } = JSON.parse(stored);
  if (date !== today) return 0;
  return count;
}

export function incrementDailyCount(key: string) {
  if (typeof window === "undefined") return;
  const today = new Date().toDateString();
  const count = getDailyCount(key);
  localStorage.setItem(`ktour_daily_${key}`, JSON.stringify({ date: today, count: count + 1 }));
  window.dispatchEvent(new Event("ktour-usage-updated"));
}

// 즐겨찾기 개수 조회 (KakaoMap.tsx의 "k-tour-favorites" 키 재사용)
export function getFavoritesCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem("k-tour-favorites");
    if (!saved) return 0;
    return JSON.parse(saved).length;
  } catch {
    return 0;
  }
}

export const FREE_TRANSLATE_LIMIT = 10;
export const FREE_TTS_LIMIT = 10;
export const FREE_FAVORITES_LIMIT = 5;
export const FREE_RADIUS_LIMIT = 5000;
