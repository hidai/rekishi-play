// ★型9 の計器（診断のみ。ゲートではない）。scripts/agency-audit.ts と
// tests/agency-calibration.test.ts が共用する。
//
// What it measures: does a screen contain **人が人に向かって何かをする** —— a directed act
// between two people. Origin: docs/design/engagement.md §17。『渋沢』の読み通しで小5 は章六の頭で
// やめ（load 387＝作品でいちばん軽い部類＝〈用量〉では説明できない）、両ペルソナが独立に挙げた
// 最上位の画面は 1-c2（従兄と斬り合う夜）と 7-b（日本じゅうの子どもによびかける）だった。
//
// ⚠️ この計器は較正して作った（顔エンジンと同じ empirical loop）。**初版は「きみが主語の行為」だけを
// 数え、較正元の秀長が7作の最下位に落ちた**（子どもの実反応で検証済みの唯一のコーパスが最下位＝
// 物差しの側の誤り）。露出した見落としが2つ:
//   ・**行為には向きが二つある** — 母がきみの手をにぎる／兄がきみの肩をつかむ／敵がきみの前で頭を
//     下げる。§14 が「いちばん心に残った画面」に挙げた親子の場面は**すべて相手→きみ**だった。
//   ・**声は1つで足りる** — 母の一言（「そばに いてやって おくれ」）は応酬でなくても場を作る。
//
// ゆえに判定は加算で、しきい値は 2:
//   score = 向きのある行為（きみを含む文の中の ACT_VERBS）＋ 他者の声（`class="speak"`）
//   engaged = score >= 2
// これで較正点が両側そろう（1-c2＝声2・7-b＝行為3・秀長 1-d＝行為1＋声1／渋沢 6-a＝1 で非）。
//
// ★型10（2026-08-05 追加）＝**その声は「きみ」に宛てられているか**。型9 は声の数と向きのある行為を
// 数えるが、**声の宛先を見ていない**——「家中が割れた」画面は声2で ○ を取る。小5・中1が2ラウンド
// 続けて対照 hidenaga 3-a2 を選び、理由まで一致した（「だれも『きみ』に直接話しかけてこない」＝
// 3-a2 は年よりが顔を見て問い、**返事を待つ**）。判定は `addressedToYou`＝形と錨の AND。
// 型9 の score には足さない（別の軸＝混ぜると両方の解像度が消える）。
//
// ★型11（2026-08-05 追加）＝**その問いは、だれが答えたか**。型10 で宛先が付いた渋沢 3-d を、中1が
// R2 で「①（答える場面が無い）は解消。だが**問いも答えも その場で完結する**」と切った——同じ画面の
// 中で地の文かきみの台詞が即答すると、読者の手には何も渡らない。対照 3-a2 は問いに答えさせず
// 「年よりは、きみの 返事を 待って いる。」で画面を切り、答えを**次画面の選択**として渡す。
// ゆえに宛先つきの声のうち**返事を要求する形**（問い・依頼命令）だけを取り出し、行き先で4つに分ける:
//   closed ＝同じ画面できみ／地の文が答えた（読者は見ているだけ）
//   choice ＝答えないまま、その画面の岐路が答えになる
//   carried＝答えないまま画面が切れ、**次の画面の岐路**が答えになる（3-a2 の形＝天井）
//   dropped＝答えないまま、どこにも岐路が無い（問いが消える）
// ⚠️ closed は欠陥の印ではない（診断であってゲートではない）。較正元の秀長にも dropped は2つある
//（母の「そばに いてやって おくれ」＝答えを求めない要求）。見るのは**作品ぜんぶで持ち越しが何回あるか**。
// ⚠️ **限界＝見ているのは「だれが問いのあとに口をきくか」で、意味の充足ではない**。地の文が問いの
// 中身に答えてしまう形（渋沢 3-d の初版「送金は とうに 止まって いる。それでも 一行は 船に 乗れた。…」）は
// きみを主語に置かないので closed に数えられない＝**closed は過少報告**。そのぶんを補うのが
// `tailAfterAsk`（問いのあとまだ何段落しゃべるか）＝0〜1 なら問いのまま画面が切れている。
//
// 見ているのは主線の本文だけ（deep・カード・手帳は読者が開かない面＝型3 と同じ線引き）。
// hist を入れないのは、選択の後に開く面＝「この画面をやめるか」の判断がもう済んでいるから。
// **岐路そのものは数えない**——ほぼ全画面が岐路を持つ作品があり、足すと解像度が消える
// （岐路の数と間隔は scripts/engagement-audit.ts の担当）。
//
// ⚠️ 限界（silent cap にしないため明記する）: これは床でも天井でもない診断。日本語の主語省略を
// 追えないので「きみ」を書かずに続く行為の文は数え落とす（＝過少報告に倒す）。逆に、30年前の
// 行為の回想も現在の行為と区別できない。使い方は個別画面の合否でなく、**章の中の「空白のラン」の
// 長さを作品どうしで比べること**。
import type { Scene, Work } from '../../src/engine/types';
import { plainText } from './content-stats';
import { RENAMED_NAMES } from './name-audit';

