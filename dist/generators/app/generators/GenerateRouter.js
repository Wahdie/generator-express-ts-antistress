"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class RouterGenerator {
    constructor(outputPath, fileTemplatePath) {
        this.outputPath = outputPath;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate(model) {
        try {
            const routeDir = path_1.default.join(this.outputPath, 'src/routes');
            if (!fs_1.default.existsSync(routeDir)) {
                fs_1.default.mkdirSync(routeDir, { recursive: true });
            }
            const templatePath = path_1.default.join(this.fileTemplatePath, 'router', 'router.ejs');
            const template = fs_1.default.readFileSync(templatePath, 'utf-8');
            // Render the template with data
            const routeContent = await ejs_1.default.renderFile(templatePath, { model: model });
            const routeFilePath = path_1.default.join(routeDir, `${model.name}Router.ts`);
            fs_1.default.writeFileSync(routeFilePath, routeContent.trim(), 'utf-8');
            console.log(`Route file created: ${routeFilePath} ✅`);
        }
        catch (error) {
            console.error(`❌ Error generating router for model ${model.name}:`, error);
            throw error;
        }
    }
}
exports.RouterGenerator = RouterGenerator;
