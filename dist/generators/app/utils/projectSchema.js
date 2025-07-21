"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fieldSchema = {
    type: 'object',
    properties: {
        type: { type: 'string', enum: [
                "string", "text", "integer", "float", "double", "decimal", "bigint", "boolean",
                "date", "datetime", "timestamp", "time", "uuid", "varchar", "char", "smallint",
                "mediumint", "tinyint", "json", "jsonb", "object", "array", "blob", "binary",
                "enum"
            ]
        },
        primaryKey: { type: 'boolean', nullable: true },
        autoIncrement: { type: 'boolean', nullable: true },
        required: { type: 'boolean', nullable: true },
        unique: { type: 'boolean', nullable: true },
        default: { nullable: true, type: ['string', 'number', 'boolean'] },
        enum: { type: 'array', items: { type: 'string' }, nullable: true },
        foreignKey: { type: 'boolean', nullable: true },
        references: { type: 'string', nullable: true },
        onDelete: { type: 'string', nullable: true },
        onUpdate: { type: 'string', nullable: true },
    },
    required: ['type'],
};
const relationSchema = {
    type: 'object',
    properties: {
        type: { type: 'string', enum: ["hasMany", "hasOne", "belongsTo", "manyToMany"] },
        model: { type: 'string' },
        through: { type: 'string', nullable: true },
        cascadeDelete: { type: 'boolean', nullable: true },
    },
    required: ['type', 'model'],
};
const modelSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        fields: {
            type: 'object',
            patternProperties: {
                '^[a-zA-Z0-9_]+$': fieldSchema,
            },
            required: [],
        },
        relations: {
            type: 'object',
            nullable: true,
            patternProperties: {
                '^[a-zA-Z0-9_]+$': relationSchema,
            },
            required: [],
        }
    },
    required: ['name', 'fields'],
};
const projectSchema = {
    type: 'object',
    properties: {
        models: {
            type: 'array',
            items: modelSchema,
        },
    },
    required: ['models'],
};
exports.default = projectSchema;