/**
 * 人に向かう／人から向かう動きの語（人が育てるリスト＝INSTITUTION_TERMS・PREMISE_MARKERS と
 * 同じ作り）。活用形を substring で持つ。**状態・変化の語は入れない**——「なった」「生まれた」
 * 「いる」「死んだ」は行為ではなく、そこを数えると「きみは 53さい」の画面まで engaged になる。
 */
export const ACT_VERBS: string[] = [
  // 体で触れる・向き合う（相手→きみ が多い層。§14 の「いちばん心に残った画面」はここ）
  // ⚠️ 同じ接触を指す語を二重に置かない（「肩を」＋「つかん」で1つの行為が2点になった）。
  'にぎ', 'つかん', 'つかみ', 'つかむ', '抱い', 'だきしめ', '手をとっ', '下げ', 'ひざまず',
  'すがり', 'すがっ', '見つめ', 'にらん', 'ふりむい', 'なで', 'ゆすっ',
  // 声を向ける
  '呼び', 'よびかけ', 'たずね', '問い', '言っ', '言い返', '答え', '告げ', 'ささやい', 'さけん',
  'どなっ', 'うなずい', 'ほめ', '責め', 'しかっ', '叱っ', 'なだめ', 'なぐさめ', 'さそっ', 'すすめ',
  '説い', '教え', '見せ', '約束', 'しらせ', '申し上げ', 'ちらつかせ',
  // わたす・うけとる
  'わたし', '渡し', '差し出', '受け', 'もらっ', 'もらう', 'あずけ', 'まかせ', 'ゆず', '迎え',
  '嫁が', 'つかわ', 'つれ', 'ことわ', '断っ', 'たのみ', 'たのん', '願っ', '命じ', 'ゆるし', '許し',
  'せまっ', 'とりなし',
  // 争う・守る（⚠️ 「兵を」「刀を」のような目的語だけの印は置かない＝動詞と二重に当たる）
  '斬っ', '斬る', '斬れ', '討っ', '討つ', '刺し', '破っ', '攻め', '戦っ', 'たたか', 'おそっ',
  'うちこわ', 'ほろぼ', 'かこ', 'とじこめ', 'ひきずり', '助け', 'たすけ', 'かば', '守っ', '支え',
  '従っ', 'つかえ', '仕え', '救っ', '裏切', 'だまし', 'だまさ',
  // 自分の手で動かす（きみ→世界。7-b の層）
  // ⚠️ 「立っ」「立ち」は入れない——「武門の頂に立った」は地位に達した**状態**で、この層の意図ではない
  //（ヘッダの「状態・変化の語は入れない」に自分で違反していた。code review 2026-08-04）。
  '行き', '行っ', '向かっ', '帰っ', '出し', '入れ', '乗っ', 'のっ', 'わたっ', '走っ', 'すわ',
  'ひらい', '書い', '書く', '写し', '描い', '読ん', '売っ', '買い', '買っ',
  'あつめ', '集め', 'つくら', 'つくり', 'つくっ', 'きずい', 'すえ', 'ならべ', '決め', 'やめ',
  'えらん', 'かくし', '待っ',
];

