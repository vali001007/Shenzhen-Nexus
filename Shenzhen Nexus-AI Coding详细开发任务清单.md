## Shenzhen Nexus AI Coding 详细开发任务清单（工作底稿）

### 0. 当前完成范围

- **当前任务ID**：`finalize-ai-coding-checklist`
- **当前目标**：落盘并完成最终校对，形成可直接执行与验收的定版清单
- **事实来源**：
  - `Shenzhen Nexus-PRD大纲.md`
  - `Shenzhen Nexus-技术实施任务清单.md`
  - 本文档第 1~14 节（任务卡、排期、依赖、DoD）

---

### 1. 能力映射矩阵（PRD × 技术清单）

| 能力ID | PRD能力点（章节） | 技术实施任务映射 | 优先级 | 建议Phase | 关键输出 | 验收信号 |
|---|---|---|---|---|---|---|
| C01 | 首页与 APEC 专属模式（7.1） | 前端工程化与架构拆分（3.1） | P0 | Phase 1 | APEC 模式入口、全局布局与路由 | 首页主入口可达，模块跳转可用 |
| C02 | AI Concierge（7.2） | AI 与多模态服务（4.5）+ 前端页面（3.4） | P0 | Phase 1 | 问答接口与前端会话页面 | 问答可达，成功率可观测 |
| C03 | 实时翻译/对讲机（7.3） | AI 与多模态服务（4.5） | P1 | Phase 2 | 实时翻译与TTS接口接入 | 翻译触发成功、语音播报可用 |
| C04 | AI 微行程（7.4） | AI 与多模态服务（4.5） | P0 | Phase 1 | 结构化微行程输出 | 生成成功率与后续点击可统计 |
| C05 | AR 解码（7.5） | AI 与多模态服务（4.5） | P0 | Phase 1 | 菜单/招牌解码接口与结果渲染 | 识别结果可返回并可展示 |
| C06 | Top Spots 融合榜单（7.6） | 榜单页任务（3.2）+ 融合链路服务（4.3） | P0 | Phase 1 | 分类筛选、卡片渲染、榜单接口 | `leaderboard_exposure`、`spot_card_click` 上报有效 |
| C07 | Spot 融合详情层（7.7） | 融合详情层任务（3.3）+ 融合详情接口（4.3） | P0 | Phase 1 | Overlay结构、路径建议、商户列表 | `fusion_overlay_open` 上报有效 |
| C08 | 四类CTA（7.7） | CTA交互与上下文透传（3.3、4.3） | P0 | Phase 1-2 | `Claim Pass/Book Service/Need Translator/Get Directions` | `fusion_cta_click_*` 上报完整 |
| C09 | APEC友好商户系统（7.8） | 商户域服务（4.2）+ 商户前台（3.4） | P1 | Phase 2 | 商户列表/详情、标签能力展示 | 商户详情可达，标签与状态正确 |
| C10 | Concierge+ 服务预约（7.9） | 预约页与订单域（3.4、4.4） | P1 | Phase 2 | 预约下单、订单状态流转 | 下单成功，状态机可追踪 |
| C11 | 国际支付链路（6.1/7.9） | 支付接入与回调验签（4.4） | P0 | Phase 2 | 至少1种国际支付（如Stripe） | 支付成功率可监控，回调验签通过 |
| C12 | Pass 领取与核销（7.10） | Pass与核销域（4.4）+ 页面（3.4） | P1 | Phase 2 | 领券、二维码、核销与防重 | 核销成功可追溯，防重复生效 |
| C13 | Spot-商户关系（7.8/11） | `SpotMerchantRelation` 模型与接口（4.2、5.1） | P0 | Phase 1 | 多对多关系查询与过滤 | 关系配置生效，按条件筛选正确 |
| C14 | 核心数据模型（11） | `Spot/Merchant/Relation/Pass/Redemption`（5.1） | P0 | Phase 1 | 数据表结构与约束 | CRUD可用，字段满足链路要求 |
| C15 | 融合链路埋点（10.2） | 埋点任务（5.2） | P0 | Phase 1-2 | 全链路埋点字典与上报实现 | 事件完整、参数齐全、可归因 |
| C16 | 转化看板（10.1/10.2） | 数据看板任务（5.3） | P1 | Phase 3 | 漏斗看板与分维度报表 | 曝光→点击→CTA→核销漏斗可见 |
| C17 | 运营后台（7.11） | 运营后台任务（6.1） | P1 | Phase 3 | Spot管理、关系管理、活动配置 | 上下线/权重配置可生效 |
| C18 | 商户后台（7.11） | 商户后台任务（6.2） | P1 | Phase 3 | 商户资料、营业能力、权益配置 | 商户自维护链路可用 |
| C19 | 质量保障（DoD） | 自动化测试与稳定性（7.1/7.2） | P0-P1 | 全阶段 | 单测/集成/E2E覆盖主链路 | 主闭环E2E：榜单→详情→CTA→支付/核销通过 |
| C20 | 发布与运维（发布可控） | CI/CD、监控、环境治理（8.1-8.3） | P0-P1 | 全阶段 | 灰度发布、回滚、告警机制 | 发布后核心指标稳定在阈值内 |

---

### 2. 主闭环覆盖校验（Top Spots × APEC 友好商户）

| 闭环步骤 | 对应能力ID | 覆盖状态 | 备注 |
|---|---|---|---|
| 榜单曝光/分类筛选 | C06 | 已覆盖 | 含分类、卡片、榜单接口 |
| 融合详情打开 | C07 | 已覆盖 | 含场景匹配、路线建议、商户列表 |
| CTA触发 | C08 | 已覆盖 | 4类CTA均有上报与透传任务 |
| 预约/支付 | C10/C11 | 已覆盖 | 订单状态机 + 支付回调验签 |
| Pass领取/核销 | C12 | 已覆盖 | 含防重复校验 |
| 行为归因与看板 | C15/C16 | 已覆盖 | 可按Spot/商户归因 |

---

### 3. 依赖关系基线（用于下一任务拆卡）

1. **先数据后页面**：`C13/C14` → `C06/C07/C09`
2. **先闭环后优化**：`C06/C07/C08/C10/C11/C12/C15` → `C16/C17/C18`
3. **上线门槛**：`C19/C20` 与交易链路并行推进，发布前必须满足 DoD

---

### 4. 本任务结论

- 已完成 `build-requirement-matrix`：PRD 能力点与技术任务已建立可追踪映射。
- 映射结果可直接作为下一步 `define-task-card-template` 与 `draft-p0-closed-loop-cards` 的输入基线。

---

### 5. AI Coding 任务卡模板（标准版）

### 5.1 任务卡字段定义

