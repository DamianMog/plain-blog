// Turns GitHub-style alert blockquotes into styled callouts:
//
//   > [!NOTE]
//   > Useful information.
//
// Supported types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.

const TYPES = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const MARKER = /^\s*\[!(note|tip|important|warning|caution)\][ \t]*\r?\n?/i;

function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

export function rehypeAlerts() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'blockquote') return;

      const firstParagraph = node.children.find(
        (child) => child.type === 'element' && child.tagName === 'p',
      );
      const firstText = firstParagraph?.children?.[0];
      if (!firstText || firstText.type !== 'text') return;

      const match = firstText.value.match(MARKER);
      if (!match) return;

      const kind = match[1].toLowerCase();
      firstText.value = firstText.value.slice(match[0].length);

      // Drop the paragraph entirely when the marker was alone on its line.
      const onlyWhitespace = firstParagraph.children.every(
        (child) => child.type === 'text' && child.value.trim() === '',
      );
      if (onlyWhitespace) {
        node.children = node.children.filter((child) => child !== firstParagraph);
      }

      node.properties = {
        ...node.properties,
        className: ['alert', `alert-${kind}`],
        role: 'note',
      };
      node.children.unshift({
        type: 'element',
        tagName: 'p',
        properties: { className: ['alert-title'] },
        children: [{ type: 'text', value: TYPES[kind] }],
      });
    });
  };
}
