// ★人物への評価語（レッテル）の機械検査。tests/epithet-attribution.test.ts（ゲート）と
// scripts/epithet-audit.ts（CLI）が共用する。
//
// 検査する規則は1つ（docs/WRITING.md 4）——**人物への評価語は地の文で断定せず、だれがそう呼ぶかで持つ**。
// 発端は davinci 5「暴君に力を貸すか」の岐路（engagement.md §20-5）: 読者面に「暴君」が15箇所、
// **全件が地の文の断定**で、両ペルソナが独立に A1 を落とし（中1「選ぶ前に採点表を渡された」）、
// VISION 監査も同じ一文を major に挙げた。
//
// ⚠️ この規律は**すでに他6作が習慣で守っていた**（実測: kiyomori 24件・katsu 11件が全件「」＋帰属。
// katsu の relations は `rel: '「裏切り者」と 呼ぶ 声'`、同じ位置の davinci は `'仕えた 暴君'`）。
// known-premise の帳簿を作ったときと同じ形＝**名前を持たない規律は次作で必ず再発する**ので、
// 名前を与えて計器に載せる。
//
// 判定（2つだけ）:
//   ・**帰属**＝評価語の直後に「だれがそう呼ぶか」がある（呼ばれる・と言う・語りつがれる・悪評…）。
//     語り手がレッテルを否定する形（「聖人でも 悪人でも ない」）も帰属と同じく可＝判断が読者に残る。
//     ヘッジ（「〜と伝えられる」）ではない——帰属は体験予算のヘッジ枠を1文字も使わない（HEDGE_PATTERN
//     に「呼ばれる」は無い）。書法4「主線は熱く」と両立するのはこのため。
//   ・**面で階級が変わる**:
//       - ラベル面（岐路の問い・選択肢ラベル・relations・地図の label/note・年表・手帳キャプション）＝
//         **その面の中で帰属していなければ hit**。短いラベルは文脈を持てないので、着せる場所がそこしかない。
//         岐路の問いと選択肢がここに入るのは §20-5 の中身そのもの（44問中この1問だけが判定名詞を含んだ）。
//       - 散文面（本文・内語・え！？・hist・deep・信条・カード・手がかり…）＝**読む順**で、その作品で
//         まだ一度も帰属されていない評価語が裸で出たら hit。**一度着せたあとは裸で使える**——そこでの
//         「暴君」は語り手の判定ではなく、読者が自分の選択で背負った代償だから（書法11 の「着せてから」）。
// ⚠️ カード・手がかりは図鑑・手帳から物語の順を無視して開ける面だが、ここでは読む順の最後に置いて
// 散文として扱う（章で着せてあれば通る）。その面の天井は /eval-work の読み通しペルソナが見る。
import type { Work } from '../../src/engine/types';
import { plainText } from './content-stats';

/**
 * 人物に貼る評価語。**行為の名**（裏切り・謀反）や**体制の名**（独裁）は入れない——人物そのものを
 * 断ずる名詞だけ。制度語（朝敵・天下人）は institution-audit の担当なので重ねない。
 * 語を足すのは自律で可（＝厳格化）。
 */
export const EPITHET_TERMS: string[] = [
  '暴君', '悪人', '大悪人', '悪女', '悪党', '裏切り者', '逆賊', '謀反人', '極悪',
  '英雄', '聖人', '名君', '救世主', '天才児', '愚か者', '臆病者', '欲ばり',
];

/** 評価語の字で始まるが、人物に貼る札ではない語（物語の型の名など）。 */
const NOT_EPITHET = ['英雄物語', '英雄伝説', '英雄時代'];

/** 「だれがそう呼ぶか」の印。ヘッジ（と伝えられる）と違い、体験予算のヘッジ枠を使わない。 */
const ATTRIBUTION =
  /呼ば|呼ぶ|呼び|呼ん|と言|という|と評|言われ|言う|語りつ|語られ|とされ|うわさ|悪評|ラベル|仕立て|名づけ|あだ名|の声|ひと言/;

/** 語り手がレッテルを引き受けない形（否定）。判断が読者に残るので帰属と同じ扱い。 */
const NEGATION = /で[はも]?[^。｜]{0,3}(ない|なく|なかった)|とは限ら/;

/** 帰属を探す窓（純テキストの文字数）。 */
const WINDOW = 16;

/** 「」の中に収まる余白＝札として掲げているとみなす、語以外の文字数。 */
const LABEL_SLACK = 4;