| 字段名 | 是否必填 | 类型 | 取值/格式规范 | 用途说明 |
|---|---|---|---|---|
| `task_id` | 是 | string | `TC-模块缩写-三位序号`，如 `TC-FUS-001` | 全局唯一ID，便于追踪与依赖编排 |
| `task_title` | 是 | string | 动词开头，≤ 20 字 | 一眼识别任务目标 |
| `priority` | 是 | enum | `P0` / `P1` / `P2` | 对齐既有优先级体系 |
| `phase` | 是 | enum | `Phase 1` / `Phase 2` / `Phase 3` | 对齐排期阶段 |
| `module` | 是 | string | 如 `Top Spots`、`Fusion Overlay`、`Order & Payment` | 归属功能域 |
| `objective` | 是 | string | 1~2 句可验证目标 | 描述“做成什么” |
| `input_context` | 是 | list[string] | 引用事实来源文件/章节/能力ID | 限制 AI 在既有范围内执行 |
| `implementation_steps` | 是 | list[string] | 3~7 条、按执行顺序 | AI coding 直接执行步骤 |
| `expected_output` | 是 | list[string] | 产出文件、接口、页面、埋点等 | 明确交付结果 |
| `acceptance_criteria` | 是 | list[string] | 可观察、可测试、可验收 | 避免“完成但不可验收” |
| `dependencies` | 是 | list[string] | 依赖 `task_id` 列表，无则 `[]` | 控制执行顺序 |
| `risk_and_rollback` | 是 | list[string] | 至少 1 条风险 + 1 条回滚 | 保证可恢复性 |
| `observability` | 是 | list[string] | 指标、日志、埋点事件名 | 保障上线后可观测 |
| `status` | 是 | enum | `pending` / `in_progress` / `done` / `blocked` | 任务状态机 |
| `owner_role` | 否 | string | `FE` / `BE` / `QA` / `OPS` / `AI` | 便于分工 |
| `estimate` | 否 | string | 如 `0.5d`、`2d` | 粗粒度工时估算 |

### 5.2 字段约束规则（执行规范）

- **范围约束**：`input_context` 必须引用 `PRD大纲` 或 `技术实施任务清单` 的既有能力，不可新增超范围功能。
- **步骤约束**：`implementation_steps` 只写可执行动作，不写抽象口号；每条必须能对应到可见改动或命令。
- **验收约束**：`acceptance_criteria` 至少包含 1 条“功能可用”与 1 条“数据可观测”。
- **依赖约束**：`dependencies` 仅允许引用已存在 `task_id`；禁止环依赖。
- **状态约束**：同一执行流同一时刻仅允许 1 张任务卡处于 `in_progress`。

### 5.3 任务卡模板（可直接复制）

```markdown
### [TC-XXX-000] 任务标题（动词开头）

- **priority**: P0
- **phase**: Phase 1
- **module**: Top Spots / Fusion Overlay / Order & Payment
- **objective**: （1~2句，可验证目标）
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §x.x
  - Shenzhen Nexus-技术实施任务清单.md §x.x
  - 能力ID: Cxx
- **implementation_steps**:
  1. （步骤1）
  2. （步骤2）
  3. （步骤3）
- **expected_output**:
  - （页面/接口/模型/埋点/文档）
- **acceptance_criteria**:
  - （功能验收）
  - （数据或埋点验收）
- **dependencies**: []
- **risk_and_rollback**:
  - 风险: （一句话）
  - 回滚: （一句话）
- **observability**:
  - 指标: （名称）
  - 埋点: （事件名）
  - 日志: （关键字段）
- **status**: pending
- **owner_role**: FE/BE/QA/OPS/AI
- **estimate**: 1d
```

### 5.4 推荐命名与编号规则

- **模块缩写建议**：
  - `FUS`：融合链路（榜单/详情/CTA）
  - `MER`：商户域
  - `ORD`：订单与支付
  - `PAS`：Pass 与核销
  - `DAT`：数据模型与埋点
  - `OPS`：后台与运维
- **编号顺序**：按 `P0 → P1 → P2` 且 `Phase 1 → 2 → 3` 递增。
- **标题格式**：`动词 + 对象 + 结果`，例如“实现融合详情 CTA 上下文透传”。

### 5.5 与当前计划任务的衔接

- 本模板从下一任务 `draft-p0-closed-loop-cards` 开始强制使用。
- 后续所有任务卡必须显式填写 `acceptance_criteria` 与 `risk_and_rollback`，作为 AI coding 执行前置条件。

---

### 6. 本任务结论（define-task-card-template）

- 已定义统一任务卡字段、约束和模板，可直接用于 AI coding 批量拆卡。
- 已明确编号规则、状态流转与依赖规范，满足排期、分工、验收与追踪需要。

---

### 7. P0 闭环任务卡（榜单到核销全链路）

### 7.1 执行边界

- 仅覆盖已在 PRD 与技术清单中确认的闭环能力，不新增超范围功能。
- 以“可上线最小闭环”为目标，优先打通：`Top Spots` → `Fusion Overlay` → `CTA` → `预约/支付` → `Pass/核销`。
- 所有任务卡均强制包含可观测指标、风险与回滚提示。

### 7.2 任务卡清单（P0 闭环）

### [TC-FUS-001] 实现 Top Spots 榜单分类加载

- **priority**: P0
- **phase**: Phase 1
- **module**: Top Spots
- **objective**: 打通榜单分类筛选与数据渲染，形成闭环入口。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.6
  - Shenzhen Nexus-技术实施任务清单.md §3.2, §4.3
  - 能力ID: C06
- **implementation_steps**:
  1. 定义榜单分类枚举（`all/landmark/tech/culture/food`）与请求参数映射。
  2. 接入榜单接口（分类、排序、分页），实现加载、空态、异常态。
  3. 渲染 Spot 卡片字段（热度、标签、场景匹配、附近商户数）。
  4. 实现分类切换时的数据刷新与状态保持。
- **expected_output**:
  - 榜单页可按分类切换并稳定展示卡片。
  - 分类切换状态与请求参数一致。
- **acceptance_criteria**:
  - 分类切换后列表结果正确，无错乱与重复。
  - 异常场景出现时有可读错误提示且可重试。
- **dependencies**: []
- **risk_and_rollback**:
  - 风险: 分类参数与后端不一致导致空数据。
  - 回滚: 回退到默认 `all` 分类并禁用异常分类入口。
- **observability**:
  - 指标: 榜单加载成功率、分类切换成功率。
  - 埋点: `leaderboard_exposure`, `leaderboard_category_click`。
  - 日志: `requestId`, `category`, `responseCount`, `errorCode`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-FUS-002] 打通 Spot 卡片到 Fusion Overlay

- **priority**: P0
- **phase**: Phase 1
- **module**: Fusion Overlay
- **objective**: 用户点击 Spot 卡片后可稳定进入融合详情层。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.6, §7.7
  - Shenzhen Nexus-技术实施任务清单.md §3.3
  - 能力ID: C06, C07
- **implementation_steps**:
  1. 为 Spot 卡片绑定点击行为与目标 `spotId`。
  2. 打开 Overlay 并拉取详情数据，支持加载态与失败兜底。
  3. 实现 Overlay 关闭、返回列表、重复打开一致性。
  4. 保证语言切换后 Overlay 文案同步刷新。
- **expected_output**:
  - 卡片点击后 1 次交互内打开 Overlay。
  - Overlay 展示 Spot 标题、场景说明基础内容。
- **acceptance_criteria**:
  - `spot_card_click` 与 `fusion_overlay_open` 一一对应可追踪。
  - 连续点击不同 Spot 时内容不串位。
