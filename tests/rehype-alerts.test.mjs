import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rehypeAlerts } from '../src/plugins/rehype-alerts.mjs';
import { rehypeWrapTables } from '../src/plugins/rehype-wrap-tables.mjs';

const text = (value) => ({ type: 'text', value });
const el = (tagName, children = [], properties = {}) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const root = (...children) => ({ type: 'root', children });

const run = (plugin, tree) => {
  plugin()(tree);
  return tree;
};

test('marker on its own line becomes an alert and the marker is removed', () => {
  const quote = el('blockquote', [text('\n'), el('p', [text('[!NOTE]\nUseful information.')]), text('\n')]);
  run(rehypeAlerts, root(quote));

  assert.deepEqual(quote.properties.className, ['alert', 'alert-note']);
  const [title, ...rest] = quote.children;
  assert.equal(title.properties.className[0], 'alert-title');
  assert.equal(title.children[0].value, 'Note');
  const paragraph = rest.find((child) => child.tagName === 'p');
  assert.equal(paragraph.children[0].value, 'Useful information.');
});

test('every alert type is recognised, case-insensitively', () => {
  for (const [marker, label] of [
    ['note', 'Note'],
    ['TIP', 'Tip'],
    ['Important', 'Important'],
    ['warning', 'Warning'],
    ['CAUTION', 'Caution'],
  ]) {
    const quote = el('blockquote', [el('p', [text(`[!${marker}]\nBody`)])]);
    run(rehypeAlerts, root(quote));
    assert.equal(quote.children[0].children[0].value, label);
  }
});

test('a marker alone in its paragraph leaves the following paragraphs intact', () => {
  const quote = el('blockquote', [el('p', [text('[!WARNING]')]), el('p', [text('Be careful.')])]);
  run(rehypeAlerts, root(quote));

  assert.equal(quote.children.length, 2);
  assert.equal(quote.children[1].children[0].value, 'Be careful.');
});

test('a hard line break after the marker is removed', () => {
  const quote = el('blockquote', [el('p', [text('[!TIP]'), el('br'), text('\nText')])]);
  run(rehypeAlerts, root(quote));

  const paragraph = quote.children[1];
  assert.equal(paragraph.children.some((child) => child.tagName === 'br'), false);
});

test('plain blockquotes are left alone', () => {
  const quote = el('blockquote', [el('p', [text('Just a quote.')])]);
  run(rehypeAlerts, root(quote));

  assert.equal(quote.properties.className, undefined);
  assert.equal(quote.children.length, 1);
});

test('a marker in the middle of a blockquote is ignored', () => {
  const quote = el('blockquote', [el('h2', [text('Heading')]), el('p', [text('[!TIP]\nText')])]);
  run(rehypeAlerts, root(quote));

  assert.equal(quote.properties.className, undefined);
});

test('a marker followed by text on the same line is ignored, as on GitHub', () => {
  const quote = el('blockquote', [el('p', [text('[!NOTE] inline text')])]);
  run(rehypeAlerts, root(quote));

  assert.equal(quote.properties.className, undefined);
});

test('tables are wrapped in a focusable scroll region, once', () => {
  const table = el('table');
  const tree = root(el('p'), table);
  run(rehypeWrapTables, tree);

  const wrapper = tree.children[1];
  assert.equal(wrapper.tagName, 'div');
  assert.deepEqual(wrapper.properties.className, ['table-scroll']);
  assert.equal(wrapper.properties.tabIndex, 0);
  assert.equal(wrapper.children.length, 1);
  assert.equal(wrapper.children[0], table);
});

test('tables nested in other elements are wrapped too', () => {
  const table = el('table');
  const tree = root(el('div', [table]));
  run(rehypeWrapTables, tree);

  assert.equal(tree.children[0].children[0].tagName, 'div');
  assert.equal(tree.children[0].children[0].children[0], table);
});
