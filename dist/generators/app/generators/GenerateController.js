"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class ControllerGenerator {
    constructor(outputPath, type, pattern, fileTemplatePath) {
        this.outputPath = outputPath;
        this.type = type;
        this.pattern = pattern;
        this.fileTemplatePath = fileTemplatePath;
    }
    getTemplateFileName() {
        if (this.pattern === 'MVC') {
            return this.type === 'sql'
                ? 'mvc/controller-sequelize.ejs'
                : 'mvc/controller-mongoose.ejs';
        }
        else if (this.pattern === 'Layered') {
            return 'layered/controller.ejs';
        }
        throw new Error(chalk_1.default.red('Invalid project structure or type'));
    }
    getTemplatePath(model) {
        return path_1.default.join(this.fileTemplatePath, 'controller/', this.getTemplateFileName());
    }
    getControllerPath(model) {
        return path_1.default.join(this.outputPath, 'src/controllers', `${model.name}Controller.ts`);
    }
    validate() {
        if (!this.type || (this.type !== 'sql' && this.type !== 'nosql')) {
            console.error(chalk_1.default.red('❌ Invalid schema: type must be either "sql" or "nosql".'));
            return false;
        }
        if (!this.pattern ||
            (this.pattern !== 'MVC' && this.pattern !== 'Layered')) {
            console.error(chalk_1.default.red('❌ Invalid project structure specified. Must be "MVC" or "Layered".'));
            return false;
        }
        return true;
    }
    async generate(model) {
        if (!this.validate())
            return;
        const templatePath = this.getTemplatePath(model);
        const controllerPath = this.getControllerPath(model);
        try {
            const controllerContent = await ejs_1.default.renderFile(templatePath, { model: model }, { async: true });
            fs_1.default.mkdirSync(path_1.default.dirname(controllerPath), { recursive: true });
            fs_1.default.writeFileSync(controllerPath, controllerContent.trim());
            console.log(chalk_1.default.green(`✅ Controller file created: ${controllerPath}`));
        }
        catch (err) {
            console.error(chalk_1.default.red('❌ Error generating controller file:', err));
        }
    }
}
exports.ControllerGenerator = ControllerGenerator;
