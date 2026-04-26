import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../../data.json')

export interface DbData {
  spots: any[]
  merchants: any[]
  orders: any[]
  passes: any[]
  redemptions: any[]
  passConfigs: any[]
  aiLogs: any[]
}

function load(): DbData {
  if (!fs.existsSync(DB_PATH)) {
    const empty: DbData = {
      spots: [],
      merchants: [],
      orders: [],
      passes: [],
      redemptions: [],
      passConfigs: [],
      aiLogs: [],
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2))
    return empty
  }

  const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as Partial<DbData>
  return {
    spots: raw.spots ?? [],
    merchants: raw.merchants ?? [],
    orders: raw.orders ?? [],
    passes: raw.passes ?? [],
    redemptions: raw.redemptions ?? [],
    passConfigs: raw.passConfigs ?? [],
    aiLogs: raw.aiLogs ?? [],
  }
}

function save(data: DbData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

class JsonDb {
  private data: DbData

  constructor() {
    this.data = load()
  }

  get spots() { return this.data.spots }
  get merchants() { return this.data.merchants }
  get orders() { return this.data.orders }
  get passes() { return this.data.passes }
  get redemptions() { return this.data.redemptions }
  get passConfigs() { return this.data.passConfigs }
  get aiLogs() { return this.data.aiLogs }

  findSpot(id: string) { return this.data.spots.find((s) => s.id === id) }

  createSpot(spot: any) {
    this.data.spots.push(spot)
    save(this.data)
    return spot
  }

  updateSpot(id: string, updates: any) {
    const idx = this.data.spots.findIndex((s) => s.id === id)
    if (idx === -1) return null
    this.data.spots[idx] = { ...this.data.spots[idx], ...updates }
    save(this.data)
    return this.data.spots[idx]
  }

  deleteSpot(id: string) {
    const before = this.data.spots.length
    this.data.spots = this.data.spots.filter((s) => s.id !== id)
    this.data.merchants = this.data.merchants.filter((m) => m.spotId !== id)
    if (this.data.spots.length === before) return false
    save(this.data)
    return true
  }

  findMerchantsBySpot(spotId: string) { return this.data.merchants.filter((m) => m.spotId === spotId) }

  findMerchant(merchantId: string) {
    return this.data.merchants.find((m) => m.merchantId === merchantId)
  }

  createMerchant(merchant: any) {
    this.data.merchants.push(merchant)
    save(this.data)
    return merchant
  }

  updateMerchant(merchantId: string, updates: any) {
    const idx = this.data.merchants.findIndex((m) => m.merchantId === merchantId)
    if (idx === -1) return null
    this.data.merchants[idx] = { ...this.data.merchants[idx], ...updates }
    save(this.data)
    return this.data.merchants[idx]
  }

  deleteMerchant(merchantId: string) {
    const before = this.data.merchants.length
    this.data.merchants = this.data.merchants.filter((m) => m.merchantId !== merchantId)
    if (this.data.merchants.length === before) return false
    save(this.data)
    return true
  }

  findOrder(orderId: string) { return this.data.orders.find((o) => o.orderId === orderId) }

  createOrder(order: any) {
    this.data.orders.push(order)
    save(this.data)
    return order
  }

  updateOrder(orderId: string, updates: any) {
    const idx = this.data.orders.findIndex((o) => o.orderId === orderId)
    if (idx === -1) return null
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates }
    save(this.data)
    return this.data.orders[idx]
  }

  findPass(passId: string) { return this.data.passes.find((p) => p.passId === passId) }

  findActivePass(spotId: string, merchantId: string) {
    return this.data.passes.find((p) => p.spotId === spotId && p.merchantId === merchantId && p.status === 'active' && new Date(p.expiresAt) > new Date())
  }

  createPass(pass: any) {
    this.data.passes.push(pass)
    save(this.data)
    return pass
  }

  updatePass(passId: string, updates: any) {
    const idx = this.data.passes.findIndex((p) => p.passId === passId)
    if (idx === -1) return null
    this.data.passes[idx] = { ...this.data.passes[idx], ...updates }
    save(this.data)
    return this.data.passes[idx]
  }

  createRedemption(redemption: any) {
    this.data.redemptions.push(redemption)
    save(this.data)
    return redemption
  }

  findRedemptionByPass(passId: string) {
    return this.data.redemptions.find((r) => r.passId === passId)
  }

  getPassConfig(spotId: string, merchantId: string) {
    return this.data.passConfigs.find((c) => c.spotId === spotId && c.merchantId === merchantId)
  }

  listPassConfigs() {
    return this.data.passConfigs
  }

  upsertPassConfig(config: any) {
    const idx = this.data.passConfigs.findIndex((c) => c.spotId === config.spotId && c.merchantId === config.merchantId)
    if (idx === -1) {
      this.data.passConfigs.push(config)
    } else {
      this.data.passConfigs[idx] = { ...this.data.passConfigs[idx], ...config }
    }
    save(this.data)
    return this.getPassConfig(config.spotId, config.merchantId)
  }

  logAiEvent(event: any) {
    this.data.aiLogs.unshift(event)
    if (this.data.aiLogs.length > 500) {
      this.data.aiLogs = this.data.aiLogs.slice(0, 500)
    }
    save(this.data)
    return event
  }

  seedSpots(spots: any[], merchants: any[]) {
    this.data.spots = spots
    this.data.merchants = merchants
    save(this.data)
  }
}

export const db = new JsonDb()
