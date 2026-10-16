# prompt 计划书助手

[English](README.md) · [中文](README.zh-CN.md)

用平实的话写下新项目的计划书，AI 照着做。计划书确认之后转为功能清单：每个功能带进度，问题写在它所属的功能下面。

**直接在线用，不用安装：** <https://prompt-planner.kkeist.com>。写好计划书，复制或导出成文件，交给 AI 就行。

## 怎么用

1. **网页。** 打开 `web/index.html`，新建空白计划书或查看示例，点每一块直接写。可以导出成 Markdown 文件，也可以导入文件继续修改。
2. **Windows 桌面窗口。** 运行 `start.bat`（或 `web/download/prompt-plan-helper.exe`），按 Ctrl+Alt+S。小窗口列出最近的项目文件夹，打开计划书可以看功能，并在功能下写问题。
3. **正在做的网页上的悬浮窗。** 在桌面窗口里选「安装浏览器扩展」，点「安装到 Edge」或「安装到 Chrome」，再在打开的扩展页面里打开它的开关（Firefox：把同一个弹窗里的书签拖到书签栏，在测试页面上点一下）。然后打开测试页面（`index.html` 或 `localhost`）。右下角出现一个按钮，Alt+Shift+S 也能打开。可以选取元素、框选区域、记录当前页面，写下哪里不对并记进计划书。
4. **AI。** 把 `skill/` 文件夹放进 AI 的技能目录。AI 按你的话写计划书、追问缺的内容、一个功能一个功能地做，并保持进度最新。
5. **自己的网页，不用计划书。** 页面里引入 `shupian.js`，并声明页面上有什么。悬浮窗会列出这些部件，声明过的数值还能直接调：

   ```html
   <script>
   window.SHUPIAN_ME = {
     parts: [{ name: '开始按钮', selector: '#start' }],
     tune: [{ key: 'bounce', label: '弹性', min: 0, max: 1, step: 0.05, value: 0.4, apply(v) { game.bounce = v; } }],
   };
   </script>
   <script src="https://prompt-planner.kkeist.com/shupian.js"></script>
   ```

   在页面上圈选的部件、调过的数值都记在这个浏览器里，按页面地址分开；调过的数值下次打开页面时自动再用一遍。声明了 `SHUPIAN_ME` 的页面，悬浮窗只在 `localhost`、`127.0.0.1`、本地文件，或地址带 `?shupian=1`（这个浏览器从此打开）时出现，发布出去的页面不会对访客显示。

界面语言跟随浏览器，也可以在语言菜单里切换。复制给 AI 的话默认是英文，可以切换成中文。

## 仓库里有什么

| 文件夹 | 内容 |
|---|---|
| `web/` | 网页、悬浮窗脚本、`download/` 里的桌面版 exe |
| `extension/` | 浏览器扩展 |
| `skill/` | 给 AI 的说明 |
| `desktop/` | 桌面版源码 |
| `templates/`、`locales/` | 计划书模板和全部界面文字，一种语言一个文件 |
| `src/`、`tools/`、`tests/` | 源码、构建脚本、测试 |

构建：`node tools/build.mjs`。测试：`node tests/e2e.mjs` 和 `tests/` 里的其他文件。

MIT License.

<sub>与 Claude 一起完成。</sub>
