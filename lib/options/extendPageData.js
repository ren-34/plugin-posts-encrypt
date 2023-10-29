"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encrypt_1 = require("../utils/encrypt");
const utils_1 = require("../utils");
exports.default = (options, ctx, encryptedPaths) => {
    const { passwd: BasePasswd, checkAll = false } = options;
    // 要想校验所有路由，只能使用全局密码配置
    if (checkAll === true) {
        const ciphertext = (0, encrypt_1.encrypt)(utils_1.CHECK_ALL_PATH_KEY, BasePasswd);
        encryptedPaths.set(utils_1.CHECK_ALL_PATH_KEY, ciphertext);
    }
    return ($page) => {
        const { frontmatter, key } = $page;
        const { secret, passwd } = frontmatter;
        // 防止密码暴露
        delete $page.frontmatter.passwd;
        // 全部验证
        if (checkAll === true) {
            $page.frontmatter.secret = true;
            $page.frontmatter[utils_1.CHECK_ALL_PATH_KEY] = checkAll;
            return;
        }
        if (secret === true) {
            const ciphertext = (0, encrypt_1.encrypt)(key, passwd || BasePasswd);
            encryptedPaths.set(key, ciphertext);
        }
    };
};
