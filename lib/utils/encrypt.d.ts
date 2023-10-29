export declare const CRYPTO_INJECT = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js\" integrity=\"sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>";
/**
 * 通过密码给明文进行加密
 *
 * @export
 * @param {string} content 需要加密的内容
 * @param {string} password 加密使用的密码
 * @returns
 */
export declare function encrypt(content: string, password: string): any;
/**
 * 根据 密文 + 密码 反解出明文
 *
 * @export
 * @param {string} encryptedMsg 密文
 * @param {string} password 密码
 * @returns
 */
export declare function decrypt(encryptedMsg: string, password: string): any;
/**
 * 验证密码的正确性
 *
 * @export
 * @param {string} encryptedMsg 加密后的内容
 * @param {string} password 密码
 * @returns {boolean} 密码是否正确
 */
export declare function validate(encryptedMsg: string, password: string): boolean;
export declare function encryptAndGenFile(encryptedPaths: any): (resolve: any, reject: any, next: any, item: any) => void;
