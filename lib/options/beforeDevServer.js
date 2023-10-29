"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 用于在 开发模式 下预览加密效果
 * */
exports.default = (options, ctx, genCiphertext) => {
    const { route } = options;
    const genPath = path_1.default.join(ctx.__tempdir__ || ctx.tempPath, `${route}.html`);
    return (app) => __awaiter(void 0, void 0, void 0, function* () {
        const serverRoute = ctx.base.replace(/\/$/, '') + route;
        genCiphertext()(genPath);
        app.get(serverRoute, function (req, res) {
            if (!fs_1.default.existsSync(genPath)) {
                genCiphertext()(genPath);
            }
            fs_1.default.createReadStream(genPath).pipe(res);
        });
    });
};
