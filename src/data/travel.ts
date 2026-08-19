export type TravelVisit = {
  date: string
  photos: string[]
}

export type TravelPlace = {
  id: string
  name: string
  country: string
  /** City-level marker, or China province / municipality (interactive) */
  kind: 'city' | 'province'
  lat: number
  lng: number
  visits: TravelVisit[]
  /** Path to real admin boundary GeoJSON (China provinces) */
  geojsonUrl?: string
}

/**
 * Non-interactive admin fills (state / nation / prefecture).
 * Shown as teal outlines under city markers; hover only works on cities.
 */
export type TravelRegion = {
  id: string
  name: string
  geojsonUrl: string
}

export const travelRegions: TravelRegion[] = [
  {
    id: 'california',
    name: 'California',
    geojsonUrl: '/data/travel/california.geojson',
  },
  {
    id: 'england',
    name: 'England',
    geojsonUrl: '/data/travel/england.geojson',
  },
  {
    id: 'aichi',
    name: 'Aichi',
    geojsonUrl: '/data/travel/aichi.geojson',
  },
  {
    id: 'osaka',
    name: 'Osaka',
    geojsonUrl: '/data/travel/osaka.geojson',
  },
  // Mt Fuji straddles these two prefectures (non-interactive fills).
  {
    id: 'shizuoka',
    name: 'Shizuoka',
    geojsonUrl: '/data/travel/shizuoka.geojson',
  },
  {
    id: 'yamanashi',
    name: 'Yamanashi',
    geojsonUrl: '/data/travel/yamanashi.geojson',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    geojsonUrl: '/data/travel/tokyo.geojson',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    geojsonUrl: '/data/travel/kyoto.geojson',
  },
  {
    id: 'kanagawa',
    name: 'Kanagawa',
    geojsonUrl: '/data/travel/kanagawa.geojson',
  },
  {
    id: 'nara',
    name: 'Nara',
    geojsonUrl: '/data/travel/nara.geojson',
  },
]

/**
 * Merged footprints:
 * - China → province / municipality level (interactive fills)
 * - USA / UK / Japan → city markers; broader admin fills live in travelRegions
 */
