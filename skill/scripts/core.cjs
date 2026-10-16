'use strict';
// 计划书的文本模型：不依赖界面，浏览器和命令行共用，中文和英文都能读写。
// 文档按行保存，编辑只改行，导出就是把行接回去，所以导出再导入内容不变。

// 第几部分是什么（和模板里的编号一致）
const SEC = { what: '1', flows: '2', pages: '3', features: '4', data: '5', look: '6', rules: '7' };
const LAST_FILLED = 7;

// 计划书格式里的固定词（标签、状态、提示词模板）都在 locales/<语言>.json 的 doc 部分，代码里不写任何一种语言的原文。
// 浏览器里由构建注入 LOCALES；命令行和本机服务里直接读文件。
const LOC = typeof LOCALES !== 'undefined' ? LOCALES : { zh: require('./locales/zh.json'), en: require('./locales/en.json') };
const DOC_LANGS = Object.keys(LOC).filter((k) => LOC[k].doc);
const DOCS = DOC_LANGS.map((k) => LOC[k].doc);

const reEsc = (w) => String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 各语言里同一个意思的词：返回正则可用的「或」片段
const alt = (pick) => '(?:' + DOCS.reduce((all, d) => all.concat(pick(d)), []).map(reEsc).join('|') + ')';

// 兼容的写法：也认命令行和程序内部用的英文代号
const WORDS = {};
DOC_LANGS.forEach((k) => {
  const d = LOC[k].doc;
  WORDS[k] = {
    title: d.title, status: d.status, updated: d.updated, tbd: d.tbd, missing: d.missing, sep: d.sep,
    states: d.states, progress: d.progress,
    page: { fields: d.pageFields },
    feature: { fields: d.featureFields, progressLabel: d.progressLabel },
    newFlow: d.newFlow,
  };
});

const SEPS = '[：:]';
const TBD_RE = new RegExp(alt((d) => [d.tbd]) + SEPS, 'g');
const TBD_QUOTED_RE = new RegExp('[「"“]' + alt((d) => [d.tbd]) + '[^」"”]*[」"”]', 'g');
const TBD_LABEL_RE = new RegExp('^' + alt((d) => [d.tbd]) + '$', 'i');
const TBD_START_RE = new RegExp('^' + alt((d) => [d.tbd]));
const TBD_ALT = alt((d) => [d.tbd]).slice(3, -1);
const PLACEHOLDER_RE = /〈[^〉]*〉/g;
const INSTRUCTION_LINE_RE = /^〈[^〉]*〉$/;

const PARTS_RE = new RegExp('^' + alt((d) => d.labels.parts) + '$', 'i');
const CASES_RE = new RegExp('^' + alt((d) => d.labels.cases) + '$', 'i');
const WHAT_RE = new RegExp('^' + alt((d) => d.labels.what) + '$', 'i');
const PROGRESS_LABEL_RE = new RegExp('^' + alt((d) => d.labels.progress) + '$', 'i');
const ISSUES_RE = new RegExp('^' + alt((d) => d.labels.issues) + '$', 'i');
const STATE_WORDS = ['draft', 'doing', 'approved'].map((code) => [new RegExp('^' + alt((d) => [d.states[code]]) + '$', 'i'), code]);
const STATUS_WORD_RE = new RegExp('^' + alt((d) => [d.status]) + SEPS);
const APPROVED_NOTE_RE = new RegExp('^' + alt((d) => [d.states.approved]) + '\\s*(?:=|is)', 'i');
const ORIGINAL_RE = new RegExp('^' + alt((d) => [d.originalDescription]));

