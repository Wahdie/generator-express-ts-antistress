"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
// Anda perlu membuat file ini. Contohnya ada di bawah kode.
const projectSchema_1 = __importDefault(require("./utils/projectSchema"));
class SchemaValidator {
    constructor(schemaPath) {
        this.schemaPath = schemaPath;
    }
    getParsedSchema() {
        if (!this.parsedSchema) {
            throw new Error("Skema belum divalidasi atau di-parse. Panggil validate() terlebih dahulu.");
        }
        return this.parsedSchema;
    }
    validate() {
        try {
            const fullPath = path_1.default.resolve(this.schemaPath);
            if (!fs_1.default.existsSync(fullPath)) {
                throw new Error(`File skema tidak ditemukan: ${fullPath}`);
            }
            const rawSchemaData = fs_1.default.readFileSync(fullPath, 'utf-8');
            const jsonData = JSON.parse(rawSchemaData);
            // --- Validasi Struktur dengan AJV ---
            const ajv = new ajv_1.default({ allErrors: true, allowUnionTypes: true });
            const validate = ajv.compile(projectSchema_1.default);
            const valid = validate(jsonData);
            if (!valid) {
                console.error('❌ Validasi skema dasar gagal:');
                validate.errors?.forEach(err => {
                    console.error(`- Path: ${err.instancePath}, Pesan: ${err.message}`);
                });
                throw new Error('Struktur dasar skema JSON Anda tidak valid. Silakan periksa kembali.');
            }
            this.parsedSchema = jsonData;
            console.log('✅ Validasi struktur dasar skema berhasil.');
            // --- Validasi Logika Relasi (Custom) ---
            this.validateRelationsAndReferences();
            console.log('✅ Validasi logika relasi dan referensi berhasil.');
        }
        catch (error) {
            // Melempar kembali error untuk ditangani oleh pemanggil
            throw error;
        }
    }
    validateRelationsAndReferences() {
        const schema = this.getParsedSchema();
        if (!schema.models || !Array.isArray(schema.models)) {
            throw new Error("Skema tidak valid: 'models' harus ada dan berupa array.");
        }
        const modelNames = new Set(schema.models.map(model => model.name));
        const modelFieldMap = new Map();
        for (const model of schema.models) {
            modelFieldMap.set(model.name, new Set(Object.keys(model.fields)));
        }
        for (const model of schema.models) {
            const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
            if (!pascalCaseRegex.test(model.name)) {
                throw new Error(`Error: Nama model '${model.name}' harus dalam format PascalCase.`);
            }
            for (const [fieldName, field] of Object.entries(model.fields)) {
                if (field.references) {
                    const parts = field.references.split('.');
                    if (parts.length !== 2) {
                        throw new Error(`Error di model '${model.name}', field '${fieldName}': Format 'references' harus "Model.field", tetapi hanya ditulis "${field.references}".`);
                    }
                    const [referencedModelName, referencedFieldName] = parts;
                    if (!modelNames.has(referencedModelName)) {
                        throw new Error(`Error di model '${model.name}', field '${fieldName}': Model referensi '${referencedModelName}' tidak ditemukan dalam skema.`);
                    }
                    const referencedFields = modelFieldMap.get(referencedModelName);
                    if (!referencedFields || !referencedFields.has(referencedFieldName)) {
                        throw new Error(`Error di model '${model.name}', field '${fieldName}': Field referensi '${referencedFieldName}' tidak ditemukan di model '${referencedModelName}'.`);
                    }
                }
            }
            if (model.relations) {
                for (const [relName, rel] of Object.entries(model.relations)) {
                    if (!modelNames.has(rel.model)) {
                        throw new Error(`Error di model '${model.name}': Relasi '${relName}' merujuk ke model '${rel.model}' yang tidak terdefinisi.`);
                    }
                    if (rel.type === "manyToMany") {
                        if (!rel.through) {
                            throw new Error(`Error di model '${model.name}': Relasi many-to-many '${relName}' harus memiliki properti 'through'.`);
                        }
                        if (!modelNames.has(rel.through)) {
                            throw new Error(`Error di model '${model.name}': Properti 'through' pada relasi '${relName}' merujuk ke model pivot '${rel.through}' yang tidak terdefinisi.`);
                        }
                    }
                    // --- VALIDASI BARU: Memastikan foreign key ada untuk relasi belongsTo ---
                    if (rel.type === 'belongsTo') {
                        const expectedFkFieldName = `${relName}Id`; // e.g., 'user' relation expects 'userId' field
                        const fkField = model.fields[expectedFkFieldName];
                        if (!fkField) {
                            throw new Error(`Error di model '${model.name}': Relasi 'belongsTo' bernama '${relName}' tidak memiliki foreign key. Diharapkan ada field bernama '${expectedFkFieldName}'.`);
                        }
                        if (!fkField.foreignKey) {
                            throw new Error(`Error di model '${model.name}': Field '${expectedFkFieldName}' yang berhubungan dengan relasi '${relName}' harus memiliki properti "foreignKey": true.`);
                        }
                    }
                }
            }
        }
    }
}
exports.SchemaValidator = SchemaValidator;
