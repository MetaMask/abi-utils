import { DynamicFunction } from '../types';
import { fromHex, toHex } from '../utils';
import { getTupleElements, tuple } from './tuple';

describe('getTupleElements', () => {
  it('returns the elements of a tuple', () => {
    expect(getTupleElements('(foo,bar)')).toStrictEqual(['foo', 'bar']);
    expect(getTupleElements('(foo,bar[])')).toStrictEqual(['foo', 'bar[]']);

    // TODO: Add support for nested tuples
    // expect(getTupleElements('(foo,(bar,baz))')).toStrictEqual(['foo', '(bar,baz))']);
  });
});

describe('tuple', () => {
  describe('isDynamic', () => {
    const isDynamic = tuple.isDynamic as DynamicFunction;

    it('checks if one or more elements of the tuple are dynamic', () => {
      expect(isDynamic('(uint256, bytes)')).toBe(true);

      expect(isDynamic('(uint256, uint256)')).toBe(false);
    });
  });

  describe('isType', () => {
    it('checks if a type is a tuple type', () => {
      expect(tuple.isType?.('(uint256)')).toBe(true);
      expect(tuple.isType?.('(uint256, uint256)')).toBe(true);

      expect(tuple.isType?.('uint256')).toBe(false);
      expect(tuple.isType?.('(uint256)[]')).toBe(false);
    });
  });

  describe('encode', () => {
    it('encodes a static tuple', () => {
      expect(toHex(tuple.encode({ type: '(uint256, uint256)', value: [12n, 34n], buffer: new Uint8Array() }))).toBe(
        '000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022'
      );
    });

    it('encodes a dynamic tuple', () => {
      expect(toHex(tuple.encode({ type: '(uint256, bytes)', value: [12n, 'ab'], buffer: new Uint8Array() }))).toBe(
        '000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000'
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded static tuple', () => {
      const value = fromHex(
        '000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022'
      );
      expect(tuple.decode({ type: '(uint256, uint256)', value, skip: jest.fn() })).toStrictEqual([12n, 34n]);
    });

    it('decodes an encoded dynamic tuple', () => {
      const value = fromHex(
        '000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000'
      );
      const result = tuple.decode({ type: '(uint256, bytes)', value, skip: jest.fn() });

      expect(result[0]).toBe(12n);
      expect(toHex(result[1] as Uint8Array)).toBe('ab');
    });

    it('calls skip with the tuple length', () => {
      const value = fromHex(
        '000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022'
      );
      const skip = jest.fn();

      tuple.decode({ type: '(uint256,uint256)', value, skip });
      expect(skip).toHaveBeenCalledWith(32);
    });
  });
});
