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
- Put the user's first words, unchanged, at the end under "Original description".
- No build order and no implementation details in the plan. 计划书里不写开发顺序和实现方式。
- Examples and placeholders use invented or category words, never the user's own project.
- End the reply with the gaps: number, place, what is missing, a suggestion, one concrete default. Suggestions stay in the reply until the user confirms.

## Build notes and architecture / 做法和架构

After the plan is confirmed, write the build notes as a separate file for the user to approve: what to build first, how, and how each feature is checked, in plain words. 计划书确认后，另外写一份做法给用户确认，使用平实的语言。

Architecture is decoupled by default and is not asked of the user: modules expose only what they can do, not how; dependencies do not run in circles; data and content live outside the code. 架构默认解耦，不向用户询问：模块只暴露接口，依赖不成环，数据和内容放在代码之外。

## While building / 制作过程中

- Starting a feature: `node tools/shupian.mjs progress plan.md "<feature name>" doing`
- Finished and checked: `... done`
- The user watches the feature list on the page, so keep it true. 用户在页面上看着功能清单，进度要和实际一致。

## Issues / 问题

Once the plan is confirmed it becomes a feature list. Under a feature the user may add a line under `Issues:` (`问题：`). 确认之后计划书转为功能清单，用户可以在功能下的「问题：」里加一行。

Each issue has a state shown live in the feature list: no prefix (to do), `Working:` / `处理中：` (being fixed), `Fixed:` / `已修：` (done).

1. List them: `node tools/shupian.mjs issues <plan>` (numbered). Fix the ones that are not `Fixed`.
2. When you start one, set it to working; when the fix is checked, set it to done. Do not delete it: `node tools/shupian.mjs issue <plan> <number> doing|done`.
3. A problem that reveals a gap in the plan is also written into the plan first, then fixed. 暴露出计划书缺口的问题，先补计划书再修。
4. After approval the plan is the initial version; later changes (new features, changed features, issues) are made in the feature list. 确认之后计划书是初版，后面的改动记在功能清单里。

## Feedback from the floating window / 悬浮窗来的反馈

The user pastes text with the page address, window size, the element they mean (path, text, size, styles), recent page errors, the page's visible headings and controls, and sometimes a screenshot. Find the code from the element path and styles first. Look at the screenshot only when the cause cannot be found otherwise: a "pseudo screenshot" is drawn from the page structure, so cross-origin images and fonts are blank.

## Windows

- `node tools/shupian.mjs app hub`: the small window listing recent folders (the one in use is marked), with a copy-path button.
- `node tools/shupian.mjs app plan`: the plan window.
