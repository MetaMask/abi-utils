import { bytesToHex, hexToBytes } from '@metamask/utils';
import { DynamicFunction } from './parser';
import { getTupleElements, tuple } from './tuple';

describe('getTupleElements', () => {
  it('returns the elements of a tuple', () => {
    expect(getTupleElements('(foo,bar)')).toStrictEqual(['foo', 'bar']);
    expect(getTupleElements('(foo,bar[])')).toStrictEqual(['foo', 'bar[]']);
    expect(getTupleElements('((foo,bar[]))')).toStrictEqual(['(foo,bar[])']);
    expect(getTupleElements('((foo,bar[]),baz,(qux))')).toStrictEqual([
      '(foo,bar[])',
      'baz',
      '(qux)',
    ]);
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
      expect(
        bytesToHex(
          tuple.encode({
            type: '(uint256, uint256)',
            value: [BigInt(12), BigInt(34)],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022',
      );
    });

    it('encodes a dynamic tuple', () => {
      expect(
        bytesToHex(
          tuple.encode({
            type: '(uint256, bytes)',
            value: [BigInt(12), '0xab'],
            buffer: new Uint8Array(),
          }),
        ),
      ).toBe(
        '0x000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('decode', () => {
    it('decodes an encoded static tuple', () => {
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022',
      );

      expect(
        tuple.decode({ type: '(uint256, uint256)', value, skip: jest.fn() }),
      ).toStrictEqual([BigInt(12), BigInt(34)]);
    });

    it('decodes an encoded dynamic tuple', () => {
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001ab00000000000000000000000000000000000000000000000000000000000000',
      );

      const result = tuple.decode({
        type: '(uint256, bytes)',
        value,
        skip: jest.fn(),
      });

      expect(result[0]).toBe(BigInt(12));
      expect(bytesToHex(result[1] as Uint8Array)).toBe('0xab');
    });

    it('calls skip with the tuple length', () => {
      const skip = jest.fn();
      const value = hexToBytes(
        '000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000022',
      );

      tuple.decode({ type: '(uint256,uint256)', value, skip });
      expect(skip).toHaveBeenCalledWith(32);
    });
  });
});