/** 語を囲む鉤かっこの内側（面の区切り・句点をまたがない）。無ければ undefined。 */
function quoted(
  text: string,
  i: number,
  end: number,
): { inner: string; after: string } | undefined {
  let open = -1;
  for (let k = i - 1; k >= 0; k--) {
    const c = text[k];
    if (c === '」' || c === '』' || c === '。' || c === SEP) break;
    if (c === '「' || c === '『') {
      open = k;
      break;
    }
  }
  if (open < 0) return undefined;
  for (let k = end; k < text.length; k++) {
    const c = text[k];
    if (c === '「' || c === '『' || c === SEP) break;
    if (c === '」' || c === '』') return { inner: text.slice(open + 1, k), after: after(text, k + 1) };
  }
  return undefined;
}

export interface EpithetHit {
  surface: string;
  term: string;
  /** ラベル面（その面の中で帰属が要る）か。 */
  strict: boolean;
  excerpt: string;
  /** 審査して「このままでよい」と決めた出現。ALLOWED_EPITHET の理由。 */
  allowed?: string;
}

/**
 * 審査して裸のまま残すと決めた出現、キーは `作品|面|語` → 理由。
 * BASELINE（まだ直していない）ではなく**直す必要が無いと判断した**を持つ＝institution-audit の
 * ALLOWED と同じ形。逃し口は「面」でなく**出現**で持つ（known-premise の学び）。
 */
export const ALLOWED_EPITHET: Record<string, string> = {};

/** 面ひとつ＝読者が一度に読む文字列と、その階級。 */
interface EpithetSurface {
  id: string;
  strict: boolean;
  text: string;
}

const SEP = '｜';

function s(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).map((p) => plainText(p as string)).join(SEP);
}

/**
 * 読者面を読む順に。ラベル面（strict）と散文面を分けるのがこの監査の本体なので、
 * 面の組み立ては ruby-audit と共有せず、ここで明示的に持つ（silent cap にしない）。
 */
export function epithetSurfaces(work: Work): EpithetSurface[] {
  const out: EpithetSurface[] = [];
  const st = work.strings;
  out.push({
    id: 'entry',
    strict: false,
    text: s([st.titleMain, st.titleSub, st.titleHook, work.riddle, st.riddleHeart, st.titleNote]),
  });
  for (const ch of work.story.chapters) {
    out.push({ id: `ch${ch.id}`, strict: false, text: s([ch.title, ch.lead]) });
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      const at = `ch${ch.id}/${sid}`;
      if (sc.reveal)
        out.push({ id: `${at}#reveal`, strict: false, text: s([sc.reveal.title, sc.reveal.caption]) });
      const mg = sc.minigame;
      out.push({
        id: at,
        strict: false,
        text: s([
          sc.place,
          sc.text,
          sc.monologue,
          sc.spark,
          mg?.title,
          mg?.lead,
          ...(mg?.type === 'sort' ? mg.items : []),
          mg?.outro,
        ]),
      });
      // 岐路＝§20-5 の現場。問いと選択肢ラベルは、その面の中で帰属していなければ通さない。
      if (sc.q) out.push({ id: `${at}#q`, strict: true, text: s([sc.q]) });
      (sc.choices ?? []).forEach((c, i) => {
        out.push({ id: `${at}#label${i}`, strict: true, text: s([c.label]) });
        if (c.hist)
          out.push({
            id: `${at}#hist${i}`,
            strict: false,
            text: s([
              c.hist.verdict,
              c.hist.match,
              c.hist.body,
              c.hist.source?.name,
              c.hist.source?.note,
            ]),
          });
      });
      if (sc.deep)
        out.push({ id: `${at}#deep`, strict: false, text: s([sc.deep.q, sc.deep.body, sc.deep.cite]) });
      if (sc.creed)
        out.push({ id: `${at}#creed`, strict: false, text: s([sc.creed.line, sc.creed.act]) });
      if (sc.observe)
        out.push({
          id: `${at}#observe`,
          strict: false,
          text: s([sc.observe.prompt, ...sc.observe.hotspots.map((h) => h.caption)]),
        });
    }
    // teaser は章をクリアした**あと**に出る＝次章の面より前、その章の本文より後。
    if (ch.teaser) out.push({ id: `ch${ch.id}#teaser`, strict: false, text: s([ch.teaser]) });
  }
  for (const [id, c] of Object.entries(work.cards))
    out.push({ id: `card:${id}`, strict: false, text: s([c.name, c.text, c.photo?.credit]) });
  for (const [id, c] of Object.entries(work.clues))
    out.push({ id: `clue:${id}`, strict: false, text: s([c.text]) });
  for (const n of work.graph?.nodes ?? [])
    out.push({ id: `star:${n.id}`, strict: false, text: s([n.caption]) });
  out.push({
    id: 'hidden',
    strict: false,
    text: s([work.hidden.lockedText, work.hidden.body, work.hidden.completeText]),
  });
  // ---- ラベル面（物語の順を持たない＝いつ開かれるか分からない） ----
  work.timeline.forEach((e, i) =>
    out.push({ id: `timeline:${i}`, strict: true, text: s([e.t, e.d]) }),
  );
  for (const e of work.relations?.edges ?? [])
    out.push({ id: `relation:${e.pid}`, strict: true, text: s([e.rel]) });
  for (const c of work.relations?.cats ?? [])
    out.push({ id: `relation-cat:${c.key}`, strict: true, text: s([c.label]) });
  const map = work.map;
  if (map) {
    for (const [sid, def] of Object.entries(map.sceneMaps))
      for (const m of def.markers ?? [])
        out.push({ id: `map:${sid}`, strict: true, text: s([m.label, m.note]) });
    for (const p of map.mapPoints) out.push({ id: `mappoint:${p.id}`, strict: true, text: s([p.label, p.sub]) });
    for (const [ch, cap] of Object.entries(map.chapterCaptions))
      out.push({ id: `notebook:map${ch}`, strict: true, text: s([cap]) });
  }
  return out;
}

