# Shenzhen Nexus — Spec Tasks（2026-04-20 更新）

## 项目状态总览

| 阶段 | 状态 | 说明 |
|---|---|---|
| M0 原型验证 | ✅ 完成 | 单文件高保真原型 |
| Phase 1 前端 MVP | ✅ 完成 | 工程化拆分、融合链路、AI 模块、双语、埋点 |
| Phase 2 交易闭环 | ✅ 完成 | 网关、订单、支付意图、Stripe Elements、退款、AI 代理与 E2E 已打通 |
| Phase 3 运营后台 | 🟡 进行中 | 商户后台 MVP + ops-console CRUD/关系配置/日志看板已落地，DevOps 仍有增量 |

---

## Phase 1 — 已完成清单

### 1.1 工程化基础

| # | 任务 | 状态 |
|---|---|---|
| 1 | React 19 + Vite + TypeScript 项目搭建 | ✅ |
| 2 | Tailwind CSS + 暗色主题 + glass-panel 设计系统 | ✅ |
| 3 | Zustand 状态管理（appStore / uiStore / langStore） | ✅ |
| 4 | react-i18next 双语（en/zh，200+ keys） | ✅ |
| 5 | 模块化目录结构（views/modules/components/services/hooks/stores/data） | ✅ |
| 6 | PWA 离线支持（localStorage 持久化） | ✅ |

### 1.2 核心视图

| # | 任务 | 状态 |
|---|---|---|
| 7 | ExploreView — AI 入口 + 工具箱 + 科技游猎 | ✅ |
| 8 | LeaderboardView — Top Spots 融合榜单（分类筛选 + 分页） | ✅ |
| 9 | RouteView — 已保存行程列表 + 时间线 | ✅ |
| 10 | ProfileView — 用户设置 + 偏好 + 安全信息 | ✅ |

### 1.3 功能模块（18 个）

| # | 模块 | 状态 |
|---|---|---|
| 11 | AiConcierge — 智能问答（Claude Haiku） | ✅ |
| 12 | AiPlanner — 定制行程生成器（结构化 JSON 输出） | ✅ |
| 13 | AiResult — 行程结果展示 + 保存 | ✅ |
| 14 | ArDecoder — AR 视觉解码（图片分析） | ✅ |
| 15 | PaymentSetup — 支付方式引导（Alipay/WeChat） | ✅ |
| 16 | BookingService — 服务预约（本地模拟） | ✅ |
| 17 | PassClaim — Pass 领取 + QR 生成 | ✅ |
| 18 | PassRedeem — Pass 核销（本地模拟） | ✅ |
| 19 | Robotaxi — 自动驾驶体验攻略 | ✅ |
| 20 | DroneDelivery — 无人机空投攻略 | ✅ |
| 21 | RobotExperience — 机器人互动攻略 | ✅ |
| 22 | MetaverseExperience — 元宇宙体验攻略 | ✅ |
| 23 | Mobility — 出行指南 | ✅ |
| 24 | Connectivity — 网络连接指南 | ✅ |
| 25 | Emergency — 紧急联系 | ✅ |
| 26 | Embassy — 使领馆信息 | ✅ |
| 27 | SpotDetail — 景点融合详情层 | ✅ |
| 28 | MerchantCard — 商户卡片组件 | ✅ |

### 1.4 AI 服务层

| # | 任务 | 状态 |
|---|---|---|
| 29 | gemini.ts — API 代理接入（Claude Haiku via api.with7.cn/v1/messages） | ✅ |
| 30 | callGeminiText — 文本问答 + JSON 解析 | ✅ |
| 31 | callGeminiImage — 视觉分析（Claude 多模态格式） | ✅ |
| 32 | 语言感知（自动中/英响应） | ✅ |
| 33 | 重试机制（3 次指数退避） | ✅ |

### 1.5 数据与埋点

| # | 任务 | 状态 |
|---|---|---|
| 34 | 12 个景点 + 30+ 商户静态数据 | ✅ |
| 35 | EventPayload schema 定义 | ✅ |
| 36 | 18 个关键埋点事件注册 | ✅ |

---

## 当前进度校准（2026-04-25）

### 已完成（按任务编号）