- **dependencies**: ["TC-FUS-001"]
- **risk_and_rollback**:
  - 风险: 快速点击导致 Overlay 内容错绑。
  - 回滚: 启用点击节流 + 仅保留最后一次请求结果。
- **observability**:
  - 指标: Overlay 打开成功率、打开耗时。
  - 埋点: `spot_card_click`, `fusion_overlay_open`。
  - 日志: `spotId`, `openLatencyMs`, `overlayState`, `errorCode`。
- **status**: pending
- **owner_role**: FE
- **estimate**: 1d

### [TC-FUS-003] 完成 Fusion Overlay 内容渲染

- **priority**: P0
- **phase**: Phase 1
- **module**: Fusion Overlay
- **objective**: 在 Overlay 中完整展示场景匹配、消费路径与关联商户。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.7
  - Shenzhen Nexus-技术实施任务清单.md §4.3
  - 能力ID: C07, C09, C13
- **implementation_steps**:
  1. 接入融合详情接口，渲染场景说明与 `Route Idea`。
  2. 渲染关联商户列表（`APEC-Ready`、距离、推荐理由、能力标签）。
  3. 实现商户不可用态（关店/满约）展示与替补提示。
  4. 统一中英双语字段回退逻辑，避免空白文案。
- **expected_output**:
  - Overlay 包含完整内容区与商户承接区。
  - 商户状态变化可在前端正确反映。
- **acceptance_criteria**:
  - 至少 1 个 Spot 可展示完整路径 + 商户列表。
  - 不可用商户不会进入可预约流程。
- **dependencies**: ["TC-FUS-002"]
- **risk_and_rollback**:
  - 风险: 商户字段缺失导致列表渲染异常。
  - 回滚: 采用字段容错映射并降级为基础商户卡。
- **observability**:
  - 指标: 商户区渲染成功率、可用商户占比。
  - 埋点: `fusion_overlay_open`, `merchant_click_from_spot`。
  - 日志: `spotId`, `merchantCount`, `availableMerchantCount`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-FUS-004] 实现四类 CTA 与上下文透传

- **priority**: P0
- **phase**: Phase 1
- **module**: Fusion CTA
- **objective**: 四类 CTA 可触发且携带统一上下文进入后续链路。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.7, §10.2
  - Shenzhen Nexus-技术实施任务清单.md §3.3, §4.3, §5.2
  - 能力ID: C08, C15
- **implementation_steps**:
  1. 为 `Claim Pass/Book Service/Need Translator/Get Directions` 绑定独立事件。
  2. 统一透传字段：`spotId`, `merchantId`, `source`, `lang`, `sessionId`。
  3. 实现 CTA 到目标页面/能力的路由跳转与回跳。
  4. 增加 CTA 不可用态提示（无商户、无服务时段等）。
- **expected_output**:
  - 四类 CTA 全部可点击、可跳转、可回退。
  - CTA 上下文在后续页面可读取。
- **acceptance_criteria**:
  - 四类 CTA 均有事件上报且参数完整。
  - 任一 CTA 失败时不影响 Overlay 其他能力使用。
- **dependencies**: ["TC-FUS-003"]
- **risk_and_rollback**:
  - 风险: 上下文字段不一致导致后续页空白。
  - 回滚: 使用统一 `ctx` 解析器并启用默认回填值。
- **observability**:
  - 指标: CTA 点击率、跳转成功率。
  - 埋点: `fusion_cta_click_pass`, `fusion_cta_click_booking`, `fusion_cta_click_translate`, `fusion_cta_click_map`。
  - 日志: `ctaType`, `spotId`, `merchantId`, `routeTarget`。
- **status**: pending
- **owner_role**: FE
- **estimate**: 1d

### [TC-ORD-001] 打通预约下单最小闭环

- **priority**: P0
- **phase**: Phase 2
- **module**: Order & Booking
- **objective**: 从 `Book Service` 进入预约页并生成有效订单。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.9
  - Shenzhen Nexus-技术实施任务清单.md §3.4, §4.4
  - 能力ID: C10
- **implementation_steps**:
  1. 定义最小下单字段（服务类型、时间段、人数、语言偏好、来源上下文）。
  2. 对接创建订单接口并返回订单号与状态。
  3. 接入订单状态查询，展示待支付/已支付/失败。
  4. 处理订单创建失败重试与取消场景。
- **expected_output**:
  - 预约页可创建订单并进入支付前状态。
  - 订单详情页可显示来源 Spot 与商户信息。
- **acceptance_criteria**:
  - 从 CTA 到下单成功链路可在 3 步内完成。
  - 订单状态机可追踪且无非法跳转。
- **dependencies**: ["TC-FUS-004"]
- **risk_and_rollback**:
  - 风险: 下单字段与后端校验不一致导致失败率高。
  - 回滚: 退回最小必填集并禁用可选扩展字段。
- **observability**:
  - 指标: 下单成功率、下单耗时。
  - 埋点: `fusion_cta_click_booking`, `order_create_success`, `order_create_fail`。
  - 日志: `orderId`, `serviceType`, `timeSlot`, `errorCode`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-ORD-002] 接入国际支付与回调验签

- **priority**: P0
- **phase**: Phase 2
- **module**: Payment
- **objective**: 至少接入 1 种国际支付方式并打通回调验签与订单状态更新。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §6.1, §7.9
  - Shenzhen Nexus-技术实施任务清单.md §4.4
  - 能力ID: C11
- **implementation_steps**:
  1. 接入支付下单与支付确认流程（含前端跳转/回跳）。
  2. 实现服务端支付回调验签与幂等处理。
  3. 支付成功后更新订单状态并通知前端刷新。
  4. 处理支付失败、超时、重复回调场景。
- **expected_output**:
  - 支付成功后订单进入已支付状态。
  - 支付失败可回退并允许重新支付。
- **acceptance_criteria**:
  - 回调验签通过率 100%（合法请求）。
  - 重复回调不会导致重复记账或状态错乱。
- **dependencies**: ["TC-ORD-001"]
- **risk_and_rollback**:
  - 风险: 回调重放导致订单状态污染。
  - 回滚: 开启回调幂等键并暂时切换人工确认模式。
- **observability**:
  - 指标: 支付成功率、支付回调失败率。
  - 埋点: `payment_initiated`, `payment_success`, `payment_fail`。
  - 日志: `orderId`, `paymentIntentId`, `signatureValid`, `callbackRetries`。
- **status**: pending
- **owner_role**: BE/FE
- **estimate**: 2d

### [TC-PAS-001] 实现 Pass 领取与二维码生成

- **priority**: P0
- **phase**: Phase 2
- **module**: Pass
- **objective**: 从 `Claim Pass` 进入领取流程并生成可核销凭证。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.10
  - Shenzhen Nexus-技术实施任务清单.md §3.4, §4.4
  - 能力ID: C12
- **implementation_steps**:
  1. 接入 Pass 领取接口并记录来源上下文。
  2. 生成核销二维码（含过期时间与唯一标识）。
  3. 展示领取成功页与使用说明。
  4. 对重复领取和无资格场景给出友好提示。
- **expected_output**:
  - Pass 领取成功后可展示有效二维码。
  - Pass 记录可与 Spot 来源关联。
