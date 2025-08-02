"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class AppGenerator {
    constructor(outputPath, models, databaseType, fileTemplatePath) {
        this.outputPath = outputPath;
        this.models = models;
        this.databaseType = databaseType;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate() {
        try {
            await this.generateAppFile();
            await this.generateServerFile();
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to generate app or server file:', error));
            throw error;
        }
    }
    async generateAppFile() {
        const routerImports = this.models
            .map((model) => `import ${model.name}Router from './routes/${model.name}Router';`)
            .join('\n');
        const routerUses = this.models
            .map((model) => `app.use('/${model.name.toLowerCase()}', ${model.name}Router);`)
            .join('\n');
        const appTemplatePath = path_1.default.join(this.fileTemplatePath, 'app.ejs');
        const appTemplate = fs_1.default.readFileSync(appTemplatePath, 'utf-8');
        const appContent = await ejs_1.default.render(appTemplate, {
            routerImports,
            routerUses,
            databaseType: this.databaseType,
        });
        const appPath = path_1.default.join(this.outputPath, 'src', 'app.ts');
        fs_1.default.writeFileSync(appPath, appContent.trim());
        console.log(chalk_1.default.green(`✅ App file created: ${appPath}`));
    }
    async generateServerFile() {
        const serverTemplatePath = path_1.default.join(this.fileTemplatePath, 'server.ejs');
        const serverTemplate = fs_1.default.readFileSync(serverTemplatePath, 'utf-8');
        const serverContent = await ejs_1.default.render(serverTemplate);
        const serverPath = path_1.default.join(this.outputPath, 'src', 'server.ts');
        fs_1.default.writeFileSync(serverPath, serverContent.trim());
        console.log(chalk_1.default.green(`✅ Server file created: ${serverPath}`));
    }
}
exports.AppGenerator = AppGenerator;
