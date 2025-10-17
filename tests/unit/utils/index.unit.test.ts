import { parsePgArray } from '../../../src/utils';

describe('parsePgArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('when input is already an array', () => {
    it('converts array items to strings without additional filtering', () => {
      expect(parsePgArray(['a', 1, true, null as any, undefined as any])).toEqual([
        'a', '1', 'true', 'null', 'undefined'
      ]);
      expect(parsePgArray(['a', '', 'NULL'])).toEqual(['a', '', 'NULL']);
    });
  });

  describe('nullish and empty inputs', () => {
    it('returns [] for null/undefined', () => {
      expect(parsePgArray(null as any)).toEqual([]);
      expect(parsePgArray(undefined as any)).toEqual([]);
    });

    it("returns [] for '' and '{}'", () => {
      expect(parsePgArray('')).toEqual([]);
      expect(parsePgArray('{}')).toEqual([]);
      expect(parsePgArray('    ')).toEqual([]);
      expect(parsePgArray('  {}  ')).toEqual([]);
    });
  });

  describe('non-braced strings', () => {
    it('returns the trimmed string wrapped in an array', () => {
      expect(parsePgArray('abc')).toEqual(['abc']);
      expect(parsePgArray('  abc  ')).toEqual(['abc']);
    });

    it('unbalanced braces are treated as non-array strings', () => {
      expect(parsePgArray('{a,b')).toEqual(['{a,b']);
      expect(parsePgArray('a,b}')).toEqual(['a,b}']);
    });
  });

  describe('basic braced parsing', () => {
    it('parses simple comma-separated elements', () => {
      expect(parsePgArray('{a,b,c}')).toEqual(['a', 'b', 'c']);
      expect(parsePgArray('{ a , b , c }')).toEqual(['a', 'b', 'c']);
    });

    it('drops empty tokens created by consecutive commas or leading/trailing commas', () => {
      expect(parsePgArray('{a,,b}')).toEqual(['a', 'b']);
      expect(parsePgArray('{,a,b}')).toEqual(['a', 'b']);
      expect(parsePgArray('{a,b,}')).toEqual(['a', 'b']);
    });

    it('drops unquoted NULL tokens case-insensitively', () => {
      expect(parsePgArray('{a,NULL,b,null,NuLl}')).toEqual(['a', 'b']);
    });
  });

  describe('quoted elements and escaping', () => {
    it('keeps commas inside quoted elements', () => {
      expect(parsePgArray('{"a,b",c}')).toEqual(['a,b', 'c']);
      expect(parsePgArray('{" a , b ", c }')).toEqual(['a , b', 'c']);
    });

    it('supports backslash escaping inside quotes', () => {
      expect(parsePgArray('{"a\\"b"}')).toEqual(['a"b']);
      expect(parsePgArray('{"c\\\\d"}')).toEqual(['c\\d']);
    });

    it('closes quotes properly and resumes normal parsing', () => {
      expect(parsePgArray('{"x" , y, "z"}')).toEqual(['x', 'y', 'z']);
    });

    it('retains quoted NULL but drops unquoted NULL', () => {
      expect(parsePgArray('{"NULL", NULL, "null", null}')).toEqual(['NULL', 'null']);
    });

    it('drops empty quoted string elements due to final filter behavior', () => {
      expect(parsePgArray('{"" , a}')).toEqual(['a']);
    });
  });

  describe('whitespace handling', () => {
    it('trims unquoted elements but preserves inner whitespace of quoted elements', () => {
      expect(parsePgArray('{  a  ,  b  }')).toEqual(['a', 'b']);
      expect(parsePgArray('{  "  a  "  ,  "b c" }')).toEqual(['a', 'b c']);
    });

    it('outer whitespace around the whole literal is ignored', () => {
      expect(parsePgArray('  {a,b}  ')).toEqual(['a', 'b']);
    });
  });

  describe('nested braces', () => {
    it('handles nested braces as plain characters (no nesting support)', () => {
      expect(parsePgArray('{{a,b},{c,d}}')).toEqual(['{a', 'b}', '{c', 'd}']);
    });
  });
});
