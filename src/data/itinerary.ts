export interface ShoppingItem {
  name: string;
  items?: {
    name: string;
    url: string;
    price?: string;
    image?: string;
  }[];
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: 'transport' | 'food' | 'sight' | 'accommodation' | 'activity' | 'shopping';
  description?: string;
  location?: string; // For navigation
  koreanAddress?: string; // For taxi/asking directions
  naverMapLink?: string; // Naver Map Link
  notes?: string;
  cost?: string;
  isReservation?: boolean;
  highlight?: string[]; // "Must Eat", "Must Buy"
  menuRecommendations?: { nameCN: string; nameKR: string; imageUrl?: string; price?: string; isRecommended?: boolean }[];
  shoppingList?: (string | ShoppingItem)[];
  image?: string;
  images?: string[]; // For carousel
  ticketInfo?: {
    passenger: string;
    bookingRef: string;
    ticketNumber: string;
    flight: string;
    from: string;
    to: string;
    date: string;
    seatClass: string;
  };
  transferInfo?: {
    pickupTime: string;
    provider: string;
    contact: string;
    details: string;
  };
  airportGuide?: {
    steps: { title: string; description: string }[];
  };
  bookingInfo?: {
    bookingId: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    price: string;
    policy: string;
    contact?: string;
    address?: string;
  };
  pdfUrl?: string;
  isSeparateSection?: boolean;
  sectionTitle?: string;
}

export interface HeroImage {
  url: string;
  caption: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  weekday: string;
  heroImages?: HeroImage[];
  items: ItineraryItem[];
}

