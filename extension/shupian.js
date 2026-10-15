(function () {
'use strict';
const SCHEMA = {"zh":{"fields":{"1":[{"name":"这是什么","purpose":"要做的东西，一两句话","how":"一个计时器，工作 25 分钟、休息 5 分钟，轮流提醒"},{"name":"给谁用","purpose":"使用的人，以及使用的时机","how":"需要专心做事的人，坐在电脑前的时候"},{"name":"用完得到什么","purpose":"使用之后得到的结果","how":"知道今天专心做了几轮"}],"2":[{"name":"用法","purpose":"每种用法一行：用的人做什么 → 看到什么 → 再做什么","how":"开始一轮：点「开始」→ 看到倒计时 → 时间到听到提示音"}],"3":[{"name":"这个页面是干什么的","purpose":"用的人在这里做什么","how":"查看倒计时，开始或暂停"},{"name":"页面上有什么","purpose":"页面上的每一样东西，一行一个：名字：它是什么；点击或触碰后会怎样","how":"开始按钮：开始倒计时；点击后变成「暂停」"},{"name":"怎么来到这个页面","purpose":"从哪里进入","how":"一打开就是它"}],"4":[{"name":"它做什么","purpose":"这件事是什么，一句话","how":"按设定的分钟数倒计时"},{"name":"怎么才算做好","purpose":"每种情况一行：某种情况：应该出现什么","how":"设成 25 分钟点开始：每秒减一，到 0 时提示"},{"name":"有什么限制","purpose":"数字范围，以及不允许出现的情况","how":"分钟数只能是 1 到 120"},{"name":"进度","purpose":"未做、进行中、已完成，AI 完成后自动更新","how":"未做"},{"name":"问题","purpose":"制作过程中发现的问题，一行一个，修好后标注「已修」","how":"点暂停后数字仍在走"}],"5":[{"name":"信息","purpose":"每种一行：名字：包含什么；下次打开是否保留","how":"设置：工作分钟数、休息分钟数；保留"}],"6":[{"name":"想要什么风格","purpose":"风格、颜色、气氛","how":"白底、简洁、像笔记本"},{"name":"有没有参考的东西","purpose":"希望参考的产品或样式，写名称即可","how":"像系统自带的计时器"},{"name":"绝对不要什么","purpose":"一定不能出现的内容","how":"不要广告，不要打断操作的弹窗"}],"7":[{"name":"用在哪里","purpose":"手机、电脑、网页、游戏机或其他","how":"手机和电脑"},{"name":"要哪几种语言","purpose":"界面需要的语言","how":"中文和英文"},{"name":"图片、文字、声音从哪里来","purpose":"由谁提供，或交给 AI 绘制、撰写","how":"提示音用免费素材，图标让 AI 绘制"},{"name":"要不要账号或登录","purpose":"使用者是否需要注册","how":"不需要"},{"name":"还有什么要求","purpose":"其他补充内容","how":"无"}]},"planTemplate":"# 计划书：〈项目名〉\r\n\r\n状态：草稿　　更新：〈日期〉\r\n\r\n## 1 这是什么\r\n\r\n这是什么：\r\n给谁用：\r\n用完得到什么：\r\n\r\n## 2 怎么用\r\n\r\n〈每种用法写一行：用的人做什么 → 看到什么 → 再做什么〉\r\n\r\n## 3 页面\r\n\r\n### 3.1 〈页面名〉\r\n\r\n这个页面是干什么的：\r\n页面上有什么：\r\n- 〈东西的名字〉：它是什么；点了或碰了会怎样\r\n怎么来到这个页面：\r\n\r\n## 4 功能\r\n\r\n### 4.1 〈功能名〉\r\n\r\n它做什么：\r\n怎么才算做好：\r\n- 〈某种情况〉：应该出现什么\r\n有什么限制：\r\n进度：未做\r\n\r\n## 5 要记住的信息\r\n\r\n- 〈信息的名字〉：包含什么；下次打开还要不要在\r\n\r\n## 6 风格\r\n\r\n想要什么风格：\r\n有没有参考的东西：\r\n绝对不要什么：\r\n\r\n## 7 使用和要求\r\n\r\n用在哪里：\r\n要哪几种语言：\r\n图片、文字、声音从哪里来：\r\n要不要账号或登录：\r\n还有什么要求：\r\n\r\n## 最初的描述\r\n\r\n〈AI 帮填时，把你最初说的话原样放在这里〉\r\n\r\n---\r\n\r\n缺的内容在原位写「待补：缺什么」，不另开一栏。\r\n","changeTemplate":"# 修改单：〈一句话标题〉\n\n状态：整理中　　更新：〈日期〉\n\n类型：Bug / 加功能 / 调整\n哪个界面或功能：〈只写知道的那一层〉\n我看到：\n我想要：\n怎么出现的：\n同类检查：已查\n记录：〈AI 转化时放你的原话和对应到计划书哪里〉\n\n---\n\n通过 = AI 把修改对应到计划书并补完，并且你确认过。通过之后才改。\n","example":"# 计划书：prompt 计划书助手\n\n状态：整理中　　更新：2026-10-15\n\n## 1 这是什么\n\n这是什么：新项目计划书的书写模板。在页面里按提示填写，AI 据此制作，制作过程中可以随时查看进度和问题。\n给谁用：用 AI 制作东西的人，不要求懂代码，做的可能是网页、应用、游戏或其他。\n用完得到什么：一份 AI 可以直接照着做的计划书，以及制作开始后随时更新的功能清单。\n\n## 2 怎么用\n\n写计划书：把想法交给 AI → AI 写出计划书 → 在页面里查看并直接修改 → 没有待补并确认后开始制作\n自己填：新建空白计划书或查看示例 → 点击每一块，按框内提示填写 → 补完待补 → 确认\n看进度：打开功能清单 → 看到每个功能的进度和未处理的问题 → AI 完成一个功能后，进度自动更新\n写问题：在功能清单里点击某个功能的「＋」→ 在小弹窗里写下问题，输入 @ 可以换功能 → AI 读取并修复\n找文件夹：按桌面快捷键 → 屏幕右下角弹出小窗口，列出最近使用的文件夹 → 复制地址在命令行中打开，或打开它的计划书\n标记要改的位置：在制作中的页面上打开小窗 → 选取元素、框选区域或记录当前页面 → 写一句说明 → 复制给 AI\n\n## 3 页面\n\n### 3.1 计划书页\n\n这个页面是干什么的：开工之前是计划书，确认之后变成功能清单。查看和修改内容，查看每个功能的进度和问题。\n页面上有什么：\n- 标签：每个打开的项目一个标签，可以关闭，也可以再添加；桌面版多一个「最近」标签\n- 项目情况或功能清单：每个功能做什么、进度、未处理的问题；确认之后每个功能带「＋」，用来写问题\n- 每一块内容：点击后变成大填写框，点击框外保存；框内显示这一块该写什么和示例\n- 待补数量：点击后跳到下一处\n- 确认并开始：没有待补时确认\n- 语言：下拉选择中文或 English\n- 更多：目录、复制全文、导出、查看示例、新建、导入、连接文件夹、下载桌面版\n怎么来到这个页面：打开网页；或在「最近」里点击某个文件夹的「打开计划书」\n\n### 3.2 最近\n\n这个页面是干什么的：列出最近使用的文件夹，一键打开计划书或复制地址。\n页面上有什么：\n- 正在使用的文件夹：最近有活动的，标注「使用中」\n- 最近使用的、连接过的文件夹：每个显示完整地址和进度\n- 打开计划书：在新标签中打开\n- 复制地址：复制完整地址\n- 选择别的文件夹：弹出系统的文件夹选择窗口\n怎么来到这个页面：桌面快捷键，或计划书页里的「最近」标签\n\n### 3.3 标记要修改的位置（小悬浮窗）\n\n这个页面是干什么的：在制作中的页面上标记要修改的位置，生成一段可以直接发给 AI 的文字。\n页面上有什么：\n- 选取元素：点击页面上的一个元素，记录它的位置、文字和样式\n- 区域截图：在页面上框选一块区域，保存为图片\n- 当前页面：一次记录当前页面的地址、标题、窗口大小、可见的标题和按钮，并保存整页截图\n- 修改说明：写明需要修改的内容\n- 复制文字、复制截图：复制出去发给 AI\n怎么来到这个页面：制作中的页面里的薯片按钮，或 Alt+Shift+S\n\n## 4 功能\n\n### 4.1 查看与修改\n\n它做什么：把计划书显示成可读的页面，点击任何一块即可直接修改，随时允许修改。\n怎么才算做好：\n- 点击一块，改完点击框外：保存并显示\n- 添加页面或功能：填写名称，为空或重名时提示，成功后出现一组空字段\n- 删除页面或功能：可以撤销\n- 修改已确认的计划书：状态回到整理中\n有什么限制：页面名和功能名不重名；编号只增不重排\n进度：已完成\n\n### 4.2 项目情况与功能清单\n\n它做什么：显示每个功能做什么、做到哪一步；确认之后计划书转为功能清单，可以在功能下记录问题。\n怎么才算做好：\n- 功能块里写了进度：按未做、进行中、已完成显示，并统计各有几个\n- AI 或其他编辑器修改了计划书文件：页面几秒内自动更新，不需要刷新\n- 点击进度：在三种之间切换并写回计划书\n- 确认之后：顶部变成「功能清单」，各部分默认收起\n有什么限制：没写进度的按未做计算\n进度：已完成\n\n### 4.3 写问题\n\n它做什么：在功能清单里给某个功能记录问题，AI 读取后修复，修好后标注「已修」。\n怎么才算做好：\n- 点击功能旁的「＋」：弹出小窗，已选中该功能；输入 @ 可以换成别的功能\n- 添加：问题写入该功能块的「问题」下，带日期\n- 已修：点击后在问题前加「已修：」，从未处理列表中移除\n- 删除：可以撤销\n有什么限制：问题只记文字，不带图片\n进度：已完成\n\n### 4.4 标签页\n\n它做什么：一个窗口里同时打开多个项目，用标签切换；桌面版多一个「最近」标签。\n怎么才算做好：\n- 在「最近」里点击打开计划书：新开一个标签，不覆盖别的\n- 关闭标签：不丢内容，之后可以从「更多」里再次打开\n- 刷新页面：打开的标签和当前标签都保留\n有什么限制：标签放不下时左右滑动，不换行\n进度：已完成\n\n### 4.5 最近的文件夹\n\n它做什么：列出最近使用的文件夹，不用每次手动查找；复制地址方便在命令行中打开。\n怎么才算做好：\n- 桌面快捷键打开：最近使用的文件夹排在最前，点击即可打开它的计划书\n- 每个文件夹旁有「复制地址」\n- 页面里修改了计划书：自动保存进文件夹；文件夹里被修改：自动读入页面；两边都改了：弹窗让用户选择\n有什么限制：「使用中」按最近的活动推测，不一定是当前窗口；没有桌面版时使用浏览器自带的文件夹选择，仅支持电脑版 Chrome 和 Edge\n进度：已完成\n\n### 4.6 标记要修改的位置（小悬浮窗）\n\n它做什么：标记页面上要修改的位置、框选区域、记录当前页面，合成一段可以直接发给 AI 的文字。\n怎么才算做好：\n- 选取元素：记录它的路径、文字、尺寸和样式\n- 区域截图：窗口先隐藏，拖动选择区域，保存为图片；装了浏览器扩展时使用真实截图，否则标注为伪截图\n- 当前页面：一次记录地址、标题、窗口大小、可见的标题和按钮文字、最近的报错，并保存整页截图\n- 复制文字：文字里带页面地址、窗口大小、元素、样式、修改说明和报错\n有什么限制：伪截图里跨域的图片和字体显示为空白\n进度：已完成\n\n### 4.7 导入、导出、复制和示例\n\n它做什么：把计划书带进、带出页面，并提供示例。\n怎么才算做好：\n- 复制全文、复制提示词：浏览器不允许写入剪贴板时，弹出全文框，手动复制\n- 导出：得到 md 文件，文件名带日期时间\n- 导入：整份替换，可以撤销；识别不出格式时原文放入「未识别」\n- 查看示例：载入当前语言的示例，就是这份计划书本身\n有什么限制：导出再导入内容不变；没填的字段导出时写「待补：缺……」\n进度：已完成\n\n### 4.8 确认检查\n\n它做什么：统计还有几处待补，确认后把状态改成已通过。\n怎么才算做好：\n- 还有待补时点击确认：提示数量，状态不变\n- 没有待补时点击确认：状态变成已通过，计划书转为功能清单\n有什么限制：确认之前不开始制作\n进度：已完成\n\n### 4.9 桌面版和快捷键\n\n它做什么：不用先打开网站，按快捷键就在屏幕右下角弹出小窗口；网页里可以下载桌面版。\n怎么才算做好：\n- 桌面版是一个 exe：双击后打开小窗口并在托盘待命，快捷键 Ctrl+Alt+S 或点托盘图标再次打开\n- 托盘图标直接显示在任务栏上，不收进「^」里；点右键有「显示窗口」和「退出」\n- 小窗口贴在屏幕右下角，打开后切换标签、打开计划书都不改变大小\n- 再次打开时：已经有小窗口就把它拿到最前面（最小化的还原），没有才新开一个\n- 小窗口顶部在图标旁显示名称\n- 网页的「更多」里有「下载桌面版」，从自己的站点下载\n- 没有桌面版时，用 start.bat 启动，用 start-debug.bat 调试\n有什么限制：仅限 Windows；exe 没有数字签名，第一次运行系统会提示\n进度：进行中\n\n### 4.10 中英文\n\n它做什么：界面、模板、字段说明、示例、提示词都有中文和英文。\n怎么才算做好：\n- 界面语言用下拉选择，默认跟随浏览器\n- 新建的计划书按当前界面语言使用对应模板\n- 中文和英文的计划书都能读取，都能统计待补和进度\n有什么限制：界面文字缺少英文词条时构建失败\n进度：已完成\n\n### 4.11 AI 说明和命令行\n\n它做什么：让 AI 不打开网页就能检查计划书、更新进度、处理问题。\n怎么才算做好：\n- 检查：输出状态、待补位置、重名；没有待补时退出码为 0\n- 更新进度：按功能名写回计划书\n- AI 说明：包含整理计划书、更新进度、处理问题、默认解耦的架构\n进度：已完成\n\n### 4.12 扩展里的真实截图\n\n它做什么：装了浏览器扩展后，截图使用浏览器自带的真实截图。\n怎么才算做好：\n- 在 Chrome 里点击区域截图：附图标注为「截图」\n有什么限制：需要在真实的 Chrome 里确认一次\n进度：进行中\n\n## 5 要记住的信息\n\n- 计划书：一份 md，含状态；刷新后保留；可以有多个项目\n- 打开的标签：哪些项目开着、当前是哪个；刷新后保留\n- 文件夹授权和连接历史：连接过的文件夹；刷新后保留\n- 悬浮窗位置：窗口和按钮的位置；刷新后保留\n\n## 6 风格\n\n想要什么风格：黑白、简洁、白底，内容放在中间一条列里，窗口小的时候不拥挤\n有没有参考的东西：无\n绝对不要什么：不要打断操作的弹窗，不要出现必须懂代码才能理解的内容，不要使用虚线\n\n## 7 使用和要求\n\n用在哪里：手机和电脑的浏览器；桌面版和最近的文件夹仅限 Windows 电脑\n要哪几种语言：中文和英文\n图片、文字、声音从哪里来：图标用代码绘制\n要不要账号或登录：不需要\n还有什么要求：架构默认解耦，模块之间只通过接口通信\n"},"en":{"fields":{"1":[{"name":"What it is","purpose":"The thing being made, in one or two sentences","how":"A timer that counts 25 minutes of work and 5 minutes of rest, over and over"},{"name":"Who it is for","purpose":"Who uses it, and when","how":"People who need to focus, sitting at a computer"},{"name":"What they get from it","purpose":"The result after using it","how":"They know how many rounds they focused today"}],"2":[{"name":"Way of using","purpose":"One line each: the user does something → sees something → does the next thing","how":"Start a round: click Start → see the countdown → hear a sound when time is up"}],"3":[{"name":"What this page is for","purpose":"What the user does here","how":"Watch the countdown, start or pause it"},{"name":"What is on the page","purpose":"One line per item: name: what it is; what happens when it is clicked or touched","how":"Start button: starts the countdown; turns into Pause"},{"name":"How the user gets here","purpose":"Where the user comes from","how":"It is the first thing they see"}],"4":[{"name":"What it does","purpose":"What this one thing is, in one sentence","how":"Counts down the set number of minutes"},{"name":"Done when","purpose":"One line per situation: a situation: what should happen","how":"Set 25 minutes and click Start: it drops by one each second and alerts at 0"},{"name":"Limits","purpose":"Number ranges and what must not happen","how":"Minutes must be from 1 to 120"},{"name":"Progress","purpose":"Not started, In progress or Done; the AI updates it when finished","how":"Not started"},{"name":"Issues","purpose":"Problems found while building, one per line; marked \"Fixed\" once repaired","how":"The number keeps counting after Pause"}],"5":[{"name":"Information","purpose":"One per line: name: what it contains; whether it is kept for next time","how":"Settings: work minutes, rest minutes; kept"}],"6":[{"name":"Style you want","purpose":"Style, colours, mood","how":"White background, simple, like a notebook"},{"name":"Anything to refer to","purpose":"A product or look to refer to; a name is enough","how":"Like the timer that comes with the system"},{"name":"Must not have","purpose":"Content that must never appear","how":"No ads, no pop-ups that interrupt"}],"7":[{"name":"Where it is used","purpose":"Phone, computer, web, game console or something else","how":"Phone and computer"},{"name":"Which languages","purpose":"The languages the interface needs","how":"Chinese and English"},{"name":"Where images, texts and sounds come from","purpose":"Who supplies them, or the AI draws or writes them","how":"A free sound effect; the AI draws the icon"},{"name":"Accounts or sign-in","purpose":"Whether users have to register","how":"Not needed"},{"name":"Anything else","purpose":"Other additions","how":"None"}]},"planTemplate":"# Plan: 〈Project name〉\r\n\r\nStatus: Draft　　Updated: 〈date〉\r\n\r\n## 1 What it is\r\n\r\nWhat it is:\r\nWho it is for:\r\nWhat they get from it:\r\n\r\n## 2 How it is used\r\n\r\n〈One line per way of using it: the user does something → sees something → does the next thing〉\r\n\r\n## 3 Pages\r\n\r\n### 3.1 〈Page name〉\r\n\r\nWhat this page is for:\r\nWhat is on the page:\r\n- 〈Name of a thing〉: what it is; what happens when it is clicked or touched\r\nHow the user gets here:\r\n\r\n## 4 Features\r\n\r\n### 4.1 〈Feature name〉\r\n\r\nWhat it does:\r\nDone when:\r\n- 〈A situation〉: what should happen\r\nLimits:\r\nProgress: Not started\r\n\r\n## 5 Information to remember\r\n\r\n- 〈Name of the information〉: what it contains; whether it should still be there next time\r\n\r\n## 6 Style\r\n\r\nStyle you want:\r\nAnything to refer to:\r\nMust not have:\r\n\r\n## 7 Use and requirements\r\n\r\nWhere it is used:\r\nWhich languages:\r\nWhere images, texts and sounds come from:\r\nAccounts or sign-in:\r\nAnything else:\r\n\r\n## Original description\r\n\r\n〈When the AI fills this in, it puts your first words here, unchanged〉\r\n\r\n---\r\n\r\nAnything missing is written in place as \"TBD: what is missing\". There is no separate list.\r\n","changeTemplate":"# Change: 〈One-line title〉\n\nStatus: In progress　　Updated: 〈date〉\n\nType: Bug / Feature / Tweak\nWhich screen or feature: 〈Only the level you know〉\nWhat I see:\nWhat I want:\nHow it happens:\nSimilar cases checked: Yes\nRecord: 〈The AI puts your original words and where they map to in the plan here〉\n\n---\n\nApproved = the AI has mapped the change onto the plan and filled the gaps, and you have confirmed it. Changes are made only after that.\n","example":"# Plan: Prompt plan helper\n\nStatus: In progress　　Updated: 2026-10-15\n\n## 1 What it is\n\nWhat it is: A writing template for the plan of a new project. The plan is filled in on a page, an AI builds from it, and progress and issues can be checked at any time while it is built.\nWho it is for: People who build things with an AI and do not need to know code; the thing may be a website, an app, a game or something else.\nWhat they get from it: A plan an AI can follow directly, and a feature list that is kept up to date once building starts.\n\n## 2 How it is used\n\nWrite the plan: give the idea to the AI → the AI writes the plan → read and edit it on the page → once nothing is TBD and it is confirmed, building starts\nFill it in yourself: start a blank plan or view the example → click each block and follow the hints in the box → fill in what is TBD → confirm\nCheck progress: open the feature list → see the progress of each feature and its open issues → progress updates by itself when the AI finishes a feature\nReport an issue: in the feature list click the \"+\" next to a feature → write the issue in the small window, type @ to switch feature → the AI reads it and fixes it\nFind a folder: press the desktop shortcut → a small window opens at the bottom right of the screen listing recent folders → copy the path to open it in a command line, or open its plan\nMark what to change: open the small window on the page being built → pick an element, select a region or record the current page → write one line → copy it to the AI\n\n## 3 Pages\n\n### 3.1 Plan page\n\nWhat this page is for: Before work starts it is the plan; once confirmed it becomes the feature list. View and edit the content, and see the progress and issues of each feature.\nWhat is on the page:\n- Tabs: one per open project, which can be closed and added; the desktop version has an extra \"Recent\" tab\n- Project status or feature list: what each feature does, its progress and open issues; once confirmed each feature has a \"+\" for writing an issue\n- Each block of content: click it to turn it into a large box, click outside to save; the box shows what the block should say, with an example\n- Count of items still to fill in: click to jump to the next one\n- Confirm and start: confirms once nothing is TBD\n- Language: a drop-down to choose 中文 or English\n- More: contents, copy everything, export, view the example, new, import, connect a folder, download the desktop version\nHow the user gets here: opening the web page, or \"Open plan\" for a folder under \"Recent\"\n\n### 3.2 Recent\n\nWhat this page is for: Lists the recently used folders, with one click to open the plan or copy the path.\nWhat is on the page:\n- Folders in use: those with recent activity, marked \"In use\"\n- Recent and connected folders: each with its full path and progress\n- Open plan: opens it in a new tab\n- Copy path: copies the full path, with \"Handy for opening a CLI\" beside it\n- Choose another folder: opens the system folder picker\nHow the user gets here: the desktop shortcut, or the \"Recent\" tab on the plan page\n\n### 3.3 Mark what to change (small floating window)\n\nWhat this page is for: Marks what to change on the page being built and produces text that can be sent straight to an AI.\nWhat is on the page:\n- Pick an element: click an element on the page to record its position, text and styles\n- Region screenshot: select a region on the page and save it as an image\n- Current page: records the address, title, window size, visible headings and buttons in one click and saves a screenshot of the whole view\n- Change description: what needs to change\n- Copy text, Copy screenshot: copy them out and send them to the AI\nHow the user gets here: the chip button on the page being built, or Alt+Shift+S\n\n## 4 Features\n\n### 4.1 View and edit\n\nWhat it does: Shows the plan as a readable page; clicking any block edits it in place, and it can be changed at any time.\nDone when:\n- Click a block, edit it, click outside: it is saved and shown\n- Add a page or feature: enter a name; an empty or duplicate name is rejected; on success a set of empty fields appears\n- Delete a page or feature: it can be undone\n- Edit a confirmed plan: the status goes back to In progress\nLimits: page and feature names are unique; numbers only grow and are never renumbered\nProgress: Done\n\n### 4.2 Project status and feature list\n\nWhat it does: Shows what each feature does and how far it is; once confirmed the plan turns into a feature list where issues can be recorded under a feature.\nDone when:\n- A feature block has a progress line: shown as Not started, In progress or Done, with a count of each\n- The AI or another editor changes the plan file: the page updates within a few seconds without a refresh\n- Click a progress label: it cycles through the three and is written back to the plan\n- After confirmation: the top becomes \"Feature list\" and the sections are collapsed by default\nLimits: a feature without a progress line counts as Not started\nProgress: Done\n\n### 4.3 Report an issue\n\nWhat it does: Records an issue under a feature in the feature list; the AI reads it and fixes it, and it is then marked \"Fixed\".\nDone when:\n- Click the \"+\" next to a feature: a small window opens with that feature selected; typing @ switches to another feature\n- Add: the issue is written under \"Issues\" in that feature block, with the date\n- Fixed: clicking it prefixes the issue with \"Fixed:\" and removes it from the open list\n- Delete: it can be undone\nLimits: an issue is text only, without pictures\nProgress: Done\n\n### 4.4 Tabs\n\nWhat it does: Several projects are open in one window and switched with tabs; the desktop version has an extra \"Recent\" tab.\nDone when:\n- \"Open plan\" under \"Recent\": opens a new tab without replacing another\n- Close a tab: nothing is lost, and it can be reopened later from \"More\"\n- Refresh the page: the open tabs and the current tab are kept\nLimits: when the tabs do not fit they scroll sideways and do not wrap\nProgress: Done\n\n### 4.5 Recent folders\n\nWhat it does: Lists the recently used folders so they need not be looked up by hand; copying the path makes it easy to open in a command line.\nDone when:\n- Opened with the desktop shortcut: recently used folders come first and one click opens their plan\n- Each folder has \"Copy path\", with \"Handy for opening a CLI\" beside it\n- The plan is changed on the page: it is saved into the folder; it is changed in the folder: it is read into the page; changed in both: a dialog asks which to keep\nLimits: \"In use\" is inferred from recent activity and is not necessarily the current window; without the desktop version the browser's own folder picker is used, which only works in Chrome and Edge on a computer\nProgress: Done\n\n### 4.6 Mark what to change (small floating window)\n\nWhat it does: Marks what to change on a page, selects a region and records the current page, and produces text that can be sent straight to an AI.\nDone when:\n- Pick an element: its path, text, size and styles are recorded\n- Region screenshot: the window hides first, a region is dragged out and saved as an image; with the browser extension a real screenshot is used, otherwise it is labelled as a pseudo screenshot\n- Current page: the address, title, window size, visible headings and button text and recent errors are recorded in one click, together with a screenshot of the whole view\n- Copy text: the text carries the page address, window size, element, styles, change description and errors\nLimits: cross-origin images and fonts appear blank in a pseudo screenshot\nProgress: Done\n\n### 4.7 Import, export, copy and example\n\nWhat it does: Brings the plan into and out of the page, and provides an example.\nDone when:\n- Copy everything, copy prompt: when the browser does not allow writing to the clipboard, a box with the full text opens for copying by hand\n- Export: gives a md file whose name carries the date and time\n- Import: replaces the whole plan and can be undone; when the format is not recognised the original text goes under \"Not recognised\"\n- View example: loads the example in the current language, which is this plan itself\nLimits: export followed by import gives the same content; fields left empty are written as \"TBD: missing ...\" on export\nProgress: Done\n\n### 4.8 Confirmation check\n\nWhat it does: Counts what is still TBD and, once confirmed, changes the status to approved.\nDone when:\n- Confirm while items remain to fill in: the count is shown and the status stays\n- Confirm with nothing left to fill in: the status becomes Approved and the plan turns into the feature list\nLimits: building does not start before confirmation\nProgress: Done\n\n### 4.9 Desktop version and shortcut\n\nWhat it does: A shortcut opens a small window at the bottom right of the screen without opening a website first; the desktop version can be downloaded from the page.\nDone when:\n- The desktop version is one exe: after a double click it waits in the tray, and Ctrl+Alt+S opens the small window\n- The small window sits at the bottom right of the screen\n- \"More\" on the page has \"Download the desktop version\", served from the site itself\n- Without the desktop version, start.bat starts it and start-debug.bat debugs it\nLimits: Windows only; the exe is not digitally signed, so the system warns the first time it runs\nProgress: In progress\n\n### 4.10 Chinese and English\n\nWhat it does: The interface, templates, field guide, examples and prompts all exist in Chinese and English.\nDone when:\n- The interface language is a drop-down and defaults to the browser language\n- A new plan uses the template of the current interface language\n- Chinese and English plans can both be read, with TBD and progress counted\nLimits: the build fails when an interface string has no English entry\nProgress: Done\n\n### 4.11 AI instructions and command line\n\nWhat it does: Lets an AI check the plan, update progress and handle issues without opening the page.\nDone when:\n- Check: prints the status, where things are TBD and duplicate names; the exit code is 0 when nothing is TBD\n- Update progress: writes it back to the plan by feature name\n- AI instructions: cover organising the plan, updating progress, handling issues and a decoupled architecture by default\nProgress: Done\n\n### 4.12 Real screenshots in the extension\n\nWhat it does: With the browser extension installed, screenshots use the browser's own real capture.\nDone when:\n- Region screenshot in Chrome: the picture is labelled \"Screenshot\"\nLimits: needs to be confirmed once in a real Chrome\nProgress: In progress\n\n## 5 Information to remember\n\n- Plan: one md including its status; kept after a refresh; there can be several projects\n- Open tabs: which projects are open and which is current; kept after a refresh\n- Folder permission and connection history: folders that were connected; kept after a refresh\n- Floating window position: the position of the window and the button; kept after a refresh\n\n## 6 Style\n\nStyle you want: black and white, simple, white background, content in one centred column, uncrowded when the window is small\nAnything to refer to: none\nMust not have: no pop-ups that interrupt, nothing that needs code knowledge to understand, no dashed lines\n\n## 7 Use and requirements\n\nWhere it is used: browsers on phone and computer; the desktop version and recent folders are for Windows computers only\nWhich languages: Chinese and English\nWhere images, texts and sounds come from: the icon is drawn in code\nAccounts or sign-in: not needed\nAnything else: the architecture is decoupled by default, with modules communicating only through interfaces\n"}};
const CSS = ":host {\n  all: initial;\n  display: block;\n  color-scheme: only light;\n  --paper: #ffffff;\n  --ink: #000000;\n  --muted: #5f5f5f;\n  --line: #d4d4d4;\n  --soft: #f6f6f6;\n  --hover: #ececec;\n  --z-pop: 60;\n  --z-modal: 40;\n  --z-toast: 50;\n  font-family: \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", sans-serif;\n}\n*, *::before, *::after { box-sizing: border-box; }\n\n.app {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background: var(--paper);\n  color: var(--ink);\n  font-size: 16px;\n  line-height: 1.65;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  overflow: hidden;\n}\n.app textarea, .app input { -webkit-user-select: text; user-select: text; }\n.app button { font: inherit; color: inherit; }\n.app :focus { outline: none; }\n.app :focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }\n@media (max-width: 400px) { .app { font-size: 14.5px; } }\n@media (max-width: 320px) { .app { font-size: 13px; } }\n\n/* 悬浮窗 */\n.win {\n  position: fixed;\n  z-index: 2147483000;\n  width: 19em;\n  max-width: calc(100vw - 1em);\n  max-height: calc(100vh - 1em);\n  overflow-y: auto;\n  font-size: 15px;\n  background: var(--paper);\n  border: 2px solid var(--ink);\n  border-radius: 0.7em;\n  overflow: hidden;\n}\n.win .app { font-size: inherit; height: auto; }\n.fb-body { padding: 0.5em 0.8em 0.7em; }\n.fb-body .row { margin-top: 0.4em; }\n.fb-body textarea.in { margin-top: 0.5em; }\n.chipline img.shot { width: 3.2em; height: 2.2em; object-fit: cover; border-radius: 0.3em; margin-right: 0.5em; flex: none; }\n@media (max-width: 400px) { .win { font-size: 14px; } }\n@media (max-width: 320px) { .win { font-size: 12.5px; } }\n.fab {\n  position: fixed;\n  z-index: 2147483000;\n  width: 54px;\n  height: 54px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  touch-action: none;\n}\n.fab svg { display: block; width: 100%; height: 100%; }\n\n/* 顶栏：一行，内容和正文同一条中心列 */\n.head { flex: none; border-bottom: 1px solid var(--line); background: var(--paper); }\n.head .in { display: flex; align-items: center; max-width: 46em; margin: 0 auto; padding: 0.45em 0.9em; }\n.head .in.drag { cursor: grab; touch-action: none; }\n.head .in > * + * { margin-left: 0.6em; }\n.brand { display: flex; align-items: center; flex: none; font-weight: 700; }\n.logo { display: block; width: 1.9em; height: 1.9em; margin-right: 0.5em; }\n.logo svg { display: block; width: 100%; height: 100%; }\n.tabs { display: flex; flex: none; }\n.tabs > * + * { margin-left: 0.35em; }\n.sp { flex: 1; min-width: 0; }\n.x { border: 0; background: transparent; width: 2em; height: 2em; line-height: 1; cursor: pointer; border-radius: 0.4em; font-size: 1em; flex: none; }\n.x:hover { background: var(--hover); }\n.x.more { font-size: 1.3em; font-weight: 700; }\n\n.chip { flex: none; border: 1px solid var(--line); background: var(--paper); border-radius: 2em; padding: 0.15em 0.9em; cursor: pointer; }\n.chip:hover { background: var(--hover); }\n.chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }\n.btn { border: 1px solid var(--ink); background: var(--paper); border-radius: 0.45em; padding: 0.2em 0.85em; cursor: pointer; }\n.btn:hover { background: var(--hover); }\n.btn.primary { background: var(--ink); color: var(--paper); }\n.btn.primary:hover { background: #2b2b2b; }\n.btn.sm { padding: 0 0.55em; font-size: 0.9em; }\n.btn:disabled { border-color: var(--line); color: var(--muted); cursor: default; background: var(--paper); }\n.link { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; }\n.muted { color: var(--muted); font-size: 0.9em; }\n\n/* 正文：永远是一条居中的列 */\n.body { flex: 1; min-height: 0; overflow-anchor: none; overflow-y: auto; overscroll-behavior: contain; }\n.col { max-width: 46em; margin: 0 auto; padding: 0.8em 0.9em 4em; }\n.empty { padding: 2em 0; }\n.empty p { margin: 0 0 1em; }\n.row, .opts, .thumbs, .addrow, .statusline { display: flex; flex-wrap: wrap; align-items: center; }\n.row > *, .opts > *, .thumbs > *, .addrow > *, .statusline > * { margin: 0 0.5em 0.5em 0; }\n.row { margin-top: 0.6em; }\n.row.tight { margin-top: 0.5em; }\n\n.doc h1 { margin: 0.2em 0 0.2em; font-size: 1.6em; line-height: 1.3; }\n.title { display: block; max-width: 100%; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.title:hover { text-decoration: underline; }\n.doc h1 .in { font-size: 1em; font-weight: 700; }\n.statusline { margin-top: 0.4em; }\n.state { font-weight: 700; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.5em; }\n.state.pass { background: var(--ink); color: var(--paper); }\n\n.sec { margin-top: 1.6em; border-top: 2px solid var(--ink); padding-top: 0.4em; }\n.sec-head { display: flex; align-items: center; }\n.sec-head h2 { flex: 1; margin: 0; font-size: 1.1em; line-height: 1.4; }\n.fold { border: 0; background: transparent; cursor: pointer; width: 2em; height: 2em; border-radius: 0.4em; flex: none; }\n.fold:hover { background: var(--hover); }\n.sec.closed .sec-body { display: none; }\n\n.box { margin-top: 0.4em; padding: 0.5em 0.65em; border: 1px solid transparent; border-radius: 0.55em; cursor: text; }\n.box:hover { background: var(--soft); border-color: var(--line); }\n.box:focus-visible { border-color: var(--ink); }\n.hint-note { color: var(--muted); }\n.hint-lines { margin: 0.2em 0 0; color: var(--muted); font: inherit; font-size: 0.9em; white-space: pre-wrap; overflow-wrap: anywhere; }\n.lines > * { margin: 0.2em 0; }\n.kv { overflow-wrap: anywhere; }\n.li { display: flex; align-items: flex-start; }\n.li .mk { flex: none; color: var(--muted); min-width: 1.1em; text-align: right; margin-right: 0.45em; }\n.li .tx { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.lb { color: var(--muted); }\n\n.blk { margin-top: 0.9em; padding: 0.35em 0.7em 0.5em; border: 1px solid var(--ink); border-radius: 0.65em; }\n.blk-head { display: flex; align-items: center; }\n.blk-title { flex: 1; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.blk-title .no { color: var(--muted); margin-right: 0.5em; font-weight: 400; }\n.blk-head .in { flex: 1; width: auto; }\n\n.pend { background: var(--ink); color: var(--paper); border-radius: 0.25em; padding: 0 0.3em; }\n.pend.flash { outline: 3px solid var(--ink); outline-offset: 2px; }\n.ph { background: var(--hover); border-radius: 0.25em; padding: 0 0.25em; }\n.ref { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; font: inherit; }\n\n/* 填写 */\ntextarea.in, input.in {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  border: 1px solid var(--line);\n  border-radius: 0.5em;\n  background: var(--paper);\n  color: var(--ink);\n  font: inherit;\n  padding: 0.45em 0.65em;\n  resize: none;\n  overflow: hidden;\n}\ntextarea.in:focus, input.in:focus { border-color: var(--ink); }\ntextarea.in.big { min-height: 9em; line-height: 1.7; }\n.addslot { margin: 0.7em 0 0.2em; }\n.addrow input.in { flex: 1 1 10em; width: auto; }\n.err { font-weight: 700; margin: 0.2em 0; }\n.err::before { content: \"× \"; }\n.hint { color: var(--muted); font-size: 0.9em; margin: 0.4em 0; overflow-wrap: anywhere; }\n.hint.pad { padding: 0.5em; }\n.p { margin: 0.4em 0; overflow-wrap: anywhere; }\n\n.field { margin: 0.9em 0; }\n.field > .fl { font-weight: 700; margin-bottom: 0.2em; }\n.opts { margin-bottom: 0.2em; }\n.chipline { display: flex; align-items: center; margin: 0.3em 0; padding: 0.15em 0.2em 0.15em 0.65em; border: 1px solid var(--line); border-radius: 0.5em; }\n.chipline span { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.thumbs { margin-top: 0.5em; }\n.thumb { position: relative; border: 1px solid var(--line); border-radius: 0.5em; padding: 0.25em; }\n.thumb img { display: block; width: 5.5em; height: 5.5em; object-fit: cover; border-radius: 0.3em; }\n.thumb .kind { display: block; text-align: center; font-size: 0.8em; color: var(--muted); }\n.thumb .btn { position: absolute; top: -0.5em; right: -0.5em; padding: 0 0.4em; background: var(--paper); }\n.list-title { margin: 1.6em 0 0.2em; padding-top: 0.4em; border-top: 2px solid var(--ink); font-size: 1.1em; }\n.card { border: 1px solid var(--line); border-radius: 0.6em; padding: 0.4em 0.4em 0.5em 0.8em; margin: 0.6em 0; }\n.card .when { flex: 1; color: var(--muted); font-size: 0.9em; }\n.card pre { margin: 0.2em 0 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }\n.pos-list { border: 1px solid var(--line); border-radius: 0.5em; max-height: 14em; overflow-y: auto; overscroll-behavior: contain; margin-top: 0.4em; }\n.pos-item { display: block; width: 100%; text-align: left; border: 0; border-bottom: 1px solid var(--line); background: var(--paper); padding: 0.4em 0.65em; cursor: pointer; overflow-wrap: anywhere; }\n.pos-item:last-child { border-bottom: 0; }\n.pos-item:hover { background: var(--hover); }\n\n/* 浮层 */\n.pop { position: fixed; z-index: var(--z-pop); background: var(--paper); border: 1px solid var(--ink); border-radius: 0.55em; min-width: 11em; max-width: calc(100vw - 1em); max-height: 70vh; overflow-y: auto; overscroll-behavior: contain; padding: 0.25em; }\n.pop button { display: block; width: 100%; text-align: left; border: 0; background: var(--paper); border-radius: 0.4em; padding: 0.4em 0.75em; cursor: pointer; overflow-wrap: anywhere; }\n.pop button:hover { background: var(--hover); }\n.pop button.on { background: var(--ink); color: var(--paper); }\n.pop button:disabled { color: var(--muted); cursor: default; }\n.pop hr { border: 0; border-top: 1px solid var(--line); margin: 0.25em 0; }\n.pop .row2 { display: flex; align-items: stretch; }\n.pop .row2 button:first-child { flex: 1; }\n.pop .row2 .x { width: 2.2em; flex: none; text-align: center; }\n\n.mask { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: var(--z-modal); background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 0.8em; }\n.modal { display: flex; flex-direction: column; width: 100%; max-width: 38em; max-height: 100%; background: var(--paper); border: 2px solid var(--ink); border-radius: 0.7em; }\n.modal-head { flex: none; display: flex; align-items: center; padding: 0.4em 0.4em 0.4em 0.9em; border-bottom: 1px solid var(--line); }\n.modal-head h2 { flex: 1; margin: 0; font-size: 1.05em; }\n.modal-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0.8em 0.9em; }\n.modal-foot { flex: none; display: flex; flex-wrap: wrap; justify-content: flex-end; padding: 0.6em 0.4em 0.1em 0.9em; border-top: 1px solid var(--line); background: var(--paper); }\n.modal-foot > * { margin: 0 0.5em 0.5em 0; }\n.modal textarea.in.big { overflow-y: auto; }\n\n.toast { position: absolute; z-index: var(--z-toast); left: 0.8em; right: 0.8em; bottom: 0.8em; margin: 0 auto; max-width: 30em; display: flex; align-items: center; background: var(--ink); color: var(--paper); border-radius: 0.55em; padding: 0.45em 0.5em 0.45em 0.85em; cursor: pointer; }\n.toast span { flex: 1; overflow-wrap: anywhere; }\n.toast .btn { background: var(--paper); color: var(--ink); border-color: var(--paper); flex: none; margin-left: 0.6em; }\n\n/* 滚动条：黑色细条，没有箭头 */\n.body::-webkit-scrollbar, .pos-list::-webkit-scrollbar, .modal-body::-webkit-scrollbar, .pop::-webkit-scrollbar { width: 0.6em; height: 0.6em; }\n.body::-webkit-scrollbar-track, .pos-list::-webkit-scrollbar-track, .modal-body::-webkit-scrollbar-track, .pop::-webkit-scrollbar-track { background: var(--paper); }\n.body::-webkit-scrollbar-thumb, .pos-list::-webkit-scrollbar-thumb, .modal-body::-webkit-scrollbar-thumb, .pop::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 1em; border: 0.15em solid var(--paper); }\n.body::-webkit-scrollbar-button, .pos-list::-webkit-scrollbar-button, .modal-body::-webkit-scrollbar-button, .pop::-webkit-scrollbar-button { display: none; width: 0; height: 0; }\n@supports not selector(::-webkit-scrollbar) {\n  .body, .pos-list, .modal-body, .pop { scrollbar-width: thin; scrollbar-color: #000000 #ffffff; }\n}\n\n/* 项目情况 */\n.status-box { margin-top: 1em; border: 1px solid var(--ink); border-radius: 0.65em; padding: 0.5em 0.8em 0.6em; }\n.status-head { display: flex; align-items: baseline; flex-wrap: wrap; }\n.status-head h2 { margin: 0 0.8em 0 0; font-size: 1.05em; }\n.bar-track { display: flex; height: 0.5em; margin: 0.4em 0 0.3em; border: 1px solid var(--ink); border-radius: 1em; overflow: hidden; background: var(--paper); }\n.bar-done { background: var(--ink); }\n.bar-doing { background: #8a8a8a; }\n.status-row { display: flex; align-items: center; padding: 0.25em 0; border-top: 1px solid var(--line); }\n.bar-track + .status-row { border-top: 0; }\n.status-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.status-name .muted { display: block; }\n.prog { flex: none; margin-left: 0.6em; min-width: 4.4em; border: 1px solid var(--ink); border-radius: 2em; padding: 0 0.7em; background: var(--paper); cursor: pointer; }\n.prog.done { background: var(--ink); color: var(--paper); }\n.prog.doing { font-weight: 700; }\n.prog.todo { border-color: var(--line); color: var(--muted); }\n\n/* 文件夹列表 */\n.folders .ftitle { margin: 1em 0 0.3em; font-size: 0.95em; }\n.frow { display: flex; align-items: flex-start; border: 1px solid var(--line); border-radius: 0.6em; padding: 0.5em 0.6em; margin: 0.4em 0; }\n.frow.cur { border-color: var(--ink); }\n.finfo { flex: 1; min-width: 0; }\n.fname { font-weight: 700; overflow-wrap: anywhere; }\n.badge { margin-left: 0.5em; font-weight: 400; font-size: 0.8em; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.35em; }\n.fpath { color: var(--muted); font-size: 0.85em; overflow-wrap: anywhere; }\n.factions { flex: none; display: flex; flex-direction: column; margin-left: 0.6em; }\n.factions .btn { margin-bottom: 0.3em; }\n\n/* 标签 */\n.head .tabs-in { padding-top: 0; padding-bottom: 0.4em; }\n.tabbar { display: flex; align-items: center; flex: 1; min-width: 0; overflow-x: auto; overscroll-behavior: contain; scrollbar-width: none; }\n.tabbar::-webkit-scrollbar { display: none; }\n.tabbar > * { flex: none; margin-right: 0.35em; }\n.tab { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 0.5em; background: var(--paper); }\n.tab.on { border-color: var(--ink); background: var(--ink); color: var(--paper); }\n.tab-name { border: 0; background: transparent; padding: 0.1em 0.2em 0.1em 0.7em; cursor: pointer; text-align: left; }\n.tab-x { border: 0; background: transparent; padding: 0.1em 0.55em 0.1em 0.3em; cursor: pointer; opacity: 0.7; }\n.tab-x:hover { opacity: 1; }\n.chip.add { padding: 0.1em 0.7em; }\n.lang { flex: none; border: 1px solid var(--line); background: var(--paper); border-radius: 0.45em; padding: 0.1em 0.6em; cursor: pointer; }\n.lang:hover { background: var(--hover); }\n.menu-link { display: block; padding: 0.4em 0.75em; color: var(--ink); text-decoration: none; border-radius: 0.4em; }\n.menu-link:hover { background: var(--hover); }\n\n/* 功能清单：问题和小弹窗 */\n.modal.small { max-width: 24em; }\n.status-head .btn { margin-left: auto; }\n.issue { display: flex; align-items: flex-start; margin: 0.2em 0 0.2em 1.2em; padding: 0.25em 0.5em; background: var(--soft); border-radius: 0.5em; }\n.issue-text { flex: 1; min-width: 0; margin: 0 0.5em; overflow-wrap: anywhere; }\n.status-row .btn.sm { flex: none; margin-left: 0.5em; }\n.target { max-width: 100%; text-align: left; overflow-wrap: anywhere; }\n\n/* 小悬浮窗里的按钮更紧凑，三个动作放在一行 */\n.fb .btn { padding: 0.15em 0.5em; font-size: 0.92em; }\n.fb .row > * { margin-right: 0.35em; }\n";
const ICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><rect width=\"512\" height=\"512\" rx=\"113\" fill=\"#e5322d\"/><g transform=\"translate(256 256) rotate(-20) scale(1.0067)\"><path d=\"M187.8 0.0L188.0 2.4L188.2 4.9L188.3 7.3L188.3 9.8L188.2 12.2L188.0 14.7L187.8 17.1L187.5 19.5L187.1 22.0L186.6 24.4L186.1 26.8L185.5 29.2L184.8 31.6L184.0 34.0L183.1 36.4L182.2 38.7L181.2 41.1L180.1 43.4L179.0 45.7L177.7 48.0L176.4 50.2L175.1 52.5L173.6 54.7L172.1 56.8L170.6 59.0L169.0 61.1L167.3 63.2L165.5 65.3L163.7 67.3L161.9 69.3L159.9 71.3L158.0 73.2L156.0 75.1L153.9 77.0L151.8 78.8L149.6 80.6L147.4 82.4L145.1 84.1L142.9 85.8L140.5 87.4L138.2 89.1L135.8 90.7L133.3 92.2L130.9 93.7L128.4 95.2L125.8 96.6L123.3 98.0L120.7 99.4L118.1 100.7L115.5 102.0L112.8 103.3L110.1 104.5L107.4 105.7L104.7 106.9L102.0 108.0L99.2 109.1L96.5 110.2L93.7 111.2L90.9 112.2L88.1 113.2L85.3 114.1L82.5 115.0L79.6 115.9L76.8 116.7L73.9 117.5L71.0 118.3L68.1 119.0L65.2 119.7L62.3 120.4L59.4 121.1L56.5 121.7L53.6 122.3L50.7 122.9L47.7 123.4L44.8 123.9L41.8 124.4L38.9 124.9L35.9 125.3L32.9 125.7L30.0 126.0L27.0 126.4L24.0 126.7L21.0 127.0L18.0 127.2L15.0 127.4L12.0 127.6L9.0 127.7L6.0 127.8L3.0 127.9L0.0 128.0L-3.0 128.0L-6.0 128.0L-9.0 127.9L-12.1 127.8L-15.1 127.7L-18.1 127.6L-21.1 127.4L-24.1 127.1L-27.1 126.9L-30.1 126.6L-33.1 126.3L-36.1 125.9L-39.1 125.5L-42.0 125.0L-45.0 124.5L-48.0 124.0L-50.9 123.4L-53.8 122.8L-56.7 122.2L-59.6 121.5L-62.5 120.8L-65.4 120.0L-68.3 119.2L-71.1 118.4L-73.9 117.5L-76.7 116.6L-79.5 115.7L-82.2 114.7L-84.9 113.6L-87.6 112.6L-90.3 111.5L-92.9 110.3L-95.6 109.1L-98.1 107.9L-100.7 106.6L-103.2 105.4L-105.7 104.0L-108.2 102.7L-110.6 101.3L-112.9 99.8L-115.3 98.4L-117.6 96.9L-119.9 95.3L-122.1 93.8L-124.3 92.2L-126.4 90.5L-128.5 88.9L-130.6 87.2L-132.6 85.5L-134.6 83.7L-136.5 82.0L-138.4 80.2L-140.3 78.4L-142.1 76.5L-143.8 74.7L-145.5 72.8L-147.2 70.9L-148.8 69.0L-150.4 67.0L-151.9 65.1L-153.4 63.1L-154.9 61.1L-156.3 59.0L-157.6 57.0L-158.9 55.0L-160.2 52.9L-161.4 50.8L-162.6 48.7L-163.7 46.6L-164.8 44.5L-165.8 42.3L-166.8 40.2L-167.8 38.0L-168.7 35.9L-169.6 33.7L-170.4 31.5L-171.1 29.3L-171.9 27.1L-172.6 24.9L-173.2 22.6L-173.8 20.4L-174.4 18.2L-174.9 15.9L-175.4 13.7L-175.8 11.4L-176.2 9.1L-176.5 6.9L-176.8 4.6L-177.1 2.3L-177.3 0.0L-177.4 -2.3L-177.5 -4.6L-177.6 -6.9L-177.6 -9.2L-177.6 -11.5L-177.5 -13.8L-177.4 -16.2L-177.3 -18.5L-177.0 -20.8L-176.8 -23.1L-176.5 -25.4L-176.1 -27.8L-175.7 -30.1L-175.2 -32.4L-174.7 -34.7L-174.1 -37.0L-173.5 -39.3L-172.8 -41.6L-172.1 -43.9L-171.3 -46.2L-170.5 -48.5L-169.6 -50.8L-168.6 -53.1L-167.6 -55.3L-166.5 -57.6L-165.4 -59.8L-164.2 -62.0L-163.0 -64.3L-161.6 -66.4L-160.3 -68.6L-158.9 -70.8L-157.4 -72.9L-155.8 -75.0L-154.2 -77.1L-152.6 -79.2L-150.8 -81.3L-149.1 -83.3L-147.2 -85.3L-145.3 -87.3L-143.4 -89.2L-141.3 -91.1L-139.3 -93.0L-137.1 -94.8L-135.0 -96.6L-132.7 -98.4L-130.4 -100.2L-128.1 -101.9L-125.7 -103.5L-123.2 -105.1L-120.7 -106.7L-118.2 -108.2L-115.6 -109.7L-113.0 -111.2L-110.3 -112.6L-107.6 -113.9L-104.8 -115.2L-102.0 -116.5L-99.1 -117.7L-96.3 -118.8L-93.4 -119.9L-90.4 -121.0L-87.5 -122.0L-84.5 -122.9L-81.4 -123.8L-78.4 -124.7L-75.3 -125.4L-72.2 -126.2L-69.1 -126.9L-66.0 -127.5L-62.9 -128.1L-59.7 -128.6L-56.6 -129.1L-53.4 -129.5L-50.2 -129.9L-47.0 -130.2L-43.9 -130.5L-40.7 -130.7L-37.5 -130.8L-34.3 -131.0L-31.2 -131.0L-28.0 -131.1L-24.8 -131.0L-21.7 -131.0L-18.5 -130.9L-15.4 -130.7L-12.3 -130.5L-9.2 -130.3L-6.1 -130.0L-3.1 -129.7L-0.0 -129.3L3.0 -128.9L6.1 -128.5L9.0 -128.0L12.0 -127.5L15.0 -127.0L17.9 -126.4L20.8 -125.8L23.7 -125.2L26.6 -124.6L29.5 -123.9L32.3 -123.2L35.1 -122.5L37.9 -121.7L40.7 -120.9L43.4 -120.1L46.1 -119.3L48.8 -118.5L51.5 -117.6L54.2 -116.7L56.8 -115.8L59.5 -114.9L62.1 -113.9L64.7 -113.0L67.2 -112.0L69.8 -111.0L72.4 -110.0L74.9 -109.0L77.4 -107.9L79.9 -106.9L82.4 -105.8L84.8 -104.7L87.3 -103.6L89.7 -102.5L92.2 -101.3L94.6 -100.2L97.0 -99.0L99.4 -97.8L101.8 -96.6L104.1 -95.4L106.5 -94.1L108.9 -92.9L111.2 -91.6L113.5 -90.3L115.8 -88.9L118.1 -87.6L120.4 -86.2L122.7 -84.8L124.9 -83.4L127.1 -82.0L129.4 -80.5L131.6 -79.0L133.7 -77.5L135.9 -75.9L138.0 -74.4L140.2 -72.8L142.2 -71.2L144.3 -69.5L146.4 -67.8L148.4 -66.1L150.4 -64.4L152.3 -62.6L154.2 -60.8L156.1 -59.0L158.0 -57.1L159.8 -55.3L161.6 -53.4L163.3 -51.4L165.0 -49.4L166.7 -47.4L168.3 -45.4L169.8 -43.4L171.3 -41.3L172.8 -39.2L174.2 -37.0L175.5 -34.9L176.8 -32.7L178.0 -30.5L179.2 -28.2L180.3 -26.0L181.3 -23.7L182.3 -21.4L183.2 -19.1L184.0 -16.8L184.8 -14.4L185.4 -12.0L186.1 -9.6L186.6 -7.3L187.1 -4.8L187.5 -2.4Z\" fill=\"#e3a400\"/><path d=\"M174.6 0.0L174.9 2.3L175.0 4.5L175.1 6.8L175.1 9.1L175.0 11.4L174.9 13.6L174.7 15.9L174.4 18.2L174.0 20.4L173.6 22.7L173.1 24.9L172.5 27.2L171.8 29.4L171.1 31.6L170.3 33.8L169.4 36.0L168.5 38.2L167.5 40.4L166.4 42.5L165.3 44.6L164.1 46.7L162.8 48.8L161.5 50.8L160.1 52.9L158.6 54.9L157.1 56.8L155.6 58.8L153.9 60.7L152.3 62.6L150.5 64.4L148.7 66.3L146.9 68.1L145.0 69.8L143.1 71.6L141.1 73.3L139.1 75.0L137.1 76.6L135.0 78.2L132.9 79.8L130.7 81.3L128.5 82.8L126.3 84.3L124.0 85.7L121.7 87.2L119.4 88.5L117.0 89.9L114.6 91.2L112.2 92.4L109.8 93.7L107.4 94.9L104.9 96.1L102.4 97.2L99.9 98.3L97.4 99.4L94.9 100.5L92.3 101.5L89.7 102.5L87.1 103.4L84.5 104.3L81.9 105.2L79.3 106.1L76.7 106.9L74.0 107.8L71.4 108.5L68.7 109.3L66.0 110.0L63.4 110.7L60.7 111.4L58.0 112.0L55.3 112.6L52.6 113.2L49.8 113.8L47.1 114.3L44.4 114.8L41.6 115.3L38.9 115.7L36.2 116.1L33.4 116.5L30.6 116.9L27.9 117.2L25.1 117.5L22.3 117.8L19.5 118.1L16.8 118.3L14.0 118.5L11.2 118.6L8.4 118.8L5.6 118.9L2.8 119.0L0.0 119.0L-2.8 119.0L-5.6 119.0L-8.4 119.0L-11.2 118.9L-14.0 118.8L-16.8 118.6L-19.6 118.5L-22.4 118.2L-25.2 118.0L-28.0 117.7L-30.8 117.4L-33.6 117.1L-36.3 116.7L-39.1 116.3L-41.8 115.8L-44.6 115.3L-47.3 114.8L-50.1 114.2L-52.8 113.6L-55.5 113.0L-58.2 112.3L-60.8 111.6L-63.5 110.9L-66.1 110.1L-68.7 109.3L-71.3 108.5L-73.9 107.6L-76.5 106.6L-79.0 105.7L-81.5 104.7L-84.0 103.7L-86.4 102.6L-88.9 101.5L-91.3 100.4L-93.6 99.2L-96.0 98.0L-98.3 96.7L-100.6 95.5L-102.8 94.2L-105.0 92.8L-107.2 91.5L-109.4 90.1L-111.5 88.6L-113.5 87.2L-115.6 85.7L-117.6 84.2L-119.5 82.7L-121.4 81.1L-123.3 79.5L-125.2 77.9L-127.0 76.2L-128.7 74.6L-130.4 72.9L-132.1 71.2L-133.8 69.5L-135.3 67.7L-136.9 65.9L-138.4 64.1L-139.9 62.3L-141.3 60.5L-142.7 58.7L-144.0 56.8L-145.3 54.9L-146.6 53.0L-147.8 51.1L-149.0 49.2L-150.1 47.3L-151.2 45.3L-152.3 43.3L-153.3 41.4L-154.2 39.4L-155.2 37.4L-156.0 35.4L-156.9 33.4L-157.7 31.3L-158.4 29.3L-159.2 27.3L-159.8 25.2L-160.5 23.1L-161.1 21.1L-161.6 19.0L-162.2 16.9L-162.6 14.8L-163.1 12.7L-163.5 10.6L-163.8 8.5L-164.2 6.4L-164.4 4.3L-164.7 2.1L-164.9 0.0L-165.0 -2.1L-165.1 -4.3L-165.2 -6.4L-165.2 -8.6L-165.2 -10.7L-165.1 -12.9L-165.0 -15.0L-164.8 -17.2L-164.6 -19.3L-164.4 -21.5L-164.1 -23.7L-163.8 -25.8L-163.4 -28.0L-163.0 -30.1L-162.5 -32.3L-161.9 -34.4L-161.4 -36.6L-160.7 -38.7L-160.0 -40.9L-159.3 -43.0L-158.5 -45.1L-157.7 -47.2L-156.8 -49.4L-155.9 -51.5L-154.9 -53.6L-153.8 -55.6L-152.7 -57.7L-151.5 -59.8L-150.3 -61.8L-149.1 -63.8L-147.7 -65.8L-146.4 -67.8L-144.9 -69.8L-143.4 -71.7L-141.9 -73.7L-140.3 -75.6L-138.6 -77.5L-136.9 -79.3L-135.1 -81.2L-133.3 -83.0L-131.4 -84.7L-129.5 -86.5L-127.5 -88.2L-125.5 -89.9L-123.4 -91.5L-121.3 -93.1L-119.1 -94.7L-116.9 -96.3L-114.6 -97.8L-112.3 -99.2L-109.9 -100.7L-107.5 -102.0L-105.1 -103.4L-102.6 -104.7L-100.0 -105.9L-97.5 -107.1L-94.8 -108.3L-92.2 -109.4L-89.5 -110.5L-86.8 -111.5L-84.1 -112.5L-81.3 -113.4L-78.5 -114.3L-75.7 -115.1L-72.9 -115.9L-70.0 -116.7L-67.2 -117.4L-64.3 -118.0L-61.4 -118.6L-58.5 -119.1L-55.5 -119.6L-52.6 -120.0L-49.7 -120.4L-46.7 -120.8L-43.7 -121.1L-40.8 -121.3L-37.8 -121.5L-34.9 -121.7L-31.9 -121.8L-29.0 -121.9L-26.0 -121.9L-23.1 -121.9L-20.2 -121.8L-17.2 -121.7L-14.3 -121.6L-11.4 -121.4L-8.6 -121.2L-5.7 -120.9L-2.8 -120.6L-0.0 -120.3L2.8 -119.9L5.6 -119.5L8.4 -119.1L11.2 -118.6L13.9 -118.1L16.7 -117.6L19.4 -117.0L22.1 -116.5L24.7 -115.9L27.4 -115.2L30.0 -114.6L32.6 -113.9L35.2 -113.2L37.8 -112.5L40.4 -111.7L42.9 -110.9L45.4 -110.2L47.9 -109.4L50.4 -108.5L52.9 -107.7L55.3 -106.8L57.7 -106.0L60.1 -105.1L62.5 -104.2L64.9 -103.2L67.3 -102.3L69.6 -101.4L72.0 -100.4L74.3 -99.4L76.6 -98.4L78.9 -97.4L81.2 -96.4L83.5 -95.3L85.7 -94.2L88.0 -93.2L90.2 -92.1L92.4 -91.0L94.7 -89.8L96.9 -88.7L99.1 -87.5L101.2 -86.4L103.4 -85.2L105.6 -83.9L107.7 -82.7L109.8 -81.5L112.0 -80.2L114.1 -78.9L116.2 -77.6L118.2 -76.2L120.3 -74.9L122.3 -73.5L124.4 -72.1L126.4 -70.6L128.4 -69.2L130.3 -67.7L132.3 -66.2L134.2 -64.6L136.1 -63.1L138.0 -61.5L139.8 -59.9L141.7 -58.2L143.4 -56.6L145.2 -54.9L146.9 -53.1L148.6 -51.4L150.3 -49.6L151.9 -47.8L153.5 -46.0L155.0 -44.1L156.5 -42.2L157.9 -40.3L159.3 -38.4L160.7 -36.4L162.0 -34.4L163.2 -32.4L164.4 -30.4L165.5 -28.3L166.6 -26.3L167.6 -24.2L168.6 -22.0L169.5 -19.9L170.3 -17.8L171.1 -15.6L171.8 -13.4L172.5 -11.2L173.0 -9.0L173.5 -6.7L174.0 -4.5L174.3 -2.3Z\" fill=\"#ffd21f\"/><path d=\"M-131.7 -70.8L-129.5 -73.0L-127.3 -75.3L-125.1 -74.6L-122.9 -73.5L-120.7 -72.4L-118.5 -71.2L-116.4 -69.7L-114.2 -68.2L-112.0 -66.4L-109.8 -64.5L-107.6 -62.4L-105.4 -60.3L-103.2 -58.0L-101.0 -56.8L-98.8 -57.8L-96.6 -58.9L-94.4 -60.1L-92.2 -61.4L-90.0 -62.9L-87.8 -64.5L-85.6 -66.4L-83.4 -68.3L-81.2 -70.4L-79.0 -72.7L-76.8 -74.9L-74.6 -74.8L-72.4 -73.7L-70.3 -72.6L-68.1 -71.4L-65.9 -70.0L-63.7 -68.4L-61.5 -66.7L-59.3 -64.8L-57.1 -62.8L-54.9 -60.6L-52.7 -58.4L-50.5 -56.7L-48.3 -57.7L-46.1 -58.7L-43.9 -59.9L-41.7 -61.2L-39.5 -62.6L-37.3 -64.3L-35.1 -66.0L-32.9 -68.0L-30.7 -70.1L-28.5 -72.3L-26.3 -74.6L-24.1 -74.9L-22.0 -73.9L-19.8 -72.8L-17.6 -71.6L-15.4 -70.2L-13.2 -68.7L-11.0 -67.0L-8.8 -65.2L-6.6 -63.1L-4.4 -61.0L-2.2 -58.8L0.0 -56.5L2.2 -57.5L4.4 -58.6L6.6 -59.7L8.8 -61.0L11.0 -62.4L13.2 -64.0L15.4 -65.7L17.6 -67.7L19.8 -69.7L22.0 -71.9L24.1 -74.2L26.3 -75.1L28.5 -74.1L30.7 -73.0L32.9 -71.8L35.1 -70.5L37.3 -69.0L39.5 -67.3L41.7 -65.5L43.9 -63.5L46.1 -61.4L48.3 -59.1L50.5 -56.9L52.7 -57.3L54.9 -58.4L57.1 -59.5L59.3 -60.7L61.5 -62.1L63.7 -63.7L65.9 -65.4L68.1 -67.3L70.3 -69.4L72.4 -71.5L74.6 -73.8L76.8 -75.3L79.0 -74.2L81.2 -73.2L83.4 -72.0L85.6 -70.7L87.8 -69.2L90.0 -67.6L92.2 -65.8L94.4 -63.8L96.6 -61.7L98.8 -59.5L101.0 -57.3L103.2 -57.2L105.4 -58.2L107.6 -59.3L109.8 -60.5L112.0 -61.9L114.2 -63.4L116.4 -65.1L118.5 -67.0L120.7 -69.0L122.9 -71.2L125.1 -73.4L127.3 -75.4L129.5 -74.4L131.7 -73.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 -4.8L-129.5 -7.0L-127.3 -9.3L-125.1 -8.6L-122.9 -7.5L-120.7 -6.4L-118.5 -5.2L-116.4 -3.7L-114.2 -2.2L-112.0 -0.4L-109.8 1.5L-107.6 3.6L-105.4 5.7L-103.2 8.0L-101.0 9.2L-98.8 8.2L-96.6 7.1L-94.4 5.9L-92.2 4.6L-90.0 3.1L-87.8 1.5L-85.6 -0.4L-83.4 -2.3L-81.2 -4.4L-79.0 -6.7L-76.8 -8.9L-74.6 -8.8L-72.4 -7.7L-70.3 -6.6L-68.1 -5.4L-65.9 -4.0L-63.7 -2.4L-61.5 -0.7L-59.3 1.2L-57.1 3.2L-54.9 5.4L-52.7 7.6L-50.5 9.3L-48.3 8.3L-46.1 7.3L-43.9 6.1L-41.7 4.8L-39.5 3.4L-37.3 1.7L-35.1 -0.0L-32.9 -2.0L-30.7 -4.1L-28.5 -6.3L-26.3 -8.6L-24.1 -8.9L-22.0 -7.9L-19.8 -6.8L-17.6 -5.6L-15.4 -4.2L-13.2 -2.7L-11.0 -1.0L-8.8 0.8L-6.6 2.9L-4.4 5.0L-2.2 7.2L0.0 9.5L2.2 8.5L4.4 7.4L6.6 6.3L8.8 5.0L11.0 3.6L13.2 2.0L15.4 0.3L17.6 -1.7L19.8 -3.7L22.0 -5.9L24.1 -8.2L26.3 -9.1L28.5 -8.1L30.7 -7.0L32.9 -5.8L35.1 -4.5L37.3 -3.0L39.5 -1.3L41.7 0.5L43.9 2.5L46.1 4.6L48.3 6.9L50.5 9.1L52.7 8.7L54.9 7.6L57.1 6.5L59.3 5.3L61.5 3.9L63.7 2.3L65.9 0.6L68.1 -1.3L70.3 -3.4L72.4 -5.5L74.6 -7.8L76.8 -9.3L79.0 -8.2L81.2 -7.2L83.4 -6.0L85.6 -4.7L87.8 -3.2L90.0 -1.6L92.2 0.2L94.4 2.2L96.6 4.3L98.8 6.5L101.0 8.7L103.2 8.8L105.4 7.8L107.6 6.7L109.8 5.5L112.0 4.1L114.2 2.6L116.4 0.9L118.5 -1.0L120.7 -3.0L122.9 -5.2L125.1 -7.4L127.3 -9.4L129.5 -8.4L131.7 -7.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 61.2L-129.5 59.0L-127.3 56.7L-125.1 57.4L-122.9 58.5L-120.7 59.6L-118.5 60.8L-116.4 62.3L-114.2 63.8L-112.0 65.6L-109.8 67.5L-107.6 69.6L-105.4 71.7L-103.2 74.0L-101.0 75.2L-98.8 74.2L-96.6 73.1L-94.4 71.9L-92.2 70.6L-90.0 69.1L-87.8 67.5L-85.6 65.6L-83.4 63.7L-81.2 61.6L-79.0 59.3L-76.8 57.1L-74.6 57.2L-72.4 58.3L-70.3 59.4L-68.1 60.6L-65.9 62.0L-63.7 63.6L-61.5 65.3L-59.3 67.2L-57.1 69.2L-54.9 71.4L-52.7 73.6L-50.5 75.3L-48.3 74.3L-46.1 73.3L-43.9 72.1L-41.7 70.8L-39.5 69.4L-37.3 67.7L-35.1 66.0L-32.9 64.0L-30.7 61.9L-28.5 59.7L-26.3 57.4L-24.1 57.1L-22.0 58.1L-19.8 59.2L-17.6 60.4L-15.4 61.8L-13.2 63.3L-11.0 65.0L-8.8 66.8L-6.6 68.9L-4.4 71.0L-2.2 73.2L0.0 75.5L2.2 74.5L4.4 73.4L6.6 72.3L8.8 71.0L11.0 69.6L13.2 68.0L15.4 66.3L17.6 64.3L19.8 62.3L22.0 60.1L24.1 57.8L26.3 56.9L28.5 57.9L30.7 59.0L32.9 60.2L35.1 61.5L37.3 63.0L39.5 64.7L41.7 66.5L43.9 68.5L46.1 70.6L48.3 72.9L50.5 75.1L52.7 74.7L54.9 73.6L57.1 72.5L59.3 71.3L61.5 69.9L63.7 68.3L65.9 66.6L68.1 64.7L70.3 62.6L72.4 60.5L74.6 58.2L76.8 56.7L79.0 57.8L81.2 58.8L83.4 60.0L85.6 61.3L87.8 62.8L90.0 64.4L92.2 66.2L94.4 68.2L96.6 70.3L98.8 72.5L101.0 74.7L103.2 74.8L105.4 73.8L107.6 72.7L109.8 71.5L112.0 70.1L114.2 68.6L116.4 66.9L118.5 65.0L120.7 63.0L122.9 60.8L125.1 58.6L127.3 56.6L129.5 57.6L131.7 58.6\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/></g></svg>";
const Core = (function () { const module = { exports: {} };
'use strict';
// 计划书的文本模型：不依赖界面，浏览器和命令行共用，中文和英文都能读写。
// 文档按行保存，编辑只改行，导出就是把行接回去，所以导出再导入内容不变。

// 第几部分是什么（和模板里的编号一致）
const SEC = { what: '1', flows: '2', pages: '3', features: '4', data: '5', look: '6', rules: '7' };
const LAST_FILLED = 7;

const TBD_RE = /(?:待补|TBD)[：:]/g;
const TBD_QUOTED_RE = /[「"“](?:待补|TBD)[^」"”]*[」"”]/g;
const PLACEHOLDER_RE = /〈[^〉]*〉/g;
const INSTRUCTION_LINE_RE = /^〈[^〉]*〉$/;

const WORDS = {
  zh: {
    title: '计划书', status: '状态', updated: '更新', tbd: '待补', missing: '缺',
    states: { draft: '草稿', doing: '整理中', approved: '已通过' },
    progress: { label: '进度', todo: '未做', doing: '进行中', done: '已完成' },
    page: { fields: ['这个页面是干什么的：', '页面上有什么：', '怎么来到这个页面：'] },
    feature: { fields: ['它做什么：', '怎么才算做好：', '有什么限制：'], progressLabel: '进度：' },
    newFlow: '〈名字〉：待补：用户做什么 → 看到什么',
  },
  en: {
    title: 'Plan', status: 'Status', updated: 'Updated', tbd: 'TBD', missing: 'missing ',
    states: { draft: 'Draft', doing: 'In progress', approved: 'Approved' },
    progress: { label: 'Progress', todo: 'Not started', doing: 'In progress', done: 'Done' },
    page: { fields: ['What this page is for:', 'What is on the page:', 'How the user gets here:'] },
    feature: { fields: ['What it does:', 'Done when:', 'Limits:'], progressLabel: 'Progress:' },
    newFlow: '〈Name〉: TBD: what the user does → what they see',
  },
};

const PARTS_RE = /^(?:页面上有什么|What is on the page|界面上有什么|What is on the screen|页面里有什么|部件|Parts?)$/i;
const CASES_RE = /^(?:怎么才算做好|Done when|用例|Use cases?)$/i;
const WHAT_RE = /^(?:它做什么|做什么|What it does|一句话)$/i;
const PROGRESS_LABEL_RE = /^(?:进度|Progress)$/i;
const ISSUES_RE = /^(?:问题|Issues)$/i;
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
  if (ISSUES_RE.test(lv.label)) return false;
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
  const names = zh ? { page: '页面', widget: '东西', feature: '功能', case: '情况' } : { page: 'Page', widget: 'Thing', feature: 'Feature', case: 'Case' };
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

// ---------- 问题（功能清单里，每个功能下面做的过程中发现的问题）----------

const FIXED_RE = /^(?:已修|Fixed)[：:]\s*/;

// 每个功能的问题：[{ featureLine, items: [{ line, text, done }] }]
function issueList(md) {
  const lines = split(md);
  return structure(md).features.map((f) => {
    const end = bodyRange(lines, f.line).end;
    const items = [];
    for (let j = f.line + 1; j < end; j++) {
      const t = info(lines[j]);
      if (t.kind !== 'p' && t.kind !== 'li') continue;
      const lv = splitLabel(t.body);
      if (!lv || !ISSUES_RE.test(lv.label)) continue;
      itemsUnder(lines, j).forEach((k) => {
        const body = info(lines[k]).body;
        items.push({ line: k, text: body.replace(FIXED_RE, ''), done: FIXED_RE.test(body) });
      });
    }
    return { featureLine: f.line, no: f.no, name: f.name, items };
  });
}

// 在功能块里的「问题：」下面加一条；没有「问题：」就加在「进度：」前面
function addIssue(md, featureLine, text, date) {
  const lines = split(md);
  const lang = docLang(md);
  const label = lang === 'zh' ? '问题：' : 'Issues:';
  const end = bodyRange(lines, featureLine).end;
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return { ok: false, code: 'empty' };
  const bullet = '- ' + clean + '（' + (date || today()) + '）';
  let at = -1;
  let progressAt = -1;
  for (let j = featureLine + 1; j < end; j++) {
    const t = info(lines[j]);
    if (t.kind !== 'p' && t.kind !== 'li') continue;
    const lv = splitLabel(t.body);
    if (!lv) continue;
    if (ISSUES_RE.test(lv.label)) {
      const kids = itemsUnder(lines, j);
      at = (kids.length ? kids[kids.length - 1] : j) + 1;
      break;
    }
    if (PROGRESS_LABEL_RE.test(lv.label)) progressAt = j;
  }
  if (at >= 0) {
    lines.splice(at, 0, bullet);
  } else {
    const insertAt = progressAt >= 0 ? progressAt : end;
    lines.splice(insertAt, 0, label, bullet);
  }
  return { ok: true, md: join(lines) };
}

function setIssueDone(md, line, done) {
  const lines = split(md);
  const t = info(lines[line]);
  if (t.kind !== 'li') return md;
  const lang = docLang(md);
  const body = t.body.replace(FIXED_RE, '');
  lines[line] = ' '.repeat(t.indent) + t.marker + ' ' + (done ? (lang === 'zh' ? '已修：' : 'Fixed: ') : '') + body;
  return join(lines);
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
  (d.summary || []).forEach((l) => out.push(l));
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
  progressList, setProgress, nextProgress, issueList, addIssue, setIssueDone,
  addBlock, renameBlock, addFlowLine, blankPlan, normalizeForExport,
  buildAiPrompt, buildFeedback,
};

return module.exports; })();
// 界面文字的英文词条：键是界面里写的中文原文，{名字} 是会被替换的部分。
const EN_DICT = {
  '新项目': 'New project',
  'prompt 计划书助手': 'Prompt plan helper',
  '页面': 'page',
  '功能': 'feature',
  '页面名称': 'Page name',
  '功能名称': 'Feature name',
  '{what}名称不能为空。': 'The {what} name cannot be empty.',
  '已有同名{what}，请换一个名称。': 'There is already a {what} with this name. Please use another name.',
  '没有找到可以添加的位置。': 'There is nowhere to add it.',
  '浏览器存储空间已满，最近的修改未保存，请先导出。': 'Browser storage is full and the latest changes were not saved. Export them first.',
  '已删除项目「{name}」。': 'Deleted project "{name}".',
  '撤销': 'Undo',
  '无法打开文件夹：{why}': 'Could not open the folder: {why}',
  '未能保存文件夹授权，下次打开需要重新选择文件夹。': 'The folder permission could not be saved; choose the folder again next time.',
  '授权未完成：{why}': 'Permission was not granted: {why}',
  '已断开文件夹。': 'Folder disconnected.',
  '保存到文件夹失败：{why}': 'Could not save to the folder: {why}',
  '读取文件夹失败：{why}': 'Could not read the folder: {why}',
  '文件夹中尚无计划书。': 'There is no plan in the folder yet.',
  '已是最新。': 'Already up to date.',
  '已载入文件夹中的计划书。': 'Loaded the plan from the folder.',
  '文件夹中的计划书与页面不一致': 'The plan in the folder differs from the page',
  '页面和文件夹中的计划书都有修改，请选择保留哪一份。另一份可通过撤销找回。': 'Both the page and the folder have changes. Choose which one to keep; the other can be recovered with Undo.',
  '稍后处理': 'Decide later',
  '保留页面中的': 'Keep the page',
  '保留文件夹中的': 'Keep the folder',
  '点击修改': 'Click to edit',
  '点击填写。': 'Click to fill in.',
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
  '没有可导出的内容。': 'There is nothing to export.',
  '已导出：{name}': 'Exported: {name}',
  '粘贴计划书内容，或选择文件。': 'Paste the plan, or choose a file.',
  '导入内容': 'Content to import',
  '无法读取该文件，请确认它是文本文件。': 'This file cannot be read. Check that it is a text file.',
  '导入': 'Import',
  '选择文件': 'Choose a file',
  '请先粘贴内容或选择文件。': 'Paste something or choose a file first.',
  '未识别出计划书格式，原文已放入「未识别」。': 'The plan format was not recognised; the original text was put under "Not recognised".',
  '已导入计划书。': 'Plan imported.',
  '已新建计划书。': 'New plan created.',
  '已载入示例。': 'Example loaded.',
  '描述要做的东西。': 'Describe what you want to make.',
  '补充说明': 'Notes',
  '给 AI 的话': 'Words for the AI',
  '复制提示词': 'Copy prompt',
  '提示词内容': 'Prompt content',
  '关闭': 'Close',
  '复制': 'Copy',
  '还有 {n} 处待补': '{n} left to fill in',
  '没有待补': 'Nothing left to fill in',
  '还有 {n} 处待补，补完才能通过。': '{n} still to fill in. Fill them in before approving.',
  '计划书已确认，可以开始制作。': 'The plan is confirmed. Work can start.',
  '文件夹：{name}': 'Folder: {name}',
  '同步于 {time}': 'synced at {time}',
  '复制地址': 'Copy path',
  '目录': 'Contents',
  '复制全文': 'Copy everything',
  '计划书全文': 'Full plan',
  '复制后发送给 AI。': 'Copy it and send it to the AI.',
  '导出': 'Export',
  '查看示例': 'View an example',
  '新建空白计划书': 'New blank plan',
  '没有可撤销的操作。': 'There is nothing to undo.',
  '重做': 'Redo',
  '没有可重做的操作。': 'There is nothing to redo.',
  '文件夹功能需要电脑版 Chrome 或 Edge': 'Folders need Chrome or Edge on a computer',
  '连接文件夹': 'Connect a folder',
  '重新授权文件夹': 'Allow the folder again',
  '刷新': 'Refresh',
  '断开文件夹': 'Disconnect the folder',
  '删除项目': 'Delete project',
  '更多': 'More',
  '还没有计划书。': 'There is no plan yet.',
  '已保存。': 'Saved.',
  '已保存到浏览器。': 'Saved in the browser.',
  '正在读取最近的文件夹': 'Reading recent folders',
  '使用中': 'In use',
  '已完成 {done} / {total}，待补 {n} 处': '{done} of {total} done, {n} left to fill in',
  '尚无计划书': 'No plan yet',
  '当前': 'Current',
  '打开计划书': 'Open plan',
  '最近使用的文件夹': 'Recent folders',
  '连接过的文件夹': 'Connected folders',
  '没有找到最近使用的文件夹，可以通过下方按钮选择。': 'No recent folders were found. Use the button below to choose one.',
  '选择别的文件夹': 'Choose another folder',
  '读取文件夹列表失败：{why}': 'Could not read the folder list: {why}',
  '已复制。': 'Copied.',
  '浏览器不允许自动复制，全文已选中，请按 Ctrl+C 复制。': 'The browser does not allow automatic copying. The text is selected; press Ctrl+C.',
  '全文': 'Full text',
  '截图已复制到剪贴板，请另行粘贴': 'The screenshot is on the clipboard; paste it separately',
  '截图失败：{why}': 'Capture failed: {why}',
  '截图已复制。': 'Screenshot copied.',
  '已下载：{name}': 'Downloaded: {name}',
  '选取元素': 'Pick an element',
  '截图': 'Screenshot',
  '清除': 'Clear',
  '说明需要修改的内容。': 'Describe the change.',
  '修改说明': 'Change description',
  '复制文字': 'Copy text',
  '复制截图': 'Copy screenshot',
  '确认并开始': 'Confirm and start',
  '方便打开 CLI': 'Handy for opening a CLI',
  '下载桌面版（Windows）': 'Download the desktop version (Windows)',
  '最近': 'Recent',
  '关闭标签': 'Close tab',
  '语言': 'Language',
  '正在使用的文件夹': 'Folders in use',
  '标记要修改的位置': 'Mark what to change',
  '区域截图': 'Region screenshot',
  '当前页面': 'Current page',
  '当前页面：{title}': 'Current page: {title}',
  '拖动选择截图区域，按 Esc 取消。': 'Drag to select the area. Press Esc to cancel.',
  '点击要选取的元素，按 Esc 取消。': 'Click the element to pick. Press Esc to cancel.',
  '功能清单': 'Feature list',
  '写问题': 'Report an issue',
  '未处理的问题 {n} 条': '{n} open issues',
  '点击更换功能': 'Click to change the feature',
  '说明遇到的问题，输入 @ 选择功能。': 'Describe the issue. Type @ to choose a feature.',
  '问题说明': 'Issue description',
  '请先写下问题。': 'Write the issue first.',
  '已添加问题。': 'Issue added.',
  '标记为已修': 'Mark as fixed',
  '已修': 'Fixed',
  '加用法': 'Add a way of using it',
  '加页面': 'Add a page',
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
    const box = h('div', { class: 'modal' + (o.small ? ' small' : ''), role: 'dialog' },
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
      kit.toast(t('浏览器不允许自动复制，全文已选中，请按 Ctrl+C 复制。'));
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
    tip.textContent = t('点击要选取的元素，按 Esc 取消。');
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

// 当前页面的信息：标题、地址、窗口、滚动位置、能看到的标题和可点的东西
function pageInfo() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const texts = (sel, max) => {
    const out = [];
    Array.prototype.forEach.call(document.querySelectorAll(sel), (el) => {
      if (out.length >= max || el.closest('[data-shupian]') || !visible(el)) return;
      const s = (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').replace(/\s+/g, ' ').trim();
      if (s && out.indexOf(s) < 0) out.push(s.slice(0, 40));
    });
    return out;
  };
  return {
    title: document.title,
    scroll: Math.round(window.scrollX) + ',' + Math.round(window.scrollY),
    pixelRatio: window.devicePixelRatio,
    headings: texts('h1,h2,h3', 8),
    controls: texts('button,a[href],input,select,textarea,[role="button"]', 15),
  };
}

// 在页面上拖出一块区域，返回它在窗口里的位置；Esc 取消
function pickRegion(shadowRoot) {
  return new Promise((resolve) => {
    const layer = document.createElement('div');
    layer.setAttribute('style', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;cursor:crosshair;background:rgba(0,0,0,0.25)');
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;border:2px solid #e5322d;background:rgba(255,255,255,0.15);display:none;pointer-events:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;pointer-events:none');
    tip.textContent = t('拖动选择截图区域，按 Esc 取消。');
    shadowRoot.append(layer, box, tip);
    let sx = 0;
    let sy = 0;
    let dragging = false;
    const done = (v) => {
      document.removeEventListener('keydown', key, true);
      layer.remove();
      box.remove();
      tip.remove();
      resolve(v);
    };
    const rectOf = (x, y) => ({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
    layer.addEventListener('pointerdown', (e) => {
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      box.style.display = 'block';
      layer.setPointerCapture(e.pointerId);
    });
    layer.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const r = rectOf(e.clientX, e.clientY);
      box.style.left = r.x + 'px';
      box.style.top = r.y + 'px';
      box.style.width = r.w + 'px';
      box.style.height = r.h + 'px';
    });
    layer.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const r = rectOf(e.clientX, e.clientY);
      done(r.w >= 8 && r.h >= 8 ? r : null);
    });
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('keydown', key, true);
  });
}

// 把整个可见区域的图按区域裁开
async function cropShot(shot, rect) {
  const url = URL.createObjectURL(shot.blob);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('decode'));
    img.src = url;
  });
  const kx = img.naturalWidth / window.innerWidth;
  const ky = img.naturalHeight / window.innerHeight;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(rect.w * kx));
  c.height = Math.max(1, Math.round(rect.h * ky));
  c.getContext('2d').drawImage(img, rect.x * kx, rect.y * ky, rect.w * kx, rect.h * ky, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: shot.kind };
}

