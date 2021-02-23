import { longest } from '../src/lib/utils';


describe('Utils test', () => {
  test('longest', () => {
    const strArray:string[] = ['gggg', 'a', 'hello', '123456', 'dd', '12345678'];
    expect(longest(strArray)).toBe('12345678');
    const numArray:number[] = [1,23,200,16,2,50];
    expect(longest(numArray)).toBe(200);
    const objArray:any[] = [
      {
        prop1: 'asdasd',
      },
      {
        prop2: 'a',
      },
      {
        prop1: '12345678',
      },
      {
        prop1: 123,
        prop2: 3,
      }
    ]
    expect(longest(objArray, 'prop1')).toStrictEqual({prop1: '12345678'})
  });
})
