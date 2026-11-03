window.__ModuleLoader__.load({
	id: "dsh-style-studio",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const h = React.createElement;
		const { useSyncExternalStore } = React;

		const NS = "dsh-style-studio";
		const PANEL_ID = "style-studio";
		const STORAGE_KEY = "dsh-style-studio.skin";
		const ATTR = "data-dsh-skin";

		/* ------------------------------------------------------------------ *
		 * copy
		 * ------------------------------------------------------------------ */

		const zh = {
			nav: "视觉风格",
			title: "视觉风格",
			subtitle: "五套皮肤，一键换掉整个 Harness 的配色、字体与质感。",
			sectionSkins: "风格库",
			sectionDemo: "效果示例",
			inUse: "使用中",
			currentDefault: "原版外观",
			currentPicked: "当前：{name}",
			reset: "恢复默认",
			footnote: "风格只改变界面呈现，不影响对话内容与会话记录；选择保存在本机，刷新后自动恢复。",
			demoNote: "下面这些控件会跟着皮肤一起变。",
			demoInput: "在这里输入消息…",
			demoSend: "发送",
			demoModel: "DeepSeek",
			demoPerm: "完全访问",
			demoPrimary: "主要按钮",
			demoSecondary: "次要按钮",
			demoBadge: "新会话",
			"skin.pixel.name": "像素街机",
			"skin.pixel.tagline": "8-bit 硬边、方角、等宽字，像在打红白机。",
			"skin.terminal.name": "午夜终端",
			"skin.terminal.tagline": "磷光绿字与 CRT 扫描线，安静的黑客机房。",
			"skin.cyber.name": "霓虹赛博",
			"skin.cyber.tagline": "青与洋红的霓虹描边，深夜雨城的玻璃反光。",
			"skin.paper.name": "纸感书房",
			"skin.paper.tagline": "暖米色纸面与衬线字，像摊开的一本旧书。",
			"skin.aurora.name": "极光玻璃",
			"skin.aurora.tagline": "半透明玻璃层与柔光，界面浮在极光上。",
		};

		const en = {
			nav: "Visual styles",
			title: "Visual styles",
			subtitle: "Five skins that reskin the whole Harness — palette, type and texture in one click.",
			sectionSkins: "Skin library",
			sectionDemo: "Sample",
			inUse: "In use",
			currentDefault: "Default look",
			currentPicked: "Current: {name}",
			reset: "Restore default",
			footnote: "Skins only change presentation, never conversation content or session records. Your choice is stored locally and restored after a reload.",
			demoNote: "These controls follow the active skin.",
			demoInput: "Type a message…",
			demoSend: "Send",
			demoModel: "DeepSeek",
			demoPerm: "Full access",
			demoPrimary: "Primary",
			demoSecondary: "Secondary",
			demoBadge: "New",
			"skin.pixel.name": "Pixel Arcade",
			"skin.pixel.tagline": "8-bit hard edges, square corners, monospace type. Handheld console energy.",
			"skin.terminal.name": "Midnight Terminal",
			"skin.terminal.tagline": "Phosphor green on black with CRT scanlines.",
			"skin.cyber.name": "Neon Cyber",
			"skin.cyber.tagline": "Cyan and magenta neon outlines over a rainy night city.",
			"skin.paper.name": "Paper Study",
			"skin.paper.tagline": "Warm cream paper and serif type, like an open old book.",
			"skin.aurora.name": "Aurora Glass",
			"skin.aurora.tagline": "Translucent glass layers and soft glow floating on aurora light.",
		};

		/* ------------------------------------------------------------------ *
		 * skins
		 * ------------------------------------------------------------------ */

		const MONO = '"Cascadia Mono", "Consolas", "SFMono-Regular", "Courier New", monospace';
		const PIXEL_MONO = '"Fusion Pixel 12px", "Zpix", "SimSun", "MS Gothic", "Cascadia Mono", "Courier New", monospace';
		const SANS = '"Inter", "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

		const SKINS = [
			{
				id: "pixel",
				scheme: "light",
				font: PIXEL_MONO,
				mono: MONO,
				r: ["0px", "0px", "0px", "0px", "0px"],
				elev: {
					soft: "2px 2px 0 0 #242019",
					panel: "4px 4px 0 0 #242019",
					prominent: "6px 6px 0 0 #242019",
				},
				thumbShadow: "2px 2px 0 0 #242019",
				c: {
					base: "#f2efe3",
					layer: "#fffdf4",
					layer2: "#e9e3d0",
					overlay: "#fffdf4",
					sidebar: "#e9e3d0",
					text: "#1c1a15",
					muted: "#5f5a4c",
					faint: "#8a8371",
					brand: "#d9462b",
					brandHover: "#b9371f",
					onBrand: "#fff8ef",
					borderSoft: "#c9c0a8",
					border: "#242019",
					borderStrong: "#242019",
					hover: "#e7dfc8",
					active: "#ded5bc",
					codeBg: "#242019",
					link: "#1f5fbf",
					error: "#c62d2d",
					success: "#2f7d3a",
					warn: "#b97a00",
					focus: "#d9462b",
					scrollbar: "#d8cfb6",
					scrollbarHover: "#bfb49a",
					tooltipBg: "#242019",
					tooltipKey: "#3a352b",
					mask: "rgba(28, 26, 21, 0.32)",
				},
				extras: `
& body { -webkit-font-smoothing: none; text-rendering: geometricPrecision; }
& body::after {
	content: "";
	position: fixed; inset: 0; pointer-events: none; z-index: 2147483000;
	opacity: .55;
	background-image:
		linear-gradient(rgba(28, 26, 21, .05) 1px, transparent 1px),
		linear-gradient(90deg, rgba(28, 26, 21, .05) 1px, transparent 1px);
	background-size: 4px 4px;
}
& *::selection { background: #d9462b; color: #fff8ef; }
`,
			},
			{
				id: "terminal",
				scheme: "dark",
				font: MONO,
				mono: MONO,
				r: ["0px", "0px", "0px", "0px", "0px"],
				elev: {
					soft: "0 0 0 1px #12321f",
					panel: "0 0 0 1px #1d4a2e, 0 10px 30px -18px #39ff88",
					prominent: "0 0 0 1px #2a6b43, 0 14px 40px -20px #39ff88",
				},
				thumbShadow: "0 0 0 1px #2a6b43",
				c: {
					base: "#040906",
					layer: "#08120c",
					layer2: "#0c1a11",
					overlay: "#061009",
					sidebar: "#050d08",
					text: "#b8ffd2",
					muted: "#63b183",
					faint: "#3d7c58",
					brand: "#39ff88",
					brandHover: "#7dffb0",
					onBrand: "#02150a",
					borderSoft: "#12321f",
					border: "#1d4a2e",
					borderStrong: "#2a6b43",
					hover: "#0f2417",
					active: "#143020",
					codeBg: "#0a1a10",
					link: "#5ce0ff",
					error: "#ff6b6b",
					success: "#39ff88",
					warn: "#ffd166",
					focus: "#39ff88",
					scrollbar: "#12321f",
					scrollbarHover: "#1d4a2e",
					tooltipBg: "#03170c",
					tooltipKey: "#0c2a18",
					mask: "rgba(0, 0, 0, 0.55)",
				},
				extras: `
& body { color-scheme: dark; }
& body::after {
	content: "";
	position: fixed; inset: 0; pointer-events: none; z-index: 2147483000;
	opacity: .4;
	background: repeating-linear-gradient(to bottom, rgba(0, 0, 0, .35) 0 1px, transparent 1px 3px);
}
& *::selection { background: #39ff88; color: #02150a; }
`,
			},
			{
				id: "cyber",
				scheme: "dark",
				font: SANS,
				mono: MONO,
				r: ["4px", "6px", "10px", "14px", "18px"],
				elev: {
					soft: "0 0 0 1px rgba(0, 229, 255, .16), 0 8px 24px -18px rgba(0, 229, 255, .55)",
					panel: "0 0 0 1px rgba(0, 229, 255, .22), 0 18px 50px -28px rgba(255, 92, 240, .55)",
					prominent: "0 0 0 1px rgba(0, 229, 255, .3), 0 26px 70px -30px rgba(255, 92, 240, .6)",
				},
				thumbShadow: "0 0 8px -1px rgba(0, 229, 255, .75)",
				c: {
					base: "#08060f",
					layer: "#0f0b1b",
					layer2: "#151026",
					overlay: "#0d0918",
					sidebar: "#0a0714",
					text: "#e6ecff",
					muted: "#9aa3d0",
					faint: "#6a70a0",
					brand: "#00e5ff",
					brandHover: "#66f2ff",
					onBrand: "#04121a",
					borderSoft: "#1b1738",
					border: "#2a2350",
					borderStrong: "#3d3380",
					hover: "#161130",
					active: "#1d1640",
					codeBg: "#0b0918",
					link: "#ff5cf0",
					error: "#ff4d6d",
					success: "#3dffb0",
					warn: "#ffd166",
					focus: "#ff5cf0",
					scrollbar: "#1b1738",
					scrollbarHover: "#2a2350",
					tooltipBg: "#0a0817",
					tooltipKey: "#171233",
					mask: "rgba(4, 2, 12, 0.6)",
				},
				extras: `
& body { color-scheme: dark; }
& *::selection { background: #ff5cf0; color: #04121a; }
`,
			},
			{
				id: "paper",
				scheme: "light",
				font: '"Iowan Old Style", "Palatino Linotype", "Songti SC", "Source Han Serif SC", "SimSun", Georgia, serif',
				mono: MONO,
				r: ["6px", "8px", "12px", "16px", "20px"],
				elev: {
					soft: "0 1px 2px rgba(74, 57, 32, .07)",
					panel: "0 2px 10px rgba(74, 57, 32, .09), 0 18px 40px -32px rgba(74, 57, 32, .3)",
					prominent: "0 4px 16px rgba(74, 57, 32, .12), 0 26px 60px -34px rgba(74, 57, 32, .4)",
				},
				thumbShadow: "0 1px 3px rgba(74, 57, 32, .25)",
				c: {
					base: "#f5efe2",
					layer: "#fbf7ec",
					layer2: "#efe7d6",
					overlay: "#fbf7ec",
					sidebar: "#f0e8d8",
					text: "#2f2a22",
					muted: "#6d6355",
					faint: "#94897a",
					brand: "#a35a34",
					brandHover: "#8c4a28",
					onBrand: "#fffaf0",
					borderSoft: "#e4dac6",
					border: "#d9cdb6",
					borderStrong: "#c8b99c",
					hover: "#efe6d3",
					active: "#e7dcc6",
					codeBg: "#efe7d6",
					link: "#8a5a2b",
					error: "#a63a2a",
					success: "#4a7a4a",
					warn: "#b07a2a",
					focus: "#a35a34",
					scrollbar: "#e0d5be",
					scrollbarHover: "#cbbda0",
					tooltipBg: "#2f2a22",
					tooltipKey: "#463f33",
					mask: "rgba(47, 42, 34, 0.28)",
				},
				extras: `
& body { color-scheme: light; }
& *::selection { background: #a35a34; color: #fffaf0; }
`,
			},
			{
				id: "aurora",
				scheme: "dark",
				font: SANS,
				mono: MONO,
				r: ["8px", "10px", "14px", "20px", "26px"],
				elev: {
					soft: "0 1px 0 rgba(255, 255, 255, .06) inset, 0 8px 24px -18px rgba(0, 0, 0, .8)",
					panel: "0 1px 0 rgba(255, 255, 255, .07) inset, 0 20px 60px -30px rgba(139, 123, 255, .55)",
					prominent: "0 1px 0 rgba(255, 255, 255, .08) inset, 0 30px 90px -34px rgba(61, 218, 215, .5)",
				},
				thumbShadow: "0 6px 18px -8px rgba(139, 123, 255, .9)",
				maskBlur: "blur(18px)",
				menuBlur: "blur(24px) saturate(140%)",
				c: {
					base: "#070b18",
					layer: "rgba(255, 255, 255, 0.055)",
					layer2: "rgba(255, 255, 255, 0.085)",
					overlay: "rgba(16, 22, 40, 0.92)",
					sidebar: "rgba(10, 14, 28, 0.72)",
					text: "#eaf0ff",
					muted: "#a8b4d8",
					faint: "#7684ac",
					brand: "#8b7bff",
					brandHover: "#a89bff",
					onBrand: "#0b0b1a",
					borderSoft: "rgba(255, 255, 255, 0.08)",
					border: "rgba(255, 255, 255, 0.13)",
					borderStrong: "rgba(255, 255, 255, 0.22)",
					hover: "rgba(255, 255, 255, 0.09)",
					active: "rgba(255, 255, 255, 0.14)",
					codeBg: "rgba(255, 255, 255, 0.06)",
					link: "#3ddad7",
					error: "#ff6b8a",
					success: "#3ddad7",
					warn: "#ffc46b",
					focus: "#8b7bff",
					scrollbar: "rgba(255, 255, 255, 0.12)",
					scrollbarHover: "rgba(255, 255, 255, 0.2)",
					tooltipBg: "rgba(12, 17, 32, 0.96)",
					tooltipKey: "rgba(255, 255, 255, 0.1)",
					mask: "rgba(3, 6, 14, 0.62)",
				},
				extras: `
& body {
	color-scheme: dark;
	background-image:
		radial-gradient(1200px 620px at 10% -10%, rgba(139, 123, 255, .26), transparent 62%),
		radial-gradient(900px 520px at 94% 6%, rgba(61, 218, 215, .2), transparent 64%),
		radial-gradient(1000px 700px at 50% 112%, rgba(255, 92, 240, .14), transparent 62%);
	background-attachment: fixed;
}
& *::selection { background: #8b7bff; color: #0b0b1a; }
`,
			},
		];

		/* ------------------------------------------------------------------ *
		 * token mapping
		 * ------------------------------------------------------------------ */

		function tokensFor(skin) {
			const c = skin.c;
			return {
				"--dsw-alias-bg-base": c.base,
				"--dsw-alias-bg-layer-1": c.layer,
				"--dsw-alias-bg-layer-2": c.layer2,
				"--dsw-alias-bg-layer-3": c.layer2,
				"--dsw-alias-bg-layer-4": c.layer2,
				"--dsw-alias-bg-overlay": c.overlay,
				"--dsw-alias-bg-mask-1": c.mask,
				"--dsw-alias-bg-module-platform": c.layer2,
				"--dsw-specific-sidebar-fill": c.sidebar,
				"--dsw-specific-input-major": c.layer,
				"--dsw-specific-menu": c.overlay,
				"--dsw-alias-border-l1": c.borderSoft,
				"--dsw-alias-border-l2": c.border,
				"--dsw-alias-border-l2-darkmode-thin": c.borderSoft,
				"--dsw-alias-border-l3": c.border,
				"--dsw-alias-border-l4": c.borderStrong,
				"--dsw-alias-label-primary": c.text,
				"--dsw-alias-label-primary-foreground": c.onBrand,
				"--dsw-alias-label-secondary": c.muted,
				"--dsw-alias-label-tertiary": c.faint,
				"--dsw-alias-label-caption": c.faint,
				"--dsw-alias-label-dimmed": c.faint,
				"--dsw-alias-label-error": c.error,
				"--dsw-alias-label-shimmer": c.brand,
				"--dsw-alias-brand-primary": c.brand,
				"--dsw-alias-brand-primary-new-colorprimary-new-color": c.brand,
				"--dsw-alias-link": c.link,
				"--dsw-alias-button-primary-fill": c.brand,
				"--dsw-alias-button-primary-hover": c.brandHover,
				"--dsw-alias-button-ghost-active-fill": c.hover,
				"--dsw-alias-button-ghost-active-border": c.border,
				"--dsw-alias-button-tool-bar-fill": c.layer2,
				"--dsw-alias-button-tool-bar-hover": c.hover,
				"--dsw-alias-interactive-bg-hover": c.hover,
				"--dsw-alias-interactive-bg-active": c.active,
				"--dsw-alias-menu-surface-fill": c.overlay,
				"--dsw-alias-menu-group-header-fill": c.layer2,
				"--dsw-alias-menu-icon": c.muted,
				"--dsw-alias-hovercard-bg": c.overlay,
				"--dsw-alias-tooltip-bg": c.tooltipBg,
				"--dsw-alias-tooltip-key-bg": c.tooltipKey,
				"--dsw-alias-toast-bg": c.overlay,
				"--dsw-alias-toast-label": c.text,
				"--dsw-alias-markdown-code-block": c.codeBg,
				"--dsw-alias-markdown-code-block-banner": c.layer2,
				"--dsw-alias-markdown-inline-code": c.codeBg,
				"--dsw-alias-markdown-tag": c.layer2,
				"--dsw-alias-scrollbar-bg-l2": c.scrollbar,
				"--dsw-alias-scrollbar-hover-l2": c.scrollbarHover,
				"--dsw-alias-state-error-primary": c.error,
				"--dsw-alias-state-success-primary": c.success,
				"--dsw-alias-state-warn-primary": c.warn,
				"--dsw-alias-state-warn-label": c.warn,
				"--dsw-alias-state-idle-primary": c.faint,
				"--dsw-alias-switch-thumb": c.layer,
				"--dsw-focus-ring-color": c.focus,
				"--dsw-font-family": skin.font,
				"--dsw-font-markdown-code-font-family": skin.mono,
				"--dsw-font-xs-13": "13px/20px " + skin.font,
				"--dsw-radius-xs": skin.r[0],
				"--dsw-radius-sm": skin.r[1],
				"--dsw-radius-md": skin.r[2],
				"--dsw-radius-lg": skin.r[3],
				"--dsw-radius-panel": skin.r[4],
				"--dsw-elevation-soft": skin.elev.soft,
				"--dsw-elevation-panel": skin.elev.panel,
				"--dsw-elevation-prominent": skin.elev.prominent,
				"--dsw-shadow-lv3": skin.elev.prominent,
				"--dsw-mask-blur": skin.maskBlur || "none",
				"--dsw-menu-backdrop-filter": skin.menuBlur || "none",
			};
		}

		for (const skin of SKINS) skin.tokens = tokensFor(skin);

		/* ------------------------------------------------------------------ *
		 * applying / restoring
		 * ------------------------------------------------------------------ */

		function readStored() {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				return SKINS.some((skin) => skin.id === raw) ? raw : null;
			} catch (_error) {
				return null;
			}
		}

		function writeStored(id) {
			try {
				if (id === null) window.localStorage.removeItem(STORAGE_KEY);
				else window.localStorage.setItem(STORAGE_KEY, id);
			} catch (_error) {
				/* 隐私模式下 localStorage 可能不可用，皮肤仍然在当前页面生效 */
			}
		}

		/** Inline values we replaced on <body>/<html>, kept so teardown restores them. */
		const savedProps = new Map();

		function remember(el, name) {
			const key = el.tagName + ":" + name;
			if (savedProps.has(key)) return;
			savedProps.set(key, {
				el,
				name,
				value: el.style.getPropertyValue(name),
				priority: el.style.getPropertyPriority(name),
			});
		}

		function setProp(el, name, value) {
			remember(el, name);
			el.style.setProperty(name, value);
		}

		function restoreProps() {
			for (const entry of savedProps.values()) {
				if (entry.value) entry.el.style.setProperty(entry.name, entry.value, entry.priority);
				else entry.el.style.removeProperty(entry.name);
			}
			savedProps.clear();
		}

		/**
		 * Paint one skin (or `null` for the host default) across the application.
		 * Tokens land as inline custom properties on <body> — the element the theme's
		 * own palette blocks target — so they win over `body` and
		 * `body[data-ds-dark-theme]` without touching the theme registry.
		 */
		function applySkin(id) {
			const root = document.documentElement;
			const body = document.body;
			restoreProps();
			if (id === null) {
				root.removeAttribute(ATTR);
				return;
			}
			const skin = SKINS.find((item) => item.id === id);
			if (skin === undefined) {
				root.removeAttribute(ATTR);
				return;
			}
			root.setAttribute(ATTR, skin.id);
			if (body === null) return;
			for (const name of Object.keys(skin.tokens)) setProp(body, name, skin.tokens[name]);
			setProp(root, "color-scheme", skin.scheme);
		}

		function clearSkin() {
			restoreProps();
			document.documentElement.removeAttribute(ATTR);
		}

		/* ------------------------------------------------------------------ *
		 * store
		 * ------------------------------------------------------------------ */

		const listeners = new Set();
		let current = readStored();

		function subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		}

		function getSnapshot() {
			return current;
		}

		function select(id) {
			if (id === current) return;
			current = id;
			writeStored(id);
			applySkin(id);
			for (const listener of listeners) listener();
		}

		/* ------------------------------------------------------------------ *
		 * page styles
		 * ------------------------------------------------------------------ */

		const PAGE_CSS = `
.dss-root {
	height: 100%;
	min-height: 0;
	overflow: auto;
	background: var(--dsw-alias-bg-base);
	color: var(--dsw-alias-label-primary);
	font-family: var(--dsw-font-family);
}
.dss-wrap { max-width: 1040px; margin: 0 auto; padding: 30px 30px 72px; }
.dss-head { display: flex; align-items: flex-start; gap: 14px; flex-wrap: wrap; }
.dss-mark {
	width: 40px; height: 40px; flex: none;
	display: grid; place-items: center;
	border-radius: var(--dsw-radius-md);
	background: linear-gradient(140deg, var(--dsw-alias-brand-primary), color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, #000));
	color: var(--dsw-alias-label-primary-foreground);
	box-shadow: var(--dsw-elevation-soft);
}
.dss-headtext { flex: 1 1 320px; min-width: 0; }
.dss-title { margin: 0; font-size: 20px; line-height: 28px; font-weight: 650; letter-spacing: .01em; }
.dss-sub { margin: 6px 0 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
.dss-current {
	display: inline-flex; align-items: center; gap: 7px;
	padding: 5px 11px; border-radius: 999px;
	border: 1px solid var(--dsw-alias-border-l1);
	background: var(--dsw-alias-bg-layer-1);
	font-size: 12px; color: var(--dsw-alias-label-secondary); white-space: nowrap;
}
.dss-dot {
	width: 7px; height: 7px; border-radius: 50%;
	background: var(--dsw-alias-brand-primary);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, transparent);
}
.dss-sechead { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 30px 0 12px; }
.dss-sec {
	margin: 0; font-size: 12px; font-weight: 600; letter-spacing: .08em;
	text-transform: uppercase; color: var(--dsw-alias-label-secondary);
}
.dss-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(224px, 1fr)); gap: 14px; }
.dss-card {
	position: relative; display: flex; flex-direction: column;
	padding: 0; overflow: hidden; text-align: left; cursor: pointer;
	color: inherit; font: inherit;
	border: 1px solid var(--dsw-alias-border-l1);
	border-radius: var(--dsw-radius-lg);
	background: var(--dsw-alias-bg-layer-1);
	transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}
.dss-card:hover { border-color: var(--dsw-alias-border-l2); transform: translateY(-2px); box-shadow: var(--dsw-elevation-soft); }
.dss-card:focus-visible { outline: 2px solid var(--dsw-focus-ring-color); outline-offset: 2px; }
.dss-card[data-active="true"] {
	border-color: var(--dsw-alias-brand-primary);
	box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent);
}
.dss-prev {
	display: flex; gap: 8px; height: 124px; padding: 10px;
	border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.dss-prev-rail {
	width: 34px; flex: none; padding: 7px 6px;
	display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
}
.dss-prev-dot { width: 6px; height: 6px; border-radius: 50%; }
.dss-prev-line { display: block; height: 3px; border-radius: 2px; }
.dss-prev-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 7px; justify-content: center; }
.dss-prev-bubble { padding: 7px 8px; display: flex; flex-direction: column; gap: 5px; }
.dss-prev-btn {
	align-self: flex-end; min-width: 34px; padding: 4px 9px;
	font-size: 10px; font-weight: 700; text-align: center; letter-spacing: .04em;
}
.dss-card-body { padding: 11px 13px 13px; display: flex; flex-direction: column; gap: 3px; }
.dss-card-name { display: flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 600; }
.dss-picked {
	margin-left: auto; padding: 1px 7px; border-radius: 999px;
	font-size: 10.5px; letter-spacing: .04em;
	color: var(--dsw-alias-brand-primary);
	background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);
	border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 32%, transparent);
}
.dss-card-tag { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.dss-ghost {
	appearance: none; font: inherit; font-size: 12px;
	padding: 5px 11px; border-radius: var(--dsw-radius-sm); cursor: pointer;
	border: 1px solid var(--dsw-alias-border-l1);
	background: var(--dsw-alias-bg-layer-1);
	color: var(--dsw-alias-label-secondary);
}
.dss-ghost:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dss-ghost:focus-visible { outline: 2px solid var(--dsw-focus-ring-color); outline-offset: 2px; }
.dss-ghost:disabled { opacity: .45; cursor: default; }
.dss-demo {
	display: flex; flex-direction: column; gap: 16px;
	padding: 18px;
	border: 1px solid var(--dsw-alias-border-l1);
	border-radius: var(--dsw-radius-lg);
	background: var(--dsw-alias-bg-layer-1);
}
.dss-demo-note { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.dss-demo-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dss-btn {
	display: inline-flex; align-items: center; justify-content: center;
	height: 32px; padding: 0 14px; font-size: 13px; font-weight: 500;
	border-radius: var(--dsw-radius-sm);
	border: 1px solid var(--dsw-alias-border-l1);
	background: var(--dsw-alias-bg-layer-2);
	color: var(--dsw-alias-label-primary);
}
.dss-btn-primary {
	border-color: transparent;
	background: var(--dsw-alias-button-primary-fill);
	color: var(--dsw-alias-label-primary-foreground);
}
.dss-badge {
	padding: 2px 8px; border-radius: 999px; font-size: 11px;
	color: var(--dsw-alias-state-success-primary);
	background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 15%, transparent);
}
.dss-composer {
	display: flex; flex-direction: column; gap: 12px;
	padding: 12px;
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: var(--dsw-radius-lg);
	background: var(--dsw-alias-bg-layer-2);
}
.dss-input {
	padding: 2px 2px 10px; font-size: 13px;
	color: var(--dsw-alias-label-tertiary);
	border-bottom: 1px dashed var(--dsw-alias-border-l1);
}
.dss-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dss-chip {
	padding: 3px 9px; border-radius: var(--dsw-radius-xs);
	font-size: 11.5px;
	border: 1px solid var(--dsw-alias-border-l1);
	background: var(--dsw-alias-bg-layer-1);
	color: var(--dsw-alias-label-secondary);
}
.dss-spacer { flex: 1; }
.dss-send {
	display: inline-flex; align-items: center; height: 28px; padding: 0 13px;
	font-size: 12px; border-radius: var(--dsw-radius-sm);
	background: var(--dsw-alias-brand-primary);
	color: var(--dsw-alias-label-primary-foreground);
}
.dss-foot { margin: 22px 0 0; font-size: 12px; line-height: 20px; color: var(--dsw-alias-label-tertiary); }
@media (max-width: 520px) {
	.dss-wrap { padding: 22px 16px 60px; }
}
`;

		function buildCss() {
			let out = PAGE_CSS;
			for (const skin of SKINS) {
				if (!skin.extras) continue;
				out += "\n/* " + skin.id + " */\n" + skin.extras.split("&").join('html[' + ATTR + '="' + skin.id + '"]');
			}
			return out;
		}

		/* ------------------------------------------------------------------ *
		 * icons
		 * ------------------------------------------------------------------ */

		function StudioGlyph({ size }) {
			const edge = size || 16;
			return h(
				"svg",
				{
					viewBox: "0 0 24 24",
					width: edge,
					height: edge,
					fill: "none",
					stroke: "currentColor",
					strokeWidth: 1.6,
					strokeLinecap: "round",
					strokeLinejoin: "round",
					"aria-hidden": "true",
					focusable: "false",
				},
				h("path", { d: "M12 3.2a8.8 8.8 0 1 0 0 17.6c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8h1.6a3.9 3.9 0 0 0 3.9-3.9c0-4.2-3.7-7.6-8.2-7.6Z" }),
				h("circle", { cx: 8.1, cy: 10.1, r: 1.15, fill: "currentColor", stroke: "none" }),
				h("circle", { cx: 12, cy: 7.7, r: 1.15, fill: "currentColor", stroke: "none" }),
				h("circle", { cx: 15.9, cy: 10.1, r: 1.15, fill: "currentColor", stroke: "none" })
			);
		}

		function SidebarIcon(owner = {}) {
			const edge = owner.size || 16;
			return h(
				"span",
				{
					className: "dss-nav-icon",
					style: {
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: edge,
						height: edge,
						opacity: owner.active ? 1 : 0.92,
					},
				},
				h(StudioGlyph, { size: edge })
			);
		}

		/* ------------------------------------------------------------------ *
		 * page
		 * ------------------------------------------------------------------ */

		function SkinThumb({ skin }) {
			const c = skin.c;
			const r = skin.r;
			return h(
				"div",
				{ className: "dss-prev", style: { background: c.base } },
				h(
					"div",
					{ className: "dss-prev-rail", style: { background: c.sidebar, border: "1px solid " + c.borderSoft, borderRadius: r[1] } },
					h("span", { className: "dss-prev-dot", style: { background: c.brand } }),
					h("span", { className: "dss-prev-line", style: { background: c.faint, width: "72%" } }),
					h("span", { className: "dss-prev-line", style: { background: c.faint, width: "52%" } }),
					h("span", { className: "dss-prev-line", style: { background: c.faint, width: "64%" } })
				),
				h(
					"div",
					{ className: "dss-prev-main" },
					h(
						"div",
						{ className: "dss-prev-bubble", style: { background: c.layer, border: "1px solid " + c.borderSoft, borderRadius: r[1] } },
						h("span", { className: "dss-prev-line", style: { background: c.text, width: "78%", opacity: 0.72 } }),
						h("span", { className: "dss-prev-line", style: { background: c.muted, width: "46%", opacity: 0.6 } })
					),
					h(
						"div",
						{
							className: "dss-prev-btn",
							style: {
								background: c.brand,
								color: c.onBrand,
								borderRadius: r[0],
								boxShadow: skin.thumbShadow || "none",
								fontFamily: skin.font,
							},
						},
						"Aa"
					)
				)
			);
		}

		function StyleStudioPanel(props) {
			const t = typeof props.t === "function" ? props.t : (key) => key;
			const picked = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
			const active = SKINS.find((skin) => skin.id === picked);
			const currentLabel = active === undefined ? t("currentDefault") : t("skin." + active.id + ".name");

			return h(
				"section",
				{ className: "dss-root", "aria-label": t("title") },
				h(
					"div",
					{ className: "dss-wrap" },
					h(
						"header",
						{ className: "dss-head" },
						h("div", { className: "dss-mark" }, h(StudioGlyph, { size: 22 })),
						h("div", { className: "dss-headtext" }, h("h1", { className: "dss-title" }, t("title")), h("p", { className: "dss-sub" }, t("subtitle"))),
						h("span", { className: "dss-current" }, h("span", { className: "dss-dot" }), currentLabel)
					),
					h(
						"div",
						{ className: "dss-sechead" },
						h("h2", { className: "dss-sec" }, t("sectionSkins")),
						h(
							"button",
							{
								type: "button",
								className: "dss-ghost",
								disabled: picked === null,
								onClick: () => select(null),
							},
							t("reset")
						)
					),
					h(
						"div",
						{ className: "dss-grid" },
						SKINS.map((skin) =>
							h(
								"button",
								{
									key: skin.id,
									type: "button",
									className: "dss-card",
									"data-active": picked === skin.id ? "true" : "false",
									"aria-pressed": picked === skin.id,
									onClick: () => select(skin.id),
								},
								h(SkinThumb, { skin }),
								h(
									"div",
									{ className: "dss-card-body" },
									h(
										"div",
										{ className: "dss-card-name" },
										h("span", null, t("skin." + skin.id + ".name")),
										picked === skin.id ? h("span", { className: "dss-picked" }, t("inUse")) : null
									),
									h("div", { className: "dss-card-tag" }, t("skin." + skin.id + ".tagline"))
								)
							)
						)
					),
					h(
						"div",
						{ className: "dss-sechead" },
						h("h2", { className: "dss-sec" }, t("sectionDemo")),
						h("span", { className: "dss-demo-note" }, t("demoNote"))
					),
					h(
						"div",
						{ className: "dss-demo" },
						h(
							"div",
							{ className: "dss-demo-row" },
							h("span", { className: "dss-btn dss-btn-primary" }, t("demoPrimary")),
							h("span", { className: "dss-btn" }, t("demoSecondary")),
							h("span", { className: "dss-badge" }, t("demoBadge"))
						),
						h(
							"div",
							{ className: "dss-composer" },
							h("div", { className: "dss-input" }, t("demoInput")),
							h(
								"div",
								{ className: "dss-tools" },
								h("span", { className: "dss-chip" }, t("demoModel")),
								h("span", { className: "dss-chip" }, t("demoPerm")),
								h("span", { className: "dss-spacer" }),
								h("span", { className: "dss-send" }, t("demoSend"))
							)
						)
					),
					h("p", { className: "dss-foot" }, t("footnote"))
				)
			);
		}

		/* ------------------------------------------------------------------ *
		 * plugin module
		 * ------------------------------------------------------------------ */

		const name = "style-studio";
		const inject = ["slots", "locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-style-studio: dictionaries");
			const t = ctx.locale.bind(NS);

			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.dshPlugin = "dsh-style-studio";
				style.textContent = buildCss();
				document.head.appendChild(style);
				return () => style.remove();
			}, "dsh-style-studio: styles");

			ctx.effect(() => {
				applySkin(current);
				return () => clearSkin();
			}, "dsh-style-studio: active skin");

			// A theme or font change rewrites the same body variables; repaint ours on top.
			ctx.on("theme/change", () => applySkin(current));

			// The shell declares its slots while its own entries activate, which can be
			// after this package. `slots.inject` waits for the declaration instead of
			// registering into a slot that does not exist yet — a direct register here
			// throws `slot "... " is not declared` and fails the whole web boot.
			ctx.slots.inject("sidebar.panellist", () =>
				ctx.slots.register(
					{
						name: "sidebar.panellist",
						id: PANEL_ID,
						order: 20,
						label: () => t("nav"),
						locale: NS,
					},
					(owner = {}) => h(SidebarIcon, owner)
				)
			);

			ctx.slots.inject("main", () =>
				ctx.slots.register(
					{
						name: "main",
						key: PANEL_ID,
						locale: NS,
						inject: () => ({ t }),
					},
					() => h(StyleStudioPanel, { t })
				)
			);
		}

		exports.name = name;
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	},
});
