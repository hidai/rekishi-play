// ★制度語の機械検査。tests/institution-gloss.test.ts（ゲート）と
// scripts/institution-audit.ts（CLI）が共用する。
//
// 検査する規則は1つ（docs/WRITING.md 13）——**主線に出す制度語は、その場で一句で言い換える**。
// 読み通し検査（docs/design/engagement.md §14 型3）で7作すべてに出た欠陥＝**読めるのに意味が
// 分からない語**（幕府・幕臣・身分・百姓・朝廷・上皇・一門・棟梁・石高・主家・私生児・攘夷…）。
// 成功例はすでにコーパスの中にある: 清盛 1-c「宋（今の中国）」・勝海舟「蘭学（オランダ語で学ぶ
// 西洋の学問）」＝読者の逐語「こういう書き方を全部の言葉にしてほしい」。
//
// ルビの帳簿との違い＝**ここは「読めるか」ではなく「意味が届くか」を見る**。前身の
// scripts/glossary-audit.ts は「本文でルビを振った語」を候補にして失敗した（ルビは*漢字が難しい*
// の印であって*概念が難しい*の印ではない＝地名と日常語に埋もれる）。ゆえに語は**手で選ぶ**
// ——下の INSTITUTION_TERMS が帳簿の本体で、PREMISE_MARKERS と同じ「人が育てるリスト」。
//
// 判定（3つだけ）:
//   ・初出主義: 作品の主線で**最初に出た1回**だけを見る（同じ語の2回目以降は読者はもう知っている）。
//   ・言い換え = その語の直後の「（…）」。他の形（同格のダッシュ・直前の一句・絵や選択肢が担う）で
//     済ませたものは ALLOWED_INSTITUTION へ理由1行つきで移す＝**審査した記録が残る**。
//   ・説明が後の面（deep・カード）に有るかは見ない。**読者はそれを開かない**のが型3 の中身。
//
// 対象の面（silent cap にしないため明記する）: 入口（タイトル画面）＋各シーンの画面本体
// （place・本文・内語・え！？・問い・選択肢のラベル・ミニゲーム）。**deep・hist・creed・カード・
// 手がかりは対象外**——そこは説明の置き場だから（WRITING 3・4）。その面の天井は /eval-work の
// 読み通しペルソナが見る。⚠️ WRITING 13 の後半「**同じものを2つの語で呼ばない**（侍／武士）」は
// 面を限定しない規律だが、機械が数えるのは主線の初出だけ＝**言い換えの有無しか見ない**
//（同義語の混在は初出1回ずつで通る）。そこは書き手と eval の仕事。
import type { Work } from '../../src/engine/types';
import { plainText } from './content-stats';
import { bucketOf, type Surface } from './ruby-audit';

/**
 * 制度・身分・役職・仕組みを名ざす語。**読める（ルビが振ってある）が、初見の小5には
 * 意味が届かない**ものを手で選ぶ。固有名詞（人名・地名）は対象外＝顔と地図が受け持つ。
 * 語を足すのは自律で可（＝厳格化）。外すときは ALLOWED_INSTITUTION へ理由つきで移す。
 */
export const INSTITUTION_TERMS: string[] = [
  // 武家の世（hidenaga・kiyomori・masako・ieyasu）
  '幕府', '幕臣', '将軍', '大名', '武士', '侍', '家臣', '主君', '主家', '家督',
  '一門', '棟梁', '御家人', '執権', '御台所', '鎌倉殿', '乳母', '守護', '地頭', '奉行', '元服', '出家',
  '人質', '領国', '年貢', '兵糧', '石高', '天下人', '天下', '身分', '百姓', '牢人', '浪人',
  // 朝廷（kiyomori・masako）
  '朝廷', '上皇', '法皇', '院', '院政', '公家', '貴族', '関白', '太政大臣', '太閤', '摂政', '朝敵', '官位',
  // 近代（katsu・shibusawa）
  '攘夷', '開国', '蘭学', '藩', '老中', '旗本', '御用金', '尊王', '討幕', '士族', '株式会社', '合本',
  '代官', '大蔵省', '頭取', '株',
  // ルネサンスのイタリア（davinci）
  '私生児', '公証人', '工房', '共和国', '君主', '教皇', '宮廷', '修道院',
];

