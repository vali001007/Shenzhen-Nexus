import { db } from './client.js'

const seedData = [
  { id: 'pingan', category: 'landmark', rank: '#1', title: { en: 'Ping An Finance Center', zh: '平安金融中心' }, subtitle: { en: 'Futian CBD • 599m Tower', zh: '福田 CBD • 599米摩天大楼' }, description: { en: 'A flagship skyline stop for delegates staying around Futian.', zh: '这是福田代表团最适合插入商务空档的地标点。' }, image: '/images/top-spots/pingan.jpeg', sceneFit: { en: 'A flagship skyline stop for delegates staying around Futian. Best used as a short business-break destination with premium food and photo options.', zh: '这是福田代表团最适合插入商务空档的地标点，适合搭配高空观景、高端餐饮和快速拍照服务。' } },
  { id: 'talentpark', category: 'landmark', rank: '#2', title: { en: 'Shenzhen Talent Park', zh: '深圳人才公园' }, subtitle: { en: 'Nanshan • Drone Light Shows', zh: '南山区 • 无人机灯光秀' }, description: { en: 'Talent Park is a soft-landing landmark for overseas guests.', zh: '人才公园很适合作为外宾轻松进入深圳本地体验的第一站。' }, image: '/images/top-spots/talentpark.jpeg', sceneFit: { en: 'Ideal for sunset walks, drone shows, and light outdoor networking.', zh: '适合傍晚散步、无人机灯光秀和轻社交会面。' } },
  { id: 'bayglory', category: 'landmark', rank: '#3', title: { en: 'Bay Glory Ferris Wheel', zh: '欢乐港湾摩天轮' }, subtitle: { en: 'Baoan • Coastal Views', zh: '宝安区 • 海岸线景观' }, description: { en: 'This stop is strong for couples, family delegates, and evening entertainment.', zh: '这一站适合陪同家属、情侣和希望在宝安轻松夜游的访客。' }, image: '/images/top-spots/bayglory.jpeg', sceneFit: { en: 'Works well for evening coastal breaks and relaxed dinners.', zh: '适合傍晚海岸漫步与轻松晚餐。' } },
  { id: 'dji', category: 'tech', rank: '#1', title: { en: 'DJI Sky City', zh: '大疆天空之城' }, subtitle: { en: 'Nanshan • Global Drone HQ', zh: '南山区 • 全球无人机总部' }, description: { en: 'One of the strongest Shenzhen tech symbols.', zh: '这是深圳科技感最强的标志性点位之一。' }, image: '/images/top-spots/dji.jpeg', sceneFit: { en: 'Perfect for tech pilgrimage, gift shopping, and executive coffee.', zh: '适合科技朝圣、伴手礼采购和商务咖啡会面。' } },
  { id: 'byd', category: 'tech', rank: '#2', title: { en: 'BYD Global Headquarters', zh: '比亚迪全球总部' }, subtitle: { en: 'Pingshan • EV Revolution', zh: '坪山区 • 新能源汽车革命' }, description: { en: 'BYD HQ is a destination for delegates interested in EV leadership.', zh: '比亚迪总部适合对中国新能源汽车感兴趣的代表。' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/BYD_04.JPG/800px-BYD_04.JPG', sceneFit: { en: 'Best for EV-curious delegates with half-day availability.', zh: '适合对新能源感兴趣且有半天空闲的代表。' } },
  { id: 'hqb', category: 'tech', rank: '#3', title: { en: 'Huaqiangbei Electronics Hub', zh: '华强北电子第一街' }, subtitle: { en: 'Futian • Hardware Silicon Valley', zh: '福田区 • 硬件创客天堂' }, description: { en: 'Huaqiangbei should function as both a top spot and a commerce engine.', zh: '华强北不只是打卡地，更应成为科技客群高转化的消费引擎。' }, image: '/images/top-spots/hqb.jpeg', sceneFit: { en: 'Best for gadget hunting with bilingual assistance.', zh: '适合电子采购、极客逛街和双语采购陪同。' } },
  { id: 'robotaxi-spot', category: 'tech', rank: '#4', title: { en: 'Nanshan Robotaxi Zones', zh: '南山自动驾驶体验区' }, subtitle: { en: 'Nanshan • Driverless Experience', zh: '南山区 • 全无人驾驶体验' }, description: { en: 'This stop turns transport into a memorable Shenzhen moment.', zh: '这一站可以把简单通勤变成深圳特色体验。' }, image: '/images/top-spots/robotaxi.jpg', sceneFit: { en: 'Strong for futuristic transport demos between meetings.', zh: '适合在会议间隙体验未来出行场景。' } },
  { id: 'nantou', category: 'culture', rank: '#1', title: { en: 'Nantou Ancient City', zh: '南头古城' }, subtitle: { en: 'Nanshan • 1700yr Heritage & Cafes', zh: '南山区 • 1700年历史与咖啡馆' }, description: { en: 'Nantou gives APEC guests a grounded cultural contrast.', zh: '南头古城能让 APEC 外宾感受到深圳不止有科技。' }, image: '/images/top-spots/nantou.jpeg', sceneFit: { en: 'Best for culture, tea, and short walking exploration.', zh: '适合历史文化体验、茶叙和轻徒步。' } },
  { id: 'seaworld', category: 'culture', rank: '#2', title: { en: 'Sea World Culture & Arts Center', zh: '海上世界文化艺术中心' }, subtitle: { en: 'Shekou • Modern Exhibitions', zh: '蛇口 • 现代艺术展览' }, description: { en: 'Sea World blends art, sea views, and lifestyle retail.', zh: '海上世界兼具艺术、海景和生活方式零售。' }, image: '/images/top-spots/seaworld.jpeg', sceneFit: { en: 'Good for design-minded guests and polished harbor meetings.', zh: '适合偏好设计与艺术氛围的外宾。' } },
  { id: 'dafen', category: 'culture', rank: '#3', title: { en: 'Dafen Oil Painting Village', zh: '大芬油画村' }, subtitle: { en: 'Longgang • Art Production Hub', zh: '龙岗区 • 艺术村落' }, description: { en: 'Dafen adds a softer artistic Shenzhen memory.', zh: '大芬能补足深圳艺术气质。' }, image: '/images/top-spots/dafen.jpeg', sceneFit: { en: 'Best for creative shopping and custom portrait moments.', zh: '适合艺术采购和定制肖像体验。' } },
  { id: 'wenheyou', category: 'food', rank: '#1', title: { en: 'Shenzhen Wenheyou', zh: '深圳文和友' }, subtitle: { en: 'Luohu • Cyberpunk Retro Dining', zh: '罗湖区 • 赛博朋克复古餐饮' }, description: { en: 'Wenheyou is a destination-level dining scene.', zh: '文和友本身就是场景型目的地。' }, image: '/images/top-spots/wenheyou.jpeg', sceneFit: { en: 'Great for high-energy group dinners and social photos.', zh: '适合多人聚餐和社交拍照。' } },
  { id: 'shuiwei', category: 'food', rank: '#2', title: { en: 'Shuiwei 1368 Night Market', zh: '水围1368文化街区' }, subtitle: { en: 'Futian • Vibrant Street Food', zh: '福田区 • 活力市井夜市美食' }, description: { en: 'Shuiwei should be a low-friction evening choice.', zh: '水围应被设计成福田会务客低门槛的夜间消费入口。' }, image: '/images/top-spots/shuiwei.jpeg', sceneFit: { en: 'Strong for late-night cravings near major hotels.', zh: '适合住在福田的外宾夜宵和会后小聚。' } },
  { id: 'fanlou', category: 'food', rank: '#3', title: { en: 'Fan Lou Dim Sum', zh: '蘩楼' }, subtitle: { en: 'Futian • Classic Cantonese Brunch', zh: '福田区 • 传统广式早茶' }, description: { en: 'Fan Lou is a low-risk, high-trust entry point for foreign guests.', zh: '蘩楼是外宾尝试广式餐饮的低风险、高信任入口。' }, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Shenzhen_Skyline_from_Futian_District2.jpg/800px-Shenzhen_Skyline_from_Futian_District2.jpg', sceneFit: { en: 'Reliable Cantonese brunch before morning sessions.', zh: '适合上午议程前的稳妥广式早茶。' } },
]

const merchantData: Record<string, any[]> = {
  pingan: [
    { name: { en: 'Cloud Terrace Bar', zh: '云际露台酒廊' }, distance: { en: '8 min by car', zh: '车程 8 分钟' }, reason: { en: 'Skyline cocktails, English-speaking hosts.', zh: '适合外宾晚间会面。' }, tags: [{ en: 'Foreign cards', zh: '外卡支付' }, { en: 'Business table', zh: '商务会谈' }] },
    { name: { en: 'Lian Pavilion Cantonese', zh: '联阁粤宴' }, distance: { en: '6 min walk', zh: '步行 6 分钟' }, reason: { en: 'Private dining rooms and bilingual service.', zh: '提供包厢和双语接待。' }, tags: [{ en: 'English menu', zh: '英文菜单' }, { en: 'Private room', zh: '包厢可订' }] },
  ],
  talentpark: [
    { name: { en: 'Bay Loop Cafe', zh: '湾畔咖啡实验室' }, distance: { en: '4 min walk', zh: '步行 4 分钟' }, reason: { en: 'Quiet coffee meetings.', zh: '适合临时会谈。' }, tags: [{ en: 'English menu', zh: '英文菜单' }, { en: 'Coffee meeting', zh: '咖啡会面' }] },
    { name: { en: 'Talent Park Portrait Crew', zh: '人才公园旅拍组' }, distance: { en: 'On-site', zh: '现场服务' }, reason: { en: 'Short-form portrait service.', zh: '可提供外宾商务照。' }, tags: [{ en: 'Photo service', zh: '旅拍服务' }, { en: 'Quick booking', zh: '即时预约' }] },
  ],
  bayglory: [
    { name: { en: 'Harbor Seafood Table', zh: '港湾海鲜餐桌' }, distance: { en: '5 min walk', zh: '步行 5 分钟' }, reason: { en: 'Seafood with ocean views.', zh: '海景海鲜套餐。' }, tags: [{ en: 'Foreign cards', zh: '外卡支付' }, { en: 'Sea view', zh: '海景位' }] },
    { name: { en: 'Coastal Tea Lounge', zh: '海岸茶叙廊' }, distance: { en: '7 min walk', zh: '步行 7 分钟' }, reason: { en: 'Quiet tea and dessert stop.', zh: '适合小坐聊天。' }, tags: [{ en: 'Dessert', zh: '甜品' }, { en: 'Quiet meeting', zh: '安静会面' }] },
  ],
  dji: [
    { name: { en: 'Sky Lab Cafe', zh: '天空实验室咖啡' }, distance: { en: 'Inside district', zh: '园区内' }, reason: { en: 'Clean tech aesthetic.', zh: '科技感空间。' }, tags: [{ en: 'English menu', zh: '英文菜单' }, { en: 'Coffee stop', zh: '咖啡补给' }] },
    { name: { en: 'DJI Gift Gallery', zh: '大疆礼品廊' }, distance: { en: '3 min walk', zh: '步行 3 分钟' }, reason: { en: 'Curated branded merchandise.', zh: '品牌礼物。' }, tags: [{ en: 'Gift shop', zh: '礼品店' }, { en: 'Tax invoice', zh: '可开发票' }] },
  ],
  byd: [
    { name: { en: 'BYD Experience Center', zh: '比亚迪体验中心' }, distance: { en: 'Inside campus', zh: '园区内' }, reason: { en: 'Guided showroom tours.', zh: '提供英文导览。' }, tags: [{ en: 'English tour', zh: '英文导览' }, { en: 'Test drive', zh: '试驾' }] },
    { name: { en: 'Pingshan Local Kitchen', zh: '坪山本地餐厅' }, distance: { en: '10 min walk', zh: '步行 10 分钟' }, reason: { en: 'Authentic local lunch.', zh: '地道本地餐厅。' }, tags: [{ en: 'Local food', zh: '本地美食' }, { en: 'Cards accepted', zh: '可刷外卡' }] },
  ],
  hqb: [
    { name: { en: 'Circuit Guide Desk', zh: '电路导购台' }, distance: { en: 'Inside SEG', zh: '赛格片区内' }, reason: { en: 'Bilingual buying help.', zh: '双语采购陪同。' }, tags: [{ en: 'Guide service', zh: '导购服务' }, { en: 'Tech sourcing', zh: '采购陪同' }] },
    { name: { en: 'Maker Brew', zh: '创客咖啡' }, distance: { en: '5 min walk', zh: '步行 5 分钟' }, reason: { en: 'Quick drinks and charging.', zh: '充电补给。' }, tags: [{ en: 'Charging', zh: '充电位' }, { en: 'English support', zh: '英文支持' }] },
  ],
  'robotaxi-spot': [
    { name: { en: 'Apollo Pickup Lounge', zh: '自动驾驶接驳休息区' }, distance: { en: 'At pickup point', zh: '上车点旁' }, reason: { en: 'Bilingual waiting lounge.', zh: '候车双语协助。' }, tags: [{ en: 'Bilingual desk', zh: '双语服务' }, { en: 'Transit hub', zh: '接驳点' }] },
    { name: { en: 'Smart Canton Bistro', zh: '智享粤味餐吧' }, distance: { en: '6 min walk', zh: '步行 6 分钟' }, reason: { en: 'Fast Cantonese meal.', zh: '快速用餐。' }, tags: [{ en: 'Fast dining', zh: '快速用餐' }, { en: 'Cards accepted', zh: '可刷外卡' }] },
  ],
  nantou: [
    { name: { en: 'South Gate Tea House', zh: '南门茶叙馆' }, distance: { en: '3 min walk', zh: '步行 3 分钟' }, reason: { en: 'Bilingual tea tasting.', zh: '双语茶文化讲解。' }, tags: [{ en: 'Tea tasting', zh: '品茶体验' }, { en: 'English host', zh: '英文接待' }] },
    { name: { en: 'Courtyard Clay Pot', zh: '庭院煲仔小馆' }, distance: { en: '5 min walk', zh: '步行 5 分钟' }, reason: { en: 'Warm local meal.', zh: '菜品地道。' }, tags: [{ en: 'Local flavors', zh: '本地风味' }, { en: 'Group seating', zh: '多人用餐' }] },
  ],
  seaworld: [
    { name: { en: 'Harbor View Brasserie', zh: '港景小酒馆' }, distance: { en: '4 min walk', zh: '步行 4 分钟' }, reason: { en: 'Reliable western brunch.', zh: '西式轻食。' }, tags: [{ en: 'Western menu', zh: '西式菜单' }, { en: 'Business friendly', zh: '商务友好' }] },
    { name: { en: 'Design Store Shekou', zh: '蛇口设计商店' }, distance: { en: 'Inside center', zh: '馆内' }, reason: { en: 'Creative gifts.', zh: '设计伴手礼。' }, tags: [{ en: 'Gift shop', zh: '礼品店' }, { en: 'Creative goods', zh: '设计商品' }] },
  ],
  dafen: [
    { name: { en: 'Atelier Coffee', zh: '画室咖啡' }, distance: { en: '2 min walk', zh: '步行 2 分钟' }, reason: { en: 'Coffee with artist vibe.', zh: '画室氛围咖啡。' }, tags: [{ en: 'Cafe', zh: '咖啡馆' }, { en: 'Art vibe', zh: '艺术氛围' }] },
    { name: { en: 'Canvas Portrait Studio', zh: '画布肖像工坊' }, distance: { en: '4 min walk', zh: '步行 4 分钟' }, reason: { en: 'Quick portrait commissions.', zh: '快速定制肖像。' }, tags: [{ en: 'Portrait service', zh: '肖像服务' }, { en: 'Gift ready', zh: '礼物包装' }] },
  ],
  wenheyou: [
    { name: { en: 'Retro Banquet Hall', zh: '复古宴会厅' }, distance: { en: 'Inside venue', zh: '场内' }, reason: { en: 'Group dining with local dishes.', zh: '适合带队聚餐。' }, tags: [{ en: 'Group booking', zh: '团体预订' }, { en: 'Local dining', zh: '本地菜' }] },
    { name: { en: 'Neon Photo Booth', zh: '霓虹旅拍点' }, distance: { en: 'Inside venue', zh: '场内' }, reason: { en: 'Instant retro photos.', zh: '现场出片。' }, tags: [{ en: 'Photo service', zh: '旅拍服务' }, { en: 'Fast delivery', zh: '快速出片' }] },
  ],
  shuiwei: [
    { name: { en: 'Shuiwei Craft Kitchen', zh: '水围精选餐吧' }, distance: { en: '3 min walk', zh: '步行 3 分钟' }, reason: { en: 'Card-friendly local plates.', zh: '支持外卡。' }, tags: [{ en: 'Foreign cards', zh: '外卡支付' }, { en: 'Local sampler', zh: '本地拼盘' }] },
    { name: { en: 'Night Bite Local Guide', zh: '夜市向导服务' }, distance: { en: 'On demand', zh: '按需出发' }, reason: { en: 'Bilingual food walk.', zh: '双语夜市漫游。' }, tags: [{ en: 'Food walk', zh: '夜市导览' }, { en: 'Bilingual', zh: '双语服务' }] },
  ],
  fanlou: [
    { name: { en: 'Fan Lou VIP Room', zh: '蘩楼贵宾包厢' }, distance: { en: 'Inside venue', zh: '店内' }, reason: { en: 'Private breakfast meetings.', zh: '早餐会。' }, tags: [{ en: 'Private room', zh: '包厢可订' }, { en: 'Business breakfast', zh: '商务早餐' }] },
    { name: { en: 'Canton Tea Atelier', zh: '粤茶伴手礼坊' }, distance: { en: '4 min walk', zh: '步行 4 分钟' }, reason: { en: 'Packaged tea gifts.', zh: '广东茶礼。' }, tags: [{ en: 'Gift shop', zh: '礼品店' }, { en: 'Tea gift', zh: '茶礼' }] },
  ],
}

console.log('Seeding database...')

const allMerchants: any[] = []
for (const [spotId, items] of Object.entries(merchantData)) {
  items.forEach((m, i) => {
    allMerchants.push({ merchantId: `${spotId}-merchant-${i + 1}`, spotId, ...m, status: 'available' })
  })
}

db.seedSpots(seedData, allMerchants)
console.log(`Seeded ${seedData.length} spots and ${allMerchants.length} merchants.`)
