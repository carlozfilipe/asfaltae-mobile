import { __awaiter, __generator, __read, __spreadArray } from "tslib";
import { importClassesFromDirectories } from "../util/DirectoryExportedClassesLoader";
import { OrmUtils } from "../util/OrmUtils";
import { getFromContainer } from "../container";
import { getMetadataArgsStorage } from "../globals";
import { EntityMetadataBuilder } from "../metadata-builder/EntityMetadataBuilder";
import { EntitySchemaTransformer } from "../entity-schema/EntitySchemaTransformer";
import { EntitySchema } from "../entity-schema/EntitySchema";
/**
 * Builds migration instances, subscriber instances and entity metadatas for the given classes.
 */
var ConnectionMetadataBuilder = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ConnectionMetadataBuilder(connection) {
        this.connection = connection;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds migration instances for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildMigrations = function (migrations) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, migrationClasses, migrationDirectories, allMigrationClasses, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = __read(OrmUtils.splitClassesAndStrings(migrations), 2), migrationClasses = _a[0], migrationDirectories = _a[1];
                        _b = [__spreadArray([], __read(migrationClasses), false)];
                        return [4 /*yield*/, importClassesFromDirectories(this.connection.logger, migrationDirectories)];
                    case 1:
                        allMigrationClasses = __spreadArray.apply(void 0, _b.concat([__read.apply(void 0, [(_c.sent())]), false]));
                        return [2 /*return*/, allMigrationClasses.map(function (migrationClass) { return getFromContainer(migrationClass); })];
                }
            });
        });
    };
    /**
     * Builds subscriber instances for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildSubscribers = function (subscribers) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, subscriberClasses, subscriberDirectories, allSubscriberClasses, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = __read(OrmUtils.splitClassesAndStrings(subscribers || []), 2), subscriberClasses = _a[0], subscriberDirectories = _a[1];
                        _b = [__spreadArray([], __read(subscriberClasses), false)];
                        return [4 /*yield*/, importClassesFromDirectories(this.connection.logger, subscriberDirectories)];
                    case 1:
                        allSubscriberClasses = __spreadArray.apply(void 0, _b.concat([__read.apply(void 0, [(_c.sent())]), false]));
                        return [2 /*return*/, getMetadataArgsStorage()
                                .filterSubscribers(allSubscriberClasses)
                                .map(function (metadata) { return getFromContainer(metadata.target); })];
                }
            });
        });
    };
    /**
     * Builds entity metadatas for the given classes or directories.
     */
    ConnectionMetadataBuilder.prototype.buildEntityMetadatas = function (entities) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, entityClassesOrSchemas, entityDirectories, entityClasses, entitySchemas, allEntityClasses, _b, decoratorEntityMetadatas, metadataArgsStorageFromSchema, schemaEntityMetadatas;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = __read(OrmUtils.splitClassesAndStrings(entities || []), 2), entityClassesOrSchemas = _a[0], entityDirectories = _a[1];
                        entityClasses = entityClassesOrSchemas.filter(function (entityClass) { return (entityClass instanceof EntitySchema) === false; });
                        entitySchemas = entityClassesOrSchemas.filter(function (entityClass) { return entityClass instanceof EntitySchema; });
                        _b = [__spreadArray([], __read(entityClasses), false)];
                        return [4 /*yield*/, importClassesFromDirectories(this.connection.logger, entityDirectories)];
                    case 1:
                        allEntityClasses = __spreadArray.apply(void 0, _b.concat([__read.apply(void 0, [(_c.sent())]), false]));
                        allEntityClasses.forEach(function (entityClass) {
                            if (entityClass instanceof EntitySchema) {
                                entitySchemas.push(entityClass);
                            }
                        });
                        decoratorEntityMetadatas = new EntityMetadataBuilder(this.connection, getMetadataArgsStorage()).build(allEntityClasses);
                        metadataArgsStorageFromSchema = new EntitySchemaTransformer().transform(entitySchemas);
                        schemaEntityMetadatas = new EntityMetadataBuilder(this.connection, metadataArgsStorageFromSchema).build();
                        return [2 /*return*/, __spreadArray(__spreadArray([], __read(decoratorEntityMetadatas), false), __read(schemaEntityMetadatas), false)];
                }
            });
        });
    };
    return ConnectionMetadataBuilder;
}());
export { ConnectionMetadataBuilder };

//# sourceMappingURL=ConnectionMetadataBuilder.js.map
