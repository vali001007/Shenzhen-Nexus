# Shenzhen Nexus — CLAUDE.md

## 项目概述

**Shenzhen Nexus** 是面向 2026 APEC 入境国际游客的深圳城市智能伴侣，同时为本地文旅、餐饮及高端服务商家提供精准引流与交易转化能力。

核心定位：**入境游客在深圳的超级助手**，打通信息获取、语言理解、行程规划、服务预约、商户消费的完整链路。

当前状态：单文件高保真原型 `Shenzhen Nexus.HTML`，需工程化升级为可上线产品。

---

## 架构与技术栈

### 目录结构

```
shenzhen-nexus/
├─ apps/
│  ├─ traveler-web/        # 游客端 PWA（主产品）
│  ├─ merchant-console/    # 商户后台
│  └─ ops-console/         # 运营后台
├─ services/
│  ├─ gateway/             # BFF / API 网关
│  ├─ ai-service/          # 问答、翻译、行程、视觉、TTS
│  ├─ itinerary-service/
│  ├─ merchant-service/
│  ├─ order-service/
│  └─ payment-service/
├─ packages/
│  ├─ ui/                  # 通用组件库
│  ├─ i18n/                # 多语言资源（中英为主）
│  ├─ config/
│  └─ utils/
├─ infra/
│  ├─ scripts/
│  ├─ ci/
│  └─ deployment/
└─ tests/
   ├─ unit/
   ├─ integration/
   └─ e2e/                 # Playwright 主闭环测试
```

### 前端

- React + Vite + TypeScript（或 Vue 3 + Vite + TypeScript）
- Tailwind CSS（保留原型视觉风格）
- 状态管理：Zustand / Pinia / Redux Toolkit
- 国际化：`react-i18next` / `vue-i18n`
- 数据请求：`fetch` 封装或 `axios`
- PWA 支持（离线缓存、弱网增强）

### 后端

- Node.js 18+ + TypeScript
- Serverless / BFF 架构（CloudBase / CloudRun 或等价平台）
- 框架：Express / Fastify / NestJS
- 包管理：`pnpm`（优先）

### 数据层

- 关系型数据库：用户、商户、订单、核销、支付流水
- 对象存储：景点图片、商户图、AR 上传图片
- 缓存：热点榜单、FAQ、Prompt 模板
- 日志仓库：行为埋点、AI 请求、支付核销日志

### AI 与多模态

- 所有 AI 调用必须走**服务端代理**，禁止前端直连模型
- 文本问答 / 结构化输出 / 视觉模型 / TTS / 实时语音流
- 当前原型使用 Gemini（`callGeminiText()`、`callGeminiTTS()`），迁移时移至服务端

### 支付与生态集成

- 国际支付：Stripe、PayPal
- 境内支付：微信支付、支付宝 TourCard
- 地图：高德/腾讯地图国际适配
- 通知：短信、邮件、WhatsApp

---

## 核心功能模块

| 模块 | 说明 |
|---|---|
| 首页 / APEC 专属模式 | 会场信息、周边推荐、快捷操作、尊享服务区 |
| AI Concierge | 深圳本地知识库问答，返回 `answer/tips/relatedServices/recommendedMerchants` |
| 实时翻译 / 对讲机 | 双向翻译 + TTS 播报，支持应急短语收藏 |
| AI 微行程 | 输入时间/位置/兴趣/预算，输出可执行微行程，支持一键升级付费服务 |
| AR 解码 | 菜单/路牌/地标识别，返回翻译+背景说明+消费建议 |
| Top Spots 融合榜单 | 分类筛选（all/landmark/tech/culture/food）+ 动态卡片 |
| Spot 融合详情层（Fusion Overlay） | 场景匹配、消费路径、附近商户列表、4 类 CTA |
| APEC 友好商户系统 | 标签（APEC-Ready/English Menu/Foreign Cards）、预约、核销 |
| Concierge+ 尊享服务 | 导游、翻译、旅拍、接送、夜游专线预约与履约 |
| Pass 卡与核销 | 领券、二维码、到店核销、防重复校验 |
| 运营后台 / 商户后台 | Spot 管理、关系配置、订单、数据看板 |

---

## 核心数据模型

```
Spot                  — 景点（类别、热度、标签、文案）
Merchant              — 商户（位置、支付能力、语种能力、营业状态）
SpotMerchantRelation  — 多对多关系（距离、匹配分、推荐权重、状态）
Pass / Redemption     — 权益领取与核销记录
FusionActionLog       — 融合链路行为日志
Order                 — 订单状态机（待支付/已支付/履约中/已完成/退款）
```