| # | 任务 | 当前状态说明 |
|---|---|---|
| 37 | 初始化 `services/gateway`（Express + TS） | ✅ 已完成 |
| 38 | 统一响应结构 + 错误码体系 | ✅ 已完成（`errorHandler` + `createApiError`） |
| 39 | JWT 鉴权中间件 | ✅ 已完成（`optionalAuth`） |
| 41 | `GET /api/spots` + `GET /api/spots/:id/merchants` | ✅ 已完成（当前为 `GET /api/spots` + `GET /api/spots/:id`，返回 merchants） |
| 42 | `POST /api/orders` + `GET /api/orders/:id` | ✅ 已完成 |
| 43 | `POST /api/passes/:id/claim` + `POST /api/passes/:id/redeem` | ✅ 已完成（当前 claim 路径为 `POST /api/passes/claim`） |
| 46 | 后端 `POST /api/payments/create-intent` | ✅ 已完成 |
| 47 | Webhook 回调验签 + 订单状态更新 | ✅ 已完成（`POST /api/payments/webhook`） |
| 50 | Pass 数据表（id, spotId, merchantId, userId, status, expiresAt） | ✅ 已完成（当前为 JSON 存储模型，非关系型表） |
| 51 | QR 码签名生成（HMAC） | ✅ 已完成 |
| 52 | 核销端点防重复 + 过期校验 | ✅ 已完成 |
| 53 | 前端 PassClaim/PassRedeem 对接真实 API | ✅ 已完成（游客端 claim；核销迁移到商户后台） |
| 66 | 登录 + 商户身份绑定 | ✅ 已完成（merchantId 本地登录） |
| 67 | 扫码核销界面（摄像头 + 手输） | ✅ 已完成 |
| 68 | 今日核销记录 + 统计 | ✅ 已完成（MVP：本地会话内记录与计数） |

### 进行中 / 待完成（关键缺口）

| 45 | Stripe 前端 Elements 集成（当前为 create-intent + 轮询，尚未接入真实 confirmCardPayment） | ✅ 已完成（BookingService + PaymentElement + confirmPayment） |
| 49 | 退款接口未实现 | ✅ 已完成（`POST /api/payments/:id/refund`） |
| 54~58 | `services/ai-service` 服务端代理未落地（当前 AI 仍由前端代理调用） | ✅ 已完成（gateway `/api/ai/*` + 模板化 prompt + KB 注入 + 日志） |
| 62~65 | Playwright E2E 与异常链路覆盖未落地 | ✅ 已完成（smoke + payment-error，5/5 通过） |
| 69~81 | 商户后台扩展、ops-console、看板与 DevOps 基础能力未落地 | ✅ 已完成（69~81 全量落地：含发布/回滚脚本、Sentry 接入、API 性能监控） |
| 40 | 数据层持久化（当前 JSON，PostgreSQL 作为后续迁移项） | ✅ 已定（本阶段沿用 JSON） |

---

## #40 数据层策略决议（2026-04-26）

- 当前基线：`services/gateway` 继续使用 JSON 持久化（`src/db/client.ts` + `data.json`）。
- 迁移方向：PostgreSQL 保留为后续演进目标，不在本阶段引入 ORM 或迁移脚本。
- 触发条件（任一满足即立项 PG 迁移）：
  - 两个迭代内出现 >=2 次并发写入/一致性问题；
  - JSON 体量或加载耗时开始影响接口稳定性；
  - 高复杂度查询/报表需求频发，JSON 维护成本显著上升；
  - 多实例部署下写冲突无法低成本规避。

---

## Phase 2 — 交易闭环（预计 2~3 周）

### 2.1 后端 BFF 骨架

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 37 | 初始化 `services/gateway`（Express + TS） | P0 | 1d |
| 38 | 统一响应结构 + 错误码体系 | P0 | 0.5d |
| 39 | JWT 鉴权中间件 | P0 | 1d |
| 40 | 数据层持久化（当前 JSON，PostgreSQL 迁移预留） | P0 | 1.5d |
| 41 | `GET /api/spots` + `GET /api/spots/:id/merchants` | P0 | 1d |
| 42 | `POST /api/orders` + `GET /api/orders/:id` | P0 | 1d |
| 43 | `POST /api/passes/:id/claim` + `POST /api/passes/:id/redeem` | P0 | 1.5d |
| 44 | 限流 + 防重放中间件 | P1 | 0.5d |

### 2.2 Stripe 支付集成

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 45 | 前端接入 `@stripe/stripe-js` + Elements | P0 | 1.5d |
| 46 | 后端 `POST /api/payments/create-intent` | P0 | 1d |
| 47 | Webhook 回调验签 + 订单状态更新 | P0 | 1d |
| 48 | 支付结果页（成功/失败/超时） | P0 | 0.5d |
| 49 | 退款接口 `POST /api/payments/:id/refund` | P1 | 0.5d |

