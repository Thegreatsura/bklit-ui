import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  containsCssVar,
  parseVarName,
  resolveCssVarFromStyle,
} from "../svg-export/resolve-css-var";

function mockStyle(vars: Record<string, string>): CSSStyleDeclaration {
  return {
    getPropertyValue(name: string) {
      return vars[name] ?? "";
    },
  } as CSSStyleDeclaration;
}

describe("resolve-css-var", () => {
  it("containsCssVar detects var references", () => {
    assert.equal(containsCssVar("var(--chart-1)"), true);
    assert.equal(containsCssVar("#fff"), false);
  });

  it("parseVarName extracts custom property names", () => {
    assert.equal(parseVarName("var(--chart-1)"), "--chart-1");
    assert.equal(
      parseVarName("var( --chart-line-primary )"),
      "--chart-line-primary"
    );
  });

  it("resolveCssVarFromStyle resolves nested var chains", () => {
    const style = mockStyle({
      "--chart-1": "oklch(0.84 0.18 128)",
      "--chart-line-primary": "var(--chart-1)",
    });

    assert.equal(
      resolveCssVarFromStyle(style, "var(--chart-line-primary)"),
      "oklch(0.84 0.18 128)"
    );
  });

  it("resolveCssVarFromStyle passes through non-var values", () => {
    const style = mockStyle({});
    assert.equal(
      resolveCssVarFromStyle(style, "url(#pattern)"),
      "url(#pattern)"
    );
    assert.equal(resolveCssVarFromStyle(style, "#ffffff"), "#ffffff");
  });

  it("resolveCssVarFromStyle uses fallback values with nested parentheses", () => {
    const style = mockStyle({});

    assert.equal(
      resolveCssVarFromStyle(style, "var(--chart-label, oklch(0.65 0.01 260))"),
      "oklch(0.65 0.01 260)"
    );
  });

  it("resolveCssVarFromStyle prefers defined custom properties over fallback", () => {
    const style = mockStyle({
      "--chart-label": "oklch(0.8 0.02 260)",
    });

    assert.equal(
      resolveCssVarFromStyle(style, "var(--chart-label, oklch(0.65 0.01 260))"),
      "oklch(0.8 0.02 260)"
    );
  });
});
