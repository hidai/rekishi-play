// 地図データ: TERRITORY / HIDENAGA_DOMAIN / ROUTES / MAPLABELS / MAPPOINTS / GAZ / SCENE_MAPS
// もとは legacy/index.html からの逐語抽出だったが、新シーン（7-a2 兄の見舞い 等）の地図定義を
// 手編集で加えており、抽出パイプラインを廃して手書き管理へ移行した（story/faces と同じ扱い）。
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
} from '../../engine/types';

export const TERRITORY: Record<string, number>={owari:1,21:2,25:2,28:3,26:3,27:4,29:4,30:4,24:4,36:5,37:5,38:5,39:5,33:5,34:5,35:5,31:5,32:5,40:5,41:5,42:5,43:5,44:5,45:5,46:5};

export const HIDENAGA_DOMAIN: Record<string, number[]>={3:[28],6:[29,30]};

export const ROUTES: Record<string, RouteDef>={ogaeshi:{d:"M495 267L578 252L607 272L624 268L647 265L672 243"},mino:{d:"M760 191L744 182L724 174"}};

// Campaign-map route overlays (ordered; ogaeshi drawn last = on top). Both reveal at ch4
// (本能寺の変). ogaeshi=中国大返し carries the animated runner + legend line; mino=美濃大返し
// draws without a legend entry.
export const CAMPAIGN_ROUTES: CampaignRoute[]=[
  {key:"mino",color:"var(--seal)",revealCh:4},
  {key:"ogaeshi",color:"var(--gold)",revealCh:4,legend:"<b>中国大返し</b> 備中高松→山崎（約230km）",runnerLabel:"中国大返し"},
];

// Territory-coloring phases: Oda gold until ch4, then Toyotomi (羽柴) indigo from ch4 (本能寺の変).
export const FACTION_PHASES: FactionPhase[]=[
  {fromCh:1,color:"var(--map-faction-a)",legend:"織田方の 領地（本能寺の 前）"},
  {fromCh:4,color:"var(--map-faction-b)",legend:"豊臣（羽柴）方の 領地"},
];

export const MAPLABELS: Record<string, string>={owari:"尾張",21:"美濃",25:"近江",26:"山城",28:"播磨",33:"備前",34:"安芸",35:"周防",36:"阿波",39:"土佐",40:"筑前",43:"肥後",45:"日向",46:"薩摩",29:"大和",30:"紀伊"};

export const MAPPOINTS: MapPoint[]=[
  {n:1,ch:1,id:"nakamura",lon:136.874,lat:35.174,label:"中村",sub:"誕生の地",lpos:"right"},
  {n:2,ch:2,id:"sunomata",lon:136.669,lat:35.365,label:"墨俣",sub:"一夜城"},
  {n:3,ch:3,id:"takeda",lon:134.829,lat:35.301,label:"竹田・出石",sub:"初の領国"},
  {n:4,ch:4,id:"takamatsu",lon:133.822,lat:34.693,label:"備中高松",sub:"大返し 起点",lpos:"below"},
  {n:5,ch:4,id:"yamazaki",lon:135.685,lat:34.901,label:"山崎",sub:"大返し 終点"},
  {n:6,ch:4,id:"shizugatake",lon:136.193,lat:35.506,label:"賤ヶ岳",sub:"対 柴田勝家"},
  {n:7,ch:5,id:"awa",lon:134.500,lat:34.100,label:"四国(阿波)",sub:"総大将"},
  {n:8,ch:5,id:"nejiro",lon:131.459,lat:32.150,label:"根白坂",sub:"九州平定"},
  {n:9,ch:6,id:"koriyama",lon:135.783,lat:34.653,label:"大和郡山",sub:"100万石の城",lpos:"right"}
];

