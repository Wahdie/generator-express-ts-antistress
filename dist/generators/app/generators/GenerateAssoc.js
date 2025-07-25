"use strict";
// import { promises as fs } from 'fs';
// import path from 'path';
// import ejs from 'ejs';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationFileGenerator = void 0;
// export class AssociationFileGenerator {
//   constructor(private outputPath: string, private models: any[], private fileTemplatePath: string) {}
//   async generate(): Promise<void> {
//     try {
//       const templatePath = path.join(this.fileTemplatePath, 'model/sequelize', 'association.ejs');
//       const targetPath = path.join(this.outputPath, 'src/models', 'associations.ts');
//       const template = await fs.readFile(templatePath, 'utf-8');
//       const rendered = ejs.render(template, { models: this.models });
//       await fs.mkdir(path.dirname(targetPath), { recursive: true });
//       await fs.writeFile(targetPath, rendered);
//     } catch (error) {
//       console.error('Failed to generate association file:', error);
//       throw error;
//     }
//   }
// }
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
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
        }
        catch (error) {
            console.error('Failed to generate association file:', error);
            throw error;
        }
    }
}
exports.AssociationFileGenerator = AssociationFileGenerator;
