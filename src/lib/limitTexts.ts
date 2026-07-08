export const LIMIT_TEXTS: Record<
  string,
  {
    limitReached: string;
    usageLabel: string;
    translateWord: string;
    ttsWord: string;
    favoritesWord: string;
    upgrade: string;
    radiusLabel: string;
    radiusFree: string;
    radiusPro: string;
  }
> = {
  ko: { limitReached: "오늘 무료 사용 횟수를 모두 사용했어요. Pro로 업그레이드하면 무제한 이용 가능합니다.", usageLabel: "오늘 사용량", translateWord: "번역", ttsWord: "TTS", favoritesWord: "즐겨찾기", upgrade: "Pro", radiusLabel: "검색 반경", radiusFree: "무료 5km", radiusPro: "Pro 20km" },
  en: { limitReached: "You've used all your free uses for today. Upgrade to Pro for unlimited access.", usageLabel: "Today's usage", translateWord: "Translate", ttsWord: "TTS", favoritesWord: "Favorites", upgrade: "Pro", radiusLabel: "Search radius", radiusFree: "Free 5km", radiusPro: "Pro 20km" },
  ja: { limitReached: "本日の無料利用回数を使い切りました。Proにアップグレードすると無制限に利用できます。", usageLabel: "本日の利用状況", translateWord: "翻訳", ttsWord: "TTS", favoritesWord: "お気に入り", upgrade: "Pro", radiusLabel: "検索半径", radiusFree: "無料5km", radiusPro: "Pro 20km" },
  zh: { limitReached: "您今天的免费使用次数已用完。升级到Pro即可无限使用。", usageLabel: "今日使用量", translateWord: "翻译", ttsWord: "TTS", favoritesWord: "收藏", upgrade: "Pro", radiusLabel: "搜索半径", radiusFree: "免费5km", radiusPro: "Pro 20km" },
  es: { limitReached: "Has usado todos tus usos gratuitos de hoy. Actualiza a Pro para acceso ilimitado.", usageLabel: "Uso de hoy", translateWord: "Traducir", ttsWord: "TTS", favoritesWord: "Favoritos", upgrade: "Pro", radiusLabel: "Radio de búsqueda", radiusFree: "Gratis 5km", radiusPro: "Pro 20km" },
  fr: { limitReached: "Vous avez utilisé toutes vos utilisations gratuites d'aujourd'hui. Passez à Pro pour un accès illimité.", usageLabel: "Utilisation du jour", translateWord: "Traduction", ttsWord: "TTS", favoritesWord: "Favoris", upgrade: "Pro", radiusLabel: "Rayon de recherche", radiusFree: "Gratuit 5km", radiusPro: "Pro 20km" },
  de: { limitReached: "Sie haben Ihre kostenlosen Nutzungen für heute aufgebraucht. Upgraden Sie auf Pro für unbegrenzten Zugriff.", usageLabel: "Heutige Nutzung", translateWord: "Übersetzung", ttsWord: "TTS", favoritesWord: "Favoriten", upgrade: "Pro", radiusLabel: "Suchradius", radiusFree: "Kostenlos 5km", radiusPro: "Pro 20km" },
  th: { limitReached: "คุณใช้สิทธิ์ฟรีวันนี้หมดแล้ว อัปเกรดเป็น Pro เพื่อใช้งานได้ไม่จำกัด", usageLabel: "การใช้งานวันนี้", translateWord: "แปล", ttsWord: "TTS", favoritesWord: "รายการโปรด", upgrade: "Pro", radiusLabel: "รัศมีค้นหา", radiusFree: "ฟรี 5km", radiusPro: "Pro 20km" },
  vi: { limitReached: "Bạn đã dùng hết lượt miễn phí hôm nay. Nâng cấp lên Pro để dùng không giới hạn.", usageLabel: "Sử dụng hôm nay", translateWord: "Dịch", ttsWord: "TTS", favoritesWord: "Yêu thích", upgrade: "Pro", radiusLabel: "Bán kính tìm kiếm", radiusFree: "Miễn phí 5km", radiusPro: "Pro 20km" },
  id: { limitReached: "Anda telah menggunakan semua penggunaan gratis hari ini. Upgrade ke Pro untuk akses tanpa batas.", usageLabel: "Penggunaan hari ini", translateWord: "Terjemahan", ttsWord: "TTS", favoritesWord: "Favorit", upgrade: "Pro", radiusLabel: "Radius pencarian", radiusFree: "Gratis 5km", radiusPro: "Pro 20km" },
};
