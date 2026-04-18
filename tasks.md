# Shenzhen Nexus - 前端工程化改造任务清单

> 基于计划文件 `reactive-stirring-wolf.md`，将单文件原型 `Shenzhen Nexus.HTML` 改造为 React + Vite + TypeScript 前端项目。

---

## Phase 1: 脚手架 + Layout + Tab 切换

- [x] 1.1 初始化 Vite + React + TypeScript 项目（`traveler-web/`）
- [x] 1.2 安装依赖：zustand, react-i18next, i18next, lucide-react
- [x] 1.3 配置 Tailwind CSS v4（postcss / vite 插件）
- [x] 1.4 迁移自定义 CSS 到 `src/index.css`（glass-panel, neon-border, active-tab, no-scrollbar, iPhone 手机框）
- [x] 1.5 创建 `useUIStore.ts`（currentTab, currentModule, modulePayload, moduleOriginSpotId, currentSpotId, toast）
- [x] 1.6 实现 `Layout.tsx`（手机框容器 + Header + 内容区 + TabBar + Overlay + Toast）
- [x] 1.7 实现 `Header.tsx`（根据 currentTab 显示标题/副标题，语言切换按钮占位）
- [x] 1.8 实现 `TabBar.tsx`（4 Tab 底部导航，图标 + 文字，切换 currentTab）
- [x] 1.9 实现 `Overlay.tsx`（全屏滑入面板，标题栏 + 返回/关闭按钮 + 内容插槽）
- [x] 1.10 实现 `Toast.tsx`（监听 toast 状态，自动显示/隐藏）
- [x] 1.11 创建 4 个 Tab 视图组件（ExploreView / LeaderboardView / RouteView / ProfileView）
- [x] 1.12 实现 `App.tsx`（根据 currentTab 渲染对应视图）
- [x] 1.13 验证：TypeScript 编译零错误，`pnpm build` 零警告通过

## Phase 2: i18n + 数据层 + TypeScript 类型

- [x] 2.1 定义 TypeScript 类型 `src/data/types.ts`（Spot, Merchant, Order, Pass, Redemption, EventPayload, LocaleText）
- [x] 2.2 从原型提取 i18n 词典，生成 `src/i18n/en.json` 和 `src/i18n/zh.json`（200+ key）
- [x] 2.3 初始化 i18next 配置 `src/i18n/index.ts`（默认 en，支持 en/zh 切换）
- [x] 2.4 创建 `useLangStore.ts`（currentLang + changeLang，联动 i18next.changeLanguage）
- [x] 2.5 迁移 14 个 Spot 模拟数据到 `src/data/spots.ts`（保留双语 LocaleText 结构）
- [x] 2.6 实现工具函数 `src/utils/locale.ts`（getLocaleText）
- [x] 2.7 实现工具函数 `src/utils/id.ts`（generateId）
- [x] 2.8 实现工具函数 `src/utils/signature.ts`（computeSignature）
- [x] 2.9 实现模拟 API `src/services/api.ts`（fetchLeaderboardPage + fetchSpotFusionDetail，含 260ms 延迟）
- [x] 2.10 更新 Header.tsx 接入语言切换功能（调用 changeLang + 显示当前语言）
- [x] 2.11 验证：切换语言后 Header/TabBar 文字正确切换

## Phase 3: ExploreView + 静态 Overlay 模块

- [x] 3.1 实现 `ExploreView.tsx`（AI 规划师入口卡片、AI 管家入口、AR 解码、支付设置、出行中枢、网络连接、无人机外卖、自动驾驶出租）
- [x] 3.2 实现 `PaymentSetup.tsx` 模块（Alipay/WeChat 绑卡教程静态页）
- [x] 3.3 实现 `Mobility.tsx` 模块（DiDi 指南 + 应急短语列表，TTS 按钮占位）
- [x] 3.4 实现 `Connectivity.tsx` 模块（eSIM / 公共 Wi-Fi 方案）
- [x] 3.5 实现 `Robotaxi.tsx` 模块（自动驾驶体验指南）
- [x] 3.6 实现 `DroneDelivery.tsx` 模块（无人机外卖步骤）
- [x] 3.7 在 `Overlay.tsx` 中实现 moduleId → 组件的映射渲染逻辑
- [x] 3.8 验证：首页所有入口卡片可点击，对应 Overlay 模块正确打开/关闭

## Phase 4: LeaderboardView + Spot 详情 + 商户选择

