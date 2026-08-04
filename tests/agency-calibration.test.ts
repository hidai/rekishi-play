// ★型9 の計器の較正（scripts/lib/agency-audit.ts）。
//
// この計器は「相手のいる行為」を数える診断で、ゲートではない（しきい値で本文を縛らない）。
// ここが守るのは**物差しそのもの**——初版は「きみが主語の行為」だけを数え、**子どもの実反応で
// 検証済みの唯一のコーパス（秀長）が7作の最下位に落ちた**（docs/design/engagement.md §18）。
// 計器の較正は、読み通しで実際に観察された画面に合わせてしか決められないので、その観察点を
// テストに固定する＝次のサイクルが語を足したり判定を変えたときに、較正が静かに崩れない。
import { describe, it, expect } from 'vitest';
import { hidenaga } from '../src/works/hidenaga/index';
import { shibusawa } from '../src/works/shibusawa/index';
import { auditWork, sceneAgency } from '../scripts/lib/agency-audit';
import type { Work } from '../src/engine/types';

function scene(work: Work, chapterId: number, id: string) {
  const ch = work.story.chapters.find((c) => c.id === chapterId)!;
  return sceneAgency(id, ch.scenes[id]);
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
