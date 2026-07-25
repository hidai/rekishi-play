// 全作品を同期的に束ねた一覧。開発ツール（scripts/lib/works.ts）とゲート（tests/）用で、
// アプリ実行時の入口は ./registry.ts。作品追加は両方に 1 件。
import type { Work } from '../engine/types';
import { hidenaga } from './hidenaga/index';
import { kiyomori } from './kiyomori/index';
import { katsu } from './katsu/index';
import { ieyasu } from './ieyasu/index';
import { davinci } from './davinci/index';
import { masako } from './masako/index';

export const WORKS: Work[] = [hidenaga, kiyomori, katsu, ieyasu, davinci, masako];
