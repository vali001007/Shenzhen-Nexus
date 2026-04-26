# Gemini聊天接口 /api/v1beta/models/{model}:generateContent

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /gemini_cli/v1beta/models/gemini-2.5-pro:generateContent:
    post:
      summary: Gemini聊天接口 /api/v1beta/models/{model}:generateContent
      deprecated: false
      description: |
        Gemini API 主入口，支持流式和非流式响应。
        **支持的模型：**
        - gemini-2.5-pro (Pro 2.5)
        - gemini-3-pro-preview (Pro 3 Preview)
        - gemini-3.1-pro-preview (Pro 3.1 Preview)
      operationId: claudeMessages
      tags:
        - AI Model API/Gemini API
        - Claude API
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClaudeRequest'
            examples:
              basic:
                value:
                  contents:
                    - role: user
                      parts:
                        - text: 你好
                  generationConfig:
                    maxOutputTokens: 8192
                summary: 基础请求
              streaming:
                value:
                  model: claude-sonnet-4-20250514
                  messages:
                    - role: user
                      content: 你好
                  max_tokens: 1024
                  stream: true
                summary: 流式请求
              with_system:
                value:
                  model: claude-opus-4-5-20251101
                  system: 你是一个专业的Python开发者
                  messages:
                    - role: user
                      content: 写一个快速排序
                  max_tokens: 2048
                  stream: true
                summary: 带 System Prompt
              multi_turn:
                value:
                  model: claude-sonnet-4-20250514
                  messages:
                    - role: user
                      content: 我叫小明
                    - role: assistant
                      content: 你好小明！有什么可以帮你的吗？
                    - role: user
                      content: 我叫什么名字？
                  max_tokens: 1024
                summary: 多轮对话
      responses:
        '200':
          description: 成功响应
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClaudeResponse'
          headers: {}
          x-apifox-name: ''
        '400':
          description: 请求参数错误
          headers: {}
          x-apifox-name: ''
        '401':
          description: 认证失败
          headers: {}
          x-apifox-name: ''
        '402':
          description: 余额不足
          headers: {}
          x-apifox-name: ''
        '429':
          description: 请求过于频繁
          headers: {}
          x-apifox-name: ''
        '500':
          description: 服务器内部错误
          headers: {}
          x-apifox-name: ''
      security: []
      x-apifox-folder: AI Model API/Gemini API
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7818069/apis/api-417346561-run
components:
  schemas:
    ClaudeRequest:
      type: object
      required:
        - model
        - messages
        - max_tokens
      properties:
        model:
          type: string
          description: 模型名称（动态配置，不限定枚举值）
          examples:
            - claude-sonnet-4-20250514
        messages:
          type: array
          description: 消息列表
          items:
            $ref: '#/components/schemas/ClaudeMessage'
        max_tokens:
          type: integer
          description: 最大输出 Token 数
          examples:
            - 1024
        stream:
          type: boolean
          description: 是否启用流式输出（SSE）
          default: false
        system:
          description: 系统提示词，支持字符串或结构化数组
          oneOf:
            - type: string
              examples:
                - 你是一个专业的开发者
            - type: array
              items:
                type: object
                properties:
                  type:
                    type: string
                    examples:
                      - text
                  text:
                    type: string
                  cache_control:
                    type: object
                    properties:
                      type:
                        type: string
                        examples:
                          - ephemeral
                    x-apifox-orders:
                      - type
                    x-apifox-ignore-properties: []
                x-apifox-orders:
                  - type
                  - text
                  - cache_control
                x-apifox-ignore-properties: []
        temperature:
          type: number
          minimum: 0
          maximum: 1
          description: 温度参数（0-1）
          default: 1
        top_p:
          type: number
          minimum: 0
          maximum: 1
          description: 核采样参数（0-1）
        top_k:
          type: integer
          description: Top-K 采样参数
      x-apifox-orders:
        - model
        - messages
        - max_tokens
        - stream
        - system
        - temperature
        - top_p
        - top_k
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
    ClaudeMessage:
      type: object
      required:
        - role
        - content
      properties:
        role:
          type: string
          enum:
            - user
            - assistant
          description: 消息角色
        content:
          description: 消息内容，支持纯文本字符串或内容块数组（多模态）
          oneOf:
            - type: string
              examples:
                - 你好
            - type: array
              items:
                type: object
                properties:
                  type:
                    type: string
                    description: 内容类型（text, image 等）
                    examples:
                      - text
                  text:
                    type: string
                  cache_control:
                    type: object
                    properties:
                      type:
                        type: string
                        examples:
                          - ephemeral
                    x-apifox-orders:
                      - type
                    x-apifox-ignore-properties: []
                x-apifox-orders:
                  - type
                  - text
                  - cache_control
                x-apifox-ignore-properties: []
      x-apifox-orders:
        - role
        - content
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
    ClaudeResponse:
      type: object
      properties:
        id:
          type: string
          description: 响应 ID
          examples:
            - msg_01XFDUDYJgAACzvnptvVoYEL
        type:
          type: string
          enum:
            - message
        role:
          type: string
          enum:
            - assistant
        content:
          type: array
          items:
            type: object
            properties:
              type:
                type: string
                examples:
                  - text
              text:
                type: string
            x-apifox-orders:
              - type
              - text
            x-apifox-ignore-properties: []
        model:
          type: string
          description: 实际使用的模型
          examples:
            - claude-sonnet-4-20250514
        stop_reason:
          type: string
          description: 停止原因
          enum:
            - end_turn
            - max_tokens
            - stop_sequence
            - tool_use
          examples:
            - end_turn
        usage:
          $ref: '#/components/schemas/ClaudeUsage'
      x-apifox-orders:
        - id
        - type
        - role
        - content
        - model
        - stop_reason
        - usage
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
    ClaudeUsage:
      type: object
      description: Token 使用统计
      properties:
        input_tokens:
          type: integer
          description: 输入 Token 数
          examples:
            - 25
        output_tokens:
          type: integer
          description: 输出 Token 数
          examples:
            - 150
        cache_read_input_tokens:
          type: integer
          description: 缓存读取 Token 数
          examples:
            - 0
        cache_creation_input_tokens:
          type: integer
          description: 缓存创建 Token 数
          examples:
            - 0
      x-apifox-orders:
        - input_tokens
        - output_tokens
        - cache_read_input_tokens
        - cache_creation_input_tokens
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
  securitySchemes:
    BearerAuth:
      type: bearer
      scheme: bearer
      description: |
        Bearer Token 认证。在 Authorization header 中传入：
        `Authorization: Bearer {token}`
servers:
  - url: https://api.with7.cn
    description: 正式环境
security: []

```