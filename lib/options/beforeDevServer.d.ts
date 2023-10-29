import { Application } from 'express';
import { Options, Context } from '../index';
declare const _default: (options: Options, ctx: Context, genCiphertext: any) => (app: Application) => Promise<void>;
/**
 * 用于在 开发模式 下预览加密效果
 * */
export default _default;
