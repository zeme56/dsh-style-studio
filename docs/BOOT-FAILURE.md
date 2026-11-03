# 为什么一个插件出错，整个网页就停在启动页

> 症状：打开 `dsh web` 只看到一张启动图，中间写着
> `Failed to load plugins` / `web boot: 2 entries did not activate` / `dsh-xxx: failed`，
> 对话界面根本进不去。这个文档说清它为什么这么设计、怎么定位、怎么写才不踩。

## 1. 现象长什么样

```
HARNESS
Failed to load plugins
web boot: 2 entries did not activate
dsh-landmarks: failed
dsh-style-studio: failed
```

浏览器控制台里通常还有一条真正的异常，例如：

```
Error: slot "sidebar.panellist" is not declared (a parent entry's children table must declare it)
```

注意它**没说是哪个插件抛的**，只说了哪个插件的条目最终状态是 `failed`。

## 2. 为什么是「全有或全无」

`dsh web` 的启动流程里有一道门：等所有客户端条目都进入 `active` 状态才放行；**任何一个条目 `failed`，就直接抛 `web boot: N entries did not activate`，整个应用停在启动页**，而不是加载出一个缺了面板的半残界面。

这个取舍是故意的：

- 半加载的 UI 更糟。某个插件没起来，它占的槽位空着，用户点到的入口可能全是坏的按钮，而且错误被埋在一堆正常界面里，很难被发现。
- 启动页把「哪些条目失败」一次性摊开，配合控制台里的第一条异常，定位很快。
- 反过来要求插件作者：**`apply()` 不能抛**。插件是「可选的好东西」，可选的东西不该有能力拖垮主程序。

所以这不是 bug，是设计。插件作者的责任是让自己的 `apply()` 在任何启动顺序下都不抛。

## 3. 真实案例：槽位还没声明就去注册

`dsh-style-studio` 和 `dsh-landmarks` 最初都这么写：

```js
export function apply(ctx) {
  ctx.slots.register({ name: "sidebar.panellist", id: "style-studio", /* … */ })
  ctx.slots.register({ name: "main", key: "style-studio", /* … */ })
}
```

`sidebar.panellist` 和 `main` 这两个槽位是**侧栏/布局包在自己的条目激活时声明的**。而条目激活顺序由依赖图决定，插件完全可能先跑。冷启动时：

1. 插件条目先激活 → `apply()` 里 `register` 找不到槽位 → 抛 `slot "…" is not declared`；
2. 条目状态变成 `failed`；
3. 启动门看见 failed → 整页停在启动页。

**为什么「之前看着好好的」？** 因为只有在冷启动才复现。热启用、热重载、在已经打开的页面里点安装，槽位早就被声明过了，`register` 一切正常。这类 bug 因此特别阴——开发时怎么点都没事，用户重启一次就全白屏。

## 4. 正确写法：`slots.inject` 等声明出现

```js
ctx.slots.inject("sidebar.panellist", () =>
  ctx.slots.register({ name: "sidebar.panellist", id: "style-studio", /* … */ }),
)

ctx.slots.inject("main", () =>
  ctx.slots.register({ name: "main", key: "style-studio", /* … */ }),
)
```

`inject(slot, fn)` 的含义是「这个槽位出现时再执行 `fn`」：槽位已存在就立刻执行，不存在就排队等声明。注册函数只跑一次，卸载时随插件生命周期回收。

同样的思路适用于其它「宿主的东西可能还没准备好」的场景：

- 取服务用 `ctx.inject(["theme"], …)` / 可选依赖，别假设一定在；
- 碰 `document` 之前确认 `typeof document !== "undefined"`（同一份客户端代码可能在非浏览器环境被加载）；
- `localStorage` 在隐私模式/配额满时会抛，读写都包 try/catch；
- 拉网络资源失败要降级成空态，不要让异常冒到 `apply()` 外面。

## 5. 排查步骤（从症状到根因）

1. **看启动页列出的失败条目**——先锁定包名。
2. **看浏览器控制台第一条红色栈**——它带真正的异常文本和插件前缀。
3. **确认这个包在 profile 的 bundles 里**：`~/.dsh/profiles/<profile>/package.json` → `dsh.bundles`；`node_modules/<包名>` 是实体目录还是 `link:` 指向工作区。
4. **判断是不是冷启动问题**：把宿主完全退出再启动，`dsh web` 用另一个端口起一份临时实例（`--port 3099`）最干净。
5. **临时禁用定位**：`dsh plugin --profile web remove <包名>`（或插件管理页禁用），确认页面能起来，再把包一个一个加回来。
6. 修完不要只看热更新——**必须重启验证一次**，这才是用户会遇到的路径。

## 6. 写插件的自保清单

- [ ] 所有 `ctx.slots.register` 都包在 `ctx.slots.inject` 里
- [ ] 不假设任何其它插件/服务已经激活
- [ ] `apply()` 里没有直接的 DOM、`localStorage`、网络调用未加保护
- [ ] 所有副作用都注册在 `ctx.effect` 里并有 dispose
- [ ] 宿主侧路由/定时器都在 dispose 里释放
- [ ] 数据文件缺失时给空态而不是 throw
- [ ] **冷启动**跑过一遍（完全退出宿主 → 重开）
- [ ] 卸载后无残留（样式标签、行内变量、路由）
- [ ] 控制台 0 报错

## 7. 已经卡在启动页了怎么救

插件起不来时，界面里点不了任何东西，只能用命令行：

```sh
# 在另一个终端里，禁用/移除出问题的插件
dsh plugin --profile web remove dsh-style-studio

# 或者直接编辑 profile 的 bundles 列表，把那行删掉
#   ~/.dsh/profiles/web/package.json  →  dsh.bundles
```

然后重启宿主。数据不会丢——插件的配置只是那个包本身，会话记录在别处。

## 8. 一句话总结

**启动门是「一个失败全船停航」，插件是船上的货；所以插件必须假设自己随时可能被最先加载，凡是要等宿主准备好的事，都用 `inject` 排队，而不是直接伸手。**