---

## 主闭环（优先实现）

```
Top Spots 榜单 → Spot 融合详情层 → CTA 触发 → 预约/支付 → 到店核销/履约
```

---

## 关键埋点（必须实现）

| 事件名 | 触发时机 |
|---|---|
| `leaderboard_exposure` | 榜单曝光 |
| `leaderboard_category_click` | 分类切换 |
| `spot_card_click` | Spot 卡片点击 |
| `fusion_overlay_open` | 融合详情层打开 |
| `fusion_cta_click_pass` | 点击领取 Pass |
| `fusion_cta_click_booking` | 点击预约服务 |
| `fusion_cta_click_translate` | 点击翻译入口 |
| `fusion_cta_click_map` | 点击导航入口 |
| `merchant_click_from_spot` | 从 Spot 点击商户 |
| `redeem_success_by_spot` | 按 Spot 统计核销成功 |

---

## 版本里程碑

| 阶段 | 目标 |
|---|---|
| M0（已完成） | Top Spots × 商户融合交互原型（单文件） |
| MVP / Phase 1（2~3 周） | 工程化拆分、融合链路、AI 问答、微行程、AR 解码、中英双语、核心埋点 |
| V1 / Phase 2（2~3 周） | 商户详情、预约、订单、支付（Stripe）、Pass 核销、主链路 E2E 测试 |
| V1.1 / Phase 3（2 周） | 运营后台、商户后台、转化看板、推荐优化、监控告警、上线验收 |
| V2 | 复制到大湾区其他城市，平台化 |

---

## 任务卡体系

所有开发任务使用标准任务卡，详见 `Shenzhen Nexus-AI Coding详细开发任务清单.md`。

**编号规则**：`TC-{模块缩写}-{三位序号}`

| 缩写 | 模块 |
|---|---|
| FUS | 融合链路（榜单/详情/CTA） |
| MER | 商户域 |
| ORD | 订单与支付 |
| PAS | Pass 与核销 |
| DAT | 数据模型与埋点 |
| OPS | 后台与运维 |

**优先级**：P0（上线阻塞）→ P1（首版核心）→ P2（后续迭代）

---

## 开发规范

### 环境变量（必须配置）

```
APP_ENV
API_BASE_URL
AI_PROVIDER
GEMINI_API_KEY
PAYMENT_PROVIDER
STRIPE_SECRET_KEY
WEBHOOK_SIGNING_SECRET
DB_URL
STORAGE_BUCKET
CDN_BASE_URL
LOG_LEVEL
RATE_LIMIT_QPS
```

### 本地启动

```bash
pnpm install
pnpm --filter traveler-web dev    # 前端
pnpm --filter gateway dev         # 后端
pnpm test                         # 单测
pnpm e2e                          # E2E（Playwright）
```

### 原型迁移注意事项

从 `Shenzhen Nexus.HTML` 迁移时必须处理：

1. 模板字符串型模块 → 拆为组件
2. `i18nDict` → 拆为独立 i18n 资源文件
3. `callGeminiText()` / `callGeminiTTS()` → 迁移到服务端代理
4. 补齐缺失的 `callGeminiImage()`（AR 解码）
5. 演示按钮（"保存路线"、"预约导游"等）→ 接入真实后端数据流

### 架构原则

- 不做大而全 OTA，聚焦"行中服务"和深圳本地深度体验
- 不与本地地图正面竞争，重点做语言桥接、场景引导和服务转化
- 所有 AI 能力必须绑定本地私有知识库，降低泛化幻觉
- 所有收费服务必须可追踪、可履约、可结算
- 所有海外用户数据必须遵循隐私合规要求

---

## 参考文档

| 文档 | 用途 |
|---|---|
| `Shenzhen Nexus-PRD大纲.md` | 产品需求与功能范围 |
| `Shenzhen Nexus-技术实施任务清单.md` | 技术任务优先级与 DoD |
| `Shenzhen Nexus-AI Coding详细开发任务清单.md` | AI coding 执行基线（任务卡） |
| `Shenzhen Nexus-开发与部署说明书.md` | 架构、技术栈、实现细节 |
| `Shenzhen Nexus-商业模式分析报告.md` | 商业化策略参考 |
| `Shenzhen Nexus-竞品分析报告.md` | 差异化定位参考 |
| `Shenzhen Nexus-2026 APEC专项优化方案.md` | APEC 场景专项需求 |
| `Shenzhen Nexus.HTML` | 当前高保真原型（迁移源） |