/**
 * 審査して「言い換えを置かない」と決めた語、キーは `作品|語` → 理由。
 *
 * 帳簿（BASELINE）が「まだ直していない」を持つのに対し、ここは「**直す必要が無いと判断した**」を
 * 持つ。両方を機械が突き合わせるので、判断は1回で済み、次のサイクルが同じ語を読み直さない。
 * 言い換えの形は「（…）」だけが機械に見える——同格のダッシュ・直前の一句・絵や選択肢が意味を
 * 担う形は正しい書き方だが機械には区別できないので、ここへ理由つきで置く。
 */
export const ALLOWED_INSTITUTION: Record<string, string> = {
  // hidenaga（2026-08-01 棚卸し・entry と ch1）
  'hidenaga|百姓': '初出（入口の謎）が「百姓の 子として、田を たがやして いた」＝直後の同格が言い換えそのもの',
  'hidenaga|侍': '初出（入口のフック）が「田んぼの まん中」との対比で位置づけられる。語自体も小5に既知',
  // katsu（2026-08-01 棚卸し・全章）
  'katsu|蘭学': '初出（1-b）が「蘭学、オランダ語で 学ぶ 西洋の 学問」＝読点の同格が言い換えそのもの（WRITING 13 が挙げる成功例）',
  // ieyasu（2026-08-02 棚卸し・全章）
  'ieyasu|人質': '初出（ch1 の題と lead）が「人質の 子」／「六さいで よその 家に あずけられた 子ども」＝lead が題の言い換えそのもの',
  'ieyasu|大名': '初出（2-a）の直前の一句が言い換え＝「三河と 遠江、二つの 国を 持つ 大名」',
  'ieyasu|幕府': '初出（5-d）が「江戸に ひらいた 幕府——きみの 政府だ」＝ダッシュの同格が言い換え。同じ画面の 将軍が括弧を使うので形を分けた（1画面2括弧を避ける）',
  'ieyasu|牢人': '初出（6-b）が「牢人——主を 失った 武士たち」＝ダッシュの同格が言い換え（3-b の「主を 失った 武士」の呼び返し）',
  // davinci（2026-08-02 棚卸し・全章）
  'davinci|私生児': '初出（ch1 の題と lead）が「ヴィンチ村の 私生児」／lead「けっこんして いない 親の あいだに 生まれ…」＝lead が題の言い換えそのもの',
  'davinci|工房': '初出面は章カード（title/lead/teaser）だが、読者が teaser を読む直前の 1-d 本文が「工房の 戸を たたく。親方と 弟子たちが、絵や 像を つくる ところだ」＝直後の一文が言い換え',
  // masako（2026-08-02 棚卸し・全章）
  'masako|将軍': '初出（ch3 lead）の直後の一文が言い換え＝「将軍の 座から おろすか、守りぬくか。武士たちの いちばん 上の 座だ」。括弧を句の中に差すと、章でいちばん熱い一文（子をおろすか守るか）が一拍死ぬと小5・中1がそろって報告した＝後置にした（davinci 1-d と同型）',
  'masako|御台所': '初出面は ch1 の teaser だが、teaser は章クリア後に出る面＝読者順では 1-c 本文が先で「きみは その 御台所、鎌倉の 頂に 立つ 女に なった」＝読点の同格が言い換え（2-a も「その 頂点——御台所」で受ける）',
  'masako|御家人': '初出（3-a）の直前の一句が言い換え＝「鎌倉に つかえる 武士——御家人たちは」。同じ画面の 幕府 が括弧を使うので形を分けた（1画面2括弧を避ける）',
  'masako|上皇': '初出（5-b）の直後の一文が言い換え＝「後鳥羽上皇を 育てた 乳母だ。上皇とは、天皇の 位を ゆずった あとも 力を もつ 人の こと」。括弧で差した初版は小5が2ラウンドとも「この 作品で いちばん 重い 一文・息が つづかない」と報告した面＝後置に置き換えた',
  'masako|乳母': '初出（5-b）の直前の一句が言い換え＝「後鳥羽上皇を 育てた 乳母」。同じ画面の 上皇 が後置の一文を使うので形を分けた',
  'masako|執権': '初出（6-b）の直前の一句が言い換え＝「鎌倉を 動かす 執権」。同じ画面の 朝敵 が括弧を使うので形を分けた',
  // shibusawa（2026-08-02 棚卸し・全章。代官・大蔵省・頭取・株は この棚卸しで追加した語）
  'shibusawa|百姓': '初出（入口のフック）の直前の一句が言い換え＝「田と 畑の ある 家の 子。十七の とき、「百姓の くせに」と 笑われた」。笑われる一文の中に注釈を差すと、入口でいちばん熱い一拍が死ぬ（masako|将軍 と同型）',
  'shibusawa|幕府': '初出（1-b）の直前の一句が言い換え＝「日本を おさめる 幕府が 港を ひらき」',
  // ★語を降ろして通した初版を、eval が差し戻した唯一の例（2026-08-02）。入口の謎から 将軍 を
  // 抜いて「家」に置き換えたら、小5・中1が独立に「顔が浮かばない」「その／その が名前の無い
  // ものを指して追えない」と報告し、小5は謎の後半を読み飛ばした。降ろすのが常に正解ではない。
  'shibusawa|将軍': '初出（入口の謎）は言い換え無し＝三拍の並置（焼こうと した／つかえた／なった）に注釈を差すと一拍死ぬ。**ペルソナ2本が「将軍は顔が浮かぶ・学校で習った語」と報告**＝「読めるのに意味が届かない」語ではない（hidenaga|侍・shibusawa|侍 と同じ判断）。後払いの言い換えは 1-b「日本を おさめる 幕府」が受ける',
  'shibusawa|幕臣': '初出面は ch2 の teaser だが、teaser は章クリア後に出る面＝読者順では 2-e 本文が先で「その日から 幕臣——将軍の 家来だ」＝ダッシュの同格が言い換え（masako|御台所 と同型）',
  'shibusawa|侍': '初出（2-d）の文じたいが立場を位置づける＝「侍が 上から 命じても、村は 動かない」（上から命じる側）。語自体も小5に既知（hidenaga|侍 と同じ判断）',
  'shibusawa|朝敵': '初出（3-e）の直前の一句が言い換え＝「将軍でも なく、天皇の 敵——朝敵と 呼ばれ」',
  'shibusawa|代官': '初出（1-a の place と本文）の直後の一文が言い換え＝「代官所に 呼ばれた。村を おさめる 役所だ」',
  'shibusawa|大蔵省': '初出（ch4 lead）の直後の一句が言い換え＝「大蔵省——国じゅうの お金が 集まる 役所」。choice 節の中に差した初版は「役所・大蔵省・役人」が三つ続いて小5が息切れした＝先頭へ出した',
  'shibusawa|株': '初出（5-a）が「会社に お金を 出した しるし（株）」＝括弧の向きが逆（やさしい句が本文で、制度語のほうが括弧）。同じ形を w-gappon カードが使う',
  // kiyomori（2026-08-01 棚卸し・entry〜ch3）
  'kiyomori|貴族': '初出（1-b）の直前の一句が言い換え＝「そこで 力を もつのは、代々 みやこに 住む 貴族たち」',
  'kiyomori|太政大臣': '初出（3-c）が「太政大臣——朝廷で いちばん 高い 役」＝ダッシュの同格が言い換えそのもの',
};