/**
 * ACT_VERBS に部分一致するが行為ではない言い方（**長い一致が勝つ**＝institution-audit の termAt と同じ作り）。
 * 裸のかな2文字は慣用句を高い率で拾う——「手に入れる」は城を得た**結果**、「手を入れる」は絵の手直し、
 * 「入れかえ」は順序の話。⚠️ この表が無かったあいだ、較正テストの「秀長に空白の章が無い」は
 * **誤検出1件だけで支えられていた**（`hidenaga 3-a` の「手に入れ」。code review 2026-08-04）。
 */
export const NOT_ACTS: string[] = ['手に入れ', '手を入れ', '入れかえ', '荷に入れ'];

/**
 * 行為の語の直後に来る打ち消し（「入れなかった」「答えない」を「した」と数えないため）。
 * ⚠️ 打ち消し＋仮定の複合形「〜なければ」は `NEGATION` の どの語頭とも `CONDITIONAL` とも噛み合わない
 * ——`なけれ` を持たないと「答えなければ」が「答えた」に化ける（自己レビューの指摘。実データは未発火）。
 */
const NEGATION = /^(?:ない|なかっ|なく|なけれ|ぬ|ず)/;

/**
 * ★型10 の印①＝声の中の二人称（きみを名ざす声）。
 * 作品によって呼び方が違う（きみ／そなた／おぬし）ので人が育てるリストで持つ。
 */
export const ADDRESS_WORDS: string[] = [
  'きみ', 'そなた', 'そち', 'おぬし', 'おまえ', 'お前', 'なんじ', '汝', 'あなた', 'おぬしら',
];

/**
 * ★型10 の印②＝**聞き手がいないと成り立たない文末**（依頼・命令・勧誘）。
 * ⚠️ substring では拾わない——「〜して くれた」「〜と 申せば」は聞き手への要求ではない。
 * 文の末尾（句点・閉じかぎを落とした位置）でだけ当てる。
 */
const ASK_ENDS: string[] = [
  'ください', 'くださらぬ', 'くだされ', 'くだされい', 'おくれ', 'くれ', 'くれぬ', 'たまえ',
  'なさい', 'なされ', 'なされい', 'せよ', 'しろ', 'せい', 'たのむ', 'たのみます', '願います',
  'ましょう', 'ませぬか', 'ませんか', 'ないか', 'ぬか',
  // 命令形（活用の網羅でなく、コーパスに出た形＝人が育てるリスト）
  '見ろ', 'やめろ', '逃げろ', '出せ', '来い', 'こい', '行け', 'ゆけ', '帰れ', '待て', '聞け',
  '言え', 'やれ', '見よ',
];

/**
 * ★型10 の印③＝問い（聞き手に返事を要求する）。
 * ⚠️ 裸の「か」は詠嘆・独語にもなる（「猿の 弟、か。……ふん」＝信長のひとりごと）＝**読点の直後の
 * 「か」は問いにしない**。「の」は名詞化の「もの」「〜のだ」を拾うので**印から外した**
 * （自己レビュー 2026-08-05。この2つが実データで誤検出していた）。
 */
const QUESTION_END = /(?<![、,])か$/;

/**
 * ★型10 の印④＝**呼びかけ**（声の頭で名を呼ぶ）。「小竹や。」「父上。」「渋沢さん。」＝
 * いちばん強い宛先の印。名は作品ごとに違うので `RENAMED_NAMES`（型4 の表）と shortNames から
 * 引く＝ここに作品固有の名を二重に持たない。続柄・敬称は手で育てるリスト。
 * ⚠️ 「殿は、その"あと"が できる お方だ」（きみを三人称で語る声）と分けるため、**頭の一句**
 * （最初の読点・句点まで）でだけ当て、短い呼びかけに限る。
 * ⚠️ 敬称（さん・さま・どの）は**きみ以外への呼びかけ**も拾いうる。抑えているのは錨のほうで、
 * 「その画面にきみがいる」以上の保証は無い（診断であってゲートでない理由の1つ）。
 */
