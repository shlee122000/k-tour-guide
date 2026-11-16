"use client";

import { Capacitor } from "@capacitor/core";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import LanguageSelector from "@/components/LanguageSelector";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";


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
    image: "🏯", rating: 4.8, city: "Seoul", lat: 37.5796, lng: 126.9770 },
  { id: 2, searchName: "해운대해수욕장",
    name: { ko: "해운대 해수욕장", en: "Haeundae Beach", ja: "海雲台ビーチ", zh: "海云台海水浴场", es: "Playa Haeundae", fr: "Plage Haeundae", th: "หาดแฮอุนแด", vi: "Bãi biển Haeundae", id: "Pantai Haeundae", de: "Haeundae-Strand" },
    image: "🏖️", rating: 4.6, city: "Busan", lat: 35.1587, lng: 129.1604 },
  { id: 3, searchName: "성산일출봉",
    name: { ko: "제주 성산일출봉", en: "Seongsan Sunrise Peak", ja: "城山日出峰", zh: "城山日出峰", es: "Pico Seongsan", fr: "Pic Seongsan", th: "ยอดเขาซองซาน", vi: "Đỉnh Seongsan", id: "Puncak Seongsan", de: "Seongsan-Gipfel" },
    image: "🌋", rating: 4.7, city: "Jeju", lat: 33.4590, lng: 126.9425 },
  { id: 4, searchName: "N서울타워",
    name: { ko: "남산타워", en: "N Seoul Tower", ja: "Nソウルタワー", zh: "南山塔", es: "Torre N Seoul", fr: "Tour N Seoul", th: "หอคอยเอ็นโซล", vi: "Tháp N Seoul", id: "Menara N Seoul", de: "N Seoul Tower" },
    image: "🗼", rating: 4.5, city: "Seoul", lat: 37.5512, lng: 126.9882 },
];

