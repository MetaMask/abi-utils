import { bytesToHex, hexToBytes } from '@metamask/utils';

import {
  DECODE_OUT_OF_RANGE_NUMBER_VECTORS,
  INVALID_NUMBER_TYPE_VECTORS,
  NUMBER_VECTORS,
  OUT_OF_RANGE_NUMBER_VECTORS,
} from './__fixtures__';
import { getBigInt, getLength, isSigned, number } from './number';

describe('isSigned', () => {
  it('checks if a number type is signed', () => {
    expect(isSigned('int')).toBe(true);
    expect(isSigned('int256')).toBe(true);
    expect(isSigned('int123')).toBe(true);

    expect(isSigned('uint')).toBe(false);
    expect(isSigned('uint256')).toBe(false);
    expect(isSigned('uint123')).toBe(false);
  });
});

describe('getLength', () => {
  it('gets the bit length of the specified type', () => {
    expect(getLength('int')).toBe(256);
    expect(getLength('int256')).toBe(256);
    expect(getLength('int128')).toBe(128);

    expect(getLength('uint')).toBe(256);
    expect(getLength('uint256')).toBe(256);
    expect(getLength('uint128')).toBe(128);
  });

  it.each(['int0', 'int257', 'uint0', 'uint257'])(
    'throws if the length is out of range',
    (type) => {
      expect(() => getLength(type)).toThrow(
        /Invalid number length\. Expected a number between 8 and 256, but received ".*"\./u,
      );
    },
  );

  it.each(['int9', 'int123', 'uint9', 'uint123'])(
    'throws if the length is not a multiple of 8',
    (type) => {
      expect(() => getLength(type)).toThrow(
        /Invalid number length\. Expected a multiple of 8, but received ".*"\./u,
      );
    },
  );

  it.each(INVALID_NUMBER_TYPE_VECTORS)(
    'throws if the type is invalid',
    (type) => {
      expect(() => getLength(type)).toThrow(
        /Invalid number type\. Expected a number type, but received ".*"\./u,
      );
    },
  );
});

describe('assertNumberLength', () => {
  it.each(OUT_OF_RANGE_NUMBER_VECTORS)(
    'throws if the value is out of range',
    ({ type, value }) => {
      expect(() =>
        number.encode({
          type,
          value,
          buffer: new Uint8Array(),
          packed: false,
          tight: false,
        }),
      ).toThrow(/Number ".*" is out of range for type ".*"\./u);
    },
  );
});

describe('getBigInt', () => {
  it('returns a bigint for a number-like input', () => {
    expect(getBigInt(123)).toBe(BigInt(123));
    expect(getBigInt('123')).toBe(BigInt(123));
    expect(getBigInt('0x123')).toBe(BigInt(291));
  });

  it.each([true, false, null, undefined, '0xabcg', 1.1, -1.1, NaN, Infinity])(
    'throws for invalid number-like input',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => getBigInt(value)).toThrow('Invalid number');
    },
  );
});

describe('number', () => {
  describe('isType', () => {
    it('checks if a type is a number type', () => {
      expect(number.isType('uint256')).toBe(true);
      expect(number.isType('uint128')).toBe(true);
      expect(number.isType('uint')).toBe(true);
      expect(number.isType('int256')).toBe(true);
      expect(number.isType('int128')).toBe(true);
      expect(number.isType('int')).toBe(true);

      expect(number.isType('string')).toBe(false);
      expect(number.isType('(uint256)')).toBe(false);
      expect(number.isType('uint256[]')).toBe(false);
    });
  });

  describe('getByteLength', () => {
    it('returns 32', () => {
      expect(number.getByteLength('uint256')).toBe(32);
    });
  });

  describe('encode', () => {
    it.each(NUMBER_VECTORS)(
      'encodes a $type number',
      ({ type, value, hexadecimal }) => {
        expect(
          bytesToHex(
            number.encode({
              type,
              value,
              buffer: new Uint8Array(),
              packed: false,
              tight: false,
            }),
          ),
        ).toBe(hexadecimal);
      },
    );

    it.each(OUT_OF_RANGE_NUMBER_VECTORS)(
      'throws if the value is out of range',
      ({ type, value }) => {
        expect(() =>
          number.encode({
            type,
            value,
            buffer: new Uint8Array(),
            packed: false,
            tight: false,
          }),
        ).toThrow(/Number ".*" is out of range for type ".*"\./u);
      },
    );
  });

  describe('decode', () => {
    it.each(NUMBER_VECTORS)(
      'decodes a $type number',
      ({ type, value, hexadecimal }) => {
        expect(
          number.decode({
            type,
            value: hexToBytes(hexadecimal),
            skip: jest.fn(),
          }),
        ).toBe(value);
      },
    );

    it.each(DECODE_OUT_OF_RANGE_NUMBER_VECTORS)(
      'throws if the $type value is out of range',
      ({ type, hexadecimal }) => {
        expect(() =>
          number.decode({
            type,
            value: hexToBytes(hexadecimal),
            skip: jest.fn(),
          }),
        ).toThrow(/Number ".*" is out of range for type ".*"\./u);
      },
    );
  });
});