- [x] 4.1 实现 `SpotCard.tsx`（景点卡片：图片、排名、标签、场景匹配度、商户摘要）
- [x] 4.2 实现 `LeaderboardView.tsx`（分类 Tab 筛选 all/landmark/tech/culture/food + SpotCard 列表 + 加载更多 + 分页逻辑）
- [x] 4.3 创建 `useAppStore.ts`（selectedMerchantBySpot, leaderboardPageByCategory, orders, passes, redemptions, paymentCallbackLedger, events, qaReport）
- [x] 4.4 实现 Spot 融合详情页（复用 Overlay：图片 + 描述 + 路线建议 + 标签 + 商户列表 + CTA 按钮）
- [x] 4.5 实现 `MerchantCard.tsx`（商户名称、距离、状态标签、描述、选择按钮）
- [x] 4.6 实现 `useSpot.ts` hook（getSpotById, getPreferredMerchant, getSpotWithRuntimeMeta, getSpotCtaActions）
- [x] 4.7 实现商户选择逻辑（chooseMerchant → 更新 selectedMerchantBySpot → 重新渲染详情）
- [x] 4.8 实现 CTA 按钮动态生成（领取权益 / 预约服务 / 沟通助手 / 导航，文案含商户名）
- [x] 4.9 实现 Overlay 返回逻辑：从 CTA 模块返回 Spot 详情（而非关闭 Overlay）
- [x] 4.10 验证：榜单筛选 → 点击 Spot → 查看详情 → 选择商户 → CTA 按钮显示正确 → 点击 CTA 进入模块 → 返回回到 Spot 详情

## Phase 5: AI 服务 + AI 模块

- [x] 5.1 实现 `src/services/gemini.ts`（callGeminiText / callGeminiTTS / callGeminiImage，API Key 从 env 读取）
- [x] 5.2 实现 `src/services/audio.ts`（playPCM16 解码 + AudioContext 播放 + speakText）
- [x] 5.3 实现 `AiConcierge.tsx`（输入框 + 发送 + 流式结果展示 + CTA 上下文透传）
- [x] 5.4 实现 `AiPlanner.tsx`（时间选择 + 兴趣标签 + 性别选择 + 生成按钮）
- [x] 5.5 实现 `AiResult.tsx`（行程结果展示 + 导游预约按钮）
- [x] 5.6 实现 `ArDecoder.tsx`（相机/文件上传 + Gemini 图像识别 + 结果展示）
- [x] 5.7 接入 Mobility 模块的 TTS 播放功能（speakText 调用 callGeminiTTS）
- [x] 5.8 验证：AI 管家问答正常返回 → 行程规划生成微行程 → AR 识别图片 → TTS 播放语音

## Phase 6: 订单 / 支付 / Pass / 核销闭环

- [x] 6.1 实现 `BookingService.tsx`（服务类型/时间/人数/语言选择 + 创建订单 + 订单列表 + 状态展示 + 支付/取消按钮）
- [x] 6.2 实现订单状态机逻辑（pending_payment → paid / failed / cancelled）
- [x] 6.3 实现模拟支付流程（initiateOrderPayment → 900ms 延迟 → handlePaymentCallback）
- [x] 6.4 实现支付签名验证 + paymentCallbackLedger 去重
- [x] 6.5 实现 `PassClaim.tsx`（来源信息展示 + 领取按钮 + QR 码生成 + 有效期 + 重复领取检测）
- [x] 6.6 实现 `PassRedeem.tsx`（Pass ID 输入 + 商户 ID 输入 + 核销按钮 + 过期/已核销检测 + 历史记录）
- [x] 6.7 实现 `RouteDirections.tsx`（Spot + 商户导航信息展示）
- [x] 6.8 验证：Spot CTA → 预约 → 创建订单 → 支付成功 → 订单状态更新；领取 Pass → 显示 QR → 核销成功

## Phase 7: 埋点 + ProfileView + 开发工具 + 收尾

- [x] 7.1 实现 `src/data/events.ts`（EVENT_REQUIRED_FIELDS 定义，18 个事件 + 必填字段）
- [x] 7.2 实现 `useTracking.ts` hook（trackEvent + validateEventPayload + logOperational）
- [x] 7.3 在所有交互节点注入埋点调用（spot_card_click, fusion_overlay_open, cta_click, order_create, payment_success 等）
- [x] 7.4 实现 `ProfileView.tsx`（用户信息、语言设置入口、离线地图开关、支付设置入口、安全信息、开发工具入口）
- [x] 7.5 实现语言设置 Overlay（6 语言列表，点击切换）
- [x] 7.6 实现 `RouteView.tsx`（已保存行程展示）
- [x] 7.7 实现 `AnalyticsFunnel.tsx`（数据漏斗面板：曝光 → 点击 → CTA → 支付 → 核销）
- [x] 7.8 实现 `ReleaseGate.tsx`（P0 发布门禁 QA smoke 检查清单）
- [x] 7.9 最终视觉对比：与原型 HTML 逐页对比，修复样式差异
- [x] 7.10 验证：完整主闭环走通（榜单 → Spot → CTA → 预约/Pass → 支付/核销），埋点数据正确记录
