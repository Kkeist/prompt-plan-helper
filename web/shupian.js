(function () {
'use strict';
const SCHEMA = {"zh":{"fields":{"1":[{"name":"这是什么","purpose":"做的是什么，一两句话","how":"一个计时器，工作 25 分钟、休息 5 分钟，轮流提醒"},{"name":"给谁用","purpose":"谁会用，什么时候用","how":"需要专心做事的人，坐在电脑前的时候"},{"name":"用完得到什么","purpose":"用的人最后得到什么","how":"知道今天专心做了几轮"}],"2":[{"name":"用法","purpose":"每种用法一行：用的人做什么 → 看到什么 → 再做什么","how":"开始一轮：点「开始」→ 看到倒计时 → 时间到听到提示音"}],"3":[{"name":"这个界面是干什么的","purpose":"用的人在这里做什么","how":"看倒计时，开始或暂停"},{"name":"界面上有什么","purpose":"每一样东西一行：名字：它是什么；点了或碰了会怎样","how":"开始按钮：开始倒计时；点了变成「暂停」"},{"name":"怎么来到这个界面","purpose":"从哪里进来","how":"一打开就是它"}],"4":[{"name":"它做什么","purpose":"这件事是什么，一句话","how":"按设定的分钟数倒计时"},{"name":"怎么才算做好","purpose":"每种情况一行：某种情况：应该出现什么","how":"设成 25 分钟点开始：每秒减一，到 0 时提示"},{"name":"有什么限制","purpose":"数字范围、不能怎样","how":"分钟数只能是 1 到 120"},{"name":"进度","purpose":"未做、进行中、已完成，AI 做完会自己改","how":"未做"}],"5":[{"name":"信息","purpose":"每种一行：名字：包含什么；下次打开还要不要在","how":"设置：工作分钟数、休息分钟数；要在"}],"6":[{"name":"用在哪里","purpose":"手机、电脑、网页、游戏机，或者别的","how":"手机和电脑"},{"name":"样子和感觉","purpose":"想要什么风格、颜色、气氛","how":"白底、很简洁、像笔记本"},{"name":"有没有参考的东西","purpose":"想学哪个东西的样子，可以写名字","how":"像系统自带的计时器"},{"name":"绝对不要什么","purpose":"一定不能出现的东西","how":"不要广告，不要弹出打扰的窗口"},{"name":"还有什么要求","purpose":"别的想到的都写在这里","how":"要有中文和英文"}]},"planTemplate":"# 计划书：〈项目名〉\n\n状态：草稿　　更新：〈日期〉\n\n## 1 这是什么\n\n这是什么：\n给谁用：\n用完得到什么：\n\n## 2 怎么用\n\n〈每种用法写一行：用的人做什么 → 看到什么 → 再做什么〉\n\n## 3 界面\n\n### 3.1 〈界面名〉\n\n这个界面是干什么的：\n界面上有什么：\n- 〈东西的名字〉：它是什么；点了或碰了会怎样\n怎么来到这个界面：\n\n## 4 功能\n\n### 4.1 〈功能名〉\n\n它做什么：\n怎么才算做好：\n- 〈某种情况〉：应该出现什么\n有什么限制：\n进度：未做\n\n## 5 要记住的信息\n\n- 〈信息的名字〉：包含什么；下次打开还要不要在\n\n## 6 样子和要求\n\n用在哪里：\n样子和感觉：\n有没有参考的东西：\n绝对不要什么：\n还有什么要求：\n\n## 最初的描述\n\n〈AI 帮填时，把你最初说的话原样放在这里〉\n\n---\n\n缺的内容在原位写「待补：缺什么」，不另开一栏。\n","changeTemplate":"# 修改单：〈一句话标题〉\n\n状态：整理中　　更新：〈日期〉\n\n类型：Bug / 加功能 / 调整\n哪个界面或功能：〈只写知道的那一层〉\n我看到：\n我想要：\n怎么出现的：\n同类检查：已查\n记录：〈AI 转化时放你的原话和对应到计划书哪里〉\n\n---\n\n通过 = AI 把修改对应到计划书并补完，并且你确认过。通过之后才改。\n","example":"# 计划书：番茄钟（示例）\n\n状态：整理中　　更新：2026-01-01\n\n## 1 这是什么\n\n这是什么：一个计时器，工作 25 分钟、休息 5 分钟，轮流提醒。\n给谁用：需要专心做事的人，坐在电脑前的时候。\n用完得到什么：知道今天专心做了几轮。\n\n## 2 怎么用\n\n开始一轮：点「开始」→ 看到倒计时 → 时间到听到提示音 → 自动进入休息\n改时长：点设置 → 改工作和休息的分钟数 → 点保存 → 回到计时\n看今天：点「今天」→ 看到今天完成的轮数\n\n## 3 界面\n\n### 3.1 计时界面\n\n这个界面是干什么的：看倒计时，开始或暂停。\n界面上有什么：\n- 倒计时：显示剩余的分钟和秒；每秒减一\n- 开始按钮：开始倒计时；点了变成「暂停」\n- 设置按钮：去设置界面\n怎么来到这个界面：一打开就是它\n\n### 3.2 设置界面\n\n这个界面是干什么的：改工作和休息的分钟数。\n界面上有什么：\n- 工作分钟数：填 1 到 120 的整数\n- 保存按钮：保存设置；点了回到计时界面\n怎么来到这个界面：计时界面点设置按钮\n\n## 4 功能\n\n### 4.1 倒计时\n\n它做什么：按设定的分钟数倒计时，结束时提醒。\n怎么才算做好：\n- 设成 25 分钟点开始：每秒减一，到 0 时播放提示音\n- 倒计时中点暂停：数字停住，再点继续接着走\n- 倒计时中关掉再打开：回到设定值，不继续计时\n有什么限制：分钟数只能是 1 到 120 的整数\n进度：已完成\n\n### 4.2 今天完成几轮\n\n它做什么：每完成一轮工作就加一，显示在「今天」里。\n怎么才算做好：\n- 完成一轮工作：今天的轮数加一\n- 隔天打开：轮数从 0 开始\n有什么限制：休息不算一轮\n进度：进行中\n\n## 5 要记住的信息\n\n- 设置：工作分钟数、休息分钟数；下次打开要在\n- 每天的轮数：日期、轮数；下次打开要在\n\n## 6 样子和要求\n\n用在哪里：手机和电脑\n样子和感觉：白底，很简洁，像笔记本\n有没有参考的东西：像系统自带的计时器\n绝对不要什么：不要广告，不要弹出打扰的窗口\n还有什么要求：要有中文和英文\n\n## 最初的描述\n\n我想做一个番茄钟，工作 25 分钟休息 5 分钟，手机电脑都能用，最好能看到今天做了几轮。\n"},"en":{"fields":{"1":[{"name":"What it is","purpose":"What is being made, one or two sentences","how":"A timer that counts 25 minutes of work and 5 minutes of rest, over and over"},{"name":"Who it is for","purpose":"Who uses it, and when","how":"People who need to focus, sitting at a computer"},{"name":"What they get from it","purpose":"What the user ends up with","how":"They know how many rounds they focused today"}],"2":[{"name":"Way of using","purpose":"One line each: the user does something → sees something → does the next thing","how":"Start a round: click Start → see the countdown → hear a sound when time is up"}],"3":[{"name":"What this screen is for","purpose":"What the user does here","how":"Watch the countdown, start or pause it"},{"name":"What is on the screen","purpose":"One line per thing: name: what it is; what happens when clicked or touched","how":"Start button: starts the countdown; turns into Pause"},{"name":"How the user gets here","purpose":"Where they come from","how":"It is the first thing they see"}],"4":[{"name":"What it does","purpose":"What this one thing is, in one sentence","how":"Counts down the set number of minutes"},{"name":"Done when","purpose":"One line per situation: a situation: what should happen","how":"Set 25 minutes and click Start: it drops by one each second and alerts at 0"},{"name":"Limits","purpose":"Number ranges, what must not happen","how":"Minutes must be from 1 to 120"},{"name":"Progress","purpose":"Not started, In progress or Done; the AI changes it when finished","how":"Not started"}],"5":[{"name":"Information","purpose":"One per line: name: what it contains; whether it should still be there next time","how":"Settings: work minutes, rest minutes; kept"}],"6":[{"name":"Where it is used","purpose":"Phone, computer, web, game console, or something else","how":"Phone and computer"},{"name":"Look and feel","purpose":"The style, colours, mood you want","how":"White background, very simple, like a notebook"},{"name":"Anything to refer to","purpose":"Something whose look you like; a name is enough","how":"Like the timer that comes with the system"},{"name":"Must not have","purpose":"Things that must never appear","how":"No ads, no pop-ups that interrupt"},{"name":"Anything else","purpose":"Anything else you thought of","how":"Chinese and English"}]},"planTemplate":"# Plan: 〈Project name〉\n\nStatus: Draft　　Updated: 〈date〉\n\n## 1 What it is\n\nWhat it is:\nWho it is for:\nWhat they get from it:\n\n## 2 How it is used\n\n〈One line per way of using it: the user does something → sees something → does the next thing〉\n\n## 3 Screens\n\n### 3.1 〈Screen name〉\n\nWhat this screen is for:\nWhat is on the screen:\n- 〈Name of a thing〉: what it is; what happens when it is clicked or touched\nHow the user gets here:\n\n## 4 Features\n\n### 4.1 〈Feature name〉\n\nWhat it does:\nDone when:\n- 〈A situation〉: what should happen\nLimits:\nProgress: Not started\n\n## 5 Information to remember\n\n- 〈Name of the information〉: what it contains; whether it should still be there next time\n\n## 6 Look and requirements\n\nWhere it is used:\nLook and feel:\nAnything to refer to:\nMust not have:\nAnything else:\n\n## Original description\n\n〈When the AI fills this in, it puts your first words here, unchanged〉\n\n---\n\nAnything missing is written in place as \"TBD: what is missing\". There is no separate list.\n","changeTemplate":"# Change: 〈One-line title〉\n\nStatus: In progress　　Updated: 〈date〉\n\nType: Bug / Feature / Tweak\nWhich screen or feature: 〈Only the level you know〉\nWhat I see:\nWhat I want:\nHow it happens:\nSimilar cases checked: Yes\nRecord: 〈The AI puts your original words and where they map to in the plan here〉\n\n---\n\nApproved = the AI has mapped the change onto the plan and filled the gaps, and you have confirmed it. Changes are made only after that.\n","example":"# Plan: Pomodoro timer (example)\n\nStatus: In progress　　Updated: 2026-01-01\n\n## 1 What it is\n\nWhat it is: A timer that counts 25 minutes of work and 5 minutes of rest, over and over.\nWho it is for: People who need to focus, sitting at a computer.\nWhat they get from it: They know how many rounds they focused today.\n\n## 2 How it is used\n\nStart a round: click Start → see the countdown → hear a sound when time is up → rest starts automatically\nChange durations: open Settings → change the work and rest minutes → click Save → back to the timer\nSee today: click Today → see how many rounds were finished today\n\n## 3 Screens\n\n### 3.1 Timer screen\n\nWhat this screen is for: Watch the countdown, start or pause it.\nWhat is on the screen:\n- Countdown: shows the minutes and seconds left; drops by one each second\n- Start button: starts the countdown; turns into Pause when clicked\n- Settings button: goes to the settings screen\nHow the user gets here: it is the first thing they see\n\n### 3.2 Settings screen\n\nWhat this screen is for: Change the work and rest minutes.\nWhat is on the screen:\n- Work minutes: a whole number from 1 to 120\n- Save button: saves the settings; goes back to the timer screen\nHow the user gets here: the Settings button on the timer screen\n\n## 4 Features\n\n### 4.1 Countdown\n\nWhat it does: Counts down the set number of minutes and alerts at the end.\nDone when:\n- Set 25 minutes and click Start: it drops by one each second and a sound plays at 0\n- Click Pause during the countdown: the number stops; click again to continue\n- Close during the countdown and reopen: back to the set value, not counting\nLimits: minutes must be a whole number from 1 to 120\nProgress: Done\n\n### 4.2 Rounds today\n\nWhat it does: Adds one for every finished work round and shows it under Today.\nDone when:\n- A work round finishes: today's count goes up by one\n- Open it the next day: the count starts from 0\nLimits: rest does not count as a round\nProgress: In progress\n\n## 5 Information to remember\n\n- Settings: work minutes, rest minutes; kept for next time\n- Rounds per day: date, number of rounds; kept for next time\n\n## 6 Look and requirements\n\nWhere it is used: phone and computer\nLook and feel: white background, very simple, like a notebook\nAnything to refer to: like the timer that comes with the system\nMust not have: no ads, no pop-ups that interrupt\nAnything else: Chinese and English\n\n## Original description\n\nI want a pomodoro timer: 25 minutes of work, 5 minutes of rest, works on phone and computer, and it would be nice to see how many rounds I did today.\n"}};
const CSS = ":host {\n  all: initial;\n  display: block;\n  color-scheme: only light;\n  --paper: #ffffff;\n  --ink: #000000;\n  --muted: #5f5f5f;\n  --line: #d4d4d4;\n  --soft: #f6f6f6;\n  --hover: #ececec;\n  --z-pop: 30;\n  --z-modal: 40;\n  --z-toast: 50;\n  font-family: \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", sans-serif;\n}\n*, *::before, *::after { box-sizing: border-box; }\n\n.app {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background: var(--paper);\n  color: var(--ink);\n  font-size: 16px;\n  line-height: 1.65;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  overflow: hidden;\n}\n.app textarea, .app input { -webkit-user-select: text; user-select: text; }\n.app button { font: inherit; color: inherit; }\n.app :focus { outline: none; }\n.app :focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }\n@media (max-width: 400px) { .app { font-size: 14.5px; } }\n@media (max-width: 320px) { .app { font-size: 13px; } }\n\n/* 悬浮窗 */\n.win {\n  position: fixed;\n  z-index: 2147483000;\n  width: 19em;\n  max-width: calc(100vw - 1em);\n  max-height: calc(100vh - 1em);\n  overflow-y: auto;\n  font-size: 15px;\n  background: var(--paper);\n  border: 2px solid var(--ink);\n  border-radius: 0.7em;\n  overflow: hidden;\n}\n.win .app { font-size: inherit; height: auto; }\n.fb-body { padding: 0.5em 0.8em 0.7em; }\n.fb-body .row { margin-top: 0.4em; }\n.fb-body textarea.in { margin-top: 0.5em; }\n.chipline img.shot { width: 3.2em; height: 2.2em; object-fit: cover; border-radius: 0.3em; margin-right: 0.5em; flex: none; }\n@media (max-width: 400px) { .win { font-size: 14px; } }\n@media (max-width: 320px) { .win { font-size: 12.5px; } }\n.fab {\n  position: fixed;\n  z-index: 2147483000;\n  width: 54px;\n  height: 54px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  touch-action: none;\n}\n.fab svg { display: block; width: 100%; height: 100%; }\n\n/* 顶栏：一行，内容和正文同一条中心列 */\n.head { flex: none; border-bottom: 1px solid var(--line); background: var(--paper); }\n.head .in { display: flex; align-items: center; max-width: 46em; margin: 0 auto; padding: 0.45em 0.9em; }\n.head .in.drag { cursor: grab; touch-action: none; }\n.head .in > * + * { margin-left: 0.6em; }\n.brand { display: flex; align-items: center; flex: none; font-weight: 700; }\n.logo { display: block; width: 1.9em; height: 1.9em; margin-right: 0.5em; }\n.logo svg { display: block; width: 100%; height: 100%; }\n@media (max-width: 440px) { .brand-name { display: none; } .logo { margin-right: 0; } }\n.tabs { display: flex; flex: none; }\n.tabs > * + * { margin-left: 0.35em; }\n.sp { flex: 1; min-width: 0; }\n.x { border: 0; background: transparent; width: 2em; height: 2em; line-height: 1; cursor: pointer; border-radius: 0.4em; font-size: 1em; flex: none; }\n.x:hover { background: var(--hover); }\n.x.more { font-size: 1.3em; font-weight: 700; }\n\n.chip { flex: none; border: 1px solid var(--line); background: var(--paper); border-radius: 2em; padding: 0.15em 0.9em; cursor: pointer; }\n.chip:hover { background: var(--hover); }\n.chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }\n.btn { border: 1px solid var(--ink); background: var(--paper); border-radius: 0.45em; padding: 0.2em 0.85em; cursor: pointer; }\n.btn:hover { background: var(--hover); }\n.btn.primary { background: var(--ink); color: var(--paper); }\n.btn.primary:hover { background: #2b2b2b; }\n.btn.sm { padding: 0 0.55em; font-size: 0.9em; }\n.btn:disabled { border-color: var(--line); color: var(--muted); cursor: default; background: var(--paper); }\n.link { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; }\n.muted { color: var(--muted); font-size: 0.9em; }\n\n/* 正文：永远是一条居中的列 */\n.body { flex: 1; min-height: 0; overflow-anchor: none; overflow-y: auto; overscroll-behavior: contain; }\n.col { max-width: 46em; margin: 0 auto; padding: 0.8em 0.9em 4em; }\n.empty { padding: 2em 0; }\n.empty p { margin: 0 0 1em; }\n.row, .opts, .thumbs, .addrow, .statusline { display: flex; flex-wrap: wrap; align-items: center; }\n.row > *, .opts > *, .thumbs > *, .addrow > *, .statusline > * { margin: 0 0.5em 0.5em 0; }\n.row { margin-top: 0.6em; }\n.row.tight { margin-top: 0.5em; }\n\n.doc h1 { margin: 0.2em 0 0.2em; font-size: 1.6em; line-height: 1.3; }\n.title { display: block; max-width: 100%; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.title:hover { text-decoration: underline dotted; }\n.doc h1 .in { font-size: 1em; font-weight: 700; }\n.statusline { margin-top: 0.4em; }\n.state { font-weight: 700; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.5em; }\n.state.pass { background: var(--ink); color: var(--paper); }\n\n.sec { margin-top: 1.6em; border-top: 2px solid var(--ink); padding-top: 0.4em; }\n.sec-head { display: flex; align-items: center; }\n.sec-head h2 { flex: 1; margin: 0; font-size: 1.1em; line-height: 1.4; }\n.fold { border: 0; background: transparent; cursor: pointer; width: 2em; height: 2em; border-radius: 0.4em; flex: none; }\n.fold:hover { background: var(--hover); }\n.sec.closed .sec-body { display: none; }\n\n.box { margin-top: 0.4em; padding: 0.5em 0.65em; border: 1px solid transparent; border-radius: 0.55em; cursor: text; }\n.box:hover { background: var(--soft); border-color: var(--line); }\n.box:focus-visible { border-color: var(--ink); }\n.hint-note { color: var(--muted); }\n.hint-lines { margin: 0.2em 0 0; color: var(--muted); font: inherit; font-size: 0.9em; white-space: pre-wrap; overflow-wrap: anywhere; }\n.lines > * { margin: 0.2em 0; }\n.kv { overflow-wrap: anywhere; }\n.li { display: flex; align-items: flex-start; }\n.li .mk { flex: none; color: var(--muted); min-width: 1.1em; text-align: right; margin-right: 0.45em; }\n.li .tx { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.lb { color: var(--muted); }\n\n.blk { margin-top: 0.9em; padding: 0.35em 0.7em 0.5em; border: 1px solid var(--ink); border-radius: 0.65em; }\n.blk-head { display: flex; align-items: center; }\n.blk-title { flex: 1; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.blk-title .no { color: var(--muted); margin-right: 0.5em; font-weight: 400; }\n.blk-head .in { flex: 1; width: auto; }\n\n.pend { background: var(--ink); color: var(--paper); border-radius: 0.25em; padding: 0 0.3em; }\n.pend.flash { outline: 3px solid var(--ink); outline-offset: 2px; }\n.ph { border: 1px dashed var(--ink); border-radius: 0.25em; padding: 0 0.25em; }\n.ref { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; font: inherit; }\n\n/* 填写 */\ntextarea.in, input.in {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  border: 1px solid var(--line);\n  border-radius: 0.5em;\n  background: var(--paper);\n  color: var(--ink);\n  font: inherit;\n  padding: 0.45em 0.65em;\n  resize: none;\n  overflow: hidden;\n}\ntextarea.in:focus, input.in:focus { border-color: var(--ink); }\ntextarea.in.big { min-height: 9em; line-height: 1.7; }\n.addslot { margin: 0.7em 0 0.2em; }\n.addrow input.in { flex: 1 1 10em; width: auto; }\n.err { font-weight: 700; margin: 0.2em 0; }\n.err::before { content: \"× \"; }\n.hint { color: var(--muted); font-size: 0.9em; margin: 0.4em 0; overflow-wrap: anywhere; }\n.hint.pad { padding: 0.5em; }\n.p { margin: 0.4em 0; overflow-wrap: anywhere; }\n\n.field { margin: 0.9em 0; }\n.field > .fl { font-weight: 700; margin-bottom: 0.2em; }\n.opts { margin-bottom: 0.2em; }\n.chipline { display: flex; align-items: center; margin: 0.3em 0; padding: 0.15em 0.2em 0.15em 0.65em; border: 1px solid var(--line); border-radius: 0.5em; }\n.chipline span { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.thumbs { margin-top: 0.5em; }\n.thumb { position: relative; border: 1px solid var(--line); border-radius: 0.5em; padding: 0.25em; }\n.thumb img { display: block; width: 5.5em; height: 5.5em; object-fit: cover; border-radius: 0.3em; }\n.thumb .kind { display: block; text-align: center; font-size: 0.8em; color: var(--muted); }\n.thumb .btn { position: absolute; top: -0.5em; right: -0.5em; padding: 0 0.4em; background: var(--paper); }\n.list-title { margin: 1.6em 0 0.2em; padding-top: 0.4em; border-top: 2px solid var(--ink); font-size: 1.1em; }\n.card { border: 1px solid var(--line); border-radius: 0.6em; padding: 0.4em 0.4em 0.5em 0.8em; margin: 0.6em 0; }\n.card .when { flex: 1; color: var(--muted); font-size: 0.9em; }\n.card pre { margin: 0.2em 0 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }\n.pos-list { border: 1px solid var(--line); border-radius: 0.5em; max-height: 14em; overflow-y: auto; overscroll-behavior: contain; margin-top: 0.4em; }\n.pos-item { display: block; width: 100%; text-align: left; border: 0; border-bottom: 1px solid var(--line); background: var(--paper); padding: 0.4em 0.65em; cursor: pointer; overflow-wrap: anywhere; }\n.pos-item:last-child { border-bottom: 0; }\n.pos-item:hover { background: var(--hover); }\n\n/* 浮层 */\n.pop { position: fixed; z-index: var(--z-pop); background: var(--paper); border: 1px solid var(--ink); border-radius: 0.55em; min-width: 11em; max-width: calc(100vw - 1em); max-height: 70vh; overflow-y: auto; overscroll-behavior: contain; padding: 0.25em; }\n.pop button { display: block; width: 100%; text-align: left; border: 0; background: var(--paper); border-radius: 0.4em; padding: 0.4em 0.75em; cursor: pointer; overflow-wrap: anywhere; }\n.pop button:hover { background: var(--hover); }\n.pop button.on { background: var(--ink); color: var(--paper); }\n.pop button:disabled { color: var(--muted); cursor: default; }\n.pop hr { border: 0; border-top: 1px solid var(--line); margin: 0.25em 0; }\n.pop .row2 { display: flex; align-items: stretch; }\n.pop .row2 button:first-child { flex: 1; }\n.pop .row2 .x { width: 2.2em; flex: none; text-align: center; }\n\n.mask { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: var(--z-modal); background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 0.8em; }\n.modal { display: flex; flex-direction: column; width: 100%; max-width: 38em; max-height: 100%; background: var(--paper); border: 2px solid var(--ink); border-radius: 0.7em; }\n.modal-head { flex: none; display: flex; align-items: center; padding: 0.4em 0.4em 0.4em 0.9em; border-bottom: 1px solid var(--line); }\n.modal-head h2 { flex: 1; margin: 0; font-size: 1.05em; }\n.modal-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0.8em 0.9em; }\n.modal-foot { flex: none; display: flex; flex-wrap: wrap; justify-content: flex-end; padding: 0.6em 0.4em 0.1em 0.9em; border-top: 1px solid var(--line); background: var(--paper); }\n.modal-foot > * { margin: 0 0.5em 0.5em 0; }\n.modal textarea.in.big { overflow-y: auto; }\n\n.toast { position: absolute; z-index: var(--z-toast); left: 0.8em; right: 0.8em; bottom: 0.8em; margin: 0 auto; max-width: 30em; display: flex; align-items: center; background: var(--ink); color: var(--paper); border-radius: 0.55em; padding: 0.45em 0.5em 0.45em 0.85em; cursor: pointer; }\n.toast span { flex: 1; overflow-wrap: anywhere; }\n.toast .btn { background: var(--paper); color: var(--ink); border-color: var(--paper); flex: none; margin-left: 0.6em; }\n\n/* 滚动条：黑色细条，没有箭头 */\n.body::-webkit-scrollbar, .pos-list::-webkit-scrollbar, .modal-body::-webkit-scrollbar, .pop::-webkit-scrollbar { width: 0.6em; height: 0.6em; }\n.body::-webkit-scrollbar-track, .pos-list::-webkit-scrollbar-track, .modal-body::-webkit-scrollbar-track, .pop::-webkit-scrollbar-track { background: var(--paper); }\n.body::-webkit-scrollbar-thumb, .pos-list::-webkit-scrollbar-thumb, .modal-body::-webkit-scrollbar-thumb, .pop::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 1em; border: 0.15em solid var(--paper); }\n.body::-webkit-scrollbar-button, .pos-list::-webkit-scrollbar-button, .modal-body::-webkit-scrollbar-button, .pop::-webkit-scrollbar-button { display: none; width: 0; height: 0; }\n@supports not selector(::-webkit-scrollbar) {\n  .body, .pos-list, .modal-body, .pop { scrollbar-width: thin; scrollbar-color: #000000 #ffffff; }\n}\n\n/* 项目情况 */\n.status-box { margin-top: 1em; border: 1px solid var(--ink); border-radius: 0.65em; padding: 0.5em 0.8em 0.6em; }\n.status-head { display: flex; align-items: baseline; flex-wrap: wrap; }\n.status-head h2 { margin: 0 0.8em 0 0; font-size: 1.05em; }\n.bar-track { display: flex; height: 0.5em; margin: 0.4em 0 0.3em; border: 1px solid var(--ink); border-radius: 1em; overflow: hidden; background: var(--paper); }\n.bar-done { background: var(--ink); }\n.bar-doing { background: repeating-linear-gradient(45deg, var(--ink) 0, var(--ink) 3px, var(--paper) 3px, var(--paper) 6px); }\n.status-row { display: flex; align-items: center; padding: 0.25em 0; border-top: 1px solid var(--line); }\n.bar-track + .status-row { border-top: 0; }\n.status-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.status-name .muted { display: block; }\n.prog { flex: none; margin-left: 0.6em; min-width: 4.4em; border: 1px solid var(--ink); border-radius: 2em; padding: 0 0.7em; background: var(--paper); cursor: pointer; }\n.prog.done { background: var(--ink); color: var(--paper); }\n.prog.doing { font-weight: 700; }\n.prog.todo { border-color: var(--line); color: var(--muted); }\n\n/* 文件夹列表 */\n.folders .ftitle { margin: 1em 0 0.3em; font-size: 0.95em; }\n.frow { display: flex; align-items: flex-start; border: 1px solid var(--line); border-radius: 0.6em; padding: 0.5em 0.6em; margin: 0.4em 0; }\n.frow.cur { border-color: var(--ink); }\n.finfo { flex: 1; min-width: 0; }\n.fname { font-weight: 700; overflow-wrap: anywhere; }\n.badge { margin-left: 0.5em; font-weight: 400; font-size: 0.8em; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.35em; }\n.fpath { color: var(--muted); font-size: 0.85em; overflow-wrap: anywhere; }\n.factions { flex: none; display: flex; flex-direction: column; margin-left: 0.6em; }\n.factions .btn { margin-bottom: 0.3em; }\n";
const ICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><rect width=\"512\" height=\"512\" rx=\"113\" fill=\"#e5322d\"/><g transform=\"translate(256 256) rotate(-20) scale(1.0067)\"><path d=\"M187.8 0.0L188.0 2.4L188.2 4.9L188.3 7.3L188.3 9.8L188.2 12.2L188.0 14.7L187.8 17.1L187.5 19.5L187.1 22.0L186.6 24.4L186.1 26.8L185.5 29.2L184.8 31.6L184.0 34.0L183.1 36.4L182.2 38.7L181.2 41.1L180.1 43.4L179.0 45.7L177.7 48.0L176.4 50.2L175.1 52.5L173.6 54.7L172.1 56.8L170.6 59.0L169.0 61.1L167.3 63.2L165.5 65.3L163.7 67.3L161.9 69.3L159.9 71.3L158.0 73.2L156.0 75.1L153.9 77.0L151.8 78.8L149.6 80.6L147.4 82.4L145.1 84.1L142.9 85.8L140.5 87.4L138.2 89.1L135.8 90.7L133.3 92.2L130.9 93.7L128.4 95.2L125.8 96.6L123.3 98.0L120.7 99.4L118.1 100.7L115.5 102.0L112.8 103.3L110.1 104.5L107.4 105.7L104.7 106.9L102.0 108.0L99.2 109.1L96.5 110.2L93.7 111.2L90.9 112.2L88.1 113.2L85.3 114.1L82.5 115.0L79.6 115.9L76.8 116.7L73.9 117.5L71.0 118.3L68.1 119.0L65.2 119.7L62.3 120.4L59.4 121.1L56.5 121.7L53.6 122.3L50.7 122.9L47.7 123.4L44.8 123.9L41.8 124.4L38.9 124.9L35.9 125.3L32.9 125.7L30.0 126.0L27.0 126.4L24.0 126.7L21.0 127.0L18.0 127.2L15.0 127.4L12.0 127.6L9.0 127.7L6.0 127.8L3.0 127.9L0.0 128.0L-3.0 128.0L-6.0 128.0L-9.0 127.9L-12.1 127.8L-15.1 127.7L-18.1 127.6L-21.1 127.4L-24.1 127.1L-27.1 126.9L-30.1 126.6L-33.1 126.3L-36.1 125.9L-39.1 125.5L-42.0 125.0L-45.0 124.5L-48.0 124.0L-50.9 123.4L-53.8 122.8L-56.7 122.2L-59.6 121.5L-62.5 120.8L-65.4 120.0L-68.3 119.2L-71.1 118.4L-73.9 117.5L-76.7 116.6L-79.5 115.7L-82.2 114.7L-84.9 113.6L-87.6 112.6L-90.3 111.5L-92.9 110.3L-95.6 109.1L-98.1 107.9L-100.7 106.6L-103.2 105.4L-105.7 104.0L-108.2 102.7L-110.6 101.3L-112.9 99.8L-115.3 98.4L-117.6 96.9L-119.9 95.3L-122.1 93.8L-124.3 92.2L-126.4 90.5L-128.5 88.9L-130.6 87.2L-132.6 85.5L-134.6 83.7L-136.5 82.0L-138.4 80.2L-140.3 78.4L-142.1 76.5L-143.8 74.7L-145.5 72.8L-147.2 70.9L-148.8 69.0L-150.4 67.0L-151.9 65.1L-153.4 63.1L-154.9 61.1L-156.3 59.0L-157.6 57.0L-158.9 55.0L-160.2 52.9L-161.4 50.8L-162.6 48.7L-163.7 46.6L-164.8 44.5L-165.8 42.3L-166.8 40.2L-167.8 38.0L-168.7 35.9L-169.6 33.7L-170.4 31.5L-171.1 29.3L-171.9 27.1L-172.6 24.9L-173.2 22.6L-173.8 20.4L-174.4 18.2L-174.9 15.9L-175.4 13.7L-175.8 11.4L-176.2 9.1L-176.5 6.9L-176.8 4.6L-177.1 2.3L-177.3 0.0L-177.4 -2.3L-177.5 -4.6L-177.6 -6.9L-177.6 -9.2L-177.6 -11.5L-177.5 -13.8L-177.4 -16.2L-177.3 -18.5L-177.0 -20.8L-176.8 -23.1L-176.5 -25.4L-176.1 -27.8L-175.7 -30.1L-175.2 -32.4L-174.7 -34.7L-174.1 -37.0L-173.5 -39.3L-172.8 -41.6L-172.1 -43.9L-171.3 -46.2L-170.5 -48.5L-169.6 -50.8L-168.6 -53.1L-167.6 -55.3L-166.5 -57.6L-165.4 -59.8L-164.2 -62.0L-163.0 -64.3L-161.6 -66.4L-160.3 -68.6L-158.9 -70.8L-157.4 -72.9L-155.8 -75.0L-154.2 -77.1L-152.6 -79.2L-150.8 -81.3L-149.1 -83.3L-147.2 -85.3L-145.3 -87.3L-143.4 -89.2L-141.3 -91.1L-139.3 -93.0L-137.1 -94.8L-135.0 -96.6L-132.7 -98.4L-130.4 -100.2L-128.1 -101.9L-125.7 -103.5L-123.2 -105.1L-120.7 -106.7L-118.2 -108.2L-115.6 -109.7L-113.0 -111.2L-110.3 -112.6L-107.6 -113.9L-104.8 -115.2L-102.0 -116.5L-99.1 -117.7L-96.3 -118.8L-93.4 -119.9L-90.4 -121.0L-87.5 -122.0L-84.5 -122.9L-81.4 -123.8L-78.4 -124.7L-75.3 -125.4L-72.2 -126.2L-69.1 -126.9L-66.0 -127.5L-62.9 -128.1L-59.7 -128.6L-56.6 -129.1L-53.4 -129.5L-50.2 -129.9L-47.0 -130.2L-43.9 -130.5L-40.7 -130.7L-37.5 -130.8L-34.3 -131.0L-31.2 -131.0L-28.0 -131.1L-24.8 -131.0L-21.7 -131.0L-18.5 -130.9L-15.4 -130.7L-12.3 -130.5L-9.2 -130.3L-6.1 -130.0L-3.1 -129.7L-0.0 -129.3L3.0 -128.9L6.1 -128.5L9.0 -128.0L12.0 -127.5L15.0 -127.0L17.9 -126.4L20.8 -125.8L23.7 -125.2L26.6 -124.6L29.5 -123.9L32.3 -123.2L35.1 -122.5L37.9 -121.7L40.7 -120.9L43.4 -120.1L46.1 -119.3L48.8 -118.5L51.5 -117.6L54.2 -116.7L56.8 -115.8L59.5 -114.9L62.1 -113.9L64.7 -113.0L67.2 -112.0L69.8 -111.0L72.4 -110.0L74.9 -109.0L77.4 -107.9L79.9 -106.9L82.4 -105.8L84.8 -104.7L87.3 -103.6L89.7 -102.5L92.2 -101.3L94.6 -100.2L97.0 -99.0L99.4 -97.8L101.8 -96.6L104.1 -95.4L106.5 -94.1L108.9 -92.9L111.2 -91.6L113.5 -90.3L115.8 -88.9L118.1 -87.6L120.4 -86.2L122.7 -84.8L124.9 -83.4L127.1 -82.0L129.4 -80.5L131.6 -79.0L133.7 -77.5L135.9 -75.9L138.0 -74.4L140.2 -72.8L142.2 -71.2L144.3 -69.5L146.4 -67.8L148.4 -66.1L150.4 -64.4L152.3 -62.6L154.2 -60.8L156.1 -59.0L158.0 -57.1L159.8 -55.3L161.6 -53.4L163.3 -51.4L165.0 -49.4L166.7 -47.4L168.3 -45.4L169.8 -43.4L171.3 -41.3L172.8 -39.2L174.2 -37.0L175.5 -34.9L176.8 -32.7L178.0 -30.5L179.2 -28.2L180.3 -26.0L181.3 -23.7L182.3 -21.4L183.2 -19.1L184.0 -16.8L184.8 -14.4L185.4 -12.0L186.1 -9.6L186.6 -7.3L187.1 -4.8L187.5 -2.4Z\" fill=\"#e3a400\"/><path d=\"M174.6 0.0L174.9 2.3L175.0 4.5L175.1 6.8L175.1 9.1L175.0 11.4L174.9 13.6L174.7 15.9L174.4 18.2L174.0 20.4L173.6 22.7L173.1 24.9L172.5 27.2L171.8 29.4L171.1 31.6L170.3 33.8L169.4 36.0L168.5 38.2L167.5 40.4L166.4 42.5L165.3 44.6L164.1 46.7L162.8 48.8L161.5 50.8L160.1 52.9L158.6 54.9L157.1 56.8L155.6 58.8L153.9 60.7L152.3 62.6L150.5 64.4L148.7 66.3L146.9 68.1L145.0 69.8L143.1 71.6L141.1 73.3L139.1 75.0L137.1 76.6L135.0 78.2L132.9 79.8L130.7 81.3L128.5 82.8L126.3 84.3L124.0 85.7L121.7 87.2L119.4 88.5L117.0 89.9L114.6 91.2L112.2 92.4L109.8 93.7L107.4 94.9L104.9 96.1L102.4 97.2L99.9 98.3L97.4 99.4L94.9 100.5L92.3 101.5L89.7 102.5L87.1 103.4L84.5 104.3L81.9 105.2L79.3 106.1L76.7 106.9L74.0 107.8L71.4 108.5L68.7 109.3L66.0 110.0L63.4 110.7L60.7 111.4L58.0 112.0L55.3 112.6L52.6 113.2L49.8 113.8L47.1 114.3L44.4 114.8L41.6 115.3L38.9 115.7L36.2 116.1L33.4 116.5L30.6 116.9L27.9 117.2L25.1 117.5L22.3 117.8L19.5 118.1L16.8 118.3L14.0 118.5L11.2 118.6L8.4 118.8L5.6 118.9L2.8 119.0L0.0 119.0L-2.8 119.0L-5.6 119.0L-8.4 119.0L-11.2 118.9L-14.0 118.8L-16.8 118.6L-19.6 118.5L-22.4 118.2L-25.2 118.0L-28.0 117.7L-30.8 117.4L-33.6 117.1L-36.3 116.7L-39.1 116.3L-41.8 115.8L-44.6 115.3L-47.3 114.8L-50.1 114.2L-52.8 113.6L-55.5 113.0L-58.2 112.3L-60.8 111.6L-63.5 110.9L-66.1 110.1L-68.7 109.3L-71.3 108.5L-73.9 107.6L-76.5 106.6L-79.0 105.7L-81.5 104.7L-84.0 103.7L-86.4 102.6L-88.9 101.5L-91.3 100.4L-93.6 99.2L-96.0 98.0L-98.3 96.7L-100.6 95.5L-102.8 94.2L-105.0 92.8L-107.2 91.5L-109.4 90.1L-111.5 88.6L-113.5 87.2L-115.6 85.7L-117.6 84.2L-119.5 82.7L-121.4 81.1L-123.3 79.5L-125.2 77.9L-127.0 76.2L-128.7 74.6L-130.4 72.9L-132.1 71.2L-133.8 69.5L-135.3 67.7L-136.9 65.9L-138.4 64.1L-139.9 62.3L-141.3 60.5L-142.7 58.7L-144.0 56.8L-145.3 54.9L-146.6 53.0L-147.8 51.1L-149.0 49.2L-150.1 47.3L-151.2 45.3L-152.3 43.3L-153.3 41.4L-154.2 39.4L-155.2 37.4L-156.0 35.4L-156.9 33.4L-157.7 31.3L-158.4 29.3L-159.2 27.3L-159.8 25.2L-160.5 23.1L-161.1 21.1L-161.6 19.0L-162.2 16.9L-162.6 14.8L-163.1 12.7L-163.5 10.6L-163.8 8.5L-164.2 6.4L-164.4 4.3L-164.7 2.1L-164.9 0.0L-165.0 -2.1L-165.1 -4.3L-165.2 -6.4L-165.2 -8.6L-165.2 -10.7L-165.1 -12.9L-165.0 -15.0L-164.8 -17.2L-164.6 -19.3L-164.4 -21.5L-164.1 -23.7L-163.8 -25.8L-163.4 -28.0L-163.0 -30.1L-162.5 -32.3L-161.9 -34.4L-161.4 -36.6L-160.7 -38.7L-160.0 -40.9L-159.3 -43.0L-158.5 -45.1L-157.7 -47.2L-156.8 -49.4L-155.9 -51.5L-154.9 -53.6L-153.8 -55.6L-152.7 -57.7L-151.5 -59.8L-150.3 -61.8L-149.1 -63.8L-147.7 -65.8L-146.4 -67.8L-144.9 -69.8L-143.4 -71.7L-141.9 -73.7L-140.3 -75.6L-138.6 -77.5L-136.9 -79.3L-135.1 -81.2L-133.3 -83.0L-131.4 -84.7L-129.5 -86.5L-127.5 -88.2L-125.5 -89.9L-123.4 -91.5L-121.3 -93.1L-119.1 -94.7L-116.9 -96.3L-114.6 -97.8L-112.3 -99.2L-109.9 -100.7L-107.5 -102.0L-105.1 -103.4L-102.6 -104.7L-100.0 -105.9L-97.5 -107.1L-94.8 -108.3L-92.2 -109.4L-89.5 -110.5L-86.8 -111.5L-84.1 -112.5L-81.3 -113.4L-78.5 -114.3L-75.7 -115.1L-72.9 -115.9L-70.0 -116.7L-67.2 -117.4L-64.3 -118.0L-61.4 -118.6L-58.5 -119.1L-55.5 -119.6L-52.6 -120.0L-49.7 -120.4L-46.7 -120.8L-43.7 -121.1L-40.8 -121.3L-37.8 -121.5L-34.9 -121.7L-31.9 -121.8L-29.0 -121.9L-26.0 -121.9L-23.1 -121.9L-20.2 -121.8L-17.2 -121.7L-14.3 -121.6L-11.4 -121.4L-8.6 -121.2L-5.7 -120.9L-2.8 -120.6L-0.0 -120.3L2.8 -119.9L5.6 -119.5L8.4 -119.1L11.2 -118.6L13.9 -118.1L16.7 -117.6L19.4 -117.0L22.1 -116.5L24.7 -115.9L27.4 -115.2L30.0 -114.6L32.6 -113.9L35.2 -113.2L37.8 -112.5L40.4 -111.7L42.9 -110.9L45.4 -110.2L47.9 -109.4L50.4 -108.5L52.9 -107.7L55.3 -106.8L57.7 -106.0L60.1 -105.1L62.5 -104.2L64.9 -103.2L67.3 -102.3L69.6 -101.4L72.0 -100.4L74.3 -99.4L76.6 -98.4L78.9 -97.4L81.2 -96.4L83.5 -95.3L85.7 -94.2L88.0 -93.2L90.2 -92.1L92.4 -91.0L94.7 -89.8L96.9 -88.7L99.1 -87.5L101.2 -86.4L103.4 -85.2L105.6 -83.9L107.7 -82.7L109.8 -81.5L112.0 -80.2L114.1 -78.9L116.2 -77.6L118.2 -76.2L120.3 -74.9L122.3 -73.5L124.4 -72.1L126.4 -70.6L128.4 -69.2L130.3 -67.7L132.3 -66.2L134.2 -64.6L136.1 -63.1L138.0 -61.5L139.8 -59.9L141.7 -58.2L143.4 -56.6L145.2 -54.9L146.9 -53.1L148.6 -51.4L150.3 -49.6L151.9 -47.8L153.5 -46.0L155.0 -44.1L156.5 -42.2L157.9 -40.3L159.3 -38.4L160.7 -36.4L162.0 -34.4L163.2 -32.4L164.4 -30.4L165.5 -28.3L166.6 -26.3L167.6 -24.2L168.6 -22.0L169.5 -19.9L170.3 -17.8L171.1 -15.6L171.8 -13.4L172.5 -11.2L173.0 -9.0L173.5 -6.7L174.0 -4.5L174.3 -2.3Z\" fill=\"#ffd21f\"/><path d=\"M-131.7 -70.8L-129.5 -73.0L-127.3 -75.3L-125.1 -74.6L-122.9 -73.5L-120.7 -72.4L-118.5 -71.2L-116.4 -69.7L-114.2 -68.2L-112.0 -66.4L-109.8 -64.5L-107.6 -62.4L-105.4 -60.3L-103.2 -58.0L-101.0 -56.8L-98.8 -57.8L-96.6 -58.9L-94.4 -60.1L-92.2 -61.4L-90.0 -62.9L-87.8 -64.5L-85.6 -66.4L-83.4 -68.3L-81.2 -70.4L-79.0 -72.7L-76.8 -74.9L-74.6 -74.8L-72.4 -73.7L-70.3 -72.6L-68.1 -71.4L-65.9 -70.0L-63.7 -68.4L-61.5 -66.7L-59.3 -64.8L-57.1 -62.8L-54.9 -60.6L-52.7 -58.4L-50.5 -56.7L-48.3 -57.7L-46.1 -58.7L-43.9 -59.9L-41.7 -61.2L-39.5 -62.6L-37.3 -64.3L-35.1 -66.0L-32.9 -68.0L-30.7 -70.1L-28.5 -72.3L-26.3 -74.6L-24.1 -74.9L-22.0 -73.9L-19.8 -72.8L-17.6 -71.6L-15.4 -70.2L-13.2 -68.7L-11.0 -67.0L-8.8 -65.2L-6.6 -63.1L-4.4 -61.0L-2.2 -58.8L0.0 -56.5L2.2 -57.5L4.4 -58.6L6.6 -59.7L8.8 -61.0L11.0 -62.4L13.2 -64.0L15.4 -65.7L17.6 -67.7L19.8 -69.7L22.0 -71.9L24.1 -74.2L26.3 -75.1L28.5 -74.1L30.7 -73.0L32.9 -71.8L35.1 -70.5L37.3 -69.0L39.5 -67.3L41.7 -65.5L43.9 -63.5L46.1 -61.4L48.3 -59.1L50.5 -56.9L52.7 -57.3L54.9 -58.4L57.1 -59.5L59.3 -60.7L61.5 -62.1L63.7 -63.7L65.9 -65.4L68.1 -67.3L70.3 -69.4L72.4 -71.5L74.6 -73.8L76.8 -75.3L79.0 -74.2L81.2 -73.2L83.4 -72.0L85.6 -70.7L87.8 -69.2L90.0 -67.6L92.2 -65.8L94.4 -63.8L96.6 -61.7L98.8 -59.5L101.0 -57.3L103.2 -57.2L105.4 -58.2L107.6 -59.3L109.8 -60.5L112.0 -61.9L114.2 -63.4L116.4 -65.1L118.5 -67.0L120.7 -69.0L122.9 -71.2L125.1 -73.4L127.3 -75.4L129.5 -74.4L131.7 -73.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 -4.8L-129.5 -7.0L-127.3 -9.3L-125.1 -8.6L-122.9 -7.5L-120.7 -6.4L-118.5 -5.2L-116.4 -3.7L-114.2 -2.2L-112.0 -0.4L-109.8 1.5L-107.6 3.6L-105.4 5.7L-103.2 8.0L-101.0 9.2L-98.8 8.2L-96.6 7.1L-94.4 5.9L-92.2 4.6L-90.0 3.1L-87.8 1.5L-85.6 -0.4L-83.4 -2.3L-81.2 -4.4L-79.0 -6.7L-76.8 -8.9L-74.6 -8.8L-72.4 -7.7L-70.3 -6.6L-68.1 -5.4L-65.9 -4.0L-63.7 -2.4L-61.5 -0.7L-59.3 1.2L-57.1 3.2L-54.9 5.4L-52.7 7.6L-50.5 9.3L-48.3 8.3L-46.1 7.3L-43.9 6.1L-41.7 4.8L-39.5 3.4L-37.3 1.7L-35.1 -0.0L-32.9 -2.0L-30.7 -4.1L-28.5 -6.3L-26.3 -8.6L-24.1 -8.9L-22.0 -7.9L-19.8 -6.8L-17.6 -5.6L-15.4 -4.2L-13.2 -2.7L-11.0 -1.0L-8.8 0.8L-6.6 2.9L-4.4 5.0L-2.2 7.2L0.0 9.5L2.2 8.5L4.4 7.4L6.6 6.3L8.8 5.0L11.0 3.6L13.2 2.0L15.4 0.3L17.6 -1.7L19.8 -3.7L22.0 -5.9L24.1 -8.2L26.3 -9.1L28.5 -8.1L30.7 -7.0L32.9 -5.8L35.1 -4.5L37.3 -3.0L39.5 -1.3L41.7 0.5L43.9 2.5L46.1 4.6L48.3 6.9L50.5 9.1L52.7 8.7L54.9 7.6L57.1 6.5L59.3 5.3L61.5 3.9L63.7 2.3L65.9 0.6L68.1 -1.3L70.3 -3.4L72.4 -5.5L74.6 -7.8L76.8 -9.3L79.0 -8.2L81.2 -7.2L83.4 -6.0L85.6 -4.7L87.8 -3.2L90.0 -1.6L92.2 0.2L94.4 2.2L96.6 4.3L98.8 6.5L101.0 8.7L103.2 8.8L105.4 7.8L107.6 6.7L109.8 5.5L112.0 4.1L114.2 2.6L116.4 0.9L118.5 -1.0L120.7 -3.0L122.9 -5.2L125.1 -7.4L127.3 -9.4L129.5 -8.4L131.7 -7.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 61.2L-129.5 59.0L-127.3 56.7L-125.1 57.4L-122.9 58.5L-120.7 59.6L-118.5 60.8L-116.4 62.3L-114.2 63.8L-112.0 65.6L-109.8 67.5L-107.6 69.6L-105.4 71.7L-103.2 74.0L-101.0 75.2L-98.8 74.2L-96.6 73.1L-94.4 71.9L-92.2 70.6L-90.0 69.1L-87.8 67.5L-85.6 65.6L-83.4 63.7L-81.2 61.6L-79.0 59.3L-76.8 57.1L-74.6 57.2L-72.4 58.3L-70.3 59.4L-68.1 60.6L-65.9 62.0L-63.7 63.6L-61.5 65.3L-59.3 67.2L-57.1 69.2L-54.9 71.4L-52.7 73.6L-50.5 75.3L-48.3 74.3L-46.1 73.3L-43.9 72.1L-41.7 70.8L-39.5 69.4L-37.3 67.7L-35.1 66.0L-32.9 64.0L-30.7 61.9L-28.5 59.7L-26.3 57.4L-24.1 57.1L-22.0 58.1L-19.8 59.2L-17.6 60.4L-15.4 61.8L-13.2 63.3L-11.0 65.0L-8.8 66.8L-6.6 68.9L-4.4 71.0L-2.2 73.2L0.0 75.5L2.2 74.5L4.4 73.4L6.6 72.3L8.8 71.0L11.0 69.6L13.2 68.0L15.4 66.3L17.6 64.3L19.8 62.3L22.0 60.1L24.1 57.8L26.3 56.9L28.5 57.9L30.7 59.0L32.9 60.2L35.1 61.5L37.3 63.0L39.5 64.7L41.7 66.5L43.9 68.5L46.1 70.6L48.3 72.9L50.5 75.1L52.7 74.7L54.9 73.6L57.1 72.5L59.3 71.3L61.5 69.9L63.7 68.3L65.9 66.6L68.1 64.7L70.3 62.6L72.4 60.5L74.6 58.2L76.8 56.7L79.0 57.8L81.2 58.8L83.4 60.0L85.6 61.3L87.8 62.8L90.0 64.4L92.2 66.2L94.4 68.2L96.6 70.3L98.8 72.5L101.0 74.7L103.2 74.8L105.4 73.8L107.6 72.7L109.8 71.5L112.0 70.1L114.2 68.6L116.4 66.9L118.5 65.0L120.7 63.0L122.9 60.8L125.1 58.6L127.3 56.6L129.5 57.6L131.7 58.6\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/></g></svg>";
const Core = (function () { const module = { exports: {} };
'use strict';
// 计划书的文本模型：不依赖界面，浏览器和命令行共用，中文和英文都能读写。
// 文档按行保存，编辑只改行，导出就是把行接回去，所以导出再导入内容不变。

// 第几部分是什么（和模板里的编号一致）
const SEC = { what: '1', flows: '2', pages: '3', features: '4', data: '5', other: '6' };
const LAST_FILLED = 6;

const TBD_RE = /(?:待补|TBD)[：:]/g;
const TBD_QUOTED_RE = /[「"“](?:待补|TBD)[^」"”]*[」"”]/g;
const PLACEHOLDER_RE = /〈[^〉]*〉/g;
const INSTRUCTION_LINE_RE = /^〈[^〉]*〉$/;

const WORDS = {
  zh: {
    title: '计划书', status: '状态', updated: '更新', tbd: '待补', missing: '缺',
    states: { draft: '草稿', doing: '整理中', approved: '已通过' },
    progress: { label: '进度', todo: '未做', doing: '进行中', done: '已完成' },
    page: { fields: ['这个界面是干什么的：', '界面上有什么：', '怎么来到这个界面：'] },
    feature: { fields: ['它做什么：', '怎么才算做好：', '有什么限制：'], progressLabel: '进度：' },
    newFlow: '〈名字〉：待补：用户做什么 → 看到什么',
  },
  en: {
    title: 'Plan', status: 'Status', updated: 'Updated', tbd: 'TBD', missing: 'missing ',
    states: { draft: 'Draft', doing: 'In progress', approved: 'Approved' },
    progress: { label: 'Progress', todo: 'Not started', doing: 'In progress', done: 'Done' },
    page: { fields: ['What this screen is for:', 'What is on the screen:', 'How the user gets here:'] },
    feature: { fields: ['What it does:', 'Done when:', 'Limits:'], progressLabel: 'Progress:' },
    newFlow: '〈Name〉: TBD: what the user does → what they see',
  },
};

const PARTS_RE = /^(?:界面上有什么|What is on the screen|页面里有什么|What is on the page|部件|Parts?)$/i;
const CASES_RE = /^(?:怎么才算做好|Done when|用例|Use cases?)$/i;
const WHAT_RE = /^(?:它做什么|做什么|What it does|一句话)$/i;
const PROGRESS_LABEL_RE = /^(?:进度|Progress)$/i;
const STATE_WORDS = [
  [/^(?:草稿|draft)$/i, 'draft'],
  [/^(?:整理中|in progress)$/i, 'doing'],
  [/^(?:已通过|approved)$/i, 'approved'],
];

function split(md) {
  return String(md || '').replace(/\r\n?/g, '\n').split('\n');
}

function join(lines) {
  return lines.join('\n');
}

function info(text) {
  let m;
  if (/^\s*$/.test(text)) return { kind: 'blank' };
  if ((m = /^(#{1,6})\s+(.*)$/.exec(text))) return { kind: 'h', level: m[1].length, body: m[2].trim() };
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(text)) return { kind: 'hr' };
  if ((m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(text))) {
    return { kind: 'li', indent: m[1].replace(/\t/g, '    ').length, marker: m[2], ordered: /\d/.test(m[2]), body: m[3] };
  }
  return { kind: 'p', indent: /^(\s*)/.exec(text)[1].length, body: text.trim() };
}

// 「名字：内容」的拆分；名字里不含句号、逗号、分号，且不超过 40 个字符
function splitLabel(body) {
  const m = /^([^：:。，；]{1,40}?)(?:：|:\s|:$)\s*(.*)$/.exec(body);
  if (!m) return null;
  const label = m[1].trim();
  if (/^(?:待补|TBD)$/i.test(label)) return null;
  return { label, value: m[2] };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function today(d) {
  const t = d || new Date();
  return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
}

function timeStamp(d) {
  const t = d || new Date();
  return t.getFullYear() + pad2(t.getMonth() + 1) + pad2(t.getDate()) + '-' + pad2(t.getHours()) + pad2(t.getMinutes()) + pad2(t.getSeconds());
}

// 文档用的是哪种语言：看状态行和标题，再看有没有汉字
function docLang(md) {
  const head = split(md).slice(0, 12).join('\n');
  if (/^状态[：:]|^#\s+(?:计划书|修改单)/m.test(head)) return 'zh';
  if (/^Status:|^#\s+(?:Plan|Change):/m.test(head)) return 'en';
  return /[一-鿿]/.test(md) ? 'zh' : 'en';
}

function footerStart(lines) {
  for (let i = lines.length - 1; i >= 0; i--) if (info(lines[i]).kind === 'hr') return i;
  return lines.length;
}

// 一个标题或列表项的子树结束位置（不含）
function rangeEnd(lines, i) {
  const me = info(lines[i]);
  const n = lines.length;
  let j = i + 1;
  if (me.kind === 'h') {
    while (j < n) {
      const t = info(lines[j]);
      if (t.kind === 'hr') break;
      if (t.kind === 'h' && t.level <= me.level) break;
      j++;
    }
  } else if (me.kind === 'li') {
    while (j < n) {
      const t = info(lines[j]);
      if (t.kind === 'blank') {
        let k = j + 1;
        while (k < n && info(lines[k]).kind === 'blank') k++;
        const nx = k < n ? info(lines[k]) : null;
        if (nx && nx.kind === 'li' && nx.indent > me.indent) { j = k; continue; }
        break;
      }
      if (t.kind === 'li' && t.indent > me.indent) { j++; continue; }
      if (t.kind === 'p' && t.indent > me.indent) { j++; continue; }
      break;
    }
  }
  while (j > i + 1 && info(lines[j - 1]).kind === 'blank') j--;
  return j;
}

// 标题自己的正文范围：到下一个标题或分隔线为止（不含子标题的内容）
function bodyRange(lines, i) {
  let j = i + 1;
  while (j < lines.length) {
    const t = info(lines[j]);
    if (t.kind === 'h' || t.kind === 'hr') break;
    j++;
  }
  return { start: i + 1, end: j };
}

function bodyText(lines, i) {
  const r = bodyRange(lines, i);
  return lines.slice(r.start, r.end).join('\n').replace(/^\n+|\n+$/g, '');
}

function setBody(md, headingLine, text) {
  const lines = split(md);
  const r = bodyRange(lines, headingLine);
  const t = String(text || '').replace(/\r\n?/g, '\n').replace(/^\n+|\n+$/g, '');
  const add = t ? [''].concat(t.split('\n'), ['']) : [''];
  return join(lines.slice(0, r.start).concat(add, lines.slice(r.end))).replace(/\n{3,}/g, '\n\n');
}

function deleteSubtree(lines, i) {
  const e = rangeEnd(lines, i);
  const out = lines.slice(0, i).concat(lines.slice(e));
  if (i > 0 && i < out.length && info(out[i - 1]).kind === 'blank' && info(out[i]).kind === 'blank') out.splice(i, 1);
  return out;
}

function sectionNo(lines, i) {
  for (let j = i; j >= 0; j--) {
    const t = info(lines[j]);
    if (t.kind === 'h' && t.level === 2) {
      const m = /^(\d+)\b/.exec(t.body);
      return m ? m[1] : '';
    }
  }
  return '';
}

function headings(lines) {
  const out = [];
  const end = footerStart(lines);
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    if (t.kind === 'h') out.push({ line: i, level: t.level, body: t.body });
  });
  return out;
}

function nextNonBlank(lines, i) {
  let j = i + 1;
  while (j < lines.length && info(lines[j]).kind === 'blank') j++;
  return j < lines.length ? j : -1;
}

// 「名字：」后面没有内容，也没有跟着列表
function isEmptyField(lines, i) {
  const t = info(lines[i]);
  if (t.kind !== 'p' && t.kind !== 'li') return false;
  const lv = splitLabel(t.body);
  if (!lv || lv.value.trim() !== '') return false;
  if (t.kind === 'li') return rangeEnd(lines, i) === i + 1;
  const nx = nextNonBlank(lines, i);
  return !(nx >= 0 && info(lines[nx]).kind === 'li');
}

// ---------- 待补 ----------

function pendingCount(text) {
  const t = text.replace(TBD_QUOTED_RE, '');
  const a = t.match(TBD_RE);
  const b = t.match(PLACEHOLDER_RE);
  return (a ? a.length : 0) + (b ? b.length : 0);
}

function pendingList(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const out = [];
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    if (t.kind === 'blank' || t.kind === 'hr') return;
    if (/^(?:已通过|Approved)\s*(?:=|is)/.test(text.trim())) return;
    let n = pendingCount(text);
    if (isEmptyField(lines, i)) n += 1;
    if (t.kind === 'h' && t.level === 2) {
      const m = /^(\d+)\b/.exec(t.body);
      if (m && Number(m[1]) >= 1 && Number(m[1]) <= LAST_FILLED) {
        const r = bodyRange(lines, i);
        const hasBody = lines.slice(r.start, r.end).some((l) => info(l).kind !== 'blank');
        const nx = nextNonBlank(lines, i);
        const hasChild = nx >= 0 && info(lines[nx]).kind === 'h' && info(lines[nx]).level >= 3;
        if (!hasBody && !hasChild) n += 1;
      }
    }
    if (n > 0) out.push({ line: i, count: n, text: text.trim(), section: sectionNo(lines, i) });
  });
  return out;
}

function countPending(md) {
  return pendingList(md).reduce((s, x) => s + x.count, 0);
}

// ---------- 状态 ----------

const STATUS_LINE_RE = /^(状态|Status)([：:]\s*)(.*?)((?:　+|\s{2,})(?:更新|Updated)[：:].*)?$/;

function stateCode(word) {
  const w = String(word || '').trim();
  for (const [re, code] of STATE_WORDS) if (re.test(w)) return code;
  return '';
}

// 返回 draft / doing / approved，找不到返回空字符串
function getStatus(md) {
  const lines = split(md).slice(0, 14);
  for (const l of lines) {
    const m = STATUS_LINE_RE.exec(l);
    if (m) return stateCode(m[3]);
  }
  return '';
}

function statusLabel(code, lang) {
  return (WORDS[lang] || WORDS.zh).states[code] || '';
}

function setStatus(md, code, date) {
  const lines = split(md);
  const lang = docLang(md);
  for (let i = 0; i < Math.min(lines.length, 14); i++) {
    const m = STATUS_LINE_RE.exec(lines[i]);
    if (m) {
      let tail = m[4] || '';
      if (tail) tail = tail.replace(/((?:更新|Updated)[：:]\s*).*$/, '$1' + (date || today()));
      lines[i] = m[1] + m[2] + statusLabel(code, lang) + tail;
      return join(lines);
    }
  }
  return md;
}

function markPassed(md, date) {
  const n = countPending(md);
  if (n > 0) return { ok: false, pending: n, md };
  return { ok: true, pending: 0, md: setStatus(md, 'approved', date) };
}

// ---------- 名称与位置 ----------

const TITLE_RE = /^#\s+(?:(?:计划书|修改单|Plan|Change)[：:]\s*)?(.*)$/;

function titleName(md) {
  const t = split(md).find((l) => /^#\s+/.test(l));
  if (!t) return '';
  const m = TITLE_RE.exec(t);
  const v = (m ? m[1] : '').trim();
  return /〈[^〉]*〉/.test(v) ? '' : v;
}

function setTitle(md, name) {
  const lines = split(md);
  const lang = docLang(md);
  const i = lines.findIndex((l) => /^#\s+/.test(l));
  const v = String(name || '').trim() || (lang === 'zh' ? '〈项目名〉' : '〈Project name〉');
  const sep = lang === 'zh' ? '：' : ': ';
  if (i < 0) return '# ' + WORDS[lang].title + sep + v + '\n\n' + md;
  lines[i] = '# ' + WORDS[lang].title + sep + v;
  return join(lines);
}

function numberedName(body) {
  const m = /^(\d+\.\d+)\s+(.*)$/.exec(body);
  return m ? { no: m[1], name: m[2].trim() } : { no: '', name: body.trim() };
}

function findBlock(lines, i) {
  for (let j = i; j >= 0; j--) {
    const t = info(lines[j]);
    if (t.kind === 'h' && t.level === 3) return j;
    if (t.kind === 'h' && t.level <= 2) return -1;
  }
  return -1;
}

function blockName(lines, j) {
  if (j < 0) return '';
  const nn = numberedName(info(lines[j]).body);
  return (nn.no ? nn.no + ' ' : '') + nn.name;
}

// 某一行「页面里有什么：」「怎么才算做好：」下面的列表项
function itemsUnder(lines, i) {
  const t = info(lines[i]);
  const out = [];
  if (t.kind === 'li') {
    const e = rangeEnd(lines, i);
    let childIndent = -1;
    for (let j = i + 1; j < e; j++) {
      const c = info(lines[j]);
      if (c.kind !== 'li') continue;
      if (childIndent < 0) childIndent = c.indent;
      if (c.indent === childIndent) out.push(j);
    }
    return out;
  }
  let j = i + 1;
  while (j < lines.length) {
    const c = info(lines[j]);
    if (c.kind === 'li') { out.push(j); j++; continue; }
    if (c.kind === 'blank') {
      const nx = nextNonBlank(lines, j - 1);
      if (nx >= 0 && info(lines[nx]).kind === 'li' && out.length) { j = nx; continue; }
    }
    break;
  }
  return out;
}

function itemName(body) {
  const lv = splitLabel(body);
  return (lv ? lv.label : body).trim();
}

function structure(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const pages = [];
  const features = [];
  const widgets = [];
  const cases = [];
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    const sec = sectionNo(lines, i);
    if (t.kind === 'h' && t.level === 3) {
      const nn = numberedName(t.body);
      if (sec === SEC.pages) pages.push({ line: i, no: nn.no, name: nn.name });
      if (sec === SEC.features) features.push({ line: i, no: nn.no, name: nn.name });
      return;
    }
    if (t.kind !== 'p' && t.kind !== 'li') return;
    const lv = splitLabel(t.body);
    if (!lv) return;
    if (sec === SEC.pages && PARTS_RE.test(lv.label)) {
      itemsUnder(lines, i).forEach((j) => widgets.push({ line: j, name: itemName(info(lines[j]).body), block: findBlock(lines, j) }));
    }
    if (sec === SEC.features && CASES_RE.test(lv.label)) {
      itemsUnder(lines, i).forEach((j) => cases.push({ line: j, name: itemName(info(lines[j]).body), block: findBlock(lines, j) }));
    }
  });
  return { pages, features, widgets, cases };
}

// 投递时可选的位置：kind 是 page / widget / feature / case
function positions(md) {
  const lines = split(md);
  const s = structure(md);
  const zh = docLang(md) === 'zh';
  const names = zh ? { page: '界面', widget: '东西', feature: '功能', case: '情况' } : { page: 'Screen', widget: 'Thing', feature: 'Feature', case: 'Case' };
  const out = [];
  s.pages.forEach((p) => out.push({ kind: 'page', label: names.page + ' ' + (p.no + ' ' + p.name).trim() }));
  s.widgets.forEach((w) => out.push({ kind: 'widget', label: names.widget + ' ' + blockName(lines, w.block) + ' › ' + w.name }));
  s.features.forEach((f) => out.push({ kind: 'feature', label: names.feature + ' ' + (f.no + ' ' + f.name).trim() }));
  s.cases.forEach((c) => out.push({ kind: 'case', label: names.case + ' ' + blockName(lines, c.block) + ' › ' + c.name }));
  return out;
}

// ---------- 进度 ----------

function progressCode(word) {
  const w = String(word || '').trim();
  if (/^(?:未做|Not started|todo)/i.test(w)) return 'todo';
  if (/^(?:进行中|In progress|doing)/i.test(w)) return 'doing';
  if (/^(?:已完成|Done)/i.test(w)) return 'done';
  return '';
}

// 每个功能：名字、做什么、进度（todo / doing / done；没写按 todo）
function progressList(md) {
  const lines = split(md);
  return structure(md).features.map((f) => {
    const end = bodyRange(lines, f.line).end;
    let what = '';
    let code = '';
    for (let j = f.line + 1; j < end; j++) {
      const t = info(lines[j]);
      if (t.kind !== 'p' && t.kind !== 'li') continue;
      const lv = splitLabel(t.body);
      if (!lv) continue;
      if (WHAT_RE.test(lv.label) && !what) what = lv.value.replace(PLACEHOLDER_RE, '').trim();
      if (PROGRESS_LABEL_RE.test(lv.label)) code = progressCode(lv.value);
    }
    return { line: f.line, no: f.no, name: f.name, what, status: code || 'todo' };
  });
}

function setProgress(md, featureLine, code) {
  const lines = split(md);
  const lang = docLang(md);
  const w = WORDS[lang];
  const end = bodyRange(lines, featureLine).end;
  const text = w.progress.label + (lang === 'zh' ? '：' : ': ') + w.progress[code];
  for (let j = featureLine + 1; j < end; j++) {
    const t = info(lines[j]);
    if (t.kind !== 'p' && t.kind !== 'li') continue;
    const lv = splitLabel(t.body);
    if (lv && PROGRESS_LABEL_RE.test(lv.label)) {
      lines[j] = text;
      return join(lines);
    }
  }
  let at = end;
  while (at > featureLine + 1 && info(lines[at - 1]).kind === 'blank') at--;
  lines.splice(at, 0, text);
  return join(lines);
}

function nextProgress(code) {
  return code === 'todo' ? 'doing' : code === 'doing' ? 'done' : 'todo';
}

// ---------- 新增块 ----------

function nextNumber(md, section) {
  let max = 0;
  split(md).forEach((l) => {
    const t = info(l);
    if (t.kind !== 'h' || t.level !== 3) return;
    const m = /^(\d+)\.(\d+)\b/.exec(t.body);
    if (m && m[1] === String(section)) max = Math.max(max, Number(m[2]));
  });
  return max + 1;
}

// kind：page 或 feature。出错时返回 code：empty / duplicate
function checkName(md, kind, name, exceptLine) {
  const v = String(name || '').trim();
  if (!v) return { ok: false, code: 'empty', kind };
  const s = structure(md);
  const list = kind === 'page' ? s.pages : s.features;
  if (list.some((x) => x.name === v && x.line !== exceptLine)) return { ok: false, code: 'duplicate', kind };
  return { ok: true, name: v };
}

function endOfSection(lines, sec) {
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && new RegExp('^' + sec + '\\b').test(t.body)) return rangeEnd(lines, i);
  }
  return -1;
}

function dropInstructions(lines, to) {
  return lines.filter((l, i) => !(i < to && INSTRUCTION_LINE_RE.test(l.trim())));
}

// 新增页面或功能：返回新块的标题行位置
function addBlock(md, kind, name) {
  const chk = checkName(md, kind, name);
  if (!chk.ok) return chk;
  const sec = kind === 'page' ? SEC.pages : SEC.features;
  let lines = split(md);
  const end0 = endOfSection(lines, sec);
  if (end0 < 0) return { ok: false, code: 'nosection', kind };
  lines = dropInstructions(lines, end0);
  const at = endOfSection(lines, sec);
  const w = WORDS[docLang(md)];
  const no = sec + '.' + nextNumber(md, sec);
  const body = kind === 'page' ? w.page.fields.slice() : w.feature.fields.concat([w.feature.progressLabel + w.progress.todo]);
  const add = ['', '### ' + no + ' ' + chk.name, ''].concat(body);
  return { ok: true, md: join(lines.slice(0, at).concat(add, lines.slice(at))), line: at + 1 };
}

function renameBlock(md, line, name) {
  const lines = split(md);
  const t = info(lines[line]);
  if (t.kind !== 'h') return { ok: false, code: 'noblock' };
  const kind = sectionNo(lines, line) === SEC.pages ? 'page' : 'feature';
  const chk = checkName(md, kind, name, line);
  if (!chk.ok) return chk;
  const nn = numberedName(t.body);
  lines[line] = '### ' + (nn.no ? nn.no + ' ' : '') + chk.name;
  return { ok: true, md: join(lines) };
}

// 用法一行一条，加在第 2 部分末尾
function addFlowLine(md) {
  let lines = split(md);
  const end0 = endOfSection(lines, SEC.flows);
  if (end0 < 0) return { ok: false, code: 'nosection' };
  lines = dropInstructions(lines, end0);
  const at = endOfSection(lines, SEC.flows);
  const add = [WORDS[docLang(md)].newFlow];
  if (at > 0 && info(lines[at - 1]).kind !== 'blank') add.unshift('');
  return { ok: true, md: join(lines.slice(0, at).concat(add, lines.slice(at))), line: at + add.length - 1 };
}

// ---------- 新建、导出 ----------

// template 是 plan.md 的内容；语言按模板自己的语言
function blankPlan(template, name, date) {
  const lang = docLang(template);
  const lines = split(template);
  const out = [];
  let skip = false;
  lines.forEach((l) => {
    if (skip) return;
    const t = info(l);
    if (t.kind === 'hr') { skip = true; return; }
    if (t.kind === 'h' && t.level === 2 && /^(?:最初的描述|Original description)/.test(t.body)) { skip = true; return; }
    if (t.kind === 'p' && INSTRUCTION_LINE_RE.test(t.body)) return;
    if (t.kind === 'li' && /^〈/.test(t.body)) return;
    out.push(l);
  });
  const w = WORDS[lang];
  const sep = lang === 'zh' ? '：' : ': ';
  let md = join(out);
  md = md.replace(/^#\s+.*$/m, '# ' + w.title + sep + (name || (lang === 'zh' ? '〈项目名〉' : '〈Project name〉')));
  md = md.replace(/^(状态|Status)[：:].*$/m, w.status + sep + w.states.draft + '　　' + w.updated + sep + (date || today()));
  return md.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';
}

// 导出：没填的字段写成「待补：缺……」，不静默留空
function normalizeForExport(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const lang = docLang(md);
  const w = WORDS[lang];
  const sep = lang === 'zh' ? '：' : ': ';
  return join(lines.map((l, i) => {
    if (i >= end || !isEmptyField(lines, i)) return l;
    const lv = splitLabel(info(l).body);
    const base = l.replace(/\s+$/, '');
    return base + (lang === 'en' && /:$/.test(base) ? ' ' : '') + w.tbd + sep + w.missing + lv.label;
  }));
}

// ---------- 给 AI 的话 ----------

function buildAiPrompt(md, schema, note, lang) {
  const L = lang === 'en' ? 'en' : 'zh';
  const body = String(md || '').trim();
  const hasContent = body && split(body).some((l) => info(l).kind === 'p' && !INSTRUCTION_LINE_RE.test(l.trim()) && !/^(?:状态|Status)[：:]/.test(l));
  const template = String(((schema && schema[L]) || {}).planTemplate || '').trim();
  const rules = L === 'zh' ? [
    '请把下面的内容整理成「计划书」，按给定格式输出一份完整的 Markdown。',
    '',
    '要求：',
    '1. 只用我说过的内容。我没说的，在它所在的位置写「待补：缺什么」，不要另开一栏。',
    '2. 一次给出完整草稿，不分批。',
    '3. 用法、界面上的东西、怎么才算做好，都是一行写完：一步 → 一步。',
    '4. 我不懂代码，计划书里只写我想要的结果，不写实现方式。',
    '5. 先做什么、怎么实现由你来定，另外写成做法给我确认，不放进计划书。',
    '6. 回复末尾列出缺口：编号、位置、缺什么、建议、一个具体的默认值。建议只写在回复里，我确认后才写进计划书。',
    '7. 我最初说的话原样放在文末「最初的描述」。',
    '',
    '格式：',
  ] : [
    'Turn the content below into a plan, as one complete Markdown document in the given format.',
    '',
    'Rules:',
    '1. Use only what I have said. Where I have not said it, write "TBD: what is missing" in place; do not add a separate list.',
    '2. Give the full draft in one go, not in parts.',
    '3. Ways of using it, things on a screen and "done when" are each written on one line: step → step.',
    '4. I do not know code. The plan says only the result I want, not how to build it.',
    '5. What to build first and how to build it are yours to decide; write that up separately for me to confirm, not inside the plan.',
    '6. End the reply with a list of gaps: number, place, what is missing, a suggestion, one concrete default. Suggestions stay in the reply and go into the plan only after I confirm.',
    '7. Put my first words, unchanged, at the end under "Original description".',
    '',
    'Format:',
  ];
  return rules.concat([
    '',
    '```markdown',
    template,
    '```',
    '',
    hasContent ? (L === 'zh' ? '当前计划书：' : 'Current plan:') : (L === 'zh' ? '我的想法：' : 'My idea:'),
    '',
    hasContent ? body : String(note || (L === 'zh' ? '（在这里写下想法）' : '(write your idea here)')).trim(),
    '',
    hasContent && note ? (L === 'zh' ? '补充说明：\n\n' : 'Extra notes:\n\n') + String(note).trim() + '\n' : '',
  ]).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- 反馈 ----------

// 把选取的元素、截图、页面报错和一句话合成一段能直接贴给 AI 的话
// d: { text, page, view, element, styles, errors, shot }  shot 是附图的说明（文件名或「已复制」）
function buildFeedback(d, lang) {
  const L = lang === 'en' ? 'en' : 'zh';
  const zh = L === 'zh';
  const out = [];
  if (d.page || d.view) out.push((zh ? '页面：' : 'Page: ') + [d.page, d.view].filter(Boolean).join('  '));
  if (d.element) out.push((zh ? '我指的东西：' : 'The thing I mean: ') + d.element);
  if (d.styles) out.push((zh ? '它现在的样式：' : 'Its styles now: ') + d.styles);
  if (d.shot) out.push((zh ? '截图：' : 'Screenshot: ') + d.shot);
  out.push('', String(d.text || '').trim() || (zh ? '（在这里写想怎么改）' : '(write what to change here)'));
  if (d.errors && d.errors.length) {
    out.push('', zh ? '页面最近的报错：' : 'Recent errors on the page:');
    d.errors.forEach((e) => out.push('- ' + e));
  }
  return out.join('\n') + '\n';
}

module.exports = {
  SEC, WORDS,
  split, join, info, splitLabel, today, timeStamp, docLang,
  rangeEnd, bodyRange, bodyText, setBody, deleteSubtree, sectionNo, headings,
  pendingList, countPending, getStatus, statusLabel, setStatus, markPassed,
  titleName, setTitle, structure, positions, nextNumber, checkName,
  progressList, setProgress, nextProgress,
  addBlock, renameBlock, addFlowLine, blankPlan, normalizeForExport,
  buildAiPrompt, buildFeedback,
};

return module.exports; })();
// 界面文字的英文词条：键是界面里写的中文原文，{名字} 是会被替换的部分。
const EN_DICT = {
  '新项目': 'New project',
  'prompt 计划书助手': 'Prompt plan helper',
  '界面': 'screen',
  '功能': 'feature',
  '界面名称': 'Screen name',
  '功能名称': 'Feature name',
  '{what}名称不能为空。': 'The {what} name cannot be empty.',
  '已有同名{what}，请换一个名称。': 'There is already a {what} with this name. Please use another name.',
  '没有找到可以添加的位置。': 'There is nowhere to add it.',
  '浏览器存储已满，最近的修改没有保存。可以先导出。': 'Browser storage is full and the latest changes were not saved. Export first.',
  '已删除项目「{name}」。': 'Deleted project "{name}".',
  '撤销': 'Undo',
  '没有打开文件夹：{why}': 'The folder was not opened: {why}',
  '授权没有记住，下次打开需要重新选择文件夹。': 'The permission was not remembered; choose the folder again next time.',
  '授权没有完成：{why}': 'Permission was not granted: {why}',
  '已断开文件夹。': 'Folder disconnected.',
  '保存到文件夹失败：{why}': 'Could not save to the folder: {why}',
  '读取文件夹失败：{why}': 'Could not read the folder: {why}',
  '文件夹里还没有计划书。': 'There is no plan in the folder yet.',
  '已是最新。': 'Already up to date.',
  '已读入文件夹里的计划书。': 'Loaded the plan from the folder.',
  '文件夹里的计划书不一样': 'The plan in the folder is different',
  '页面里和文件夹里的计划书都有改动，选择保留哪一份。另一份可以在撤销里找回。': 'Both the page and the folder have changes. Choose which one to keep; the other can be recovered with Undo.',
  '先不处理': 'Decide later',
  '用页面里的': 'Keep the page',
  '用文件夹里的': 'Keep the folder',
  '选择文件夹': 'Choose a folder',
  '点击修改': 'Click to edit',
  '点这里填写。': 'Click here to write.',
  '内容': 'Content',
  '添加': 'Add',
  '取消': 'Cancel',
  '名称': 'Name',
  '项目情况': 'Project status',
  '已完成 {done} / {total}，进行中 {doing}': '{done} of {total} done, {doing} in progress',
  '点击切换进度': 'Click to change progress',
  '点击改名': 'Click to rename',
  '未命名项目': 'Untitled project',
  '展开或收起': 'Expand or collapse',
  '删除': 'Delete',
  '已删除。': 'Deleted.',
  '还没有内容可以导出。': 'There is nothing to export yet.',
  '已导出：{name}': 'Exported: {name}',
  '把写好的计划书粘贴在这里，或选择文件。': 'Paste a finished plan here, or choose a file.',
  '导入内容': 'Content to import',
  '这个文件读不出来，请确认是文本文件。': 'This file cannot be read. Please check that it is a text file.',
  '导入': 'Import',
  '选择文件': 'Choose a file',
  '请先粘贴内容或选择文件。': 'Paste something or choose a file first.',
  '没有认出计划书的格式，原文已放进「未识别」。': 'The plan format was not recognised; the original text was put under "Not recognised".',
  '已导入计划书。': 'Plan imported.',
  '已新建计划书。': 'New plan created.',
  '已载入示例。': 'Example loaded.',
  '想做什么，随手写就行。': 'Write what you want to make, in your own words.',
  '你的话': 'Your words',
  '给 AI 的话': 'Words for the AI',
  '复制给 AI 的话': 'Copy words for the AI',
  '发给 AI 的内容': 'Content to send to the AI',
  '关闭': 'Close',
  '复制': 'Copy',
  '还有 {n} 处待补': '{n} left to fill in',
  '没有待补': 'Nothing left to fill in',
  '还有 {n} 处待补，补完才能通过。': '{n} still to fill in. Fill them in before approving.',
  '计划书已通过，可以开始做。': 'The plan is approved. Work can start.',
  '标记为已通过': 'Mark as approved',
  '文件夹：{name}': 'Folder: {name}',
  '同步于 {time}': 'synced at {time}',
  '复制地址': 'Copy path',
  '目录': 'Contents',
  '复制全文': 'Copy everything',
  '计划书全文': 'Full plan',
  '复制后发给 AI。': 'Copy it and send it to the AI.',
  '导出': 'Export',
  '看示例': 'See an example',
  '新建空白计划书': 'New blank plan',
  '没有可撤销的修改。': 'There is nothing to undo.',
  '重做': 'Redo',
  '没有可重做的修改。': 'There is nothing to redo.',
  '文件夹功能需要电脑上的 Chrome 或 Edge': 'Folders need Chrome or Edge on a computer',
  '连接文件夹': 'Connect a folder',
  '重新授权文件夹': 'Allow the folder again',
  '换一个文件夹': 'Use another folder',
  '刷新': 'Refresh',
  '断开文件夹': 'Disconnect the folder',
  '删除项目': 'Delete project',
  '更多': 'More',
  '还没有计划书。新建一份，看一份示例，或导入写好的计划书。': 'There is no plan yet. Start a new one, see an example, or import a finished plan.',
  '已保存。': 'Saved.',
  '已保存在浏览器里。': 'Saved in the browser.',
  '正在读取最近的文件夹': 'Reading recent folders',
  '正在用': 'In use',
  '已完成 {done} / {total}，待补 {n} 处': '{done} of {total} done, {n} left to fill in',
  '还没有计划书': 'No plan yet',
  '当前': 'Current',
  '打开计划书': 'Open plan',
  '正在用 Claude 的文件夹': 'Folders Claude is working in',
  '最近用过的文件夹': 'Recent folders',
  '连接过的文件夹': 'Connected folders',
  '还没有找到文件夹。点下面的按钮选择一个。': 'No folders found yet. Use the button below to choose one.',
  '选择别的文件夹': 'Choose another folder',
  '读取文件夹列表失败：{why}': 'Could not read the folder list: {why}',
  '已复制。': 'Copied.',
  '浏览器不允许自动复制，已选中全文，请按 Ctrl+C 复制。': 'The browser does not allow automatic copying. The text is selected; press Ctrl+C.',
  '全文': 'Full text',
  '改哪里': 'What to change',
  '截图在剪贴板里，请另外粘贴': 'The screenshot is on the clipboard; paste it separately',
  '这个页面没有截下来。': 'This page could not be captured.',
  '这个页面没有截下来：{why}': 'This page could not be captured: {why}',
  '截图已复制。': 'Screenshot copied.',
  '已下载：{name}': 'Downloaded: {name}',
  '选取元素': 'Pick an element',
  '截图': 'Screenshot',
  '清除': 'Clear',
  '想怎么改，随手写。': 'Write what to change, in your own words.',
  '想怎么改': 'What to change',
  '复制文字': 'Copy text',
  '复制截图': 'Copy screenshot',
  '加用法': 'Add a way of using it',
  '加界面': 'Add a screen',
  '加功能': 'Add a feature',
};

'use strict';
// 界面基础件：元素创建、语言、浏览器存储、文件夹读写、下载和复制。

const NS = 'shupian:' + (location.protocol === 'file:' ? location.pathname : location.origin);

function add(el, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach((x) => add(el, x)); return; }
  el.append(c.nodeType ? c : document.createTextNode(String(c)));
}

function h(tag, props) {
  const el = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((k) => {
      const v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'disabled' || k === 'placeholder' || k === 'rows') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
  }
  for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
  return el;
}

function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  del(key) {
    try { localStorage.removeItem(key); } catch (e) { /* 存储不可用时没有可删的内容 */ }
  },
};

// ---------- 语言 ----------
// 界面文字直接写中文原文，t() 按当前语言换成英文词条；没有词条就原样显示。

let LANG = (function () {
  const saved = LS.get('shupian:lang', '');
  if (saved === 'zh' || saved === 'en') return saved;
  return /^zh/i.test(navigator.language || '') ? 'zh' : 'en';
})();

function t(zh, params) {
  let s = LANG === 'en' && EN_DICT[zh] !== undefined ? EN_DICT[zh] : zh;
  if (params) Object.keys(params).forEach((k) => { s = s.split('{' + k + '}').join(String(params[k])); });
  return s;
}

function setLang(l) {
  LANG = l === 'en' ? 'en' : 'zh';
  LS.set('shupian:lang', LANG);
}

// ---------- IndexedDB：文件夹授权句柄和图片 ----------

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('indexedDB unavailable')); return; }
    const r = indexedDB.open('shupian', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('kv'); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function kv(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', mode);
    const req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}
const kvGet = (k) => kv('readonly', (s) => s.get(k));
const kvSet = (k, v) => kv('readwrite', (s) => s.put(v, k));
const kvDel = (k) => kv('readwrite', (s) => s.delete(k));

// ---------- 本机服务（桌面快捷方式打开时） ----------
// 有服务时文件夹由服务读写，不需要浏览器的文件夹授权；页面带着启动时给的口令。

const SERVER = (function () {
  if (location.protocol !== 'http:' || location.hostname !== '127.0.0.1') return null;
  let k = new URLSearchParams(location.search).get('k') || '';
  try {
    if (k) sessionStorage.setItem('shupian:k', k);
    else k = sessionStorage.getItem('shupian:k') || '';
  } catch (e) { /* 没有会话存储时口令只在本次地址里 */ }
  return k ? { token: k } : null;
})();

const Api = {
  async call(method, path, body, raw) {
    const headers = { 'x-shupian-token': SERVER.token };
    let payload = body;
    if (body !== undefined && !(body instanceof Blob) && typeof body !== 'string') {
      headers['content-type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const r = await fetch(path, { method, headers, body: payload });
    if (!r.ok) throw new Error(path + ' ' + r.status);
    return raw ? r : r.json();
  },
};

// ---------- 文件夹 ----------
// handle 要么是浏览器授权的目录句柄，要么是 { server: true, root, name }

const Folder = {
  supported() {
    return !!SERVER || typeof window.showDirectoryPicker === 'function';
  },
  async pick() {
    if (SERVER) {
      const r = await Api.call('POST', '/api/pick', {});
      if (!r.path) { const e = new Error('cancel'); e.name = 'AbortError'; throw e; }
      return { server: true, root: r.path, name: r.name };
    }
    return window.showDirectoryPicker({ mode: 'readwrite' });
  },
  async permission(handle, ask) {
    if (handle.server) return true;
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if (!ask) return false;
    return (await handle.requestPermission(opts)) === 'granted';
  },
  async dir(handle, sub, create) {
    let d = handle;
    for (const part of sub || []) d = await d.getDirectoryHandle(part, { create: !!create });
    return d;
  },
  async read(handle, sub, name) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      const r = await Api.call('GET', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p));
      return r.exists ? r.text : null;
    }
    try {
      const d = await Folder.dir(handle, sub, false);
      const f = await (await d.getFileHandle(name)).getFile();
      return await f.text();
    } catch (e) {
      if (e && e.name === 'NotFoundError') return null;
      throw e;
    }
  },
  async write(handle, sub, name, data) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      await Api.call('PUT', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p), data);
      return;
    }
    const d = await Folder.dir(handle, sub, true);
    const fh = await d.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  },
};