- **acceptance_criteria**:
  - 同一用户重复领取策略符合配置预期。
  - 二维码在有效期内可被核销端识别。
- **dependencies**: ["TC-FUS-004"]
- **risk_and_rollback**:
  - 风险: 二维码生成失败导致领取中断。
  - 回滚: 降级展示短码凭证并支持手工输入核销。
- **observability**:
  - 指标: Pass 领取成功率、二维码生成成功率。
  - 埋点: `fusion_cta_click_pass`, `pass_claim_success`, `pass_claim_fail`。
  - 日志: `passId`, `spotId`, `merchantId`, `qrExpireAt`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-PAS-002] 实现到店核销与防重复校验

- **priority**: P0
- **phase**: Phase 2
- **module**: Redemption
- **objective**: 完成核销接口、核销状态变更与防重复校验，形成交易闭环。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.10, §10.2
  - Shenzhen Nexus-技术实施任务清单.md §4.4, §5.2
  - 能力ID: C12, C15
- **implementation_steps**:
  1. 实现核销请求校验（凭证有效期、状态、门店权限）。
  2. 实现核销成功写入与幂等防重复。
  3. 返回核销结果并关联 Spot/商户来源。
  4. 覆盖异常场景：过期、重复、无权限、网络重试。
- **expected_output**:
  - 核销成功后 Pass 状态变更为已使用。
  - 核销记录可用于后续归因统计。
- **acceptance_criteria**:
  - 重复核销被稳定拦截且不重复记账。
  - `redeem_success_by_spot` 可按 Spot 维度查询。
- **dependencies**: ["TC-PAS-001", "TC-ORD-002"]
- **risk_and_rollback**:
  - 风险: 高并发下重复核销未完全拦截。
  - 回滚: 临时启用串行核销锁并降速处理。
- **observability**:
  - 指标: 核销成功率、重复核销拦截率。
  - 埋点: `redeem_success_by_spot`, `redeem_fail`。
  - 日志: `redemptionId`, `passId`, `merchantId`, `dedupeKey`。
- **status**: pending
- **owner_role**: BE/OPS
- **estimate**: 1.5d

### [TC-DAT-001] 落地闭环关键埋点与归因字段

- **priority**: P0
- **phase**: Phase 2
- **module**: Data & Attribution
- **objective**: 打通榜单到核销的全链路埋点，确保每步可归因。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §10.1, §10.2
  - Shenzhen Nexus-技术实施任务清单.md §5.2, §5.3
  - 能力ID: C15, C16
- **implementation_steps**:
  1. 定义统一事件字段：`sessionId`, `spotId`, `merchantId`, `ctaType`, `orderId`, `passId`。
  2. 在榜单、详情、CTA、订单、支付、核销节点补齐事件上报。
  3. 建立事件校验脚本，检查必填参数完整性。
  4. 输出首版漏斗口径说明（曝光→点击→CTA→支付/核销）。
- **expected_output**:
  - 全链路事件可在分析系统连续串联。
  - 可按 Spot/商户维度查看转化。
- **acceptance_criteria**:
  - 关键事件缺失率低于约定阈值。
  - 任一订单或核销记录均可追溯上游 Spot 来源。
- **dependencies**: ["TC-FUS-004", "TC-ORD-002", "TC-PAS-002"]
- **risk_and_rollback**:
  - 风险: 事件字段不统一导致归因断链。
  - 回滚: 启用事件网关映射层统一字段。
- **observability**:
  - 指标: 事件完整率、链路归因成功率。
  - 埋点: `leaderboard_exposure`, `spot_card_click`, `fusion_overlay_open`, `fusion_cta_click_*`, `merchant_click_from_spot`, `redeem_success_by_spot`。
  - 日志: `eventName`, `eventVersion`, `missingFields`。
- **status**: pending
- **owner_role**: FE/BE/DA
- **estimate**: 1d

### [TC-QA-001] 验证主闭环 E2E 可发布

- **priority**: P0
- **phase**: Phase 2
- **module**: QA & Release Gate
- **objective**: 形成“榜单→详情→CTA→支付/核销”的自动化发布门禁。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §8.2, §10.2
  - Shenzhen Nexus-技术实施任务清单.md §7.1, §10
  - 能力ID: C19, C20
- **implementation_steps**:
  1. 编写主闭环 E2E 用例（含成功路径与关键失败路径）。
  2. 将 E2E 接入 CI，设置发布前必过规则。
  3. 增加冒烟用例：榜单可用、Overlay可开、CTA可触发、支付回调可达、核销可成功。
  4. 输出发布门禁报告模板。
- **expected_output**:
  - 主闭环 E2E 用例在测试环境稳定通过。
  - CI 对闭环失败可阻断发布。
- **acceptance_criteria**:
  - 每次发布前自动执行并产出可追溯报告。
  - 门禁失败时可定位到具体链路步骤。
- **dependencies**: ["TC-DAT-001"]
- **risk_and_rollback**:
  - 风险: 用例不稳定导致误阻断发布。
  - 回滚: 临时启用人工审批白名单并并行修复不稳定用例。
- **observability**:
  - 指标: E2E 通过率、发布阻断次数。
  - 埋点: `e2e_run_start`, `e2e_run_fail`, `e2e_run_pass`。
  - 日志: `pipelineId`, `caseId`, `failedStep`。
- **status**: pending
- **owner_role**: QA/OPS
- **estimate**: 1d

### 7.3 执行顺序建议（严格按依赖）

1. `TC-FUS-001` → 2. `TC-FUS-002` → 3. `TC-FUS-003` → 4. `TC-FUS-004`
2. `TC-ORD-001` → 6. `TC-ORD-002`
3. `TC-PAS-001` → 8. `TC-PAS-002`
4. `TC-DAT-001` → 10. `TC-QA-001`

---

### 8. 本任务结论（draft-p0-closed-loop-cards）

- 已完成 10 张 P0 闭环任务卡，覆盖从榜单到核销的完整执行链路。
- 每张任务卡均包含目标、输入、步骤、产出、验收、依赖、风险回滚与可观测性字段，可直接用于 AI coding 执行。

---

### 9. P1/P2 任务卡（后台、优化与扩展能力）

### 9.1 执行边界

- 仅扩展 PRD 与技术清单已定义能力：后台治理、推荐优化、多语与体验增强、稳定性与运维。
- P1 目标：支撑 V1.1 可运营、可分析、可持续发布。
- P2 目标：提升效率、规模化与商业化能力，不阻塞首版上线。

### 9.2 P1 任务卡清单（核心增强）

### [TC-TRN-101] 接入实时翻译与语音播报能力

- **priority**: P1
- **phase**: Phase 2
- **module**: Translation & TTS
- **objective**: 打通 `Need Translator` 的实时翻译与语音播报闭环。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.3, §7.7
  - Shenzhen Nexus-技术实施任务清单.md §4.5
  - 能力ID: C03, C08
- **implementation_steps**:
  1. 接入翻译接口与 TTS 接口，定义统一请求/响应结构。
  2. 在 CTA 入口与翻译页打通上下文透传与回跳。
  3. 增加长句分段、超时重试与失败降级文案。
  4. 增加常用短语收藏与快速播报入口。
