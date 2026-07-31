import { visit } from 'unist-util-visit';

/**
 * Renders ```trace fenced blocks as the incident-trace <pre>.
 *
 * A fenced block is used rather than a component prop because MDX strips
 * indentation from multi-line JSX attribute values, and column alignment is
 * the whole point of a trace. Runs at the remark stage, so Shiki never sees it.
 *
 *   ```trace
 *   SELECT p99 ....  42 ms → 610 ms   ~~this one~~
 *   INSERT p99 ....   6 ms →   7 ms   ++unchanged++
 *   **verdict: READ-BOUND**
 *   ```
 *
 *   **bold**  → emphasis    ++text++ → good (green)    ~~text~~ → bad (red)
 */
const MARKER = /\*\*(.+?)\*\*|\+\+(.+?)\+\+|~~(.+?)~~/g;

// Emitted as an expression, not bare JSX text, so JSX whitespace trimming
// cannot touch the alignment.
const textNode = (value) => ({
  type: 'mdxTextExpression',
  value: JSON.stringify(value),
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
      comments: [],
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'Literal', value, raw: JSON.stringify(value) },
        },
      ],
    },
  },
});

const markedNode = (name, className, value) => ({
  type: 'mdxJsxTextElement',
  name,
  attributes: className
    ? [{ type: 'mdxJsxAttribute', name: 'class', value: className }]
    : [],
  children: [textNode(value)],
});

function parseTrace(body) {
  const children = [];
  let last = 0;

  for (const match of body.matchAll(MARKER)) {
    if (match.index > last) children.push(textNode(body.slice(last, match.index)));

    const [full, bold, good, bad] = match;
    if (bold !== undefined) children.push(markedNode('b', null, bold));
    else if (good !== undefined) children.push(markedNode('span', 'good', good));
    else children.push(markedNode('span', 'bad', bad));

    last = match.index + full.length;
  }

  if (last < body.length) children.push(textNode(body.slice(last)));
  return children;
}

export function remarkTrace() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'trace' || !parent || index === null) return;

      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'pre',
        attributes: [{ type: 'mdxJsxAttribute', name: 'class', value: 'trace' }],
        children: parseTrace(node.value),
      };
    });
  };
}
