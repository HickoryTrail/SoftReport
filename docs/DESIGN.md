# SoftReport 设计系统

> 基于 ui-ux-pro-max 设计智能生成，紫色主色调覆盖，兼容 Soft Modern UI（SaaS Landing）风格。

## 设计模式

- **模式名称**: Hero + Features + CTA（适配为 标题横幅 + 报告卡片 + 页脚信息）
- **CTA 位置**: 无交互 CTA，报告为主体
- **节结构**: Header（报告元数据） > EssayCards（作文报告卡片） > Footer

## 视觉风格

- **风格**: Soft Modern UI（SaaS Landing）- 柔和现代风格
- **关键字**: 紧凑卡片、浅灰紫背景、轻微阴影、圆角矩形、低对比度舒适感
- **最适合**: 教育报告、学术文档、打印输出
- **性能**: 极轻量（纯 CSS，无外部框架）
- **无障碍**: 4.5:1 最小对比度，打印友好

## 色彩系统

所有颜色通过 CSS 自定义属性定义，集中管控。

| 角色 | Hex | CSS 变量 | 用途 |
|------|-----|----------|------|
| Primary | `#7C3AED` | `--clr-primary` | 标题强调、卡片头部色条 |
| Primary Light | `#A78BFA` | `--clr-primary-light` | 悬停色、浅色强调 |
| Primary Dark | `#5B21B6` | `--clr-primary-dark` | 深色强调文字 |
| Secondary | `#8B5CF6` | `--clr-secondary` | 辅助标签色 |
| Background | `#F5F3FF` | `--clr-bg` | 页面背景 |
| Surface | `#FFFFFF` | `--clr-surface` | 卡片背景 |
| Muted | `#EDE9FE` | `--clr-muted` | 标签/分割线底色 |
| Border | `#E0E7FF` | `--clr-border` | 卡片边框 |
| Text Primary | `#1E1B4B` | `--clr-text` | 正文主色 |
| Text Secondary | `#6B7280` | `--clr-text-secondary` | 次要文字 |
| Diff Delete Bg | `#FEE2E2` | `--clr-diff-del-bg` | 删除内容背景 |
| Diff Delete Text | `#DC2626` | `--clr-diff-del-text` | 删除内容文字 |
| Diff Insert Bg | `#D1FAE5` | `--clr-diff-ins-bg` | 修改内容背景 |
| Diff Insert Text | `#059669` | `--clr-diff-ins-text` | 修改内容文字 |
| Warning | `#F59E0B` | `--clr-warning` | 辅助警示色 |
| Error | `#EF4444` | `--clr-error` | 严重标记 |

## 排版

| 层级 | 字体 | 字号 | 字重 | 用途 |
|------|------|------|------|------|
| Main Title | Crimson Pro + HarmonyOS Sans SC | 24px / 20px | 700 / 700 | 报告主标题 |
| Section Title | HarmonyOS Sans SC | 18px | 700 (Bold) | 各节标题（整体点评等） |
| Sub Title | HarmonyOS Sans SC | 15px | 500 (Medium) | 卡片内小标题 |
| Body | HarmonyOS Sans SC | 13px | 400 (Regular) | 正文、评语 |
| Small | HarmonyOS Sans SC | 11px | 400 (Regular) | 元数据、脚注、修改说明标签 |

行高：正文 1.6，标题 1.3。
英文字体回退：HarmonyOS Sans SC 内置 Latin 字形，无需额外加载英文专用字体。

## 布局

- **页面最大宽度**: 960px，居中
- **卡片圆角**: 12px（外层），8px（内嵌区块），6px（标签/Chip）
- **卡片阴影**: `0 1px 3px rgba(0,0,0,0.06)` 屏幕；打印时取消
- **卡片内边距**: 20px
- **元素间距**: 紧凑 8-16px 纵向 rythm
- **颜色条**: 每张作文报告卡片顶部 4px 紫色色条

## 打印规范

- **纸张**: A4 竖版（210mm × 297mm）
- **页边距**: 顶部 18mm，左右 16mm，底部 18mm
- **分页**: 两篇作文报告之间 `page-break-before: always`
- **内容保护**: 节标题+内容 `page-break-inside: avoid`
- **屏幕元素隐藏**: 阴影、背景渐变、交互态在打印时取消
- **Diff 色彩保留**: 打印时 `<em>` / `<strong>` 保留红绿色 + 加边框辅助黑白阅读

## Diff 标注样式

语法改错使用 `<em>` 和 `<strong>` 标记，CSS 渲染如下：

```css
em {
  color: #DC2626;
  text-decoration: line-through;
  background: #FEE2E2;
  border-radius: 4px;
  padding: 1px 6px;
  font-style: normal;
}
strong {
  color: #059669;
  font-weight: 700;
  background: #D1FAE5;
  border-radius: 4px;
  padding: 1px 6px;
}
```

打印时额外添加边框：`<em>` 使用虚线红色边框，`<strong>` 使用实线绿色边框，确保黑白打印时仍可区分。

## 组件树

```
App
├── ReportHeader          — 元数据标题区（考试名称 + 学生信息徽标行）
├── EssayReport (AW)      — 应用文报告卡片
│   ├── SectionTitle        — "应用文批阅报告"
│   ├── OverallEvaluation   — 整体点评段落
│   ├── GrammarCorrection   — 语法改错全文沉浸标注
│   ├── SentenceImprovements— 语句提升列表（原句→改后句→说明）
│   └── OptimizedEssay      — 改后佳作 + 修改说明
├── EssayReport (CW)      — 读后续写报告卡片（结构同 AW，数据格式不同）
└── Footer                — 页脚
```

## 数据驱动

组件根据 JSON 数据条件渲染：无 `overallEvaluation` 则不显示整体点评节，无 `sentenceImprovements` 则不显示语句提升节。所有字段皆可选。

## 避坑指南

- 不使用 emoji 作为图标
- 打印时不显示阴影和背景纹理
- 字体通过 `@font-face` 外部引用，不嵌入 base64（文件过大）
- 不依赖任何 CSS 框架（Tailwind / Bootstrap 等）
- 英语正文与中文正文共用 HarmonyOS Sans SC 字体
- 操作时不依赖本地服务器，`file://` 协议直接打开即可工作
