import uglifyJS from 'uglify-js';
import { Options } from '../index';
export declare const IVIEW_CSS_TAG = "<link rel=\"stylesheet\" type=\"text/css\" href=\"//unpkg.com/view-design@4.7.0/dist/styles/iview.css\" />";
export declare const ANIMATECSS_TAG = "<link rel=\"stylesheet\" href=\"//cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css\" />";
export declare const IVIEW_JS_TAG = "<script type=\"text/javascript\" src=\"//unpkg.com/view-design@4.7.0/dist/iview.min.js\"></script>";
export declare const STORAGE_KEY = "__vuepress_posts_encrypt_plugin__";
export declare const CHECK_ALL_PATH_KEY = "__vuepress_posts_encrypt_plugin__check_all__";
export declare const TMPL_PATH: string;
export declare const LESS_PATH: string;
export declare const isObject: (o: any) => boolean;
export declare const wrapperLogger: (prefix: string, type: string) => (...args: any[]) => any;
export declare const error: (...args: any[]) => any;
export declare const warn: (...args: any[]) => any;
export declare const info: (...args: any[]) => any;
export declare const DefaultOptions: Options;
/**
 * 合并配置
 *
 * @param {object} base
 * @param {object} options
 * */
export declare const mergeOptions: (base?: Options, options?: {}) => Options;
/**
 * 生成注入的脚本
 *
 * @export
 * @param {string} text
 * @param {string} base
 * @param {number} expires 过期时间，默认 0，不过期
 * @param {boolean} isCustom 是否是用户自定义模板
 * @returns {string}
 */
export declare const genInjectedJS: (options: Options, text: string, base: string, isCustom: boolean, expires?: number | undefined) => string;
/**
 * 生成注入的css
 *
 * @export
 * @param {string} fromPath
 * @param {string} toPath 写到 tmp 下
 */
export declare const genInjectedCSS: (fromPath: any, outPath: any) => any;
/**
 * 异步并发限制
 *
 * @export
 * @param {Map<any, any>} sources
 * @param {*} callback
 * @param {*} [limit=LIMIT]
 * @returns
 */
export declare function limitAsyncConcurrency(sources: Map<unknown, unknown>, callback: any, limit?: number): Promise<unknown>;
/**
 * 用于替换模板字符串中的占位符
 *
 * @export
 * @param {*} tpl
 * @param {*} data
 * @returns
 */
export declare function render(tpl: any, data: any): any;
export interface ReplaceData {
    [k: string]: string;
}
/**
 * 用于 build 构建时，向 outPath 路径下写入 tmplPath 文件内容
 * 并替换模板内的占位符，注入变量值
 *
 * @export
 * @param {string} tmplPath
 * @param {string} outPath
 * @returns
 */
export declare function genFile(tmplPath: string, outPath: string, data: ReplaceData): void;
/**
 * 压缩JS
 *
 * @export
 * @param {*} content
 * @param {*} options
 * @returns
 */
export declare function uglify(content: any, options: any): uglifyJS.MinifyOutput;
/**
 * 压缩CSS
 *
 * @export
 * @param {*} content
 * @returns
 */
export declare function minifyCss(content: any): any;
export declare function mkdir(_path: any): void;
/**
 * 删除文件夹及文件
 *
 * @param {*} _path
 */
export declare function removedir(_path: any): void;
