import { parseJson } from './generic.utils';

describe('Generic utility functions', () => {
  it('should parses json string to js object', () => {
    expect(parseJson<number[]>('[1,2,3]')).toEqual([1, 2, 3]);
    expect(parseJson<undefined>('hello')).toEqual(undefined);
    expect(
      parseJson<{ name: string; age: number }>('{"name":"john","age":27}'),
    ).toEqual({ name: 'john', age: 27 });
    expect(parseJson<number[]>('undefined')).toEqual(undefined);
    expect(parseJson<null>(null)).toBe(undefined);
  });
});