export const travelPlaces: TravelPlace[] = [
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'China',
    kind: 'province',
    lat: 31.2304,
    lng: 121.4737,
    geojsonUrl: '/data/travel/shanghai.geojson',
    visits: [
      { date: '2026-06', photos: ['/images/travel/china-shanghai-202606.jpg'] },
    ],
  },
  {
    id: 'henan',
    name: 'Henan',
    country: 'China',
    kind: 'province',
    lat: 34.7657,
    lng: 113.7536,
    geojsonUrl: '/data/travel/henan.geojson',
    visits: [
      { date: '2026-07', photos: ['/images/travel/china-henan-202607.jpg'] },
    ],
  },
  {
    id: 'shaanxi',
    name: 'Shaanxi',
    country: 'China',
    kind: 'province',
    lat: 34.2655,
    lng: 108.9508,
    geojsonUrl: '/data/travel/shaanxi.geojson',
    visits: [
      { date: '2026-07', photos: ['/images/travel/china-shaanxi-202607.jpg'] },
    ],
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'China',
    kind: 'province',
    lat: 39.9042,
    lng: 116.4074,
    geojsonUrl: '/data/travel/beijing.geojson',
    visits: [
      { date: '2023-07', photos: ['/images/travel/china-beijing-202307.jpg'] },
    ],
  },
  {
    id: 'fujian',
    name: 'Fujian',
    country: 'China',
    kind: 'province',
    lat: 26.0745,
    lng: 119.2965,
    geojsonUrl: '/data/travel/fujian.geojson',
    visits: [
      { date: '2024-07', photos: ['/images/travel/china-fujian-202407.jpg'] },
    ],
  },
  {
    id: 'guangdong',
    name: 'Guangdong',
    country: 'China',
    kind: 'province',
    lat: 23.1291,
    lng: 113.2644,
    geojsonUrl: '/data/travel/guangdong.geojson',
    visits: [
      { date: '2024-08', photos: ['/images/travel/china-guangdong-202408.jpg'] },
    ],
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'China',
    kind: 'province',
    lat: 22.3193,
    lng: 114.1694,
    geojsonUrl: '/data/travel/hongkong.geojson',
    visits: [
      { date: '2025-02', photos: ['/images/travel/china-hong-kong-202502.jpg'] },
    ],
  },
  {
    id: 'hubei',
    name: 'Hubei',
    country: 'China',
    kind: 'province',
    lat: 30.5928,
    lng: 114.3055,
    geojsonUrl: '/data/travel/hubei.geojson',
    visits: [
      { date: '2024-07', photos: ['/images/travel/china-hubei-202407.jpg'] },
    ],
  },
  {
    id: 'hunan',
    name: 'Hunan',
    country: 'China',
    kind: 'province',
    lat: 28.2282,
    lng: 112.9388,
    geojsonUrl: '/data/travel/hunan.geojson',
    visits: [
      { date: '2024-07', photos: ['/images/travel/china-hunan-202407.jpg'] },
    ],
  },
  {
    id: 'anhui',
    name: 'Anhui',
    country: 'China',
    kind: 'province',
    lat: 31.8206,
    lng: 117.2272,
    geojsonUrl: '/data/travel/anhui.geojson',
    visits: [
      { date: '2024-11', photos: ['/images/travel/china-anhui-202411.jpg'] },
    ],
  },
  {
    id: 'jiangsu',
    name: 'Jiangsu',
    country: 'China',
    kind: 'province',
    lat: 32.0603,
    lng: 118.7969,
    geojsonUrl: '/data/travel/jiangsu.geojson',
    visits: [
      { date: '2025-10', photos: ['/images/travel/china-jiangsu-202510.jpg'] },
    ],
  },
  {
    id: 'zhejiang',
    name: 'Zhejiang',
    country: 'China',
    kind: 'province',
    lat: 30.2741,
    lng: 120.1551,
    geojsonUrl: '/data/travel/zhejiang.geojson',
    visits: [
      { date: '2025-04', photos: ['/images/travel/china-zhejiang-202504.jpg'] },
    ],
  },
  {
    id: 'nagoya',
    name: 'Nagoya',
    country: 'Japan',
    kind: 'city',
    lat: 35.1815,
    lng: 136.9066,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-nagoya-201907.jpg'] },
    ],
  },
  {
    id: 'osaka',
    name: 'Osaka',
    country: 'Japan',
    kind: 'city',
    lat: 34.6937,
    lng: 135.5023,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-osaka-201907.jpg'] },
    ],
  },
  {
    id: 'mt-fuji',
    name: 'Mt. Fuji',
    country: 'Japan',
    kind: 'city',
    lat: 35.3606,
    lng: 138.7274,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-mt-fuji-201907.jpg'] },
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    kind: 'city',
    lat: 35.6762,
    lng: 139.6503,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-tokyo-201907.jpg'] },
    ],
  },
  {
    id: 'kyoto-city',
    name: 'Kyoto',
    country: 'Japan',
    kind: 'city',
    lat: 35.0116,
    lng: 135.7681,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-kyoto-201907.jpg'] },
    ],
  },
  {
    id: 'nara-city',
    name: 'Nara',
    country: 'Japan',
    kind: 'city',
    lat: 34.6851,
    lng: 135.8048,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-nara-201907.jpg'] },
    ],
  },
  {
    id: 'kamakura',
    name: 'Kamakura',
    country: 'Japan',
    kind: 'city',
    lat: 35.3192,
    lng: 139.5467,
    visits: [
      { date: '2019-07', photos: ['/images/travel/japan-kamakura-201907.jpg'] },
    ],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'USA',
    kind: 'city',
    lat: 34.0522,
    lng: -118.2437,
    visits: [
      {
        date: '2025-01',
        photos: ['/images/travel/usa-los-angeles-202501.jpg'],
      },
    ],
  },
  {
    id: 'santa-monica',
    name: 'Santa Monica',
    country: 'USA',
    kind: 'city',
    lat: 34.0195,
    lng: -118.4912,
    visits: [
      {
        date: '2025-01',
        photos: ['/images/travel/usa-santa-monica-202501.jpg'],
      },
    ],
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'USA',
    kind: 'city',
    lat: 37.7749,
    lng: -122.4194,
    visits: [
      {
        date: '2025-02',
        photos: ['/images/travel/usa-san-francisco-202502.jpg'],
      },
    ],
  },
  {
    id: 'san-jose',
    name: 'San Jose',
    country: 'USA',
    kind: 'city',
    lat: 37.3382,
    lng: -121.8863,
    visits: [
      {
        date: '2025-02',
        photos: ['/images/travel/usa-san-jose-202502.jpg'],
      },
    ],
  },
  {
    id: 'santa-cruz',
    name: 'Santa Cruz',
    country: 'USA',
    kind: 'city',
    lat: 36.9741,
    lng: -122.0308,
    visits: [
      {
        date: '2025-02',
        photos: ['/images/travel/usa-santa-cruz-202502.jpg'],
      },
    ],
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    kind: 'city',
    lat: 51.5074,
    lng: -0.1278,
    visits: [
      {
        date: '2025-07',
        photos: ['/images/travel/uk-london-202507.jpg'],
      },
    ],
  },
  {
    id: 'oxford',
    name: 'Oxford',
    country: 'UK',
    kind: 'city',
    lat: 51.752,
    lng: -1.2577,
    visits: [
      { date: '2025-08', photos: ['/images/travel/uk-oxford-202508.jpg'] },
    ],
  },
  {
    id: 'bath',
    name: 'Bath',
    country: 'UK',
    kind: 'city',
    lat: 51.3811,
    lng: -2.359,
    visits: [
      { date: '2025-08', photos: ['/images/travel/uk-bath-202508.jpg'] },
    ],
  },
  {
    id: 'dover',
    name: 'Dover',
    country: 'UK',
    kind: 'city',
    lat: 51.1279,
    lng: 1.3134,
    visits: [
      {
        date: '2025-08',
        photos: ['/images/travel/uk-dover-white-cliffs-202508.jpg'],
      },
    ],
  },
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    country: 'UK',
    kind: 'city',
    lat: 51.1789,
    lng: -1.8262,
    visits: [
      {
        date: '2025-08',
        photos: ['/images/travel/uk-stonehenge-202508.jpg'],
      },
    ],
  },
]