// ---------- 下载和复制 ----------

// 所有下载走这里：文件名带保存时的日期时间，同一秒内再存加序号。
const nameCount = {};
function uniqueFileName(base, ext) {
  const stamp = Core.timeStamp();
  const key = base + '|' + stamp + '|' + ext;
  nameCount[key] = (nameCount[key] || 0) + 1;
  return base + '-' + stamp + (nameCount[key] > 1 ? '-' + nameCount[key] : '') + '.' + ext;
}

function saveAs(name, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

function download(content, base, ext, type) {
  return saveAs(uniqueFileName(base, ext), content, type);
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

// 复制：先用剪贴板接口，不行再用选中复制；都不行返回 false，由调用方提示手动复制。
function copyText(text, fallbackEl) {
  const legacy = () => {
    try {
      const ta = fallbackEl || h('textarea', { value: text, style: 'position:fixed;left:0;top:0;opacity:0' });
      if (!fallbackEl) document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      if (!fallbackEl) ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacy());
  }
  return Promise.resolve(legacy());
}

// 剪贴板只收 PNG：把任何图片转成 PNG
function toPng(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

async function copyImage(blob) {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    const png = await toPng(blob);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    return true;
  } catch (e) {
    return false;
  }
}

function errText(e) {
  return e && e.message ? e.message : String(e);
}

'use strict';
// 浮层：下拉菜单、弹窗、轻提示。每个应用外壳各建一份。

function createKit(appEl) {
  let popEl = null;
  let popAnchor = null;
  const modals = [];
  let toastEl = null;
  let toastTimer = 0;

  function closePop() {
    if (popEl) { popEl.remove(); popEl = null; popAnchor = null; }
  }

  function openPop(anchor, build) {
    if (popEl && popAnchor === anchor) { closePop(); return; }
    closePop();
    popEl = h('div', { class: 'pop' });
    popAnchor = anchor;
    build(popEl, closePop);
    appEl.append(popEl);
    const r = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = popEl.offsetWidth;
    const ph = popEl.offsetHeight;
    popEl.style.left = Math.max(8, Math.min(r.right - w, vw - w - 8)) + 'px';
    let top = r.bottom + 4;
    if (top + ph > vh - 8) top = Math.max(8, r.top - ph - 4);
    popEl.style.top = top + 'px';
  }

  function popItem(label, run, ex) {
    return h('button', { type: 'button', class: ex && ex.on ? 'on' : '', disabled: ex && ex.disabled, onclick() { closePop(); run(); } }, label);
  }

  function openModal(o) {
    closePop();
    const mask = h('div', { class: 'mask' });
    const m = { el: mask };
    const close = () => {
      const i = modals.indexOf(m);
      if (i >= 0) modals.splice(i, 1);
      mask.remove();
      if (o.onClose) o.onClose();
    };
    m.close = close;
    const box = h('div', { class: 'modal', role: 'dialog' },
      h('div', { class: 'modal-head' }, h('h2', { text: o.title }), h('button', { type: 'button', class: 'x', title: t('关闭'), onclick: close }, '✕')),
      h('div', { class: 'modal-body' }, o.body),
      o.foot ? h('div', { class: 'modal-foot' }, o.foot(close)) : null);
    mask.addEventListener('pointerdown', (e) => { m.down = e.target === mask; });
    mask.addEventListener('click', (e) => { if (e.target === mask && m.down) close(); });
    mask.append(box);
    appEl.append(mask);
    modals.push(m);
    return m;
  }

  function toast(msg, action) {
    if (toastEl) { toastEl.remove(); clearTimeout(toastTimer); }
    const el = h('div', { class: 'toast', role: 'status' }, h('span', { text: msg }));
    toastEl = el;
    const dismiss = () => { if (toastEl === el) { el.remove(); toastEl = null; clearTimeout(toastTimer); } };
    if (action) el.append(h('button', { type: 'button', class: 'btn sm', onclick(e) { e.stopPropagation(); dismiss(); action.run(); } }, action.label));
    el.addEventListener('click', dismiss);
    appEl.append(el);
    toastTimer = setTimeout(dismiss, action ? 9000 : 5000);
  }

  // Esc：先关弹窗，再关下拉；返回 true 表示已处理
  function escape() {
    if (modals.length) { modals[modals.length - 1].close(); return true; }
    if (popEl) { closePop(); return true; }
    return false;
  }

  document.addEventListener('pointerdown', (e) => {
    if (!popEl) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(popEl) >= 0 || (popAnchor && path.indexOf(popAnchor) >= 0)) return;
    closePop();
  }, true);

  return { closePop, openPop, popItem, openModal, toast, escape };
}

function autoGrow(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 2 + 'px';
}

function growAll(el) {
  Array.prototype.forEach.call(el.querySelectorAll('textarea.in'), autoGrow);
}

function copyThen(kit, text, ta) {
  copyText(text, ta).then((ok) => {
    if (ok) kit.toast(t('已复制。'));
    else {
      if (ta) ta.select();
      kit.toast(t('浏览器不允许自动复制，已选中全文，请按 Ctrl+C 复制。'));
    }
  });
}

// 弹出一个带全文的文本框，配复制按钮
function showText(kit, title, text, hint) {
  const ta = h('textarea', { class: 'in big', readonly: true, value: text, 'aria-label': t('全文') });
  kit.openModal({
    title,
    body: h('div', null, hint ? h('p', { class: 'hint', text: hint }) : null, ta),
    foot: (close) => [
      h('button', { type: 'button', class: 'btn', onclick: close }, t('关闭')),
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, text, ta); } }, t('复制')),
    ],
  });
  setTimeout(() => { autoGrow(ta); ta.select(); }, 0);
}

