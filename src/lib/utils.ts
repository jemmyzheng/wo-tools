import assert from 'assert';

export const lengthOf = (target: number | string): number => {
  if (!target) return 0;
  if (typeof target === 'number') {
    return String(target).length;
  }
  return target.length;
}

/**
 * 找出数组中最大长度(位数)的字符串(数字)
 * 找出数组中某个属性值长度最大的项
 * @param array
 * @param propName
 */
export function longest<T>(array:T[], propName?:string):T {
  return array.sort((a:T, b:T) => {
    let an:number,bn:number;
    if (propName !== undefined && propName !== null && propName !== '') {
      an = lengthOf((a as any)[propName]);
      bn = lengthOf((b as any)[propName]);
    } else {
      an = lengthOf(a as unknown as string | number);
      bn = lengthOf(b as unknown as string | number);
    }
    return  bn - an;
  })[0];
}

