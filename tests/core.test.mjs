// 运行：node --test tests/core.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Core = require('../src/core.js');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8').replace(/\r\n/g, '\n');
const plan = read('计划书.md');
const tplZh = read('templates', 'zh', 'plan.md');
const tplEn = read('templates', 'en', 'plan.md');
const exampleZh = read('templates', 'zh', 'example.md');
const exampleEn = read('templates', 'en', 'example.md');
const timerZh = read('tests', 'fixtures', 'timer.zh.md');
const timerEn = read('tests', 'fixtures', 'timer.en.md');

test('待补：按出现位置统计，被引号包住的说明不算', () => {
  assert.equal(Core.countPending('规则：写成「待补：缺什么」就行'), 0);
  assert.equal(Core.countPending('Rule: write "TBD: what is missing" in place'), 0);
  assert.equal(Core.countPending('作用：待补：缺作用'), 1);
  assert.equal(Core.countPending('做什么：〈名字〉'), 1);
});

test('状态读写：中文和英文', () => {
  assert.equal(Core.getStatus(timerZh), 'doing');
  assert.equal(Core.getStatus(timerEn), 'doing');
  assert.match(Core.setStatus(timerZh, 'approved', '2026-01-02'), /状态：已通过　　更新：2026-01-02/);
  const en = Core.setStatus(timerEn, 'approved', '2026-01-02');
  assert.match(en, /Status: Approved　　Updated: 2026-01-02/);
  assert.equal(Core.getStatus(en), 'approved');
});

test('有待补时不能通过，没有时可以', () => {
  const dirty = timerZh.replace('怎么来到这个页面：一打开就是它', '怎么来到这个页面：');
  const r = Core.markPassed(dirty);
  assert.equal(r.ok, false);
  assert.equal(r.pending, 1);
  const r2 = Core.markPassed(timerZh, '2026-01-02');
  assert.equal(r2.ok, true);
  assert.equal(Core.getStatus(r2.md), 'approved');
});

test('示例和这个项目自己的计划书：没有待补，可以读取', () => {
  for (const md of [timerZh, timerEn, exampleZh, exampleEn, plan]) {
    assert.equal(Core.countPending(md), 0, JSON.stringify(Core.pendingList(md)));
  }
  assert.equal(exampleZh, plan);
});

test('语言识别', () => {
  assert.equal(Core.docLang(timerZh), 'zh');
  assert.equal(Core.docLang(timerEn), 'en');
  assert.equal(Core.docLang(tplEn), 'en');
  assert.equal(Core.docLang(exampleEn), 'en');
});

test('页面、功能、东西、情况结构：中文和英文一致', () => {
  for (const md of [timerZh, timerEn]) {
    const s = Core.structure(md);
    assert.equal(s.pages.length, 2);
    assert.equal(s.features.length, 2);
    assert.equal(s.widgets.length, 5);
    assert.equal(s.cases.length, 5);
  }
  const pos = Core.positions(timerEn);
  assert.ok(pos.some((p) => p.kind === 'feature' && /Feature 4\.1 Countdown/.test(p.label)));
  assert.ok(pos.some((p) => p.kind === 'widget' && /Timer page › Start button/.test(p.label)));
  const a = Core.structure(exampleZh);
  const b = Core.structure(exampleEn);
  assert.equal(a.pages.length, b.pages.length);
  assert.equal(a.features.length, b.features.length);
});

test('进度：读取、设置、循环', () => {
  const list = Core.progressList(timerZh);
  assert.deepEqual(list.map((x) => x.status), ['done', 'doing']);
  assert.match(list[0].what, /倒计时/);
  const md = Core.setProgress(timerZh, list[1].line, 'done');
  assert.equal(Core.progressList(md)[1].status, 'done');
  assert.match(md, /进度：已完成/);
  assert.match(Core.setProgress(timerEn, Core.progressList(timerEn)[0].line, 'todo'), /Progress: Not started/);
  assert.equal(Core.nextProgress('todo'), 'doing');
  assert.equal(Core.nextProgress('done'), 'todo');
  const lines = Core.split(timerZh).filter((l) => !/^进度：/.test(l));
  const without = Core.join(lines);
  assert.equal(Core.progressList(Core.setProgress(without, Core.progressList(without)[0].line, 'doing'))[0].status, 'doing');
});