'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = ['plan.md', '计划书.md'];
const ADD_LABEL = { 2: '加用法', 3: '加页面', 4: '加功能' };

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
  const what = kind === 'page' ? t('页面') : t('功能');
  if (code === 'empty') return t('{what}名称不能为空。', { what });
  if (code === 'duplicate') return t('已有同名{what}，请换一个名称。', { what });
  return t('没有找到可以添加的位置。');
}

// 桌面窗口：打开时是贴在屏幕右下角的小窗口，之后切换标签、打开计划书都不改变大小和位置
const WINDOW_MODE = !!SERVER && new URLSearchParams(location.search).get('win') === '1';
const WINDOW_SIZE = { w: 360, h: 480 };

function placeWindow() {
  if (!WINDOW_MODE) return;
  window.resizeTo(WINDOW_SIZE.w, WINDOW_SIZE.h);
  window.moveTo((screen.availLeft || 0) + screen.availWidth - WINDOW_SIZE.w - 12, (screen.availTop || 0) + screen.availHeight - WINDOW_SIZE.h - 12);
}

function createApp(opts) {
  const root = opts.root;
  const index = LS.get(NS + ':index', null) || { current: '', list: [], open: [] };
  if (!index.open) index.open = [];
  const S = {
    md: '',
    past: [],
    future: [],
    collapsed: {},
    view: 'plan',
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
    if (!LS.set(projectKey(S.project.id), { md: S.md, updated: Date.now() })) toast(t('浏览器存储空间已满，最近的修改未保存，请先导出。'));
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
    if (index.open.indexOf(cur.id) < 0) index.open.push(cur.id);
    index.open = index.open.filter((id) => index.list.some((p) => p.id === id));
    saveIndex();
    loadProject(cur.id);
    folderInit();
    // 有桌面服务时，窗口一打开先看最近的文件夹
    if (SERVER && !opts.folder && (new URLSearchParams(location.search).get('view') === 'hub' || WINDOW_MODE)) {
      S.view = 'hub';
      // 还没写过内容、也没连文件夹的空项目不占标签
      if (!S.md.trim() && !S.project.path) {
        index.open = index.open.filter((id) => id !== S.project.id);
        saveIndex();
      }
    }
  }

  // 打开一个项目：加到标签里并切过去
  function useProject(p) {
    S.project = p;
    S.view = 'plan';
    index.current = p.id;
    if (index.open.indexOf(p.id) < 0) index.open.push(p.id);
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

  function showHub() {
    persist();
    S.view = 'hub';
    renderAll();
  }

  // 关掉一个标签：项目还在，可以从「更多」里再打开
  function closeTab(id) {
    persist();
    const at = index.open.indexOf(id);
    if (at < 0) return;
    index.open.splice(at, 1);
    saveIndex();
    if (S.view === 'plan' && S.project.id === id) {
      const nextId = index.open[Math.min(at, index.open.length - 1)];
      const p = index.list.filter((x) => x.id === nextId)[0];
      if (p) useProject(p);
      else if (SERVER) showHub();
      else createProject();
    } else renderAll();
  }

  function deleteProject(id) {
    const p = index.list.filter((x) => x.id === id)[0];
    if (!p) return;
    const rec = LS.get(projectKey(id), null);
    const pos = index.list.indexOf(p);
    index.list.splice(pos, 1);
    index.open = index.open.filter((x) => x !== id);
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
    if (SERVER) { showHub(); return; }
    let handle;
    try {
      handle = await Folder.pick();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('未能保存文件夹授权，下次打开需要重新选择文件夹。')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('无法打开文件夹：{why}', { why: errText(e) }));
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
      toast(t('授权未完成：{why}', { why: errText(e) }));
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
      else if (manual) toast(t('文件夹中尚无计划书。'));
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
      if (!silent) toast(t('已载入文件夹中的计划书。'), { label: t('撤销'), run: () => { undo(); folderPush(); } });
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
      title: t('文件夹中的计划书与页面不一致'),
      body: h('p', { class: 'p', text: t('页面和文件夹中的计划书都有修改，请选择保留哪一份。另一份可通过撤销找回。') }),
      onClose: release,
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); } }, t('稍后处理')),
        h('button', { type: 'button', class: 'btn', onclick() { release(); close(); folderPush(); } }, t('保留页面中的')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          release(); close();
          S.folder.synced = fileText;
          commit(fileText, true);
          renderAll();
        } }, t('保留文件夹中的')),
      ],
    });
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
      if (!text.trim()) el.append(h('div', { class: 'hint-note' }, t('点击填写。')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
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
  // 写问题的小弹窗：问题记在某个功能下面；输入 @ 可以换功能
  function openIssue(featureLine) {
    const feats = Core.issueList(S.md);
    if (!feats.length) return;
    let target = feats.filter((f) => f.featureLine === featureLine)[0] || feats[0];
    const label = h('button', { type: 'button', class: 'btn sm target', title: t('点击更换功能') });
    const ta = h('textarea', { class: 'in', rows: 4, placeholder: t('说明遇到的问题，输入 @ 选择功能。'), 'aria-label': t('问题说明') });
    const paintLabel = () => { label.textContent = '@ ' + (target.no ? target.no + ' ' : '') + target.name; };
    const choose = (anchor, after) => kit.openPop(anchor, (pop, close) => {
      feats.forEach((f) => pop.append(h('button', { type: 'button', class: f === target ? 'on' : '', onclick() {
        target = f;
        paintLabel();
        close();
        if (after) after();
      } }, (f.no ? f.no + ' ' : '') + f.name)));
    });
    label.addEventListener('click', () => choose(label));
    ta.addEventListener('input', () => {
      autoGrow(ta);
      if (/@$/.test(ta.value)) {
        ta.value = ta.value.slice(0, -1);
        choose(ta, () => ta.focus());
      }
    });
    paintLabel();
    kit.openModal({
      title: t('写问题'),
      small: true,
      body: h('div', null, h('div', { class: 'field' }, label), ta),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('取消')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          const r = Core.addIssue(S.md, target.featureLine, ta.value, Core.today());
          if (!r.ok) { toast(t('请先写下问题。')); return; }
          close();
          commit(r.md);
          renderAll();
          toast(t('已添加问题。'));
        } }, t('添加')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  // 项目情况（计划书阶段）和功能清单（确认之后）：每个功能做什么、做到哪一步，以及它下面的问题
  function renderProgress() {
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const building = Core.getStatus(S.md) === 'approved';
    const issues = Core.issueList(S.md);
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const open = issues.reduce((n, f) => n + f.items.filter((i) => !i.done).length, 0);
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: building ? t('功能清单') : t('项目情况') }),
      h('span', { class: 'muted', text: t('已完成 {done} / {total}，进行中 {doing}', { done, total: list.length, doing }) + (open ? '　' + t('未处理的问题 {n} 条', { n: open }) : '') }),
      building ? h('button', { type: 'button', class: 'btn sm', onclick: () => openIssue(list[0].line) }, '＋ ' + t('写问题')) : null));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    list.forEach((f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('点击切换进度') }, W[f.status]);
      chip.addEventListener('click', () => {
        commit(Core.setProgress(S.md, f.line, Core.nextProgress(f.status)));
        renderAll();
      });
      const mine = (issues.filter((x) => x.featureLine === f.line)[0] || { items: [] }).items;
      const openItems = mine.filter((i) => !i.done);
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' },
          h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, (f.no ? f.no + ' ' : '') + f.name),
          f.what ? h('span', { class: 'muted', text: f.what }) : null),
        building ? h('button', { type: 'button', class: 'btn sm', title: t('写问题'), 'aria-label': t('写问题'), onclick: () => openIssue(f.line) }, '＋') : null,
        chip));
      openItems.forEach((it) => {
        box.append(h('div', { class: 'issue' },
          h('button', { type: 'button', class: 'btn sm', title: t('标记为已修'), onclick() { commit(Core.setIssueDone(S.md, it.line, true)); renderAll(); } }, t('已修')),
          h('span', { class: 'issue-text', text: it.text }),
          h('button', { type: 'button', class: 'x', title: t('删除'), 'aria-label': t('删除'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), it.line)));
            renderAll();
            toast(t('已删除。'), { label: t('撤销'), run: () => undo() });
          } }, '✕')));
      });
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
        const closedNow = S.collapsed[x.body] !== undefined ? S.collapsed[x.body] : Core.getStatus(S.md) === 'approved';
        const secEl = h('section', { class: 'sec' + (closedNow ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('展开或收起') }, closedNow ? '▸' : '▾');
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
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('页面名称') : t('功能名称'), (name) => {
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
    if (!S.md.trim()) { toast(t('没有可导出的内容。')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('已导出：{name}', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('粘贴计划书内容，或选择文件。'), 'aria-label': t('导入内容') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('无法读取该文件，请确认它是文本文件。')));
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
      toast(t('未识别出计划书格式，原文已放入「未识别」。'), { label: t('撤销'), run: () => undo() });
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
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('描述要做的东西。'), 'aria-label': t('补充说明') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('给 AI 的话') });
    const refresh = () => { out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, LANG); autoGrow(out); };
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('复制提示词'),
      body: h('div', null, h('div', { class: 'field' }, h('div', { class: 'fl', text: t('补充说明') }), note), h('div', { class: 'field' }, h('div', { class: 'fl', text: t('提示词内容') }), out)),
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
        toast(t('计划书已确认，可以开始制作。'));
      } }, t('确认并开始')));
    }
    if (S.folder.state === 'ready') {
      box.append(h('span', { class: 'muted', text: t('文件夹：{name}', { name: S.folder.name }) + (S.lastSync ? '　' + t('同步于 {time}', { time: S.lastSync }) : '') }));
      if (S.folder.path) {
        box.append(h('button', { type: 'button', class: 'btn sm', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, t('复制地址')),
          h('span', { class: 'muted', text: t('方便打开 CLI') }));
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
        add(t('复制全文'), () => showText(kit, t('计划书全文'), exportText(), t('复制后发送给 AI。')));
        add(t('复制提示词'), openAiPrompt);
        add(t('导出'), exportPlan);
        pop.append(h('hr'));
      }
      add(t('查看示例'), loadExample);
      add(t('新建空白计划书'), newBlank);
      add(t('导入'), openImport);
      if (has) {
        add(t('撤销'), () => { if (!undo()) toast(t('没有可撤销的操作。')); });
        add(t('重做'), () => { if (!redo()) toast(t('没有可重做的操作。')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('文件夹功能需要电脑版 Chrome 或 Edge'), () => {}, { disabled: true });
      else if (f.state === 'none') add(t('连接文件夹'), folderConnect);
      else if (f.state === 'need') add(t('重新授权文件夹'), folderRegrant);
      else {
        add(t('刷新'), () => folderPull(true, false));
        add(t('断开文件夹'), folderDisconnect);
      }
      const closed = index.list.filter((p) => index.open.indexOf(p.id) < 0);
      if (closed.length) {
        pop.append(h('hr'));
        closed.forEach((p) => {
          pop.append(h('div', { class: 'row2' },
            h('button', { type: 'button', onclick() { kit.closePop(); useProject(p); } }, p.name),
            h('button', { type: 'button', class: 'x', title: t('删除项目'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
        });
      }
      if (!SERVER) {
        pop.append(h('hr'));
        pop.append(h('a', { class: 'menu-link', href: 'download/prompt-plan-helper.exe', download: 'prompt-plan-helper.exe', onclick() { kit.closePop(); } }, t('下载桌面版（Windows）')));
      }
    });
  }

  function openLang(anchor) {
    kit.openPop(anchor, (pop) => {
      [['zh', '中文'], ['en', 'English']].forEach((x) => {
        pop.append(kit.popItem(x[1], () => { setLang(x[0]); renderAll(); }, { on: LANG === x[0] }));
      });
    });
  }

  function renderTabs() {
    const bar = h('div', { class: 'tabbar', role: 'tablist' });
    if (SERVER) {
      bar.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (S.view === 'hub' ? ' on' : ''), onclick: showHub }, t('最近')));
    }
    index.open.forEach((id) => {
      const p = index.list.filter((x) => x.id === id)[0];
      if (!p) return;
      const on = S.view === 'plan' && S.project.id === id;
      bar.append(h('span', { class: 'tab' + (on ? ' on' : '') },
        h('button', { type: 'button', role: 'tab', class: 'tab-name', onclick() { if (!on) switchProject(id); } }, p.name),
        h('button', { type: 'button', class: 'tab-x', title: t('关闭标签'), 'aria-label': t('关闭标签'), onclick() { closeTab(id); } }, '✕')));
    });
    bar.append(h('button', { type: 'button', class: 'chip add', title: t('新项目'), 'aria-label': t('新项目'), onclick() { if (SERVER) showHub(); else createProject(); } }, '＋'));
    return bar;
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt 计划书助手') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'lang', title: t('语言'), 'aria-label': t('语言'), onclick(e) { openLang(e.currentTarget); } }, (LANG === 'zh' ? '中文' : 'English') + ' ▾'),
      h('button', { type: 'button', class: 'x more', title: t('更多'), 'aria-label': t('更多'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
    head.append(h('div', { class: 'in tabs-in' }, renderTabs()));
  }

  function renderHubView() {
    const list = h('div', { class: 'folders' });
    folderRows(list, {
      kit,
      current: S.project && S.project.path ? S.project.path : '',
      onPick: (path) => connectFolderPath(path),
      onBrowse: async () => {
        try {
          const r = await Api.call('POST', '/api/pick', {});
          if (r.path) connectFolderPath(r.path);
        } catch (e) {
          toast(t('无法打开文件夹：{why}', { why: errText(e) }));
        }
      },
    });
    return h('div', { class: 'col' }, list);
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (S.view === 'hub') {
      content = renderHubView();
    } else if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'doc empty' },
        h('h1', { text: S.project.name || t('新项目') }),
        h('p', { class: 'muted', text: t('还没有计划书。') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('新建空白计划书')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('查看示例')),
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
      else toast(t('已保存到浏览器。'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('没有可撤销的操作。')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('没有可重做的操作。')); }
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
  placeWindow();

  return {
    el: app,
    refresh: () => folderPull(false, true),
    state: () => S,
  };
}

'use strict';
// 「最近」标签里的文件夹列表（本机服务提供）：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path), onBrowse() }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('正在读取最近的文件夹') }));
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('使用中') }) : null),
        h('div', { class: 'fpath', text: x.path }),
        s ? h('div', { class: 'muted', text: t('已完成 {done} / {total}，待补 {n} 处', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('尚无计划书') }));
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
    section(t('正在使用的文件夹'), active);
    section(t('最近使用的文件夹'), recent);
    section(t('连接过的文件夹'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('没有找到最近使用的文件夹，可以通过下方按钮选择。') }));
    container.append(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onclick: o.onBrowse }, t('选择别的文件夹'))));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('读取文件夹列表失败：{why}', { why: errText(e) }) }));
  });
}

