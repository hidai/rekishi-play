// ★制度語のゲート。規則は docs/WRITING.md 13「制度語は その場で 一句で 言い換える」
// （検査の実装と面の定義は scripts/lib/institution-audit.ts のヘッダ、型の由来は
// docs/design/engagement.md §14 型3）。
//
// なぜ要るか: 読み通し検査で7作すべてに出た欠陥が「**読めるのに意味が分からない語**」だった。
// ふりがなの帳簿（ruby-furigana）は「その字が読めるか」しか見ておらず、既知前提の帳簿
// （known-premise）は「読者の外の知識に寄りかかっていないか」しか見ていない——**語の意味が
// その場で届くか**は、2026-08-01 までどの計器も見ていなかった。
//
// ラチェット式（ruby-furigana / known-premise と同じ idiom）: BASELINE は棚卸し待ちの帳簿で、
// 増やせない。登録の無いバケツ（新しい章・新しい作品）は 0 が要求される＝これから書くものは
// 最初から守られる。直したら数が減って落ちる＝同じサイクルで帳簿を下げさせる。
// 審査して「言い換えを置かない」と決めた語は ALLOWED_INSTITUTION へ理由つきで移す
// ＝この BASELINE は「未修正」だけを持つ。
//
// **0 件は「意味が届く」ではない**: 語は手で選んだリストで、リストの外の語は見えない
// （床＝ゲート／天井＝/eval-work の読み通しペルソナ）。言い換えは足せば良いものでもない
// ——注釈が増えるほど主線は説明に寄る（体験予算 glossesPerChapter が反対側から押す）。
// 言い換えられない語は**主線から降ろす**のが本筋。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import {
  ALLOWED_INSTITUTION,
  allowedKeysInUse,
  auditBuckets,
  auditWork,
  mainSurfaces,
} from '../scripts/lib/institution-audit';
import { bucketOf } from '../scripts/lib/ruby-audit';

/**
 * 棚卸し待ちの制度語（言い換えも無く、主線から降りてもいない初出）。キーは `作品:章` と
 * `作品:entry`。現物は `npx vite-node scripts/institution-audit.ts <作品slug>`。
 * 1サイクル1作の棚卸しで減らす（engagement.md §14 型3）。
 */
const BASELINE: Record<string, number> = {
  // ★2026-08-03 に走査面を3つ足した（hist・reveal・手帳の地図キャプション）。それまで
  // 「棚卸し済み」だった章に 10件 出てきたぶんが下の帳簿——**面が欠けている計器は、直した章を
  // 0件と報告し続ける**。棚卸しは1サイクル1作で減らす（現物は CLI）。
  // hidenaga: 全章 棚卸し済み（天下＝入口で言い換え／武士→侍・主君/主家→あるじ・家臣→家来・
  //   天下人→「天下を とった 兄」に統一（どれも作品がすでに使っている語）／領国・官位・石高・
  //   関白・幕府は主線から降ろす／兵糧は hist の初出で一句／侍・百姓・大名・太閤は ALLOWED）
  //   ＝統一した語は cards・clues・timeline・map・relations と手帳の地図キャプションにも散っていた
  // kiyomori: 全章 棚卸し済み（一門/棟梁→一族・院政は主線から降ろす／貴族・太政大臣は ALLOWED。
  //   退位した天皇の呼び名は「院」に統一して 2-a で言い換え＝上皇・法皇は主線から消えた〔2026-08-03〕）
  //   走査面を足して hist/reveal に3件 出たぶんも、同じ決定を当てて 0 に〔2026-08-03〕
  //   ＝hist の 一門→一族・院政は降ろす、reveal の 令旨→主線が使う「声」に統一。
  // katsu: 全章 棚卸し済み（幕府は入口から降ろして 1-a へ／主家・主君→あるじに統一／蘭学は ALLOWED）
  // ieyasu: 全章 棚卸し済み（家臣→家来・侍→武士・主家/主君→「仕えた 家」「あるじ」に統一／
  //   兵糧→米・百姓・天下人は主線から降ろす／人質・大名・幕府・牢人は ALLOWED）
  //   ＝ch7 は reveal「東照大権現」の caption に 朝廷 が裸で出ていた
  'ieyasu:ch7': 1,
  // davinci: 全章 棚卸し済み（公証人・宮廷・教皇・修道院はその場で言い換え／将軍→「いくさの 大将」に降ろす／
  //   私生児・工房は ALLOWED。教皇・宮廷は この棚卸しで INSTITUTION_TERMS に追加）
  // masako: 全章 棚卸し済み（武士・将軍・幕府・上皇・朝敵は その場で言い換え／鎌倉殿→将軍に統一・
  //   貴族・朝廷は主線から降ろす／御台所・御家人・乳母・執権は ALLOWED。鎌倉殿・乳母は
  //   この棚卸しで INSTITUTION_TERMS に追加）＝ch3 は もしも枝の hist に 出家 が裸で残っていた
  'masako:ch3': 1,
  // shibusawa: 全章 棚卸し済み（幕府・将軍・大蔵省はその場で言い換え／将軍は入口の謎から・藩と
  //   頭取と「官」は主線から降ろす〔徳川の 家／かしら／役人〕・武士→侍に統一／百姓・代官・幕臣・
  //   侍・朝敵・株は ALLOWED。代官・大蔵省・頭取・株は この棚卸しで INSTITUTION_TERMS に追加）
  //   走査面を足して出た2件も 0 に〔2026-08-03〕＝hist の 浪人は「どこの 家にも 入らない」へ降ろし
  //   （同じ画面の岐路が「一橋の 家来に なれ」＝作品の語彙で言える）、手帳の地図キャプションの
  //   攘夷は 7章ぶんの ruby ごと プレーンへ書き直した（この面は textContent 描画＝タグが生で出る）
};

