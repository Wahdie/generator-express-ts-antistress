"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolingConfigurator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class ToolingConfigurator {
    constructor(outputPath, templatePath, dbType) {
        this.outputPath = outputPath;
        this.templatePath = templatePath;
        this.dbType = dbType;
    }
    setupTooling() {
        try {
            const configFiles = [
                { template: 'nodemon.ejs', output: 'nodemon.json' },
                { template: 'eslintrc.ejs', output: '.eslintrc.js' },
                { template: 'tsconfig.ejs', output: 'tsconfig.json' },
                { template: 'prettierrc.ejs', output: '.prettierrc' },
                { template: 'jestconfig.ejs', output: 'jest.config.js' },
                { template: 'README.md.ejs', output: 'README.md' },
            ];
            const context = this.dbType === 'sql' ? { dbType: 'sql' } : { dbType: 'nosql' };
            configFiles.forEach(({ template, output }) => {
                const templateFile = path_1.default.join(this.templatePath, template);
                const outputFile = path_1.default.join(this.outputPath, output);
                const templateContent = fs_1.default.readFileSync(templateFile, "utf-8");
                const rendered = ejs_1.default.render(templateContent, context);
                fs_1.default.writeFileSync(outputFile, rendered);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red("Error setting up tooling:", error));
            throw error;
        }
    }
}
exports.ToolingConfigurator = ToolingConfigurator;
