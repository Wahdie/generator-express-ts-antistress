"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationFileGenerator = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class AssociationFileGenerator {
    constructor(outputPath, models, fileTemplatePath) {
        this.outputPath = outputPath;
        this.models = models;
        this.fileTemplatePath = fileTemplatePath;
    }
    injectForeignKeys() {
        this.models.forEach((model) => {
            if (!model.relations)
                return;
            Object.entries(model.relations).forEach(([relationName, relation]) => {
                if (!relation.foreignKey) {
                    // Cari field yang punya foreignKey: true dan references ke relation.model
                    const fkEntry = Object.entries(model.fields).find(([fieldName, fieldDef]) => {
                        return (fieldDef.foreignKey &&
                            fieldDef.references &&
                            fieldDef.references.toLowerCase() === relation.model.toLowerCase());
                    });
                    if (fkEntry) {
                        relation.foreignKey = fkEntry[0]; // nama field sebagai foreignKey
                    }
                    else {
                        // fallback default
                        relation.foreignKey =
                            relation.type === 'belongsTo'
                                ? `${relationName}Id`
                                : `${model.name.toLowerCase()}Id`;
                    }
                }
                // Default otherKey untuk many-to-many
                if ((relation.type === 'belongsToMany' || relation.type === 'manyToMany') &&
                    !relation.otherKey) {
                    relation.otherKey = `${relation.model.toLowerCase()}Id`;
                }
            });
        });
    }
    async generate() {
        try {
            this.injectForeignKeys();
            const templatePath = path_1.default.join(this.fileTemplatePath, 'model/sequelize', 'association.ejs');
            const targetPath = path_1.default.join(this.outputPath, 'src/models', 'associations.ts');
            const template = await fs_1.promises.readFile(templatePath, 'utf-8');
            const rendered = ejs_1.default.render(template, { models: this.models });
            await fs_1.promises.mkdir(path_1.default.dirname(targetPath), { recursive: true });
            await fs_1.promises.writeFile(targetPath, rendered);
            console.log(chalk_1.default.green(`✅ Association file generated: ${targetPath}`));
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to generate association file:', error));
            throw error;
        }
    }
}
exports.AssociationFileGenerator = AssociationFileGenerator;
