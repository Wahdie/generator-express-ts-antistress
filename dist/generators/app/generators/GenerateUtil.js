"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilGenerator = void 0;
// UtilGenerator.ts
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class UtilGenerator {
    constructor(outputPath, dbType, fileTemplatePath, pattern) {
        this.outputPath = outputPath;
        this.dbType = dbType;
        this.fileTemplatePath = fileTemplatePath;
        this.pattern = pattern;
    }
    async generate() {
        try {
            const lowerStructure = this.pattern.toLowerCase();
            const utilFiles = [
                {
                    relativePath: `${lowerStructure}/validateUnique.ejs`,
                    outputFilename: 'validateUniqueFields.ts',
                    templateData: { type: this.dbType },
                },
                {
                    relativePath: `${lowerStructure}/validateIdExists.ejs`,
                    outputFilename: 'validateIdExists.ts',
                    templateData: { type: this.dbType },
                },
                {
                    relativePath: 'parseId.ejs',
                    outputFilename: 'parseId.ts',
                    templateData: { type: this.dbType },
                },
                {
                    relativePath: 'validateRequired.ejs',
                    outputFilename: 'validateRequiredFields.ts',
                    templateData: { type: this.dbType },
                },
            ];
            for (const util of utilFiles) {
                const fullTemplatePath = path_1.default.join(this.fileTemplatePath, 'utils', util.relativePath);
                const exists = await fs_1.promises
                    .access(fullTemplatePath)
                    .then(() => true)
                    .catch(() => false);
                if (!exists)
                    continue;
                const content = await ejs_1.default.renderFile(fullTemplatePath, { async: true, ...(util.templateData || {}) });
                const targetPath = path_1.default.join(this.outputPath, 'src/utils', util.outputFilename);
                await fs_1.promises.mkdir(path_1.default.dirname(targetPath), { recursive: true });
                await fs_1.promises.writeFile(targetPath, content.trim());
                console.log(`✅ Util  generated: ${targetPath}`);
            }
        }
        catch (error) {
            console.error('❌ Error generating util middleware files:', error);
        }
    }
}
exports.UtilGenerator = UtilGenerator;