export interface InstitutionHit {
  surface: string;
  term: string;
  /** 前後の抜粋（作者が現物を探せるように）。 */
  excerpt: string;
  /** 審査して残すと決めた語。ALLOWED_INSTITUTION の理由。 */
  allowed?: string;
}

/** 面の部品をつなぐ印。つなぎ目で「語＋（…）」が偶然できるのを防ぐ。 */
const SEP = '｜';

/**
 * 読者が「開かずに」読む面だけを、読む順に。入口＝タイトル画面（`titleSub` はプレーン文字列で
 * ruby を置けない面だが、制度語は語そのものの問題なのでここでは対象）。
 */
export function mainSurfaces(work: Work): Surface[] {
  const s = work.strings;
  const out: Surface[] = [
    {
      id: 'entry',
      parts: [s.titleMain, s.titleSub, s.titleHook, work.riddle, s.riddleHeart ?? '', s.titleNote],
    },
  ];
  for (const ch of work.story.chapters) {
    out.push({ id: `ch${ch.id}`, parts: [ch.title, ch.lead, ch.teaser ?? ''] });
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      const parts = [
        sc.place,
        sc.text,
        sc.monologue,
        sc.spark,
        sc.q,
        ...(sc.choices ?? []).map((c) => c.label),
      ];
      if (sc.minigame?.type === 'sort')
        parts.push(
          sc.minigame.title,
          sc.minigame.lead,
          ...sc.minigame.items,
          sc.minigame.outro,
        );
      out.push({ id: `ch${ch.id}/${sid}`, parts: parts.filter(Boolean) as string[] });
    }
  }
  return out;
}

