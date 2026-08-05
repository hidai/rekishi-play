// ★型9 の計器の較正（scripts/lib/agency-audit.ts）。
//
// この計器は「相手のいる行為」を数える診断で、ゲートではない（しきい値で本文を縛らない）。
// ここが守るのは**物差しそのもの**——初版は「きみが主語の行為」だけを数え、**子どもの実反応で
// 検証済みの唯一のコーパス（秀長）が7作の最下位に落ちた**（docs/design/engagement.md §18）。
// 計器の較正は、読み通しで実際に観察された画面に合わせてしか決められないので、その観察点を
// テストに固定する＝次のサイクルが語を足したり判定を変えたときに、較正が静かに崩れない。
import { describe, it, expect } from 'vitest';
import { hidenaga } from '../src/works/hidenaga/index';
import { ieyasu } from '../src/works/ieyasu/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { shibusawa } from '../src/works/shibusawa/index';
import { auditWork, callNames, sceneAgency } from '../scripts/lib/agency-audit';
import type { Work } from '../src/engine/types';

function scene(work: Work, chapterId: number, id: string) {
  const ch = work.story.chapters.find((c) => c.id === chapterId)!;
  return sceneAgency(id, ch.scenes[id], callNames(work));
}

describe('型9 の計器: 読み通しで観察された画面に合っている', () => {
  it('両ペルソナが最上位に挙げた2画面は engaged（§17）', () => {
    // 1-c2 は「きみ」を一度も書かない台詞の応酬（声2）＝ここを落としたのが初版の誤り。
    expect(scene(shibusawa, 1, '1-c2').engaged).toBe(true);
    // 7-b は他者の声ゼロで、きみの行為だけが連なる（立つ・説く・つくる・よびかける）。
    expect(scene(shibusawa, 7, '7-b').engaged).toBe(true);
  });

  it('§14 が「いちばん心に残った画面」に挙げた親子の場面は engaged（相手→きみ の向き）', () => {
    // 母・なかが きみの手をにぎって「そばに いてやって おくれ」。行為1＋声1。
    expect(scene(hidenaga, 1, '1-d').engaged).toBe(true);
  });

  it('小5 が実際にやめた画面は engaged でない（§17）', () => {
    // 6-a＝章六の頭。載っている行為は30年前の回想だけで、いま人は動いていない。
    expect(scene(shibusawa, 6, '6-a').engaged).toBe(false);
  });

  it('較正元（秀長）に「章まるごと空白」の章は無い', () => {
    // ⚠️ この線は二度動いた。初版の「空白ゼロ」は誤検出1件（3-a の「手に入れ」＝城を得た結果を
    // 行為として数えていた）だけで支えられており、2026-08-04 の code review でそれを消すと
    // 秀長 ch3（但馬・播磨）は本当に空白だった＝待ち行列へ。その ch3 を埋めた（3-a2 の普請・
    // 3-c で城を受けとる）ので、線をふたたび「空白ゼロ」へ締める。ここが赤くなったら、
    // 計器か作品のどちらかが動いた印。
    const blank = auditWork(hidenaga).filter((ch) => ch.engaged === 0);
    expect(blank.map((ch) => ch.chapterId)).toEqual([]);
  });

  it('行為の語が、行為でない言い方を拾っていない', () => {
    // 誤検出の再発防止（NOT_ACTS ＋ 打ち消し）。どちらも実データで起きていた型。
    expect(sceneAgency('t', { text: '<p>きみは 竹田城を 手に入れた。</p>' } as never).acts).toEqual([]);
    expect(sceneAgency('t', { text: '<p>学校にも きみを 入れなかった。</p>' } as never).acts).toEqual([]);
    expect(sceneAgency('t', { text: '<p>きみは 答えない。</p>' } as never).acts).toEqual([]);
    // 素の形は拾う（除外が広すぎないことの裏）。
    expect(sceneAgency('t', { text: '<p>きみは この 人を 役所に 入れた。</p>' } as never).acts).toEqual(['入れ']);
  });
});

