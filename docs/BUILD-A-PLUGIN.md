# 从零做一个 DeepSeek Harness 插件

这份笔记是做完 [dsh-style-studio](https://github.com/zeme56/dsh-style-studio) 之后整理出来的：一个带左侧边栏入口、能改整个应用外观的插件，需要哪些文件、每处为什么这么写。目标读者是「知道 React，但没写过 Harness 插件」的人。

> 适用版本：`dsh` 0.2.x（`dsh.bundle` 机制，0.1.0-rc.6 起）。不同版本细节可能变，以你 checkout 里的源码和插件模板为准。

## 1. 先理解三件事

1. **插件 = 一个 npm 包 + 一份 bundle 补丁。** 宿主不认识「插件」这个概念，它认识的是「profile 里的一行 cordis 条目」。插件包通过 `dsh.bundle.patch` 提供一份 YAML，把自己的条目 insert 进 profile。
2. **一个插件有两个入口。** `lib/index.js` 跑在宿主进程（Node，能开 HTTP 路由、读文件），`lib/client.js` 跑在浏览器（React，能碰 DOM 和 CSS）。只改界面的插件，宿主侧可以是空的。
3. **界面靠「槽位」插进去。** 侧栏、主面板、设置页都是宿主声明好的槽位；插件把自己的 React 组件注册到指定槽位，就出现在对应位置。

## 2. 目录长什么样

```
dsh-style-studio/
├── package.json          # 包元数据 + dsh.bundle / dsh.client 声明
├── cordis.patch.yml      # bundle 补丁：把自己 insert 进 profile
├── icon.svg              # 插件管理页的图标
├── locale/
│   ├── zh.json           # 插件标题、描述
│   └── en.json
├── lib/
│   ├── index.js          # 宿主侧（Node）
│   └── client.js         # 浏览器侧（React + CSS）
├── README.md
└── LICENSE
```

## 3. package.json：三个字段决定一切

```json
{
  "name": "dsh-style-studio",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-theme"
      ]
    }
  }
}
```

- **`dsh.bundle.patch`** —— 有它，插件才能被 `dsh plugin add` 装进 profile；只有 `dsh.client` 的包装不上（awesome-dsh-plugin 列表也据此卡）。
- **`exports` 必须逐项列出。** 宿主按 `./client`、`./cordis.patch.yml`、`./locale/*.json` 这些子路径去取文件，没写就取不到。
- **`dsh.client`** —— 告诉 `dsh web` 这个包有浏览器代码，`platform: "web"` 才会被服务出去；`inject` 只表示「依赖这些客户端包先激活」，不是模块导入。`immediately: true` 让它在启动时就加载，而不是等到被引用。
- **`"private": true` 发布前要去掉**，否则 npm 不让你发（GitHub 直装不受影响，但市场那边看的是可安装性）。
- `files` 建议显式列，避免把调试产物打进包里。

## 4. cordis.patch.yml：一行 insert

```yaml
- insert:
    - id: style-studio
      name: dsh-style-studio
```

- `id` 是 profile 里的行标识，别和别的插件撞；也是 `plugin_manager` 里看到的那个名字。
- **`name` 必须是裸包名**，不能写 `dsh-style-studio/lib/client.js`。`dsh web` 的客户端扫描只解析裸包名行，靠它找到 `package.json` 再读 `dsh.client`。
- 想默认禁用就加 `disabled: true`（用户仍可在插件管理里打开）。

## 5. 宿主侧 lib/index.js

最小可用的样子：

```js
export const name = "style-studio"

export function apply(ctx) {
  // 什么都不做也可以：界面全在浏览器侧
}
```

需要给浏览器侧提供数据时（比如我另一个插件把 glb 文件服务出去）：

```js
import { readFile } from "node:fs/promises"

export const name = "landmarks-3d"
export const inject = ["webServer"]

export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.route("/api/landmarks", async (req, res) => {
      const body = await readFile(new URL("../assets/manifest.json", import.meta.url))
      res.setHeader("content-type", "application/json")
      res.end(body)
    })
    return () => dispose()
  })
}
```

两条纪律：

- **副作用包在 `ctx.effect(() => { …; return dispose })` 里**，插件卸载/重载时宿主会调用 dispose，否则路由、定时器、watcher 会泄漏。
- **宿主侧抛错同样会让条目 failed**，症状和浏览器侧一样（见 [BOOT-FAILURE.md](BOOT-FAILURE.md)）。文件不存在、JSON 解析失败都算。


## 6. 浏览器侧 lib/client.js

整个文件被包在一个加载调用里：

```js
window.__ModuleLoader__.load({
  id: "dsh-style-studio",          // 必须是包名
  factory: (require) => {
    const React = require("react")  // 只能 require react，别的 Harness 包拿不到
    const { useState, useEffect } = React

    const name = "style-studio"

    function apply(ctx) {
      // 注册槽位、注入样式、订阅主题事件…
      ctx.effect(() => { /* … */ return () => { /* 清理 */ } })
    }

    return { name, inject: ["theme", "locale", "slots"], apply }
  },
})
```

### 6.1 槽位：先声明，再注册

界面上的位置都是槽位。做「侧栏入口 + 主面板」需要两个：

| 槽位 | 类型 | 注册什么 |
| --- | --- | --- |
| `sidebar.panellist` | list | 侧栏里的一行：`{ id, order, label, locale, icon? , component }` |
| `main` | keyed | 主区域面板：`{ key, component }`，`key` 必须等于侧栏那行的 `id`，点行才会切到面板 |

**关键：永远用 `ctx.slots.inject(slot, () => ctx.slots.register(...))`，不要直接 `register`。**

```js
ctx.slots.inject("sidebar.panellist", () =>
  ctx.slots.register({
    name: "sidebar.panellist",
    id: "style-studio",
    order: 20,
    label: "风格",
    locale: "style-studio.panel.title",
    component: SidebarRow,
  }),
)

ctx.slots.inject("main", () =>
  ctx.slots.register({ name: "main", key: "style-studio", component: StudioPanel }),
)
```

原因：槽位是 shell 包在它自己激活时**才声明**的，插件完全可能先激活。直接 `register` 会抛 `slot "…" is not declared`，条目 failed，整个网页停在启动页。`inject` 会等到声明出现再执行注册函数。详细复盘见 [BOOT-FAILURE.md](BOOT-FAILURE.md)。

### 6.2 组件拿到什么

- 侧栏行组件收到 `{ size, active }`：`size` 是展开/收起，`active` 表示当前是否选中。
- 主面板组件通常什么都不需要，自己读状态即可。
- 想读写全局状态就用宿主暴露的服务；插件之间不要互相 import。

### 6.3 改外观：写 CSS 变量

Harness 的主题是一批 CSS 变量（`--dsw-alias-*`、`--dsw-font-*`、`--dsw-radius-*`、`--dsw-elevation-*` 等），定义在 `body` / `body[data-ds-dark-theme]` 上。

- 官方入口是 `ctx.theme.overrideTokens(source, { token: { light, dark } })`，适合只改颜色的场景。
- 要一次改字体、圆角、阴影、几百个值，直接给 `document.body` 写**行内自定义属性**更省事：行内样式优先级高于任何选择器，不用 `!important`，卸载时按进入前记下的旧值逐条还原即可。
- 换明暗主题时宿主会重写这些变量，所以要在 `ctx.on("theme/change")` 里重新覆盖。
- 结构级的花样（`color-scheme`、`::selection`、扫描线）写一段 `<style data-dsh-plugin="…">`，作用域挂在 `<html data-…>` 属性上，卸载时删掉这个标签。

### 6.4 文案与图标

- 面板里的文字走 `ctx.locale`：写好 `locale/zh.json` / `locale/en.json`，键名用 `插件名.区域.键`。
- 图标：`package.json` 的 `icon` 指向 svg，插件管理页会显示；侧栏行如果需要图标，按槽位约定的字段传。

## 7. 本地开发循环

```sh
# 1. 把本地目录挂进 profile（link: 不会复制，改完源码即生效）
dsh plugin --profile web add link:C:\path\to\dsh-style-studio

# 2. 重启宿主（浏览器侧代码在启动时加载，热更新不一定覆盖你的包）
dsh web --port 3080
```

- 改 `lib/client.js` 后**刷新页面**基本就够；改了 `cordis.patch.yml` 或 `package.json` 必须重启。
- 从 GitHub 装用 pnpm 的简写：`dsh plugin --profile web add github:owner/repo`。
- 卸载：`dsh plugin --profile web remove dsh-style-studio`，或在插件管理页点禁用。**启动卡死时这是唯一的逃生口**（在另一个终端里执行）。

## 8. 发布前检查清单

- [ ] `package.json` 有 `dsh.bundle.patch`、去掉了 `"private": true`
- [ ] `name` 唯一，`version` 语义化
- [ ] 仓库是 public，加了 `dsh-plugin` topic，带 README / LICENSE
- [ ] `cordis.patch.yml` 里 `name` 是裸包名
- [ ] 所有槽位注册都走 `slots.inject`
- [ ] 所有副作用都在 `ctx.effect` 里、有 dispose
- [ ] **冷启动**验证过（重启宿主，而不是只热更新）
- [ ] 卸载后界面完全还原，没有残留样式和路由
- [ ] 控制台 0 报错

## 9. 参考

- 本仓库：`lib/client.js` 是一个完整的侧栏 + 面板实现（约 950 行，含五套皮肤）。
- 姊妹项目 [dsh-landmarks](https://github.com/zeme56/dsh-landmarks)：演示宿主侧路由 + 静态资源服务 + 客户端拉数据画 3D。
- 完整目录源码：`~/.dsh/profiles/<profile>/node_modules/@deepseek-ai/`，槽位与令牌的权威定义都在里面。
