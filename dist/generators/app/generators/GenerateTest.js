"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const chalk_1 = __importDefault(require("chalk"));
class TestGenerator {
    constructor(outputPath, models, dbType, fileTemplatePath) {
        this.outputPath = outputPath;
        this.models = models;
        this.dbType = dbType;
        this.fileTemplatePath = fileTemplatePath;
        // Generate payload create
        this.generateExamplePayload = (fields, models, depth = 0, maxDepth = 2) => {
            const result = {};
            fields.forEach((f) => {
                if (f.name === "id" || f.name === "_id") {
                    return;
                }
                if (f.foreignKey && f.references && depth < maxDepth) {
                    const [refModel] = f.references.split(".");
                    const foreignModel = models.find((m) => m.name === refModel);
                    if (foreignModel) {
                        const foreignFields = this.objectToFieldArray(foreignModel.fields || {});
                        const minimalPayload = this.generateExamplePayload(foreignFields, models, depth + 1, maxDepth);
                        result[f.name] = {
                            __foreignModel: refModel,
                            __foreignKeyName: f.name,
                            __foreignPayload: minimalPayload,
                        };
                    }
                    else {
                        result[f.name] = null;
                    }
                }
                else {
                    result[f.name] = this.getMockValue(f, false);
                }
            });
            return result;
        };
    }
    generate() {
        try {
            if (!['sql', 'nosql'].includes(this.dbType)) {
                throw new Error('dbType must be either "sql" or "nosql"');
            }
            const templatePath = path_1.default.resolve(this.fileTemplatePath, "test", this.dbType === 'sql' ? "sequelize/controller.sequelize.ejs" : "mongoose/controller.mongoose.ejs");
            if (this.dbType === 'nosql') {
                const setupTemplatePath = path_1.default.resolve(this.fileTemplatePath, "test", "mongoose/setup.mongoose.ejs");
                const setupOutputPath = path_1.default.join(this.outputPath, "test", "setup.ts");
                const setupContent = ejs_1.default.render(fs_1.default.readFileSync(setupTemplatePath, "utf-8"));
                fs_1.default.writeFileSync(setupOutputPath, setupContent);
            }
            const factoryTemplatePath = path_1.default.resolve(this.fileTemplatePath, "test", "testFactory.ejs");
            const testDir = path_1.default.join(this.outputPath, "test", "controllers");
            const helpersDir = path_1.default.join(this.outputPath, "test", "helpers");
            const factoryOutputPath = path_1.default.join(helpersDir, "testFactory.ts");
            // Buat direktori test/controllers jika belum ada
            if (!fs_1.default.existsSync(testDir)) {
                fs_1.default.mkdirSync(testDir, { recursive: true });
            }
            // Buat direktori test/helpers jika belum ada
            if (!fs_1.default.existsSync(helpersDir)) {
                fs_1.default.mkdirSync(helpersDir, { recursive: true });
            }
            const sortedModels = this.sortModelsByDependency(this.models);
            // Generate testFactory.ts
            const factoryContent = ejs_1.default.render(fs_1.default.readFileSync(factoryTemplatePath, "utf-8"), {
                models: sortedModels,
                toQuotedExpressionLiteral: this.toQuotedExpressionLiteral,
                toExpressionLiteral: this.toExpressionLiteral,
                objectToFieldArray: this.objectToFieldArray,
                generateExamplePayload: this.generateExamplePayload,
                toJsLiteral: this.toJsLiteral,
                toCamelCase: this.toCamelCase
            });
            fs_1.default.writeFileSync(factoryOutputPath, factoryContent);
            // Generate setiap file controller test
            sortedModels.forEach((model) => {
                const modelName = model.name;
                const filePath = path_1.default.join(testDir, `${modelName}.test.ts`);
                const fieldArray = this.objectToFieldArray(model.fields);
                const examplePayload = this.generateExamplePayload(fieldArray, sortedModels);
                const exampleUpdatePayload = this.generateExampleUpdatePayload(fieldArray, sortedModels);
                const foreignKeys = Object.entries(examplePayload)
                    .filter(([, val]) => typeof val === "object" && val.__foreignModel)
                    .map(([key, val]) => ({
                    name: val.__foreignKeyName,
                    model: val.__foreignModel,
                    payload: val.__foreignPayload,
                }));
                const foreignKeyNames = Object.entries(examplePayload)
                    .filter(([, val]) => typeof val === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(val))
                    .map(([key]) => key);
                const finalExamplePayload = Object.fromEntries(Object.entries(examplePayload).map(([key, val]) => typeof val === "object" && val.__foreignModel
                    ? [key, val.__foreignKeyName]
                    : [key, val]));
                const finalExampleUpdatePayload = Object.fromEntries(Object.entries(exampleUpdatePayload).map(([key, val]) => {
                    const fk = foreignKeys.find((f) => f.name === key);
                    return fk ? [key, fk.name] : [key, val];
                }));
                const rendered = ejs_1.default.render(fs_1.default.readFileSync(templatePath, "utf-8"), {
                    modelName,
                    examplePayload,
                    finalExamplePayload,
                    exampleUpdatePayload,
                    finalExampleUpdatePayload,
                    foreignKeys,
                    foreignKeyNames,
                    toQuotedExpressionLiteral: this.toQuotedExpressionLiteral,
                    toJsLiteralWithForeignKeys: this.toJsLiteralWithForeignKeys,
                    toJsLiteral: this.toJsLiteral,
                    toCamelCase: this.toCamelCase
                });
                fs_1.default.writeFileSync(filePath, rendered);
                console.log(chalk_1.default.green("✅ Test file created successfully:", filePath));
            });
        }
        catch (error) {
            console.error(chalk_1.default.red("Error generating tests:", error.message));
            throw error;
        }
    }
    // Topological sort untuk urutan model berdasarkan foreign key
    sortModelsByDependency(models) {
        const graph = new Map();
        models.forEach((m) => {
            const deps = new Set();
            for (const f of Object.values(m.fields)) {
                if (f.foreignKey && f.references) {
                    const [refModel] = f.references.split(".");
                    deps.add(refModel);
                }
            }
            graph.set(m.name, deps);
        });
        const sorted = [];
        const visited = new Set();
        function visit(modelName) {
            if (visited.has(modelName))
                return;
            visited.add(modelName);
            const deps = graph.get(modelName) || new Set();
            deps.forEach((dep) => visit(dep));
            sorted.push(modelName);
        }
        models.forEach((m) => visit(m.name));
        return sorted.map((name) => models.find((m) => m.name === name));
    }
    // Konversi fields object ke array
    objectToFieldArray(fieldsObj) {
        return Object.entries(fieldsObj).map(([name, field]) => ({
            name,
            ...field,
        }));
    }
    // Generate payload update
    generateExampleUpdatePayload(fields, models) {
        const result = {};
        fields.forEach((f) => {
            if (f.foreignKey && f.references) {
                const [refModel] = f.references.split(".");
                const foreignModel = models.find((m) => m.name === refModel);
                const foreignFields = this.objectToFieldArray(foreignModel?.fields || {});
                const minimalPayload = {};
                foreignFields.forEach((ff) => {
                    if (ff.name !== "id" && !ff.foreignKey) {
                        minimalPayload[ff.name] = this.getMockValue(ff);
                    }
                });
                result[f.name] = {
                    __foreignModel: refModel,
                    __foreignKeyName: f.name,
                    __foreignPayload: minimalPayload,
                };
            }
            else if (f.name !== "id" && f.name !== "_id") {
                result[f.name] = this.getMockValue(f, true);
            }
            else {
                return;
            }
        });
        return result;
    }
    generateRandomString(length = 6) {
        return Math.random().toString(36).substring(2, 2 + length);
    }
    generateRandomInteger(min = 1, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    generateRandomDecimal(min = 1, max = 100, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    }
    // Nilai mock sesuai tipe
    getMockValue(field, isUpdate = false) {
        const random = Math.floor(Math.random() * 100000);
        if (typeof field === "object" && field !== null) {
            if (Array.isArray(field.enum)) {
                return `faker.helpers.arrayElement(${JSON.stringify(field.enum)})`;
            }
            if (!isUpdate && field.default !== undefined) {
                return JSON.stringify(field.default);
            }
            field = field.type;
        }
        switch (field) {
            case "string":
            case "varchar":
            case "char":
                return isUpdate
                    ? `\`updated_\${faker.lorem.word()}_${random}\``
                    : `faker.lorem.words(2)`;
            case "text":
                return isUpdate
                    ? `\`updated_text_\${faker.lorem.sentence()}\``
                    : `faker.lorem.paragraph()`;
            case "number":
            case "int":
            case "integer":
            case "smallint":
            case "mediumint":
            case "tinyint":
                return `faker.number.int({ min: 1, max: 100 })`;
            case "float":
            case "double":
            case "decimal":
                return `faker.number.float({ min: 10, max: 100, fractionDigits: 3 })`;
            case "bigint":
                return `faker.number.int({ min: 1000000000, max: 9999999999 })`;
            case "boolean":
                return `faker.datatype.boolean()`;
            case "date":
            case "datetime":
            case "timestamp":
                return `faker.date.recent().toISOString()`;
            case "uuid":
                return `faker.string.uuid()`;
            case "json":
            case "object":
                return isUpdate
                    ? `{ key: "updated_value" }`
                    : `{ key: "test_value" }`;
            case "array":
                return `[faker.number.int(), faker.number.int()]`;
            case "blob":
            case "binary":
                return `Buffer.from("${isUpdate ? "updated_binary" : "test_binary"}")`;
            default:
                return isUpdate
                    ? `\`updated_value_\${faker.string.alpha(5)}\``
                    : `\`default_\${faker.string.alpha(5)}\``;
        }
    }
    // private getMockValue(field: any, isUpdate = false): any {
    //   const random = Math.floor(Math.random() * 100000);
    //   if (typeof field === "object" && field !== null) {
    //     if (Array.isArray(field.enum)) {
    //       return faker.helpers.arrayElement(field.enum);
    //     }
    //     if (!isUpdate && field.default !== undefined) {
    //       return field.default;
    //     }
    //     // Gunakan field.type untuk switch
    //     field = field.type;
    //   }
    //   switch (field) {
    //     // String types
    //     case "string":
    //     case "varchar":
    //     case "char":
    //       return isUpdate
    //         ? `updated_${faker.lorem.word()}_${random}`
    //         : faker.lorem.words(2);
    //     case "text":
    //       return isUpdate
    //         ? `updated_text_${faker.lorem.sentence()}`
    //         : faker.lorem.paragraph();
    //     // Numeric types
    //     case "number":
    //     case "int":
    //     case "integer":
    //     case "smallint":
    //     case "mediumint":
    //     case "tinyint":
    //       return faker.number.int({ min: 1, max: 100 });
    //     case "float":
    //     case "double":
    //     case "decimal":
    //       return faker.number.float({ min: 10, max: 100, fractionDigits: 3 });
    //     case "bigint":
    //       return faker.number.int({ min: 1000000000, max: 9999999999 });
    //     // Boolean
    //     case "boolean":
    //       return faker.datatype.boolean();
    //     // Date and time
    //     case "date":
    //     case "datetime":
    //     case "timestamp":
    //       return faker.date.recent().toISOString();
    //     // UUID
    //     case "uuid":
    //       return faker.string.uuid();
    //     // JSON/Object
    //     case "json":
    //     case "object":
    //       return { key: isUpdate ? "updated_value" : "test_value" };
    //     // Arrays (basic numeric array)
    //     case "array":
    //       return [faker.number.int(), faker.number.int()];
    //     // Binary/blob
    //     case "blob":
    //     case "binary":
    //       return Buffer.from(isUpdate ? "updated_binary" : "test_binary");
    //     default:
    //       return isUpdate
    //         ? `updated_value_${faker.string.alpha(5)}`
    //         : `default_${faker.string.alpha(5)}`;
    //   }
    // }
    // private getMockValue(field: any, isUpdate = false): any {
    //   if (typeof field === "object" && field !== null) {
    //     if (Array.isArray(field.enum)) {
    //       return field.enum[Math.floor(Math.random() * field.enum.length)];
    //     }
    //     if (!isUpdate && field.default !== undefined) {
    //       return field.default;
    //     }
    //     field = field.type; // Extract actual type
    //   }
    //   switch (field) {
    //     case "string":
    //     case "varchar":
    //     case "char":
    //       return isUpdate ? `updated_${this.generateRandomString()}` : "`test_${random}`";
    //     case "text":
    //       return isUpdate ? `updated_text_${this.generateRandomString()}` : "`test_text_${random}`";
    //     // Numeric types
    //     case "number":
    //     case "int":
    //     case "integer":
    //     case "smallint":
    //     case "mediumint":
    //     case "tinyint":
    //       return this.generateRandomInteger(1, 100);
    //     case "float":
    //     case "double":
    //     case "decimal":
    //       return this.generateRandomDecimal(1, 100, 2);
    //     case "bigint":
    //       return Number(this.generateRandomInteger(1000000000, 9999999999));
    //     case "boolean":
    //       return Math.random() > 0.5;
    //     case "date":
    //     case "datetime":
    //     case "timestamp":
    //       return new Date().toISOString();
    //     case "uuid":
    //       return isUpdate
    //         ? "550e8400-e29b-41d4-a716-446655440001"
    //         : "550e8400-e29b-41d4-a716-446655440000";
    //     case "json":
    //     case "object":
    //       return { key: isUpdate ? "updated_value" : "test_value" };
    //     case "array":
    //       return [this.generateRandomInteger(), this.generateRandomInteger()];
    //     case "blob":
    //     case "binary":
    //       return Buffer.from(isUpdate ? "updated" : "test");
    //     default:
    //       return isUpdate ? `updated_value_${this.generateRandomString()}` : `default_${this.generateRandomString()}`;
    //   }
    // }
    // private toQuotedExpressionLiteral(obj: Record<string, any>, indent = 2): string {
    //   const indentStr = " ".repeat(indent);
    //   const entries = Object.entries(obj).map(([key, value]) => {
    //     const isJsExpression =
    //       typeof value === "string" && /^faker\.|^Buffer\.|^new |^\[|\{/.test(value);
    //     const renderedValue = isJsExpression ? value : JSON.stringify(value);
    //     return `${indentStr}"${key}": ${renderedValue}`;
    //   });
    //   return `{\n${entries.join(",\n")}\n}`;
    // }
    toQuotedExpressionLiteral(obj, indent = 2) {
        const indentStr = " ".repeat(indent);
        const renderValue = (value) => {
            if (typeof value === "object" &&
                value !== null &&
                "__foreignModel" in value &&
                "__foreignKeyName" in value) {
                // Foreign key case → return key as variable
                return value.__foreignKeyName;
            }
            if (typeof value === "object" && value !== null) {
                return this.toQuotedExpressionLiteral(value, indent + 2); // recursion
            }
            const isJsExpression = typeof value === "string" &&
                (/^faker\.|^Buffer\.|^new |^\[|\{/.test(value));
            return isJsExpression ? value : JSON.stringify(value);
        };
        const entries = Object.entries(obj).map(([key, value]) => {
            return `${indentStr}"${key}": ${renderValue(value)}`;
        });
        return `{\n${entries.join(",\n")}\n${" ".repeat(indent - 2)}}`;
    }
    toExpressionLiteral(obj, indent = 2) {
        const indentStr = " ".repeat(indent);
        const entries = Object.entries(obj).map(([key, value]) => {
            // Jika value string dan terlihat seperti ekspresi (misal: "faker.string.uuid()"), jangan beri quote
            const isJsExpression = typeof value === "string" && /^faker\.|^Buffer\.|^new |^\[|\{/.test(value);
            const renderedValue = isJsExpression ? value : JSON.stringify(value);
            return `${indentStr}${key}: ${renderedValue}`;
        });
        return `{\n${entries.join(",\n")}\n}`;
    }
    toJsLiteralWithForeignKeys(obj, foreignKeys) {
        return ("{\n" +
            Object.entries(obj)
                .map(([key, val]) => {
                if (foreignKeys.includes(key)) {
                    // Ini foreign key → pakai nama variabel
                    return `  "${key}": ${key},`;
                }
                else {
                    // Ini data biasa → stringify
                    return `  "${key}": ${JSON.stringify(val)},`;
                }
            })
                .join("\n") +
            "\n}");
    }
    toJsLiteral(obj, declarations = [], depth = 0) {
        const indent = "  ".repeat(depth + 1);
        const current = [];
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === "object" &&
                val?.__foreignKeyName &&
                val?.__foreignPayload) {
                const varName = val.__foreignKeyName;
                // Buat isi dari foreignPayload secara rekursif
                const nestedDecls = [];
                const literal = this.toJsLiteral(val.__foreignPayload, nestedDecls, depth + 1);
                // Simpan deklarasi variabel untuk foreignPayload
                declarations.push(`const ${varName} = ${literal};`);
                // Masukkan key utama dengan literal JS
                current.push(`${indent}"${key}": ${varName},`);
            }
            else {
                current.push(`${indent}"${key}": ${JSON.stringify(val)},`);
            }
        }
        return `{\n${current.join("\n")}\n${"  ".repeat(depth)}}`;
    }
    toCamelCase(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
exports.TestGenerator = TestGenerator;