interface KpopSpot {
  icon: string;
  name: { ko: string; en: string; [key: string]: string };
  desc: { ko: string; en: string; [key: string]: string };
  address: string;
  mapUrl: string;
  photo: string;
  link?: string;
}
interface KpopZone {
  id: string;
  title: { ko: string; en: string; [key: string]: string };
  subtitle: { ko: string; en: string; [key: string]: string };
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
      { icon: "☕", name: { ko: "용리단길", en: "Yongridan-gil", de: "Yongridan-gil", es: "Yongridan-gil", fr: "Yongridan-gil", id: "Yongridan-gil", ja: "ヨンリダンギル", th: "ยงรีดันกิล", vi: "Yongridan-gil", zh: "龙里丹街" }, desc: { ko: "용산 신용산역 인근의 트렌디한 카페·맛집 거리예요.", en: "A trendy café-and-restaurant strip near Sinyongsan Station in Yongsan.", de: "Eine angesagte Café- und Restaurantmeile nahe der Sinyongsan-Station in Yongsan.", es: "Una calle de moda con cafés y restaurantes cerca de la estación Sinyongsan, en Yongsan.", fr: "Une rue tendance de cafés et restaurants près de la station Sinyongsan, à Yongsan.", id: "Jalur kafe dan restoran kekinian dekat Stasiun Sinyongsan di Yongsan.", ja: "龍山新龍山駅近くのおしゃれなカフェ・グルメ通り。", th: "ย่านคาเฟ่และร้านอาหารสุดฮิปใกล้สถานีชินยงซานในยงซาน", vi: "Con phố cà phê và nhà hàng thời thượng gần ga Sinyongsan ở Yongsan.", zh: "龙山新龙山站附近的时尚咖啡餐厅街。" }, address: "서울특별시 용산구 한강대로 일대 (신용산역 인근)", mapUrl: "https://map.kakao.com/link/search/용리단길", photo: "" },
      { icon: "🛍️", name: { ko: "해방촌 신흥시장", en: "Haebangchon Sinheung Market", de: "Haebangchon-Sinheung-Markt", es: "Mercado Sinheung de Haebangchon", fr: "Marché Sinheung de Haebangchon", id: "Pasar Sinheung Haebangchon", ja: "解放村新興市場", th: "ตลาดชินฮึงแฮบังชน", vi: "Chợ Sinheung Haebangchon", zh: "解放村新兴市场" }, desc: { ko: "70년 된 재래시장이 카페·바·식당 골목으로 변신한 핫플레이스예요.", en: "A 70-year-old market reborn as an alley of trendy cafés, bars, and restaurants.", de: "Ein 70 Jahre alter Markt, der sich in eine Gasse voller angesagter Cafés, Bars und Restaurants verwandelt hat.", es: "Un mercado de 70 años reconvertido en un callejón de cafés, bares y restaurantes de moda.", fr: "Un marché vieux de 70 ans transformé en ruelle de cafés, bars et restaurants tendance.", id: "Pasar berusia 70 tahun yang kini menjelma menjadi gang kafe, bar, dan restoran kekinian.", ja: "築70年の在来市場がおしゃれなカフェ・バー・レストラン街に生まれ変わった人気スポット。", th: "ตลาดเก่าแก่อายุ 70 ปี ที่กลายเป็นตรอกคาเฟ่ บาร์ และร้านอาหารสุดฮิป", vi: "Khu chợ 70 năm tuổi nay đã biến thành con hẻm đầy quán cà phê, quán bar và nhà hàng thời thượng.", zh: "拥有70年历史的传统市场，如今变身为时尚咖啡馆、酒吧和餐厅聚集的热门小巷。" }, address: "서울특별시 용산구 신흥로 95 일대", mapUrl: "https://map.kakao.com/link/search/해방촌 신흥시장", photo: "" },
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
  },
  {
    id: "jongno-euljiro",
    title: { ko: "종로·을지로 레트로골목", en: "Jongno & Euljiro Retro Alleys", de: "Jongno & Euljiro Retro-Gassen", es: "Callejones retro de Jongno y Euljiro", fr: "Ruelles rétro de Jongno et Euljiro", id: "Gang Retro Jongno & Euljiro", ja: "鍾路・乙支路レトロ横丁", th: "ตรอกเรโทรจงโนและอึลจิโร", vi: "Hẻm cổ điển Jongno & Euljiro", zh: "钟路·乙支路复古小巷" },
    subtitle: { ko: "전통시장 + 뉴트로 핫플레이스", en: "Traditional Markets + Newtro Hot Spots", de: "Traditionelle Märkte + Newtro-Hotspots", es: "Mercados tradicionales + lugares de moda newtro", fr: "Marchés traditionnels + lieux branchés newtro", id: "Pasar Tradisional + Hot Spot Newtro", ja: "伝統市場 + ニュートロホットスポット", th: "ตลาดดั้งเดิม + ฮอตสปอตนิวโทร", vi: "Chợ truyền thống + địa điểm hot newtro", zh: "传统市场 + 复古新潮热点" },
    gradient: "linear-gradient(135deg, #d97706, #92400e)",
    emoji: "🏮",
    spots: [
      { icon: "🏮", name: { ko: "종로3가 포차거리", en: "Jongno 3-ga Pojangmacha Street", de: "Jongno-3-ga-Pojangmacha-Straße", es: "Calle de pojangmacha de Jongno 3-ga", fr: "Rue des pojangmacha de Jongno 3-ga", id: "Jalan Pojangmacha Jongno 3-ga", ja: "鍾路3街屋台通り", th: "ถนนโปจังมาจาจงโน 3-กา", vi: "Phố quán lều Jongno 3-ga", zh: "钟路三街路边摊街" }, desc: { ko: "낙원동 일대에 포장마차가 모여 있는 레트로 감성 골목, 밤에 더 핫해요.", en: "A retro alley near Nagwon-dong lined with outdoor food tents — buzzing after dark.", de: "Eine Retro-Gasse nahe Nagwon-dong voller Imbissstände – abends am belebtesten.", es: "Un callejón retro cerca de Nagwon-dong lleno de puestos de comida al aire libre, más animado de noche.", fr: "Une ruelle rétro près de Nagwon-dong bordée de stands de nourriture en plein air, plus animée le soir.", id: "Gang bernuansa retro dekat Nagwon-dong dengan deretan tenda makanan — paling ramai di malam hari.", ja: "楽園洞近くの屋台が並ぶレトロな路地。夜が一番賑わいます。", th: "ตรอกสไตล์เรโทรใกล้นากวอนดงที่เรียงรายด้วยแผงอาหารกลางแจ้ง คึกคักที่สุดตอนกลางคืน", vi: "Con hẻm phong cách retro gần Nagwon-dong với các quán lều ăn uống, nhộn nhịp nhất về đêm.", zh: "位于乐园洞附近的复古小巷，路边摊林立，夜晚最热闹。" }, address: "서울특별시 종로구 종로3가 일대 (낙원동 포장마차거리)", mapUrl: "https://map.kakao.com/link/search/종로3가 포장마차거리", photo: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=5d1ef6a4-43a4-4845-8592-d257e221a2c0" },
      { icon: "🧱", name: { ko: "서순라길", en: "Seosulla-gil", de: "Seosulla-gil", es: "Seosulla-gil", fr: "Seosulla-gil", id: "Seosulla-gil", ja: "ソスルラギル", th: "ซอซุลลากิล", vi: "Seosulla-gil", zh: "西巡逻路" }, desc: { ko: "종묘 서쪽 돌담을 따라 이어지는 산책길로, 한복 카페와 감성 숍이 모여 있어요.", en: "A quiet path along Jongmyo Shrine's west stone wall, now lined with hanbok cafés and boutique shops.", de: "Ein ruhiger Weg entlang der Westmauer des Jongmyo-Schreins, heute gesäumt von Hanbok-Cafés und kleinen Läden.", es: "Un sendero tranquilo junto al muro oeste del Santuario Jongmyo, lleno de cafés con hanbok y tiendas de ambiente.", fr: "Un sentier paisible le long du mur ouest du sanctuaire Jongmyo, bordé de cafés en hanbok et de petites boutiques.", id: "Jalan setapak tenang di sepanjang tembok batu barat Kuil Jongmyo, kini dipenuhi kafe bernuansa hanbok dan toko unik.", ja: "宗廟の西側の石垣沿いに続く散策路で、韓服カフェやおしゃれな店が並びます。", th: "เส้นทางเดินเงียบสงบเลียบกำแพงหินด้านตะวันตกของศาลเจ้าจงมโย เรียงรายด้วยคาเฟ่ชุดฮันบกและร้านสไตล์", vi: "Con đường yên tĩnh dọc bức tường đá phía tây đền Jongmyo, nay có nhiều quán cà phê hanbok và cửa hàng phong cách.", zh: "沿着宗庙西侧石墙延伸的散步小路，如今开满了韩服咖啡馆和文艺小店。" }, address: "서울특별시 종로구 돈화문로 일대 (종묘 서쪽 돌담길)", mapUrl: "https://map.kakao.com/link/search/서순라길", photo: "https://tong.visitkorea.or.kr/cms/resource/56/3019156_image2_1.jpg" },
      { icon: "🍺", name: { ko: "을지로 노가리골목", en: "Euljiro Nogari Alley", de: "Euljiro-Nogari-Gasse", es: "Callejón Nogari de Euljiro", fr: "Ruelle Nogari d'Euljiro", id: "Gang Nogari Euljiro", ja: "乙支路ノガリ横丁", th: "ตรอกโนการิอึลจิโร", vi: "Hẻm Nogari Euljiro", zh: "乙支路明太鱼干酒巷" }, desc: { ko: "노가리와 생맥주를 파는 노포가 즐비한 레트로 골목, 요즘 '힙지로'로 불려요.", en: "An old-school alley packed with pollock-and-draft-beer bars — now nicknamed \"Hip-jiro.\"", de: "Eine traditionsreiche Gasse voller Kneipen mit getrocknetem Pollack und Fassbier – heute als „Hip-jiro“ bekannt.", es: "Un callejón tradicional lleno de bares de pescado seco y cerveza de barril, hoy apodado \"Hip-jiro\".", fr: "Une ruelle traditionnelle pleine de bars à poisson séché et bière pression, surnommée aujourd'hui « Hip-jiro ».", id: "Gang bergaya lama yang dipenuhi bar ikan kering dan bir draft — kini dijuluki \"Hip-jiro.\"", ja: "干しスケトウダラと生ビールの老舗が並ぶレトロな路地。今は「ヒプジロ」とも呼ばれます。", th: "ตรอกสไตล์เก่าที่เรียงรายด้วยร้านปลาพอลล็อคแห้งและเบียร์สด ปัจจุบันถูกเรียกว่า \"ฮิปจิโร\"", vi: "Con hẻm cổ điển với nhiều quán nhậu cá minh thái khô và bia tươi, nay được gọi là \"Hip-jiro.\"", zh: "充满明太鱼干和生啤酒老店的复古小巷，如今被称为\"Hip-jiro\"。" }, address: "서울특별시 중구 을지로3가 일대", mapUrl: "https://map.kakao.com/link/search/을지로 노가리골목", photo: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=92623276-c210-4f74-b530-ecb24aeefb18" },
      { icon: "🥟", name: { ko: "광장시장", en: "Gwangjang Market", de: "Gwangjang-Markt", es: "Mercado Gwangjang", fr: "Marché Gwangjang", id: "Pasar Gwangjang", ja: "広蔵市場", th: "ตลาดกวางจัง", vi: "Chợ Gwangjang", zh: "广藏市场" }, desc: { ko: "100년 넘은 전통시장으로 빈대떡, 마약김밥, 육회가 유명해요.", en: "A century-old traditional market famous for bindae-tteok, mayak gimbap, and raw beef.", de: "Ein über 100 Jahre alter traditioneller Markt, bekannt für Bindae-tteok, Mayak-Gimbap und rohes Rindfleisch.", es: "Un mercado tradicional centenario famoso por el bindae-tteok, el mayak gimbap y la carne de res cruda.", fr: "Un marché traditionnel centenaire célèbre pour le bindae-tteok, le mayak gimbap et le bœuf cru.", id: "Pasar tradisional berusia lebih dari 100 tahun yang terkenal dengan bindae-tteok, mayak gimbap, dan daging sapi mentah.", ja: "100年以上の歴史を持つ伝統市場で、ビンデトッ、麻薬キンパ、ユッケが有名です。", th: "ตลาดดั้งเดิมอายุกว่า 100 ปี ขึ้นชื่อเรื่องบินแดต็อก มายักกิมบับ และเนื้อดิบ", vi: "Khu chợ truyền thống hơn 100 năm tuổi, nổi tiếng với bánh bindae-tteok, kimbap mayak và thịt bò sống.", zh: "拥有百年历史的传统市场，以绿豆煎饼、麻药紫菜包饭和生牛肉而闻名。" }, address: "서울특별시 종로구 창경궁로 88", mapUrl: "https://map.kakao.com/link/search/광장시장", photo: "https://tong.visitkorea.or.kr/cms/resource/81/2668981_image2_1.jpg" },
      { icon: "☕", name: { ko: "스타벅스 경동1960점", en: "Starbucks Gyeongdong 1960", de: "Starbucks Gyeongdong 1960", es: "Starbucks Gyeongdong 1960", fr: "Starbucks Gyeongdong 1960", id: "Starbucks Gyeongdong 1960", ja: "スターバックス京東1960店", th: "สตาร์บัคส์ คยองดง 1960", vi: "Starbucks Gyeongdong 1960", zh: "星巴克京东1960店" }, desc: { ko: "1960년대 지어진 옛 극장을 개조한 경동시장 속 이색 스타벅스.", en: "A one-of-a-kind Starbucks inside Gyeongdong Market, built in a renovated 1960s theater.", de: "Ein einzigartiges Starbucks im Gyeongdong-Markt, untergebracht in einem umgebauten Kino aus den 1960ern.", es: "Un Starbucks único dentro del mercado Gyeongdong, instalado en un antiguo cine de los años 60 renovado.", fr: "Un Starbucks unique au marché Gyeongdong, installé dans un ancien cinéma des années 1960 rénové.", id: "Starbucks unik di dalam Pasar Gyeongdong, menempati bioskop lama tahun 1960-an yang direnovasi.", ja: "1960年代の古い映画館を改装した、京東市場内のユニークなスターバックス。", th: "สตาร์บัคส์สุดเอกลักษณ์ในตลาดคยองดง ที่ดัดแปลงจากโรงภาพยนตร์เก่าสมัยปี 1960", vi: "Starbucks độc đáo trong chợ Gyeongdong, cải tạo từ rạp chiếu phim cũ từ những năm 1960.", zh: "位于京东市场内、由1960年代老电影院改造而成的特色星巴克门店。" }, address: "서울특별시 동대문구 고산자로36길 3 (경동시장 내)", mapUrl: "https://map.kakao.com/link/search/스타벅스 경동1960점", photo: "https://tong.visitkorea.or.kr/cms/resource/73/3039673_image2_1.jpg" },
    ]
  },
  {
    id: "busan-hotspot",
    title: { ko: "부산 핫플레이스", en: "Busan Hot Spots", de: "Busan Hotspots", es: "Lugares de moda en Busan", fr: "Lieux branchés de Busan", id: "Hot Spot Busan", ja: "釜山ホットスポット", th: "ฮอตสปอตปูซาน", vi: "Địa điểm hot ở Busan", zh: "釜山热门景点" },
    subtitle: { ko: "해운대 바다 전망 명소", en: "Ocean-View Spot in Haeundae", de: "Meerblick-Spot in Haeundae", es: "Lugar con vista al mar en Haeundae", fr: "Point de vue sur la mer à Haeundae", id: "Spot Pemandangan Laut di Haeundae", ja: "海雲台の海景スポット", th: "จุดชมวิวทะเลในแฮอุนแด", vi: "Điểm ngắm biển ở Haeundae", zh: "海云台海景胜地" },
    gradient: "linear-gradient(135deg, #0891b2, #1e3a8a)",
    emoji: "🌊",
    spots: [
      { icon: "🌊", name: { ko: "해운대 블루라인파크", en: "Haeundae Blueline Park", de: "Haeundae Blueline Park", es: "Parque Blueline de Haeundae", fr: "Parc Blueline de Haeundae", id: "Haeundae Blueline Park", ja: "海雲台ブルーラインパーク", th: "แฮอุนแด บลูไลน์ พาร์ค", vi: "Công viên Blueline Haeundae", zh: "海云台蓝线公园" }, desc: { ko: "옛 철길을 따라가는 해변열차와 스카이캡슐로 바다 전망을 즐길 수 있어요.", en: "Ride the beach train or sky capsule along the old railway for stunning ocean views.", de: "Fahren Sie mit dem Strandzug oder der Himmelskapsel entlang der alten Bahnstrecke für atemberaubende Meeresblicke.", es: "Viaja en el tren de playa o la cápsula aérea por la antigua vía férrea para disfrutar de vistas al mar impresionantes.", fr: "Prenez le train de plage ou la capsule aérienne le long de l'ancienne voie ferrée pour une vue imprenable sur la mer.", id: "Naik kereta pantai atau kapsul langit di sepanjang rel kereta lama untuk pemandangan laut yang menakjubkan.", ja: "旧鉄道路線を走るビーチトレインやスカイカプセルから美しい海の景色を楽しめます。", th: "นั่งรถไฟชายหาดหรือสกายแคปซูลตามเส้นทางรถไฟเก่าเพื่อชมวิวทะเลสุดงดงาม", vi: "Trải nghiệm tàu bãi biển hoặc khoang treo trên cao dọc tuyến đường sắt cũ để ngắm cảnh biển tuyệt đẹp.", zh: "沿着旧铁路线乘坐海滨列车或天空胶囊，欣赏绝美海景。" }, address: "부산광역시 해운대구 달맞이길62번길 13 (미포정거장)", mapUrl: "https://map.kakao.com/link/search/해운대 블루라인파크", photo: "https://tong.visitkorea.or.kr/cms/resource/99/3546099_image2_1.jpg" },
    ]
  }
];

const kbeautyItems = [
  { icon: "🏥", bgColor: "#a5f3fc", textColor: "#0e7490", name: { ko: "성형외과 정보", en: "Plastic Surgery" }, url: "https://my-doctor.io/hospital/deptHub/region/%EC%84%B1%ED%98%95%EC%99%B8%EA%B3%BC-%EC%84%9C%EC%9A%B8" },
  { icon: "💄", bgColor: "#bbf7d0", textColor: "#15803d", name: { ko: "올리브영", en: "Olive Young" }, mapUrl: "https://map.kakao.com/link/search/올리브영 명동" },
  { icon: "📋", bgColor: "#fecdd3", textColor: "#be123c", name: { ko: "시술 후기 참고", en: "Reviews" }, url: "https://www.babitalk.com" },
];

const PROMO_TEXTS: Record<string, Record<string, string>> = {
  title: {
    en:"Try our related apps!", ja:"関連アプリも使ってみてください！",
    zh:"试试我们的相关应用！", es:"¡Prueba nuestras apps relacionadas!",
    fr:"Essayez nos applications connexes!", th:"ลองแอปที่เกี่ยวข้อง!",
    vi:"Thử các ứng dụng liên quan!", id:"Coba aplikasi terkait kami!",
    de:"Probieren Sie unsere verwandten Apps!", ko:"관련 앱도 사용해보세요!"
  },
  studyDesc: {
    en:"Learn Korean with AI!", ja:"AIで韓国語を楽しく学習！",
    zh:"用AI有趣地学习韩语！", es:"¡Aprende coreano con IA!",
    fr:"Apprenez le coréen avec l'IA!", th:"เรียนภาษาเกาหลีด้วย AI!",
    vi:"Học tiếng Hàn với AI!", id:"Belajar bahasa Korea dengan AI!",
    de:"Koreanisch mit KI lernen!", ko:"AI로 한국어를 즐겁게 학습!"
  },
  kpopDesc: {
    en:"Learn Korean with K-POP!", ja:"K-POPで韓国語を学ぼう！",
    zh:"用K-POP学习韩语！", es:"¡Aprende coreano con K-POP!",
    fr:"Apprenez le coréen avec K-POP!", th:"เรียนภาษาเกาหลีด้วย K-POP!",
    vi:"Học tiếng Hàn với K-POP!", id:"Belajar bahasa Korea dengan K-POP!",
    de:"Koreanisch mit K-POP lernen!", ko:"K-POP으로 한국어 학습!"
  },
  btn: {
    en:"Get Started 🗺️", ja:"はじめる 🗺️",
    zh:"开始使用 🗺️", es:"¡Empezar 🗺️",
    fr:"Commencer 🗺️", th:"เริ่มต้น 🗺️",
    vi:"Bắt đầu 🗺️", id:"Mulai 🗺️",
    de:"Loslegen 🗺️", ko:"시작하기 🗺️"
  },
};

export default function HomePage() {
  const t = useTranslations();
  const tCat = useTranslations("categories");
  const tHome = useTranslations("home");
  const tApp = useTranslations("app");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
  const pending = localStorage.getItem("cross_promo_pending");
  if (pending === "1") {
    localStorage.removeItem("cross_promo_pending");
    setTimeout(() => setShowPromo(true), 500);
  }
}, []);

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
  const handlePlaceClick = (place: { searchName: string; lat?: number; lng?: number }) => {
    if (place.lat && place.lng) {
      window.open(`https://map.kakao.com/link/map/${encodeURIComponent(place.searchName)},${place.lat},${place.lng}`, "_blank");
    } else {
      router.push(`/${locale}/map?search=${encodeURIComponent(place.searchName)}`);
    }
  };
  const getName = (nameObj: Record<string, string>) => nameObj[locale] || nameObj.en || "";
  const toggleZone = (zoneId: string) => { setExpandedZone(prev => prev === zoneId ? null : zoneId); };

  return (
    <div className="pb-20">
      {/* 크로스 프로모션 팝업 */}
      {showPromo && (
        <div style={{position:"fixed",inset:0,zIndex:9999,
          background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div style={{background:"linear-gradient(135deg,#1A1A2E,#2D1B69)",
            borderRadius:24,padding:"24px 20px",maxWidth:400,width:"100%",
            border:"1.5px solid rgba(108,99,255,.5)",
            boxShadow:"0 20px 60px rgba(0,0,0,.5)",position:"relative"}}>

            <button onClick={()=>{
              setShowPromo(false);
              localStorage.setItem("cross_promo_shown", Date.now().toString());
            }} style={{position:"absolute",top:16,right:16,background:"none",
              border:"none",color:"rgba(255,255,255,.5)",fontSize:20,cursor:"pointer"}}>✕</button>

            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:32,marginBottom:8}}>🧭</div>
              <div style={{fontSize:17,fontWeight:900,color:"#A29BFE",marginBottom:6}}>
                {PROMO_TEXTS.title[locale] || PROMO_TEXTS.title.en}
              </div>
            </div>

                        {/* Korean Study */}
            <div 
              onClick={() => window.open(
                Capacitor.getPlatform() === "ios"
                  ? "https://apps.apple.com/app/korean-study-level-up/id6775454691"
                  : "https://play.google.com/store/apps/details?id=com.leewillwin.koreanstudy",
                "_blank"
              )}
              style={{borderRadius:16,padding:"14px 16px",marginBottom:10,
                background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",
                cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,flexShrink:0,
                  background:"linear-gradient(135deg,#6C63FF,#4ECDC4)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📚</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>Korean Study Level-Up</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                    {PROMO_TEXTS.studyDesc[locale] || PROMO_TEXTS.studyDesc.en}
                  </div>
                </div>
              </div>
            </div>

            {/* K-POP Korean */}
            <div 
              onClick={() => window.open(
                Capacitor.getPlatform() === "ios"
                  ? "https://apps.apple.com/app/k-pop-korean/id6816399256"
                  : "https://play.google.com/store/apps/details?id=com.kpopkorean.app",
                "_blank"
              )}
              style={{borderRadius:16,padding:"14px 16px",marginBottom:20,
              background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",
              cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,flexShrink:0,
                  background:"linear-gradient(135deg,#E84393,#FD79A8)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎵</div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2}}>K-POP Korean</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                    {PROMO_TEXTS.kpopDesc[locale] || PROMO_TEXTS.kpopDesc.en}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={()=>{
              setShowPromo(false);
              localStorage.setItem("cross_promo_shown", Date.now().toString());
            }} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",
              cursor:"pointer",background:"linear-gradient(135deg,#6C63FF,#4ECDC4)",
              color:"#fff",fontWeight:900,fontSize:15}}>
              {PROMO_TEXTS.btn[locale] || PROMO_TEXTS.btn.en}
            </button>
          </div>
        </div>
      )}
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

      {/* Footer - Legal Links */}
      <div style={{ padding: '16px', paddingBottom: '96px', textAlign: 'center', borderTop: '1px solid #e5e7eb', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a href={`/${locale}/terms`} style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}>Terms of Service</a>
          <a href={`/${locale}/privacy`} style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</a>
          <a href={`/${locale}/refund`} style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}>Refund Policy</a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
