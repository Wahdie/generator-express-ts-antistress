"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class RepositoryGenerator {
    constructor(outputPath, dbType, fileTemplatePath) {
        this.outputPath = outputPath;
        this.dbType = dbType;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate(model) {
        try {
            const repositoryDir = path_1.default.join(this.outputPath, 'src/repositories');
            if (!fs_1.default.existsSync(repositoryDir)) {
                fs_1.default.mkdirSync(repositoryDir, { recursive: true });
            }
            const templateFile = this.dbType === 'sql'
                ? 'repository/repository-sequelize.ejs'
                : 'repository/repository-mongoose.ejs';
            const filePath = path_1.default.join(repositoryDir, `${model.name}Repository.ts`);
            const templatePath = path_1.default.resolve(this.fileTemplatePath, templateFile);
            const content = await ejs_1.default.render(fs_1.default.readFileSync(templatePath, 'utf-8'), { model });
            await fs_1.default.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ Repository created for model: ${model.name}`);
        }
        catch (error) {
            console.error(`❌ Error generating repository for model ${model.name}:`, error);
            throw error;
        }
    }
}
exports.RepositoryGenerator = RepositoryGenerator;
