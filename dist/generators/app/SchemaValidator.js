"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const projectSchema_1 = __importDefault(require("./utils/projectSchema"));
const chalk_1 = __importDefault(require("chalk"));
class SchemaValidator {
    constructor(schemaPath) {
        this.schemaPath = schemaPath;
    }
    getParsedSchema() {
        if (!this.parsedSchema) {
            throw new Error(chalk_1.default.red.bold("Skema belum divalidasi atau di-parse. Panggil validate() terlebih dahulu."));
        }
        return this.parsedSchema;
    }
    validate() {
        try {
            const fullPath = path_1.default.resolve(this.schemaPath);
            if (!fs_1.default.existsSync(fullPath)) {
                throw new Error(chalk_1.default.red.bold(`File skema tidak ditemukan: ${fullPath}`));
            }
            const rawSchemaData = fs_1.default.readFileSync(fullPath, 'utf-8');
            const jsonData = JSON.parse(rawSchemaData);
            // --- Validasi Struktur dengan AJV ---
            const ajv = new ajv_1.default({ allErrors: true, allowUnionTypes: true });
            const validate = ajv.compile(projectSchema_1.default);
            const valid = validate(jsonData);
            if (!valid) {
                console.error(chalk_1.default.red.bold('❌ Basic schema validation failed:'));
                validate.errors?.forEach(err => {
                    console.error(chalk_1.default.yellow(`- Path: ${err.instancePath}, Message: ${err.message}`));
                });
                throw new Error(chalk_1.default.red.bold('The structure of your JSON schema is invalid. Please check again.'));
            }
            this.parsedSchema = jsonData;
            console.log(chalk_1.default.green('✅ Basic schema structure validation successful.'));
            // --- Validasi Logika Relasi (Custom) ---
            this.validateRelationsAndReferences();
            console.log(chalk_1.default.green('✅ Relational logic and references validation successful.'));
        }
        catch (error) {
            throw error;
        }
    }
    validateRelationsAndReferences() {
        const schema = this.getParsedSchema();
        if (!schema.models || !Array.isArray(schema.models)) {
            throw new Error(chalk_1.default.red.bold("Invalid schema: 'models' must exist and be an array."));
        }
        const modelNames = new Set(schema.models.map(model => model.name));
        const modelFieldMap = new Map();
        for (const model of schema.models) {
            modelFieldMap.set(model.name, new Set(Object.keys(model.fields)));
        }
        for (const model of schema.models) {
            const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
            if (!pascalCaseRegex.test(model.name)) {
                throw new Error(chalk_1.default.red.bold(`Error: The model name '${model.name}' must be in PascalCase format.`));
            }
            for (const [fieldName, field] of Object.entries(model.fields)) {
                if (field.references) {
                    const parts = field.references.split('.');
                    if (parts.length !== 2) {
                        throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}', field '${fieldName}': The format 'references' must be 'ModelName.fieldPrimaryKey', but it is only written as '${field.references}'.`));
                    }
                    const [referencedModelName, referencedFieldName] = parts;
                    if (!modelNames.has(referencedModelName)) {
                        throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}', field '${fieldName}': Reference model '${referencedModelName}' not found in the schema.`));
                    }
                    const referencedFields = modelFieldMap.get(referencedModelName);
                    if (!referencedFields || !referencedFields.has(referencedFieldName)) {
                        throw new Error(chalk_1.default.red.bold(`Error in the model '${model.name}', field '${fieldName}': Reference field '${referencedFieldName}' not found in model '${referencedModelName}'.`));
                    }
                }
            }
            if (model.relations) {
                for (const [relName, rel] of Object.entries(model.relations)) {
                    if (!modelNames.has(rel.model)) {
                        throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}': Relation '${relName}' refers to an undefined model '${rel.model}'.`));
                    }
                    if (rel.type === "manyToMany") {
                        if (!rel.through) {
                            throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}': The many-to-many relationship '${relName}' must have a 'through' property.`));
                        }
                        if (!modelNames.has(rel.through)) {
                            throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}': The 'through' property on the relationship '${relName}' refers to the undefined pivot model '${rel.through}'.`));
                        }
                    }
                    if (rel.type === 'belongsTo') {
                        const targetModel = rel.model;
                        let foreignKeyFieldFound = null;
                        for (const [fieldName, fieldDef] of Object.entries(model.fields)) {
                            if (fieldDef &&
                                fieldDef.foreignKey &&
                                typeof fieldDef.references === 'string' &&
                                fieldDef.references.toLowerCase().startsWith(targetModel.toLowerCase())) {
                                foreignKeyFieldFound = fieldName;
                                break;
                            }
                        }
                        if (!foreignKeyFieldFound) {
                            throw new Error(chalk_1.default.red.bold(`Error in model '${model.name}': The 'belongsTo' relation named '${relName}' points to '${rel.model}', but a corresponding field with 'foreignKey: true' and a valid 'references' property was not found.`));
                        }
                    }
                }
            }
        }
    }
}
exports.SchemaValidator = SchemaValidator;
