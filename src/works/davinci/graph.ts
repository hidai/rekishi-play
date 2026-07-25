// ★R Connection graph (つながり図鑑) data — authored WITH the ch6 pilot (design §5/§9). The engine
// (engine先行②, commit b60d217) has been built and idle until a chapter seeds it. This is the first.
//
// HOW IT PLAYS: the ch6 observe view (story 6-b) lets the reader find details on リザ's portrait; each
// found hotspot puts its `nodeId` star on the 図鑑 board. Dragging two stars together lights an
// authored link (§5-2); the sfumato link BIRTHS an invention star that grants a card (§5-4). Nothing
// unwritten lights — a wrong pair is a gentle「まだ、つながらない…かも？」, not a penalty (§5-5).
//
// PILOT SCOPE: one within-portrait connection (ほほえみ×まなざし→スフマート), documented and self-
// contained (research §3-4 の sfumato). かみの うず is a lone star that HINTS the cross-domain water
// link (§6 髪のカール×水の渦) which lands when the water/anatomy chapters are written — modelling
// 「まだ つながっていない星」(§5-3 終章サンドボックス) already in the pilot.
//
// Structural integrity (star id/field/card resolution, no overlap/overflow, hotspot↔node crossing) is
// asserted by graphErrors() over ALL_WORKS via registerWorkStructure (tests/helpers/work-structure.ts).
// Hand-managed (davinci has no legacy extract source).
import type { WorkGraph } from '../../engine/types';

export const GRAPH: WorkGraph = {
  // ch1 now introduces the observe device + seeds the board, so coaching drops to 序盤だけ (design
  // §5-3): coach the drag through ch2, then trust the reader. (Was 6 while ch6 was the only chapter.)
  coachUntilChapter: 2,

  // Fields = colour + legend only (layoutStars ignores them; position comes from each node's x/y). Two
  // fields so the board reads as "kinds of thing": drawing, and flow/spiral — かみの うず is filed under
  // flow, not the face, because it spirals like water (that IS the cross-domain claim the graph teaches).
  fields: [
    { key: 'kaku', label: '<ruby>絵<rt>え</rt></ruby>に する こと', color: '#9a6a3a' },
    { key: 'nagare', label: 'ながれ・うず', color: '#2f5a7a' },
  ],

  nodes: [
    // ── ch1 自然観察の星（story 1-b の observe で見つける）──
    { id: 'n-water', star: '水の うず', field: 'nagare', x: 0.22, y: 0.5,
      caption: '川の 水は、まっすぐ 流れず、くるりと 渦を まく。レオナルドは この 渦を、一生 見つめ 続けた。' },
    { id: 'n-flight', star: '鳥の はばたき', field: 'nagare', x: 0.5, y: 0.52,
      caption: '鳥は つばさで 空気を おして 進む。空気も、水の ように ながれる——のちの「飛ぶ 機械」の たねに なった。' },
    { id: 'n-light', star: '光と かげ', field: 'kaku', x: 0.8, y: 0.5,
      caption: '丸い ものは、光の 側が 明るく、反対側は 暗い。かげを ていねいに 描くと、絵が まるく ふくらむ。' },

    // ── ch4 構図の星（story 4-c の observe で見つける）──
    { id: 'n-okuyuki', star: 'おくゆき', field: 'kaku', x: 0.82, y: 0.76,
      caption: '天井も かべも まどの ふちも、線を たどると たった 一点に 集まる。その 一点が 決まると、平らな 壁の 中に 部屋の 奥ゆきが 生まれる。' },

    // Observation stars (found via ch6 observe hotspots). star = SVG <text>, so NO <ruby> (graphErrors).
    { id: 'n-smile', star: 'ほほえみ', field: 'kaku', x: 0.28, y: 0.30,
      caption: '口の はし。笑って いるのか いないのか、見る たびに 変わって、つかまえられない。' },
    { id: 'n-eyes', star: 'まなざし', field: 'kaku', x: 0.72, y: 0.30,
      caption: '目。まるで 生きた 人のように、しっとりと うるんで 見える。いまにも まばたきしそうだ。' },
    { id: 'n-curl', star: 'かみの うず', field: 'nagare', x: 0.5, y: 0.78,
      caption: 'かみの ながれは、川の 水に よく にて いる。レオナルドは、かみも 水も、同じ「うず」として 見て いた。' },
    // Invention star: born at the midpoint of the link below (no x/y). Grants a card when it blooms.
    { id: 'n-sfumato', star: 'スフマート', field: 'kaku', bornOf: ['l-smile-eyes'], card: 'w-sfumato',
      caption: '線を 引かず、かげを けむりの ように とかす 技。この ぼかしが、あの とらえどころの ない ほほえみを 生んだ。' },
  ],

  links: [
    // ch1 内で光る「章内リンク」＝装置の最初の手ごたえ（ch6 の smile×eyes と同じ役）。
    { id: 'l-water-flight', a: 'n-water', b: 'n-flight',
      caption: '水の 渦と、鳥の はばたき——どちらも「ながれ」を おして いる。空気は、水と 同じ ように ふるまうのだ。だから きみは、鳥の つばさから「飛ぶ 機械」を 考えた。' },
    // 分野をまたぐ待機リンク（設計§6 髪のカール×水の渦）＝ch1 で置いた星が ch6 で つながる。
    { id: 'l-water-curl', a: 'n-water', b: 'n-curl',
      caption: '川の 水の 渦と、モナ・リザの かみの 渦——ならべて みると、そっくり 同じ 形。レオナルドは、水も 髪も「同じ ながれ」として 見て いた。' },
    // ch1 の星 × ch4 の星＝章をまたぐ待機リンクの2本目（§6「目が育つ」）。どちらも
    // 「平らな 面に 奥ゆきを つくる」わざ＝分野をまたぐのでなく、同じ わざの 二つの 顔。
    { id: 'l-light-okuyuki', a: 'n-light', b: 'n-okuyuki',
      caption: '丸い ものは、光と かげを 置くと ふくらんで 見えた。平らな 壁は、線を 一点に 集めると 奥へ 部屋が のびる。——どちらも、平らな 面に「おくゆき」を つくる わざ。' },
    { id: 'l-smile-eyes', a: 'n-smile', b: 'n-eyes',
      caption: '口の 笑いも、目の うるみも——よく 見ると、どこにも はっきりした 線が 引かれて いない。かげを けむりの ように とかして、さかいめを 消して あるのだ。この 描き方に、名前が ある。' },
  ],
};