- **expected_output**:
  - 翻译页可完成双向翻译与播报。
  - CTA 到翻译能力链路稳定可用。
- **acceptance_criteria**:
  - 关键语种（中英）翻译成功率达标。
  - TTS 播报失败时可回退文本展示且不中断流程。
- **dependencies**: ["TC-FUS-004"]
- **risk_and_rollback**:
  - 风险: 实时翻译延迟高影响体验。
  - 回滚: 降级为文本翻译优先，关闭自动播报。
- **observability**:
  - 指标: 翻译成功率、平均响应时长、TTS 成功率。
  - 埋点: `fusion_cta_click_translate`, `translate_success`, `translate_fail`。
  - 日志: `langPair`, `latencyMs`, `ttsEnabled`, `errorCode`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-MER-101] 增强商户详情与可承接能力展示

- **priority**: P1
- **phase**: Phase 2
- **module**: Merchant Front
- **objective**: 完善商户详情页，突出 APEC 标签与可承接服务能力。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.8
  - Shenzhen Nexus-技术实施任务清单.md §3.4, §4.2
  - 能力ID: C09
- **implementation_steps**:
  1. 渲染商户详情核心字段：标签、支付能力、语种能力、营业状态。
  2. 接入商户服务时段与可预约资源展示。
  3. 增加从 Spot 来源进入时的路径说明与推荐理由。
  4. 完成商户页到预约/导航/Pass 的快捷操作。
- **expected_output**:
  - 商户详情页具备完整承接信息。
  - 从 Spot 到商户的意图迁移顺畅。
- **acceptance_criteria**:
  - 标签与营业状态展示准确。
  - 从商户页进入预约链路成功率达标。
- **dependencies**: ["TC-FUS-003", "TC-ORD-001"]
- **risk_and_rollback**:
  - 风险: 商户字段异构导致渲染不稳定。
  - 回滚: 启用详情页字段白名单与缺省值策略。
- **observability**:
  - 指标: 商户详情打开率、详情到预约转化率。
  - 埋点: `merchant_click_from_spot`, `merchant_detail_open`, `merchant_to_booking_click`。
  - 日志: `merchantId`, `sourceSpotId`, `businessStatus`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1d

### [TC-REL-101] 落地商户不可用降级与替补策略

- **priority**: P1
- **phase**: Phase 2
- **module**: Relation Strategy
- **objective**: 在关店、满约、拥挤场景下自动替补商户，保证链路不中断。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.7, §12.2
  - Shenzhen Nexus-技术实施任务清单.md §4.3
  - 能力ID: C07, C13
- **implementation_steps**:
  1. 定义商户不可用规则（关店/满约/拥挤阈值）。
  2. 在融合详情接口增加替补商户返回逻辑。
  3. 前端增加“已替换商户”提示与可解释文案。
  4. 输出降级策略开关，支持线上快速启停。
- **expected_output**:
  - 不可用商户自动降级到可替补商户。
  - 用户可感知替补原因，不产生黑盒感。
- **acceptance_criteria**:
  - 不可用场景下 CTA 可继续触发。
  - 替补策略命中率与成功率可统计。
- **dependencies**: ["TC-FUS-003"]
- **risk_and_rollback**:
  - 风险: 替补逻辑误判导致推荐质量下降。
  - 回滚: 一键切回原始排序并仅展示人工置顶商户。
- **observability**:
  - 指标: 替补触发率、替补后转化率。
  - 埋点: `merchant_fallback_triggered`, `merchant_fallback_accepted`。
  - 日志: `spotId`, `fromMerchantId`, `toMerchantId`, `fallbackReason`。
- **status**: pending
- **owner_role**: BE/FE
- **estimate**: 1d

### [TC-DAT-101] 建立融合漏斗看板与归因报表

- **priority**: P1
- **phase**: Phase 3
- **module**: Analytics
- **objective**: 输出 Spot/商户/时段维度漏斗看板，支撑运营决策。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §10.1, §10.2
  - Shenzhen Nexus-技术实施任务清单.md §5.3
  - 能力ID: C16
- **implementation_steps**:
  1. 确认漏斗口径：曝光→点击→CTA→下单/支付→核销。
  2. 建立 Spot/商户/时段三维统计视图。
  3. 输出看板筛选能力与导出报表能力。
  4. 标注数据延迟与口径版本信息。
- **expected_output**:
  - 可视化漏斗看板上线。
  - 可按 Spot 与商户分析转化差异。
- **acceptance_criteria**:
  - 看板口径与埋点事件一致。
  - 核心指标可追溯到原始事件。
- **dependencies**: ["TC-DAT-001"]
- **risk_and_rollback**:
  - 风险: 指标口径不一致导致运营误判。
  - 回滚: 锁定单一口径版本并暂停导出功能。
- **observability**:
  - 指标: 看板查询成功率、报表导出成功率。
  - 埋点: `dashboard_view`, `dashboard_filter_apply`, `dashboard_export`。
  - 日志: `metricName`, `dimension`, `queryLatencyMs`。
- **status**: pending
- **owner_role**: DA/BE/OPS
- **estimate**: 1.5d

### [TC-OPS-101] 建设运营后台 Spot 与关系管理

- **priority**: P1
- **phase**: Phase 3
- **module**: Operations Admin
- **objective**: 支持 Spot 上下线、排序、分类与 Spot-商户关系配置。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.11
  - Shenzhen Nexus-技术实施任务清单.md §6.1
  - 能力ID: C17
- **implementation_steps**:
  1. 实现 Spot 列表与上下线管理。
  2. 实现 Spot-商户绑定/解绑与权重编辑。
  3. 增加变更审计日志与操作回滚入口。
  4. 配置变更后触发前台缓存刷新。
- **expected_output**:
  - 运营可在后台完成核心内容编排。
  - 配置变更可快速生效并可审计。
- **acceptance_criteria**:
  - 关系配置后前台推荐结果可验证变化。
  - 关键操作具备审计记录。
- **dependencies**: ["TC-REL-101", "TC-DAT-001"]
- **risk_and_rollback**:
  - 风险: 配置误操作影响前台推荐。
  - 回滚: 支持最近版本一键回滚。
- **observability**:
  - 指标: 后台操作成功率、配置生效率。
  - 埋点: `ops_spot_update`, `ops_relation_update`, `ops_rollback`。
  - 日志: `operatorId`, `changeSetId`, `publishStatus`。
- **status**: pending
- **owner_role**: FE/BE/OPS
- **estimate**: 2d

### [TC-OPS-102] 建设商户后台资料与权益配置

- **priority**: P1
- **phase**: Phase 3
- **module**: Merchant Admin
- **objective**: 让商户可自维护资料、营业能力、优惠权益与核销视图。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §7.11
  - Shenzhen Nexus-技术实施任务清单.md §6.2
  - 能力ID: C18
- **implementation_steps**:
  1. 实现商户资料编辑、APEC 标签维护。
  2. 实现营业时段、可承接服务、优惠权益配置。
  3. 接入订单与核销查询视图。
  4. 增加审核状态提示与提交校验。
- **expected_output**:
  - 商户可完成基础自运营配置。
  - 商户可查看承接效果与核销结果。