describe('institution-gloss: 制度語は その場で 一句で 言い換える', () => {
  for (const work of ALL_WORKS) {
    const found = auditBuckets(work);
    const byBucket = new Map<string, ReturnType<typeof auditWork>>();
    for (const h of auditWork(work).filter((h) => !h.allowed)) {
      const key = `${work.id}:${bucketOf(h.surface)}`;
      byBucket.set(key, [...(byBucket.get(key) ?? []), h]);
    }
    const keys = [
      ...new Set([
        ...Object.keys(found).map((b) => `${work.id}:${b}`),
        ...Object.keys(BASELINE).filter((k) => k.startsWith(`${work.id}:`)),
      ]),
    ].sort();
    for (const key of keys) {
      const allowed = BASELINE[key] ?? 0;
      it(`${key}: 言い換え無しの制度語 ${allowed} 件のまま（増やさない・直したら帳簿を下げる）`, () => {
        const hits = byBucket.get(key) ?? [];
        expect(
          hits.length,
          allowed === 0
            ? `主線の制度語が言い換えられていない:\n${hits.map((h) => `  ${h.surface} 「${h.term}」 …${h.excerpt}…`).join('\n')}`
            : `BASELINE['${key}'] を ${hits.length} に直す（npx vite-node scripts/institution-audit.ts ${work.id}）`,
        ).toBe(allowed);
      });
    }
  }

  // 許可表も帳簿と同じく腐る: 主線を書き直して語が消えたのに理由だけ残ると、次に同じ語を
  // 書いたとき無審査で通る（許可の意味が「審査したその1件」から「その語ぜんぶ」へ広がる）。
  it('ALLOWED_INSTITUTION が実データと合う（消えた許可を赤にする）', () => {
    expect(Object.keys(ALLOWED_INSTITUTION).sort()).toEqual(allowedKeysInUse(ALL_WORKS));
  });

  it('BASELINE に死んだ登録が無い（作品・章が消えたら掃除する）', () => {
    const live = new Set(
      ALL_WORKS.flatMap((w) => Object.keys(auditBuckets(w)).map((b) => `${w.id}:${b}`)),
    );
    expect(Object.keys(BASELINE).filter((k) => !live.has(k))).toEqual([]);
  });

  // 空回りの防止（ruby ゲートの初版はキーの prefix 欠落で何も守っていなかった）:
  // 裸の制度語が赤くなること・言い換えが緑になること・初出の面だけを見ていること・
  // 入口の面が走査に載っていることを直に確かめる。
  it('注入した制度語を検出する（裸／言い換え／ルビ越し／初出主義）', () => {
    const scene = (parts: string[]) => ({ id: 'ch9/9-z', parts });
    const bare = {
      ...ALL_WORKS[0],
      id: 'x',
      map: { ...ALL_WORKS[0].map, chapterCaptions: {} },
      story: { chapters: [] },
    };
    const hitsOf = (parts: string[]) => {
      const w = {
        ...bare,
        strings: { ...bare.strings, titleMain: '', titleSub: '', titleHook: '', titleNote: '' },
        riddle: '',
        story: {
          chapters: [
            { id: 9, num: '', title: '', lead: '', start: '9-z', scenes: { '9-z': { text: parts.join('') } } },
          ],
        },
      } as unknown as (typeof ALL_WORKS)[number];
      return auditWork(w).map((h) => h.term);
    };
    expect(hitsOf(['<ruby>幕府<rt>ばくふ</rt></ruby>が ひらかれた'])).toEqual(['幕府']);
    expect(hitsOf(['<ruby>幕府<rt>ばくふ</rt></ruby>（刀を さす 人たちの 政府）が ひらかれた'])).toEqual([]);
    // 言い換えを別の制度語で書いたら、それも初出＝読者はやはり置いていかれる
    expect(hitsOf(['<ruby>幕府<rt>ばくふ</rt></ruby>（<ruby>将軍<rt>しょうぐん</rt></ruby>の 政府）'])).toEqual(['将軍']);
    // 2回目以降は数えない（初出主義）／長い語が短い語に食われない
    expect(hitsOf(['天下人が 立つ。天下人が 二人。'])).toEqual(['天下人']);
    expect(scene(['x']).id).toBe('ch9/9-z');
    // 入口の面が走査に載っている（型1 で発見した「計器が見ていない面」の再発防止）
    for (const work of ALL_WORKS) {
      const entry = mainSurfaces(work)[0];
      expect(entry.id).toBe('entry');
      expect(entry.parts.join('').length, `${work.id} の入口が空`).toBeGreaterThan(20);
    }
  });

  // 「読者が開かずに読む面」を数え落とすと、直した章を 0 件と報告し続ける（2026-08-03 の穴）。
  // reveal は本文より先（シーンに入った瞬間の全画面）、hist は選択の直後に自動で開く強制読み面、
  // 手帳の地図キャプションは ruby を置けない読者面。3つとも走査に載っていることを直に確かめる。
  it('reveal・hist・手帳の地図キャプションが走査に載っている', () => {
    const bare = ALL_WORKS[0];
    const w = {
      ...bare,
      id: 'x',
      strings: { ...bare.strings, titleMain: '', titleSub: '', titleHook: '', titleNote: '' },
      riddle: '',
      map: { ...bare.map, chapterCaptions: { 1: '<ruby>攘夷<rt>じょうい</rt></ruby>の 志士たち' } },
      story: {
        chapters: [
          {
            id: 9,
            num: '',
            title: '',
            lead: '',
            start: '9-z',
            scenes: {
              '9-z': {
                text: 'きみは 走った',
                reveal: { title: '急報', caption: '<ruby>令旨<rt>りょうじ</rt></ruby>が かけめぐる' },
                choices: [{ label: '行く', to: '9-z', hist: { verdict: '', match: '', body: '<ruby>院政<rt>いんせい</rt></ruby>は 止まった' } }],
              },
            },
          },
        ],
      },
    } as unknown as (typeof ALL_WORKS)[number];
    expect(mainSurfaces(w).map((s) => s.id)).toEqual([
      'entry',
      'ch9',
      'ch9/9-z#reveal', // シーンに入った瞬間＝本文より先に読む
      'ch9/9-z',
      'ch9/9-z#hist0',
      'notebook:map', // 章を読み終えた読者が手帳で読む＝初出を横取りしない末尾
    ]);
    expect(auditWork(w).map((h) => `${h.surface} ${h.term}`)).toEqual([
      'ch9/9-z#reveal 令旨',
      'ch9/9-z#hist0 院政',
      'notebook:map 攘夷',
    ]);
    // 実データでも空でないこと（面はあるのに中身を渡していない、を防ぐ）
    for (const work of ALL_WORKS) {
      const notebook = mainSurfaces(work).find((s) => s.id === 'notebook:map');
      expect(notebook?.parts.join('').length, `${work.id} の手帳キャプションが空`).toBeGreaterThan(20);
    }
  });
});
