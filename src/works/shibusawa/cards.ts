// Cards (CARDS). 11 people (design §5 gives room to spare under the WRITING「人は絞る」16-cap —
// the private-life women / many illegitimate children are role-words or non-appearing, §0-3温度).
// Word cards are authored WITH their chapters — a word card only earns its place once a scene
// needs it. Every fact traces to docs/research/shibusawa.md by §; △/☆ items avoid assertion with
// 「〜とされる／と 伝えられる／諸説」(G5/G6), and 史料-critical items (§3) name WHO said it and WHEN —
// this work's whole point (research §0＝本人が語りすぎた). Hand-managed. name/read stay ruby-free
// plain text (the card UI renders them as text; ruby lives in `text`).
// tone = camp color for THIS work: ai=血洗島・渋沢の家 / seal=徳川・旧主 / gold=明治政府 / midori=実業.
import type { Card } from '../../engine/types';

export const CARDS: Record<string, Card> = {
  // ---- People ----
  'p-eiichi': { type: 'person', ch: 1, tone: 'ai', name: '渋沢栄一', read: 'しぶさわ えいいち',
    text: 'きみ 自身。<ruby>武蔵<rt>むさし</rt></ruby>の <ruby>血洗島<rt>ちあらいじま</rt></ruby>（今の <ruby>埼玉<rt>さいたま</rt></ruby>・<ruby>深谷<rt>ふかや</rt></ruby>）の <ruby>藍<rt>あい</rt></ruby>の 家に 生まれた。外国人を 焼こうと した 志士から、将軍の 家来、明治の <ruby>役人<rt>やくにん</rt></ruby>、そして 日本で 最初の <ruby>銀行<rt>ぎんこう</rt></ruby>を つくる <ruby>実業家<rt>じつぎょうか</rt></ruby>へと、なんども 立場を 変えた。——<ruby>約<rt>やく</rt></ruby>500の 会社に 関わりながら、自分の <ruby>財閥<rt>ざいばつ</rt></ruby>は つくらなかった。2024年、一万円札の 顔に なった 人。' },
  'p-junchu': { type: 'person', ch: 1, tone: 'ai', name: '尾高惇忠', read: 'おだか じゅんちゅう',
    text: 'きみの <ruby>従兄<rt>いとこ</rt></ruby>で、いちばん はじめの 先生。朝ごとに 『<ruby>論語<rt>ろんご</rt></ruby>』を 教えた 人であり、<ruby>横浜<rt>よこはま</rt></ruby>の <ruby>焼<rt>や</rt></ruby>き討ちを 言い出した 人でも ある。後に 明治政府の <ruby>富岡製糸場<rt>とみおかせいしじょう</rt></ruby>の <ruby>初代場長<rt>しょだいじょうちょう</rt></ruby>に なった。' },
  'p-choshichiro': { type: 'person', ch: 1, tone: 'ai', name: '尾高長七郎', read: 'おだか ちょうしちろう',
    text: 'きみの <ruby>従兄<rt>いとこ</rt></ruby>で、<ruby>剣<rt>けん</rt></ruby>の 使い手。<ruby>京<rt>きょう</rt></ruby>で 同じ こころざしの 若者たちが <ruby>斬<rt>き</rt></ruby>られて いくのを 見て きた 人。1863年、横浜の 焼き討ちを 命がけで <ruby>止<rt>と</rt></ruby>めた。——その 次の 年、長七郎は 人を あやめて とらえられ、何年も <ruby>牢<rt>ろう</rt></ruby>で すごす ことに なる。止めた 側の 一生も、まっすぐでは なかった。' },
  'p-ichiroemon': { type: 'person', ch: 1, tone: 'ai', name: '渋沢市郎右衛門', read: 'しぶさわ いちろうえもん',
    text: 'きみの 父。<ruby>藍玉<rt>あいだま</rt></ruby>（<ruby>藍染<rt>あいぞ</rt></ruby>めの もと）を つくって 売る <ruby>豪農<rt>ごうのう</rt></ruby>。<ruby>代官所<rt>だいかんしょ</rt></ruby>の 理不尽を のみこんで 家を 守りつづけた 側の 人でも ある。——きみが <ruby>数<rt>かず</rt></ruby>を 読む 目は、この 父の 横で ついた。' },
  'p-yoshinobu': { type: 'person', ch: 2, tone: 'seal', name: '徳川慶喜', read: 'とくがわ よしのぶ',
    text: 'きみの あるじ。<ruby>一橋家<rt>ひとつばしけ</rt></ruby>の 当主で、きみを <ruby>攘夷<rt>じょうい</rt></ruby>の 志士から <ruby>家来<rt>けらい</rt></ruby>に した 人。1866年に 15代 将軍に なり、きみは <ruby>図<rt>はか</rt></ruby>らずも <ruby>幕臣<rt>ばくしん</rt></ruby>に なった。やがて 幕府は 倒れる。明治の 世で「<ruby>臆病者<rt>おくびょうもの</rt></ruby>」と <ruby>評<rt>ひょう</rt></ruby>された この 旧主の <ruby>名誉<rt>めいよ</rt></ruby>を、きみは 長い 年月を かけて 回復しようと する。' },
  'p-akitake': { type: 'person', ch: 3, tone: 'seal', name: '徳川昭武', read: 'とくがわ あきたけ',
    text: '慶喜の 弟。1867年、将軍の <ruby>名代<rt>みょうだい</rt></ruby>として パリ万国博覧会へ 送られた。きみは その お供として 海を わたり、フランスを <ruby>拠点<rt>きょてん</rt></ruby>に 欧州の 銀行・会社・鉄道を 見た。まだ 10代の 若い <ruby>殿<rt>との</rt></ruby>だった。' },
  'p-hiraoka': { type: 'person', ch: 2, tone: 'seal', name: '平岡円四郎', read: 'ひらおか えんしろう',
    text: '一橋家の <ruby>用人<rt>ようにん</rt></ruby>（家の 仕事を まとめる 役）。名も ない 攘夷の 志士だった きみの <ruby>見<rt>み</rt></ruby>どころを 見ぬき、慶喜への <ruby>仕官<rt>しかん</rt></ruby>を <ruby>推<rt>お</rt></ruby>してくれた 人。——この 出会いが なければ、きみが 将軍の 家来に なる ことも なかった。' },
  'p-okuma': { type: 'person', ch: 4, tone: 'gold', name: '大隈重信', read: 'おおくま しげのぶ',
    text: '明治政府の 大物。1869年、民に 下ろうと した きみを <ruby>説<rt>と</rt></ruby>き<ruby>伏<rt>ふ</rt></ruby>せて、<ruby>大蔵省<rt>おおくらしょう</rt></ruby>に 引き入れた 人。近代の お金の しくみ（<ruby>度量衡<rt>どりょうこう</rt></ruby>・<ruby>税<rt>ぜい</rt></ruby>・国立銀行）を、きみは この人らの もとで 組み立てた。のちに <ruby>早稲田大学<rt>わせだだいがく</rt></ruby>を つくる 人でも ある。' },
  'p-inoue': { type: 'person', ch: 4, tone: 'gold', name: '井上馨', read: 'いのうえ かおる',
    text: '大蔵省での きみの 上司。<ruby>長州<rt>ちょうしゅう</rt></ruby>の 出。1873年、<ruby>予算<rt>よさん</rt></ruby>の 方針を めぐって 政府と 対立し、きみと <ruby>共<rt>とも</rt></ruby>に 役所を 去った。この <ruby>下野<rt>げや</rt></ruby>が、きみが <ruby>民間<rt>みんかん</rt></ruby>の 実業家に なる きっかけに なる。' },
  'p-okubo': { type: 'person', ch: 4, tone: 'gold', name: '大久保利通', read: 'おおくぼ としみち',
    text: '明治政府の <ruby>中心<rt>ちゅうしん</rt></ruby>に いた 人。<ruby>薩摩<rt>さつま</rt></ruby>の 出で、冷たく 見えるほど 強い <ruby>意志<rt>いし</rt></ruby>の 政治家。大蔵省で きみと <ruby>予算<rt>よさん</rt></ruby>の 方針が 合わず、対立した。だれが 正しかったかは、かんたんには 言えない。' },
  'p-yataro': { type: 'person', ch: 5, tone: 'midori', name: '岩崎弥太郎', read: 'いわさき やたろう',
    text: '<ruby>三菱<rt>みつびし</rt></ruby>を 一代で <ruby>築<rt>きず</rt></ruby>いた 男。<ruby>土佐<rt>とさ</rt></ruby>の <ruby>武士<rt>ぶし</rt></ruby>の 中で いちばん 下に 近い 家に 生まれ、先ぞが 手ばなした 武士の <ruby>身分<rt>みぶん</rt></ruby>を、お金を つくって 買いもどした。きみが「みんなで <ruby>株<rt>かぶ</rt></ruby>を 出し合う（<ruby>合本<rt>がっぽん</rt></ruby>）」を 説いたのに 対し、この人は「一つの 家が <ruby>独占<rt>どくせん</rt></ruby>して 強く なる」を 選んだ。——ただの 敵では ない。<b>その 独占が、<ruby>海運<rt>かいうん</rt></ruby>で 国の 力を 守った 面も ある</b>。もう 一つの 正解を 生きた 人。1885年、きみとの 争いの まん中で <ruby>病<rt>やまい</rt></ruby>に たおれ、50さいで 世を さった。' },

  // ---- Words ---- (a word card earns its place only when a scene needs it; ch5 = 合本 の岐路)
  'w-gappon': { type: 'word', ch: 5, tone: 'midori', name: '合本', read: 'がっぽん',
    text: 'きみの やり方。大きな ことを する とき、一つの 家の お金では なく、<b>おおぜいの 人から 少しずつ 出して もらう</b>（<ruby>株<rt>かぶ</rt></ruby>）。もうけも、出し合った みんなで 分ける。<ruby>三井<rt>みつい</rt></ruby>・三菱・<ruby>住友<rt>すみとも</rt></ruby>が 一つの 家に <ruby>富<rt>とみ</rt></ruby>を あつめた 時代に、きみは そう しなかった。——ただし「合本」という 言葉を きみが よく 使うのは、これより あとの ことだ。' },
};
