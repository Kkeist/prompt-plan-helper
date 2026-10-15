---
name: plan-helper
description: Use before starting a new project or adding a feature, and while building it. Turns the user's idea into a plan in the plan-helper format (plain words, no code), keeps each feature's progress up to date, checks what is still TBD, and reads feedback pasted from the floating window. 新项目或新功能开工前和做的过程中使用：把想法整理成计划书，更新每个功能的进度，检查待补，读用户从悬浮窗贴来的反馈。
---

# Plan helper / 计划书助手

The plan is a Markdown file in the project root: `plan.md` (or `计划书.md`). The user may know business or design but not code, so the plan says only the result they want. 计划书是项目根目录的 `plan.md`（或 `计划书.md`），用户懂业务或设计、不懂代码，所以只写他想要的结果。

Formats and examples are in `references/zh` and `references/en` (plan, fields, change, example). Follow the language the user writes in. 模板在 `references/` 里，用用户写的语言。

## Before starting / 开工前

1. `node tools/shupian.mjs check plan.md` — status, what is TBD, duplicate names. Exit code 0 means nothing is TBD.
2. If there is no plan, write one from the user's words (below). If something is TBD, ask or fill it in only after the user answers. 没有计划书就写；有待补就问，用户回答了再填。
3. Work starts only when nothing is TBD and the user has confirmed. 没有待补并且用户确认之后才开始做。

## Writing the plan / 写计划书

- Use the template exactly: numbered sections 1 to 6, one block per screen and per feature.
- Only what the user said. Anything missing is written in place as `TBD: what is missing` (`待补：缺什么`), never in a separate list.
- Ways of using it and "done when" are one line each: `step → step → step`.
- Put the user's first words, unchanged, at the end under "Original description".
- No build order and no implementation details in the plan; the user does not decide those. 计划书里不写开发顺序和实现方式，那些不由用户定。
- Examples and placeholders use fictional or category words, never the user's own project.
- End the reply with the gaps: number, place, what is missing, a suggestion, one concrete default. Suggestions stay in the reply until the user confirms.

## How to build it / 做法

After the plan is approved, write the build notes as a separate file for the user to approve (what to build first, how, how to check each feature) in plain words. Start building after they say yes. 计划书通过后，另外写一份做法给用户确认，说人话；用户同意后再动手。

## While building / 做的过程中

- When you start a feature: `node tools/shupian.mjs progress plan.md "<feature name>" doing`
- When it is finished and checked: `... done`
- The user watches the project status on the page, so keep it true. 用户在页面上看着，进度要和实际一致。

## Feedback from the floating window / 悬浮窗来的反馈

The user pastes text with the page address, the element they mean (path, text, size, styles), recent page errors, and sometimes a screenshot.
Find the code from the element path and styles first. Look at the screenshot only when the cause cannot be found otherwise: a "pseudo screenshot" is drawn from the page structure, so cross-origin images and fonts are blank.
Map the change onto a feature in the plan, update the plan first, then change the code. 先对到计划书里的功能，改计划书，再改代码。

## Windows

- `node tools/shupian.mjs app hub` — the small window listing recent folders (the one Claude is working in is marked "in use"), with a copy-path button.
- `node tools/shupian.mjs app plan` — the plan window.
