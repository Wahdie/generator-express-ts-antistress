"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class ServiceGenerator {
    constructor(outputPath, dbType, fileTemplatePath) {
        this.outputPath = outputPath;
        this.dbType = dbType;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate(model) {
        try {
            const serviceDir = path_1.default.join(this.outputPath, 'src/services');
            if (!fs_1.default.existsSync(serviceDir)) {
                fs_1.default.mkdirSync(serviceDir, { recursive: true });
            }
            const templateFile = 'services/service.ejs';
            const filePath = path_1.default.join(serviceDir, `${model.name}Service.ts`);
            const templatePath = path_1.default.resolve(this.fileTemplatePath, templateFile);
            const content = await ejs_1.default.render(fs_1.default.readFileSync(templatePath, 'utf-8'), { model, dbType: this.dbType, toCamelCase: this.toCamelCase });
            fs_1.default.writeFileSync(filePath, content, 'utf-8');
            console.log(chalk_1.default.green(`✅ Service created for model: ${model.name}`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ Error generating service for model ${model.name}:`, error));
            throw error;
        }
    }
    toCamelCase(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
exports.ServiceGenerator = ServiceGenerator;