export const VOCATIVE_TITLES: string[] = [
  '殿', '父上', '母上', '母うえ', '父うえ', '兄上', '姉上', '兄ぎみ', '姉ぎみ', '若', '若君',
  '先生', 'おじいさま', 'おばあさま', 'おやかたさま', 'さん', 'さま', 'どの',
];
/**
 * 声の**第一文**を読点で割った句（かぎ・ためらい・「なあ」等は落とす）。
 * 呼びかけは頭とは限らない——「よくぞ ここまで 昇った、清盛。」（自己レビュー 2026-08-05）。
 */
function vocativeChunks(speech: string): string[] {
  return speech
    .replace(/^[「『…—]+/, '')
    .replace(/^(?:なあ|のう|おい|やい)/, '')
    .split(/[。！？]/)[0]
    .split('、')
    .map((s) => s.replace(/[やよ]$/, ''))
    .filter((s) => s.length > 0 && s.length <= 8);
}

/** その句は きみへの呼びかけか（名は完全一致・敬称は語尾一致）。 */
function isVocative(chunk: string, names: string[]): boolean {
  return names.includes(chunk) || VOCATIVE_TITLES.some((t) => chunk.endsWith(t));
}

/**
 * ⚠️ `class="speak"` は「他人の声」とは限らない——**きみ自身が頼む台詞**も同じ枠で書かれている
 * （渋沢 6-b「きみは 静岡へ 行き、その 前に すわった」→「殿の 一生を、書き残させて ください」。
 * 自己レビュー 2026-08-05 が実データで摘出）。話者の印は日本語では声の**外**にあり、しかも
 * 前にも後ろにも置かれる（「——年老いた 貴族が…言い張った」「そう 聞かれた」）＝
 * **他者への帰属がどこにも無く、直前がきみを主語に置いている声は、きみ自身の声として落とす**。
 * ⚠️ 錨を「きみを・きみに」（目的格）へ絞る手も試したが、実データの半分（「母うえ。」等の
 * 正しい呼びかけ）を落とした＝**主語省略のある言語では、格で話者は決まらない**。
 */
const ATTRIBUTION = /そう(?:言|聞|たずね|つぶや|ささや)|言った|言い張っ|聞かれた|たずねた|の声|答えた|つぶやい|ささやい/;
const YOU_AS_SUBJECT = /きみ(?:は|も)/;

interface Para {
  speak: boolean;
  text: string;
}

/** 主線の段落列（`plainText` 済み）。声とその隣の地の文の距離を見るために順序を保つ。 */
function paragraphs(raw: string): Para[] {
  return [...raw.matchAll(/<p([^>]*)>([\s\S]*?)<\/p>/g)].map((m) => ({
    speak: /class="speak"/.test(m[1]),
    text: plainText(m[2]),
  }));
}

/**
 * その声は「きみに宛てられている」か。**形と錨の AND** で見る:
 *   ①形＝二人称・依頼命令の文末・問い のどれかを含む（聞き手を要求する声）
 *   ②錨＝すぐ隣（直前か直後）の地の文が「きみ」を名ざす（その聞き手がきみだと画面が言っている）
 * 片方だけでは足りない——①だけでは遠くの誰かへの命令（淀殿の「だれに 頭を 下げよ」）を拾い、
 * ②だけでは「きみの前で交わされた会話」（家中が割れる画面）を拾う。それこそ型10 が
 * 分けたかった側だ（engagement.md §19）。
 */
