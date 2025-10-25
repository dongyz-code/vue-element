type ConditionalKeys<T, _K> = keyof T;
type ItemA = number | string;
type ItemB = {
  [key: string]: any;
};

/**
 * 数组对象化
 *
 * 1. 如果传入的数组每一项都是 number | string => Record<string, true>
 * 2. 如果传入的数组每一项都是 Record<T, unknown>
 *    2.1 第二个参数可以是 T | T[], 最后生成的对象的 key => T[].join()
 *    2.2 没有第三个参数的话，此时最后生成的对象的 value 是 unknown
 *    2.3 第三个参数为 boolean 的话，此时最后生成的对象的 value 是 boolean
 *    2.4 第三个参数为 T 的话，此时最后生成的对象的 value 是 Record<T, unknown>[T]
 *
 */
export function arrObject<T extends ItemA>(arr: T[]): Record<string, true>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>>(arr: T[], key: K | K[]): Record<string, T>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>, U extends boolean>(arr: T[], key: K | K[], bool: U): Record<string, U>;
export function arrObject<T extends ItemB, K extends ConditionalKeys<T, ItemA>, U extends keyof T>(arr: T[], key: K | K[], bool: U): Record<string, T[U]>;
export function arrObject(arr: any[], key?: any, value?: any): Record<string, any> {
  const map = {} as Record<string, any>;

  if (!arr?.length) {
    return map;
  }

  for (const item of arr) {
    if (typeof item === 'string' || typeof item === 'number') {
      map[item] = true;
    }
    else if (!key) {
      console.warn('key is required');
    }
    else if (value === true) {
      map[item[key]] = true;
    }
    else if (typeof value === 'string') {
      map[item[key]] = item[value];
    }
    else {
      map[item[key]] = item;
    }
  }
  return map;
}

export function getKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
