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