describe('型10 の計器: その声は「きみ」に宛てられているか', () => {
  /** きみを名ざす地の文（錨）のすぐ下に置いた1つの声。 */
  const anchored = (speech: string, names: string[] = []) =>
    sceneAgency(
      't',
      { text: `<p>その 者が、きみの 顔を 見た。</p><p class="speak">「${speech}」</p>` } as never,
      names,
    ).addressed;

  it('2ラウンド続けて両ペルソナが選んだ画面が最上位（hidenaga 3-a2）', () => {
    // 年よりが顔を見て問い、返事を待つ＝声2つとも宛先つき。ここが型10 の較正点。
    expect(scene(hidenaga, 3, '3-a2').addressed).toBe(2);
  });

  it('前サイクルの直しを見分ける（ieyasu 6-b の「殿、おきめ ください」）', () => {
    // 同じ画面の他の2声は ます形の議論＝宛先なし。1/3 で入るのが型10 の解像度。
    expect(scene(ieyasu, 6, '6-b').addressed).toBe(1);
    // 6-b2 は遠くの声（牢人・淀殿）。きみは聞いているだけ＝0。
    expect(scene(ieyasu, 6, '6-b2').addressed).toBe(0);
  });

  it('★丁寧語は宛先ではない（対者敬語で ○ を取らせない）', () => {
    // 観察の起点そのもの——ieyasu 6-b の初版は ます形の声が2つあって「だれも きみに
    // 話しかけてこない」と読まれた。要求（おきめ ください）だけが宛先になる。
    expect(anchored('時を おけば、牢人は なお ふえまするぞ')).toBe(0);
    expect(anchored('殿、おきめ ください')).toBe(1);
    expect(anchored('大事ないか')).toBe(1);
  });

  it('★形だけ・錨だけでは数えない（AND）', () => {
    // 形はあるが、隣の地の文が きみを名ざしていない＝遠くの誰かへの声。
    expect(
      sceneAgency('t', {
        text: '<p>遠い 声が、聞こえた 気が した。</p><p class="speak">「だれに 頭を 下げよと 言うのです」</p>',
      } as never).addressed,
    ).toBe(0);
    // 錨はあるが、要求も呼びかけも問いも無い声＝きみの前で交わされた会話。
    expect(anchored('あの 者たちは、いくさの 話ばかり して おる')).toBe(0);
  });

  it('★`class="speak"` は「他人の声」とは限らない（きみ自身の台詞を数えない）', () => {
    // 渋沢 6-b＝きみが慶喜に頼む台詞（「殿の 一生を、書き残させて ください」）。直前の地の文が
    // きみを主語に置き、他者への帰属がどこにも無い＝きみの声。自己レビュー 2026-08-05 が摘出。
    expect(scene(shibusawa, 6, '6-b').addressed).toBe(0);
  });

  it('★独語の「か」と名詞化の「もの」は問いでない（自己レビューの誤検出2件）', () => {
    // 秀長 2-c＝信長のひとりごと（「猿の 弟、か。……ふん」＝**読点の直後の か**）。
    expect(scene(hidenaga, 2, '2-c').addressed).toBe(0);
    expect(anchored('高く 昇った 者は、いつか 落ちる もの')).toBe(0);
  });

  it('★地の文が自前の引用を抱えているとき、帰属動詞はその引用のもの（渋沢 3-c）', () => {
    // きみ自身の問いの直後に、別人の返答が「埋め込み引用＋帰属動詞」で来る形。旧版は その
    // 「答えた」を**前の声**の帰属として拾い、きみの問いを「きみに宛てられた声」と数えた。
    expect(
      sceneAgency('t', {
        text:
          '<p>きみは、すぐには 答えなかった。</p>' +
          '<p class="speak">「——もし へったら、だれが つぐなうのですか。」</p>' +
          '<p>「へった ことは ありません。」——笑って、そう 答えた。</p>',
      } as never).addressed,
    ).toBe(0);
    // 対照＝引用を抱えていない地の文の帰属は、これまでどおり数える（除外が広すぎない裏）。
    expect(
      sceneAgency('t', {
        text:
          '<p>きみは、すぐには 答えなかった。</p>' +
          '<p class="speak">「——もし へったら、だれが つぐなうのですか。」</p>' +
          '<p>その 人は、笑って そう 答えた。</p>',
      } as never).addressed,
    ).toBe(1);
  });

  it('呼びかけは声の頭とは限らない（清盛 3-c「よくぞ ここまで 昇った、清盛。」）', () => {
    // 第一文のどの句でも名を呼べる。名で呼ばれた声は**きみ自身の声ではありえない**ので、
    // 話者の印（帰属）を待たずに数える。
    expect(scene(kiyomori, 3, '3-c').addressed).toBe(1);
  });

  it('名で呼ぶ声は作品の名の表から引く（型4 の RENAMED_NAMES を共用）', () => {
    expect(callNames(hidenaga)).toContain('小竹');
    expect(anchored('小竹。……そばに いて おくれ', callNames(hidenaga))).toBe(1);
    // 名を三人称で語る声は宛先でない（頭の一句でだけ当てる）。
    expect(anchored('小竹は、物の 順番が 見える 目を して おる', callNames(hidenaga))).toBe(0);
  });
});