'use strict';
// 悬浮窗用的页面工具：伪截图、选取元素、页面报错记录。只在叠在别的页面上时使用。

const pageErrors = [];
let errorHookOn = false;

function clock() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return p(t.getHours()) + ':' + p(t.getMinutes()) + ':' + p(t.getSeconds());
}

function pushError(text) {
  pageErrors.push(clock() + ' ' + String(text).replace(/\s+/g, ' ').slice(0, 300));
  if (pageErrors.length > 5) pageErrors.shift();
}

function installErrorHook() {
  if (errorHookOn) return;
  errorHookOn = true;
  window.addEventListener('error', (e) => {
    pushError((e.message || '脚本错误') + (e.filename ? ' (' + e.filename.split('/').pop() + ':' + e.lineno + ')' : ''));
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    pushError('未处理的 Promise 错误：' + (r && r.message ? r.message : r));
  });
  const orig = console.error;
  console.error = function () {
    try { pushError(Array.prototype.map.call(arguments, (a) => (a && a.message) || String(a)).join(' ')); } catch (e) { /* 记录失败不影响页面自己的输出 */ }
    return orig.apply(console, arguments);
  };
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function withTimeout(p, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

// 伪截图：把当前可见区域的结构和样式画成一张图，不需要任何授权。
// 跨域样式、字体和图片取不到，对应部分显示为空白。
async function domShot() {
  const w = window.innerWidth;
  const hh = window.innerHeight;
  const body = document.body.cloneNode(true);
  const srcCanvas = document.body.querySelectorAll('canvas');
  const dstCanvas = body.querySelectorAll('canvas');
  Array.prototype.forEach.call(srcCanvas, (c, i) => {
    try {
      const im = document.createElement('img');
      im.src = c.toDataURL();
      const cs = getComputedStyle(c);
      im.setAttribute('style', 'width:' + cs.width + ';height:' + cs.height + ';display:' + cs.display);
      dstCanvas[i].parentNode.replaceChild(im, dstCanvas[i]);
    } catch (e) { /* 跨域画布取不到像素 */ }
  });
  const srcFields = document.body.querySelectorAll('input,textarea,select');
  const dstFields = body.querySelectorAll('input,textarea,select');
  Array.prototype.forEach.call(srcFields, (f, i) => {
    const d = dstFields[i];
    if (!d) return;
    if (f.tagName === 'TEXTAREA') d.textContent = f.value;
    else if (f.tagName === 'SELECT') Array.prototype.forEach.call(d.options, (o, k) => { if (k === f.selectedIndex) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
    else if (f.type === 'checkbox' || f.type === 'radio') { if (f.checked) d.setAttribute('checked', ''); else d.removeAttribute('checked'); }
    else d.setAttribute('value', f.value);
  });
  const imgs = Array.prototype.slice.call(body.querySelectorAll('img')).slice(0, 30);
  await Promise.all(imgs.map(async (im) => {
    try {
      const url = new URL(im.getAttribute('src') || '', location.href);
      if (url.protocol === 'data:' || url.origin !== location.origin) return;
      const r = await withTimeout(fetch(url.href), 3000);
      im.setAttribute('src', await blobToDataUrl(await r.blob()));
      im.removeAttribute('srcset');
    } catch (e) { /* 取不到的图保持原样，显示为空白 */ }
  }));
  Array.prototype.forEach.call(body.querySelectorAll('[data-shupian],script,noscript,iframe,video,audio,object,embed'), (n) => n.remove());
  let css = '';
  Array.prototype.forEach.call(document.styleSheets, (sheet) => {
    try { Array.prototype.forEach.call(sheet.cssRules, (r) => { css += r.cssText + '\n'; }); } catch (e) { /* 跨域样式表读不了 */ }
  });
  const bcs = getComputedStyle(document.body);
  const hcs = getComputedStyle(document.documentElement);
  const clear0 = 'rgba(0, 0, 0, 0)';
  const bg = bcs.backgroundColor !== clear0 ? bcs.backgroundColor : hcs.backgroundColor !== clear0 ? hcs.backgroundColor : '#ffffff';
  const xhtml = new XMLSerializer().serializeToString(body);
  const esc = css.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + hh + '"><foreignObject x="0" y="0" width="' + w + '" height="' + hh + '">'
    + '<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:' + w + 'px;height:' + hh + 'px;overflow:hidden;background:' + bg + '">'
    + '<style>' + esc + '</style>'
    + '<div style="position:absolute;left:' + -window.scrollX + 'px;top:' + -window.scrollY + 'px;width:' + document.documentElement.scrollWidth + 'px">' + xhtml + '</div>'
    + '</div></foreignObject></svg>';
  const img = new Image();
  await withTimeout(new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('render'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }), 8000);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = hh;
  canvas.getContext('2d').drawImage(img, 0, 0, w, hh);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: '伪截图' };
}

// 扩展里有浏览器自己的截图能力时优先用它
function realShot() {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) { resolve(null); return; }
    try {
      chrome.runtime.sendMessage({ shupian: 'capture' }, (res) => {
        if (chrome.runtime.lastError || !res || !res.dataUrl) { resolve(null); return; }
        fetch(res.dataUrl).then((r) => r.blob()).then((blob) => resolve({ blob, kind: '截图' }), () => resolve(null));
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function elementPath(el) {
  const parts = [];
  let n = el;
  while (n && n.nodeType === 1 && n !== document.body && n !== document.documentElement && parts.length < 4) {
    let s = n.tagName.toLowerCase();
    if (n.id) { parts.unshift(s + '#' + n.id); break; }
    const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    parts.unshift(s);
    n = n.parentElement;
  }
  return parts.join(' > ');
}

function elementInfo(el) {
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const props = ['font-size', 'font-weight', 'color', 'background-color', 'padding', 'margin', 'border-radius', 'display'];
  const styles = props.map((p) => p + ' ' + cs.getPropertyValue(p)).concat(['width ' + Math.round(r.width) + 'px', 'height ' + Math.round(r.height) + 'px']).join('；');
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  return {
    path: elementPath(el) + (text ? '（文字「' + text + '」）' : ''),
    styles,
  };
}

// 点选页面上的一个元素：移动高亮，点一下确认，Esc 取消
function pickElement(shadowRoot) {
  return new Promise((resolve) => {
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #e5322d;background:rgba(229,50,45,0.12);display:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;max-width:calc(100vw - 16px);overflow-wrap:anywhere');
    tip.textContent = '点一下选取元素，Esc 取消。';
    shadowRoot.append(box, tip);
    let cur = null;
    const done = (v) => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key, true);
      box.remove();
      tip.remove();
      resolve(v);
    };
    const move = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el === document.documentElement || el === document.body) { box.style.display = 'none'; cur = null; return; }
      cur = el;
      const r = el.getBoundingClientRect();
      box.style.display = 'block';
      box.style.left = r.left + 'px';
      box.style.top = r.top + 'px';
      box.style.width = r.width + 'px';
      box.style.height = r.height + 'px';
      tip.textContent = elementPath(el);
    };
    const click = (e) => {
      e.preventDefault();
      e.stopPropagation();
      done(cur ? elementInfo(cur) : null);
    };
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('mousemove', move, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key, true);
  });
}

'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = ['plan.md', '计划书.md'];
const ADD_LABEL = { 2: '加用法', 3: '加界面', 4: '加功能' };

function docLangOf(md) {
  return md && md.trim() ? Core.docLang(md) : LANG;
}

function sectionHint(md, sec) {
  const rows = ((SCHEMA[docLangOf(md)] || SCHEMA.zh).fields || {})[sec] || [];
  return rows.map((r) => r.name + '：' + r.purpose + (r.how ? '（' + (docLangOf(md) === 'zh' ? '例：' : 'e.g. ') + r.how + '）' : '')).join('\n');
}

function newId() {
  return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
}

function nameError(code, kind) {
  const what = kind === 'page' ? t('界面') : t('功能');
  if (code === 'empty') return t('{what}名称不能为空。', { what });
  if (code === 'duplicate') return t('已有同名{what}，请换一个名称。', { what });
  return t('没有找到可以添加的位置。');
}

function createApp(opts) {
  const root = opts.root;
  const index = LS.get(NS + ':index', null) || { current: '', list: [] };
  const S = {
    md: '',
    past: [],
    future: [],
    collapsed: {},
    project: null,
    folder: { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', hold: false, file: PLAN_NAMES[0] },
    lastSync: '',
  };
  let typingKey = '';
  let typingAt = 0;
  let folderTimer = 0;
  let pendIndex = -1;

  const app = h('div', { class: 'app' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'body' });
  app.append(head, body);
  const kit = createKit(app);
  const toast = kit.toast;

  // ---------- 项目与保存 ----------

  const projectKey = (id) => NS + ':p:' + id;

  function freshFolder() {
    return { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', hold: false, file: PLAN_NAMES[0] };
  }

  function loadProject(id) {
    const rec = LS.get(projectKey(id), null) || {};
    S.md = rec.md || '';
    S.past = [];
    S.future = [];
    S.folder = freshFolder();
  }

  function saveIndex() {
    LS.set(NS + ':index', index);
  }

  function persist() {
    if (!LS.set(projectKey(S.project.id), { md: S.md, updated: Date.now() })) toast(t('浏览器存储已满，最近的修改没有保存。可以先导出。'));
    const nm = Core.titleName(S.md);
    if (nm && S.project.name !== nm) {
      S.project.name = nm;
      saveIndex();
    }
  }

  function startProject() {
    if (!index.list.length) {
      const id = newId();
      index.list.push({ id, name: opts.defaultName || t('新项目') });
      index.current = id;
      saveIndex();
    }
    let cur = index.list.filter((p) => p.id === index.current)[0];
    if (!cur) { cur = index.list[0]; index.current = cur.id; saveIndex(); }
    S.project = cur;
    loadProject(cur.id);
    folderInit();
  }

  function useProject(p) {
    S.project = p;
    index.current = p.id;
    saveIndex();
    loadProject(p.id);
    folderInit();
    renderAll();
  }

  function switchProject(id) {
    persist();
    const p = index.list.filter((x) => x.id === id)[0];
    if (p) useProject(p);
  }

  function createProject(extra) {
    persist();
    const p = Object.assign({ id: newId(), name: t('新项目') }, extra || {});
    index.list.push(p);
    useProject(p);
  }

  function deleteProject(id) {
    const p = index.list.filter((x) => x.id === id)[0];
    if (!p) return;
    const rec = LS.get(projectKey(id), null);
    const pos = index.list.indexOf(p);
    index.list.splice(pos, 1);
    LS.del(projectKey(id));
    if (!index.list.length) index.list.push({ id: newId(), name: t('新项目') });
    if (index.current === id) useProject(index.list[0]);
    else { saveIndex(); renderAll(); }
    toast(t('已删除项目「{name}」。', { name: p.name }), {
      label: t('撤销'),
      run() {
        index.list.splice(Math.min(pos, index.list.length), 0, p);
        if (rec) LS.set(projectKey(id), rec);
        saveIndex();
        useProject(p);
      },
    });
  }

  // ---------- 修改记录与撤销 ----------

  function autoStatus(md) {
    const st = Core.getStatus(md);
    return st === 'approved' || st === 'draft' ? Core.setStatus(md, 'doing') : md;
  }

  function changed() {
    persist();
    clearTimeout(folderTimer);
    if (S.folder.state === 'ready') folderTimer = setTimeout(folderPush, 600);
  }

  function commit(md, raw) {
    const next = raw ? md : autoStatus(md);
    if (next === S.md) return;
    S.past.push(S.md);
    if (S.past.length > 100) S.past.shift();
    S.future = [];
    S.md = next;
    typingKey = '';
    changed();
  }

  function typing(md, key) {
    const next = autoStatus(md);
    const now = Date.now();
    if (typingKey !== key || now - typingAt > 1500) {
      S.past.push(S.md);
      if (S.past.length > 100) S.past.shift();
      S.future = [];
    }
    typingKey = key;
    typingAt = now;
    S.md = next;
    changed();
    renderStatus();
  }

  function undo() {
    if (!S.past.length) return false;
    S.future.push(S.md);
    S.md = S.past.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  function redo() {
    if (!S.future.length) return false;
    S.past.push(S.md);
    S.md = S.future.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  // ---------- 文件夹 ----------

  async function findPlan(handle) {
    for (const name of PLAN_NAMES) {
      const text = await Folder.read(handle, [], name);
      if (text != null) return { name, text };
    }
    return { name: PLAN_NAMES[0], text: null };
  }

  async function folderInit() {
    if (!Folder.supported()) return;
    const pid = S.project.id;
    try {
      let handle = null;
      if (S.project.path && SERVER) handle = { server: true, root: S.project.path, name: S.project.name };
      else if (!SERVER) handle = await kvGet('handle:' + NS + ':' + pid);
      if (!handle || S.project.id !== pid) return;
      S.folder.handle = handle;
      S.folder.name = handle.name || S.project.name;
      S.folder.path = handle.server ? handle.root : '';
      const ok = await Folder.permission(handle, false);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(false, false);
    } catch (e) {
      S.folder.state = Folder.supported() ? 'none' : 'off';
    }
  }

  async function connectHandle(handle) {
    S.folder.handle = handle;
    S.folder.name = handle.name;
    S.folder.path = handle.server ? handle.root : '';
    S.folder.state = 'ready';
    S.folder.synced = '';
    renderAll();
    await folderPull(true, false);
  }

  async function folderConnect() {
    if (SERVER) { openFolders(); return; }
    let handle;
    try {
      handle = await Folder.pick();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('授权没有记住，下次打开需要重新选择文件夹。')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    let p = index.list.filter((x) => x.path && x.path.toLowerCase() === r.path.toLowerCase())[0];
    persist();
    if (!p) {
      p = { id: newId(), name: r.summary && r.summary.title ? r.summary.title : r.name, path: r.path };
      index.list.push(p);
    }
    useProject(p);
  }

  async function folderRegrant() {
    if (!S.folder.handle) return;
    try {
      const ok = await Folder.permission(S.folder.handle, true);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(true, false);
    } catch (e) {
      toast(t('授权没有完成：{why}', { why: errText(e) }));
    }
  }

  async function folderDisconnect() {
    if (!SERVER) { try { await kvDel('handle:' + NS + ':' + S.project.id); } catch (e) { /* 句柄已不存在 */ } }
    delete S.project.path;
    saveIndex();
    S.folder = freshFolder();
    renderAll();
    toast(t('已断开文件夹。'));
  }

  async function folderPush() {
    if (S.folder.state !== 'ready' || S.folder.hold || !S.md.trim()) return;
    const text = S.md;
    try {
      await Folder.write(S.folder.handle, [], S.folder.file, text);
      S.folder.synced = text;
    } catch (e) {
      toast(t('保存到文件夹失败：{why}', { why: errText(e) }));
    }
  }

  // silent：自动检查时不弹提示；有文字框正在编辑时不替换页面
  async function folderPull(manual, silent) {
    if (S.folder.state !== 'ready' || S.folder.hold) return;
    let found;
    try {
      found = await findPlan(S.folder.handle);
    } catch (e) {
      if (!silent) toast(t('读取文件夹失败：{why}', { why: errText(e) }));
      return;
    }
    S.folder.file = found.name;
    const text = found.text;
    if (text == null) {
      if (S.md.trim()) await folderPush();
      else if (manual) toast(t('文件夹里还没有计划书。'));
      return;
    }
    if (text === S.md) {
      S.folder.synced = text;
      if (manual) toast(t('已是最新。'));
      return;
    }
    if (!S.md.trim() || S.md === S.folder.synced) {
      if (silent && body.querySelector('textarea')) return;
      S.folder.synced = text;
      commit(text, true);
      S.lastSync = clockText();
      renderAll();
      if (!silent) toast(t('已读入文件夹里的计划书。'), { label: t('撤销'), run: () => { undo(); folderPush(); } });
      return;
    }
    if (text === S.folder.synced) { await folderPush(); return; }
    if (silent && body.querySelector('textarea')) return;
    folderConflict(text);
  }

  function clockText() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
  }

  function folderConflict(fileText) {
    S.folder.hold = true;
    const release = () => { S.folder.hold = false; };
    kit.openModal({
      title: t('文件夹里的计划书不一样'),
      body: h('p', { class: 'p', text: t('页面里和文件夹里的计划书都有改动，选择保留哪一份。另一份可以在撤销里找回。') }),
      onClose: release,
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); } }, t('先不处理')),
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); folderPush(); } }, t('用页面里的')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          release(); close();
          S.folder.synced = fileText;
          commit(fileText, true);
          renderAll();
        } }, t('用文件夹里的')),
      ],
    });
  }

  // 本机服务打开时的文件夹列表：最近在用 Claude 的、连接过的、别的
  function openFolders() {
    const box = h('div', { class: 'folders' });
    folderRows(box, {
      kit,
      current: S.folder.path,
      onPick: (path) => { m.close(); connectFolderPath(path); },
      onBrowse: async () => {
        try {
          const r = await Api.call('POST', '/api/pick', {});
          if (r.path) { m.close(); connectFolderPath(r.path); }
        } catch (e) {
          toast(t('没有打开文件夹：{why}', { why: errText(e) }));
        }
      },
    });
    const m = kit.openModal({ title: t('选择文件夹'), body: box });
  }

  // ---------- 文字显示 ----------

  function headingNumbers(lines) {
    const set = {};
    lines.forEach((l) => {
      const ti = Core.info(l);
      if (ti.kind !== 'h') return;
      const m = /^(\d+(?:\.\d+)?)\b/.exec(ti.body);
      if (m) set[m[1]] = true;
    });
    return set;
  }

  function openFolds(el) {
    let p = el.parentElement;
    while (p && p !== body) {
      if (p.classList.contains('sec') && p.classList.contains('closed')) { p.classList.remove('closed'); growAll(p); }
      p = p.parentElement;
    }
  }

  function jumpTo(selector) {
    const el = body.querySelector(selector);
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'start' });
  }

  function inline(text, nums) {
    const frag = document.createDocumentFragment();
    const re = /((?:待补|TBD)[：:][^；;。\n]*|〈[^〉]*〉|\d+\.\d+)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      const tok = m[0];
      if (m.index > last) frag.append(document.createTextNode(text.slice(last, m.index)));
      const prev = m.index > 0 ? text.charAt(m.index - 1) : '';
      if (/^(?:待补|TBD)/.test(tok)) frag.append(h('span', { class: 'pend', text: tok }));
      else if (tok.charAt(0) === '〈') frag.append(h('span', { class: 'ph', text: tok }));
      else if (nums[tok] && !/[\d.]/.test(prev)) frag.append(h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + tok + '"]'); } }, tok));
      else frag.append(document.createTextNode(tok));
      last = m.index + tok.length;
    }
    if (last < text.length) frag.append(document.createTextNode(text.slice(last)));
    return frag;
  }

  function renderLines(text, nums, lang) {
    const lines = Core.split(text);
    const wrap = h('div', { class: 'lines' });
    const tbd = lang === 'zh' ? '待补：缺' : 'TBD: missing ';
    lines.forEach((l, i) => {
      const ti = Core.info(l);
      if (ti.kind === 'blank' || ti.kind === 'hr') return;
      if (ti.kind === 'li') {
        const lv = Core.splitLabel(ti.body);
        const row = h('div', { class: 'li', style: 'margin-left:' + Math.min(6, Math.floor(ti.indent / 2)) * 1.1 + 'em' }, h('span', { class: 'mk', text: ti.ordered ? ti.marker : '•' }));
        const tx = h('span', { class: 'tx' });
        if (lv) tx.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }), inline(lv.value, nums));
        else tx.append(inline(ti.body, nums));
        row.append(tx);
        wrap.append(row);
        return;
      }
      const lv = Core.splitLabel(ti.body);
      const row = h('div', { class: 'kv' });
      if (lv) {
        row.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }));
        let nx = i + 1;
        while (nx < lines.length && Core.info(lines[nx]).kind === 'blank') nx++;
        const hasList = nx < lines.length && Core.info(lines[nx]).kind === 'li';
        if (lv.value.trim() === '' && !hasList) row.append(h('span', { class: 'pend', text: tbd + lv.label }));
        else row.append(inline(lv.value, nums));
      } else row.append(inline(ti.body, nums));
      wrap.append(row);
    });
    return wrap;
  }

  // 块的位置按元素上的 data-line 读；增删行后后面的块被平移
  function shiftLines(after, delta) {
    if (!delta) return;
    Array.prototype.forEach.call(body.querySelectorAll('[data-line]'), (el) => {
      const n = Number(el.getAttribute('data-line'));
      if (n > after) el.setAttribute('data-line', String(n + delta));
    });
  }

  // 点一下变成大填写框，点框外保存
  function makeBox(line, sec, nums) {
    const el = h('div', { class: 'box', 'data-line': line, tabindex: 0, role: 'button', 'aria-label': t('点击修改') });
    const at = () => Number(el.getAttribute('data-line'));
    const paint = () => {
      clear(el);
      const text = Core.bodyText(Core.split(S.md), at());
      if (!text.trim()) el.append(h('div', { class: 'hint-note' }, t('点这里填写。')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
      else el.append(renderLines(text, nums, docLangOf(S.md)));
    };
    const edit = () => {
      if (el.querySelector('textarea')) return;
      const text = Core.bodyText(Core.split(S.md), at());
      const ta = h('textarea', { class: 'in big', placeholder: sectionHint(S.md, sec), value: text, 'aria-label': t('内容') });
      ta.addEventListener('input', () => {
        autoGrow(ta);
        const before = Core.split(S.md).length;
        typing(Core.setBody(S.md, at(), ta.value), 'b' + at());
        shiftLines(at(), Core.split(S.md).length - before);
      });
      ta.addEventListener('blur', paint);
      ta.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); ta.blur(); } });
      clear(el);
      el.append(ta);
      autoGrow(ta);
      ta.focus();
    };
    el.addEventListener('click', (e) => { if (!e.target.closest('button') && !el.querySelector('textarea')) edit(); });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); edit(); } });
    el.edit = edit;
    paint();
    return el;
  }

  function nameSlot(label, placeholder, run) {
    const slot = h('div', { class: 'addslot' });
    const showButton = () => {
      clear(slot);
      slot.append(h('button', { type: 'button', class: 'btn', onclick: showForm }, '＋ ' + label));
    };
    const showForm = () => {
      clear(slot);
      const input = h('input', { class: 'in', placeholder, 'aria-label': placeholder });
      const err = h('p', { class: 'err', style: 'display:none' });
      const go = () => {
        const r = run(input.value);
        if (r && !r.ok) { err.textContent = r.error; err.style.display = ''; input.focus(); }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); go(); }
        if (e.key === 'Escape') { e.stopPropagation(); showButton(); }
      });
      slot.append(h('div', { class: 'addrow' }, input,
        h('button', { type: 'button', class: 'btn primary', onclick: go }, t('添加')),
        h('button', { type: 'button', class: 'btn', onclick: showButton }, t('取消'))), err);
      input.focus();
    };
    showButton();
    return slot;
  }

  function afterAdd(line) {
    renderBody();
    const el = body.querySelector('[data-line="' + line + '"]');
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    const box = el.classList.contains('box') ? el : el.querySelector('.box');
    if (box && box.edit) box.edit();
  }

  function renameInline(btn, current, run) {
    const input = h('input', { class: 'in', value: /〈/.test(current) ? '' : current, placeholder: t('名称'), 'aria-label': t('名称') });
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      if (save && input.value.trim() !== current) run(input.value);
      renderAll();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') { e.stopPropagation(); finish(false); } });
    input.addEventListener('blur', () => finish(true));
    btn.replaceWith(input);
    input.focus();
    input.select();
  }

  // 项目情况：每个功能做什么、做到哪一步
  function renderProgress() {
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: t('项目情况') }),
      h('span', { class: 'muted', text: t('已完成 {done} / {total}，进行中 {doing}', { done, total: list.length, doing }) })));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    list.forEach((f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('点击切换进度') }, W[f.status]);
      chip.addEventListener('click', () => {
        commit(Core.setProgress(S.md, f.line, Core.nextProgress(f.status)));
        renderAll();
      });
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' },
          h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, (f.no ? f.no + ' ' : '') + f.name),
          f.what ? h('span', { class: 'muted', text: f.what }) : null),
        chip));
    });
    return box;
  }

  function renderPlan() {
    const lines = Core.split(S.md);
    const nums = headingNumbers(lines);
    const hs = Core.headings(lines);
    const lang = docLangOf(S.md);
    const doc = h('div', { class: 'doc' });
    const title = hs.filter((x) => x.level === 1)[0];
    if (title) {
      const nm = Core.titleName(S.md);
      const nameBtn = h('button', { type: 'button', class: 'title', 'data-line': title.line, title: t('点击改名') }, nm || t('未命名项目'));
      nameBtn.addEventListener('click', () => renameInline(nameBtn, nm, (v) => { if (v.trim()) commit(Core.setTitle(S.md, v)); }));
      doc.append(h('h1', null, nameBtn));
    }
    doc.append(h('div', { class: 'statusline' }));
    const prog = renderProgress();
    if (prog) doc.append(prog);
    let secBody = null;
    hs.forEach((x, idx) => {
      if (x.level === 2) {
        const no = (/^(\d+)\b/.exec(x.body) || [])[1] || '';
        const secEl = h('section', { class: 'sec' + (S.collapsed[x.body] ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('展开或收起') }, S.collapsed[x.body] ? '▸' : '▾');
        fold.addEventListener('click', () => {
          const closed = secEl.classList.toggle('closed');
          S.collapsed[x.body] = closed;
          fold.textContent = closed ? '▸' : '▾';
          if (!closed) growAll(secEl);
        });
        secEl.append(h('div', { class: 'sec-head' }, h('h2', null, inline(x.body, nums)), fold));
        secBody = h('div', { class: 'sec-body' });
        secEl.append(secBody);
        const next = hs[idx + 1];
        const hasChildren = next && next.level >= 3;
        if (!hasChildren || Core.bodyText(lines, x.line).trim() !== '') secBody.append(makeBox(x.line, no, nums));
        if (ADD_LABEL[no]) {
          const slot = no === '2'
            ? h('div', { class: 'addslot' }, h('button', { type: 'button', class: 'btn', onclick() {
              const r = Core.addFlowLine(S.md);
              if (r.ok) { commit(r.md); afterAdd(x.line); }
            } }, '＋ ' + t(ADD_LABEL[no])))
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('界面名称') : t('功能名称'), (name) => {
              const kind = no === '3' ? 'page' : 'feature';
              const r = Core.addBlock(S.md, kind, name);
              if (!r.ok) return { ok: false, error: nameError(r.code, kind) };
              commit(r.md);
              afterAdd(r.line);
              return r;
            });
          secBody.append(slot);
        }
        doc.append(secEl);
      } else if (x.level === 3 && secBody) {
        const no = (/^(\d+\.\d+)\b/.exec(x.body) || [])[1] || '';
        const sec = (/^(\d+)\./.exec(no) || [])[1] || '';
        const card = h('div', { class: 'blk', 'data-line': x.line, 'data-no': no });
        const titleText = x.body.replace(/^\d+\.\d+\s*/, '');
        const nameBtn = h('button', { type: 'button', class: 'blk-title', title: t('点击改名') },
          h('span', { class: 'no', text: no }), titleText && !/〈/.test(titleText) ? h('span', { text: titleText }) : h('span', { class: 'ph', text: t('名称') }));
        nameBtn.addEventListener('click', () => renameInline(nameBtn, titleText, (v) => {
          const r = Core.renameBlock(S.md, Number(card.getAttribute('data-line')), v);
          if (r.ok) commit(r.md); else toast(nameError(r.code, sec === '3' ? 'page' : 'feature'));
        }));
        const del = h('button', { type: 'button', class: 'x', title: t('删除'), 'aria-label': t('删除'), onclick() {
          commit(Core.join(Core.deleteSubtree(Core.split(S.md), Number(card.getAttribute('data-line')))));
          renderAll();
          toast(t('已删除。'), { label: t('撤销'), run: () => undo() });
        } }, '✕');
        card.append(h('div', { class: 'blk-head' }, nameBtn, del), makeBox(x.line, sec, nums));
        const slot = secBody.querySelector('.addslot');
        if (slot) secBody.insertBefore(card, slot); else secBody.append(card);
      }
    });
    return doc;
  }

  // ---------- 导入、导出、复制 ----------

  function exportText() {
    return Core.normalizeForExport(S.md);
  }

  function exportPlan() {
    if (!S.md.trim()) { toast(t('还没有内容可以导出。')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('已导出：{name}', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('把写好的计划书粘贴在这里，或选择文件。'), 'aria-label': t('导入内容') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('这个文件读不出来，请确认是文本文件。')));
    });
    app.append(file);
    kit.openModal({
      title: t('导入'),
      body: ta,
      onClose() { file.remove(); },
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, t('选择文件')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          if (!ta.value.trim()) { toast(t('请先粘贴内容或选择文件。')); return; }
          close();
          importText(ta.value);
        } }, t('导入')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  function importText(text) {
    const txt = text.replace(/\r\n?/g, '\n');
    if (!/^##\s+\d/m.test(txt)) {
      const zh = LANG === 'zh';
      const wrapped = [zh ? '# 计划书：' + (S.project.name || '〈项目名〉') : '# Plan: ' + (S.project.name || '〈Project name〉'), '',
        zh ? '状态：整理中　　更新：' + Core.today() : 'Status: In progress　　Updated: ' + Core.today(), '',
        zh ? '## 未识别' : '## Not recognised', ''].concat(txt.split('\n')).join('\n');
      commit(wrapped, true);
      renderAll();
      toast(t('没有认出计划书的格式，原文已放进「未识别」。'), { label: t('撤销'), run: () => undo() });
      return;
    }
    commit(txt, true);
    renderAll();
    toast(t('已导入计划书。'), { label: t('撤销'), run: () => undo() });
  }

  function newBlank() {
    commit(Core.blankPlan(SCHEMA[LANG].planTemplate, S.project.name === t('新项目') ? '' : S.project.name, Core.today()), true);
    renderAll();
    toast(t('已新建计划书。'), { label: t('撤销'), run: () => undo() });
  }

  function loadExample() {
    commit(SCHEMA[LANG].example, true);
    renderAll();
    toast(t('已载入示例。'), { label: t('撤销'), run: () => undo() });
  }

  function openAiPrompt() {
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('想做什么，随手写就行。'), 'aria-label': t('你的话') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('给 AI 的话') });
    const refresh = () => { out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, LANG); autoGrow(out); };
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('复制给 AI 的话'),
      body: h('div', null, h('div', { class: 'field' }, h('div', { class: 'fl', text: t('你的话') }), note), h('div', { class: 'field' }, h('div', { class: 'fl', text: t('发给 AI 的内容') }), out)),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('关闭')),
        h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, out.value, out); } }, t('复制')),
      ],
    });
    refresh();
  }

  // ---------- 页面外壳 ----------

  function pendJump() {
    const els = Array.prototype.slice.call(body.querySelectorAll('.pend'));
    if (!els.length) return;
    pendIndex = (pendIndex + 1) % els.length;
    const el = els[pendIndex];
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1400);
  }

  function renderStatus() {
    const box = body.querySelector('.statusline');
    if (!box) return;
    clear(box);
    const lang = docLangOf(S.md);
    const code = Core.getStatus(S.md) || 'doing';
    const n = Core.countPending(S.md);
    box.append(h('span', { class: 'state' + (code === 'approved' ? ' pass' : ''), text: Core.statusLabel(code, lang) }));
    if (n > 0) box.append(h('button', { type: 'button', class: 'btn sm', onclick: pendJump }, t('还有 {n} 处待补', { n })));
    else box.append(h('span', { class: 'muted', text: t('没有待补') }));
    if (code !== 'approved') {
      box.append(h('button', { type: 'button', class: 'btn sm primary', onclick() {
        const r = Core.markPassed(S.md);
        if (!r.ok) { toast(t('还有 {n} 处待补，补完才能通过。', { n: r.pending })); return; }
        commit(r.md, true);
        renderAll();
        toast(t('计划书已通过，可以开始做。'));
      } }, t('标记为已通过')));
    }
    if (S.folder.state === 'ready') {
      box.append(h('span', { class: 'muted', text: t('文件夹：{name}', { name: S.folder.name }) + (S.lastSync ? '　' + t('同步于 {time}', { time: S.lastSync }) : '') }));
      if (S.folder.path) {
        box.append(h('button', { type: 'button', class: 'btn sm', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, t('复制地址')));
      }
    }
  }

  function openToc(anchor) {
    kit.openPop(anchor, (pop, close) => {
      Core.headings(Core.split(S.md)).filter((x) => x.level === 2 || x.level === 3).forEach((x) => {
        pop.append(h('button', { type: 'button', style: x.level === 3 ? 'padding-left:1.6em' : 'font-weight:700', onclick() {
          close();
          jumpTo('[data-line="' + x.line + '"]');
        } }, x.body));
      });
    });
  }

  function openMenu(anchor) {
    kit.openPop(anchor, (pop) => {
      const add = (l, run, ex) => pop.append(kit.popItem(l, run, ex));
      const f = S.folder;
      const has = S.md.trim() !== '';
      if (has) {
        add(t('目录'), () => openToc(anchor));
        add(t('复制全文'), () => showText(kit, t('计划书全文'), exportText(), t('复制后发给 AI。')));
        add(t('复制给 AI 的话'), openAiPrompt);
        add(t('导出'), exportPlan);
        pop.append(h('hr'));
      }
      add(t('看示例'), loadExample);
      add(t('新建空白计划书'), newBlank);
      add(t('导入'), openImport);
      if (has) {
        add(t('撤销'), () => { if (!undo()) toast(t('没有可撤销的修改。')); });
        add(t('重做'), () => { if (!redo()) toast(t('没有可重做的修改。')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('文件夹功能需要电脑上的 Chrome 或 Edge'), () => {}, { disabled: true });
      else if (f.state === 'none') add(t('连接文件夹'), folderConnect);
      else if (f.state === 'need') add(t('重新授权文件夹'), folderRegrant);
      else {
        if (SERVER) add(t('换一个文件夹'), openFolders);
        add(t('刷新'), () => folderPull(true, false));
        add(t('断开文件夹'), folderDisconnect);
      }
      pop.append(h('hr'));
      index.list.forEach((p) => {
        pop.append(h('div', { class: 'row2' },
          h('button', { type: 'button', class: p.id === S.project.id ? 'on' : '', onclick() { kit.closePop(); if (p.id !== S.project.id) switchProject(p.id); } }, p.name),
          h('button', { type: 'button', class: 'x', title: t('删除项目'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
      });
      add(t('新项目'), () => createProject());
      pop.append(h('hr'));
      add(LANG === 'zh' ? 'English' : '中文', () => { setLang(LANG === 'zh' ? 'en' : 'zh'); renderAll(); });
    });
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'x more', title: t('更多'), 'aria-label': t('更多'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'empty' },
        h('p', { text: t('还没有计划书。新建一份，看一份示例，或导入写好的计划书。') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('新建空白计划书')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('看示例')),
          h('button', { type: 'button', class: 'btn', onclick: () => openImport() }, t('导入')),
          Folder.supported() && S.folder.state !== 'ready' ? h('button', { type: 'button', class: 'btn', onclick: folderConnect }, t('连接文件夹')) : null)));
    } else {
      content = h('div', { class: 'col' }, renderPlan());
    }
    body.append(content);
    growAll(body);
    body.scrollTop = st;
    pendIndex = -1;
    renderStatus();
  }

  function renderAll() {
    renderHead();
    renderBody();
  }

  // ---------- 快捷键与自动更新 ----------

  function inField(e) {
    const el = e.composedPath ? e.composedPath()[0] : e.target;
    return el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (kit.escape()) e.preventDefault(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 's') {
      e.preventDefault();
      if (S.folder.state === 'ready') folderPush().then(() => toast(t('已保存。')));
      else toast(t('已保存在浏览器里。'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('没有可撤销的修改。')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('没有可重做的修改。')); }
  });
  body.addEventListener('scroll', kit.closePop);
  let growTimer = 0;
  window.addEventListener('resize', () => {
    kit.closePop();
    clearTimeout(growTimer);
    growTimer = setTimeout(() => growAll(body), 120);
  });
  window.addEventListener('focus', () => folderPull(false, true));
  // 文件夹里的计划书一变，页面跟着更新
  setInterval(() => {
    if (document.visibilityState === 'visible' && S.folder.state === 'ready') folderPull(false, true);
  }, 3000);

  startProject();
  if (SERVER && opts.folder) connectFolderPath(opts.folder);
  renderAll();

  return {
    el: app,
    refresh: () => folderPull(false, true),
    state: () => S,
  };
}

'use strict';
// 文件夹列表（本机服务提供）和桌面上的小窗口：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path), onBrowse() }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('正在读取最近的文件夹') }));
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('正在用') }) : null),
        h('div', { class: 'fpath', text: x.path }),
        s ? h('div', { class: 'muted', text: t('已完成 {done} / {total}，待补 {n} 处', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('还没有计划书') }));
      const isCur = o.current && o.current.toLowerCase() === x.path.toLowerCase();
      return h('div', { class: 'frow' + (isCur ? ' cur' : '') }, info,
        h('div', { class: 'factions' },
          h('button', { type: 'button', class: 'btn sm primary', onclick: () => o.onPick(x.path) }, isCur ? t('当前') : t('打开计划书')),
          h('button', { type: 'button', class: 'btn sm', onclick: () => copyThen(o.kit, x.path) }, t('复制地址'))));
    };
    const section = (title, list) => {
      if (!list.length) return;
      container.append(h('h3', { class: 'ftitle', text: title }));
      list.forEach((x) => container.append(row(x)));
    };
    const active = data.claude.filter((x) => x.active);
    const recent = data.claude.filter((x) => !x.active);
    section(t('正在用 Claude 的文件夹'), active);
    section(t('最近用过的文件夹'), recent);
    section(t('连接过的文件夹'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('还没有找到文件夹。点下面的按钮选择一个。') }));
    container.append(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onclick: o.onBrowse }, t('选择别的文件夹'))));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('读取文件夹列表失败：{why}', { why: errText(e) }) }));
  });
}