/**
 * 声の**形**だけを見る（宛先はここでは決まらない）:
 *   aimed ＝きみを名ざす（二人称・呼びかけ）＝**話者がきみ自身ではありえない**声
 *   asks  ＝返事を要求する（依頼命令の文末・問い）
 */
function speechForm(raw: string, names: string[]): { aimed: boolean; asks: boolean } {
  // ⚠️ 手帳の「？？？」（未発見の枠を指す UI の記号）を本文が引用している＝問いではない。
  // 終章のむすびが3作とも同じ一文を持ち、較正元 hidenaga の 7-d はこれで「きみへの問い」に
  // 数えられていた（自己レビュー 2026-08-05・型10 の時から入っていた誤検出）。
  const speech = raw.replace(/？{2,}/g, '');
  return {
    aimed:
      ADDRESS_WORDS.some((w) => speech.includes(w)) ||
      vocativeChunks(speech).some((c) => isVocative(c, names)),
    asks: speech
      .split(/(?<=[。！？…])/)
      .some(
        (s) =>
          s.includes('？') ||
          ((t) => ASK_ENDS.some((e) => t.endsWith(e)) || QUESTION_END.test(t))(
            s.replace(/[。！？…、「」『』]+$/g, ''),
          ),
      ),
  };
}

function addressedToYou(paras: Para[], i: number, names: string[]): boolean {
  const speech = paras[i].text;
  const { aimed, asks } = speechForm(speech, names);
  if (!aimed && !asks) return false;
  const prev = paras[i - 1]?.speak ? undefined : paras[i - 1];
  const next = paras[i + 1]?.speak ? undefined : paras[i + 1];
  if (![prev, next].some((p) => p?.text.includes('きみ'))) return false;
  if (aimed) return true;
  // ⚠️ 地の文が自前の引用を抱えているとき、その帰属（「——笑って、そう 答えた。」）は**その引用**の
  // ものであって、直前の声のものではない（渋沢 3-c で実データが誤検出。2026-08-05）。
  const nextAttributes = next && !/[「『]/.test(next.text) && ATTRIBUTION.test(next.text);
  const attributed = ATTRIBUTION.test(speech) || !!nextAttributes;
  return attributed || !YOU_AS_SUBJECT.test(prev?.text ?? '');
}

/**
 * ★型11 — その声は**きみ自身の声**か。`addressedToYou` の裏側で、判定の材料は同じ3つ:
 * 名で呼ぶ・二人称の声はきみ自身ではありえない／他者への帰属があれば他人の声／
 * 直前の地の文がきみを主語に置いていれば きみの声。
 */
function isYourVoice(paras: Para[], i: number, names: string[]): boolean {
  if (!paras[i].speak || speechForm(paras[i].text, names).aimed) return false;
  const prev = paras[i - 1]?.speak ? undefined : paras[i - 1];
  const next = paras[i + 1]?.speak ? undefined : paras[i + 1];
  if (!prev || !YOU_AS_SUBJECT.test(prev.text)) return false;
  const nextAttributes = next && !/[「『]/.test(next.text) && ATTRIBUTION.test(next.text);
  return !(ATTRIBUTION.test(paras[i].text) || nextAttributes);
}

/**
 * ★型11 の印＝**地の文が返事を報告する語**。⚠️「返事」は入れない——「きみの 返事を 待って いる」
 * （3-a2 の持ち越しの一句）が答えとして数えられてしまう。打ち消しは `NEGATION` で落とす
 * （「きみは、すぐには 答えなかった。」＝答えていない＝開いたまま）。
 */
const REPLY_MARKS = ['答え', 'うなずい', '首を ふ', 'ことわっ', '断っ', '承知', '引き受け'];

/**
 * ⚠️ 同じ語が**仮定**にも立つ——「引き受ければ、また 主が でき…」は岐路の代償を並べた一文で、
 * きみはまだ答えていない（davinci 5-b。実データで摘出）。打ち消しと同じく、報告として数えない。
 * 仮定は問いを**開いたまま**にする形なので、見落とすと choice が closed に化ける。
 */
