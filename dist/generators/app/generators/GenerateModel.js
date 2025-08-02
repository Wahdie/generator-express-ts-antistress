"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class ModelGenerator {
    constructor(outputPath, fileTemplatePath) {
        // Type mapping utils
        this.typeMappers = {
            mapFieldType: (field) => {
                if (!field || typeof field !== 'object')
                    throw new Error('Invalid field definition');
                if ((field.type === 'enum' || field.type === 'string') && Array.isArray(field.enum || field.value)) {
                    const values = field.enum || field.value;
                    return values.map((v) => `'${v}'`).join(' | ');
                }
                const mapping = {
                    integer: 'number', float: 'number', double: 'number', decimal: 'number',
                    bigint: 'bigint', smallint: 'number', mediumint: 'number', tinyint: 'number',
                    string: 'string', boolean: 'boolean', Date: 'Date', date: 'Date',
                    datetime: 'Date', timestamp: 'Date', time: 'string', uuid: 'string',
                    json: 'any', object: 'Record<string, any>', array: 'any[]', any: 'any',
                };
                return mapping[field.type] || 'any';
            },
            mapSequelizeType: (field) => {
                if ((field.type === 'enum' || field.type === 'string') && Array.isArray(field.enum || field.value)) {
                    const values = field.enum || field.value;
                    return `DataTypes.ENUM(${values.map((v) => `'${v}'`).join(', ')})`;
                }
                const mapping = {
                    integer: 'DataTypes.INTEGER', float: 'DataTypes.FLOAT', double: 'DataTypes.DOUBLE',
                    decimal: 'DataTypes.DECIMAL', bigint: 'DataTypes.BIGINT', smallint: 'DataTypes.SMALLINT',
                    mediumint: 'DataTypes.MEDIUMINT', tinyint: 'DataTypes.TINYINT', string: 'DataTypes.STRING',
                    char: 'DataTypes.CHAR', varchar: 'DataTypes.STRING', text: 'DataTypes.TEXT',
                    boolean: 'DataTypes.BOOLEAN', date: 'DataTypes.DATEONLY', datetime: 'DataTypes.DATE',
                    timestamp: 'DataTypes.DATE', time: 'DataTypes.TIME', uuid: 'DataTypes.UUID',
                    json: 'DataTypes.JSON', jsonb: 'DataTypes.JSONB', binary: 'DataTypes.BLOB',
                    blob: 'DataTypes.BLOB', enum: 'DataTypes.ENUM', object: 'DataTypes.JSON',
                    array: 'DataTypes.ARRAY(DataTypes.JSON)', any: 'DataTypes.JSON',
                };
                return mapping[field.type] || 'DataTypes.STRING';
            },
            mapMongooseType: (field) => {
                if ((field.type === 'enum' || field.type === 'string') && Array.isArray(field.enum || field.value)) {
                    const values = field.enum || field.value;
                    return `{ type: String, enum: [${values.map((v) => `'${v}'`).join(', ')}] }`;
                }
                const mapping = {
                    integer: 'Number', float: 'Number', double: 'Number', decimal: 'Number',
                    smallint: 'Number', mediumint: 'Number', tinyint: 'Number', string: 'String',
                    boolean: 'Boolean', Date: 'Date', date: 'Date', datetime: 'Date',
                    timestamp: 'Date', time: 'String', uuid: 'String', json: 'Schema.Types.Mixed',
                    object: 'Schema.Types.Mixed', array: 'Array', any: 'Schema.Types.Mixed',
                };
                return mapping[field.type] || 'Schema.Types.String';
            }
        };
        this.outputPath = outputPath;
        this.fileTemplatePath = fileTemplatePath;
    }
    // Entry point
    async generate(model, dbType) {
        if (dbType === 'sql') {
            return await this.generateSequelizeModel(model);
        }
        else if (dbType === 'nosql') {
            return await this.generateMongooseModel(model);
        }
        else {
            throw new Error('dbType must be either "sql" or "nosql"');
        }
    }
    // Sequelize generator
    async generateSequelizeModel(model) {
        try {
            const modelDir = path_1.default.join(this.outputPath, 'src/models');
            fs_1.default.mkdirSync(modelDir, { recursive: true });
            const fileTemplatePath = path_1.default.join(this.fileTemplatePath, 'model/sequelize/sequelize.ejs');
            if (!fs_1.default.existsSync(fileTemplatePath))
                throw new Error(`Sequelize template not found at ${fileTemplatePath}`);
            const content = await ejs_1.default.renderFile(fileTemplatePath, {
                model,
                ...this.typeMappers,
                dbType: 'sql'
            });
            const modelPath = path_1.default.join(modelDir, `${model.name}.ts`);
            fs_1.default.writeFileSync(modelPath, content.trim());
            console.log(chalk_1.default.green(`✅ Sequelize model created: ${modelPath}`));
            return { success: true, modelPath };
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ Sequelize model error:`, error.message));
            return { success: false, error: error.message, stack: error.stack };
        }
    }
    // Mongoose generator
    async generateMongooseModel(model) {
        try {
            const modelDir = path_1.default.join(this.outputPath, 'src/models');
            fs_1.default.mkdirSync(modelDir, { recursive: true });
            const fileTemplatePath = path_1.default.join(this.fileTemplatePath, 'model/mongoose/mongoose.ejs');
            if (!fs_1.default.existsSync(fileTemplatePath))
                throw new Error(`Mongoose template not found at ${fileTemplatePath}`);
            const content = await ejs_1.default.renderFile(fileTemplatePath, {
                model,
                ...this.typeMappers,
                dbType: 'nosql'
            });
            const modelPath = path_1.default.join(modelDir, `${model.name}.ts`);
            fs_1.default.writeFileSync(modelPath, content.trim());
            console.log(chalk_1.default.green(`✅ Mongoose model created: ${modelPath}`));
            return { success: true, modelPath };
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ Mongoose model error:`, error.message));
            return { success: false, error: error.message, stack: error.stack };
        }
    }
}
exports.ModelGenerator = ModelGenerator;