// 桌面小窗口
function createHub(opts) {
  const app = h('div', { class: 'app' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'body' });
  app.append(head, body);
  const kit = createKit(app);

  const openPlan = (path) => {
    const url = '/index.html?k=' + encodeURIComponent(SERVER.token) + '&folder=' + encodeURIComponent(path);
    const w = window.open(url, 'shupian-plan', 'popup=yes,width=980,height=820');
    if (!w) location.href = url;
  };

  const list = h('div', { class: 'folders' });
  const refresh = () => folderRows(list, {
    kit,
    current: '',
    onPick: openPlan,
    onBrowse: async () => {
      try {
        const r = await Api.call('POST', '/api/pick', {});
        if (r.path) openPlan(r.path);
      } catch (e) {
        kit.toast(t('没有打开文件夹：{why}', { why: errText(e) }));
      }
    },
  });

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'btn sm', onclick() { setLang(LANG === 'zh' ? 'en' : 'zh'); renderHead(); refresh(); } }, LANG === 'zh' ? 'English' : '中文')));
  }

  renderHead();
  body.append(h('div', { class: 'col' }, list));
  refresh();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  window.addEventListener('focus', refresh);
  return { el: app };
}

'use strict';
// 悬浮在别的页面上的小窗：指出一个东西、截一张图、写一句话，合成一段话复制给 AI。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'fb-body' });
  app.append(head, body);
  const kit = createKit(app);
  const S = { text: '', element: '', styles: '', shot: null };

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  head.append(h('div', { class: 'in drag' },
    h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('改哪里') })),
    h('span', { class: 'sp' }),
    h('button', { type: 'button', class: 'x', title: t('关闭'), 'aria-label': t('关闭'), onclick: opts.onClose }, '✕')));

  function feedbackText() {
    const ctx = tools.context();
    return Core.buildFeedback({
      text: S.text, page: ctx.page, view: ctx.view, element: S.element, styles: S.styles,
      errors: tools.errors(), shot: S.shot ? t('截图在剪贴板里，请另外粘贴') : '',
    }, LANG);
  }

  async function pick() {
    const r = await tools.pick();
    if (!r) return;
    S.element = r.path;
    S.styles = r.styles;
    render();
  }

  async function shot() {
    try {
      const r = await tools.capture();
      if (!r) { kit.toast(t('这个页面没有截下来。')); return; }
      if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
      S.shot = { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) };
      render();
    } catch (e) {
      kit.toast(t('这个页面没有截下来：{why}', { why: errText(e) }));
    }
  }

  async function copyShot() {
    if (!S.shot) return;
    if (await copyImage(S.shot.blob)) { kit.toast(t('截图已复制。')); return; }
    kit.toast(t('已下载：{name}', { name: download(S.shot.blob, 'screenshot', 'webp', 'image/webp') }));
  }

  function render() {
    clear(body);
    body.append(h('div', { class: 'row tight' },
      h('button', { type: 'button', class: 'btn', onclick: pick }, t('选取元素')),
      h('button', { type: 'button', class: 'btn', onclick: shot }, t('截图'))));
    if (S.element) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: S.element }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.element = ''; S.styles = ''; render(); } }, '✕')));
    }
    if (S.shot) {
      body.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('截图') }),
        h('span', { text: S.shot.kind }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { URL.revokeObjectURL(S.shot.url); S.shot = null; render(); } }, '✕')));
    }
    const ta = h('textarea', { class: 'in', rows: 3, placeholder: t('想怎么改，随手写。'), value: S.text, 'aria-label': t('想怎么改') });
    ta.addEventListener('input', () => { S.text = ta.value; autoGrow(ta); });
    body.append(ta);
    body.append(h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, feedbackText()); } }, t('复制文字')),
      S.shot ? h('button', { type: 'button', class: 'btn', onclick: copyShot }, t('复制截图')) : null));
    setTimeout(() => autoGrow(ta), 0);
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  render();
  return { el: app };
}

