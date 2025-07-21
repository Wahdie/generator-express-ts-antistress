"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigGenerator = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
class DatabaseConfigGenerator {
    constructor(outputPath, dbType, dbDialect, fileTemplatePath) {
        this.dbType = 'sql';
        this.dbDialect = 'mysql';
        this.outputPath = outputPath;
        this.dbType = dbType;
        this.dbDialect = dbDialect;
        this.fileTemplatePath = fileTemplatePath;
        this.database = {
            type: dbType,
            dialect: dbDialect,
            databaseName: '',
            username: '',
            password: '',
            host: '',
            port: 0
        };
    }
    async generate() {
        this.validateDatabaseType();
        this.setDefaultValues();
        const templatePath = path_1.default.join(this.fileTemplatePath, '/database', `${this.database.type}.ejs`);
        const envTemplatePath = path_1.default.join(this.fileTemplatePath, 'env.ejs');
        const configPath = path_1.default.join(this.outputPath, 'src/config/database.ts');
        const envPath = path_1.default.join(this.outputPath, '.env');
        const envConfig = this.getEnvConfig();
        try {
            const [rendered, renderedEnv] = await Promise.all([
                ejs_1.default.renderFile(templatePath),
                ejs_1.default.renderFile(envTemplatePath, { envConfig })
            ]);
            await promises_1.default.mkdir(path_1.default.dirname(configPath), { recursive: true });
            await Promise.all([
                promises_1.default.writeFile(configPath, rendered.trim()),
                promises_1.default.writeFile(envPath, renderedEnv.trim())
            ]);
            console.log(`✅ Database config generated: ${configPath}`);
            console.log(`✅ .env file generated: ${envPath}`);
        }
        catch (error) {
            throw new Error(`Failed to generate config: ${error.message}`);
        }
    }
    validateDatabaseType() {
        if (!['sql', 'nosql'].includes(this.database.type)) {
            throw new Error(`Unsupported database type: ${this.database.type}`);
        }
    }
    setDefaultValues() {
        this.database.databaseName = 'my_database';
        this.database.username = this.database.dialect === 'postgres' ? 'postgres' : 'root';
        this.database.password = '';
        this.database.host = 'localhost';
        this.database.type = this.dbType;
        this.database.dialect = this.dbDialect;
        switch (this.database.dialect) {
            case 'postgres':
                this.database.port = 5432;
                break;
            case 'mysql':
            case 'sqlite':
                this.database.port = 3306;
                break;
            case 'mongodb':
                this.database.port = 27017;
                break;
            default:
                throw new Error(`Unsupported dialect: ${this.database.dialect}`);
        }
    }
    getEnvConfig() {
        return {
            DB_TYPE: this.database.type,
            DB_NAME: this.database.databaseName,
            DB_USERNAME: this.database.username,
            DB_PASSWORD: this.database.password,
            DB_HOST: this.database.host,
            DB_PORT: this.database.port,
            DB_DIALECT: this.database.dialect,
        };
    }
}
exports.DatabaseConfigGenerator = DatabaseConfigGenerator;