/**
 * International flights drawn as curved arcs on the travelling map.
 */
export type TravelFlight = {
  id: string
  from: { name: string; code: string; lat: number; lng: number }
  to: { name: string; code: string; lat: number; lng: number }
  /** Display date, e.g. 2019/07/19 */
  date: string
  flightNumber: string
  /**
   * Arc bulge as a fraction of chord length.
   * Opposite signs keep outbound / return from overlapping.
   */
  bulge: number
}

const XIY = { name: 'Xi′an', code: 'XIY', lat: 34.3416, lng: 108.9398 }
const KIX = { name: 'Osaka', code: 'KIX', lat: 34.6937, lng: 135.5023 }
const HKG = { name: 'Hong Kong', code: 'HKG', lat: 22.3080, lng: 113.9185 }
const SFO = { name: 'San Francisco', code: 'SFO', lat: 37.6213, lng: -122.3790 }
const PVG = { name: 'Shanghai', code: 'PVG', lat: 31.1443, lng: 121.8083 }
const LHR = { name: 'London', code: 'LHR', lat: 51.47, lng: -0.4543 }
const LGW = { name: 'Gatwick', code: 'LGW', lat: 51.1537, lng: -0.1821 }
const CGO = { name: 'Zhengzhou', code: 'CGO', lat: 34.5197, lng: 113.8409 }

export const travelFlights: TravelFlight[] = [
  {
    id: 'xiy-kix-20190719',
    from: XIY,
    to: KIX,
    date: '2019/07/19',
    flightNumber: '3U8801',
    bulge: 0.32,
  },
  {
    id: 'kix-xiy-20190726',
    from: KIX,
    to: XIY,
    date: '2019/07/26',
    flightNumber: '3U8802',
    bulge: -0.32,
  },
  {
    id: 'hkg-sfo-20250120',
    from: HKG,
    to: SFO,
    date: '2025/01/20',
    flightNumber: 'CX892',
    bulge: 0.28,
  },
  {
    id: 'sfo-hkg-20250206',
    from: SFO,
    to: HKG,
    date: '2025/02/06',
    flightNumber: 'CX893',
    bulge: -0.28,
  },
  {
    id: 'pvg-lhr-20250728',
    from: PVG,
    to: LHR,
    date: '2025/07/28',
    flightNumber: 'BA168',
    bulge: 0.3,
  },
  {
    id: 'lgw-cgo-20250816',
    from: LGW,
    to: CGO,
    date: '2025/08/16',
    flightNumber: 'CZ654',
    bulge: -0.3,
  },
]

export const lifeHubCards = [
  {
    id: 'sports',
    title: 'Sports',
    blurb: 'Walk · Run · Cycle · Swim',
    href: '/life/sports',
    image: '/images/life/hub-sports.png',
  },
  {
    id: 'travelling',
    title: 'Travelling',
    blurb: 'Footprints on the map',
    href: '/life/travelling',
    image: '/images/life/hub-travelling.png',
  },
  {
    id: 'photography',
    title: 'Photography',
    blurb: 'Through my lens',
    href: '/life/photography',
    image: '/images/life/hub-photography.png',
  },
] as const
