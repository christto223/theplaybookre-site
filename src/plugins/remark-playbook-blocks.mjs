// Remark plugin: transforms The Playbook RE's custom article directives into
// the styled markup defined in src/styles/global.css. Pairs with
// remark-directive (which parses ::: syntax into containerDirective nodes).
// No external deps — a small recursive walk + the mdast `data.hName` escape
// hatch (mdast-util-to-hast renders any node as that element with its children).
//
// Supported container directives (authoring syntax in docs/article-content-elements.md):
//   :::callout            :::warning            :::phase
//   :::takeaways          :::stat{value="…"}    :::quickfacts
//   :::quote{cite="…"}    :::protip             :::verdict{title="…"}
//   :::proscons           :::checklist{title="…"}  :::newsletter{heading="…"}
// Plus: ✓ / ✗ inside markdown table cells are auto color-coded.

export function remarkPlaybookBlocks() {
  return function (tree) {
    walk(tree);
  };
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type === 'containerDirective') transform(child);
    if (child.type === 'table') colorizeTableChecks(child);
    walk(child);
  }
}

// ── helpers ──────────────────────────────────────────────────────────
function el(hName, className, children, props) {
  const hProperties = Object.assign({}, props || {});
  if (className) hProperties.className = Array.isArray(className) ? className : [className];
  return { type: 'pbElement', data: { hName, hProperties }, children: children || [] };
}
function txt(value) { return { type: 'text', value: String(value) }; }
function asEl(node, hName, className, props) {
  node.data = node.data || {};
  node.data.hName = hName;
  node.data.hProperties = Object.assign({}, props || {});
  if (className) node.data.hProperties.className = Array.isArray(className) ? className : [className];
}
function attr(node, key) {
  return (node.attributes && node.attributes[key]) || '';
}
function groupByHeading(children, depth) {
  const groups = [];
  let cur = null;
  for (const child of children) {
    if (child.type === 'heading' && child.depth === depth) {
      cur = { heading: child, rest: [] };
      groups.push(cur);
    } else if (cur) {
      cur.rest.push(child);
    }
  }
  return groups;
}

// ── directive router ─────────────────────────────────────────────────
function transform(node) {
  switch (node.name) {
    case 'callout':   return asEl(node, 'div', 'callout-block');
    case 'warning':   return asEl(node, 'div', 'warning-block');
    case 'protip':    return asEl(node, 'div', 'protip-block');
    case 'takeaways': return asEl(node, 'div', 'takeaways-block');
    case 'phase':     return buildPhase(node);
    case 'stat':      return buildStat(node);
    case 'quickfacts':return buildQuickFacts(node);
    case 'quote':     return buildQuote(node);
    case 'verdict':   return buildVerdict(node);
    case 'proscons':  return buildProsCons(node);
    case 'checklist': return buildChecklist(node);
    case 'newsletter':return buildNewsletter(node);
    default: return;
  }
}

function buildPhase(node) {
  const rows = groupByHeading(node.children, 3);
  node.children = rows.map((row, i) =>
    el('div', 'phase-row', [
      el('div', 'phase-num-cell', [
        el('span', 'phase-num-badge', [txt(i + 1)]),
        el('span', 'phase-connector', []),
      ]),
      el('div', 'phase-content', [row.heading, ...row.rest]),
    ])
  );
  asEl(node, 'div', 'phase-block');
}

function buildStat(node) {
  const value = attr(node, 'value');
  node.children = [
    el('div', 'stat-callout-num', [txt(value)]),
    el('div', 'stat-callout-text', node.children),
  ];
  asEl(node, 'div', 'stat-callout');
}

function buildQuickFacts(node) {
  const list = node.children.find((c) => c.type === 'list');
  const cells = list ? list.children.map((li) => el('div', 'qf-cell', li.children)) : [];
  node.children = cells;
  asEl(node, 'div', 'qf-grid');
}

function buildQuote(node) {
  const cite = attr(node, 'cite');
  const kids = node.children.slice();
  if (cite) kids.push(el('div', 'pull-quote-cite', [txt(cite)]));
  node.children = kids;
  asEl(node, 'blockquote', 'pull-quote');
}

function buildVerdict(node) {
  const title = attr(node, 'title');
  const kids = [];
  if (title) kids.push(el('div', 'verdict-headline', [txt(title)]));
  kids.push(...node.children);
  node.children = kids;
  asEl(node, 'div', 'verdict-block');
}

function buildProsCons(node) {
  const groups = groupByHeading(node.children, 3);
  node.children = groups.map((g, i) =>
    el('div', ['proscons-col', i === 0 ? 'proscons-pros' : 'proscons-cons'], [g.heading, ...g.rest])
  );
  asEl(node, 'div', 'proscons-grid');
}

function buildChecklist(node) {
  const title = attr(node, 'title');
  const kids = [];
  if (title) kids.push(el('div', 'checklist-title', [txt(title)]));
  kids.push(...node.children);
  node.children = kids;
  asEl(node, 'div', 'checklist-block');
}

function buildNewsletter(node) {
  const heading = attr(node, 'heading') || 'Get the playbook in your inbox.';
  node.children = [
    el('div', 'inline-cta-text', [
      el('div', 'inline-cta-label', [txt('The Newsletter')]),
      el('div', 'inline-cta-headline', [txt(heading)]),
    ]),
    el('button', 'inline-cta-btn', [txt('Subscribe Free →')], { type: 'button' }),
  ];
  asEl(node, 'div', 'inline-cta');
}

// ── ✓ / ✗ color-coding inside markdown table cells ───────────────────
function colorizeTableChecks(node) {
  if (!Array.isArray(node.children)) return;
  const out = [];
  for (const child of node.children) {
    if (child.type === 'text' && (child.value.includes('✓') || child.value.includes('✗'))) {
      out.push(...splitChecks(child.value));
    } else {
      colorizeTableChecks(child);
      out.push(child);
    }
  }
  node.children = out;
}
function splitChecks(value) {
  const parts = [];
  let buf = '';
  for (const ch of value) {
    if (ch === '✓' || ch === '✗') {
      if (buf) { parts.push(txt(buf)); buf = ''; }
      parts.push(el('span', ch === '✓' ? 'cell-yes' : 'cell-no', [txt(ch)]));
    } else {
      buf += ch;
    }
  }
  if (buf) parts.push(txt(buf));
  return parts;
}
