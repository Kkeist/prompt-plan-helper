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
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const plan = read('计划书.md');
const tplZh = read('templates', 'zh', 'plan.md');
const tplEn = read('templates', 'en', 'plan.md');
const exZh = read('templates', 'zh', 'example.md');
const exEn = read('templates', 'en', 'example.md');

test('待补：按出现位置统计，被引号包住的说明不算', () => {
  const list = Core.pendingList(plan);
  assert.ok(list.some((x) => /待补：缺开发顺序/.test(x.text)));
  assert.ok(list.every((x) => !/^已通过\s*=/.test(x.text)));
  assert.equal(Core.countPending('规则：写成「待补：缺什么」就行'), 0);
  assert.equal(Core.countPending('Rule: write "TBD: what is missing" in place'), 0);
});

test('状态读写：中文和英文', () => {
  assert.equal(Core.getStatus(plan), 'doing');
  assert.equal(Core.getStatus(exEn), 'doing');
  const next = Core.setStatus(plan, 'approved', '2026-01-02');
  assert.match(next, /状态：已通过　　更新：2026-01-02/);
  const en = Core.setStatus(exEn, 'approved', '2026-01-02');
  assert.match(en, /Status: Approved　　Updated: 2026-01-02/);
  assert.equal(Core.getStatus(en), 'approved');
});

test('有待补时不能通过，没有时可以', () => {
  const r = Core.markPassed(plan);
  assert.equal(r.ok, false);
  const clean = plan.replace(/待补[：:][^\n]*/g, '已定。').replace(/〈[^〉]*〉/g, '已定。');
  const r2 = Core.markPassed(clean, '2026-01-02');
  assert.equal(r2.ok, true, JSON.stringify(Core.pendingList(clean)));
  assert.equal(Core.getStatus(r2.md), 'approved');
});

test('示例计划书没有待补', () => {
  assert.equal(Core.countPending(exZh), 0, JSON.stringify(Core.pendingList(exZh)));
  assert.equal(Core.countPending(exEn), 0, JSON.stringify(Core.pendingList(exEn)));
});

test('语言识别', () => {
  assert.equal(Core.docLang(exZh), 'zh');
  assert.equal(Core.docLang(exEn), 'en');
  assert.equal(Core.docLang(tplEn), 'en');
});

test('页面、功能、东西、情况结构：中文和英文一致', () => {
  for (const md of [exZh, exEn]) {
    const s = Core.structure(md);
    assert.equal(s.pages.length, 2);
    assert.equal(s.features.length, 2);
    assert.equal(s.widgets.length, 5);
    assert.equal(s.cases.length, 5);
  }
  const pos = Core.positions(exEn);
  assert.ok(pos.some((p) => p.kind === 'feature' && /Feature 4\.1 Countdown/.test(p.label)));
  assert.ok(pos.some((p) => p.kind === 'widget' && /Timer screen › Start button/.test(p.label)));
});

test('项目自己的计划书能解析', () => {
  const s = Core.structure(plan);
  assert.ok(s.pages.length >= 2);
  assert.ok(s.features.length >= 5);
  assert.ok(Core.progressList(plan).every((x) => ['todo', 'doing', 'done'].indexOf(x.status) >= 0));
});

test('模板里没有开发顺序和实现方案，也没有只有程序员才懂的词', () => {
  for (const t of [tplZh, tplEn, exZh, exEn]) {
    assert.ok(!/开发顺序|实现方案|AI 的做法|Build order|How the AI builds/.test(t));
  }
  for (const t of [tplZh, exZh]) assert.ok(!/导入|导出|快捷键|浏览器|数据库|接口|函数/.test(t.replace(/最初的描述[\s\S]*$/, '')));
});

test('进度：读取、设置、循环', () => {
  const list = Core.progressList(exZh);
  assert.deepEqual(list.map((x) => x.status), ['done', 'doing']);
  assert.match(list[0].what, /倒计时/);
  const md = Core.setProgress(exZh, list[1].line, 'done');
  assert.equal(Core.progressList(md)[1].status, 'done');
  assert.match(md, /进度：已完成/);
  const en = Core.setProgress(exEn, Core.progressList(exEn)[0].line, 'todo');
  assert.match(en, /Progress: Not started/);
  assert.equal(Core.nextProgress('todo'), 'doing');
  assert.equal(Core.nextProgress('done'), 'todo');
  // 没有进度行时补一行
  const lines = Core.split(exZh).filter((l) => !/^进度：/.test(l));
  const added = Core.setProgress(Core.join(lines), Core.progressList(Core.join(lines))[0].line, 'doing');
  assert.equal(Core.progressList(added)[0].status, 'doing');
});

