import {
  decryptAES,
  encryptAES,
  getCaptcha,
  getSelfSalt,
  makeRandString,
  replaceSensitiveInfo,
} from './common';
import { CaptchaType, sensitive } from '../config/common';
import { CustomError } from '../config/commonException';
describe('getSelfSalt function', () => {
  it('should return a string of the correct length', () => {
    const salt = getSelfSalt(8);
    expect(salt.length).toBe(10);
  });

  it('should return a string that includes the == suffix', () => {
    const salt = getSelfSalt(10);
    expect(salt.endsWith('==')).toBe(true);
  });

  it('should return == when length less 3', () => {
    const salt = getSelfSalt(2);
    expect(salt).toBe('==');
    // expect(() => getSelfSalt(1)).toThrowError();
  });

  it('should return a string that includes only the specified characters', () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?==';
    const salt = getSelfSalt(10);
    for (let i = 0; i < salt.length; i++) {
      expect(characters.includes(salt[i])).toBe(true);
    }
  });
});

describe('replaceSensitiveInfo function', () => {
  it('should desensitize phone number', () => {
    const phoneNumber = '13812345678';
    const desensitizedPhoneNumber = replaceSensitiveInfo(
      phoneNumber,
      sensitive.phone,
    );
    expect(desensitizedPhoneNumber).toBe('138****5678');
  });

  it('should desensitize email', () => {
    const email = 'test@example.com';
    const desensitizedEmail = replaceSensitiveInfo(email, sensitive.email);
    expect(desensitizedEmail).toBe('t***@example.com');
  });

  it('should desensitize ID card', () => {
    const idCard = '1234567890123';
    const desensitizedIdCard = replaceSensitiveInfo(idCard, sensitive.idCard);
    expect(desensitizedIdCard).toBe('1234****0123');
  });

  it('should desensitize bank card', () => {
    const bankCard = '1234567890123456';
    const desensitizedBankCard = replaceSensitiveInfo(
      bankCard,
      sensitive.bankCard,
    );
    expect(desensitizedBankCard).toBe('123456****3456');
  });

  it('should desensitize name', () => {
    const name = 'John Doe';
    const desensitizedName = replaceSensitiveInfo(name, sensitive.name);
    expect(desensitizedName).toBe('J**e');
  });

  it('should not desensitize and return the original string for empty type', () => {
    const originalString = '';
    const desensitizedString = replaceSensitiveInfo(
      originalString,
      sensitive.name,
    );
    expect(desensitizedString).toThrow(CustomError);
  });

  it('should not desensitize and return the original string for unknown type', () => {
    const unknownType = 'unknown';
    const originalString = 'hello world';
    const desensitizedString = replaceSensitiveInfo(
      originalString,
      unknownType as sensitive,
    );
    expect(desensitizedString).toBe(originalString);
  });

  it('should throw error when type is missing', () => {
    expect(() =>
      replaceSensitiveInfo('hello world', undefined as unknown as sensitive),
    ).toThrowErrorMatchingSnapshot('缺少参数'); //.toThrowError('缺少参数');
  });
});

describe('makeRandString function', () => {
  it('should return a string', () => {
    const result = makeRandString(10);
    expect(typeof result).toBe('string');
  });

  it('should return a string of the correct length', () => {
    const length = 10;
    const result = makeRandString(length);
    expect(result.length).toBe(length);
  });

  it('should return a string in base64 format', () => {
    const result = makeRandString(10);
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  it('should throw an error when length is not a positive integer', () => {
    expect(() => makeRandString(-1)).toThrow();
    expect(() => makeRandString(1.5)).toThrow();
  });
});

describe('decryptAES function', () => {
  it('should decrypt a valid encrypted text with a valid key', () => {
    const encryptedText = '0123456789abcdef0123456789abcdef';
    const key =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const expectedDecryptedText = 'Hello, World!';
    const decryptedText = decryptAES(encryptedText, key);
    expect(decryptedText).toBe(expectedDecryptedText);
  });

  it('should throw an error when decrypting an invalid encrypted text with a valid key', () => {
    const encryptedText = ' invalid encrypted text ';
    const key =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(() => decryptAES(encryptedText, key)).toThrow();
  });

  it('should throw an error when decrypting a valid encrypted text with an invalid key', () => {
    const encryptedText = '0123456789abcdef0123456789abcdef';
    const key = ' invalid key ';
    expect(() => decryptAES(encryptedText, key)).toThrow();
  });

  it('should return an empty string when decrypting an empty encrypted text with a valid key', () => {
    const encryptedText = '';
    const key =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const decryptedText = decryptAES(encryptedText, key);
    expect(decryptedText).toBe('');
  });

  it('should throw an error when decrypting a null encrypted text with a valid key', () => {
    const encryptedText = null;
    const key =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(() => decryptAES(encryptedText as unknown as string, key)).toThrow();
  });

  it('should throw an error when decrypting an undefined encrypted text with a valid key', () => {
    const encryptedText = undefined;
    const key =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(() => decryptAES(encryptedText as unknown as string, key)).toThrow();
  });
});

describe('encryptAES function', () => {
  it('should encrypt text with a valid key', () => {
    const text = 'Hello World!';
    const key = '01234567890123456789012345678901';
    const encryptedText = encryptAES(text, key);
    expect(encryptedText).not.toBe(text);
    expect(encryptedText).toBe(String);
  });

  it('should throw an error with an invalid key', () => {
    const text = 'Hello World!';
    const key = 'invalid key';
    expect(() => encryptAES(text, key)).toThrow('字符长度错误');
  });

  it('should return an empty string with an empty text', () => {
    const text = '';
    const key = '01234567890123456789012345678901';
    expect(encryptAES(text, key)).toThrow('字符长度错误');
  });

  it('should throw an error with a null or undefined text', () => {
    const text = null;
    const key = '01234567890123456789012345678901';
    expect(() => encryptAES(text as unknown as string, key)).toThrow(
      '字符长度错误',
    );
  });

  it('should throw an error with a null or undefined key', () => {
    const text = 'Hello World!';
    const key = null;
    expect(() => encryptAES(text, key as unknown as string)).toThrow();
  });
});

describe('getCaptcha', () => {
  it('returns alphanumeric an object with data and text properties', () => {
    const captchaType: CaptchaType = CaptchaType.ALPHANUMERIC;
    const result = getCaptcha(captchaType);
    console.log('string', result.base64, result.text);
    expect(result).toHaveProperty('base64');
    expect(result).toHaveProperty('text');
  });

  it('returns number an object with data and text properties', () => {
    const captchaType: CaptchaType = CaptchaType.NUMERIC;
    const result = getCaptcha(captchaType);
    console.log('string', result.base64, result.text);
    expect(result).toHaveProperty('base64');
    expect(result).toHaveProperty('text');
  });

  it('returns math an object with data and text properties', () => {
    const captchaType: CaptchaType = CaptchaType.MATH;
    const result = getCaptcha(captchaType);
    console.log('string', result.base64, result.text);
    expect(result).toHaveProperty('base64');
    expect(result).toHaveProperty('text');
  });
});
