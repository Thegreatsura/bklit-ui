const VAR_REFERENCE = /var\(\s*(--[\w-]+)/;

export function containsCssVar(value: string): boolean {
  return value.includes("var(");
}

export function parseVarName(value: string): string | null {
  const match = VAR_REFERENCE.exec(value.trim());
  return match?.[1] ?? null;
}

/** Parse a single `var(...)` token, including fallbacks with nested parentheses. */
export function parseVarExpression(value: string): {
  name: string;
  fallback: string | null;
} | null {
  const trimmed = value.trim();
  if (!(trimmed.startsWith("var(") && trimmed.endsWith(")"))) {
    return null;
  }

  let depth = 0;
  let commaIndex = -1;
  for (let index = 4; index < trimmed.length - 1; index += 1) {
    const char = trimmed[index];
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      commaIndex = index;
      break;
    }
  }

  if (commaIndex === -1) {
    const name = trimmed.slice(4, -1).trim();
    return name.startsWith("--") ? { name, fallback: null } : null;
  }

  const name = trimmed.slice(4, commaIndex).trim();
  const fallback = trimmed.slice(commaIndex + 1, -1).trim();
  return name.startsWith("--") ? { name, fallback: fallback || null } : null;
}

/**
 * Resolve a CSS color/value that may contain `var(--token)` references.
 * Uses `getComputedStyle` on `element` so preset overrides on the frame apply.
 */
export function resolveCssVar(element: Element, value: string): string {
  const trimmed = value.trim();
  if (!containsCssVar(trimmed)) {
    return trimmed;
  }

  const style = getComputedStyle(element);
  return resolveCssVarFromStyle(style, trimmed);
}

export function resolveCssVarFromStyle(
  style: CSSStyleDeclaration,
  value: string,
  depth = 0
): string {
  if (depth > 8) {
    return value;
  }

  const trimmed = value.trim();
  if (!containsCssVar(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("var(")) {
    const parsed = parseVarExpression(trimmed);
    if (!parsed) {
      return trimmed;
    }

    const resolved = style.getPropertyValue(parsed.name).trim();
    if (resolved) {
      return containsCssVar(resolved)
        ? resolveCssVarFromStyle(style, resolved, depth + 1)
        : resolved;
    }

    if (parsed.fallback) {
      return containsCssVar(parsed.fallback)
        ? resolveCssVarFromStyle(style, parsed.fallback, depth + 1)
        : parsed.fallback;
    }

    return trimmed;
  }

  return trimmed.replace(/var\([^)]*(?:\([^)]*\)[^)]*)*\)/g, (match) =>
    resolveCssVarFromStyle(style, match, depth + 1)
  );
}
