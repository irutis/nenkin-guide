export type Prefecture = {
  slug: string
  name: string
  region: string
  capital: string
  population: string // 高齢者人口の多い順
}

export const PREFECTURES: Prefecture[] = [
  { slug: 'tokyo', name: '東京都', region: '関東', capital: '新宿区', population: '310万人' },
  { slug: 'osaka', name: '大阪府', region: '近畿', capital: '大阪市', population: '220万人' },
  { slug: 'kanagawa', name: '神奈川県', region: '関東', capital: '横浜市', population: '190万人' },
  { slug: 'aichi', name: '愛知県', region: '中部', capital: '名古屋市', population: '170万人' },
  { slug: 'saitama', name: '埼玉県', region: '関東', capital: 'さいたま市', population: '155万人' },
  { slug: 'chiba', name: '千葉県', region: '関東', capital: '千葉市', population: '145万人' },
  { slug: 'hyogo', name: '兵庫県', region: '近畿', capital: '神戸市', population: '140万人' },
  { slug: 'hokkaido', name: '北海道', region: '北海道', capital: '札幌市', population: '140万人' },
  { slug: 'fukuoka', name: '福岡県', region: '九州', capital: '福岡市', population: '130万人' },
  { slug: 'shizuoka', name: '静岡県', region: '中部', capital: '静岡市', population: '105万人' },
  { slug: 'ibaraki', name: '茨城県', region: '関東', capital: '水戸市', population: '80万人' },
  { slug: 'hiroshima', name: '広島県', region: '中国', capital: '広島市', population: '80万人' },
  { slug: 'kyoto', name: '京都府', region: '近畿', capital: '京都市', population: '75万人' },
  { slug: 'miyagi', name: '宮城県', region: '東北', capital: '仙台市', population: '65万人' },
  { slug: 'niigata', name: '新潟県', region: '中部', capital: '新潟市', population: '65万人' },
  { slug: 'nagano', name: '長野県', region: '中部', capital: '長野市', population: '62万人' },
  { slug: 'gifu', name: '岐阜県', region: '中部', capital: '岐阜市', population: '58万人' },
  { slug: 'tochigi', name: '栃木県', region: '関東', capital: '宇都宮市', population: '55万人' },
  { slug: 'gunma', name: '群馬県', region: '関東', capital: '前橋市', population: '55万人' },
  { slug: 'okayama', name: '岡山県', region: '中国', capital: '岡山市', population: '55万人' },
  { slug: 'fukushima', name: '福島県', region: '東北', capital: '福島市', population: '55万人' },
  { slug: 'mie', name: '三重県', region: '近畿', capital: '津市', population: '50万人' },
  { slug: 'kumamoto', name: '熊本県', region: '九州', capital: '熊本市', population: '50万人' },
  { slug: 'kagoshima', name: '鹿児島県', region: '九州', capital: '鹿児島市', population: '50万人' },
  { slug: 'yamaguchi', name: '山口県', region: '中国', capital: '山口市', population: '48万人' },
  { slug: 'ehime', name: '愛媛県', region: '四国', capital: '松山市', population: '45万人' },
  { slug: 'nagasaki', name: '長崎県', region: '九州', capital: '長崎市', population: '44万人' },
  { slug: 'aomori', name: '青森県', region: '東北', capital: '青森市', population: '42万人' },
  { slug: 'iwate', name: '岩手県', region: '東北', capital: '盛岡市', population: '40万人' },
  { slug: 'oita', name: '大分県', region: '九州', capital: '大分市', population: '38万人' },
  { slug: 'ishikawa', name: '石川県', region: '中部', capital: '金沢市', population: '33万人' },
  { slug: 'yamagata', name: '山形県', region: '東北', capital: '山形市', population: '33万人' },
  { slug: 'akita', name: '秋田県', region: '東北', capital: '秋田市', population: '33万人' },
  { slug: 'shiga', name: '滋賀県', region: '近畿', capital: '大津市', population: '40万人' },
  { slug: 'nara', name: '奈良県', region: '近畿', capital: '奈良市', population: '40万人' },
  { slug: 'yamanashi', name: '山梨県', region: '中部', capital: '甲府市', population: '25万人' },
  { slug: 'wakayama', name: '和歌山県', region: '近畿', capital: '和歌山市', population: '30万人' },
  { slug: 'toyama', name: '富山県', region: '中部', capital: '富山市', population: '32万人' },
  { slug: 'fukui', name: '福井県', region: '中部', capital: '福井市', population: '23万人' },
  { slug: 'tottori', name: '鳥取県', region: '中国', capital: '鳥取市', population: '17万人' },
  { slug: 'shimane', name: '島根県', region: '中国', capital: '松江市', population: '21万人' },
  { slug: 'tokushima', name: '徳島県', region: '四国', capital: '徳島市', population: '24万人' },
  { slug: 'kagawa', name: '香川県', region: '四国', capital: '高松市', population: '28万人' },
  { slug: 'kochi', name: '高知県', region: '四国', capital: '高知市', population: '25万人' },
  { slug: 'saga', name: '佐賀県', region: '九州', capital: '佐賀市', population: '23万人' },
  { slug: 'miyazaki', name: '宮崎県', region: '九州', capital: '宮崎市', population: '33万人' },
  { slug: 'okinawa', name: '沖縄県', region: '沖縄', capital: '那覇市', population: '30万人' },
]

export function getPrefectureBySlug(slug: string): Prefecture | undefined {
  return PREFECTURES.find(p => p.slug === slug)
}
