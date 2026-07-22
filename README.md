# SoftReport — 英语作文批阅报告 HTML 生成器

C# 后端集成指南。SoftReport 是一个纯前端 React 应用，将 LFAI 批阅结果 JSON 渲染为带排版的 HTML 页面，供 Playwright 加载并导出为 A4 PDF。

## 快速开始

依赖：Node.js 18+

```bash
# 安装依赖
npm install

# 生产构建（输出到 dist/）
npm run build

# 本地开发（热更新）
npm run dev
```

构建产物位于 `dist/` 目录：

```
dist/
├── index.html          # 自包含 HTML（JS + CSS 已内联）
├── sample-report.json  # 可直接注入的完整示例数据
└── fonts/              # 3 个必需的 HarmonyOS Sans SC 字体
    ├── HarmonyOS_Sans_SC_Regular.ttf
    ├── HarmonyOS_Sans_SC_Medium.ttf
    └── HarmonyOS_Sans_SC_Bold.ttf
```

`index.html` 与 `fonts/` 目录必须保持在同一层级，字体通过相对路径 `./fonts/` 引用。

## 数据契约

所有渲染数据遵循 `docs/export-report-schema.json`（v1），核心数据结构如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `schemaVersion` | `1` | 契约版本号 |
| `meta` | 对象 | 学生/考试元数据 |
| `report.aw` | 对象 | 应用文批阅结果 |
| `report.cw` | 对象 | 读后续写批阅结果 |

报告包含两篇作文（应用文 AW + 读后续写 CW），每篇含四个子模块：

- **`overallEvaluation`**（string）— 整体点评，已翻译为中文
- **`grammarCorrection`** — 语法改错，使用 HTML diff 标注
  - AW 类型：直接为 `string`（全文 inline HTML）
  - CW 类型：`{ para1: string, para2: string }`（分两段）
- **`sentenceImprovements`**（array）— 语句提升列表，每项含 `original` / `optimized` / `reason`
- **`optimizedEssay`** — 改后佳作
  - AW 类型：`{ essay: string, explanation: string }`
  - CW 类型：`{ para1: string, para2: string, explanation: string }`

详细 schema 定义见 [docs/export-report-schema.json](docs/export-report-schema.json)，TypeScript 接口见 [src/types.ts](src/types.ts)。

### Diff 标注约定

`grammarCorrection` 字段中的 HTML 使用以下标签标记修改：

- `<em>错误原文</em>` — 删除/替换的内容（红色背景 + 删除线）
- `<strong>修改结果</strong>` — 修正后的内容（绿色背景 + 加粗）

打印时额外添加边框以辅助黑白阅读。

## C# Playwright 集成

页面加载后从 `window.__INITIAL_DATA__` 读取数据。C# 端通过 Playwright 注入 JSON 并导出 PDF：

```csharp
using Microsoft.Playwright;

// 构建后的 dist/index.html 路径
var distPath = Path.GetFullPath("path/to/SoftReport/dist");
var htmlPath = Path.Combine(distPath, "index.html");

// 示例：读取构建产物旁已生成的 JSON；生产环境替换为实际报告 JSON 路径即可
var sampleDataPath = Path.Combine(distPath, "sample-report.json");
var json = File.ReadAllText(sampleDataPath, Encoding.UTF8);

await using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync(new()
{
    Headless = true,
});

var page = await browser.NewPageAsync(new()
{
    Locale = "zh-CN",
});

// 注入数据 — 必须在导航之前完成
await page.AddInitScriptAsync($@"window.__INITIAL_DATA__ = {json};");

// 加载 HTML（使用 file:// 协议）
await page.GotoAsync($"file:///{htmlPath.Replace("\\", "/")}");

// 等待字体和渲染完成
await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

// 导出 A4 PDF
await page.PdfAsync(new()
{
    Path = "output.pdf",
    Format = "A4",
    PrintBackground = true,
    Margin = new MarginOptions
    {
        Top = "18mm",
        Right = "16mm",
        Bottom = "18mm",
        Left = "16mm",
    },
});
```

要点：

1. **必须使用 `file://` 协议**加载本地 HTML，以保证字体文件能通过相对路径找到。
2. **`AddInitScriptAsync` 必须在 `GotoAsync` 之前调用**，确保页面解析时数据就已就位。
3. **设置 `Locale = "zh-CN"`**，让浏览器优先匹配中文字体回退策略。
4. **`PrintBackground = true`**，保留 diff 标注的背景色。
5. **页边距与设计规范对齐**：上下 18mm，左右 16mm。

### 无数据时的行为

如未注入 `window.__INITIAL_DATA__`，页面显示空状态提示："请通过 C# Playwright 注入报告 JSON 数据后刷新页面"。页面的 `loadReportData()` 函数会先检测全局变量，失败后尝试 fetch `./sample-report.json`（仅开发模式有效）。

### 验证数据格式

可使用项目自带的示例数据进行测试：

```bash
# npm run build 会将 public/sample-report.json 自动复制到下列位置
dist/sample-report.json

# C# 端直接读取该文件并通过 AddInitScriptAsync 注入即可
```

## 打印与分页

- 纸张：**A4 竖版**（210mm × 297mm）
- 分页：两篇作文报告之间 **强制分页**（`page-break-before: always`）
- 节标题与内容尽量保持在同一页内（`page-break-inside: avoid`）
- Diff 标注在打印时保留红绿色 + 添加边框，辅助黑白打印阅读

打印样式全部定义在 `src/App.css` 的 `@media print` 块中。

## 字体

| 字重 | 字体文件 | 用途 |
|------|----------|------|
| 400 (Regular) | `HarmonyOS_Sans_SC_Regular.ttf` | 正文、评语、元数据 |
| 500 (Medium) | `HarmonyOS_Sans_SC_Medium.ttf` | 卡片内小标题 |
| 700 (Bold) | `HarmonyOS_Sans_SC_Bold.ttf` | 报告标题、节标题 |

HarmonyOS Sans SC 内置 Latin 字形，无需额外加载英文字体。构建时会自动从 `fonts/` 复制 3 个必需的字重到 `dist/fonts/`。

## 构建自定义

如果不需要重新构建，直接用已有产物（`dist/` 目录），注意保持后端的 `dist/` 目录结构即可。

需要修改样式或组件时：

```bash
npm run dev      # 本地开发
npm run build    # 重新构建
```

Vite 配置见 `vite.config.ts`，使用 `vite-plugin-singlefile` 将所有 JS/CSS 内联到单一 HTML。

## 项目结构

```
D:\Dev\SoftReport\
├── src/                         # React 源代码
│   ├── main.tsx                 # 入口（注入字体声明）
│   ├── App.tsx                  # 根组件
│   ├── App.css                  # 全部样式（含 print.css）
│   ├── types.ts                 # TypeScript 数据接口
│   ├── report-data.ts           # JSON 加载逻辑
│   └── components/              # 各渲染组件
├── docs/
│   ├── export-report-schema.json  # 数据契约（核心参考）
│   └── DESIGN.md                  # 设计系统文档
├── dist/                        # 构建产物
├── fonts/                       # 字体源文件
├── sample-report.json           # 示例数据
├── package.json
└── vite.config.ts
```

## 相关文档

- [数据契约详细定义](docs/export-report-schema.json)
- [设计系统文档](docs/DESIGN.md)
