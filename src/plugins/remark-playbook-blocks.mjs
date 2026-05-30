// Remark plugin: turn :::callout, :::warning, and :::phase container
// directives into the styled markup defined in src/styles/global.css.
// Pairs with remark-directive (which parses the ::: syntax into
// containerDirective nodes). No external deps — a small recursive walk.

export function remarkPlaybookBlocks() {
  return function (tree) {
    walk(tree);
  };
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type === 'containerDirective') transform(child);
    walk(child);
  }
}

function asDiv(node, className) {
  node.data = node.data || {};
  node.data.hName = 'div';
  node.data.hProperties = { className: [className] };
}

function transform(node) {
  if (node.name === 'callout') {
    asDiv(node, 'callout-block');
    return;
  }

  if (node.name === 'warning') {
    asDiv(node, 'warning-block');
    return;
  }

  if (node.name === 'phase') {
    // Group children into rows: each `### heading` starts a new row and
    // collects the content that follows it until the next heading.
    const rows = [];
    let current = null;
    for (const child of node.children) {
      if (child.type === 'heading' && child.depth === 3) {
        current = { heading: child, rest: [] };
        rows.push(current);
      } else if (current) {
        current.rest.push(child);
      }
      // (content before the first heading is dropped — phases lead with one)
    }

    node.children = rows.map((row, i) => ({
      type: 'phaseRow',
      data: { hName: 'div', hProperties: { className: ['phase-row'] } },
      children: [
        {
          type: 'phaseNumCell',
          data: { hName: 'div', hProperties: { className: ['phase-num-cell'] } },
          children: [
            {
              type: 'phaseNumBadge',
              data: { hName: 'span', hProperties: { className: ['phase-num-badge'] } },
              children: [{ type: 'text', value: String(i + 1) }],
            },
            {
              type: 'phaseConnector',
              data: { hName: 'span', hProperties: { className: ['phase-connector'] } },
              children: [],
            },
          ],
        },
        {
          type: 'phaseContent',
          data: { hName: 'div', hProperties: { className: ['phase-content'] } },
          children: [row.heading, ...row.rest],
        },
      ],
    }));

    asDiv(node, 'phase-block');
  }
}