const CONDITIONAL = /^(?:れば|たら|ても|でも|るなら|なら|得れば)/;

/** その問いのあと、同じ画面の中できみが答えているか（きみの台詞／地の文の報告）。 */
function answeredAfter(paras: Para[], i: number, names: string[]): boolean {
  for (let j = i + 1; j < paras.length; j++) {
    if (paras[j].speak) {
      if (isYourVoice(paras, j, names)) return true;
      continue;
    }
    const t = paras[j].text;
    if (!t.includes('きみ')) continue;
    for (const m of REPLY_MARKS)
      for (let k = t.indexOf(m); k >= 0; k = t.indexOf(m, k + m.length)) {
        const tail = t.slice(k + m.length);
        if (!NEGATION.test(tail) && !CONDITIONAL.test(tail)) return true;
      }
  }
  return false;
}

/**
 * その作品で**きみが呼ばれる名**（型4 の `RENAMED_NAMES` の鎖＋ shortNames）。
 * 改名しない主人公は1つ。作品固有の名をこの計器に書き足さないための引き方。
 */
export function callNames(work: Work): string[] {
  const short = work.shortNames[work.protagonistId] ?? '';
  const chains = (RENAMED_NAMES[work.id] ?? []).filter((c) => c.includes(short));
  return [...new Set([short, ...chains.flat()])].filter(Boolean);
}

/** ★型11: 問いの行き先（ヘッダの4分類）。 */
export type AskVerdict = 'closed' | 'choice' | 'carried' | 'dropped';

export interface SceneAgency {
  id: string;
  /** Other people's voices in the main line (`class="speak"` paragraphs). */
  voices: number;
  /** ★型10: voices that are addressed to きみ（形＋錨。`addressedToYou`）. */
  addressed: number;
  /** ★型11: addressed voices that demand a reply (問い・依頼命令). */
  demands: number;
  /** ★型11: of those, the ones still unanswered when the scene ends. */
  open: number;
  /** ★型11: the reader answers here（この画面に岐路がある）. */
  hasChoices: boolean;
  /** ★型11: where the demand lands（次の画面が要るので `auditWork` が付ける）. */
  askVerdict?: AskVerdict;
  /** ★型11: paragraphs still running after the last demand（0〜1＝問いのまま画面が切れる）. */
  tailAfterAsk: number;
  /** ACT_VERBS matched in sentences that name きみ (either direction). */
  acts: string[];
  /** acts + voices. */
  score: number;
  /** score >= 2. */
  engaged: boolean;
  /**
   * ミニゲーム・観察ビューのある画面。**相手のいる行為ではない**が、死んだ画面でもない
   * （§14＝ダビンチ 1-b の観察ビューは「いちばん楽しかった」）。報告で混同しないよう持つ。
   */
  hands: boolean;
}

export interface ChapterAgency {
  chapterId: number;
  title: string;
  scenes: SceneAgency[];
  engaged: number;
  /** Longest run of consecutive non-engaged scenes anywhere in the chapter. */
  longestGap: number;
  /** Non-engaged scenes at the head of the chapter (where the reader decides to quit). */
  headGap: number;
  /** ★型10: voices in the chapter, and how many of them are addressed to きみ. */
  voices: number;
  addressed: number;
  /** Scenes before the chapter's first voice addressed to きみ（無ければ章の画面数）. */
  addressedHeadGap: number;
  /** ★型11: demands in the chapter, counted by where the answer lands. */
  asks: Record<AskVerdict, number>;
}

/** Sentences that name the protagonist — any particle, so both directions are seen. */
function youSentences(body: string): string[] {
  return plainText(body)
    .split(/(?=[「])|(?<=[。！？」])/)
    .filter((s) => s.includes('きみ'));
}

