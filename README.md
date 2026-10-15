# prompt 计划书助手 / Prompt plan helper

帮助新项目计划书的书写模板。A plan template helper for new projects.

用 AI 做东西之前，先把「做什么、怎么用、有哪些界面和功能」写成一份 AI 能照着做的计划书；做的过程中，页面上随时看到做了什么、还没做什么。
不用懂代码，网页、应用、游戏都一样写。

Before building something with an AI, write down what it is, how it is used and which screens and features it has, in a form the AI can follow. While it is being built, the page shows what is done and what is not. No code knowledge needed; it works the same for websites, apps and games.

## 用法 / How to use

| 中文 | English |
|---|---|
| 打开 `web/index.html`，点「看示例」或「新建空白计划书」，点每一块照提示写。 | Open `web/index.html`, click "See an example" or "New blank plan", and click each block to fill it in. |
| 把 `skill/` 放进 AI 的技能目录，AI 会照同一份模板写计划书、更新进度。 | Put `skill/` into the AI's skills folder; the AI writes plans in the same template and updates progress. |
| 项目页面里加 `<script src="shupian.js"></script>`，出现一个小悬浮窗：指出想改的东西、截图、写一句话，复制给 AI。 | Add `<script src="shupian.js"></script>` to a project page for a small floating window: point at a thing, take a screenshot, write a sentence, and copy it for the AI. |
| Windows：`tools/install-shortcut.ps1` 在桌面建快捷方式，按 Ctrl+Alt+S 看最近在用的文件夹，复制地址、打开计划书。 | Windows: `tools/install-shortcut.ps1` puts a shortcut on the desktop; press Ctrl+Alt+S to see recent folders, copy a path or open its plan. |

计划书是项目根目录的 `plan.md`。连接文件夹后，页面里的修改会存进去，AI 改了它页面也会自动更新。
The plan is `plan.md` in the project folder. Once the folder is connected, changes on the page are saved into it, and the page updates by itself when the AI changes it.

## 命令行 / Command line

```
node tools/shupian.mjs check plan.md                         状态、待补、重名 / status, TBD, duplicate names
node tools/shupian.mjs progress plan.md "功能名" doing       更新进度 todo|doing|done / update progress
node tools/shupian.mjs app hub                               桌面小窗口 / the small desktop window
```

## 文件 / Files

```
templates/zh, templates/en   计划书模板、字段说明、示例 / plan template, field guide, example
skill/                       给 AI 的说明 / instructions for the AI
src/                         核心和界面 / core and interface
web/                         网页和构建出的 shupian.js / web page and built script
extension/                   浏览器扩展 / browser extension
tools/                       构建、图标、本机服务、命令行 / build, icons, local service, command line
tests/                       测试 / tests
```

## 构建与测试 / Build and test

```
node tools/build.mjs        生成 web/shupian.js / build the script
node --test tests/core.test.mjs
node tests/e2e.mjs          需要 Chrome 或 Edge / needs Chrome or Edge
```

MIT License.