'use strict';
// 挂载：有 #shupian-app 就整页显示（桌面小窗口或计划书页）；否则作为小悬浮窗叠在当前页面上。

function styleEl() {
  return h('style', { text: CSS });
}

// 打开或屏幕尺寸变化时：整个窗口都要在屏幕内（放不下就贴左上）
function fitPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, 0), Math.max(0, vw - w))),
    y: Math.round(Math.min(Math.max(pos.y, 0), Math.max(0, vh - hgt))),
  };
}

// 拖动时：最多允许出去一半，标题栏始终在屏幕里
function clampPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, -w / 2), vw - w / 2)),
    y: Math.round(Math.min(Math.max(pos.y, 0), vh - Math.min(hgt, vh) / 2)),
  };
}

function dragWith(el, shouldStart, getPos, setPos, onTap) {
  let st = null;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (shouldStart && !shouldStart(e)) return;
    const p = getPos();
    st = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: p.x, y: p.y, moved: false };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* 指针已结束 */ }
  });
  el.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    const dx = e.clientX - st.sx;
    const dy = e.clientY - st.sy;
    if (!st.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    st.moved = true;
    setPos({ x: st.x + dx, y: st.y + dy }, false);
  });
  const end = (e) => {
    if (!st || e.pointerId !== st.id) return;
    const s = st;
    st = null;
    if (s.moved) setPos(getPos(), true);
    else if (onTap) onTap(e);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

function mountPage(host) {
  const params = new URLSearchParams(location.search);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const wrap = h('div', { style: 'width:100%;height:100%' });
  const hub = params.get('view') === 'hub' && SERVER;
  const inst = hub ? createHub({ root }) : createApp({ root, defaultName: t('新项目'), folder: params.get('folder') || '' });
  wrap.append(inst.el);
  root.append(wrap);
  document.title = t('prompt 计划书助手');
  return { open() {}, close() {}, toggle() {}, mode: hub ? 'hub' : 'plan' };
}

function nextFrames(n) {
  return new Promise((resolve) => {
    const step = (i) => (i <= 0 ? resolve() : requestAnimationFrame(() => step(i - 1)));
    step(n);
  });
}

function mountFloat(autoOpen) {
  if (window.top !== window) return null;
  installErrorHook();
  const host = document.createElement('div');
  host.setAttribute('data-shupian', '');
  host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const win = h('div', { class: 'win', style: 'display:none' });
  const fab = h('button', { type: 'button', class: 'fab', title: t('prompt 计划书助手') + '（Alt+Shift+S）', 'aria-label': t('prompt 计划书助手') });
  fab.innerHTML = ICON_SVG;
  root.append(win, fab);

  let built = false;
  let isOpen = false;
  const winKey = NS + ':win';
  const fabKey = NS + ':fab';

  const savedWinPos = () => LS.get(winKey, null) || { x: window.innerWidth - win.offsetWidth - 12, y: window.innerHeight - win.offsetHeight - 12 };
  const winPos = () => {
    const r = win.getBoundingClientRect();
    return { x: r.left, y: r.top };
  };
  const placeWin = (pos, save, loose) => {
    const w = win.offsetWidth;
    const hh = win.offsetHeight;
    const p = loose ? clampPos(pos, w, hh) : fitPos(pos, w, hh);
    win.style.left = p.x + 'px';
    win.style.top = p.y + 'px';
    if (save) LS.set(winKey, p);
  };
  const dragWin = (pos, final) => placeWin(pos, final, true);
  const fabPos = () => {
    const saved = LS.get(fabKey, null);
    const s = fab.offsetWidth || 54;
    const base = saved || { x: window.innerWidth - s - 14, y: window.innerHeight - s - 14 };
    return { x: Math.min(Math.max(base.x, 0), window.innerWidth - s), y: Math.min(Math.max(base.y, 0), window.innerHeight - s) };
  };
  const placeFab = (pos, save) => {
    const s = fab.offsetWidth || 54;
    const p = { x: Math.min(Math.max(pos.x, 0), window.innerWidth - s), y: Math.min(Math.max(pos.y, 0), window.innerHeight - s) };
    fab.style.left = p.x + 'px';
    fab.style.top = p.y + 'px';
    if (save) LS.set(fabKey, p);
  };

  // 截图和选取元素时窗口先藏起来
  const whileHidden = async (fn) => {
    const was = win.style.display;
    win.style.display = 'none';
    fab.style.display = 'none';
    try {
      await nextFrames(2);
      return await fn();
    } finally {
      win.style.display = was;
      if (!isOpen) fab.style.display = '';
    }
  };
  const tools = {
    capture: () => whileHidden(async () => (await realShot()) || (await domShot())),
    pick: () => whileHidden(() => pickElement(root)),
    errors: () => pageErrors.slice(),
    context: () => ({ page: location.href, view: window.innerWidth + '×' + window.innerHeight }),
  };

  const open = () => {
    if (!built) {
      win.append(createFeedback({ tools, onClose: close }).el);
      built = true;
    }
    isOpen = true;
    win.style.display = '';
    fab.style.display = 'none';
    placeWin(savedWinPos(), false, false);
  };
  function close() {
    isOpen = false;
    win.style.display = 'none';
    fab.style.display = '';
    placeFab(fabPos(), false);
  }
  const toggle = () => (isOpen ? close() : open());

  dragWith(fab, null, fabPos, placeFab, toggle);
  dragWith(win, (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    let onBar = false;
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (n === win) break;
      if (n.tagName === 'BUTTON' || n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') return false;
      if (n.classList && n.classList.contains('head')) onBar = true;
    }
    return onBar;
  }, winPos, dragWin);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); toggle(); }
  }, true);
  window.addEventListener('resize', () => {
    if (isOpen) placeWin(winPos(), false, false);
    else placeFab(fabPos(), false);
  });
  placeFab(fabPos(), false);
  if (autoOpen) open();

  return { open, close, toggle, mode: 'float' };
}

(function boot() {
  if (window.Shupian) return;
  const params = new URLSearchParams(location.search);
  const want = params.get('shupian') || (location.hash.indexOf('#shupian-') === 0 ? location.hash.slice(9) : '');
  const start = () => {
    const page = document.getElementById('shupian-app');
    const api = page ? mountPage(page) : mountFloat(!!want || document.documentElement.hasAttribute('data-shupian-open'));
    if (!api) return;
    window.Shupian = api;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg && msg.shupian === 'toggle') api.toggle();
      });
    }
    window.addEventListener('message', (e) => {
      if (e.source === window && e.data && typeof e.data.shupian === 'string') {
        if (e.data.shupian === 'close') api.close();
        else api.open();
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

})();