### 2.3 Pass 核销真实化

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 50 | Pass 数据表（id, spotId, merchantId, userId, status, expiresAt） | P0 | 0.5d |
| 51 | QR 码签名生成（HMAC） | P0 | 0.5d |
| 52 | 核销端点防重复 + 过期校验 | P0 | 1d |
| 53 | 前端 PassClaim/PassRedeem 对接真实 API | P0 | 1d |

### 2.4 AI 服务端代理

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 54 | `services/ai-service` — 统一 AI 代理（隐藏 API Key） | P0 | 1d |
| 55 | `POST /api/ai/chat` — 文本问答 | P0 | 0.5d |
| 56 | `POST /api/ai/plan` — 行程生成 | P0 | 0.5d |
| 57 | `POST /api/ai/vision` — 图片分析 | P1 | 0.5d |
| 58 | Prompt 模板管理 + 知识库注入 | P1 | 1d |

### 2.5 景点数据扩充

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 59 | 新增 8 个景点（前海、湾区中心、香蜜湖、深业上城等） | P1 | 1.5d |
| 60 | 每景点补充 3 个 APEC Ready 商户 | P1 | 1d |
| 61 | 景点封面图 CDN 配置 | P1 | 0.5d |

### 2.6 E2E 测试

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 62 | Playwright 框架搭建 | P0 | 0.5d |
| 63 | 主闭环冒烟：榜单→详情→领Pass→支付→核销 | P0 | 1.5d |
| 64 | AI 模块冒烟：问答 + 行程生成 | P1 | 0.5d |
| 65 | 异常路径：网络断开、支付失败、Pass 过期 | P1 | 1d |

---

## Phase 3 — 运营能力（预计 2 周）

### 3.1 商户后台 `apps/merchant-console`

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 66 | 登录 + 商户身份绑定 | P0 | 1d |
| 67 | 扫码核销界面（摄像头 + 手输） | P0 | 1.5d |
| 68 | 今日核销记录 + 统计 | P1 | 1d |
| 69 | 营业状态切换 | P1 | 0.5d |
| 70 | 服务能力 + 优惠配置 | P2 | 1d |

### 3.2 运营后台 `apps/ops-console`

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 71 | Spot / 商户 CRUD 管理 | P0 | 2d |
| 72 | Spot-商户关系配置（绑定/权重/排序） | P1 | 1d |
| 73 | 转化漏斗看板（曝光→点击→领券→核销） | P1 | 2d |
| 74 | AI 请求日志 + 错误监控 | P1 | 1d |
| 75 | Pass / 活动配置管理 | P1 | 1d |

### 3.3 DevOps

| # | 任务 | 优先级 | 预估 |
|---|---|---|---|
| 76 | CI/CD 流水线（lint → test → build → deploy） | P0 | 1d |
| 77 | 前端静态资源发布 + CDN + 回滚 | P0 | 0.5d |
| 78 | 后端容器化部署（Docker + CloudRun） | P0 | 1d |
| 79 | 环境隔离（dev/staging/prod）+ 密钥管理 | P0 | 0.5d |
| 80 | 前端错误监控（Sentry） | P1 | 0.5d |
| 81 | API 性能监控 + 告警 | P1 | 0.5d |

---

## 技术债与优化（持续）

| # | 任务 | 优先级 |
|---|---|---|
| 82 | Git 仓库初始化 + .gitignore + 首次提交 | P0 |
| 83 | API Key 脱敏（.env.example） | P0 |
| 84 | Vitest 单测基线（纯函数覆盖） | P1 |
| 85 | 多语言扩展（日/法/西/俄） | P2 |
| 86 | 无障碍合规（键盘操作/对比度/读屏） | P2 |
| 87 | 性能优化（图片懒加载/代码分割/缓存策略） | P2 |
| 88 | RAG 知识库接入（降低 AI 幻觉） | P2 |

---

## 当前 API 配置

| 项目 | 值 |
|---|---|
| 代理地址 | `https://api.with7.cn` |
| 端点 | `/v1/messages` |
| 模型 | `claude-haiku-4-5-20251001` |
| 认证 | `Bearer sk-acw-***`（.env） |
| 请求格式 | Claude Messages API（system 顶层 + messages） |
| 响应格式 | `content[0].text` |

---

## 建议执行顺序

```
Week 1: #82-83（Git 初始化）→ #37-43（后端骨架）→ #45-48（Stripe）
Week 2: #50-53（Pass 真实化）→ #54-56（AI 代理服务端化）→ #59-61（数据扩充）
Week 3: #62-65（E2E 测试）→ #58（知识库）→ #84（单测）
Week 4: #66-69（商户后台）→ #71-72（运营后台 CRUD）
Week 5: #73-75（看板 + 监控）→ #76-79（DevOps）→ 上线验收
```
