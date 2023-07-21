import { __values } from "tslib";
import { MetadataArgsStorage } from "../metadata-args/MetadataArgsStorage";
import { EntitySchemaEmbeddedError } from "./EntitySchemaEmbeddedError";
/**
 * Transforms entity schema into metadata args storage.
 * The result will be just like entities read from decorators.
 */
var EntitySchemaTransformer = /** @class */ (function () {
    function EntitySchemaTransformer() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Transforms entity schema into new metadata args storage object.
     */
    EntitySchemaTransformer.prototype.transform = function (schemas) {
        var _this = this;
        var metadataArgsStorage = new MetadataArgsStorage();
        schemas.forEach(function (entitySchema) {
            var options = entitySchema.options;
            // add table metadata args from the schema
            var tableMetadata = {
                target: options.target || options.name,
                name: options.tableName,
                database: options.database,
                schema: options.schema,
                type: options.type || "regular",
                orderBy: options.orderBy,
                synchronize: options.synchronize,
                withoutRowid: !!options.withoutRowid,
                expression: options.expression
            };
            metadataArgsStorage.tables.push(tableMetadata);
            _this.transformColumnsRecursive(options, metadataArgsStorage);
        });
        return metadataArgsStorage;
    };
    EntitySchemaTransformer.prototype.transformColumnsRecursive = function (options, metadataArgsStorage) {
        var _this = this;
        // add columns metadata args from the schema
        Object.keys(options.columns).forEach(function (columnName) {
            var column = options.columns[columnName];
            var regularColumn = column;
            var mode = "regular";
            if (regularColumn.createDate)
                mode = "createDate";
            if (regularColumn.updateDate)
                mode = "updateDate";
            if (regularColumn.deleteDate)
                mode = "deleteDate";
            if (regularColumn.version)
                mode = "version";
            if (regularColumn.treeChildrenCount)
                mode = "treeChildrenCount";
            if (regularColumn.treeLevel)
                mode = "treeLevel";
            if (regularColumn.objectId)
                mode = "objectId";
            var columnArgs = {
                target: options.target || options.name,
                mode: mode,
                propertyName: columnName,
                options: {
                    type: regularColumn.type,
                    name: regularColumn.objectId ? "_id" : regularColumn.name,
                    length: regularColumn.length,
                    width: regularColumn.width,
                    nullable: regularColumn.nullable,
                    readonly: regularColumn.readonly,
                    update: regularColumn.update,
                    select: regularColumn.select,
                    insert: regularColumn.insert,
                    primary: regularColumn.primary,
                    unique: regularColumn.unique,
                    comment: regularColumn.comment,
                    default: regularColumn.default,
                    onUpdate: regularColumn.onUpdate,
                    precision: regularColumn.precision,
                    scale: regularColumn.scale,
                    zerofill: regularColumn.zerofill,
                    unsigned: regularColumn.unsigned,
                    charset: regularColumn.charset,
                    collation: regularColumn.collation,
                    enum: regularColumn.enum,
                    asExpression: regularColumn.asExpression,
                    generatedType: regularColumn.generatedType,
                    hstoreType: regularColumn.hstoreType,
                    array: regularColumn.array,
                    transformer: regularColumn.transformer,
                    spatialFeatureType: regularColumn.spatialFeatureType,
                    srid: regularColumn.srid
                }
            };
            metadataArgsStorage.columns.push(columnArgs);
            if (regularColumn.generated) {
                var generationArgs = {
                    target: options.target || options.name,
                    propertyName: columnName,
                    strategy: typeof regularColumn.generated === "string" ? regularColumn.generated : "increment"
                };
                metadataArgsStorage.generations.push(generationArgs);
            }
            if (regularColumn.unique)
                metadataArgsStorage.uniques.push({
                    target: options.target || options.name,
                    columns: [columnName]
                });
        });
        // add relation metadata args from the schema
        if (options.relations) {
            Object.keys(options.relations).forEach(function (relationName) {
                var e_1, _a;
                var relationSchema = options.relations[relationName];
                var relation = {
                    target: options.target || options.name,
                    propertyName: relationName,
                    relationType: relationSchema.type,
                    isLazy: relationSchema.lazy || false,
                    type: relationSchema.target,
                    inverseSideProperty: relationSchema.inverseSide,
                    isTreeParent: relationSchema.treeParent,
                    isTreeChildren: relationSchema.treeChildren,
                    options: {
                        eager: relationSchema.eager || false,
                        cascade: relationSchema.cascade,
                        nullable: relationSchema.nullable,
                        onDelete: relationSchema.onDelete,
                        onUpdate: relationSchema.onUpdate,
                        deferrable: relationSchema.deferrable,
                        primary: relationSchema.primary,
                        createForeignKeyConstraints: relationSchema.createForeignKeyConstraints,
                        persistence: relationSchema.persistence,
                        orphanedRowAction: relationSchema.orphanedRowAction
                    }
                };
                metadataArgsStorage.relations.push(relation);
                // add join column
                if (relationSchema.joinColumn) {
                    if (typeof relationSchema.joinColumn === "boolean") {
                        var joinColumn = {
                            target: options.target || options.name,
                            propertyName: relationName
                        };
                        metadataArgsStorage.joinColumns.push(joinColumn);
                    }
                    else {
                        var joinColumnsOptions = Array.isArray(relationSchema.joinColumn) ? relationSchema.joinColumn : [relationSchema.joinColumn];
                        try {
                            for (var joinColumnsOptions_1 = __values(joinColumnsOptions), joinColumnsOptions_1_1 = joinColumnsOptions_1.next(); !joinColumnsOptions_1_1.done; joinColumnsOptions_1_1 = joinColumnsOptions_1.next()) {
                                var joinColumnOption = joinColumnsOptions_1_1.value;
                                var joinColumn = {
                                    target: options.target || options.name,
                                    propertyName: relationName,
                                    name: joinColumnOption.name,
                                    referencedColumnName: joinColumnOption.referencedColumnName
                                };
                                metadataArgsStorage.joinColumns.push(joinColumn);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (joinColumnsOptions_1_1 && !joinColumnsOptions_1_1.done && (_a = joinColumnsOptions_1.return)) _a.call(joinColumnsOptions_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                // add join table
                if (relationSchema.joinTable) {
                    if (typeof relationSchema.joinTable === "boolean") {
                        var joinTable = {
                            target: options.target || options.name,
                            propertyName: relationName
                        };
                        metadataArgsStorage.joinTables.push(joinTable);
                    }
                    else {
                        var joinTable = {
                            target: options.target || options.name,
                            propertyName: relationName,
                            name: relationSchema.joinTable.name,
                            database: relationSchema.joinTable.database,
                            schema: relationSchema.joinTable.schema,
                            joinColumns: (relationSchema.joinTable.joinColumn ? [relationSchema.joinTable.joinColumn] : relationSchema.joinTable.joinColumns),
                            inverseJoinColumns: (relationSchema.joinTable.inverseJoinColumn ? [relationSchema.joinTable.inverseJoinColumn] : relationSchema.joinTable.inverseJoinColumns),
                        };
                        metadataArgsStorage.joinTables.push(joinTable);
                    }
                }
            });
        }
        // add index metadata args from the schema
        if (options.indices) {
            options.indices.forEach(function (index) {
                var indexArgs = {
                    target: options.target || options.name,
                    name: index.name,
                    unique: index.unique === true ? true : false,
                    spatial: index.spatial === true ? true : false,
                    fulltext: index.fulltext === true ? true : false,
                    parser: index.parser,
                    synchronize: index.synchronize === false ? false : true,
                    where: index.where,
                    sparse: index.sparse,
                    columns: index.columns
                };
                metadataArgsStorage.indices.push(indexArgs);
            });
        }
        // add unique metadata args from the schema
        if (options.uniques) {
            options.uniques.forEach(function (unique) {
                var uniqueArgs = {
                    target: options.target || options.name,
                    name: unique.name,
                    columns: unique.columns,
                    deferrable: unique.deferrable,
                };
                metadataArgsStorage.uniques.push(uniqueArgs);
            });
        }
        // add check metadata args from the schema
        if (options.checks) {
            options.checks.forEach(function (check) {
                var checkArgs = {
                    target: options.target || options.name,
                    name: check.name,
                    expression: check.expression
                };
                metadataArgsStorage.checks.push(checkArgs);
            });
        }
        // add exclusion metadata args from the schema
        if (options.exclusions) {
            options.exclusions.forEach(function (exclusion) {
                var exclusionArgs = {
                    target: options.target || options.name,
                    name: exclusion.name,
                    expression: exclusion.expression
                };
                metadataArgsStorage.exclusions.push(exclusionArgs);
            });
        }
        if (options.embeddeds) {
            Object.keys(options.embeddeds).forEach(function (columnName) {
                var embeddedOptions = options.embeddeds[columnName];
                if (!embeddedOptions.schema)
                    throw EntitySchemaEmbeddedError.createEntitySchemaIsRequiredException(columnName);
                var embeddedSchema = embeddedOptions.schema.options;
                metadataArgsStorage.embeddeds.push({
                    target: options.target || options.name,
                    propertyName: columnName,
                    isArray: embeddedOptions.array === true,
                    prefix: embeddedOptions.prefix !== undefined ? embeddedOptions.prefix : undefined,
                    type: function () { return (embeddedSchema === null || embeddedSchema === void 0 ? void 0 : embeddedSchema.target) || embeddedSchema.name; },
                });
                _this.transformColumnsRecursive(embeddedSchema, metadataArgsStorage);
            });
        }
    };
    return EntitySchemaTransformer;
}());
export { EntitySchemaTransformer };

//# sourceMappingURL=EntitySchemaTransformer.js.map
