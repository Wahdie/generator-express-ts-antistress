"use strict";
// import Generator from "yeoman-generator";
// import fs from "fs";
// import path from "path";
// import { SchemaValidator } from "./SchemaValidator";
// import { ProjectGenerator } from "./ProjectGenerator";
// import { ToolingConfigurator } from "./ToolingConfigurator";
// import { DependencyInstaller } from "./DependencyInstaller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default class AppGenerator extends Generator {
//   private schema: any;
//   private schemaPath: string = "schema.json";
//   private appName: string = "my-app";
//   private orm: "sequelize" | "mongoose" = "sequelize";
//   private pattern: "MVC" | "Layered"= "MVC";
//   private dbDialect: "postgres" | "mysql" | "sqlite" | "mongodb" = "mysql";
//   private dbType: "sql" | "nosql" = "sql";
//   private outputPath: string = ".";
//   private fileTemplatePath = path.resolve(__dirname, 'templates');
//   async prompting() {
//     const answers = await this.prompt([
//       { type: "input", name: "appName", message: "App name?", default: "my-app" },
//       { type: "input", name: "schemaPath", message: "Path to JSON schema?", default: "schema.json" },
//       { type: "list", name: "pattern", choices: ["MVC", "Layered"], message: "Architecture Pattern?", default: "MVC" },
//       { type: "list", name: "dbDialect", choices: ["postgres", "mysql", "sqlite", "mongodb"], message: "Database Dialect?", default: "mysql"},
//     ]);
//     this.appName = answers.appName;
//     this.dbDialect = answers.dbDialect;
//     this.pattern = answers.pattern;
//     this.orm = answers.orm;
//     this.schemaPath = answers.schemaPath;
//     this.outputPath = this.destinationPath(this.appName);
//     this.fileTemplatePath = this.fileTemplatePath;
//     this.schema = this.fs.readJSON(this.schemaPath);
//     // Pastikan direktori output ada
//     if(!fs.existsSync(this.outputPath)){
//       fs.mkdirSync(this.outputPath, { recursive: true });
//     }
//     // Set dbType berdasarkan dbDialect
//     if (this.dbDialect === 'postgres' || this.dbDialect === 'sqlite' || this.dbDialect === 'mysql') {
//         this.dbType = 'sql';
//     } else if (this.dbDialect === 'mongodb') {
//         this.dbType = 'nosql';
//     }
//   }
//   writing() {
//     try {
//       this.log(`Validating schema at path: ${this.schemaPath}`);
//       new SchemaValidator(this.schemaPath).validate();
//       this.log(`Generating project with name: ${this.appName}, pattern: ${this.pattern}, dbDialect: ${this.dbDialect}`);
//       new ProjectGenerator(this.outputPath, this.schema, this.pattern, this.dbType, this.dbDialect, this.fileTemplatePath).generate();
//       new ToolingConfigurator(this.outputPath, this.fileTemplatePath, this.dbType).setupTooling();
//       new DependencyInstaller(this.outputPath, this.dbDialect).configure();
//     } catch (error : any){
//       this.log.error("Gagal menjalankan generator: ");
//       console.error(error.message);
//       process.exit(1); // agar proses benar-benar berhenti
//     }
//   }
// }
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SchemaValidator_1 = require("./SchemaValidator");
const ProjectGenerator_1 = require("./ProjectGenerator");
const ToolingConfigurator_1 = require("./ToolingConfigurator");
const DependencyInstaller_1 = require("./DependencyInstaller");
module.exports = class AppGenerator extends yeoman_generator_1.default {
    constructor() {
        super(...arguments);
        this.schemaPath = "schema.json";
        this.appName = "my-app";
        this.orm = "sequelize";
        this.pattern = "MVC";
        this.dbDialect = "mysql";
        this.dbType = "sql";
        this.outputPath = ".";
        this.fileTemplatePath = path_1.default.resolve(__dirname, 'templates');
    }
    async prompting() {
        const answers = await this.prompt([
            { type: "input", name: "appName", message: "App name?", default: "my-app" },
            { type: "input", name: "schemaPath", message: "Path to JSON schema?", default: "schema.json" },
            { type: "list", name: "pattern", choices: ["MVC", "Layered"], message: "Architecture Pattern?", default: "MVC" },
            { type: "list", name: "dbDialect", choices: ["postgres", "mysql", "sqlite", "mongodb"], message: "Database Dialect?", default: "mysql" },
        ]);
        this.appName = answers.appName;
        this.dbDialect = answers.dbDialect;
        this.pattern = answers.pattern;
        this.schemaPath = answers.schemaPath;
        this.outputPath = this.destinationPath(this.appName);
        this.fileTemplatePath = this.fileTemplatePath;
        this.schema = this.fs.readJSON(this.schemaPath);
        if (!fs_1.default.existsSync(this.outputPath)) {
            fs_1.default.mkdirSync(this.outputPath, { recursive: true });
        }
        if (this.dbDialect === 'postgres' || this.dbDialect === 'sqlite' || this.dbDialect === 'mysql') {
            this.dbType = 'sql';
        }
        else if (this.dbDialect === 'mongodb') {
            this.dbType = 'nosql';
        }
    }
    writing() {
        try {
            this.log(`Validating schema at path: ${this.schemaPath}`);
            new SchemaValidator_1.SchemaValidator(this.schemaPath).validate();
            this.log(`Generating project with name: ${this.appName}, pattern: ${this.pattern}, dbDialect: ${this.dbDialect}`);
            new ProjectGenerator_1.ProjectGenerator(this.outputPath, this.schema, this.pattern, this.dbType, this.dbDialect, this.fileTemplatePath).generate();
            new ToolingConfigurator_1.ToolingConfigurator(this.outputPath, this.fileTemplatePath, this.dbType).setupTooling();
            new DependencyInstaller_1.DependencyInstaller(this.outputPath, this.dbDialect).configure();
        }
        catch (error) {
            this.log.error("Gagal menjalankan generator: ");
            console.error(error.message);
            process.exit(1);
        }
    }
};
