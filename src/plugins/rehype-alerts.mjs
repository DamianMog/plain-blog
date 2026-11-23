// Turns GitHub-style alert blockquotes into styled callouts:
//
//   > [!NOTE]
//   > Useful information.
//
// Supported types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.
// As on GitHub, the marker must be on a line of its own.

const TYPES = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

const MARKER = /^\s*\[!(note|tip|important|warning|caution)\][ \t]*(?:\r?\n|$)/i;

function walk(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, fn);
  }
}

const isElement = (node, tagName) =>
  node && node.type === 'element' && (tagName === undefined || node.tagName === tagName);

export function rehypeAlerts() {
  return (tree) => {
    walk(tree, (node) => {
      if (!isElement(node, 'blockquote')) return;

      // The marker only counts at the very start of the blockquote.
      const firstElement = node.children.find((child) => isElement(child));
      if (!isElement(firstElement, 'p')) return;

      const firstText = firstElement.children[0];
      if (!firstText || firstText.type !== 'text') return;

      const match = firstText.value.match(MARKER);
      if (!match) return;

      const kind = match[1].toLowerCase();
      firstText.value = firstText.value.slice(match[0].length);

      // "[!NOTE]" followed by two trailing spaces produces a hard line break.
      if (firstText.value === '' && isElement(firstElement.children[1], 'br')) {
        firstElement.children.splice(1, 1);
      }

      // Drop the paragraph entirely when the marker was alone on its line.
      const onlyWhitespace = firstElement.children.every(
        (child) => child.type === 'text' && child.value.trim() === '',
      );
      if (onlyWhitespace) {
        node.children = node.children.filter((child) => child !== firstElement);
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
