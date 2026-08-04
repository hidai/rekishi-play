// 物語フロー（旧 playScene の onEnter 部 / onChoice / afterChoice / finishChapter）。
// シーンの描画は SceneScreen が session.scene に応じて宣言的に行い、
// ここでは副作用（付与・保存・トースト・遷移）だけを扱う。
import type { AppStores } from './stores';
import type { Choice, Work } from './types';
import { sfx } from './sfx.svelte';
import { meterFx } from './metersfx.svelte';

function chapterById(stores: Pick<AppStores, 'work'>, id: number) {
  return stores.work.story.chapters.find((c) => c.id === id);
}

/** ★1: 選択の effect を「史実」パネルに出す増減チップの HTML 片へ（表示順は def 順）。 */
function meterChips(work: Work, effect: Choice['effect']): string[] {
  if (!effect || !work.meters) return [];
  const chips: string[] = [];
  for (const d of work.meters.defs) {
    const v = effect[d.key];
    if (!v) continue;
    const sign = v > 0 ? '＋' : '−';
    chips.push(
      `<span class="reward-chip meter ${d.key}">${d.icon} ${d.label} ${sign}${Math.abs(v)}</span>`,
    );
  }
  return chips;
}

/** シーンに入ったときの副作用（旧 playScene 前半）。再開位置保存＋onEnter 付与＋トースト。 */
export function applySceneEnter(
  stores: Pick<AppStores, 'work' | 'save' | 'toast' | 'session'>,
  chId: number,
  sceneId: string,
): void {
  const { work, save, toast, session } = stores;
  const ch = chapterById(stores, chId);
  const sc = ch?.scenes[sceneId];
  if (!sc) return;

  // 再開位置の保存（クリア済みの章では保存しない）。旧: S があれば必ず saveDB。
  // 読み返しで戻った場面は再開位置にしない——「どこまで読んだか」は進みぐあいで、
  // 「いま何を読んでいるか」とは別物（戻って抜けたら、続きは いちばん先から）。
  if (save.active) {
    if (save.active.progress[chId] !== 'done' && !session.rewound) {
      save.active.scene = { ch: chId, scene: sceneId };
    }
    save.persist();
  }

  // onEnter 付与
  if (sc.onEnter) {
    const oe = sc.onEnter;
    const cardList = ([] as string[]).concat(oe.card || [], oe.cards || []);
    const clueList = ([] as string[]).concat(oe.clue || [], oe.clues || []);
    let gotCard: string | null = null;
    let gotClue = false;
    cardList.forEach((id) => {
      if (save.grant('card', id)) gotCard = id;
    });
    clueList.forEach((id) => {
      if (save.grant('clue', id)) gotClue = true;
    });
    if (gotCard || gotClue) {
      const parts: string[] = [];
      if (gotCard) parts.push(cardList.length > 1 ? 'カード' : 'カード「' + work.cards[gotCard].name + '」');
      if (gotClue) parts.push('手がかり');
      toast.show('🎴 ' + parts.join('と') + 'を 手に入れた');
      if (gotCard) sfx.card();
      else sfx.clue(); // ★H 収集のごほうび音
    }
  }
}

/** 選択肢を選んだ（旧 onChoice → showHist → afterChoice）。 */
export async function chooseNext(
  stores: Pick<AppStores, 'work' | 'save' | 'session' | 'hist'>,
  chId: number,
  sceneId: string,
  i: number,
): Promise<void> {
  const { work, save, session, hist } = stores;
  const sc = chapterById(stores, chId)?.scenes[sceneId];
  const c = sc?.choices?.[i];
  if (!c) return;

  sfx.choice(); // ★H 選択を決めた手ざわり
  // ★L 分かれ道の記録（きみの読み・分かれ道図鑑）。戻って選び直した同じ枝は false ＝
  // メーターは二度加算しない（読み返しでも章の遊び直しでも「きみの人物像」は歪まない）。
  const fresh = save.recordChoice(chId, sceneId, i);

  if (c.hist) {
    const h = c.hist;
    const gains: string[] = [];
    const newCard = !!h.card && !!save.active && !save.active.cards.includes(h.card);
    const newClue = !!h.clue && !!save.active && !save.active.clues.includes(h.clue);
    if (newCard) gains.push(`<span class="reward-chip card">🎴 カード「${work.cards[h.card!].name}」</span>`);
    if (newClue) gains.push(`<span class="reward-chip clue">🔑 手がかり を 発見</span>`);
    if (fresh) gains.push(...meterChips(work, c.effect));
    sfx.stamp(); // ★H 「史実では」朱印スタンプの一撃
    // 選択で得たカード/手がかりは applySceneEnter を通らないので、ここで報酬音を重ねる。
    if (newCard) setTimeout(() => sfx.card(), 280);
    else if (newClue) setTimeout(() => sfx.clue(), 280);
    await hist.show(h, gains);
  }
  afterChoice(stores, chId, c, fresh);
}

function afterChoice(
  stores: Pick<AppStores, 'work' | 'save' | 'session'>,
  chId: number,
  c: Choice,
  fresh: boolean,
): void {
  const { save, session } = stores;
  const h = c.hist;
  const card = c.card || h?.card;
  const clue = c.clue || h?.clue;
  if (card) save.grant('card', card);
  if (clue) save.grant('clue', clue);
  if (fresh) save.bumpMeters(c.effect); // ★1: 選択のメーター増減を適用（ローカルのみ）
  // ★I 選択の"手ざわり": HUD のバーが伸び「＋N」が弾む＋上行ブリップ音。
  if (fresh && c.effect && Object.values(c.effect).some((v) => v)) {
    meterFx.pulse(c.effect);
    sfx.meter();
  }
  if (c.answer != null && save.active) {
    save.active.answer = c.answer;
    save.persist();
  }
  // 選択肢に end はない（章末は end シーンで扱う）が、旧構造を踏襲し to へ遷移。
  if (c.to) session.advance(c.to);
}

/** 次のシーンへ（旧 to-next）。 */
export function gotoScene(session: AppStores['session'], sceneId: string): void {
  session.advance(sceneId);
}

/** 章を終える（旧 finishChapter）。進捗を done にして章クリア画面へ。 */
export function finishChapter(stores: Pick<AppStores, 'save' | 'session'>, chId: number): void {
  const { save, session } = stores;
  if (save.active) {
    save.active.progress[chId] = 'done';
    save.active.scene = null;
    save.persist();
  }
  session.show('clear');
}
