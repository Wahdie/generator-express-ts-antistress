"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationFileGenerator = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class AssociationFileGenerator {
    constructor(outputPath, models, fileTemplatePath) {
        this.outputPath = outputPath;
        this.models = models;
        this.fileTemplatePath = fileTemplatePath;
    }
    async generate() {
        try {
            const templatePath = path_1.default.join(this.fileTemplatePath, 'model/sequelize', 'association.ejs');
            const targetPath = path_1.default.join(this.outputPath, 'src/models', 'associations.ts');
            const template = await fs_1.promises.readFile(templatePath, 'utf-8');
            const rendered = ejs_1.default.render(template, { models: this.models });
            await fs_1.promises.mkdir(path_1.default.dirname(targetPath), { recursive: true });
            await fs_1.promises.writeFile(targetPath, rendered);
        }
        catch (error) {
            console.error('Failed to generate association file:', error);
            throw error;
        }
    }
}
exports.AssociationFileGenerator = AssociationFileGenerator;
