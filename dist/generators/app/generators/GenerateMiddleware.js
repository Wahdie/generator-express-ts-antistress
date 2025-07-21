"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareGenerator = void 0;
// MiddlewareGenerator.ts
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class MiddlewareGenerator {
    constructor(outputPath, fileTemplatePath) {
        this.outputPath = outputPath;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate() {
        try {
            const templateFile = 'errorHandler.ejs';
            const outputFile = 'errorHandler.ts';
            const fullTemplatePath = path_1.default.join(this.fileTemplatePath, 'middleware', templateFile);
            const content = await ejs_1.default.renderFile(fullTemplatePath, { async: true });
            const targetPath = path_1.default.join(this.outputPath, 'src/middlewares', outputFile);
            await fs_1.promises.mkdir(path_1.default.dirname(targetPath), { recursive: true });
            await fs_1.promises.writeFile(targetPath, content.trim());
            console.log(`✅ Middleware generated: ${targetPath}`);
        }
        catch (error) {
            console.error('❌ Error generating errorHandler middleware:', error);
        }
    }
}
exports.MiddlewareGenerator = MiddlewareGenerator;
