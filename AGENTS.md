# SoftReport — 英语作文批阅报告 HTML 生成器

## 项目定位

纯前端英语作文批阅报告生成工具。将 `LFAI Export Report` 数据契约 JSON 渲染为带排版的可打印 HTML 页面，供 C# Playwright 无头浏览器加载并导出为 A4 PDF。

## 技术栈

| 层面 | 选择 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 6 + @vitejs/plugin-react |
| 单文件输出 | vite-plugin-singlefile（全部 JS/CSS inline 到 HTML） |
| 样式 | 纯 CSS + CSS Custom Properties |
| 字体 | HarmonyOS Sans SC（SC_Regular / Medium / Bold） |
| 无运行时依赖 | 最终产物只需 dist/index.html + dist/fonts/，浏览器直接打开 |

## 目录结构

```
D:\Dev\SoftReport\
├── src/
│   ├── main.tsx                 # 入口
│   ├── App.tsx                  # 根组件
│   ├── App.css                  # 全部样式（含 print.css）
│   ├── types.ts                 # TypeScript 数据接口
│   ├── report-data.ts           # JSON 加载逻辑
│   └── components/
│       ├── ReportHeader.tsx     # 元数据抬头
│       ├── EssayReport.tsx      # 单篇作文报告容器
│       ├── OverallEvaluation.tsx# 整体点评
│       ├── GrammarCorrection.tsx# 语法改错沉浸标注
│       ├── SentenceImprovements.tsx # 语句提升列表
│       └── OptimizedEssay.tsx   # 改后佳作
├── docs/
│   ├── export-report-schema.json  # 数据契约（核心参考）
│   └── DESIGN.md                  # 设计系统文档
├── fonts/                         # HarmonyOS Sans SC 字体源文件
├── dist/
│   ├── index.html                 # 构建产物（自包含）
│   └── fonts/                     # 构建时复制的字体
├── sample-report.json             # 调试用示例数据
├── index.html                     # Vite 入口 HTML
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── AGENTS.md
```

## 数据契约

所有渲染数据遵循 docs/export-report-schema.json（v1），C# 侧在 Playwright 中通过以下方式注入：

```csharp
// C# Playwright — 注入 JSON 数据
string json = File.ReadAllText("report-data.json");
await page.AddInitScriptAsync($"window.__INITIAL_DATA__ = {json};");
await page.GotoAsync("file:///path/to/dist/index.html");
await page.PdfAsync(new PagePdfOptions {
    Path = "output.pdf",
    Format = "A4",
    PrintBackground = true
});
```

页面加载后从 window.__INITIAL_DATA__ 读取数据，无数据时显示空状态提示。

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热更新，localhost:5173）
npm run dev

# 生产构建
npm run build

# 构建产物预览
npm run preview
```

## 构建说明

- npm run build 执行 Vite 构建 + 将 fonts/ 下 3 个必需字重复制到 dist/fonts/
- 构建产物 dist/index.html 是自包含文件（JS + CSS inline）
- 字体文件通过 CSS @font-face 相对路径引用（./fonts/HarmonyOS_Sans_SC_*.ttf）
- 部署时 index.html 与 fonts/ 目录必须在同一层级

## 打印说明

- 主要用途：A4 竖版 PDF 打印
- 打印样式在 App.css 的 @media print 中定义
- 段落级别分页控制：page-break-before: always 分隔两篇作文报告
- Diff 标注（<em> / <strong>）在打印时保留色彩 + 加边框辅助 B&W 阅读

## 设计规范

详细设计系统见 docs/DESIGN.md。

核心颜色：紫色 Soft Modern UI（#7C3AED 主色），紧凑卡片布局。