export const itineraryData: DaySchedule[] = [
  {
    day: 1,
    date: "2026-03-24",
    weekday: "週二",
    heroImages: [
      { url: "https://alinalife.tw/wp-content/uploads/2018/08/DSCF6958.jpg", caption: "明洞大聖堂" },
      { url: "https://search.pstatic.net/common/?src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA2MTJfMTUz%2FMDAxNzQ5Njk5MjM0MTg4.HFI39xkWftv3jAgPYXcNgvd5eN1suqj9JxVls8-ifqYg.Ul8jA8LFvvF_v-A7V_FZqwiFP4rX6oagiKq5cOn36FYg.JPEG%2FIMG%EF%BC%BF1326.jpg%2F900x1200", caption: "解放村" },
      { url: "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAyMjBfMTgx%2FMDAxNzcxNTgxMjUwODIz.J0aQZce4yNfFBPH7q5HNmkfP-Y8Kd6qYru6L96Bul6Mg.qc3619rJJ97MrtUzgAVLYVYfMp9C48QeHfInfKNdHBAg.JPEG%2F21380.jpg.jpg%3Ftype%3Dw1500_60_sharpen", caption: "清溪川" },
      { url: "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEyMjdfMTA1%2FMDAxNzY2ODQyMTA5NzIw.-rlz1_ai4OjX5fhYULQFyoD2KtEt8YydgJOjZfVQOLAg.jXjL9XvjlpMa8lpmAuxB39-dCx69FQ9_D20bgka2ozkg.JPEG%2F13368.jpg.jpg%3Ftype%3Dw1500_60_sharpen", caption: "明洞" }
    ],
    items: [
      {
        id: "d1-0",
        time: "04:30",
        title: "抵達機場",
        type: "transport",
        description: "機場接送預約 04:00",
        location: "Taoyuan International Airport",
        transferInfo: {
          pickupTime: "04:00",
          provider: "機場接送服務",
          contact: "司機王先生 0912-345-678",
          details: "車牌 ABC-1234，於住家樓下接送。"
        }
      },
      {
        id: "d1-1",
        time: "07:05",
        title: "起飛：桃園國際機場 Terminal 2",
        type: "transport",
        description: "長榮航空 EVA Air BR170",
        location: "Taoyuan International Airport Terminal 2",
        ticketInfo: {
          passenger: "Yeh Tzuhsuan Mrs (ADT)",
          bookingRef: "FZ7W9A",
          ticketNumber: "695 2463496841",
          flight: "BR170",
          from: "TPE Terminal 2",
          to: "ICN Terminal 1",
          date: "24Mar2026",
          seatClass: "V"
        }
      },
      {
        id: "d1-2",
        time: "10:30",
        title: "抵達：仁川國際機場 Terminal 1",
        type: "transport",
        description: "入境、領行李",
        location: "Incheon International Airport Terminal 1",
        airportGuide: {
          steps: [
            { title: "入境審查", description: "跟隨 Arrival 指標，填寫入境卡，進行護照查驗。" },
            { title: "領取行李", description: "確認航班行李轉盤號碼，領取行李。" },
            { title: "前往 AREX", description: "入境大廳位於 1F，搭乘電梯或手扶梯至 B1，跟隨 'Airport Railroad' 黃色指標前進。" }
          ]
        }
      },
      {
        id: "d1-3",
        time: "11:28",
        title: "仁川機場快線(AREX)",
        type: "transport",
        description: "搭乘直達車 仁川機場T1出發往首爾站方向。班次：11:28/12:08",
        cost: "13000 KRW",
        location: "Incheon International Airport Terminal 1 Station",
        notes: "請整理機台買票教學"
      },
      {
        id: "d1-4",
        time: "12:30",
        title: "地鐵：首爾站－市廳站 (시청역)",
        type: "transport",
        description: "深藍1號線 7號出口",
        location: "City Hall Station",
        notes: "呈現首爾地鐵路線圖"
      },
      {
        id: "d1-5",
        time: "12:40",
        title: "住宿：明洞Le Seoul Hotel",
        type: "accommodation",
        description: "先寄放行李，15:00 Check in。",
        location: "Le Seoul Hotel",
        koreanAddress: "서울 중구 남대문로1길 56",
        naverMapLink: "https://naver.me/5ncJ7z1u",
        images: [
          "https://pix8.agoda.net/hotelImages/37311268/0/29505720bfbe0fdc56172c44e62be88b.jpg?ce=0&s=1024x",
          "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/435021317.jpg?k=476b7d81aecc6ad8e2238057d26794e944636a3b7137ebb4647808c7fde4b39c&o=&s=1024x"
        ],
        bookingInfo: {
          bookingId: "1678763708",
          roomType: "Standard Double",
          checkIn: "2026-03-24 15:00",
          checkOut: "2026-03-28 11:00",
          guests: 2,
          price: "KRW 599,366",
          policy: "2026/03/23 前免費取消",
          contact: "+82 010-8514-8552",
          address: "Room 56, Le Seoul Hotel, 1-gil, Namdaemun-ro, Jung-gu, Seoul"
        },
        pdfUrl: "/le_seoul_hotel_booking.pdf", 
        notes: "HighFloor, Away from elevator"
      },
      {
        id: "d1-6",
        time: "12:50",
        title: "換錢：환전카페換錢所",
        type: "sight",
        description: "附近換錢",
        location: "Money Exchange",
        koreanAddress: "서울 중구 남대문로 52-13"
      },
      {
        id: "d1-7",
        time: "13:30",
        title: "午餐：白玉豬肉湯飯 (백옥 명동)",
        type: "food",
        description: "明洞必吃豬肉湯飯",
        location: "Baekok Myeongdong",
        koreanAddress: "서울 중구 명동8길 8-23 지하1층, 1층",
        naverMapLink: "https://naver.me/5pwzFlUw",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "豬肉湯飯", nameKR: "돼지곰탕", price: "11,000 KRW" },
          { nameCN: "白菜餃子(4個)", nameKR: "배추만두 4pc", price: "8,000 KRW" },
          { nameCN: "冷切肉", nameKR: "냉제육", price: "10,000 KRW" }
        ]
      },
      {
        id: "d1-8",
        time: "14:30",
        title: "行程：明洞大聖堂 (명동대성당)",
        type: "sight",
        location: "Myeongdong Cathedral",
        koreanAddress: "서울 중구 명동길 74"
      },
      {
        id: "d1-9",
        time: "15:00",
        title: "公車",
        type: "transport",
        description: "公車405：樂天百貨站 (롯데백화점) > 寶城女子中學高中入口 (보성여중고입구)",
        location: "Lotte Department Store Main Branch",
        naverMapLink: "https://bus.go.kr/app/#"
      },
      {
        id: "d1-10",
        time: "15:30",
        title: "行程：解放村 (해방촌)",
        type: "sight",
        location: "Haebangchon",
        koreanAddress: "서울 용산구 신흥로 95-9 2층",
        images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA2MTJfMTUz%2FMDAxNzQ5Njk5MjM0MTg4.HFI39xkWftv3jAgPYXcNgvd5eN1suqj9JxVls8-ifqYg.Ul8jA8LFvvF_v-A7V_FZqwiFP4rX6oagiKq5cOn36FYg.JPEG%2FIMG%EF%BC%BF1326.jpg%2F900x1200"]
      },
      {
        id: "d1-11",
        time: "16:30",
        title: "下午茶：oeat咖啡廳(오잇)",
        type: "food",
        location: "Oeat",
        koreanAddress: "서울 용산구 신흥로 95",
        naverMapLink: "https://naver.me/Gq846rr8",
        highlight: ["景觀咖啡"],
        menuRecommendations: [
          { 
            nameCN: "可朗芙", 
            nameKR: "크로플", 
            price: "16,000 KRW"
          },
          { nameCN: "冰美式", nameKR: "아이스 아메리카노" },
          { nameCN: "巴斯克蛋糕", nameKR: "바스크 치즈 케이크" },
          { nameCN: "拿鐵", nameKR: "카페 라떼" }
        ]
      },
      {
        id: "d1-12",
        time: "17:30",
        title: "公車",
        type: "transport",
        description: "公車143：龍岩小學入口 (용암초등학교입구) -> 鐘路2街 (종로2가)",
        naverMapLink: "https://bus.go.kr/app/#"
      },
      {
        id: "d1-13",
        time: "19:00",
        title: "晚餐：延南豬腳 1987 (연남족발 1987)",
        type: "food",
        description: "鐘閣店 (종각점)",
        location: "Yeonnam Jokbal 1987 Jonggak",
        koreanAddress: "서울 종로구 삼일대로15길 26 1층",
        naverMapLink: "https://naver.me/5R45gjI1",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "炸豬腳套餐", nameKR: "족발튀김 한상", price: "49,000 KRW", isRecommended: true },
          { nameCN: "半半豬腳", nameKR: "반반족발" },
          { nameCN: "拳頭飯", nameKR: "주먹밥" },
          { nameCN: "生菜包肉", nameKR: "보쌈" }
        ]
      },
      {
        id: "d1-14",
        time: "20:30",
        title: "行程：清溪川 (청계천)",
        type: "sight",
        location: "Cheonggyecheon",
        koreanAddress: "서울 중구 태평로1가 1",
        images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAyMjBfMTgx%2FMDAxNzcxNTgxMjUwODIz.J0aQZce4yNfFBPH7q5HNmkfP-Y8Kd6qYru6L96Bul6Mg.qc3619rJJ97MrtUzgAVLYVYfMp9C48QeHfInfKNdHBAg.JPEG%2F21380.jpg.jpg%3Ftype%3Dw1500_60_sharpen"]
      },
      {
        id: "d1-15",
        time: "21:30",
        title: "行程：明洞逛街",
        type: "shopping",
        location: "Myeongdong Shopping Street",
        koreanAddress: "서울 중구 명동",
        images: ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEyMjdfMTA1%2FMDAxNzY2ODQyMTA5NzIw.-rlz1_ai4OjX5fhYULQFyoD2KtEt8YydgJOjZfVQOLAg.jXjL9XvjlpMa8lpmAuxB39-dCx69FQ9_D20bgka2ozkg.JPEG%2F13368.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        shoppingList: [
          {
            name: "Olive Young",
            items: [
              {
                name: "MEDIHEAL Toner Pad 100+100 Pads Double Pack",
                url: "https://global.oliveyoung.com/product/detail?prdtNo=GA220815950",
                image: "https://cdn-image.oliveyoung.com/prdtImg/1447/a9d9f616-1d1b-4596-83b6-e3cdad4f9892.png?RS=1500x1500&AR=0&SF=webp&QT=80"
              },
              {
                name: "SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum",
                url: "https://global.oliveyoung.com/product/detail?prdtNo=GA230518746",
                image: "https://cdn-image.oliveyoung.com/prdtImg/1595/6290bfe2-63de-4724-9e18-b27eb424964e.jpg?RS=1500x1500&AR=0&SF=webp&QT=80"
              },
              {
                name: "CLIO Kill Cover Founwear Cushion (+Refill)",
                url: "https://global.oliveyoung.com/product/detail?prdtNo=GA250832751",
                image: "https://cdn-image.oliveyoung.com/prdtImg/1234/cd4f4a36-5edc-40d9-b97f-b291abff368f.png?RS=1500x1500&AR=0&SF=webp&QT=80"
              },
              {
                name: "ongredients Skin Barrier Calming Large Size Set",
                url: "https://global.oliveyoung.com/product/detail?prdtNo=GA250631392",
                image: "https://cdn-image.oliveyoung.com/prdtImg/1200/9ca6a20e-ba3a-47e0-9145-8617563f15d1.png?RS=1500x1500&AR=0&SF=webp&QT=80"
              },
              {
                name: "Abib Mild Acidic pH Sheet Mask (10 sheet)",
                url: "https://global.oliveyoung.com/product/detail?prdtNo=GA210001052&dataSource=search_result",
                image: "https://cdn-image.oliveyoung.com/prdtImg/1733/8459ffbe-aa55-406e-b16a-3b99046975ec.jpg?RS=1500x1500&AR=0&SF=webp&QT=80"
              }
            ]
          },
          "juuneedu",
          "Berry New",
          "Ready Young",
          "nyunyu",
          "Mimiline",
          "daiso",
          "Musinsa Standard"
        ]
      }
    ]
  },
  {
    day: 2,
    date: "2026-03-25",
    weekday: "週三",
    heroImages: [
      { url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepHgN9SrEfT60r2JUe3fgWGvwffQ8fsXx9h_Od-sBq77s2RV-HfMhVmZohg7Au0lxz7bkhTf-iTuYBzIAVZAFECDktCwVHpoHyxQ3YaWsDGrA_lnVZafLa_5Sl1II7EGYYKxerc=w1024", caption: "安國站" },
      { url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqjBwem5sCFJxddihjifFAnJBcyPPyj33TE1St0EHYIZ1p1vGSAlzpDllKIhIL0xXYlj8Xb7VZ0BOxUINCftK0ncAfeMrD5JwFdgTFNqWpN4aCR9irUPNBJUZgitbzTDR-9TIucfg=w1024", caption: "北村韓屋" },
      { url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq8--uvof6qrhgiW22jFV-b5KbSXcUmsV8CnBKYCNyMlsx9z9MHhWO7XGMSoYDB7KVkvPPgbce2VCAPHWSPkWpMf4JCzGTaOwXgz0KOd0CYG11VaOAPKeoMDeXb5oxzYxt0ayz5=w1024", caption: "西巡邏街" }
    ],
    items: [
      {
        id: "d2-0",
        time: "09:30",
        title: "出發",
        type: "transport",
        description: "準備出發"
      },
      {
        id: "d2-1",
        time: "10:00",
        title: "地鐵：市廳站 (시청역) -> 安國站 (안국역)",
        type: "transport",
        description: "深藍1號線-鐘路三街轉-橘色3號線",
        location: "Anguk Station"
      },
      {
        id: "d2-2",
        time: "10:00",
        title: "先去無垢屋抽號碼牌",
        type: "activity",
        description: "先去抽號碼牌！",
        location: "Mugiro",
        koreanAddress: "서울 종로구 율곡로1길 7",
        highlight: ["重要攻略"]
      },
      {
        id: "d2-3",
        time: "10:30",
        title: "早餐：Artist Bakery (아티스트베이커리 안국)",
        type: "food",
        location: "Artist Bakery",
        koreanAddress: "서울 종로구 율곡로 45 1층",
        naverMapLink: "https://naver.me/5UEc0uzr",
        highlight: ["人氣麵包"],
        menuRecommendations: [
          { nameCN: "鹽麵包", nameKR: "소금빵" },
          { nameCN: "法棍", nameKR: "바게트" }
        ]
      },
      {
        id: "d2-4",
        time: "11:30",
        title: "午餐：無垢屋 人蔘雞湯 (무구옥)",
        type: "food",
        description: "營業時間：11:30–14:00/17:30–20:00",
        location: "Mugiro",
        koreanAddress: "서울 종로구 율곡로1길 7 지상1층",
        naverMapLink: "https://naver.me/5vcHnm5u",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "北韓式蔘雞湯定食", nameKR: "이북식 삼계백반", price: "18,000 KRW", isRecommended: true }
        ]
      },
      {
        id: "d2-5",
        time: "13:00",
        title: "行程：安國站逛街",
        type: "sight",
        location: "Anguk Station",
        images: ["https://lh3.googleusercontent.com/gps-cs-s/AHVAwepHgN9SrEfT60r2JUe3fgWGvwffQ8fsXx9h_Od-sBq77s2RV-HfMhVmZohg7Au0lxz7bkhTf-iTuYBzIAVZAFECDktCwVHpoHyxQ3YaWsDGrA_lnVZafLa_5Sl1II7EGYYKxerc=w1024"],
        shoppingList: [
          "GRANHAND",
          "TOUT Y EST",
          "Verish Anguk"
        ]
      },
      {
        id: "d2-6",
        time: "15:00",
        title: "行程：北村韓屋 (북촌한옥마을)",
        type: "sight",
        location: "Bukchon Hanok Village",
        koreanAddress: "서울 종로구 계동길 37",
        images: ["https://lh3.googleusercontent.com/gps-cs-s/AHVAweqjBwem5sCFJxddihjifFAnJBcyPPyj33TE1St0EHYIZ1p1vGSAlzpDllKIhIL0xXYlj8Xb7VZ0BOxUINCftK0ncAfeMrD5JwFdgTFNqWpN4aCR9irUPNBJUZgitbzTDR-9TIucfg=w1024"]
      },
      {
        id: "d2-7",
        time: "16:00",
        title: "點心：北村糖餅 (북촌호떡)",
        type: "food",
        location: "Bukchon Hotteok",
        koreanAddress: "서울 종로구 북촌로5가길 38",
        naverMapLink: "https://naver.me/x9BAsVBg",
        highlight: ["必吃點心"],
        menuRecommendations: [
          { nameCN: "糖餅", nameKR: "호떡" }
        ]
      },
      {
        id: "d2-8",
        time: "17:00",
        title: "行程：西巡邏街 & 益善洞韓屋村",
        type: "sight",
        location: "Ikseon-dong Hanok Village",
        koreanAddress: "서울 종로구 익선동",
        images: ["https://lh3.googleusercontent.com/gps-cs-s/AHVAweq8--uvof6qrhgiW22jFV-b5KbSXcUmsV8CnBKYCNyMlsx9z9MHhWO7XGMSoYDB7KVkvPPgbce2VCAPHWSPkWpMf4JCzGTaOwXgz0KOd0CYG11VaOAPKeoMDeXb5oxzYxt0ayz5=w1024"]
      },
      {
        id: "d2-9",
        time: "18:00",
        title: "晚餐：南道粉食 益善店 (남도분식 익선점)",
        type: "food",
        description: "韓式小吃辣炒年糕",
        location: "Namdo Bunsik Ikseon",
        koreanAddress: "서울 종로구 수표로28길 33",
        naverMapLink: "https://naver.me/xa5RZUOP",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "玫瑰醬辣炒年糕", nameKR: "로제 떡볶이", price: "19,000 KRW", isRecommended: true },
          { nameCN: "生菜炸物", nameKR: "상추튀김", price: "10,000 KRW", isRecommended: true }
        ]
      },
      {
        id: "d2-10",
        time: "20:00",
        title: "宵夜：鐘路三街布帳馬車",
        type: "food",
        description: "體驗韓國路邊攤文化",
        location: "Jongno 3-ga Station",
        koreanAddress: "서울 종로구 종로3가역"
      }
    ]
  },
  {
    day: 3,
    date: "2026-03-26",
    weekday: "週四",
    heroImages: [
      { url: "https://travel-tw.line-scdn.net/r/travel/content/21a700b4-a024-4e20-b8f1-ab50ef41b15bt1365c12f", caption: "聖水洞" },
      { url: "https://lh5.googleusercontent.com/proxy/2OS7e3Ir3G9ZlhIg5cBK9YxY1IJLeyelBqMG6a1ZZvqh53SzUev0iE-mxJSzE8dS-EzomjSE7h0blK95yRibFA73CzHCi1qlXWJKRQ", caption: "首爾林" },
      { url: "https://www.bring-you.info/imgs/2019/01/dongdaemun-3-900x600.jpg", caption: "東大門" }
    ],
    items: [
      {
        id: "d3-0",
        time: "10:30",
        title: "出發",
        type: "transport",
        description: "準備出發"
      },
      {
        id: "d3-1",
        time: "10:30",
        title: "地鐵：市廳站 (시청역) -> 聖水站 (성수역)",
        type: "transport",
        description: "綠色2號線",
        location: "Seongsu Station"
      },
      {
        id: "d3-2",
        time: "11:00",
        title: "午餐：陵洞水芹菜 (능동미나리)",
        type: "food",
        description: "水芹菜牛肉湯。營業時間：09:30–00:00",
        location: "Neungdong Minari",
        koreanAddress: "서울 성동구 연무장길 42",
        naverMapLink: "https://naver.me/5iTdPV9Z",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "水芹菜牛肉湯", nameKR: "능동미나리곰탕", price: "15,000 KRW" },
          { nameCN: "水芹菜牛肉餅(半份)", nameKR: "능동육전 반접시", price: "13,000 KRW" },
          { nameCN: "水芹菜生拌牛肉拌飯", nameKR: "능동육회비빔밥", price: "15,000 KRW" }
        ]
      },
      {
        id: "d3-3",
        time: "12:00",
        title: "行程：聖水洞逛街",
        type: "shopping",
        location: "Seongsu-dong Cafe Street",
        koreanAddress: "서울 성동구 성수동",
        images: ["https://travel-tw.line-scdn.net/r/travel/content/21a700b4-a024-4e20-b8f1-ab50ef41b15bt1365c12f"],
        shoppingList: [
          "KHIHO SEONGSU STORE",
          "Beidelli 女裝",
          "NYU NYU Girls",
          "Musinsa Standard",
          "SUARE 男裝",
          "hetras seongsu",
          "INDIBRAND 女裝",
          "pureda女裝",
          "대발견Socks&legwear",
          "consume product女裝",
          "29cm.home家飾/燈"
        ]
      },
      {
        id: "d3-4",
        time: "14:00",
        title: "下午茶：etre bakehouse 鹽麵包",
        type: "food",
        location: "Etre Bakehouse",
        koreanAddress: "서울 성동구 연무장길 37-5 1, 2층",
        naverMapLink: "https://naver.me/GG7tTnpx",
        highlight: ["必點菜單"],
        menuRecommendations: [
          { nameCN: "鹽麵包", nameKR: "소금빵" }
        ]
      },
      {
        id: "d3-5",
        time: "14:00",
        title: "咖啡：LowKey Seongsu (로우키 성수)",
        type: "food",
        location: "LowKey Seongsu",
        koreanAddress: "서울 성동구 연무장3길 6 1층, B1층",
        naverMapLink: "https://naver.me/5N15kFIf",
        menuRecommendations: [
          { nameCN: "香草拿鐵", nameKR: "바닐라라떼", price: "7,000 KRW" },
          { nameCN: "焦糖奶油拿鐵", nameKR: "카라멜크림라떼", price: "7,800 KRW" }
        ]
      },
      {
        id: "d3-6",
        time: "14:30",
        title: "行程：首爾林野餐 (서울숲)",
        type: "activity",
        location: "Seoul Forest",
        koreanAddress: "서울 성동구 뚝섬로 273",
        images: ["https://lh5.googleusercontent.com/proxy/2OS7e3Ir3G9ZlhIg5cBK9YxY1IJLeyelBqMG6a1ZZvqh53SzUev0iE-mxJSzE8dS-EzomjSE7h0blK95yRibFA73CzHCi1qlXWJKRQ"]
      },
      {
        id: "d3-7",
        time: "16:00",
        title: "行程：首爾林逛街",
        type: "shopping",
        location: "Seoul Forest",
        shoppingList: [
          "aeyiostudio 品牌配件店",
          "Juuneedu Showroom 睡衣",
          "Bite me寵物用品",
          "ENUFF 純銀飾品",
          "KWANGYA偶像周邊",
          "somewhere butter.服飾",
          "*Archivépke"
        ]
      },
      {
        id: "d3-8",
        time: "19:00",
        title: "晚餐：陳玉華一隻雞 (진옥화할매원조닭한마리)",
        type: "food",
        description: "營業時間：10:30–01:00",
        location: "Jinokhwa Halmae Wonjo Dakhanmari",
        koreanAddress: "서울 종로구 종로40가길 18",
        naverMapLink: "https://naver.me/xQe2wLdj",
        images: ["https://www.bring-you.info/imgs/2019/01/dongdaemun-3-900x600.jpg"],
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "一隻雞", nameKR: "닭한마리", price: "33,000 KRW" },
          { nameCN: "麵條", nameKR: "국수사리", price: "2,000 KRW" }
        ]
      },
      {
        id: "d3-9",
        time: "21:00",
        title: "宵夜：乙支餃子 (을지교자) / 鳥屎豆沙包",
        type: "food",
        description: "營業時間：10:00–00:00",
        location: "Eulji Gyoza",
        koreanAddress: "서울 중구 장충단로13길 7 1층",
        naverMapLink: "https://naver.me/IgJC0bG9",
        menuRecommendations: [
          { nameCN: "豆沙包(3個)", nameKR: "찐빵 3개", price: "6,000 KRW" }
        ]
      },
      {
        id: "d3-10",
        time: "21:30",
        title: "行程：樂天超市 (Lotte Mart)",
        type: "shopping",
        description: "營業時間：10:00–00:00",
        location: "Lotte Mart Seoul Station",
        koreanAddress: "서울 중구 한강대로 405 , 2층",
        naverMapLink: "https://naver.me/FfeOlQjt",
        highlight: ["必買伴手禮"]
      }
    ]
  },
  {
    day: 4,
    date: "2026-03-27",
    weekday: "週五",
    heroImages: [
      { url: "https://tong.visitkorea.or.kr/cms/resource/10/2780610_image2_1.png", caption: "水聲洞" },
      { url: "https://tong.visitkorea.or.kr/cms/resource_etc/76/3113276_image2_1.jpg", caption: "西村" },
      { url: "https://blog-static.kkday.com/zh-tw/blog/wp-content/uploads/2022/09/Korea_Seoul_N-Seoul-Tower_Ashutterstock_779041270.jpg", caption: "南山纜車" }
    ],
    items: [
      {
        id: "d4-0",
        time: "10:50",
        title: "出發",
        type: "transport",
        description: "準備出發"
      },
      {
        id: "d4-1",
        time: "11:00",
        title: "午餐：朝朝刀削麵 (조조칼국수)",
        type: "food",
        description: "營業時間：10:00–21:30",
        location: "Jojo Kalguksu",
        koreanAddress: "서울 중구 세종대로11길 27",
        naverMapLink: "https://naver.me/xs3GFNuL",
        highlight: ["必吃美食"],
        menuRecommendations: [
          { nameCN: "同竹蛤蜊刀削麵", nameKR: "동죽칼국수", price: "10,000 KRW" },
          { nameCN: "章魚海鮮煎餅", nameKR: "낙지해물파전", price: "15,000 KRW" },
          { nameCN: "同竹蛤蜊湯", nameKR: "물총조개탕", price: "12,000 KRW" }
        ]
      },
      {
        id: "d4-2",
        time: "12:00",
        title: "公車：鐘路09 (종로09)",
        type: "transport",
        description: "三星大樓前 (삼성본관앞) -> 水聲洞溪谷 (수성동계곡)"
      },
      {
        id: "d4-3",
        time: "13:00",
        title: "行程：水聲洞溪谷 (수성동계곡)",
        type: "sight",
        location: "Suseong-dong Valley",
        koreanAddress: "서울 종로구 옥인동 185-3",
        images: ["https://tong.visitkorea.or.kr/cms/resource/10/2780610_image2_1.png"]
      },
      {
        id: "d4-4",
        time: "14:00",
        title: "下午茶：HIVER (하이버)",
        type: "food",
        location: "HIVER Seochon",
        koreanAddress: "서울 종로구 옥인6길 2 1F",
        naverMapLink: "https://naver.me/5dudL6Iv",
        menuRecommendations: [
          { nameCN: "仁王山司康(4種)", nameKR: "인왕산 스콘 4종", price: "3,900 KRW" }
        ]
      },
      {
        id: "d4-5",
        time: "15:00",
        title: "行程：西村探索",
        type: "sight",
        description: "弼雲洞 洪建翊家屋、青瓦台文藝館、保安旅館、Ground Seesaw展覽",
        location: "Seochon Village",
        koreanAddress: "서울 종로구 필운대로",
        images: ["https://tong.visitkorea.or.kr/cms/resource_etc/76/3113276_image2_1.jpg"],
        notes: "洪建翊家屋: https://naver.me/x0UEt1xe, 青瓦台文藝館: https://naver.me/xY4sobj8, 保安旅館: https://naver.me/53lKU0do, Ground Seesaw: https://naver.me/GEXhmVi6",
        shoppingList: [
          "0fr. Séoul 書店",
          "모노하 서촌 (MONOHA Seochon) 女裝"
        ]
      },
      {
        id: "d4-6",
        time: "17:00",
        title: "地鐵：景福宮站 -> 乙支路三街",
        type: "transport",
        description: "橘色3號線"
      },
      {
        id: "d4-7",
        time: "17:00",
        title: "晚餐：山清炭火花園 乙支路2號店 (산청숯불가든)",
        type: "food",
        description: "營業時間：11:30–23:00。需訂位！押金Ｗ20000",
        location: "Sancheong Charcoal Garden",
        koreanAddress: "서울 중구 을지로14길 12 별관 2층",
        naverMapLink: "https://naver.me/5chuomKS",
        isReservation: true,
        highlight: ["重要預約代號", "必吃美食"],
        menuRecommendations: [
          { nameCN: "傳統鹽烤黑豬肉", nameKR: "재래식 소금구이", price: "59,000 KRW" }
        ]
      },
      {
        id: "d4-8",
        time: "20:00",
        title: "行程：南山纜車 & N首爾塔",
        type: "sight",
        description: "搭乘纜車前往南山塔",
        location: "N Seoul Tower",
        koreanAddress: "서울 용산구 남산공원길 105",
        naverMapLink: "https://naver.me/xGIPHFHB",
        images: ["https://blog-static.kkday.com/zh-tw/blog/wp-content/uploads/2022/09/Korea_Seoul_N-Seoul-Tower_Ashutterstock_779041270.jpg"],
        notes: "纜車: https://naver.me/FZ27W9Px"
      }
    ]
  },
  {
    day: 5,
    date: "2026-03-28",
    weekday: "週六",
    heroImages: [
      { url: "https://rainieis.tw/wp-content/uploads/2024/03/DSC01908.jpg", caption: "延南洞" },
      { url: "https://tchinese.seoul.go.kr/wp-content/uploads/2020/08/mangwon-market-4.jpg", caption: "望遠市場" },
      { url: "https://tchinese.seoul.go.kr/wp-content/uploads/2017/09/Mangwon_dong_1.jpg", caption: "望遠洞" }
    ],
    items: [
      {
        id: "d5-0",
        time: "11:00",
        title: "出發",
        type: "transport",
        description: "準備出發"
      },
      {
        id: "d5-1",
        time: "11:00",
        title: "地鐵：市廳站 (시청역) -> 弘大站 (홍대입구)",
        type: "transport",
        description: "綠色2號線。弘大站寄放行李。",
        location: "Hongik University Station"
      },
      {
        id: "d5-2",
        time: "11:30",
        title: "午餐：風川鰻魚 延南店 (풍천장어 연남점)",
        type: "food",
        description: "營業時間：11:30–15:30/16:30–22:20。已訂位確認中。",
        location: "Pungcheon Eel Yeonnam",
        koreanAddress: "서울 마포구 동교로27길 39 1층",
        naverMapLink: "https://naver.me/FBe2dOpb",
        isReservation: true,
        menuRecommendations: [
          { nameCN: "烤鰻魚(2隻)", nameKR: "장어 2마리", price: "74,000 KRW" }
        ]
      },
      {
        id: "d5-3",
        time: "13:00",
        title: "行程：望遠洞 (망원동)",
        type: "sight",
        location: "Mangwon Market",
        koreanAddress: "서울 마포구 망원동",
        images: ["https://tchinese.seoul.go.kr/wp-content/uploads/2020/08/mangwon-market-4.jpg", "https://tchinese.seoul.go.kr/wp-content/uploads/2017/09/Mangwon_dong_1.jpg"],
        shoppingList: [
          "Warmgreytail 可愛毛巾店",
          "Viva Salon玩具小店",
          "oFong 飾品小店"
        ]
      },
      {
        id: "d5-8",
        time: "14:00",
        title: "住宿：Dream House (드림하우스)",
        type: "accommodation",
        description: "Check in: 14:00",
        location: "Dream House",
        koreanAddress: "서울 마포구 잔다리로 78",
        naverMapLink: "https://naver.me/5UEKKlyq",
        images: [
          "https://pix8.agoda.net/property/37407728/1255392406/c44c6a95bfb0df2d22a528dd509a7c15.jpeg?ce=2&s=1024x"
        ],
        bookingInfo: {
          bookingId: "1689219615",
          roomType: "Double Room",
          checkIn: "2026-03-28 14:00",
          checkOut: "2026-03-29 11:00",
          guests: 1,
          price: "KRW 112,183",
          policy: "免費取消期限：2026/03/21",
          address: "78, Jandari-ro, Mapo-gu, Seoul"
        }
      },
      {
        id: "d5-4",
        time: "14:30",
        title: "點心：勳勳糖餅 (훈훈호떡)",
        type: "food",
        description: "營業時間：11:00–20:30",
        location: "Hoonhoon Hotteok",
        koreanAddress: "서울 마포구 포은로6길 25 지하1층",
        naverMapLink: "https://naver.me/F74V29Yu",
        highlight: ["必吃點心"],
        menuRecommendations: [
          { nameCN: "糖餅", nameKR: "호떡" }
        ]
      },
      {
        id: "d5-new-1",
        time: "16:00",
        title: "行程：延南洞逛街",
        type: "shopping",
        location: "Yeonnam-dong",
        images: ["https://rainieis.tw/wp-content/uploads/2024/03/DSC01908.jpg"],
        shoppingList: [
          "mill and moi 밀앤모이狗狗文創店",
          "VISUAL AID 女裝",
          "Made by 文創小物店"
        ]
      },
      {
        id: "d5-new-2",
        time: "17:00",
        title: "點心：JO & DAWSON法式吐司 (조앤도슨 연남본점)",
        type: "food",
        description: "營業時間：10:00–20:00",
        location: "JO & DAWSON Yeonnam",
        koreanAddress: "서울 마포구 동교로41길 31 지층 좌측, 조앤도슨",
        naverMapLink: "https://naver.me/FcmA3eDy",
        menuRecommendations: [
          { nameCN: "經典法式吐司", nameKR: "Classic French Toast", price: "10,000 KRW" },
          { nameCN: "奶茶", nameKR: "Milktea", price: "7,000 KRW" }
        ]
      },
      {
        id: "d5-new-3",
        time: "19:00",
        title: "行程：女人街逛街",
        type: "shopping",
        location: "Ewha Womans University Shopping Street",
        shoppingList: [
          "lune 女裝",
          "Market a 女裝",
          "I am Joy 女裝",
          "LOOF 女裝",
          "Aver Haus 女裝",
          "Revoir Custom Brush 刷具店"
        ]
      },

      {
        id: "d5-5",
        time: "16:00",
        title: "地鐵：弘大站 -> 仁川機場 一航",
        type: "transport",
        description: "淺藍 空港線 車程：70m",
        isSeparateSection: true,
        sectionTitle: "HUSBAND'S FLIGHT"
      },
      {
        id: "d5-6",
        time: "17:15",
        title: "老公到機場：仁川國際機場 Terminal 1",
        type: "transport",
        description: "接機"
      },
      {
        id: "d5-7",
        time: "19:45",
        title: "老公班機起飛",
        type: "transport",
        description: "仁川國際機場 Terminal 1"
      }
    ]
  },
  {
    day: 6,
    date: "2026-03-29",
    weekday: "週日",
    heroImages: [
      { url: "https://rainieis.tw/wp-content/uploads/DSC02019.jpg", caption: "弘大商圈" }
    ],
    items: [
      {
        id: "d6-0",
        time: "09:40",
        title: "出發",
        type: "transport",
        description: "準備出發"
      },
      {
        id: "d6-1",
        time: "10:00",
        title: "醫美：Day beau (데이뷰의원 홍대점)",
        type: "activity",
        description: "已預約",
        location: "Day beau",
        koreanAddress: "서울 마포구 양화로 165 상진빌딩 4층",
        naverMapLink: "https://naver.me/5VmQhRpy",
        isReservation: true
      },
      {
        id: "d6-2",
        time: "11:30",
        title: "午餐：Hotel De GGOODD (오뗄드꾸뜨)",
        type: "food",
        description: "營業時間：11:00–20:00",
        location: "Hotel De GGOODD",
        koreanAddress: "서울 마포구 동교로46길 7 101호 1.5층",
        naverMapLink: "https://naver.me/Fr7p5RtM",
        menuRecommendations: [
          { nameCN: "早午餐", nameKR: "브런치" }
        ]
      },
      {
        id: "d6-3",
        time: "13:00",
        title: "行程：弘大最後買東西",
        type: "shopping",
        location: "Hongdae Shopping Street",
        images: ["https://rainieis.tw/wp-content/uploads/DSC02019.jpg"]
      },
      {
        id: "d6-4",
        time: "15:20",
        title: "住宿拿行李",
        type: "activity",
        location: "Dream House"
      },
      {
        id: "d6-5",
        time: "15:50",
        title: "地鐵：弘大站 -> 仁川機場 一航",
        type: "transport",
        description: "前往機場"
      },
      {
        id: "d6-6",
        time: "16:45",
        title: "抵達：仁川國際機場 Terminal 1",
        type: "transport",
        description: "辦理登機手續"
      },
      {
        id: "d6-7",
        time: "19:45",
        title: "起飛：仁川國際機場 Terminal 1",
        type: "transport",
        description: "長榮航空 EVA Air BR159",
        ticketInfo: {
          passenger: "Yeh Tzuhsuan Mrs (ADT)",
          bookingRef: "FZ7W9A",
          ticketNumber: "695 2463496841",
          flight: "BR159",
          from: "ICN Terminal 1",
          to: "TPE Terminal 2",
          date: "29Mar2026",
          seatClass: "V"
        }
      },
      {
        id: "d6-8",
        time: "21:25",
        title: "抵達：桃園國際機場 Terminal 2",
        type: "transport",
        description: "平安回家"
      }
    ]
  }
];
