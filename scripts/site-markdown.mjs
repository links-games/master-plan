// A small Markdown renderer for the master-plan website. It supports the
// subset the docs use: headings with GitHub-style anchors, paragraphs,
// nested lists, tables, block quotes, code fences, rules, links, images,
// code spans, bold and italics. Links pass through a caller-supplied
// `link(href)` function so .md links can point at the generated pages.

export const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// GitHub heading slugs: rendered text, lowercased, punctuation removed,
// every space turned into a hyphen, duplicates suffixed with -1, -2, ...
export function createSlugger() {
  const seen = new Map();
  return (heading) => {
    const base = heading
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-');
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

export function renderInline(text, link = (href) => href) {
  const tokens = [];
  const keep = (html) => `\uE000${tokens.push(html) - 1}\uE000`;
  let out = text
    .replace(/\\([\\`*_[\]()#|!-])/g, (_, char) => keep(escapeHtml(char)))
    .replace(/`([^`]+)`/g, (_, code) =>
      keep(`<code>${escapeHtml(code)}</code>`)
    )
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) =>
      keep(
        `<img src="${escapeHtml(link(src))}" alt="${escapeHtml(alt)}" loading="lazy">`
      )
    )
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      (_, label, href) =>
        `${keep(`<a href="${escapeHtml(link(href))}">`)}${label}${keep('</a>')}`
    );
  out = escapeHtml(out)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,;:)!?]|$)/g, '$1<em>$2</em>');
  // Tokens may contain other tokens (a linked image), so expand repeatedly.
  while (out.includes('\uE000')) {
    out = out.replace(/\uE000(\d+)\uE000/g, (_, index) => tokens[index]);
  }
  return out;
}

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE = /^\s*```/;
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

const indentOf = (line) => /^\s*/.exec(line)[0].length;

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim());
}

function startsBlock(line, next) {
  return (
    HEADING.test(line) ||
    FENCE.test(line) ||
    LIST_ITEM.test(line) ||
    RULE.test(line) ||
    /^\s*>/.test(line) ||
    (line.trim().startsWith('|') && TABLE_SEPARATOR.test(next ?? ''))
  );
}

function renderTable(lines, ctx) {
  const [head, , ...rows] = lines.map(splitRow);
  const cells = (row, tag) =>
    row
      .map((cell) => `<${tag}>${renderInline(cell, ctx.link)}</${tag}>`)
      .join('');
  return `<div class="table-wrap"><table><thead><tr>${cells(head, 'th')}</tr></thead><tbody>${rows
    .map((row) => `<tr>${cells(row, 'td')}</tr>`)
    .join('')}</tbody></table></div>`;
}

// Collects the lines of one list (items and their indented bodies).
const isOrdered = (line) => /^\s*\d/.test(line);

function takeList(lines, start) {
  const base = indentOf(lines[start]);
  const ordered = isOrdered(lines[start]);
  const sameList = (line) =>
    LIST_ITEM.test(line) &&
    (indentOf(line) > base || isOrdered(line) === ordered);
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (LIST_ITEM.test(line) && !sameList(line)) {
      break;
    }
    if (line.trim() === '') {
      const next = lines.slice(end + 1).find((l) => l.trim() !== '');
      if (!next || (indentOf(next) <= base && !LIST_ITEM.test(next))) {
        break;
      }
    } else if (indentOf(line) < base) {
      break;
    } else if (indentOf(line) === base && !LIST_ITEM.test(line)) {
      break;
    }
    end += 1;
  }
  return { base, block: lines.slice(start, end), end };
}

function renderList(block, base, ctx) {
  const ordered = isOrdered(block[0]);
  const items = [];
  for (const line of block) {
    const match = LIST_ITEM.exec(line);
    if (match && match[1].length === base) {
      items.push([match[3]]);
    } else {
      items.at(-1).push(line.slice(Math.min(indentOf(line), base + 2)));
    }
  }
  const tag = ordered ? 'ol' : 'ul';
  const body = items.map((item) => {
    const [head, ...rest] = item;
    let first = head;
    // Lazy continuation lines belong to the item's first paragraph.
    while (
      rest.length &&
      rest[0].trim() !== '' &&
      !startsBlock(rest[0], rest[1])
    ) {
      first += ` ${rest.shift().trim()}`;
    }
    const nested = rest.some((line) => line.trim() !== '');
    const tail = nested ? renderBlocks(rest, ctx) : '';
    return `<li>${renderInline(first, ctx.link)}${tail}</li>`;
  });
  return `<${tag}>${body.join('')}</${tag}>`;
}

function takeWhile(lines, start, test) {
  let end = start;
  while (end < lines.length && test(lines[end], lines[end + 1])) {
    end += 1;
  }
  return end;
}

// Each rule returns [html, next line index] or null when it does not match.
const BLOCK_RULES = [
  (lines, i) => {
    if (!FENCE.test(lines[i])) {
      return null;
    }
    const end = takeWhile(lines, i + 1, (line) => !FENCE.test(line));
    const code = escapeHtml(lines.slice(i + 1, end).join('\n'));
    return [`<pre><code>${code}</code></pre>`, end + 1];
  },
  (lines, i, ctx) => {
    const match = HEADING.exec(lines[i]);
    if (!match) {
      return null;
    }
    const level = match[1].length;
    const id = ctx.slug(match[2]);
    return [
      `<h${level} id="${escapeHtml(id)}">${renderInline(match[2], ctx.link)}</h${level}>`,
      i + 1,
    ];
  },
  (lines, i) => (RULE.test(lines[i]) ? ['<hr>', i + 1] : null),
  (lines, i, ctx) => {
    if (
      !lines[i].trim().startsWith('|') ||
      !TABLE_SEPARATOR.test(lines[i + 1] ?? '')
    ) {
      return null;
    }
    const end = takeWhile(lines, i, (line) => line.trim().startsWith('|'));
    return [renderTable(lines.slice(i, end), ctx), end];
  },
  (lines, i, ctx) => {
    if (!/^\s*>/.test(lines[i])) {
      return null;
    }
    const end = takeWhile(lines, i, (line) => /^\s*>/.test(line));
    const inner = lines
      .slice(i, end)
      .map((line) => line.replace(/^\s*>\s?/, ''));
    return [`<blockquote>${renderBlocks(inner, ctx)}</blockquote>`, end];
  },
  (lines, i, ctx) => {
    if (!LIST_ITEM.test(lines[i])) {
      return null;
    }
    const { base, block, end } = takeList(lines, i);
    return [renderList(block, base, ctx), end];
  },
];

function renderBlocks(lines, ctx) {
  const html = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() === '') {
      i += 1;
      continue;
    }
    const result = BLOCK_RULES.reduce(
      (found, rule) => found || rule(lines, i, ctx),
      null
    );
    if (result) {
      html.push(result[0]);
      i = result[1];
      continue;
    }
    const end = takeWhile(
      lines,
      i + 1,
      (line, next) => line.trim() !== '' && !startsBlock(line, next)
    );
    const text = lines
      .slice(i, end)
      .map((line) => line.trim())
      .join(' ');
    html.push(`<p>${renderInline(text, ctx.link)}</p>`);
    i = end;
  }
  return html.join('\n');
}

// Renders a document; returns the HTML and the text of its first heading.
export function renderMarkdown(text, { link = (href) => href } = {}) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const title = lines.map((line) => HEADING.exec(line)).find(Boolean);
  const html = renderBlocks(lines, { link, slug: createSlugger() });
  return { html, title: title ? title[2].replace(/[*`]/g, '') : '' };
}
