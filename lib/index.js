"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @dependencies
const options_1 = __importDefault(require("./options"));
module.exports = (options, ctx) => (Object.assign({ name: '@vuepress/plugin-posts-encrypt' }, (0, options_1.default)(options, ctx)));
