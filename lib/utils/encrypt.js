"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptAndGenFile = exports.validate = exports.decrypt = exports.encrypt = exports.CRYPTO_INJECT = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * Salt and encrypt a msg with a password.
 */
const keySize = 256;
const iterations = 1000;
exports.CRYPTO_INJECT = `<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`;
/**
 * 通过密码给明文进行加密
 *
 * @export
 * @param {string} content 需要加密的内容
 * @param {string} password 加密使用的密码
 * @returns
 */
function encrypt(content, password) {
    // 必须是字符串类型
    password += '';
    const salt = crypto_js_1.default.lib.WordArray.random(128 / 8);
    const key = crypto_js_1.default.PBKDF2(password, salt, {
        keySize: keySize / 32,
        iterations
    });
    const iv = crypto_js_1.default.lib.WordArray.random(128 / 8);
    const encrypted = crypto_js_1.default.AES.encrypt(content, key, {
        iv: iv,
        padding: crypto_js_1.default.pad.Pkcs7,
        mode: crypto_js_1.default.mode.CBC
    });
    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const encryptedMsg = salt.toString() + iv.toString() + encrypted.toString();
    const hmac = crypto_js_1.default.HmacSHA256(encryptedMsg, crypto_js_1.default.SHA256(password).toString()).toString();
    return hmac + encryptedMsg;
}
exports.encrypt = encrypt;
/**
 * 根据 密文 + 密码 反解出明文
 *
 * @export
 * @param {string} encryptedMsg 密文
 * @param {string} password 密码
 * @returns
 */
function decrypt(encryptedMsg, password) {
    const salt = crypto_js_1.default.enc.Hex.parse(encryptedMsg.substr(0, 32));
    const iv = crypto_js_1.default.enc.Hex.parse(encryptedMsg.substr(32, 32));
    const encrypted = encryptedMsg.substring(64);
    const key = crypto_js_1.default.PBKDF2(password, salt, {
        keySize: keySize / 32,
        iterations
    });
    const decrypted = crypto_js_1.default.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: crypto_js_1.default.pad.Pkcs7,
        mode: crypto_js_1.default.mode.CBC
    }).toString(crypto_js_1.default.enc.Utf8);
    return decrypted;
}
exports.decrypt = decrypt;
/**
 * 验证密码的正确性
 *
 * @export
 * @param {string} encryptedMsg 加密后的内容
 * @param {string} password 密码
 * @returns {boolean} 密码是否正确
 */
function validate(encryptedMsg, password) {
    const encryptedHMAC = encryptedMsg.substring(0, 64);
    const encryptedHTML = encryptedMsg.substring(64);
    const decryptedHMAC = crypto_js_1.default.HmacSHA256(encryptedHTML, crypto_js_1.default.SHA256(password).toString()).toString();
    return decryptedHMAC === encryptedHMAC;
}
exports.validate = validate;
function encryptAndGenFile(encryptedPaths) {
    return (resolve, reject, next, item) => {
        const [path, pass] = item;
        fs_1.default.readFile(path, { encoding: 'utf8' }, (err, content) => {
            next();
            if (err) {
                encryptedPaths.delete(path);
                reject(err);
            }
            encryptedPaths.set(path, encrypt(content, pass));
            resolve();
        });
    };
}
exports.encryptAndGenFile = encryptAndGenFile;
