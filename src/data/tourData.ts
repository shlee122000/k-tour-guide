// 서울/부산 관광투어 데이터

export interface TourSpot {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  image: string; // emoji or URL
  category: string;
  lat: number;
  lng: number;
  time?: string; // 추천 소요시간
  tip?: Record<string, string>;
}

export interface TourCourse {
  id: string;
  title: Record<string, string>;
  duration: string; // "1일", "2일", "3일"
  desc: Record<string, string>;
  spots: TourSpot[];
}

export interface Restaurant {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  image: string;
  category: string; // 한식, 해산물, 카페 등
  price: string; // $, $$, $$$
  lat: number;
  lng: number;
  mustTry: Record<string, string>;
}

export interface PhotoSpot {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  image: string;
  bestTime: Record<string, string>;
  lat: number;
  lng: number;
}

export interface TransportInfo {
  id: string;
  title: Record<string, string>;
  desc: Record<string, string>;
  icon: string;
  tips: Record<string, string[]>;
}

// ===== 서울 데이터 =====

export const seoulCourses: TourCourse[] = [
  {
    id: "seoul-1day-classic",
    title: { ko: "서울 클래식 1일 코스", en: "Seoul Classic 1-Day", ja: "ソウルクラシック1日コース", zh: "首尔经典一日游", es: "Seúl Clásico 1 Día", fr: "Séoul Classique 1 Jour", th: "โซลคลาสสิก 1 วัน", vi: "Seoul Cổ điển 1 Ngày", id: "Seoul Klasik 1 Hari", de: "Seoul Klassisch 1 Tag" },
    duration: "1",
    desc: { ko: "경복궁부터 명동까지, 서울의 핵심을 하루에!", en: "From Gyeongbokgung to Myeongdong in one day!", ja: "景福宮から明洞まで、ソウルの核心を一日で！", zh: "从景福宫到明洞，一天玩遍首尔精华！", es: "¡De Gyeongbokgung a Myeongdong en un día!", fr: "De Gyeongbokgung à Myeongdong en un jour!", th: "จากคยองบกกุงถึงเมียงดงใน 1 วัน!", vi: "Từ Gyeongbokgung đến Myeongdong trong 1 ngày!", id: "Dari Gyeongbokgung ke Myeongdong dalam 1 hari!", de: "Von Gyeongbokgung bis Myeongdong an einem Tag!" },
    spots: [
      { id: "s1", name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫" }, desc: { ko: "조선 왕조의 정궁, 한복 입고 무료 입장!", en: "Main royal palace, free entry in hanbok!", ja: "朝鮮王朝の正宮、韓服で無料入場！", zh: "朝鲜王朝正宫，穿韩服免费入场！" }, image: "🏯", category: "관광", lat: 37.5796, lng: 126.9770, time: "2h", tip: { ko: "한복 대여는 안국역 주변이 저렴", en: "Hanbok rental near Anguk station is cheaper", ja: "安国駅周辺の韓服レンタルが安い", zh: "安国站附近韩服租赁更便宜" } },
      { id: "s2", name: { ko: "북촌 한옥마을", en: "Bukchon Hanok Village", ja: "北村韓屋村", zh: "北村韩屋村" }, desc: { ko: "600년 역사의 전통 한옥 골목길", en: "600-year-old traditional hanok alleys", ja: "600年の歴史を持つ伝統韓屋の路地", zh: "600年历史的传统韩屋胡同" }, image: "🏘️", category: "관광", lat: 37.5826, lng: 126.9831, time: "1h" },
      { id: "s3", name: { ko: "인사동", en: "Insadong", ja: "仁寺洞", zh: "仁寺洞" }, desc: { ko: "전통 공예품과 갤러리, 쌈지길 골목 필수", en: "Traditional crafts & galleries, Ssamziegil is a must", ja: "伝統工芸品とギャラリー、サムジキルは必見", zh: "传统工艺品和画廊，三清洞必去" }, image: "🎨", category: "문화", lat: 37.5733, lng: 126.9854, time: "1.5h" },
      { id: "s4", name: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔" }, desc: { ko: "서울 전경을 한눈에! 케이블카 추천", en: "Panoramic city view! Cable car recommended", ja: "ソウルの全景を一望！ケーブルカーおすすめ", zh: "一览首尔全景！推荐乘坐缆车" }, image: "🗼", category: "관광", lat: 37.5512, lng: 126.9882, time: "1.5h" },
      { id: "s5", name: { ko: "명동", en: "Myeongdong", ja: "明洞", zh: "明洞" }, desc: { ko: "쇼핑과 길거리 음식의 천국", en: "Shopping & street food paradise", ja: "ショッピングとストリートフードの天国", zh: "购物和街头美食天堂" }, image: "🛍️", category: "쇼핑", lat: 37.5636, lng: 126.9869, time: "2h" },
    ],
  },
  {
    id: "seoul-2day-deep",
    title: { ko: "서울 딥 투어 2일 코스", en: "Seoul Deep Tour 2-Day", ja: "ソウルディープツアー2日", zh: "首尔深度2日游", es: "Seúl Profundo 2 Días", fr: "Séoul Profond 2 Jours", th: "โซลเชิงลึก 2 วัน", vi: "Seoul Sâu 2 Ngày", id: "Seoul Mendalam 2 Hari", de: "Seoul Intensiv 2 Tage" },
    duration: "2",
    desc: { ko: "전통과 현대를 모두 즐기는 2일 코스", en: "2 days of tradition and modernity", ja: "伝統と現代を楽しむ2日コース", zh: "传统与现代兼享的2日行程" },
    spots: [
      { id: "s6", name: { ko: "광장시장", en: "Gwangjang Market", ja: "広蔵市場", zh: "广藏市场" }, desc: { ko: "빈대떡, 마약김밥의 성지", en: "Home of bindaetteok & mayak gimbap", ja: "ピンデトックとマヤクキンパの聖地", zh: "绿豆煎饼和麻药紫菜饭的圣地" }, image: "🥘", category: "맛집", lat: 37.5700, lng: 127.0099, time: "1.5h" },
      { id: "s7", name: { ko: "창덕궁 후원", en: "Changdeokgung Secret Garden", ja: "昌徳宮後苑", zh: "昌德宫后苑" }, desc: { ko: "유네스코 세계유산, 사전 예약 필수", en: "UNESCO site, reservation required", ja: "ユネスコ世界遺産、事前予約必須", zh: "联合国教科文组织遗产，需提前预约" }, image: "🌳", category: "관광", lat: 37.5794, lng: 126.9910, time: "2h" },
      { id: "s8", name: { ko: "성수동 카페거리", en: "Seongsu-dong Cafe Street", ja: "聖水洞カフェ通り", zh: "圣水洞咖啡街" }, desc: { ko: "서울의 브루클린, 힙한 카페와 편집샵", en: "Seoul's Brooklyn - hip cafes & shops", ja: "ソウルのブルックリン、ヒップなカフェ", zh: "首尔的布鲁克林，时尚咖啡馆" }, image: "☕", category: "카페", lat: 37.5445, lng: 127.0559, time: "2h" },
      { id: "s9", name: { ko: "잠실 롯데월드타워", en: "Lotte World Tower", ja: "ロッテワールドタワー", zh: "乐天世界塔" }, desc: { ko: "123층 전망대 서울스카이", en: "123F Seoul Sky observatory", ja: "123階展望台ソウルスカイ", zh: "123层首尔天空展望台" }, image: "🏙️", category: "관광", lat: 37.5126, lng: 127.1026, time: "2h" },
      { id: "s10", name: { ko: "홍대 거리", en: "Hongdae Street", ja: "弘大通り", zh: "弘大街" }, desc: { ko: "젊음의 거리, 라이브 공연과 클럽", en: "Youth culture, live performances & clubs", ja: "若者の街、ライブとクラブ", zh: "年轻人的街道，现场表演和俱乐部" }, image: "🎵", category: "문화", lat: 37.5563, lng: 126.9236, time: "3h" },
      { id: "s11", name: { ko: "한강 치맥", en: "Chimaek at Han River", ja: "漢江でチメク", zh: "汉江炸鸡啤酒" }, desc: { ko: "한강공원에서 치킨+맥주, 서울 필수 체험", en: "Chicken & beer at Han River Park, a must!", ja: "漢江公園でチキン＋ビール、必須体験", zh: "汉江公园炸鸡啤酒，必体验" }, image: "🍗", category: "체험", lat: 37.5268, lng: 126.9340, time: "2h" },
    ],
  },
  {
    id: "seoul-3day-complete",
    title: { ko: "서울 완전정복 3일 코스", en: "Seoul Complete 3-Day", ja: "ソウル完全制覇3日", zh: "首尔完全征服3日游", es: "Seúl Completo 3 Días", fr: "Séoul Complet 3 Jours", th: "โซลครบ 3 วัน", vi: "Seoul Hoàn chỉnh 3 Ngày", id: "Seoul Lengkap 3 Hari", de: "Seoul Komplett 3 Tage" },
    duration: "3",
    desc: { ko: "서울의 모든 것을 3일에 담다", en: "Everything Seoul has to offer in 3 days", ja: "ソウルの全てを3日で", zh: "3天领略首尔的一切" },
    spots: [
      { id: "s1", name: { ko: "경복궁", en: "Gyeongbokgung Palace", ja: "景福宮", zh: "景福宫" }, desc: { ko: "조선 왕조의 정궁", en: "Main royal palace", ja: "朝鮮王朝の正宮", zh: "朝鲜王朝正宫" }, image: "🏯", category: "관광", lat: 37.5796, lng: 126.9770, time: "2h" },
      { id: "s2", name: { ko: "북촌 한옥마을", en: "Bukchon Hanok Village", ja: "北村韓屋村", zh: "北村韩屋村" }, desc: { ko: "전통 한옥 골목길", en: "Traditional hanok alleys", ja: "伝統韓屋の路地", zh: "传统韩屋胡同" }, image: "🏘️", category: "관광", lat: 37.5826, lng: 126.9831, time: "1h" },
      { id: "s12", name: { ko: "DDP 동대문디자인플라자", en: "DDP Dongdaemun", ja: "DDP東大門", zh: "DDP东大门" }, desc: { ko: "자하 하디드 설계, 야간 LED 장미 필수", en: "Designed by Zaha Hadid, LED roses at night", ja: "ザハ・ハディド設計、夜のLEDバラ", zh: "扎哈·哈迪德设计，夜间LED玫瑰" }, image: "🌹", category: "문화", lat: 37.5673, lng: 127.0095, time: "1.5h" },
      { id: "s13", name: { ko: "이태원/경리단길", en: "Itaewon/Gyeongridan-gil", ja: "梨泰院/経理団路", zh: "梨泰院/经理团路" }, desc: { ko: "글로벌 맛집과 이국적 분위기", en: "Global restaurants & exotic vibes", ja: "グローバルグルメとエキゾチックな雰囲気", zh: "全球美食和异国情调" }, image: "🌍", category: "맛집", lat: 37.5340, lng: 126.9948, time: "2h" },
      { id: "s14", name: { ko: "여의도 한강공원", en: "Yeouido Han River Park", ja: "汝矣島漢江公園", zh: "汝矣岛汉江公园" }, desc: { ko: "자전거 대여, 치맥, 봄 벚꽃 명소", en: "Bike rental, chimaek, cherry blossoms in spring", ja: "自転車レンタル、チメク、春の桜", zh: "租自行车、炸鸡啤酒、春天赏樱" }, image: "🌸", category: "자연", lat: 37.5284, lng: 126.9326, time: "2h" },
      { id: "s15", name: { ko: "코엑스 별마당 도서관", en: "COEX Starfield Library", ja: "COEXピョルマダン図書館", zh: "COEX星空图书馆" }, desc: { ko: "인스타 핫플, 대형 서가의 감동", en: "Instagram hotspot, impressive bookshelves", ja: "インスタ映え、大型書架の感動", zh: "网红打卡地，巨型书架" }, image: "📚", category: "문화", lat: 37.5116, lng: 127.0592, time: "1h" },
      { id: "s10", name: { ko: "홍대 거리", en: "Hongdae Street", ja: "弘大通り", zh: "弘大街" }, desc: { ko: "젊음의 거리, 야간 문화", en: "Youth culture & nightlife", ja: "若者の街、ナイトカルチャー", zh: "年轻人的街道，夜生活" }, image: "🎵", category: "문화", lat: 37.5563, lng: 126.9236, time: "3h" },
    ],
  },
];

export const busanCourses: TourCourse[] = [
  {
    id: "busan-1day",
    title: { ko: "부산 핵심 1일 코스", en: "Busan Essential 1-Day", ja: "釜山エッセンシャル1日", zh: "釜山精华一日游", es: "Busan Esencial 1 Día", fr: "Busan Essentiel 1 Jour", th: "ปูซานสำคัญ 1 วัน", vi: "Busan Tinh hoa 1 Ngày", id: "Busan Esensial 1 Hari", de: "Busan Essentiell 1 Tag" },
    duration: "1",
    desc: { ko: "해운대부터 감천문화마을까지!", en: "From Haeundae to Gamcheon Culture Village!", ja: "海雲台から甘川文化村まで！", zh: "从海云台到甘川文化村！" },
    spots: [
      { id: "b1", name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场" }, desc: { ko: "부산의 상징, 사계절 아름다운 해변", en: "Busan's symbol, beautiful beach year-round", ja: "釜山のシンボル、四季美しいビーチ", zh: "釜山的象征，四季美丽的海滩" }, image: "🏖️", category: "자연", lat: 35.1588, lng: 129.1604, time: "1.5h" },
      { id: "b2", name: { ko: "해동용궁사", en: "Haedong Yonggungsa Temple", ja: "海東龍宮寺", zh: "海东龙宫寺" }, desc: { ko: "바다 위의 절, 일출 명소", en: "Temple on the sea, sunrise spot", ja: "海の上の寺、日の出の名所", zh: "海上寺庙，日出名所" }, image: "🛕", category: "관광", lat: 35.1884, lng: 129.2233, time: "1h" },
      { id: "b3", name: { ko: "감천문화마을", en: "Gamcheon Culture Village", ja: "甘川文化村", zh: "甘川文化村" }, desc: { ko: "한국의 산토리니, 알록달록 벽화마을", en: "Korea's Santorini, colorful murals", ja: "韓国のサントリーニ、カラフルな壁画村", zh: "韩国的圣托里尼，五彩壁画村" }, image: "🎨", category: "문화", lat: 35.0975, lng: 129.0104, time: "2h" },
      { id: "b4", name: { ko: "자갈치시장", en: "Jagalchi Fish Market", ja: "チャガルチ市場", zh: "札嘎其市场" }, desc: { ko: "한국 최대 수산시장, 회 맛집", en: "Korea's biggest fish market, fresh sashimi", ja: "韓国最大の水産市場、刺身の名店", zh: "韩国最大水产市场，新鲜刺身" }, image: "🐟", category: "맛집", lat: 35.0966, lng: 129.0307, time: "1.5h" },
    ],
  },
  {
    id: "busan-2day",
    title: { ko: "부산 완전정복 2일 코스", en: "Busan Complete 2-Day", ja: "釜山完全制覇2日", zh: "釜山完全征服2日游", es: "Busan Completo 2 Días", fr: "Busan Complet 2 Jours", th: "ปูซานครบ 2 วัน", vi: "Busan Hoàn chỉnh 2 Ngày", id: "Busan Lengkap 2 Hari", de: "Busan Komplett 2 Tage" },
    duration: "2",
    desc: { ko: "바다, 문화, 맛집을 모두 즐기는 2일", en: "Sea, culture & food in 2 days", ja: "海、文化、グルメを全て楽しむ2日", zh: "海洋、文化、美食尽享2日" },
    spots: [
      { id: "b1", name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场" }, desc: { ko: "부산의 상징", en: "Busan's symbol", ja: "釜山のシンボル", zh: "釜山的象征" }, image: "🏖️", category: "자연", lat: 35.1588, lng: 129.1604, time: "1.5h" },
      { id: "b5", name: { ko: "광안리 해수욕장", en: "Gwangalli Beach", ja: "広安里ビーチ", zh: "广安里海水浴场" }, desc: { ko: "광안대교 야경이 아름다운 해변", en: "Beautiful night view of Gwangan Bridge", ja: "広安大橋の夜景が美しいビーチ", zh: "广安大桥夜景美丽的海滩" }, image: "🌉", category: "자연", lat: 35.1532, lng: 129.1189, time: "1.5h" },
      { id: "b6", name: { ko: "태종대", en: "Taejongdae", ja: "太宗台", zh: "太宗台" }, desc: { ko: "부산 남단 절벽, 등대와 바다 절경", en: "Cliffs at Busan's southern tip, lighthouse", ja: "釜山南端の断崖、灯台と海の絶景", zh: "釜山南端悬崖，灯塔与海景" }, image: "🌊", category: "자연", lat: 35.0518, lng: 129.0850, time: "2h" },
      { id: "b7", name: { ko: "흰여울문화마을", en: "Huinnyeoul Culture Village", ja: "ヒンヨウル文化村", zh: "白浅滩文化村" }, desc: { ko: "영도의 숨은 보석, 바다 뷰 골목", en: "Hidden gem of Yeongdo, sea-view alleys", ja: "影島の隠れた宝石、海が見える路地", zh: "影岛隐藏宝石，海景胡同" }, image: "🏘️", category: "문화", lat: 35.0726, lng: 129.0667, time: "1h" },
      { id: "b3", name: { ko: "감천문화마을", en: "Gamcheon Culture Village", ja: "甘川文化村", zh: "甘川文化村" }, desc: { ko: "알록달록 벽화마을", en: "Colorful murals", ja: "カラフルな壁画村", zh: "五彩壁画村" }, image: "🎨", category: "문화", lat: 35.0975, lng: 129.0104, time: "2h" },
      { id: "b8", name: { ko: "부산 국제시장", en: "Gukje Market", ja: "国際市場", zh: "国际市场" }, desc: { ko: "전통시장 먹거리 투어, 씨앗호떡 필수", en: "Traditional market food tour, seed hotteok must-try", ja: "伝統市場グルメツアー、シアッホットク必食", zh: "传统市场美食之旅，种子糖饼必尝" }, image: "🥞", category: "맛집", lat: 35.1010, lng: 129.0287, time: "1.5h" },
    ],
  },
];

// ===== 맛집 =====

export const seoulRestaurants: Restaurant[] = [
  { id: "sr1", name: { ko: "광장시장 순희네 빈대떡", en: "Sunhee's Bindaetteok", ja: "スンヒネ ピンデトック", zh: "顺姬绿豆煎饼" }, desc: { ko: "광장시장 1세대 빈대떡 맛집", en: "1st generation bindaetteok at Gwangjang Market", ja: "広蔵市場1世代ピンデトック名店", zh: "广藏市场第一代绿豆煎饼名店" }, image: "🥘", category: "한식", price: "$", lat: 37.5700, lng: 127.0099, mustTry: { ko: "녹두 빈대떡 + 막걸리", en: "Mung bean pancake + Makgeolli", ja: "緑豆ピンデトック＋マッコリ", zh: "绿豆煎饼+马格利酒" } },
  { id: "sr2", name: { ko: "을지로 노가리 골목", en: "Euljiro Nogari Alley", ja: "乙支路ノガリ横丁", zh: "乙支路干鱼胡同" }, desc: { ko: "노가리(마른 안주)와 맥주의 성지", en: "Dried fish & beer paradise", ja: "ノガリ（干物おつまみ）とビールの聖地", zh: "干鱼下酒菜和啤酒的圣地" }, image: "🍺", category: "술집", price: "$", lat: 37.5660, lng: 126.9920, mustTry: { ko: "노가리 + 생맥주", en: "Dried fish + Draft beer", ja: "ノガリ＋生ビール", zh: "干鱼+生啤" } },
  { id: "sr3", name: { ko: "이태원 경리단길 맛집거리", en: "Gyeongridan-gil Food Street", ja: "経理団路グルメ通り", zh: "经理团路美食街" }, desc: { ko: "다국적 음식의 천국", en: "Multinational food paradise", ja: "多国籍料理の天国", zh: "多国美食天堂" }, image: "🌮", category: "세계", price: "$$", lat: 37.5340, lng: 126.9948, mustTry: { ko: "타코, 파스타, 브런치", en: "Tacos, pasta, brunch", ja: "タコス、パスタ、ブランチ", zh: "墨西哥卷、意面、早午餐" } },
  { id: "sr4", name: { ko: "종로 삼계탕 거리", en: "Jongno Samgyetang Street", ja: "鍾路サムゲタン通り", zh: "钟路参鸡汤街" }, desc: { ko: "여름 보양식 삼계탕의 본고장", en: "Home of samgyetang, summer health food", ja: "サムゲタンの本場、夏の滋養食", zh: "参鸡汤的故乡，夏季补身" }, image: "🍲", category: "한식", price: "$$", lat: 37.5718, lng: 126.9866, mustTry: { ko: "삼계탕 + 인삼주", en: "Samgyetang + Ginseng wine", ja: "サムゲタン＋人参酒", zh: "参鸡汤+人参酒" } },
  { id: "sr5", name: { ko: "성수동 카페거리", en: "Seongsu Cafe Street", ja: "聖水洞カフェ通り", zh: "圣水洞咖啡街" }, desc: { ko: "공장을 개조한 힙한 카페들", en: "Hip cafes in converted factories", ja: "工場をリノベしたヒップなカフェ", zh: "由工厂改造的时尚咖啡馆" }, image: "☕", category: "카페", price: "$$", lat: 37.5445, lng: 127.0559, mustTry: { ko: "스페셜티 커피 + 디저트", en: "Specialty coffee + Dessert", ja: "スペシャルティコーヒー＋デザート", zh: "精品咖啡+甜点" } },
];

export const busanRestaurants: Restaurant[] = [
  { id: "br1", name: { ko: "자갈치시장 회센터", en: "Jagalchi Sashimi Center", ja: "チャガルチ刺身センター", zh: "札嘎其刺身中心" }, desc: { ko: "1층 구매 2층 먹기, 최고 신선도", en: "Buy on 1F, eat on 2F, freshest quality", ja: "1階で購入2階で食事、最高の鮮度", zh: "1楼买2楼吃，最新鲜" }, image: "🐟", category: "해산물", price: "$$", lat: 35.0966, lng: 129.0307, mustTry: { ko: "광어+우럭 회 + 매운탕", en: "Flatfish + Rockfish sashimi + Spicy soup", ja: "ヒラメ＋クロソイ刺身＋メウンタン", zh: "比目鱼+石斑鱼刺身+辣汤" } },
  { id: "br2", name: { ko: "부산 돼지국밥 골목", en: "Busan Pork Soup Rice Alley", ja: "釜山テジクッパ横丁", zh: "釜山猪肉汤饭胡同" }, desc: { ko: "부산 소울푸드 돼지국밥", en: "Busan's soul food - pork soup rice", ja: "釜山のソウルフード テジクッパ", zh: "釜山灵魂美食猪肉汤饭" }, image: "🍜", category: "한식", price: "$", lat: 35.1133, lng: 129.0393, mustTry: { ko: "돼지국밥 + 수육", en: "Pork soup rice + Boiled pork", ja: "テジクッパ＋スユク", zh: "猪肉汤饭+白切肉" } },
  { id: "br3", name: { ko: "해운대 밀면 거리", en: "Haeundae Milmyeon Street", ja: "海雲台ミルミョン通り", zh: "海云台小麦面街" }, desc: { ko: "부산식 냉면, 밀면의 원조", en: "Busan-style cold noodles", ja: "釜山式冷麺、ミルミョンの元祖", zh: "釜山式冷面，小麦面的元祖" }, image: "🍝", category: "한식", price: "$", lat: 35.1600, lng: 129.1620, mustTry: { ko: "물밀면 + 비빔밀면", en: "Cold & Spicy milmyeon", ja: "水ミルミョン＋ビビンミルミョン", zh: "水冷面+拌冷面" } },
  { id: "br4", name: { ko: "국제시장 씨앗호떡", en: "Gukje Market Seed Hotteok", ja: "国際市場シアッホットク", zh: "国际市场种子糖饼" }, desc: { ko: "부산 명물 견과류 호떡", en: "Busan's famous nut-filled hotteok", ja: "釜山名物ナッツホットク", zh: "釜山名物坚果糖饼" }, image: "🥞", category: "간식", price: "$", lat: 35.1010, lng: 129.0287, mustTry: { ko: "씨앗호떡 (견과류 듬뿍)", en: "Seed hotteok (loaded with nuts)", ja: "シアッホットク（ナッツたっぷり）", zh: "种子糖饼（满满坚果）" } },
];

// ===== 포토스팟 =====

export const seoulPhotoSpots: PhotoSpot[] = [
  { id: "sp1", name: { ko: "경복궁 경회루", en: "Gyeonghoeru, Gyeongbokgung", ja: "景福宮慶会楼", zh: "景福宫庆会楼" }, desc: { ko: "연못에 비친 누각, 한복 필수", en: "Pavilion reflected in pond, hanbok recommended", ja: "池に映る楼閣、韓服必須", zh: "池中倒影的楼阁，建议穿韩服" }, image: "🏯", bestTime: { ko: "오전 10시 (역광 없음)", en: "10 AM (no backlight)", ja: "午前10時（逆光なし）", zh: "上午10点（无逆光）" }, lat: 37.5796, lng: 126.9770 },
  { id: "sp2", name: { ko: "남산타워 자물쇠", en: "N Seoul Tower Locks", ja: "Nソウルタワー南京錠", zh: "南山塔爱情锁" }, desc: { ko: "연인들의 사랑의 자물쇠 + 서울 야경", en: "Love locks + Seoul night view", ja: "恋人たちの愛の南京錠＋ソウル夜景", zh: "情侣爱情锁+首尔夜景" }, image: "🔒", bestTime: { ko: "일몰 30분 전", en: "30 min before sunset", ja: "日没30分前", zh: "日落前30分钟" }, lat: 37.5512, lng: 126.9882 },
  { id: "sp3", name: { ko: "DDP LED 장미정원", en: "DDP LED Rose Garden", ja: "DDP LEDバラ園", zh: "DDP LED玫瑰园" }, desc: { ko: "2만 5천 송이 LED 장미, 야간 필수", en: "25,000 LED roses, must visit at night", ja: "25,000本のLEDバラ、夜間必見", zh: "25000朵LED玫瑰，必须夜间参观" }, image: "🌹", bestTime: { ko: "밤 8시 이후", en: "After 8 PM", ja: "夜8時以降", zh: "晚上8点以后" }, lat: 37.5673, lng: 127.0095 },
  { id: "sp4", name: { ko: "코엑스 별마당 도서관", en: "COEX Starfield Library", ja: "COEXピョルマダン図書館", zh: "COEX星空图书馆" }, desc: { ko: "13m 높이의 대형 서가, 인스타 핫플", en: "13m tall bookshelves, Instagram hotspot", ja: "13m高の大型書架、インスタ映え", zh: "13米高巨型书架，网红打卡地" }, image: "📚", bestTime: { ko: "평일 오전 (인파 적음)", en: "Weekday morning (fewer crowds)", ja: "平日午前（人少なめ）", zh: "工作日上午（人少）" }, lat: 37.5116, lng: 127.0592 },
];

export const busanPhotoSpots: PhotoSpot[] = [
  { id: "bp1", name: { ko: "감천문화마을 전경", en: "Gamcheon Village Panorama", ja: "甘川文化村全景", zh: "甘川文化村全景" }, desc: { ko: "알록달록 지붕 전경, 어린왕자 포토존", en: "Colorful rooftop view, Little Prince photo zone", ja: "カラフルな屋根の全景、星の王子さまフォトゾーン", zh: "五彩屋顶全景，小王子拍照区" }, image: "🎨", bestTime: { ko: "오후 2-4시 (빛이 예쁨)", en: "2-4 PM (beautiful light)", ja: "午後2-4時（光が綺麗）", zh: "下午2-4点（光线漂亮）" }, lat: 35.0975, lng: 129.0104 },
  { id: "bp2", name: { ko: "광안대교 야경", en: "Gwangan Bridge Night View", ja: "広安大橋夜景", zh: "广安大桥夜景" }, desc: { ko: "광안리 해변에서 보는 대교 야경", en: "Bridge night view from Gwangalli Beach", ja: "広安里ビーチから見る大橋夜景", zh: "从广安里海滩看大桥夜景" }, image: "🌉", bestTime: { ko: "일몰 직후 ~ 밤 9시", en: "Right after sunset ~ 9 PM", ja: "日没直後〜夜9時", zh: "日落后~晚上9点" }, lat: 35.1532, lng: 129.1189 },
  { id: "bp3", name: { ko: "해동용궁사 일출", en: "Haedong Yonggungsa Sunrise", ja: "海東龍宮寺の日の出", zh: "海东龙宫寺日出" }, desc: { ko: "바다 위 절에서 보는 일출", en: "Sunrise from temple on the sea", ja: "海の上の寺から見る日の出", zh: "海上寺庙的日出" }, image: "🌅", bestTime: { ko: "일출 시간 (계절별 다름)", en: "Sunrise (varies by season)", ja: "日の出時間（季節により異なる）", zh: "日出时间（因季节而异）" }, lat: 35.1884, lng: 129.2233 },
  { id: "bp4", name: { ko: "흰여울문화마을 벽화", en: "Huinnyeoul Village Murals", ja: "ヒンヨウル村壁画", zh: "白浅滩村壁画" }, desc: { ko: "바다가 보이는 벽화 골목", en: "Mural alley with sea view", ja: "海が見える壁画の路地", zh: "看得见海的壁画胡同" }, image: "🖼️", bestTime: { ko: "오전 (역광 피하기)", en: "Morning (avoid backlight)", ja: "午前（逆光を避ける）", zh: "上午（避免逆光）" }, lat: 35.0726, lng: 129.0667 },
];

// ===== 교통 가이드 =====

export const seoulTransport: TransportInfo[] = [
  { id: "st1", title: { ko: "지하철", en: "Subway", ja: "地下鉄", zh: "地铁" }, icon: "🚇", desc: { ko: "서울 이동의 핵심! 1~9호선 + 경의선 등", en: "Core of Seoul transport! Lines 1-9 + more", ja: "ソウル移動の核心！1～9号線＋京義線など", zh: "首尔交通核心！1-9号线+" }, tips: { ko: ["T-money 카드 필수 구매 (편의점에서 구입)", "기본요금 1,400원, 환승 무료", "카카오맵/네이버지도로 경로 검색 추천", "혼잡시간: 출퇴근 7-9시, 17-19시 피하기"], en: ["Must buy T-money card (at convenience stores)", "Base fare ₩1,400, free transfers", "Use KakaoMap/Naver Map for routes", "Rush hours: avoid 7-9AM, 5-7PM"], ja: ["T-moneyカード必須購入（コンビニで購入）", "基本料金1,400ウォン、乗り換え無料", "カカオマップ/NAVERマップでルート検索", "混雑時間：7-9時、17-19時は避ける"], zh: ["必买T-money卡（便利店购买）", "基本票价1400韩元，免费换乘", "用KakaoMap/Naver地图查路线", "高峰时段：避开7-9点、17-19点"] } },
  { id: "st2", title: { ko: "버스", en: "Bus", ja: "バス", zh: "公交" }, icon: "🚌", desc: { ko: "지하철 못 가는 곳은 버스로!", en: "Where subway can't go, bus can!", ja: "地下鉄で行けないところはバスで！", zh: "地铁到不了的地方坐公交！" }, tips: { ko: ["파랑(간선), 초록(지선), 빨강(광역)", "T-money 사용, 지하철 환승 가능", "앞문 승차, 뒷문 하차", "구글맵보다 카카오맵이 정확"], en: ["Blue(trunk), Green(branch), Red(express)", "T-money accepted, transfer with subway", "Board front door, exit rear door", "KakaoMap more accurate than Google Maps"], ja: ["青（幹線）、緑（支線）、赤（広域）", "T-money使用可、地下鉄乗り換え可能", "前ドア乗車、後ドア下車", "GoogleマップよりカカオマップのGが正確"], zh: ["蓝色(干线)、绿色(支线)、红色(快线)", "可用T-money，可与地铁换乘", "前门上车，后门下车", "KakaoMap比谷歌地图准确"] } },
  { id: "st3", title: { ko: "택시", en: "Taxi", ja: "タクシー", zh: "出租车" }, icon: "🚕", desc: { ko: "편리하지만 요금 주의!", en: "Convenient but watch the fare!", ja: "便利だけど料金に注意！", zh: "方便但注意费用！" }, tips: { ko: ["기본요금 4,800원 (2km)", "카카오T 앱으로 호출 추천", "심야할증(밤12~4시) 20% 추가", "모범택시(검정색)는 요금 더 비쌈"], en: ["Base fare ₩4,800 (2km)", "Use KakaoT app for booking", "Late night surcharge (12-4AM) +20%", "Deluxe taxi (black) is more expensive"], ja: ["基本料金4,800ウォン（2km）", "カカオTアプリで配車がおすすめ", "深夜割増（0-4時）20%追加", "模範タクシー（黒）は料金高め"], zh: ["起步价4800韩元（2km）", "推荐用KakaoT叫车", "深夜加价(0-4点) +20%", "模范出租(黑色)更贵"] } },
  { id: "st4", title: { ko: "🚌 시티투어버스 (2층)", en: "City Tour Bus (Double-decker)", ja: "シティツアーバス（2階建て）", zh: "城市观光巴士（双层）" }, icon: "🚍", desc: { ko: "2층 오픈탑 버스로 서울 명소 한번에!", en: "See all Seoul highlights on a double-decker!", ja: "2階建てオープントップバスでソウル観光！", zh: "双层敞篷巴士畅游首尔！" }, tips: { ko: ["도심고궁남산코스: 성인 34,000원, 소인 21,000원", "파노라마코스: 16개 정류장 순환, 남산·한강·명동", "야경코스: 성인 29,000원 (한강·남산 야경)", "12개국 오디오 가이드 제공 (한·영·일·중 등)", "매주 월요일 휴무, 광화문 출발 (오전 9시~)", "예약: seoulcitybus.com / 02-777-6090", "1일권 구매 시 자유롭게 타고 내리기 가능 (Hop-on Hop-off)"], en: ["Palace&Namsan Course: Adult ₩34,000, Child ₩21,000", "Panorama Course: 16 stops, Namsan·Han River·Myeongdong", "Night Course: Adult ₩29,000 (Han River & Namsan night view)", "Audio guide in 12 languages (KR/EN/JP/CN etc.)", "Closed Mondays, departs from Gwanghwamun (9AM~)", "Booking: seoulcitybus.com / 02-777-6090", "Day pass: Hop-on Hop-off freely at any stop"], ja: ["古宮南山コース：大人34,000ウォン、子供21,000ウォン", "パノラマコース：16停留所循環、南山・漢江・明洞", "夜景コース：大人29,000ウォン（漢江・南山夜景）", "12か国語オーディオガイド提供（韓・英・日・中など）", "毎週月曜休み、光化門出発（午前9時～）", "予約：seoulcitybus.com / 02-777-6090", "1日券で自由に乗り降り可能（Hop-on Hop-off）"], zh: ["古宫南山路线：成人34,000韩元，儿童21,000韩元", "全景路线：16站循环，南山·汉江·明洞", "夜景路线：成人29,000韩元（汉江·南山夜景）", "提供12国语音导览（韩·英·日·中等）", "每周一休息，光化门出发（上午9点起）", "预约：seoulcitybus.com / 02-777-6090", "一日券可自由上下车（Hop-on Hop-off）"] } },
];

export const busanTransport: TransportInfo[] = [
  { id: "bt1", title: { ko: "지하철", en: "Subway", ja: "地下鉄", zh: "地铁" }, icon: "🚇", desc: { ko: "1~4호선 + 경전철", en: "Lines 1-4 + light rail", ja: "1～4号線＋軽電鉄", zh: "1-4号线+轻轨" }, tips: { ko: ["부산도 T-money 사용 가능", "기본요금 1,450원", "해운대(2호선), 자갈치(1호선) 등 관광지 접근 용이", "동해선 이용하면 해변 관광 편리"], en: ["T-money works in Busan too", "Base fare ₩1,450", "Easy access to Haeundae(Line 2), Jagalchi(Line 1)", "Donghae Line convenient for beach tourism"], ja: ["釜山でもT-money使用可能", "基本料金1,450ウォン", "海雲台（2号線）、チャガルチ（1号線）など観光地アクセス良好", "東海線利用でビーチ観光便利"], zh: ["釜山也可用T-money", "基本票价1450韩元", "海云台(2号线)、札嘎其(1号线)等景点方便到达", "东海线方便海滩观光"] } },
  { id: "bt2", title: { ko: "시내버스", en: "City Bus", ja: "市内バス", zh: "市内公交" }, icon: "🚌", desc: { ko: "해안가 관광은 버스가 편리", en: "Bus is convenient for coastal sightseeing", ja: "海岸沿い観光はバスが便利", zh: "沿海观光坐公交方便" }, tips: { ko: ["1003번: 해운대↔태종대 (관광 필수)", "1001번: 해운대↔자갈치시장", "해동용궁사는 181번 버스", "구글맵보다 카카오맵 추천"], en: ["Bus 1003: Haeundae↔Taejongdae (must)", "Bus 1001: Haeundae↔Jagalchi Market", "Bus 181 for Haedong Yonggungsa", "KakaoMap recommended over Google Maps"], ja: ["1003番：海雲台↔太宗台（観光必須）", "1001番：海雲台↔チャガルチ市場", "海東龍宮寺は181番バス", "GoogleマップよりカカオマップGがおすすめ"], zh: ["1003路：海云台↔太宗台（必坐）", "1001路：海云台↔札嘎其市场", "海东龙宫寺坐181路", "推荐KakaoMap而非谷歌地图"] } },
  { id: "bt3", title: { ko: "KTX (서울↔부산)", en: "KTX (Seoul↔Busan)", ja: "KTX（ソウル↔釜山）", zh: "KTX (首尔↔釜山)" }, icon: "🚄", desc: { ko: "서울에서 부산까지 2시간 30분!", en: "Seoul to Busan in 2.5 hours!", ja: "ソウルから釜山まで2時間30分！", zh: "首尔到釜山只要2.5小时！" }, tips: { ko: ["서울역/수서역 → 부산역 (약 2시간 30분)", "일반석 약 59,800원", "코레일 앱/SRT 앱으로 예약", "주말/공휴일은 미리 예약 필수"], en: ["Seoul/Suseo Stn → Busan Stn (~2.5hrs)", "Regular seat ~₩59,800", "Book via Korail/SRT app", "Reserve ahead for weekends/holidays"], ja: ["ソウル駅/水西駅→釜山駅（約2.5時間）", "一般席約59,800ウォン", "コレールアプリ/SRTアプリで予約", "週末・祝日は早めの予約必須"], zh: ["首尔站/水西站→釜山站（约2.5小时）", "普通座约59800韩元", "用Korail/SRT APP预约", "周末节假日务必提前预约"] } },
  { id: "bt4", title: { ko: "🚌 시티투어버스 (2층)", en: "City Tour Bus (Double-decker)", ja: "シティツアーバス（2階建て）", zh: "城市观光巴士（双层）" }, icon: "🚍", desc: { ko: "부산역에서 출발! 2층 오픈탑 버스로 부산 관광", en: "Departs from Busan Station! Open-top bus tour", ja: "釜山駅出発！2階建てオープントップバスで釜山観光", zh: "釜山站出发！双层敞篷巴士游览釜山" }, tips: { ko: ["레드라인: 부산역↔해운대 순환 (2층 오픈탑)", "그린라인: 부산역↔태종대 순환 (2층 오픈탑)", "오렌지라인: 부산역↔다대포↔을숙도 (단층)", "야경투어: 부산역 출발, 광안대교 야경 감상", "단일권: 1개 노선 당일 자유이용", "환승권: 레드·그린·오렌지 전 노선 24시간 이용", "부산역 광장 왼쪽 탑승장, 현장 티켓 구매 가능", "KTX 탑승권 제시 시 할인 혜택", "예약: citytourbusan.com / 051-464-9898"], en: ["Red Line: Busan Stn↔Haeundae loop (open-top)", "Green Line: Busan Stn↔Taejongdae loop (open-top)", "Orange Line: Busan Stn↔Dadaepo↔Eulsukdo", "Night Tour: Departs Busan Stn, Gwangan Bridge views", "Single pass: 1 line, all-day hop-on hop-off", "Transfer pass: All 3 lines for 24 hours", "Board at Busan Station plaza (left side), buy on-site", "KTX ticket holders get discount", "Booking: citytourbusan.com / 051-464-9898"], ja: ["レッドライン：釜山駅↔海雲台循環（オープントップ）", "グリーンライン：釜山駅↔太宗台循環（オープントップ）", "オレンジライン：釜山駅↔多大浦↔乙淑島", "夜景ツアー：釜山駅出発、広安大橋夜景鑑賞", "単一券：1路線1日自由利用", "環乗券：全3路線24時間利用可能", "釜山駅広場左側の乗り場、現場でチケット購入可能", "KTX乗車券提示で割引", "予約：citytourbusan.com / 051-464-9898"], zh: ["红线：釜山站↔海云台循环（敞篷双层）", "绿线：釜山站↔太宗台循环（敞篷双层）", "橙线：釜山站↔多大浦↔乙淑岛", "夜景游：釜山站出发，欣赏广安大桥夜景", "单线券：1条线路全天自由上下", "换乘券：3条线路24小时通用", "釜山站广场左侧上车，现场购票", "出示KTX车票享折扣", "预约：citytourbusan.com / 051-464-9898"] } },
];
