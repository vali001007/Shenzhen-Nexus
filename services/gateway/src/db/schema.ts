import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const orders = sqliteTable('orders', {
  orderId: text('order_id').primaryKey(),
  spotId: text('spot_id').notNull(),
  merchantId: text('merchant_id').notNull(),
  merchantName: text('merchant_name').notNull(),
  serviceType: text('service_type').notNull(),
  language: text('language').notNull(),
  guests: integer('guests').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('pending_payment'),
  stripePaymentIntentId: text('stripe_pi_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
})

export const passes = sqliteTable('passes', {
  passId: text('pass_id').primaryKey(),
  spotId: text('spot_id').notNull(),
  merchantId: text('merchant_id').notNull(),
  merchantName: text('merchant_name').notNull(),
  userId: text('user_id'),
  source: text('source').notNull(),
  status: text('status').notNull().default('active'),
  claimedAt: text('claimed_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  hmacSignature: text('hmac_signature').notNull(),
})

export const redemptions = sqliteTable('redemptions', {
  redemptionId: text('redemption_id').primaryKey(),
  passId: text('pass_id').notNull(),
  merchantId: text('merchant_id').notNull(),
  redeemedAt: text('redeemed_at').notNull(),
})

export const spots = sqliteTable('spots', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  rank: text('rank').notNull(),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh').notNull(),
  subtitleEn: text('subtitle_en').notNull(),
  subtitleZh: text('subtitle_zh').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionZh: text('description_zh').notNull(),
  image: text('image').notNull(),
  sceneFitEn: text('scene_fit_en').notNull(),
  sceneFitZh: text('scene_fit_zh').notNull(),
})

export const merchants = sqliteTable('merchants', {
  id: text('id').primaryKey(),
  spotId: text('spot_id').notNull(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  distanceEn: text('distance_en').notNull(),
  distanceZh: text('distance_zh').notNull(),
  reasonEn: text('reason_en').notNull(),
  reasonZh: text('reason_zh').notNull(),
  tagsJson: text('tags_json').notNull(),
  status: text('status').notNull().default('available'),
})