- **acceptance_criteria**:
  - 商户配置更新后前台展示一致。
  - 订单/核销视图数据与主系统一致。
- **dependencies**: ["TC-MER-101", "TC-PAS-002"]
- **risk_and_rollback**:
  - 风险: 商户误配置导致展示异常。
  - 回滚: 配置提交前校验 + 版本回退。
- **observability**:
  - 指标: 商户配置提交成功率、审核通过率。
  - 埋点: `merchant_admin_submit`, `merchant_admin_approve`, `merchant_admin_reject`。
  - 日志: `merchantId`, `submitPayloadVersion`, `reviewResult`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-DEV-101] 完成监控告警与值班响应机制

- **priority**: P1
- **phase**: Phase 3
- **module**: DevOps & Monitoring
- **objective**: 对支付成功率、CTA 转化率、核销成功率建立告警与响应闭环。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §12.1, §12.2
  - Shenzhen Nexus-技术实施任务清单.md §8.2
  - 能力ID: C20
- **implementation_steps**:
  1. 配置核心 SLI/SLO 与阈值。
  2. 建立告警分级与通知渠道（即时+日报）。
  3. 制定值班响应流程与故障升级路径。
  4. 演练一次支付或核销异常应急流程。
- **expected_output**:
  - 核心链路异常可在阈值内被发现。
  - 告警到响应具备标准流程。
- **acceptance_criteria**:
  - 告警误报率和漏报率在可控范围。
  - 演练记录完整并形成复盘结论。
- **dependencies**: ["TC-QA-001", "TC-DAT-101"]
- **risk_and_rollback**:
  - 风险: 阈值设置不合理导致告警风暴。
  - 回滚: 启用静默窗口并回退到基础阈值模板。
- **observability**:
  - 指标: MTTD、MTTR、告警触发次数。
  - 埋点: `alert_triggered`, `incident_ack`, `incident_resolved`。
  - 日志: `alertId`, `severity`, `owner`, `resolveDuration`。
- **status**: pending
- **owner_role**: OPS/BE
- **estimate**: 1d

### [TC-QA-101] 完成弱网兼容与高峰压测验证

- **priority**: P1
- **phase**: Phase 3
- **module**: Quality & Performance
- **objective**: 验证 APEC 场景下弱网和高并发条件的主链路稳定性。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §12.2
  - Shenzhen Nexus-技术实施任务清单.md §7.2
  - 能力ID: C19, C20
- **implementation_steps**:
  1. 定义弱网场景（高延迟、丢包、抖动）测试矩阵。
  2. 对主闭环执行兼容测试并记录失败点。
  3. 完成高峰压测并输出容量边界。
  4. 对高风险接口增加超时与重试策略建议。
- **expected_output**:
  - 弱网与高并发下的稳定性报告。
  - 容量上限与扩容建议。
- **acceptance_criteria**:
  - 主闭环关键步骤在目标 SLA 内。
  - 压测报告可用于上线容量评审。
- **dependencies**: ["TC-QA-001", "TC-DEV-101"]
- **risk_and_rollback**:
  - 风险: 压测环境与生产差异过大。
  - 回滚: 采用分层压测并校准环境参数后重测。
- **observability**:
  - 指标: P95 延迟、错误率、吞吐量。
  - 埋点: `perf_test_run`, `perf_test_fail`, `perf_test_pass`。
  - 日志: `scenarioId`, `qps`, `errorRate`, `bottleneckService`。
- **status**: pending
- **owner_role**: QA/OPS/BE
- **estimate**: 1.5d

### 9.3 P2 任务卡清单（优化与扩展）

### [TC-REC-201] 上线推荐策略 AB 实验能力

- **priority**: P2
- **phase**: Phase 3
- **module**: Recommendation Optimization
- **objective**: 对 Spot-商户推荐策略进行 AB 实验，验证转化提升。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §6.2, §10.1
  - Shenzhen Nexus-技术实施任务清单.md §5.3, §6.1
  - 能力ID: C16, C17
- **implementation_steps**:
  1. 定义对照组/实验组与分流规则。
  2. 增加策略版本配置与灰度发布。
  3. 输出实验结果对比报表。
  4. 形成策略升级/回退流程。
- **expected_output**:
  - 推荐策略支持受控实验。
  - 运营可查看实验指标差异。
- **acceptance_criteria**:
  - 实验分流准确且可复现。
  - 指标显著性分析可导出。
- **dependencies**: ["TC-DAT-101", "TC-OPS-101"]
- **risk_and_rollback**:
  - 风险: 实验流量分配错误影响主业务。
  - 回滚: 一键切回对照策略并冻结实验。
- **observability**:
  - 指标: 实验组转化率、提升幅度。
  - 埋点: `ab_assign`, `ab_result_export`。
  - 日志: `experimentId`, `variant`, `conversionDelta`。
- **status**: pending
- **owner_role**: DA/BE/OPS
- **estimate**: 1.5d

### [TC-USR-201] 增加收藏、历史与偏好同步

- **priority**: P2
- **phase**: Phase 3
- **module**: User Growth
- **objective**: 增加用户收藏与历史行程能力，为个性化推荐提供基础数据。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §6.2
  - Shenzhen Nexus-技术实施任务清单.md §3.4
  - 能力ID: C16
- **implementation_steps**:
  1. 定义收藏与历史记录数据结构。
  2. 接入收藏/取消收藏与历史写入接口。
  3. 在个人中心展示收藏与历史列表。
  4. 对接偏好标签生成逻辑。
- **expected_output**:
  - 用户可管理收藏与查看历史。
  - 偏好标签可用于后续推荐。
- **acceptance_criteria**:
  - 收藏与历史数据一致性可验证。
  - 个人中心列表分页与筛选可用。
- **dependencies**: ["TC-MER-101"]
- **risk_and_rollback**:
  - 风险: 历史数据量上升影响查询性能。
  - 回滚: 增量加载 + 最近 N 条策略。
- **observability**:
  - 指标: 收藏渗透率、历史访问率。
  - 埋点: `favorite_add`, `favorite_remove`, `history_open`。
  - 日志: `userId`, `itemId`, `actionType`。
- **status**: pending
- **owner_role**: FE/BE
- **estimate**: 1.5d

### [TC-I18N-201] 扩展多语种资源与合规文案

- **priority**: P2
- **phase**: Phase 3
- **module**: i18n & Compliance
- **objective**: 扩展日/法/西/俄语种并补齐隐私、Cookie 等合规文案。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §6.2
  - Shenzhen Nexus-技术实施任务清单.md §3.5, §7.3
  - 能力ID: C03, C20
- **implementation_steps**:
  1. 新增语种词典与回退策略。
  2. 补齐关键页面合规文案多语版本。
  3. 增加语言切换一致性检查脚本。
  4. 完成多语文案审核与版本发布。
- **expected_output**:
  - 核心页面支持新增语种切换。
  - 合规文案在多语场景完整可见。
- **acceptance_criteria**:
  - 核心页面无缺失 key。
  - 合规页面多语内容可审计。
