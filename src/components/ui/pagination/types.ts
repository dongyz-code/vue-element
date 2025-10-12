export type PageData = {
  total: number;
  current: number;
  size: number;
  pageSizes: number[];
  layout?: (
    | 'total'
    | 'sizes'
    | 'prev'
    | 'pager'
    | 'next'
    | 'jumper'
    | 'slot'
  )[];
};

export type PageEmits = {
  'update': [current: number, size: number];
  'update:current': [current: number];
  'update:size': [size: number];
};

export const defaultPageData: PageData = {
  total: 0,
  current: 1,
  size: 20,
  pageSizes: [10, 20, 50, 100],
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper', 'slot'],
};