// 默认的计划书文件名：plan.md、计划书.md；同一个文件夹里的多份是 前缀+名称.md
const PLAN_NAMES = DOCS.map((d) => d.planFile);
const FILE_PREFIXES = DOCS.map((d) => d.filePrefix);
// 功能清单的文件名：features.md、功能清单.md，以及和计划书一一对应的 features-名称.md、功能清单-名称.md
const FEATURE_FILE_RE = new RegExp('^(?:' + DOCS.map((d) => reEsc(d.featureFile.replace(/\.md$/, ''))).join('|') + ')(?:-[^\\\\/:*?"<>|]{1,60})?\\.md$', 'i');
// 文件名：plan.md、计划书.md，或同一个文件夹里的 plan-名称.md、计划书-名称.md
const PLAN_FILE_RE = new RegExp('^(?:' + DOCS.map((d) => reEsc(d.planFile.replace(/\.md$/, ''))).join('|') + ')(?:-[^\\\\/:*?"<>|]{1,60})?\\.md$', 'i');

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
  if (TBD_LABEL_RE.test(label)) return null;
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
  for (const k of DOC_LANGS) {
    const d = LOC[k].doc;
    const re = new RegExp('^' + reEsc(d.status) + SEPS + '|^#\\s+(?:' + [d.title].concat(d.titleAlt || []).map(reEsc).join('|') + ')' + SEPS, 'm');
    if (re.test(head)) return k;
  }
  return /[\u4e00-\u9fff]/.test(md) ? 'zh' : 'en';
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
    if (APPROVED_NOTE_RE.test(text.trim())) return;
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

const STATUS_LINE_RE = new RegExp('^(' + alt((d) => [d.status]) + ')(' + SEPS + '\\s*)(.*?)((?:　+|\\s{2,})' + alt((d) => [d.updated]) + SEPS + '.*)?$');
const UPDATED_TAIL_RE = new RegExp('(' + alt((d) => [d.updated]) + SEPS + '\\s*).*$');

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
      if (tail) tail = tail.replace(UPDATED_TAIL_RE, '$1' + (date || today()));
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

const TITLE_RE = new RegExp('^#\\s+(?:' + alt((d) => [d.title].concat(d.titleAlt || [])) + SEPS + '\\s*)?(.*)$');

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
  const v = String(name || '').trim() || LOC[lang].doc.projectName;
  const sep = WORDS[lang].sep;
  if (i < 0) return '# ' + WORDS[lang].title + sep + v + '\n\n' + md;
  // 功能清单的标题词保留
  lines[i] = '# ' + (isFeatureList(md) ? LOC[lang].doc.featureList : WORDS[lang].title) + sep + v;
  return join(lines);
}

