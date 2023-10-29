"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enhanceAppFiles_1 = __importDefault(require("../../assets/enhanceAppFiles"));
const utils_1 = require("../utils");
exports.default = (options, ctx) => () => {
    const { route } = options;
    const { base } = ctx;
    return {
        name: 'posts-encrypt-plugin',
        content: (0, enhanceAppFiles_1.default)(base.replace(/\/$/, '') + route, utils_1.STORAGE_KEY, utils_1.CHECK_ALL_PATH_KEY)
    };
};
