# Prompt plan helper

[English](README.md) · [中文](README.zh-CN.md)

Write the plan for a new project in plain words, and an AI builds from it. Once the plan is confirmed it becomes a feature list: every feature has a progress, and problems are written under the feature they belong to.

**Use it online, nothing to install:** <https://prompt-planner.kkeist.com>. Write the plan, then copy it or export it as a file and give it to the AI.

## Use it

1. **Web page.** Open `web/index.html`. Start a blank plan or view the example, click each block and write. Export the plan as a Markdown file, or import one to change it.
2. **Windows desktop window.** Run `start.bat` (or `web/download/prompt-plan-helper.exe`) and press Ctrl+Alt+S. A small window lists your recent project folders; open a plan to see its features and write problems under them.
3. **Floating window on the page you are building.** In the desktop window choose "Install the browser extension", press "Install to Edge" or "Install to Chrome" and turn the extension on in the extensions page that opens (Firefox: drag the bookmark from the same dialog to the bookmarks bar and click it on your page). Then open your test page (`index.html` or `localhost`). A button appears at the bottom right; Alt+Shift+S opens it. Pick an element, select a region or record the current page, write what is wrong and add it to the plan.
4. **AI.** Put the `skill/` folder into the AI's skills folder. The AI writes the plan from your words, asks for what is missing, builds feature by feature and keeps the progress up to date.
5. **Your own page, without a plan.** Include `shupian.js` in the page and declare what it has. The floating window then lists those parts, and lets you adjust the values you declare:

   ```html
   <script>
   window.SHUPIAN_ME = {
     parts: [{ name: 'Start button', selector: '#start' }],
     tune: [{ key: 'bounce', label: 'Bounce', min: 0, max: 1, step: 0.05, value: 0.4, apply(v) { game.bounce = v; } }],
   };
   </script>
   <script src="https://prompt-planner.kkeist.com/shupian.js"></script>
   ```

   For a game, `stages: [{ name: 'Level 5', values: { bounce: 0.9 } }]` adds a progress row: choosing one sets all the listed values at once.

   Parts you pick on the page are remembered in this browser, per page address, as are the values you adjust (applied again on the next visit). A page that declares `SHUPIAN_ME` shows the window only on `localhost`, `127.0.0.1` or a file, or when the address has `?shupian=1` (that turns it on in this browser), so a published page stays clean for visitors.

The interface follows the browser language and has a language menu. The words copied for the AI are English by default and can be switched to Chinese.

## What is in the repository

| Folder | What |
|---|---|
| `web/` | the page, the floating-window script, the desktop exe in `download/` |
| `extension/` | the browser extension |
| `skill/` | instructions for the AI |
| `desktop/` | source of the desktop version |
| `templates/`, `locales/` | plan templates and all interface texts, one file per language |
| `src/`, `tools/`, `tests/` | source, build scripts, tests |

Build: `node tools/build.mjs`. Tests: `node tests/e2e.mjs` and the other files in `tests/`.

MIT License.

<sub>Made together with Claude.</sub>