// 标题行用的是「功能清单」这个词，就是功能清单文档
function isFeatureList(md) {
  const t = split(md).find((l) => /^#\s+/.test(l)) || '';
  return new RegExp('^#\\s+' + alt((d) => [d.featureList]) + SEPS).test(t);
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

// ---------- 三方合并 ----------

// a 和 b 里按顺序一致的行：返回 [[在 a 里的位置, 在 b 里的位置], ...]
function matchedLines(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = [];
  for (let i = 0; i <= n; i++) dp.push(new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

// x 相对 base 改了哪几段：[{ a0, a1, x }]，base 的 [a0, a1) 被换成 x（a0 === a1 是插入）
function changedRegions(base, x) {
  const out = [];
  let ia = 0;
  let ix = 0;
  matchedLines(base, x).concat([[base.length, x.length]]).forEach((p) => {
    if (p[0] > ia || p[1] > ix) out.push({ a0: ia, a1: p[0], x: x.slice(ix, p[1]) });
    ia = p[0] + 1;
    ix = p[1] + 1;
  });
  return out;
}

// 三方合并：base 是上次同步的内容，mine 是页面里的，theirs 是文件夹里的。
// 两边改在不同位置的都保留；改在同一位置且内容不同的，取 prefer（'mine' 或 'theirs'）那一边。
function merge3(base, mine, theirs, prefer) {
  if (mine === theirs) return { text: mine, conflicts: 0 };
  if (mine === base) return { text: theirs, conflicts: 0 };
  if (theirs === base) return { text: mine, conflicts: 0 };
  const A = String(base).split('\n');
  const rm = changedRegions(A, String(mine).split('\n'));
  const rt = changedRegions(A, String(theirs).split('\n'));
  const out = [];
  let pos = 0;
  let pm = 0;
  let pt = 0;
  let conflicts = 0;
  const apply = (regs, s, e) => {
    const res = [];
    let at = s;
    regs.forEach((r) => { res.push.apply(res, A.slice(at, r.a0)); res.push.apply(res, r.x); at = r.a1; });
    res.push.apply(res, A.slice(at, e));
    return res;
  };
  while (pm < rm.length || pt < rt.length) {
    const first = !rt[pt] || (rm[pm] && rm[pm].a0 <= rt[pt].a0) ? rm[pm] : rt[pt];
    let s = first.a0;
    let e = first.a1;
    const gotM = [];
    const gotT = [];
    let grew = true;
    while (grew) {
      grew = false;
      while (pm < rm.length && rm[pm].a0 <= e) { gotM.push(rm[pm]); e = Math.max(e, rm[pm].a1); pm++; grew = true; }
      while (pt < rt.length && rt[pt].a0 <= e) { gotT.push(rt[pt]); e = Math.max(e, rt[pt].a1); pt++; grew = true; }
    }
    out.push.apply(out, A.slice(pos, s));
    let chosen;
    if (!gotT.length) chosen = apply(gotM, s, e);
    else if (!gotM.length) chosen = apply(gotT, s, e);
    else {
      const a = apply(gotM, s, e);
      const b = apply(gotT, s, e);
      if (a.join('\n') === b.join('\n')) chosen = a;
      else { conflicts++; chosen = prefer === 'theirs' ? b : a; }
    }
    out.push.apply(out, chosen);
    pos = e;
  }
  out.push.apply(out, A.slice(pos));
  return { text: out.join('\n'), conflicts };
}

// ---------- 进度 ----------

function progressCode(word) {
  const w = String(word || '').trim();
  // 各语言里写的进度词，也认程序内部的代号 todo / doing
  const code = ['todo', 'doing', 'done'].filter((c) => new RegExp('^(?:' + (c === 'done' ? '' : c + '|') + DOCS.map((d) => reEsc(d.progress[c])).join('|') + ')', 'i').test(w))[0];
  return code || '';
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

const FIXED_RE = new RegExp('^' + alt((d) => [d.fixed]) + SEPS + '\\s*');
const DOING_RE = new RegExp('^' + alt((d) => [d.working]) + SEPS + '\\s*');

// 问题前面的状态词：done 是「已修：」，doing 是「处理中：」，todo 没有
function issuePrefix(md, state) {
  const d = LOC[docLang(md)].doc;
  return state === 'done' ? d.fixed + d.sep : state === 'doing' ? d.working + d.sep : '';
}

// 一条问题的状态：todo（没有前缀）、doing（处理中：）、done（已修：）
function issueState(body) {
  if (FIXED_RE.test(body)) return 'done';
  if (DOING_RE.test(body)) return 'doing';
  return 'todo';
}

function stripIssueState(body) {
  return body.replace(FIXED_RE, '').replace(DOING_RE, '');
}

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
        const state = issueState(body);
        items.push({ line: k, text: stripIssueState(body), state, done: state === 'done' });
      });
    }
    return { featureLine: f.line, no: f.no, name: f.name, items };
  });
}

// 在功能块里的「问题：」下面加一条；没有「问题：」就加在「进度：」前面
function addIssue(md, featureLine, text, date) {
  const lines = split(md);
  const lang = docLang(md);
  const label = LOC[lang].doc.issuesLabel;
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

// 一次加多条：items 是 [{ featureLine, text }]，行号都按传入的 md 算。
// 从靠后的功能往前加，前面的行号不受影响；同一个功能里按传入的顺序加。空的跳过。
function addIssues(md, items, date) {
  const list = (items || []).filter((x) => String(x.text || '').trim());
  if (!list.length) return { ok: false, code: 'empty' };
  const groups = {};
  list.forEach((x) => { (groups[x.featureLine] = groups[x.featureLine] || []).push(x); });
  let out = md;
  Object.keys(groups).map(Number).sort((a, b) => b - a).forEach((line) => {
    groups[line].forEach((x) => {
      const r = addIssue(out, line, x.text, date);
      if (r.ok) out = r.md;
    });
  });
  return { ok: true, md: out, added: list.length };
}

// 设定一条问题的状态：todo / doing / done
function setIssueState(md, line, state) {
  const lines = split(md);
  const t = info(lines[line]);
  if (t.kind !== 'li') return md;
  const prefix = issuePrefix(md, state);
  lines[line] = ' '.repeat(t.indent) + t.marker + ' ' + prefix + stripIssueState(t.body);
  return join(lines);
}

function setIssueDone(md, line, done) {
  return setIssueState(md, line, done ? 'done' : 'todo');
}

function nextIssueState(state) {
  return state === 'todo' ? 'doing' : state === 'doing' ? 'done' : 'todo';
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

// ---------- 最初的描述：可以保留，也可以去掉 ----------

function originalRange(lines) {
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && ORIGINAL_RE.test(t.body)) return { start: i, end: rangeEnd(lines, i) };
  }
  return null;
}