/** その位置から始まる最長の制度語（「天下」が「天下人」を食わないように）。 */
function termAt(text: string, i: number): string | undefined {
  let best: string | undefined;
  for (const t of INSTITUTION_TERMS)
    if (text.startsWith(t, i) && (!best || t.length > best.length)) best = t;
  return best;
}

/** 直後に「（…）」が続くか＝その場の一句の言い換え。 */
function glossedAt(text: string, end: number): boolean {
  return /^（[^）]{1,40}）/.test(text.slice(end));
}

/**
 * 作品の主線で、制度語の**初出の面**に言い換えが無いもの。初出が裸なら、あとの面で言い換えても
 * 読者はもう置いていかれているので hit のまま（説明は先か、その場か、のどちらかしかない）。
 * 判定は面ぐるみ＝同じ画面のどこかで言い換えていればよい（place が語を先に出し、本文が
 * 受けて言い換える形は「その場」のうち）。
 */
export function auditWork(work: Work): InstitutionHit[] {
  const hits: InstitutionHit[] = [];
  const seen = new Set<string>();
  for (const surface of mainSurfaces(work)) {
    const text = surface.parts.map(plainText).join(SEP);
    const here = new Map<string, { at: number; glossed: boolean }>();
    for (let i = 0; i < text.length; i++) {
      const term = termAt(text, i);
      if (!term) continue;
      const end = i + term.length;
      if (!seen.has(term)) {
        const prev = here.get(term);
        here.set(term, {
          at: prev?.at ?? i,
          glossed: (prev?.glossed ?? false) || glossedAt(text, end),
        });
      }
      i = end - 1;
    }
    for (const [term, { at, glossed }] of here) {
      seen.add(term);
      if (glossed) continue;
      const why = ALLOWED_INSTITUTION[`${work.id}|${term}`];
      hits.push({
        surface: surface.id,
        term,
        excerpt: text.slice(Math.max(0, at - 12), at + term.length + 12),
        ...(why ? { allowed: why } : {}),
      });
    }
  }
  return hits;
}

/** 章ごとの未言い換え件数（審査ずみは除く）＝ラチェットが見る数。 */
export function auditBuckets(work: Work): Record<string, number> {
  const out: Record<string, number> = {};
  for (const h of auditWork(work))
    if (!h.allowed) out[bucketOf(h.surface)] = (out[bucketOf(h.surface)] ?? 0) + 1;
  return out;
}

/** ALLOWED_INSTITUTION のうち、いま実データに出ているキー＝許可表の突き合わせ入力。 */
export function allowedKeysInUse(works: Work[]): string[] {
  const out = new Set<string>();
  for (const w of works)
    for (const h of auditWork(w)) if (h.allowed) out.add(`${w.id}|${h.term}`);
  return [...out].sort();
}