- **dependencies**: ["TC-TRN-101"]
- **risk_and_rollback**:
  - 风险: 文案 key 缺失导致界面回退异常。
  - 回滚: 启用默认英语回退并锁定新增语种入口。
- **observability**:
  - 指标: 多语切换成功率、缺失 key 率。
  - 埋点: `lang_switch`, `i18n_missing_key`。
  - 日志: `lang`, `page`, `missingKeys`。
- **status**: pending
- **owner_role**: FE/OPS
- **estimate**: 1d

### [TC-FIN-201] 建立佣金分润与财务对账报表

- **priority**: P2
- **phase**: Phase 3
- **module**: Settlement
- **objective**: 打通订单到分润结算数据链，支持商户对账。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §3.1, §7.10
  - Shenzhen Nexus-技术实施任务清单.md §4.4
  - 能力ID: C11, C12
- **implementation_steps**:
  1. 定义分润规则与结算周期。
  2. 建立订单-核销-分润映射关系。
  3. 生成商户对账报表与异常账单列表。
  4. 增加人工校正与复核流程。
- **expected_output**:
  - 商户可查看周期性结算结果。
  - 异常账单可定位和修复。
- **acceptance_criteria**:
  - 对账结果与交易流水一致。
  - 异常账单处理流程闭环可追踪。
- **dependencies**: ["TC-PAS-002", "TC-OPS-102"]
- **risk_and_rollback**:
  - 风险: 分润口径偏差引发财务争议。
  - 回滚: 暂时冻结自动结算，切换人工复核。
- **observability**:
  - 指标: 对账一致率、异常账单率。
  - 埋点: `settlement_generate`, `settlement_adjust`。
  - 日志: `statementId`, `merchantId`, `deltaAmount`。
- **status**: pending
- **owner_role**: BE/OPS/FIN
- **estimate**: 2d

### [TC-PERF-201] 完成前后端缓存与资源优化

- **priority**: P2
- **phase**: Phase 3
- **module**: Performance Optimization
- **objective**: 优化关键页面与接口性能，降低高峰期响应压力。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §12.2
  - Shenzhen Nexus-技术实施任务清单.md §7.2
  - 能力ID: C20
- **implementation_steps**:
  1. 识别高频接口并加缓存策略。
  2. 优化前端静态资源加载与缓存控制。
  3. 对榜单与详情接口增加分页/增量返回。
  4. 输出性能优化前后对比报告。
- **expected_output**:
  - 关键页面首屏与交互时延下降。
  - 高峰请求下错误率下降。
- **acceptance_criteria**:
  - P95 延迟达到目标阈值。
  - 资源加载失败率显著下降。
- **dependencies**: ["TC-QA-101"]
- **risk_and_rollback**:
  - 风险: 缓存不一致导致展示旧数据。
  - 回滚: 缩短 TTL 并启用手动刷新策略。
- **observability**:
  - 指标: Cache 命中率、P95 延迟、错误率。
  - 埋点: `cache_hit`, `cache_miss`, `perf_regression_detected`。
  - 日志: `cacheKey`, `ttl`, `latencyMs`, `version`。
- **status**: pending
- **owner_role**: FE/BE/OPS
- **estimate**: 1.5d

### [TC-SEC-201] 完成日志脱敏与访问审计能力

- **priority**: P2
- **phase**: Phase 3
- **module**: Security & Compliance
- **objective**: 建立敏感数据脱敏、访问审计与留痕机制。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §12.1
  - Shenzhen Nexus-技术实施任务清单.md §7.3
  - 能力ID: C20
- **implementation_steps**:
  1. 定义敏感字段清单与脱敏规则。
  2. 在网关与日志管道中实施脱敏。
  3. 建立后台敏感操作审计日志。
  4. 输出月度审计检查模板。
- **expected_output**:
  - 核心日志不暴露敏感信息。
  - 审计记录可回溯到操作者与操作对象。
- **acceptance_criteria**:
  - 抽样日志均符合脱敏规范。
  - 审计查询可按操作人和时间过滤。
- **dependencies**: ["TC-DEV-101"]
- **risk_and_rollback**:
  - 风险: 过度脱敏影响问题排查。
  - 回滚: 启用分级脱敏策略并保留受控明细通道。
- **observability**:
  - 指标: 脱敏覆盖率、审计查询成功率。
  - 埋点: `audit_log_write`, `audit_log_query`。
  - 日志: `actorId`, `action`, `maskedFields`。
- **status**: pending
- **owner_role**: BE/OPS
- **estimate**: 1d

### [TC-BCP-201] 执行备份恢复演练与应急预案校验

- **priority**: P2
- **phase**: Phase 3
- **module**: Reliability
- **objective**: 验证数据库备份恢复链路与高峰应急预案可执行。
- **input_context**:
  - Shenzhen Nexus-PRD大纲.md §12.1, §12.2
  - Shenzhen Nexus-技术实施任务清单.md §8.3
  - 能力ID: C20
- **implementation_steps**:
  1. 执行一次完整备份与恢复演练。
  2. 校验恢复后主闭环关键数据完整性。
  3. 验证应急扩容/降级预案流程。
  4. 输出演练复盘与改进项。
- **expected_output**:
  - 备份恢复流程有证据链与时长数据。
  - 应急预案可执行且责任人清晰。
- **acceptance_criteria**:
  - 恢复结果满足数据一致性要求。
  - 复盘报告包含明确改进闭环。
- **dependencies**: ["TC-PERF-201", "TC-SEC-201"]
- **risk_and_rollback**:
  - 风险: 演练影响线上性能。
  - 回滚: 切换只读窗口并在低峰时段演练。
- **observability**:
  - 指标: 备份成功率、恢复耗时、演练完成率。
  - 埋点: `backup_start`, `backup_success`, `restore_success`, `drill_complete`。
  - 日志: `backupId`, `restorePoint`, `consistencyCheckResult`。
- **status**: pending
- **owner_role**: OPS/DBA/BE
- **estimate**: 1d

### 9.4 执行顺序建议（P1→P2）

- **P1 推荐顺序**：
  1. `TC-TRN-101` → `TC-MER-101` → `TC-REL-101`
  2. `TC-DAT-101` → `TC-OPS-101` → `TC-OPS-102`
  3. `TC-DEV-101` → `TC-QA-101`
- **P2 推荐顺序**：
  1. `TC-REC-201` + `TC-USR-201` + `TC-I18N-201`（可并行）
  2. `TC-FIN-201` → `TC-PERF-201` → `TC-SEC-201` → `TC-BCP-201`

---

### 10. 本任务结论（draft-p1-p2-cards）

- 已完成 P1/P2 任务卡细化，共 16 张，覆盖后台治理、推荐优化、多语扩展、性能与安全运维能力。
- 已与 P0 闭环卡建立依赖衔接，具备直接排期与 AI coding 执行条件。

---

### 11. Phase 排期总览（用于 Sprint 计划）

### 11.1 阶段目标与进入/退出条件