function hasOriginal(md) {
  return !!originalRange(split(md));
}

// keep 为 false 时去掉这一节并返回去掉的正文；为 true 且没有这一节时加在页脚之前，正文用 text，没有就写说明
function setOriginal(md, keep, text) {
  const lines = split(md);
  const at = originalRange(lines);
  if (!keep) {
    if (!at) return { md, text: '' };
    const body = join(lines.slice(at.start + 1, at.end)).trim();
    let from = at.start;
    while (from > 0 && info(lines[from - 1]).kind === 'blank') from--;
    return { md: join(lines.slice(0, from).concat(lines.slice(at.end))).replace(/\n{3,}/g, '\n\n'), text: body };
  }
  if (at) return { md, text: '' };
  const d = LOC[docLang(md)].doc;
  const end = footerStart(lines);
  const block = ['', '## ' + d.originalDescription, '', String(text || '').trim() || d.originalPlaceholder];
  const tail = end < lines.length ? [''] : [];
  return { md: join(lines.slice(0, end).concat(block, tail, lines.slice(end))).replace(/\n{3,}/g, '\n\n'), text: '' };
}

// ---------- 功能清单：和初始计划书是两份文件 ----------

// 计划书文件名对应的功能清单文件名：plan.md → features.md，计划书-名称.md → 功能清单-名称.md；不是计划书的名字返回空字符串
function featureFileFor(planFile) {
  const f = String(planFile || '');
  if (!PLAN_FILE_RE.test(f)) return '';
  for (const d of DOCS) {
    if (f.toLowerCase() === d.planFile.toLowerCase()) return d.featureFile;
    if (f.toLowerCase().indexOf(d.filePrefix.toLowerCase()) === 0) return d.featurePrefix + f.slice(d.filePrefix.length);
  }
  return '';
}

// 已经开始做：有功能的进度不是「未做」，或者功能下已经有问题
function workStarted(md) {
  return progressList(md).some((x) => x.status !== 'todo') || issueList(md).some((f) => f.items.length > 0);
}

// 第一次开始做的时候：把计划书里的功能（连同每个功能下已有的进度和问题）复制成独立的一份功能清单
function makeFeatureList(planMd) {
  const lang = docLang(planMd);
  const d = LOC[lang].doc;
  const lines = split(planMd);
  let from = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && new RegExp('^' + SEC.features + '\\b').test(t.body)) { from = i; break; }
  }
  const body = from < 0 ? [] : lines.slice(from, rangeEnd(lines, from));
  const name = titleName(planMd) || d.projectName;
  return join(['# ' + d.featureList + d.sep + name, ''].concat(body)).replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';
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
    if (t.kind === 'h' && t.level === 2 && ORIGINAL_RE.test(t.body)) { skip = true; return; }
    if (t.kind === 'p' && INSTRUCTION_LINE_RE.test(t.body)) return;
    if (t.kind === 'li' && /^〈/.test(t.body)) return;
    out.push(l);
  });
  const w = WORDS[lang];
  const sep = w.sep;
  let md = join(out);
  md = md.replace(/^#\s+.*$/m, '# ' + w.title + sep + (name || LOC[lang].doc.projectName));
  md = md.replace(new RegExp('^' + alt((d) => [d.status]) + SEPS + '.*$', 'm'), w.status + sep + w.states.draft + '　　' + w.updated + sep + (date || today()));
  return md.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';
}

