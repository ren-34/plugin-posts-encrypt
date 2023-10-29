"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const generated_1 = __importDefault(require("./generated"));
const extendPageData_1 = __importDefault(require("./extendPageData"));
const enhanceAppFiles_1 = __importDefault(require("./enhanceAppFiles"));
const beforeDevServer_1 = __importDefault(require("./beforeDevServer"));
const clientDynamicModules_1 = __importDefault(require("./clientDynamicModules"));
const utils_1 = require("../utils");
exports.default = (options, ctx) => {
    const _options = (0, utils_1.mergeOptions)(void 0, options);
    const { isProd, base } = ctx;
    const encryptedPathMap = new Map();
    const { route, encryptInDev, expires, template, injectConfig } = _options;
    const isCustom = (template && template !== utils_1.TMPL_PATH);
    const { less, iview, animate } = injectConfig;
    const tempdir = (ctx.__tempdir__ = path_1.default.resolve(__dirname, '../../.temp/'));
    if (!isProd && !encryptInDev)
        return {
            ready() {
                (0, utils_1.info)('Plugin Inactive: \n' + JSON.stringify(_options, null, 4));
            }
        };
    // 创建临时文件夹
    (0, utils_1.mkdir)(tempdir);
    const genCiphertext = () => {
        const size = encryptedPathMap.size;
        // 拼接密文
        const text = [...encryptedPathMap.entries()].reduce((pre, cur, index) => {
            const [k, v] = cur;
            return `${pre}${k}_${v}${index == size - 1 ? '' : ';'}`;
        }, '');
        return (genPath, options, cb) => {
            try {
                const jsContent = (0, utils_1.genInjectedJS)(_options, text, base, isCustom, expires);
                const uglifiedJS = (0, utils_1.uglify)(jsContent, Object.assign({
                    mangle: {
                        toplevel: true,
                        reserved: ['Vue']
                    },
                    output: {
                        comments: false
                    }
                }, options));
                // 注入css
                const minifyedCSS = (0, utils_1.genInjectedCSS)(isCustom ? less : utils_1.LESS_PATH, tempdir);
                (0, utils_1.genFile)(template, genPath, {
                    animate_css_tag: !isCustom || animate === true ? utils_1.ANIMATECSS_TAG : '',
                    iview_css_tag: !isCustom || iview === true ? utils_1.IVIEW_CSS_TAG : '',
                    iview_js_tag: !isCustom || iview === true ? utils_1.IVIEW_JS_TAG : '',
                    validate_js_tag: `<script>${isCustom ? jsContent : uglifiedJS.code}</script>`,
                    minified_css_tag: minifyedCSS.styles ? `<style type="text/css">${minifyedCSS.styles}</style>` : ''
                });
                cb && cb(tempdir);
            }
            catch (e) {
                (0, utils_1.error)(e + '');
                console.log(e);
            }
        };
    };
    return {
        // 提供给 client 的模块
        clientDynamicModules: (0, clientDynamicModules_1.default)(),
        // 开发模式下提供验证页的静态serve
        beforeDevServer: (0, beforeDevServer_1.default)(options, ctx, genCiphertext),
        // 用户自定义的 enhanceAppFiles.js 会先于此方法被调用
        enhanceAppFiles: (0, enhanceAppFiles_1.default)(options, ctx),
        // 记录需要加密的路由
        extendPageData: (0, extendPageData_1.default)(options, ctx, encryptedPathMap),
        // 用于构建的时候将验证模板写入到用户的 out 目录下
        generated: (0, generated_1.default)(options, ctx, genCiphertext, route)
    };
};
