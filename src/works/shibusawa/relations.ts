// ★D Character relation map (display-only). Draws the web of ties around Eiichi. Adds no cards;
// edges resolve as the player collects cards. 渋沢の力は「土地の面」でなく人・会社の点に宿る
// (design §3-4) ので、この図は主装置の一つ（人の図＝章一の起点・終章の総覧）。
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  cats: [
    { key: 'ai', label: '血洗島・渋沢の 家', color: '#31608c' }, // 藍（藍玉の 家）
    { key: 'seal', label: '徳川・旧主', color: '#b23a2e' }, // 朱
    { key: 'gold', label: '明治政府', color: '#a67c1a' }, // 金
    { key: 'midori', label: '実業・もう一つの 道', color: '#4a7a5a' }, // 緑
  ],
  edges: [
    { pid: 'p-junchu', rel: '従兄・師（道徳の 源）', cat: 'ai' },
    // 喜作が 増えて 血洗島の 輪が 混み、長い rel は 隣の 顔を 横切る（tests/relation-map）。
    // 直すのは 言葉の ほう＝「焼き討ちを 止めた 従兄」→ 章一の creed と 同じ 手ざわりの 短い 句へ。
    { pid: 'p-choshichiro', rel: '刀を おろさせた', cat: 'ai' },
    { pid: 'p-ichiroemon', rel: '父（藍の 商い）', cat: 'ai' },
    { pid: 'p-kisaku', rel: '共に 京へ 出た 従兄', cat: 'ai' },
    { pid: 'p-yoshinobu', rel: '旧主（将軍）', cat: 'seal' },
    { pid: 'p-akitake', rel: 'パリの 主君', cat: 'seal' },
    { pid: 'p-hiraoka', rel: '仕官を 推した 人', cat: 'seal' },
    { pid: 'p-okuma', rel: '政府に 引き入れた 人', cat: 'gold' },
    { pid: 'p-inoue', rel: '共に 下野した 上司', cat: 'gold' },
    { pid: 'p-okubo', rel: '予算で 対立した 人', cat: 'gold' },
    { pid: 'p-yataro', rel: 'もう一つの 正解', cat: 'midori' },
  ],
};
