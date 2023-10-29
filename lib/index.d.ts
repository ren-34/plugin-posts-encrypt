import Vuepress from 'vuepress-types';
export interface InjectConfig {
    less?: string;
    iview?: boolean;
    animate?: boolean;
}
export interface Options {
    route?: string;
    passwd: string;
    template?: string;
    encryptInDev?: boolean;
    expires?: number;
    injectConfig?: InjectConfig;
    checkAll?: boolean;
}
export declare type TypedMap<T = string, U = string> = Map<T, U>;
interface _Context {
    __tempdir__?: string;
}
export declare type Context = _Context & Vuepress.Context;
export {};
