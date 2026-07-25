import type { HistSource } from './types';

/** Display mark + reader-facing label for each source grade (ruby HTML). */
export const SOURCE_GRADES: Record<HistSource['grade'], { mark: string; label: string }> = {
  contemporary: { mark: '◎', label: 'その<ruby>時代<rt>じだい</rt></ruby>の <ruby>記録<rt>きろく</rt></ruby>' },
  later: { mark: '○', label: '<ruby>少<rt>すこ</rt></ruby>し あとの <ruby>記録<rt>きろく</rt></ruby>' },
  tale: { mark: '△', label: '<ruby>後<rt>のち</rt></ruby>の<ruby>世<rt>よ</rt></ruby>の <ruby>物語<rt>ものがたり</rt></ruby>' },
};
