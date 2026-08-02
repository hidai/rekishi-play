// ★名の鎖のゲート。規則は docs/WRITING.md 13「同じ人を 面ごとに 別の名で 呼ばない」
// （検査の実装と判定は scripts/lib/name-audit.ts のヘッダ、型の由来は
// docs/design/engagement.md §14 型4）。
//
// なぜ要るか: 読み通し検査で2作の読者が「名前が4つあって自信がない」「やっと同じ人だと
// 分かったのは最後の画面」と答えた。本文が当時の名（小竹・竹千代）で語るあいだ、hist・deep は
// 後世の名（秀長・家康）で呼ぶ——**面をまたぐ呼び替え**は、書き手には同じ人でも、読者には
// 別人が増えていくだけ。ふりがなの帳簿も制度語の帳簿も固有名詞を見ないので、この層は
// 2026-08-02 までどの計器も見ていなかった。**家の名（木下→羽柴→豊臣）も同じ型**で、
// 入口だけで結んで物語では一度も結ばない、という抜け方をしていた（だから入口は種にしない）。
//
// ラチェットを持たない（BASELINE 無し）＝**全作 0 件が要求**。型4 の対象が2作しかなく、
// 同じサイクルで直しきれたから。新しい作品の主人公が改名するなら、RENAMED_NAMES に
// 名を足してから書く＝最初から守られる。
//
// **0 件は「読者が同一人物だと分かる」ではない**: 機械が見るのは同じ面での共起だけで、
// 結び方の質（「小竹——のちの 秀長」なのか、離れた二か所に並んでいるだけなのか）は
// /eval-work の読み通しペルソナの仕事。床＝ゲート／天井＝ペルソナ。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import {
  ALLOWED_NAME_BREAK,
  RENAMED_NAMES,
  allowedKeysInUse,
  auditWork,
} from '../scripts/lib/name-audit';

describe('name-continuity: 名が変わる人は、その場で前の名と結ぶ', () => {
  for (const work of ALL_WORKS) {
    it(`${work.id}: 前の名と結ばれずに初出する名が 0 件`, () => {
      const open = auditWork(work).filter((b) => !b.allowed);
      expect(
        open.map((b) => `${b.surface} 「${b.name}」 …${b.excerpt}…`),
        '現物は npx vite-node scripts/name-audit.ts <作品slug>',
      ).toEqual([]);
    });
  }

  it('RENAMED_NAMES に全作品の欄がある（新作品は空配列で「改名なし」と明示する）', () => {
    for (const work of ALL_WORKS) expect(RENAMED_NAMES[work.id], work.id).toBeDefined();
  });

  it('ALLOWED_NAME_BREAK に腐った項目が無い', () => {
    const inUse = new Set(allowedKeysInUse(ALL_WORKS));
    expect(Object.keys(ALLOWED_NAME_BREAK).filter((k) => !inUse.has(k))).toEqual([]);
  });

  // ゲートは「赤くなること」を注入で確かめる（JOURNAL 2026-07-27・ルビゲートの学び）。
  it('名を結ばずに呼び替えると赤くなる', () => {
    const work = ALL_WORKS.find((w) => w.id === 'katsu')!;
    const broken = {
      ...work,
      story: {
        ...work.story,
        chapters: work.story.chapters.map((ch) =>
          ch.id !== 1
            ? ch
            : {
                ...ch,
                title: '海のむこう',
                lead: 'すべては、ここから はじまった。',
                scenes: Object.fromEntries(
                  Object.entries(ch.scenes).map(([sid, sc]) => [
                    sid,
                    sid === '1-a' ? { ...sc, text: '<p>きみは 勝麟太郎。</p>' } : sc,
                  ]),
                ),
              },
        ),
      },
    };
    // 1-a が「きみは 勝麟太郎、のちの 海舟」で結んでいる。それを外すと、以後の面で
    // 呼ばれる「海舟」が別人として立つ（入口の『勝海舟』は種にしないので拾わない）。
    expect(auditWork(broken).map((b) => `${b.surface} ${b.name}`)).toContain('ch1/1-b#hist0 海舟');
  });
});