test('问题：加、标记已修、删除，中英文都行', () => {
  const f = Core.issueList(timerZh)[0];
  const r = Core.addIssue(timerZh, f.featureLine, '点暂停后数字仍在走', '2026-01-02');
  assert.equal(r.ok, true);
  assert.match(r.md, /问题：\n- 点暂停后数字仍在走（2026-01-02）\n进度：已完成/);
  const second = Core.addIssue(r.md, f.featureLine, '关闭再打开没有回到设定值', '2026-01-03');
  const items = Core.issueList(second.md)[0].items;
  assert.equal(items.length, 2);
  assert.equal(items[0].done, false);
  const fixed = Core.setIssueDone(second.md, items[0].line, true);
  assert.match(fixed, /- 已修：点暂停后数字仍在走/);
  assert.equal(Core.issueList(fixed)[0].items[0].done, true);
  assert.equal(Core.issueList(fixed)[0].items[0].text, '点暂停后数字仍在走（2026-01-02）');
  assert.equal(Core.issueList(Core.setIssueDone(fixed, items[0].line, false))[0].items[0].done, false);
  assert.equal(Core.addIssue(timerZh, f.featureLine, '   ').ok, false);
  // 问题下面的列表删空后，不算「没填」
  const emptied = Core.join(Core.deleteSubtree(Core.split(r.md), Core.issueList(r.md)[0].items[0].line));
  assert.equal(Core.countPending(emptied), 0);
  const en = Core.addIssue(timerEn, Core.issueList(timerEn)[0].featureLine, 'The number keeps counting', '2026-01-02');
  assert.match(en.md, /Issues:\n- The number keeps counting \(?|（2026-01-02）/);
  assert.equal(Core.issueList(en.md)[0].items.length, 1);
});

test('新增页面和功能：为空、重名被拒绝，成功后编号递增', () => {
  assert.equal(Core.addBlock(timerZh, 'page', '  ').code, 'empty');
  assert.equal(Core.addBlock(timerZh, 'feature', '倒计时').code, 'duplicate');
  const r = Core.addBlock(timerZh, 'feature', '全新功能');
  assert.equal(r.ok, true);
  assert.match(r.md, /### 4\.3 全新功能/);
  assert.match(r.md, /进度：未做/);
  assert.equal(Core.info(Core.split(r.md)[r.line]).body, '4.3 全新功能');
  const en = Core.addBlock(timerEn, 'page', 'About');
  assert.match(en.md, /### 3\.3 About/);
  assert.match(en.md, /What this page is for:/);
});

test('改名：重名被拒绝，保留编号', () => {
  const i = Core.split(timerZh).findIndex((l) => /^### 4\.2\b/.test(l));
  assert.equal(Core.renameBlock(timerZh, i, '倒计时').code, 'duplicate');
  assert.match(Core.renameBlock(timerZh, i, '每日轮数').md, /### 4\.2 每日轮数/);
});

test('删除块再撤销：快照里内容不变', () => {
  const lines = Core.split(timerZh);
  const i = lines.findIndex((l) => /^### 4\.1\b/.test(l));
  const deleted = Core.join(Core.deleteSubtree(lines, i));
  assert.equal(Core.structure(deleted).features.length, 1);
  assert.equal(Core.structure(timerZh).features.length, 2);
});

test('块正文读写：只换这一块，别处不动', () => {
  const lines = Core.split(timerZh);
  const i = lines.findIndex((l) => /^### 4\.1\b/.test(l));
  const before = Core.bodyText(lines, i);
  assert.match(before, /它做什么：按设定的分钟数倒计时/);
  const md = Core.setBody(timerZh, i, before.replace('结束时提醒', '结束时响铃'));
  assert.match(md, /结束时响铃/);
  assert.equal(Core.structure(md).features.length, 2);
  assert.equal(Core.setBody(timerZh, i, before).replace(/\n{3,}/g, '\n\n'), timerZh.replace(/\n{3,}/g, '\n\n'));
});

test('空白计划书：中文和英文都没有说明行，带状态，字段为空时导出写待补', () => {
  const zh = Core.blankPlan(tplZh, '示例', '2026-01-02');
  assert.match(zh, /^# 计划书：示例/m);
  assert.match(zh, /状态：草稿　　更新：2026-01-02/);
  assert.ok(!/最初的描述/.test(zh));
  assert.ok(Core.countPending(zh) > 10);
  assert.match(Core.normalizeForExport(zh), /这是什么：待补：缺这是什么/);
  const en = Core.blankPlan(tplEn, 'Demo', '2026-01-02');
  assert.match(en, /^# Plan: Demo/m);
  assert.match(en, /Status: Draft　　Updated: 2026-01-02/);
  assert.match(Core.normalizeForExport(en), /What it is: TBD: missing What it is/);
});

test('空白计划书加用法、加页面后仍能结构化', () => {
  const md = Core.blankPlan(tplEn, 'Demo', '2026-01-02');
  const f = Core.addFlowLine(md);
  assert.equal(f.ok, true);
  assert.match(Core.split(f.md)[f.line], /〈Name〉: TBD/);
  const p = Core.addBlock(f.md, 'page', 'Home');
  assert.equal(p.ok, true);
  assert.equal(Core.structure(p.md).pages.length, 2);
});

test('模板里没有开发顺序、实现方案、分享方式，也没有只有程序员才懂的词', () => {
  for (const t of [tplZh, tplEn, timerZh, timerEn]) {
    assert.ok(!/开发顺序|实现方案|AI 的做法|Build order|How the AI builds|怎么给别人用|How others will get/.test(t));
  }
  for (const t of [tplZh, timerZh]) assert.ok(!/导入|导出|快捷键|浏览器|数据库|接口|函数/.test(t.replace(/最初的描述[\s\S]*$/, '')));
});

test('导出再导入：文本不变', () => {
  assert.equal(Core.join(Core.split(timerZh)), timerZh);
});

test('反馈：把元素、样式、页面信息、报错和说明合成一段话', () => {
  const d = {
    text: '字太小了', page: 'http://localhost:5173/', view: '1280×800', element: 'button.save（文字「保存」）',
    styles: 'font-size 12px', summary: ['页面标题：示例'], errors: ['10:00:01 TypeError: x is not a function'], shot: '截图已复制',
  };
  const zh = Core.buildFeedback(d, 'zh');
  assert.match(zh, /我指的东西：button\.save/);
  assert.match(zh, /页面标题：示例/);
  assert.match(zh, /截图：截图已复制/);
  assert.match(zh, /页面最近的报错：\n- 10:00:01 TypeError/);
  assert.match(Core.buildFeedback(d, 'en'), /Recent errors on the page:/);
});

test('给 AI 的话：中英文都带格式，不要求用户写做法', () => {
  const schema = { zh: { planTemplate: tplZh }, en: { planTemplate: tplEn } };
  const p = Core.buildAiPrompt('', schema, '做一个计时器', 'zh');
  assert.match(p, /做一个计时器/);
  assert.match(p, /我不懂代码/);
  assert.match(Core.buildAiPrompt('', schema, 'a timer', 'en'), /I do not know code/);
});