/** その位置から始まる最長の評価語。 */
function termAt(text: string, i: number): string | undefined {
  if (NOT_EPITHET.some((w) => text.startsWith(w, i))) return undefined;
  let best: string | undefined;
  for (const t of EPITHET_TERMS)
    if (text.startsWith(t, i) && (!best || t.length > best.length)) best = t;
  return best;
}

/**
 * その出現が帰属を持つか。3つの形を認める:
 *   ①「悪女」の 話＝**札として掲げた**（かっこの中が語ほぼそのもの＝LABEL_SLACK 以内）。
 *   ②「天下の 悪女が…」**という** 話の 形＝長い引用でも、閉じかっこの直後に帰属がある。
 *   ③ 逆賊と される／英雄では まだ なく＝かっこ無しで、直後に帰属か否定がある。
 * ⚠️ ①の余白を広げると、**読者自身の台詞に語り手の判定を入れた形**（davinci 5-b の
 * 「暴君の 手つだいは しない」）まで帰属に見えてしまう＝そこが §20-5 の欠陥そのもの。
 */
function attributedAt(text: string, term: string, i: number, end: number): boolean {
  const q = quoted(text, i, end);
  if (q) {
    if (q.inner.length - term.length <= LABEL_SLACK) return true;
    if (hasAttribution(q.after)) return true;
  }
  return hasAttribution(after(text, end));
}

/**
 * 帰属を探す窓。**面の区切りをまたがない**——面は place・本文・内語…を SEP で連ねた1本の文字列なので、
 * またぐと「前の欄の裸の評価語」が「次の欄の先頭の帰属語」を拾って緑になる（見逃しは件数が減る
 * 方向にしか現れないので、0件運用では気づけない）。
 */
function after(text: string, end: number): string {
  const win = text.slice(end, end + WINDOW);
  const cut = win.indexOf(SEP);
  return cut < 0 ? win : win.slice(0, cut);
}

function hasAttribution(win: string): boolean {
  return ATTRIBUTION.test(win) || NEGATION.test(win);
}

/**
 * 読む順に歩いて、帰属を持たない評価語を拾う。散文面は「その作品でまだ一度も帰属されていない語」
 * だけを hit にする（＝着せる前の断定）。ラベル面はその面の中で帰属していなければ hit。
 */
export function auditWork(work: Work): EpithetHit[] {
  const hits: EpithetHit[] = [];
  const dressed = new Set<string>();
  for (const surface of epithetSurfaces(work)) {
    const { text } = surface;
    for (let i = 0; i < text.length; i++) {
      const term = termAt(text, i);
      if (!term) continue;
      const at = i;
      const end = i + term.length;
      i = end - 1;
      if (attributedAt(text, term, at, end)) {
        dressed.add(term);
        continue;
      }
      if (!surface.strict && dressed.has(term)) continue;
      const why = ALLOWED_EPITHET[`${work.id}|${surface.id}|${term}`];
      hits.push({
        surface: surface.id,
        term,
        strict: surface.strict,
        excerpt: text.slice(Math.max(0, end - term.length - 12), end + 12),
        ...(why ? { allowed: why } : {}),
      });
    }
  }
  return hits;
}

/** 審査ずみを除いた件数（ゲートが見る数）。 */
export function bareCount(work: Work): number {
  return auditWork(work).filter((h) => !h.allowed).length;
}

/** ALLOWED_EPITHET のうち、いま実データに出ているキー＝許可表の突き合わせ入力。 */
export function allowedKeysInUse(works: Work[]): string[] {
  const out = new Set<string>();
  for (const w of works)
    for (const h of auditWork(w)) if (h.allowed) out.add(`${w.id}|${h.surface}|${h.term}`);
  return [...out].sort();
}
