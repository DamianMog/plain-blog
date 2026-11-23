// Wraps every table in a scrollable region so wide tables never break the
// page layout on small screens. The wrapper is focusable, which lets keyboard
// users scroll it with the arrow keys.

function wrap(table) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['table-scroll'],
      tabIndex: 0,
      role: 'region',
      ariaLabel: 'Table (scrollable)',
    },
    children: [table],
  };
}

function visit(parent) {
  if (!Array.isArray(parent.children)) return;

  parent.children = parent.children.map((child) => {
    visit(child);
    return child.type === 'element' && child.tagName === 'table' ? wrap(child) : child;
  });
}

export function rehypeWrapTables() {
  return (tree) => visit(tree);
}
