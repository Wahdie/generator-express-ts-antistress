"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const GenerateModel_1 = require("./generators/GenerateModel");
const GenerateDatabaseConfig_1 = require("./generators/GenerateDatabaseConfig");
const GenerateRepository_1 = require("./generators/GenerateRepository");
const GenerateService_1 = require("./generators/GenerateService");
const GenerateRouter_1 = require("./generators/GenerateRouter");
const GenerateController_1 = require("./generators/GenerateController");
const GenerateApp_1 = require("./generators/GenerateApp");
const GenerateAssoc_1 = require("./generators/GenerateAssoc");
const GenerateTest_1 = require("./generators/GenerateTest");
const GenerateMiddleware_1 = require("./generators/GenerateMiddleware");
const GenerateUtil_1 = require("./generators/GenerateUtil");
class ProjectGenerator {
    constructor(outputPath, schema, pattern, dbType, dbDialect, fileTemplatePath) {
        this.models = [];
        this.outputPath = outputPath;
        this.schema = schema;
        this.dbType = dbType;
        this.dbDialect = dbDialect; // Default to mysql if dialect is not specified
        this.pattern = pattern;
        this.fileTemplatePath = fileTemplatePath;
        this.resolvedOutputPath = path_1.default.resolve(outputPath);
    }
    generate() {
        try {
            if (!this.validateSchema()) {
                throw new Error('Schema validation failed. Please check your schema.');
            }
            this.createStructure();
            this.generateComponents();
            this.generateFinalFiles();
            console.log('✅ Files generated successfully!');
        }
        catch (error) {
            console.error('❌ Error generating project:', error);
            throw error;
        }
    }
    createStructure() {
        const folders = ['src/controllers', 'src/models', 'src/routes', 'src/views', 'src/config', 'src/middlewares', "src/utils", 'test'];
        if (this.pattern === 'Layered') {
            folders.push('src/repositories', 'src/services');
        }
        folders.forEach((folder) => {
            const fullPath = path_1.default.join(this.outputPath, folder);
            if (!fs_1.default.existsSync(fullPath)) {
                fs_1.default.mkdirSync(fullPath, { recursive: true });
            }
        });
    }
    validateSchema() {
        if (!this.schema || !this.schema.models) {
            console.error('❌ Invalid schema: missing  models.');
            return false;
        }
        if (this.pattern !== 'MVC' && this.pattern !== 'Layered') {
            console.error('❌ Invalid project pattern. Must be "MVC" or "Repository".');
            return false;
        }
        if (!fs_1.default.existsSync(this.resolvedOutputPath)) {
            fs_1.default.mkdirSync(this.resolvedOutputPath, { recursive: true });
        }
        return true;
    }
    generateComponents() {
        const modelGenerator = new GenerateModel_1.ModelGenerator(this.resolvedOutputPath, this.fileTemplatePath);
        const repositoryGenerator = new GenerateRepository_1.RepositoryGenerator(this.resolvedOutputPath, this.dbType, this.fileTemplatePath);
        const serviceGenerator = new GenerateService_1.ServiceGenerator(this.resolvedOutputPath, this.dbType, this.fileTemplatePath);
        const routerGenerator = new GenerateRouter_1.RouterGenerator(this.resolvedOutputPath, this.fileTemplatePath);
        const controllerGenerator = new GenerateController_1.ControllerGenerator(this.resolvedOutputPath, this.dbType, this.pattern, this.fileTemplatePath);
        const dbConfigGenerator = new GenerateDatabaseConfig_1.DatabaseConfigGenerator(this.resolvedOutputPath, this.dbType, this.dbDialect, this.fileTemplatePath);
        const testGenerator = new GenerateTest_1.TestGenerator(this.resolvedOutputPath, this.schema.models, this.dbType, this.fileTemplatePath);
        this.schema.models.forEach((model) => {
            modelGenerator.generate(model, this.dbType);
            controllerGenerator.generate(model);
            routerGenerator.generate(model);
            if (this.pattern === 'Layered') {
                repositoryGenerator.generate(model);
                serviceGenerator.generate(model);
            }
            this.models.push(model);
        });
        dbConfigGenerator.generate();
        testGenerator.generate();
        if (this.dbType === 'sql') {
            const associationFileGenerator = new GenerateAssoc_1.AssociationFileGenerator(this.resolvedOutputPath, this.models, this.fileTemplatePath);
            associationFileGenerator.generate();
        }
    }
    generateFinalFiles() {
        // Generate the main application file (app.ts & server.ts)
        const appGenerator = new GenerateApp_1.AppGenerator(this.resolvedOutputPath, this.models, this.dbType, this.fileTemplatePath);
        const middlewareGenerator = new GenerateMiddleware_1.MiddlewareGenerator(this.resolvedOutputPath, this.fileTemplatePath);
        const utilGenerator = new GenerateUtil_1.UtilGenerator(this.resolvedOutputPath, this.dbType, this.fileTemplatePath, this.pattern);
        middlewareGenerator.generate();
        utilGenerator.generate();
        appGenerator.generate();
    }
}
exports.ProjectGenerator = ProjectGenerator;
