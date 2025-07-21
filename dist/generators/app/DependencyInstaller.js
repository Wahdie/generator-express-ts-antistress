"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInstaller = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
class DependencyInstaller {
    constructor(outputPath, dbDialect) {
        this.outputPath = outputPath;
        this.dbDialect = dbDialect;
    }
    configure() {
        try {
            const result = (0, child_process_1.spawnSync)("npm", ["init", "-y"], {
                cwd: this.outputPath,
                stdio: "inherit",
                shell: true
            });
            const dependencies = [
                'express', 'dotenv', 'cors', 'body-parser', 'morgan', 'winston'
            ];
            const devDependencies = [
                'typescript', 'ts-node', '@types/node', '@types/express',
                'nodemon', 'eslint', 'prettier', '@types/morgan', '@eslint/js', 'globals', 'typescript-eslint', 'jest', 'ts-jest', '@types/jest', 'supertest', '@types/supertest'
            ];
            // Add ORM dependencies based on the selected database dialect
            if (this.dbDialect === 'mysql') {
                dependencies.push('mysql2', 'sequelize');
            }
            else if (this.dbDialect === 'postgres') {
                dependencies.push('pg', 'pg-hstore', 'sequelize');
            }
            else if (this.dbDialect === 'sqlite') {
                dependencies.push('sqlite3', 'sequelize');
            }
            else if (this.dbDialect === 'mongodb') {
                dependencies.push('mongoose');
            }
            this.installDependencies(dependencies, devDependencies);
            this.configurePackageJson();
        }
        catch (error) {
            console.error("Error configuring dependencies:", error.message);
            throw error;
        }
    }
    installDependencies(dependencies, devDependencies) {
        try {
            // Install dependencies
            const installResult = (0, child_process_1.spawnSync)("npm", ["install", ...dependencies], {
                cwd: this.outputPath,
                stdio: "inherit",
                shell: true
            });
            if (installResult.error) {
                throw installResult.error;
            }
            // Install devDependencies
            const devInstallResult = (0, child_process_1.spawnSync)("npm", ["install", "--save-dev", ...devDependencies], {
                cwd: this.outputPath,
                stdio: "inherit",
                shell: true
            });
            if (devInstallResult.error) {
                throw devInstallResult.error;
            }
        }
        catch (error) {
            console.error("Error installing dependencies:", error.message);
            throw error;
        }
    }
    configurePackageJson() {
        try {
            const packageJsonPath = path_1.default.join(this.outputPath, "package.json");
            const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
            packageJson.main = "src/app.ts";
            packageJson.types = "src/app.d.ts";
            packageJson.scripts = {
                start: 'node dist/server.js',
                dev: 'nodemon src/server.ts',
                build: 'tsc',
                lint: 'eslint "src/**/*.ts"',
                prettier: 'prettier --write "src/**/*.ts"',
                format: 'npm run prettier && npm run lint',
                test: "npx jest --detectOpenHandles"
            };
            fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log("package.json configured successfully.");
        }
        catch (error) {
            console.error("Error configuring package.json:", error.message);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
}
exports.DependencyInstaller = DependencyInstaller;