test('新增页面和功能：为空、重名被拒绝，成功后编号递增', () => {
  assert.equal(Core.addBlock(exZh, 'page', '  ').code, 'empty');
  assert.equal(Core.addBlock(exZh, 'feature', '倒计时').code, 'duplicate');
  const r = Core.addBlock(exZh, 'feature', '全新功能');
  assert.equal(r.ok, true);
  assert.match(r.md, /### 4\.3 全新功能/);
  assert.match(r.md, /进度：未做/);
  assert.equal(Core.info(Core.split(r.md)[r.line]).body, '4.3 全新功能');
  const en = Core.addBlock(exEn, 'page', 'About');
  assert.match(en.md, /### 3\.3 About/);
  assert.match(en.md, /What this screen is for:/);
});

test('改名：重名被拒绝，保留编号', () => {
  const i = Core.split(exZh).findIndex((l) => /^### 4\.2\b/.test(l));
  assert.equal(Core.renameBlock(exZh, i, '倒计时').code, 'duplicate');
  const r = Core.renameBlock(exZh, i, '每日轮数');
  assert.match(r.md, /### 4\.2 每日轮数/);
});

test('删除块再撤销：快照里内容不变', () => {
  const lines = Core.split(exZh);
  const i = lines.findIndex((l) => /^### 4\.1\b/.test(l));
  const deleted = Core.join(Core.deleteSubtree(lines, i));
  assert.equal(Core.structure(deleted).features.length, 1);
  assert.equal(Core.structure(exZh).features.length, 2);
});

test('块正文读写：只换这一块，别处不动', () => {
  const lines = Core.split(exZh);
  const i = lines.findIndex((l) => /^### 4\.1\b/.test(l));
  const before = Core.bodyText(lines, i);
  assert.match(before, /它做什么：按设定的分钟数倒计时/);
  const md = Core.setBody(exZh, i, before.replace('倒计时，结束时提醒', '倒计时，结束时响铃'));
  assert.match(md, /结束时响铃/);
  assert.equal(Core.structure(md).features.length, 2);
  assert.equal(Core.setBody(exZh, i, before).replace(/\n{3,}/g, '\n\n'), exZh.replace(/\n{3,}/g, '\n\n'));
});

test('空白计划书：中文和英文都没有说明行，带状态，字段为空时导出写待补', () => {
  const zh = Core.blankPlan(tplZh, '示例', '2026-01-02');
  assert.match(zh, /^# 计划书：示例/m);
  assert.match(zh, /状态：草稿　　更新：2026-01-02/);
  assert.ok(!/最初的描述/.test(zh));
  assert.ok(Core.countPending(zh) > 5);
  assert.match(Core.normalizeForExport(zh), /这是什么：待补：缺这是什么/);
  const en = Core.blankPlan(tplEn, 'Demo', '2026-01-02');
  assert.match(en, /^# Plan: Demo/m);
  assert.match(en, /Status: Draft　　Updated: 2026-01-02/);
  assert.ok(!/Original description/.test(en));
  assert.match(Core.normalizeForExport(en), /What it is: TBD: missing What it is/);
});

test('空白计划书加流程、加页面后仍能结构化', () => {
  const md = Core.blankPlan(tplEn, 'Demo', '2026-01-02');
  const f = Core.addFlowLine(md);
  assert.equal(f.ok, true);
  assert.match(Core.split(f.md)[f.line], /〈Name〉: TBD/);
  const p = Core.addBlock(f.md, 'page', 'Home');
  assert.equal(p.ok, true);
  assert.equal(Core.structure(p.md).pages.length, 2);
});

test('导出再导入：文本不变', () => {
  assert.equal(Core.join(Core.split(exZh)), exZh);
});

test('反馈：把元素、样式、页面报错和一句话合成一段话', () => {
  const d = {
    text: '字太小了', page: 'http://localhost:5173/', view: '1280×800', element: 'button.save（文字「保存」）',
    styles: 'font-size 12px', errors: ['10:00:01 TypeError: x is not a function'], shot: '截图已复制',
  };
  const zh = Core.buildFeedback(d, 'zh');
  assert.match(zh, /我指的东西：button\.save/);
  assert.match(zh, /截图：截图已复制/);
  assert.match(zh, /页面最近的报错：\n- 10:00:01 TypeError/);
  const en = Core.buildFeedback(d, 'en');
  assert.match(en, /The thing I mean: button\.save/);
  assert.match(en, /Recent errors on the page:/);
  assert.match(Core.buildFeedback({}, 'zh'), /在这里写想怎么改/);
});

test('给 AI 的话：中英文都带格式，不要求用户写做法', () => {
  const schema = { zh: { planTemplate: tplZh }, en: { planTemplate: tplEn } };
  const p = Core.buildAiPrompt('', schema, '做一个计时器', 'zh');
  assert.match(p, /做一个计时器/);
  assert.match(p, /一行写完/);
  assert.match(p, /我不懂代码/);
  const pe = Core.buildAiPrompt('', schema, 'a timer', 'en');
  assert.match(pe, /Use only what I have said/);
  assert.match(pe, /I do not know code/);
});