| Phase | 建议周期 | 阶段目标 | 进入条件 | 退出条件 |
|---|---|---|---|---|
| Phase 1 | Week 1-2 | 完成榜单→详情→CTA 的前半闭环 | 工程可构建、核心数据模型可用 | `TC-FUS-001~004` 完成，CTA 全量可触发且可追踪 |
| Phase 2 | Week 3-4 | 完成预约/支付/Pass/核销 + 埋点归因 + 主链路E2E | Phase 1 通过，订单与支付服务可联调 | `TC-ORD-001/002`、`TC-PAS-001/002`、`TC-DAT-001`、`TC-QA-001` 完成 |
| Phase 3 | Week 5-7 | 完成后台治理、看板、稳定性、优化与扩展 | Phase 2 通过，监控和告警基础可用 | P1/P2 任务完成，满足模块 DoD 与上线检查清单 |

### 11.2 优先级容量建议（人天）

| 优先级 | 任务数 | 估算人天 | 使用建议 |
|---|---|---|---|
| P0 | 10 | 约 13.5d | 双周内优先打通交易闭环，不可后移 |
| P1 | 8 | 约 11d | 与 Phase 3 前半并行，确保可运营可监控 |
| P2 | 7 | 约 9.5d | 作为 Phase 3 后半优化包，按资源弹性推进 |
| 合计 | 25 | 约 34d | 建议按 3~4 人并行拆分到 5~7 周 |

### 11.3 Sprint 编排建议（可直接执行）

- **Sprint A（Week 1）**：`TC-FUS-001/002/003`
- **Sprint B（Week 2）**：`TC-FUS-004` + `TC-ORD-001` + `TC-PAS-001`
- **Sprint C（Week 3）**：`TC-ORD-002` + `TC-PAS-002` + `TC-DAT-001`
- **Sprint D（Week 4）**：`TC-QA-001` + `TC-TRN-101` + `TC-MER-101` + `TC-REL-101`
- **Sprint E（Week 5）**：`TC-DAT-101` + `TC-OPS-101` + `TC-OPS-102` + `TC-DEV-101`
- **Sprint F（Week 6-7）**：`TC-QA-101` + 全部 P2（按依赖推进）

---

### 12. 依赖关系与关键路径（跨模块）

### 12.1 关键路径（上线必经）

`TC-FUS-001` → `TC-FUS-002` → `TC-FUS-003` → `TC-FUS-004` → `TC-ORD-001` → `TC-ORD-002` → `TC-PAS-002` → `TC-DAT-001` → `TC-QA-001`

### 12.2 模块依赖矩阵

| 模块 | 上游依赖 | 下游输出 |
|---|---|---|
| Top Spots | 数据模型基础（C13/C14） | Fusion Overlay 上下文输入 |
| Fusion Overlay / CTA | Top Spots | 预约、翻译、导航、Pass 入口 |
| Order & Payment | CTA 上下文透传 | 支付成功状态、订单可追踪 |
| Pass & Redemption | CTA + Payment | 核销记录与交易闭环 |
| Data & Attribution | 全链路业务事件 | 漏斗看板与运营归因 |
| Admin（运营/商户） | Data & Attribution + Relation | 配置生效与业务治理能力 |
| QA/DevOps | 全模块阶段输出 | 发布门禁、监控告警、稳定上线 |

### 12.3 并行执行建议

- **可并行组 A（Phase 2）**：`TC-TRN-101` 与 `TC-QA-001` 可并行（与支付链路解耦）。
- **可并行组 B（Phase 3）**：`TC-REC-201`、`TC-USR-201`、`TC-I18N-201` 可并行。
- **串行约束组**：支付、核销、归因、E2E 门禁必须按关键路径顺序推进。

---

### 13. 模块 DoD（Definition of Done）

### 13.1 Top Spots & Fusion 模块 DoD

- **功能完成**：分类筛选、卡片渲染、Overlay 打开、四类 CTA 全可用。
- **数据完成**：`leaderboard_exposure`、`spot_card_click`、`fusion_overlay_open`、`fusion_cta_click_*` 完整上报。
- **质量完成**：空态/异常态可恢复，连续点击无串位。
- **发布完成**：主流程冒烟通过，关键报错率在阈值内。

### 13.2 交易与核销模块 DoD

- **功能完成**：预约下单、支付回调、Pass 领取、核销防重复全链路可闭环。
- **数据完成**：订单状态机可追踪，`redeem_success_by_spot` 可归因。
- **质量完成**：重复回调与重复核销被幂等拦截。
- **发布完成**：交易失败回退策略可用，异常告警生效。

### 13.3 数据归因与看板模块 DoD

- **功能完成**：漏斗看板可按 Spot/商户/时段筛选。
- **数据完成**：事件字段标准统一，缺失率低于目标阈值。
- **质量完成**：指标口径可审计、可回溯到原始事件。
- **发布完成**：看板查询性能达标并支持导出。

### 13.4 后台治理模块 DoD

- **功能完成**：运营后台可配置 Spot 与关系，商户后台可维护资料与权益。
- **数据完成**：配置变更可追踪，审核流有留痕。
- **质量完成**：误操作可回滚，关键字段有校验。
- **发布完成**：配置变更生效链路可监控。

### 13.5 稳定性与运维模块 DoD

- **功能完成**：CI/CD 门禁、监控告警、备份恢复演练机制具备。
- **数据完成**：告警、演练、审计日志可追溯。
- **质量完成**：弱网与压测报告通过评审。
- **发布完成**：回滚预案可执行，值班流程明确。

---

### 14. 本任务结论（add-schedule-and-dod）

- 已补齐 Phase 排期、关键依赖关系与模块 DoD，形成可直接用于 Sprint 排程与里程碑验收的管理层视图。
- 文档已具备“任务卡执行 + 排期治理 + 验收闭环”三层结构，可直接进入最终校对与发布步骤。

---

### 15. 最终校对与发布确认（finalize-ai-coding-checklist）

### 15.1 结构完整性校对

- **章节完整**：已覆盖能力映射、任务卡模板、P0/P1/P2 任务卡、Phase 排期、依赖关系、模块 DoD。
- **字段完整**：全部任务卡均含 `objective / input_context / implementation_steps / expected_output / acceptance_criteria / dependencies / risk_and_rollback / observability`。
- **命名完整**：任务卡 `task_id` 规则统一（`TC-模块-序号`），无重复编号。

### 15.2 一致性校对

- **范围一致**：全部任务均来源于 `PRD大纲` 与 `技术实施任务清单`，未新增超范围能力。
- **优先级一致**：P0（10 张）/P1（8 张）/P2（7 张）与阶段目标匹配。
- **依赖一致**：关键路径与并行建议无冲突，串并行约束明确。
- **验收一致**：各模块 DoD 与任务卡验收标准可相互映射。

### 15.3 执行就绪检查

- **排期就绪**：可直接按 `Sprint A~F` 分配执行。
- **分工就绪**：任务卡含 `owner_role`，可按 FE/BE/QA/OPS 拆分。
- **治理就绪**：包含发布门禁、监控告警、回滚与审计策略。
- **评审就绪**：文档可直接用于产品评审、技术评审、迭代排期会。

### 15.4 最终交付结论

- `Shenzhen Nexus-AI Coding详细开发任务清单.md` 已完成定版落盘。
- 当前文档可作为 Shenzhen Nexus 后续 AI coding 的唯一执行清单基线（如需改动，按任务卡增量维护）。
