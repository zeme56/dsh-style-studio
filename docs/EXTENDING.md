# 扩展指南 · Extending dsh-style-studio

这套皮肤的扩展点只有一个：**`lib/client.js` 里的 `SKINS` 数组**。皮肤是纯数据，加一套不用碰任何逻辑。

## 5 分钟加一套皮肤

### 1. 在 `SKINS` 数组末尾加一项

```js
{
	id: "dune",                       // 唯一 id：会写进 localStorage 和 <html data-dsh-skin>
	scheme: "light",                  // "light" | "dark"，决定原生控件（滚动条、输入框）的明暗
	font: '"Iowan Old Style", "Noto Serif SC", Georgia, serif',   // 界面字体
	mono: '"JetBrains Mono", "Cascadia Mono", monospace',         // 代码字体
	r: ["2px", "4px", "6px", "10px", "14px"],                     // 圆角：xs / sm / md / lg / panel
	elev: {
		soft:      "0 1px 2px rgba(60, 40, 20, .08)",               // 轻阴影
		panel:     "0 12px 32px -18px rgba(60, 40, 20, .45)",       // 面板阴影
		prominent: "0 24px 60px -80px rgba(60, 40, 20, .6)",        // 弹层阴影
	},
	thumbShadow: "0 0 0 1px #d8c9a8",  // 缩略图外框
	c: {
		base: "#f7efe0",        // 应用底色
		layer: "#fffaf0",       // 卡片 / 消息气泡
		layer2: "#efe4cc",      // 次级面板、工具栏
		overlay: "#fffdf7",     // 菜单、弹层
		sidebar: "#f1e7d2",     // 侧栏
		text: "#2b2118",
		muted: "#6b5b47",
		faint: "#96866d",
		brand: "#b4552d",
		brandHover: "#94401f",
		onBrand: "#fff8ef",
		borderSoft: "#e0d3b8",
		border: "#cbb894",
		borderStrong: "#a98f66",
		hover: "#eee0c4",
		active: "#e5d4b2",
		codeBg: "#2b2118",
		link: "#a0471f",
		error: "#b3261e",
		success: "#3f7d3a",
		warn: "#a8700a",
		focus: "#b4552d",
		scrollbar: "#d9c8a6",
		scrollbarHover: "#c3ad86",
		tooltipBg: "#2b2118",
		tooltipKey: "#453726",
		mask: "rgba(43, 33, 24, 0.32)",
	},
	extras: `
& *::selection { background: #b4552d; color: #fff8ef; }
& body { background-image: radial-gradient(circle at 30% 0%, #fdf6e6, transparent 60%); }
`,
}
```

### 2. 补两条文案

面板上的名字和一句话介绍来自 locale 字典，键名固定是 `skin.<id>.name` / `skin.<id>.tagline`：

```js
// 同文件顶部的 zh / en 对象
"skin.dune.name": "沙丘手稿",
"skin.dune.tagline": "沙色纸面与旧铅字，像摊在桌上的手稿。",
```

不补也能跑——面板会退回显示键名，容易忘，所以建议一起加。

### 3. 刷新页面

没有构建步骤。插件是运行期加载的客户端包，改完 `lib/client.js` 刷新页面即可看到；插件面板里点一下新卡片就能试。

## 字段速查

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 唯一、短、kebab-case；也是 localStorage 里存的值 |
| `scheme` | ✅ | `light` / `dark`，写进 `<html>` 的 `color-scheme` |
| `font` / `mono` | ✅ | 界面字体 / 代码字体，写进 `--dsw-font-family` 与 `--dsw-font-markdown-code-font-family` |
| `r` | ✅ | 5 个圆角：xs、sm、md、lg、panel |
| `elev` | ✅ | 三档阴影：soft、panel、prominent |
| `c` | ✅ | 26 个颜色，见上表；键名不能改，`tokensFor()` 按名字映射到宿主的 `--dsw-alias-*` 变量 |
| `thumbShadow` | 可选 | 风格卡片缩略图的外框阴影 |
| `extras` | 可选 | 追加 CSS；`&` 会被替换成 `html[data-dsh-skin="<id>"]`，所以规则要写成 `& body {…}`、`& *::selection {…}` |
| `maskBlur` / `menuBlur` | 可选 | 写进 `--dsw-mask-blur` / `--dsw-menu-backdrop-filter`，玻璃拟态用得上 |

完整的效果可以直接参考现有五套皮肤：`pixel` 演示了硬边和噪点，`terminal` 演示 CRT 扫描线，`aurora` 演示玻璃模糊。

## 几个容易踩的点

- **颜色写 hex 或 `rgba()` 都行**，标准 CSS 颜色字符串即可，不要写 `oklch()` 之类的实验写法——老浏览器上直接失效。
- **`extras` 里的 `&` 不是 SCSS**，是这套代码自己的占位符替换。写成 `& body {}` 而不是 `body {}`，否则规则会作用到全站（包括别的主题）。
- **深色皮肤记得 `scheme: "dark"`**，否则原生下拉框、滚动条还是浅色，看着像穿错鞋。
- **不要动 `for (const skin of SKINS) skin.tokens = tokensFor(skin)`**：这行负责把 `c` 编译成 CSS 变量表，新加的皮肤必须被它扫到（放在数组里就行）。
- **插件卸载时会逐条还原**被覆盖的行内变量，所以不要在 `extras` 里写 `body { background: … !important }` 这种不可还原的东西——用普通优先级即可。

## 想做得更多

代码分层很清楚，改行为不用改皮肤：

| 想加的东西 | 改哪里 |
| --- | --- |
| 「随机一套」按钮 | 面板头部工具栏（`StyleStudioPanel` 的 `dss-sechead`），调用 `select(SKINS[Math.floor(Math.random() * SKINS.length)].id)` |
| 皮肤导入/导出（JSON） | `readStored` / `writeStored` 旁边，把 `SKINS` 序列化；注意 `tokensFor` 要重新跑一遍 |
| 只换字体不换色 | 新皮肤里把 `c` 全部指向原版变量值即可（或者直接写一个只改 `font` 的功能） |
| 跟随系统明暗 | `window.matchMedia("(prefers-color-scheme: dark)")` + 在 `ctx.on("theme/change")` 里切换两套皮肤 |
| 把皮肤发给朋友 | 目前没有打包机制；最简单的做法是让对方复制 `SKINS` 里对应那一项 |

改完记得验证：刷新页面 → 每套皮肤点一遍 → 切换明暗主题 → 刷新确认记忆 → 卸载插件确认还原。这套流程就是 `docs/BOOT-FAILURE.md` 最后那份检查清单里的「视觉回归」部分。
