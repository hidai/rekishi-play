// Canonical protagonist display-name helpers. Two variants ON PURPOSE:
// heroName() is plain text, safe for SVG <text> and aria-label;
// heroRubyHtml() may contain <ruby> HTML and must only be rendered via {@html}.
// Do not merge them — ruby markup inside SVG text/aria renders as literal tags.
import type { Work } from './types';
import { personName } from './map/sceneMap';

/** Plain protagonist name: shortNames → card/peopleExtra name → generic fallback. */
export function heroName(work: Work): string {
  return work.shortNames[work.protagonistId] || personName(work, work.protagonistId) || '主人公';
}

/** Ruby-annotated protagonist name (HTML). Render via {@html} only. */
export function heroRubyHtml(work: Work): string {
  return work.strings.protagonistRuby || heroName(work);
}