/**
 * その位置の一致が行為か＝より長い NOT_ACTS がその位置を覆っていない、かつ直後が打ち消しでも仮定でもない。
 * ⚠️ **仮定は行為ではない**——「受ければ、きみは たぶん 日本一の 金持ちに なる。断れば…」（shibusawa 5-b）は
 * 岐路の代償を並べた一文で、きみはまだ何もしていない。`answeredAfter` と同じ型の穴で、自己レビューが
 * 実データで摘出した（この1件だけで score が 2 に達し `engaged` が覆っていた）。
 */
function actAt(text: string, i: number, verb: string): boolean {
  for (const n of NOT_ACTS)
    for (let k = text.indexOf(n); k >= 0; k = text.indexOf(n, k + 1))
      if (k <= i && i < k + n.length) return false;
  const tail = text.slice(i + verb.length);
  return !NEGATION.test(tail) && !CONDITIONAL.test(tail);
}

export function sceneAgency(id: string, sc: Scene, names: string[] = []): SceneAgency {
  const raw = sc.text ?? '';
  const voices = (raw.match(/class="speak"/g) ?? []).length;
  const paras = paragraphs(raw);
  const aimedAt = paras.map((p, i) => p.speak && addressedToYou(paras, i, names));
  const addressed = aimedAt.filter(Boolean).length;
  const demanding = paras
    .map((p, i) => i)
    .filter((i) => aimedAt[i] && speechForm(paras[i].text, names).asks);
  const open = demanding.filter((i) => !answeredAfter(paras, i, names)).length;
  const acts: string[] = [];
  for (const s of youSentences(raw))
    for (const v of ACT_VERBS) {
      if (acts.includes(v)) continue;
      for (let i = s.indexOf(v); i >= 0; i = s.indexOf(v, i + 1))
        if (actAt(s, i, v)) {
          acts.push(v);
          break;
        }
    }
  const score = acts.length + voices;
  return {
    id,
    voices,
    addressed,
    demands: demanding.length,
    open,
    hasChoices: !!sc.choices?.length,
    tailAfterAsk: demanding.length ? paras.length - 1 - demanding[demanding.length - 1] : 0,
    acts,
    score,
    engaged: score >= 2,
    hands: !!(sc.minigame || sc.observe),
  };
}

export function auditWork(work: Work): ChapterAgency[] {
  const names = callNames(work);
  return work.story.chapters.map((ch) => {
    const scenes = Object.entries(ch.scenes).map(([id, sc]) => sceneAgency(id, sc, names));
    // ★型11: 問いの行き先は次の画面まで見ないと決まらない（岐路は隣に置かれる）。
    const asks: Record<AskVerdict, number> = { closed: 0, choice: 0, carried: 0, dropped: 0 };
    for (const s of scenes) {
      if (!s.demands) continue;
      const to = ch.scenes[s.id].next;
      // 1画面に複数の問いがあり、片方だけ答えられていることがある（閉じたぶんは別に数える）。
      asks.closed += s.demands - s.open;
      const v: AskVerdict = !s.open
        ? 'closed'
        : s.hasChoices
          ? 'choice'
          : to && ch.scenes[to]?.choices?.length
            ? 'carried'
            : 'dropped';
      s.askVerdict = v;
      if (s.open) asks[v] += s.open;
    }
    let longestGap = 0,
      run = 0,
      headGap = -1;
    for (const s of scenes) {
      if (s.engaged) {
        if (headGap < 0) headGap = run;
        run = 0;
      } else {
        run++;
        longestGap = Math.max(longestGap, run);
      }
    }
    const firstAddressed = scenes.findIndex((s) => s.addressed > 0);
    return {
      chapterId: ch.id,
      title: plainText(ch.title),
      scenes,
      engaged: scenes.filter((s) => s.engaged).length,
      longestGap,
      // A chapter with no engaged scene at all: the whole chapter is the head gap.
      headGap: headGap < 0 ? scenes.length : headGap,
      voices: scenes.reduce((n, s) => n + s.voices, 0),
      addressed: scenes.reduce((n, s) => n + s.addressed, 0),
      addressedHeadGap: firstAddressed < 0 ? scenes.length : firstAddressed,
      asks,
    };
  });
}