'use strict';
// 悬浮在别的页面上的小窗：指出一个东西、框一块区域或记下当前页面、写一句话，合成一段话复制给 AI。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'fb-body' });
  app.append(head, body);
  const kit = createKit(app);
  const S = { text: '', element: '', styles: '', info: null, shot: null };

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  head.append(h('div', { class: 'in drag' },
    h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('标记要修改的位置') })),
    h('span', { class: 'sp' }),
    h('button', { type: 'button', class: 'x', title: t('关闭'), 'aria-label': t('关闭'), onclick: opts.onClose }, '✕')));

  function infoLines() {
    if (!S.info) return [];
    const i = S.info;
    const out = [];
    if (i.title) out.push((LANG === 'zh' ? '页面标题：' : 'Page title: ') + i.title);
    if (i.headings.length) out.push((LANG === 'zh' ? '页面上能看到的标题：' : 'Headings on the page: ') + i.headings.join(' / '));
    if (i.controls.length) out.push((LANG === 'zh' ? '页面上能点的东西：' : 'Things to click on the page: ') + i.controls.join(' / '));
    return out;
  }

  function feedbackText() {
    const ctx = tools.context();
    return Core.buildFeedback({
      text: S.text, page: ctx.page, view: ctx.view, element: S.element, styles: S.styles, summary: infoLines(),
      errors: tools.errors(), shot: S.shot ? t('截图已复制到剪贴板，请另行粘贴') : '',
    }, LANG);
  }

  function setShot(r) {
    if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
    S.shot = r ? { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) } : null;
  }

  async function pick() {
    const r = await tools.pick();
    if (!r) return;
    S.element = r.path;
    S.styles = r.styles;
    render();
  }

  async function region() {
    try {
      const r = await tools.region();
      if (!r) return;
      setShot(r);
      render();
    } catch (e) {
      kit.toast(t('截图失败：{why}', { why: errText(e) }));
    }
  }

  async function currentPage() {
    try {
      const r = await tools.page();
      S.info = r.info;
      setShot(r.shot);
      render();
    } catch (e) {
      kit.toast(t('截图失败：{why}', { why: errText(e) }));
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
      h('button', { type: 'button', class: 'btn', onclick: region }, t('区域截图')),
      h('button', { type: 'button', class: 'btn', onclick: currentPage }, t('当前页面'))));
    if (S.element) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: S.element }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.element = ''; S.styles = ''; render(); } }, '✕')));
    }
    if (S.info) {
      body.append(h('div', { class: 'chipline' }, h('span', { text: t('当前页面：{title}', { title: S.info.title || tools.context().page }) }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { S.info = null; render(); } }, '✕')));
    }
    if (S.shot) {
      body.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('截图') }),
        h('span', { text: S.shot.kind }),
        h('button', { type: 'button', class: 'x', title: t('清除'), onclick() { setShot(null); render(); } }, '✕')));
    }
    const ta = h('textarea', { class: 'in', rows: 3, placeholder: t('说明需要修改的内容。'), value: S.text, 'aria-label': t('修改说明') });
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
  const inst = createApp({ root, defaultName: t('新项目'), folder: params.get('folder') || '' });
  wrap.append(inst.el);
  root.append(wrap);
  document.title = t('prompt 计划书助手');
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  return { open() {}, close() {}, toggle() {}, mode: 'plan' };
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
  const viewShot = async () => (await realShot()) || (await domShot());
  const tools = {
    // 当前页面：一下记下页面的信息，并存一张整个可见区域的图
    page: () => whileHidden(async () => ({ info: pageInfo(), shot: await viewShot() })),
    // 区域截图：拖出一块区域，只存这一块
    region: async () => {
      const rect = await whileHidden(() => pickRegion(root));
      if (!rect) return null;
      return whileHidden(async () => cropShot(await viewShot(), rect));
    },
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