// Places in REAL [lon,lat] (projected at render via GEO.proj). The legacy px this file was born
// with were themselves projected from a gazetteer for most places, so the migration is pixel-quiet
// — the exceptions are the four places the legacy author had DISPLACED on purpose (see below) and
// 大垣・阿波・根白坂, which were merely 7-21px off and are now where they are.
export const GAZ: Record<string, GazPoint>={
  nakamura:{lon:136.874,lat:35.174}, sunomata:{lon:136.669,lat:35.365}, takeda:{lon:134.829,lat:35.301}, takamatsu:{lon:133.822,lat:34.693},
  yamazaki:{lon:135.685,lat:34.901}, shizugatake:{lon:136.193,lat:35.506}, awa:{lon:134.500,lat:34.100}, nejiro:{lon:131.459,lat:32.150}, koriyama:{lon:135.783,lat:34.653},
  // ★この4点だけ px のまま＝隣の点と数kmしか離れておらず、実座標では二つの絵にならない「ずらし」。
  // 日本が日本に見える倍率（Geo.minFrameW）では、8kmは4px＝同じ丸になる。地図学でいう symbol
  // displacement で、legacy の px は向きを保ったまま距離だけ伸ばしてあった（岐阜＝墨俣の東北東を
  // 約3.4倍、生野＝竹田の南南西を約2.4倍、出石＝竹田の北北東を約1.7倍）ので、そのまま使う。
  // 清洲だけは向きも違う（実際は中村の約8km 北西、legacy は東南東 25px）。それでも動かさない——
  // 尾張は狭く、北西へ 20px ずらすと城が国の外へ出て、織田の金色の中に無い織田の城になる。
  // ずらしの制約は「面の中に留まる」が「方角」より強い（WRITING 地図書法2＝面が先に嘘をつく）。
  kiyosu:{x:808,y:226}, gifu:{x:802,y:164}, ikuno:{x:564,y:234}, izushi:{x:628,y:160}, himeji:{lon:134.694,lat:34.839},
  kyoto:{lon:135.768,lat:35.012}, honnoji:{lon:135.752,lat:35.008}, osaka:{lon:135.526,lat:34.687}, kii:{lon:135.171,lat:34.228}, izumi:{lon:135.420,lat:34.450},
  tosa:{lon:133.531,lat:33.561}, kagoshima:{lon:130.556,lat:31.598}, bungo:{lon:131.612,lat:33.238}, ogaki:{lon:136.615,lat:35.362}, kitanosho:{lon:136.219,lat:36.064},
  odawara:{lon:139.153,lat:35.251}
};

