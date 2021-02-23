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
export const longest = (array:string[]|number[]|object[], propName?:string):string|number|object => {
  return array.sort((a:string|number|object, b:string|number|object) => {
    let an:number,bn:number;
    if (typeof a === 'object' || typeof b === 'object') {
      assert(propName !== undefined && propName !== null && propName !== '');
      an = lengthOf((a as any)[propName]);
      bn = lengthOf((b as any)[propName]);
    } else {
      an = lengthOf(a);
      bn = lengthOf(b);
    }
    return  bn - an;
  })[0];
}
