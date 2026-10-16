---
name: plan-helper
description: Use before starting a new project or adding a feature, and while building it. Turns the user's idea into a plan in the plan-helper format (plain words, no code), keeps each feature's progress up to date, handles the issues recorded under features, and checks what is still TBD. 新项目或新功能开工前和制作过程中使用：把想法整理成计划书，更新每个功能的进度，处理功能下记录的问题，检查待补。
---

# Plan helper / 计划书助手

The plan is a Markdown file in the project root: `plan.md` (or `计划书.md`). The user may know business or design but not code, so the plan states only the result they want. 计划书是项目根目录的 `plan.md`（或 `计划书.md`）。用户懂业务或设计、不懂代码，所以只写想要的结果。

Formats and the example (this tool's own plan) are in `references/zh` and `references/en`. Use the language the user writes in. 模板在 `references/` 里，使用用户所用的语言。

## Before starting / 开工前

1. `node tools/shupian.mjs check plan.md`: status, what is TBD, duplicate names. Exit code 0 means nothing is TBD.
2. If there is no plan, write one from the user's words. If something is TBD, ask; fill it in only after the user answers. 没有计划书就写；有待补就询问，用户回答后再填。
3. Work starts only when nothing is TBD and the user has confirmed. 没有待补并且用户确认之后才开始制作。

## Writing the plan / 写计划书

- Use the template exactly: numbered sections 1 to 7, one block per page and per feature.
- Use only what the user said. Anything missing is written in place as `TBD: what is missing` (`待补：缺什么`), never in a separate list.
- Ways of using it and "done when" take one line each: `step → step → step`.
- Put the user's first words, unchanged, at the end under "Original description". Do not read that section normally; read it only to check what the user originally meant.
- No build order and no implementation details in the plan. 计划书里不写开发顺序和实现方式。
- Examples and placeholders use invented or category words, never the user's own project.
- End the reply with the gaps: number, place, what is missing, a suggestion, one concrete default. Suggestions stay in the reply until the user confirms.

## From idea to a built app in one or two chats / 一两次对话做出来

1. First reply: write the whole plan from what the user sent, not in pieces, and list every gap at once: number, place, what is missing, a suggestion, one concrete default. The user may answer "all defaults". 第一轮：一次写成完整计划书，缺口一次列全，用户可以回答「都按默认」。
2. Second reply: fill in the answers, run `check` until nothing is TBD, and put the build notes (what first, how, how each feature is checked) in the same reply for approval. 第二轮：填入回答，跑到没有待补，同一条回复里给出做法请用户确认。
3. After approval build straight through in that chat: update progress when a feature starts and when it is checked; ask only when two reasonable choices lead to different results. 确认之后一路做完，只有不同选择会得到不同结果时才问。

## Build notes and architecture / 做法和架构

After the plan is confirmed, write the build notes as a separate file for the user to approve: what to build first, how, and how each feature is checked, in plain words. 计划书确认后，另外写一份做法给用户确认，使用平实的语言。

Architecture is decoupled by default and is not asked of the user: modules expose only what they can do, not how; dependencies do not run in circles; data and content live outside the code. 架构默认解耦，不向用户询问：模块只暴露接口，依赖不成环，数据和内容放在代码之外。

## While building / 制作过程中

- Starting a feature: `node tools/shupian.mjs progress plan.md "<feature name>" doing`
- Finished and checked: `... done`
- The user watches the feature list on the page, so keep it true. 用户在页面上看着功能清单，进度要和实际一致。
- The feature list is an index of what already exists: a feature is listed above once its progress is not `todo`; features not started stay folded under "Not built yet". Write the progress as you go, otherwise nothing shows up. 功能清单是已经有的东西的索引：进度不是「未做」的功能才列在上面，没开始的收起在「还没做」里；边做边写进度，不然页面上什么都看不到。

## Issues / 问题

The feature list is a separate file from the plan: `features.md` next to `plan.md` (`功能清单.md` next to `计划书.md`, `features-<name>.md` next to `plan-<name>.md`). It appears the first time work starts: a feature is set to working or done, or an issue is recorded. Until then, even after confirmation, the plan is simply updated. 功能清单和计划书是两份文件，第一次开始做时才出现；确认之后还没开始做，就只是更新计划书。

Under a feature the user may add a line under `Issues:` (`问题：`), on the page, in the floating window, or by editing the file.

Each issue has a state shown live in the feature list: no prefix (to do), `Working:` / `处理中：` (being fixed), `Fixed:` / `已修：` (done).

1. List them: `node tools/shupian.mjs issues <plan>` (numbered; it reads the feature list when there is one). Fix the ones that are not `Fixed`.
2. When you start one, set it to working; when the fix is checked, set it to done. Do not delete it: `node tools/shupian.mjs issue <plan> <number> doing|done`.
3. A problem that reveals a gap in the plan is also written into the plan first, then fixed. 暴露出计划书缺口的问题，先补计划书再修。
4. Once work has started the initial plan is not changed any more: new features, changed features, progress and issues are all made in the feature list, and the progress you set there is the state of the work right now. 开始做之后初始计划书不再改，加功能、改功能、进度和问题都记在功能清单里，进度代表当下的情况。
5. Do not delete features the user wrote in the feature list. Earlier versions are kept in `.shupian/history/` of the project folder: the desktop helper saves one by itself whenever the file changes, and the `progress` / `issue` commands save one before writing. Before editing the file directly, run `node tools/shupian.mjs snapshot <plan>` so the version before your edit is kept even when the helper is not running. The same folder holds the user's unsent issue drafts (`.shupian/drafts/`); leave `.shupian/` alone.

## Feedback from the floating window / 悬浮窗来的反馈

The user pastes text with the page address, window size, the element they mean (path, text, size, styles), recent page errors, the page's visible headings and controls, and sometimes a screenshot.

1. Restate it in one sentence first: where (page or feature), what the user did, what they expected, what happened. Match it to a feature in the feature list by number and name; if none matches, say so.
2. Tell a request from a problem: "I want X" is a new or changed feature and goes into the feature list; "X is broken" is an issue and goes under the matching feature's `Issues:`. If unsure, check whether X is implemented: implemented but not working is an issue, not implemented is a request.
3. Find the code from the element path and styles first. Look at the screenshot only when the cause cannot be found otherwise: a "pseudo screenshot" is drawn from the page structure, so cross-origin images and fonts are blank.

用户贴来的反馈：先用一句话复述（在哪、做了什么、期望什么、实际什么），对到功能清单里的功能；分清是需求还是问题；再用元素路径和样式定位，找不到才看截图。

## Windows

- `node tools/shupian.mjs app hub`: the small window listing recent folders (the one in use is marked), with a copy-path button.
- `node tools/shupian.mjs app plan`: the plan window.
