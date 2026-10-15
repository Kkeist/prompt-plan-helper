# prompt 计划书助手 / Prompt plan helper

帮助新项目计划书的书写模板。A plan template helper for new projects.

用 AI 制作东西之前，先把「做什么、怎么用、有哪些页面和功能」写成一份 AI 可以直接照着做的计划书；确认之后，计划书转为功能清单，每个功能带进度，也可以在功能下记录问题。不需要代码知识，网页、应用、游戏的写法相同。

Before building something with an AI, write down what it is, how it is used and which pages and features it has, in a form the AI can follow. Once confirmed, the plan turns into a feature list: each feature carries its progress, and issues can be recorded under it. No code knowledge is needed; the writing is the same for websites, apps and games.

## 用法 / How to use

| 中文 | English |
|---|---|
| 打开 `web/index.html`，点「查看示例」或「新建空白计划书」，点击每一块，按框内提示填写。 | Open `web/index.html`, choose "View an example" or "New blank plan", then click each block and follow the hints in the box. |
| Windows：运行 `start.bat`（或双击 `web/download/prompt-plan-helper.exe`），按 Ctrl+Alt+S，在屏幕右下角弹出小窗口，列出最近使用的文件夹，可以复制地址或打开它的计划书。 | Windows: run `start.bat` (or double-click `web/download/prompt-plan-helper.exe`) and press Ctrl+Alt+S for a small window at the bottom right listing recent folders, with a copy-path button and a way to open the plan. |
| 把 `skill/` 放进 AI 的技能目录，AI 会按同一份模板写计划书、更新进度、处理问题。 | Put `skill/` into the AI's skills folder; the AI writes plans in the same template, updates progress and handles issues. |
| 在制作中的页面里加 `<script src="shupian.js"></script>`，出现一个小悬浮窗（Alt+Shift+S）：选取元素、框选区域、记录当前页面，写一句说明，复制给 AI。 | Add `<script src="shupian.js"></script>` to the page being built for a small floating window (Alt+Shift+S): pick an element, select a region or record the current page, write a line and copy it to the AI. |

计划书是项目根目录的 `plan.md`。连接文件夹后，页面里的修改会保存进去，AI 修改它时页面会自动更新。
The plan is `plan.md` in the project folder. Once the folder is connected, changes on the page are saved into it, and the page updates by itself when the AI changes it.

## 命令行 / Command line

```
node tools/shupian.mjs check plan.md                     状态、待补、重名 / status, TBD, duplicate names
node tools/shupian.mjs progress plan.md "功能名" doing   更新进度 todo|doing|done / update progress
node tools/shupian.mjs app hub                           桌面小窗口 / the small desktop window
```

## 文件 / Files

```
templates/zh, templates/en   计划书模板、字段说明、示例（示例就是这个项目自己的计划书） / template, field guide, example (the example is this project's own plan)
skill/                       给 AI 的说明 / instructions for the AI
src/                         核心和界面 / core and interface
desktop/                     Windows 桌面版源码 / Windows desktop version source
web/                         网页、构建出的 shupian.js、桌面版 exe / web page, built script, desktop exe
extension/                   浏览器扩展 / browser extension
tools/                       构建、图标、本机服务、命令行、快捷方式 / build, icons, local service, command line, shortcut
tests/                       测试 / tests
```

## 构建与测试 / Build and test

```
node tools/build.mjs        生成 web/shupian.js / build the script
node tools/build-exe.mjs    生成桌面版（需要 Windows）/ build the desktop exe (Windows)
node --test tests/core.test.mjs
node tests/e2e.mjs          需要 Chrome 或 Edge / needs Chrome or Edge
node tests/exe.mjs          桌面版接口 / desktop version API
```

MIT License.

<sub>与 Claude 一起完成。 / Made together with Claude.</sub>
