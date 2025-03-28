/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as crypto from 'crypto';
import { genSaltSync, hash, compare } from 'bcrypt';
import { CaptchaType, sensitive } from '../config/common';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../config/commonException';

//  使用crypto生成加密的盐 8位输出10位
const getSelfSalt = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result + '==';
};

// 生成uuid
const uuid = () => uuidv4();

/**
 * Encrypts a given text using AES-256-CBC algorithm.
 *
 * @param text - The plain text to be encrypted.
 * @param key - A 32-byte key used for encryption.
 *
 * @returns The encrypted text in hexadecimal format.
 */
const encryptAES = (text: string, key: string): string => {
  try {
    if (!text || test.length < 1 || key.length < 32)
      throw new Error('字符长度错误');
    // Create a cipher instance with the specified algorithm, key, and initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', key, key.slice(0, 16));
    // Encrypt the text and return the result in hexadecimal format
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};

/**
 * Decrypts an encrypted text using AES-256-CBC algorithm.
 *
 * @param encryptedText - The text to be decrypted, in hexadecimal format.
 * @param key - A 32-byte key used for decryption.
 *
 * @returns The decrypted plain text.
 */
const decryptAES = (encryptedText: string, key: string): string => {
  try {
    if (key.length < 32) throw new Error('字符长度错误');
    // Create a decipher instance with the specified algorithm, key, and initialization vector
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      key.slice(0, 16),
    );
    // Decrypt the encrypted text and return the result in UTF-8 format
    return (
      decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
    );
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};
//  使用bcrypt生成10轮加密字符串
const getSaltByBcrypt = () => {
  return genSaltSync();
};
//  使用bcrypt生成加密后的字符串
const hashPassword = async (password: string, salt: string) => {
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};
//  使用bcrypt比较明文与散列加密后的密码一致性
const comparePassword = (password: string, hashedPassword: string) => {
  return compare(password, hashedPassword);
};

//  生成随机字符串,base64格式
const makeRandString = (length: number) => {
  return crypto.randomBytes(length).toString('base64');
};

//  手机号,邮箱,身份证,银行卡等敏感信息脱敏
const replaceSensitiveInfo = (str: string, type: sensitive): string => {
  try {
    if (!type) throw new CustomError('缺少参数');
    if (!str || str.length < 1) throw new CustomError('缺少参数');
    switch (type) {
      case sensitive.phone:
        return str.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
      case sensitive.email:
        return str.replace(/(\w{1})[^@]*(@\w+\.\w+)/, '$1***$2');
      case sensitive.idCard:
        return str.replace(/(\d{4})\d*(\d{4})/, '$1****$2');
      case sensitive.bankCard:
        return str.replace(/(\d{6})\d+(\d{4})/, '$1****$2');
      case sensitive.name: {
        const length = str.length;
        switch (length) {
          case 1:
            return str; // 只有一个字符，不隐藏
          case 2:
            return str[0] + '*'; // 两个字符，只显示第一个
          case 3:
            return str[0] + '*' + str[2]; // 三个字符，隐藏中间
          default:
            return str[0] + '**' + str.slice(-1); // 其他情况，显示首尾，隐藏中间
        }
      }
      default:
        return str;
    }
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      console.log('错误信息:', error.message);
      throw error;
    } else {
      console.error('未知错误:', error);
      const e = `未知错误:${String(error)}`;
      throw new Error(e); // 将未知错误转换为 Error
    }
  }
};

/**
 * Copies values from a DTO (Data Transfer Object) to an entity.
 *
 * @param dto - The source DTO.
 * @param entity - The target entity.
 */
const dtoToEntity = (dto: any, entity: any) => {
  for (const key in entity) {
    if (!Object.prototype.hasOwnProperty.call(dto, key)) {
      delete entity[key];
    }
  }
  for (const key in dto) {
    entity[key] = dto[key];
  }
};

const entityDelNull = (entity: any) => {
  for (const key in entity) {
    if (entity[key] == undefined) {
      delete entity[key];
    }
  }
};

const entityToDto = (entity: any, dto: any) => {
  for (const key in dto) {
    if (Object.prototype.hasOwnProperty.call(entity, key)) {
      dto[key] = entity[key];
    }
  }
};

/**
 * 生成验证码
 *
 * 生成4位验证码，图片宽80px，高28px，字符大小36px，2条干扰线
 * @returns {Promise<svgCaptcha.Captcha>} 验证码对象
 */
const getCaptcha = (type: CaptchaType, length?: number) => {
  try {
    let captcha;
    const size = length || 4;
    switch (type) {
      case CaptchaType.ALPHANUMERIC:
        captcha = captcha = svgCaptcha.create({
          size: size,
          ignoreChars: '0o1il',
          noise: 2,
          background: '#f2f2f2',
          color: true,
        });
        break;
      case CaptchaType.NUMERIC:
        captcha = svgCaptcha.create({
          size: size, // 长度
          ignoreChars: '0o1il', // 去除易混淆字符
          noise: 2, // 干扰线数量
          background: '#f2f2f2', // 背景色
          color: true, // 颜色
          charPreset: '0123456789', // 限制为纯数字
        });
        break;
      case CaptchaType.MATH:
        captcha = svgCaptcha.createMathExpr({
          size: size, //生成验证码长度
          width: 80, //图片宽度
          height: 28, //生成的图片高度
          color: true, //生成图片色彩度
          background: '#cc9966', //背景颜色
          noise: 3, //干扰线条数
        });
        break;
      default:
        captcha = svgCaptcha.create({
          size: size,
          ignoreChars: '0o1il',
          noise: 2,
          background: '#f2f2f2',
          color: true,
        });
        break;
    }
    const base64 = `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`;
    const id = uuidv4();
    return { base64, text: captcha.text as string, id };
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};

export {
  getSaltByBcrypt,
  uuid,
  getSelfSalt,
  hashPassword,
  comparePassword,
  makeRandString,
  encryptAES,
  decryptAES,
  replaceSensitiveInfo,
  entityToDto,
  entityDelNull,
  dtoToEntity,
  getCaptcha,
};
