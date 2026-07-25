// ★1 "Your Leonardo" meters. Choices aren't right/wrong; they nudge the "color" of the portrait.
// Where the earlier works grew 力・領国 (power), davinci grows PERCEPTION — 観る目・つなぐ頭・ためす手
// (design §2: 育てるもの＝「気づき」, 中心の動詞＝観る・つなぐ). The three axes are chosen so the
// portrait can NOT settle into a flat "万能の天才" label: 観る目 alone would rebuild the genius myth
// the research warns against (§0, §3-1), so it runs beside つなぐ頭 (why one head linked bird to
// machine) and ためす手 (why the same man kept leaving things unfinished — the experimental technique
// that fought finishing, §3-8). The balanced landing says the word 「天才」 does not cover him.
// ⚠️ Local save only.
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの レオナルド',
  defs: [
    {
      key: 'miru',
      icon: '👁',
      label: '観る 目',
      summary: 'とりわけ 何でも じっと 観察し、だれも 気づかない ことに 気づく 目を もつ 人に 育った',
      progress: 'だんだん 見る 目が するどく なってきた',
    },
    {
      key: 'tsunagu',
      icon: '✦',
      label: 'つなぐ 頭',
      summary: 'とりわけ 別々の ものを むすびつけ、水と 髪、鳥と 機械を つなげて 考える 人に 育った',
      progress: 'だんだん ばらばらの ものが つながって きた',
    },
    {
      key: 'tamesu',
      icon: '🖌',
      label: 'ためす 手',
      summary: 'とりわけ 本で 習うより 自分で ためし、新しい やり方に 挑んでは 未完に する 人に 育った',
      progress: 'だんだん 自分で ためさずに いられなく なってきた',
    },
  ],
  balanced:
    '観る 目・つなぐ 頭・ためす 手 を どれも あわせ持ち、一つ ところに とどまれない、「天才」の ひと言では 片づかない 人に 育った',
  progressBalanced: '観る 目・つなぐ 頭・ためす 手 を バランスよく のばして きた',
};