export const SCENE_MAPS: Record<string, SceneMapDef>={
  '1-a':{markers:[{at:'nakamura',cur:1,kind:'village',label:'尾張 中村',note:'きみが 生まれた 村',people:['p-naka']}]},
  '1-b':{markers:[
    {at:'nakamura',cur:1,kind:'village',lpos:'left',label:'中村',note:'兄が 帰って きた',people:['p-hideyoshi']},
    {at:'kiyosu',kind:'castle',lpos:'right',label:'清洲城',note:'兄が 仕える 織田家'}]},
  '1-c':{markers:[
    {at:'nakamura',cur:1,kind:'village',label:'中村'},
    {at:'kiyosu',kind:'castle',lpos:'right',label:'清洲城',note:'侍への 道'}]},
  '1-d':{markers:[{at:'nakamura',cur:1,kind:'village',label:'尾張 中村',note:'侍・木下小一郎に',people:['p-hideyoshi','p-naka']}]},

  '2-a':{markers:[
    {at:'sunomata',cur:1,kind:'castle',label:'墨俣',note:'一夜城 伝説の 地'},
    {at:'gifu',kind:'castle',enemy:1,label:'稲葉山城',note:'斎藤氏（攻めの 的）'}]},
  '2-b':{markers:[
    {at:'sunomata',cur:1,kind:'siege',label:'墨俣',note:'城づくりの 段取り'},
    {at:'gifu',kind:'castle',enemy:1,label:'稲葉山城'}]},
  '2-c':{markers:[
    {at:'sunomata',cur:1,kind:'castle',label:'墨俣'},
    {at:'gifu',kind:'castle',label:'岐阜城',note:'信長の 居城',people:['p-nobunaga']}]},
  '2-d':{markers:[
    {at:'sunomata',cur:1,kind:'castle',label:'墨俣'},
    {at:'gifu',kind:'castle',label:'岐阜',people:['p-nobunaga']}]},

  '3-a':{markers:[
    {at:'takeda',cur:1,kind:'castle',label:'竹田城',note:'天空の城・城代に'},
    {at:'ikuno',kind:'mine',label:'生野銀山',note:'銀＝力の もと'}]},
  '3-b':{markers:[
    {at:'takeda',cur:1,kind:'castle',label:'竹田城'},
    {at:'himeji',kind:'village',label:'播磨',note:'民・商人を 治める'}]},
  '3-c':{markers:[
    {at:'takeda',cur:1,kind:'castle',label:'竹田城',note:'家臣に 高虎',people:['p-takatora']},
    {at:'izushi',kind:'battle',enemy:1,label:'出石（有子山城）',note:'山名氏 開城'}]},
  '3-d':{markers:[
    {at:'takeda',cur:1,kind:'castle',label:'但馬',note:'はじめての 領国',people:['p-takatora']},
    {at:'ikuno',kind:'mine',label:'生野銀山'},
    {at:'izushi',kind:'castle',label:'出石'}]},

  '4-a':{markers:[
    {at:'takamatsu',cur:1,kind:'siege',label:'備中高松城',note:'水攻めの 最中',people:['p-hideyoshi']},
    {at:'honnoji',kind:'crisis',label:'本能寺',note:'信長 討たれる！',people:['p-nobunaga','p-mitsuhide']}]},
  '4-b':{route:'ogaeshi',markers:[
    {at:'takamatsu',cur:1,kind:'siege',label:'備中高松',note:'大返し 起点'},
    {at:'yamazaki',kind:'battle',label:'山崎',note:'めざす 先（約230km）'}]},
  '4-c':{markers:[
    {at:'yamazaki',cur:1,kind:'battle',label:'山崎の 戦い',note:'天王山の ふもと',people:['p-mitsuhide']}]},
  // 勝家の本陣（玄蕃尾城）は賤ヶ岳の約10km北＝実座標では同じ点に見え、顔を二つ置けない。
  // 代わりに彼の居城・北ノ庄を出すと、越前から南下する敵と大垣から駆け戻る兄が、
  // 本陣を守るきみに向かって北と東から寄ってくる形が一枚で読める。
  '4-d':{route:'mino',markers:[
    {at:'shizugatake',cur:1,kind:'battle',label:'賤ヶ岳',note:'田上山に 本陣を 守る'},
    {at:'kitanosho',kind:'castle',enemy:1,lpos:'above',label:'柴田勝家',note:'越前から 攻め 下る',people:['p-katsuie']},
    {at:'ogaki',kind:'person',lpos:'right',label:'大垣',note:'兄、ここから 駆け戻る',people:['p-hideyoshi']}]},
  '4-e':{markers:[
    {at:'shizugatake',cur:1,kind:'battle',label:'賤ヶ岳',note:'勝利。「秀長」と 名のる'}]},

  // contested: TERRITORY flips 四国/九州 to Toyotomi at era 5, but mid-invasion the land is
  // still the enemy's (観察メモ「攻めているときは領土ではない」). 四国 36-39 stays contested
  // until 元親 surrenders in 5-b; 九州 40-46 until 島津 surrenders in 5-d.
  '5-a':{contested:[36,37,38,39,40,41,42,43,44,45,46],markers:[
    {at:'awa',cur:1,kind:'battle',label:'四国上陸（阿波）',note:'はじめての 総大将'},
    {at:'tosa',kind:'person',label:'長宗我部元親',note:'四国を ほぼ 統一',people:['p-motochika']},
    {at:'osaka',kind:'castle',label:'大坂',note:'兄は 病（出陣とりやめ）',people:['p-hideyoshi']}]},
  '5-b':{contested:[40,41,42,43,44,45,46],markers:[
    {at:'awa',cur:1,kind:'battle',label:'阿波'},
    {at:'tosa',kind:'person',label:'土佐',note:'元親に 安堵',people:['p-motochika']}]},
  '5-c':{contested:[40,41,42,43,44,45,46],markers:[
    {at:'nejiro',cur:1,kind:'battle',label:'根白坂（日向）',note:'堅い とりでで 迎え撃つ'},
    {at:'kagoshima',kind:'flag',enemy:1,label:'島津',note:'九州の 大半を 支配',people:['p-yoshihisa']}]},
  '5-d':{markers:[
    {at:'nejiro',cur:1,kind:'battle',label:'根白坂'},
    {at:'kagoshima',kind:'flag',label:'島津義久',note:'剃髪して 降伏',people:['p-yoshihisa']}]},
  '5-e':{markers:[
    {at:'nejiro',cur:1,kind:'battle',label:'九州 平定'},
    {at:'awa',kind:'battle',label:'四国',note:'ふたつの 平定を 導く'}]},

  '6-a':{markers:[
    {at:'koriyama',cur:1,kind:'town',label:'大和 郡山城',note:'100万石・城下町を つくる'},
    {at:'kii',kind:'flag',label:'紀伊'},
    {at:'izumi',kind:'flag',label:'和泉'}]},
  // 6-b recounts 1586 (before the ch5 九州平定 in play order flipped the fill): 島津 on the
  // offensive, 豊後 under attack — 九州 must read as contested, not Toyotomi. The fill alone
  // read as "内乱？" to a player fresh from ch5 (observation memo 2026-07-16), so the 島津
  // note and the scene text both carry the "year before the conquest" time anchor.
  '6-b':{contested:[40,41,42,43,44,45,46],markers:[
    {at:'osaka',cur:1,kind:'castle',label:'大坂城',note:'宗麟の 訪問に 応対',people:['p-hideyoshi','p-sorin']},
    {at:'bungo',kind:'flag',label:'豊後',note:'宗麟の 国（島津に 押される）'},
    {at:'kagoshima',kind:'flag',enemy:1,label:'島津',note:'平定の 前の 年・九州で 攻勢'}]},
  '6-c':{markers:[
    {at:'osaka',cur:1,kind:'castle',lpos:'above',label:'大坂・政務',note:'「公儀の事は 宰相（秀長）に」',people:['p-rikyu']},
    {at:'koriyama',kind:'town',label:'郡山（居城）'}]},
  '6-d':{markers:[
    {at:'koriyama',cur:1,kind:'town',label:'大和大納言',note:'政権の いちばん 太い 柱',people:['p-rikyu']}]},

  '7-a':{markers:[
    {at:'koriyama',cur:1,kind:'castle',label:'大和 郡山城',note:'病の 床に つく'},
    {at:'odawara',off:1,kind:'battle',label:'小田原',note:'病で 参陣できず'}]},
  '7-a2':{markers:[
    {at:'koriyama',cur:1,kind:'castle',label:'郡山城',note:'兄が 見舞いに 来た',people:['p-hideyoshi']},
    {at:'osaka',kind:'castle',lpos:'left',label:'大坂城',note:'天下人の 居城から'}]},
  '7-b':{markers:[
    {at:'koriyama',cur:1,kind:'death',label:'郡山'},
    {at:'kyoto',kind:'crisis',lpos:'above',label:'京都',note:'利休 切腹・秀次 切腹',people:['p-hidetsugu']}]},
  '7-c':{allDots:1,markers:[{at:'koriyama',cur:1,kind:'death',label:'旅の 終わり',note:'集めた 手がかりを 思いだそう'}]},
  '7-d':{allDots:1,markers:[{at:'koriyama',cur:1,kind:'death',label:'日本一の 補佐役',note:'記録に 残らぬ 仕事こそ'}]}
};