// 导出：没填的字段写成「待补：缺……」，不静默留空
function normalizeForExport(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const lang = docLang(md);
  const w = WORDS[lang];
  const sep = w.sep;
  return join(lines.map((l, i) => {
    if (i >= end || !isEmptyField(lines, i)) return l;
    const lv = splitLabel(info(l).body);
    const base = l.replace(/\s+$/, '');
    return base + (lang === 'en' && /:$/.test(base) ? ' ' : '') + w.tbd + sep + w.missing + lv.label;
  }));
}

// ---------- 给 AI 的话 ----------

function buildAiPrompt(md, schema, note, lang) {
  const L = LOC[lang] ? lang : DOC_LANGS[0];
  const d = LOC[L].doc;
  const body = String(md || '').trim();
  const hasContent = body && split(body).some((l) => info(l).kind === 'p' && !INSTRUCTION_LINE_RE.test(l.trim()) && !STATUS_WORD_RE.test(l));
  const template = String(((schema && schema[L]) || {}).planTemplate || '').trim();
  return d.promptRules.concat([
    '',
    '```markdown',
    template,
    '```',
    '',
    hasContent ? d.currentPlan : d.myIdea,
    '',
    hasContent ? body : String(note || d.ideaPlaceholder).trim(),
    '',
    hasContent && note ? d.extraNotes + '\n\n' + String(note).trim() + '\n' : '',
  ]).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// 导入的文字认不出计划书格式时，包成一份计划书，原文放进「未识别」
function wrapUnrecognised(text, name, lang, date) {
  const L = LOC[lang] ? lang : DOC_LANGS[0];
  const d = LOC[L].doc;
  return [
    '# ' + d.title + d.sep + (name || d.projectName), '',
    d.status + d.sep + d.states.doing + '　　' + d.updated + d.sep + (date || today()), '',
    '## ' + d.unrecognised, '',
  ].concat(String(text).split('\n')).join('\n');
}

// ---------- 反馈 ----------

// 把选取的元素、截图、页面报错和一句话合成一段能直接贴给 AI 的话
// d: { text, page, view, element, styles, errors, shot }  shot 是附图的说明（文件名或「已复制」）
function buildFeedback(d, lang) {
  const F = LOC[LOC[lang] ? lang : DOC_LANGS[0]].doc.feedback;
  const out = [];
  if (d.page || d.view) out.push(F.page + [d.page, d.view].filter(Boolean).join('  '));
  if (d.element) out.push(F.element + d.element);
  if (d.styles) out.push(F.styles + d.styles);
  (d.summary || []).forEach((l) => out.push(l));
  if (d.shot) out.push(F.shot + d.shot);
  out.push('', String(d.text || '').trim() || F.placeholder);
  if (d.errors && d.errors.length) {
    out.push('', F.errors);
    d.errors.forEach((e) => out.push('- ' + e));
  }
  return out.join('\n') + '\n';
}

module.exports = {
  SEC, WORDS, PLAN_NAMES, FILE_PREFIXES, PLAN_FILE_RE, TBD_RE, TBD_LABEL_RE, TBD_ALT, TBD_START_RE, issuePrefix, wrapUnrecognised,
  split, join, info, splitLabel, today, timeStamp, docLang,
  rangeEnd, bodyRange, bodyText, setBody, deleteSubtree, sectionNo, headings,
  pendingList, countPending, getStatus, statusLabel, setStatus, markPassed,
  titleName, setTitle, structure, nextNumber, checkName,
  progressList, setProgress, nextProgress, issueList, addIssue, addIssues, setIssueDone, setIssueState, nextIssueState, merge3,
  addBlock, renameBlock, addFlowLine, blankPlan, normalizeForExport, hasOriginal, setOriginal,
  FEATURE_FILE_RE, featureFileFor, makeFeatureList, isFeatureList, workStarted,
  buildAiPrompt, buildFeedback,
};
