/** 双语文本结构 */
export interface LocaleText {
  en: string
  zh: string
}

/** 商户状态 */
export type MerchantStatus = 'available' | 'unavailable' | 'fallback'

/** 商户（运行时，含 merchantId 和 status） */
export interface Merchant {
  merchantId: string
  name: LocaleText
  distance: LocaleText
  reason: LocaleText
  tags: LocaleText[]
  status: MerchantStatus
}

/** 商户（静态数据，不含运行时字段） */
export interface MerchantData {
  name: LocaleText
  distance: LocaleText
  reason: LocaleText
  tags: LocaleText[]
}

/** Spot 分类 */
export type SpotCategory = 'landmark' | 'tech' | 'culture' | 'food'

/** Spot 静态数据 */
export interface Spot {
  id: string
  category: SpotCategory
  rank: string
  checkinsKey: string
  image: string
  borderClass: string
  rankClass: string
  title: LocaleText
  subtitle: LocaleText
  merchantCount: LocaleText
  sceneFit: LocaleText
  routeIdea: LocaleText
  quickTags: LocaleText[]
  description: LocaleText
  merchants: MerchantData[]
}

/** Spot 运行时数据（含商户状态） */
export interface SpotRuntime extends Omit<Spot, 'merchants'> {
  merchants: Merchant[]
}

/** 订单状态 */
export type OrderStatus = 'pending_payment' | 'paid' | 'failed' | 'cancelled' | 'refunded'

/** 订单 */
export interface Order {
  orderId: string
  spotId: string
  merchantId: string
  merchantName: string
  serviceType: string
  language: string
  guests: number
  date: string
  time: string
  amount: number
  status: OrderStatus
  createdAt: string
  itineraryId?: string
}

/** Pass */
export interface Pass {
  passId: string
  spotId: string
  merchantId: string
  merchantName: string
  source: string
  claimedAt: string
  expiresAt: string
  qrCode: string
}

/** 核销记录 */
export interface Redemption {
  redemptionId: string
  passId: string
  merchantId: string
  redeemedAt: string
}

/** 埋点事件 */
export interface EventPayload {
  eventName: string
  timestamp: string
  sessionId: string
  [key: string]: unknown
}

/** CTA 上下文 */
export interface CtaContext {
  sessionId: string
  spotId: string
  spotTitle: string
  merchantId: string | null
  merchantName: string | null
  source: string
  ctaType: string
}

/** 榜单分页结果 */
export interface LeaderboardPage {
  items: SpotRuntime[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** 行程停靠点 */
export interface ItineraryStop {
  time: string
  title: LocaleText
  description: LocaleText
  locationName?: LocaleText
  theme?: 'tech' | 'food' | 'culture' | 'city'
}

/** AI 生成的行程 */
export interface Itinerary {
  id: string
  title: LocaleText
  duration?: string
  stops: ItineraryStop[]
  savedAt: string
}
