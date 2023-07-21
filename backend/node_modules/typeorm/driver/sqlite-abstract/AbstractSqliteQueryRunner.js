"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSqliteQueryRunner = void 0;
var tslib_1 = require("tslib");
var TransactionNotStartedError_1 = require("../../error/TransactionNotStartedError");
var TableColumn_1 = require("../../schema-builder/table/TableColumn");
var ColumnMetadata_1 = require("../../metadata/ColumnMetadata");
var Table_1 = require("../../schema-builder/table/Table");
var TableIndex_1 = require("../../schema-builder/table/TableIndex");
var TableForeignKey_1 = require("../../schema-builder/table/TableForeignKey");
var View_1 = require("../../schema-builder/view/View");
var Query_1 = require("../Query");
var TableUnique_1 = require("../../schema-builder/table/TableUnique");
var BaseQueryRunner_1 = require("../../query-runner/BaseQueryRunner");
var OrmUtils_1 = require("../../util/OrmUtils");
var TableCheck_1 = require("../../schema-builder/table/TableCheck");
var error_1 = require("../../error");
var MetadataTableType_1 = require("../types/MetadataTableType");
/**
 * Runs queries on a single sqlite database connection.
 */
var AbstractSqliteQueryRunner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AbstractSqliteQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function AbstractSqliteQueryRunner() {
        var _this = _super.call(this) || this;
        _this.transactionPromise = null;
        return _this;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    AbstractSqliteQueryRunner.prototype.connect = function () {
        return Promise.resolve(this.driver.databaseConnection);
    };
    /**
     * Releases used database connection.
     * We just clear loaded tables and sql in memory, because sqlite do not support multiple connections thus query runners.
     */
    AbstractSqliteQueryRunner.prototype.release = function () {
        this.loadedTables = [];
        this.clearSqlMemory();
        return Promise.resolve();
    };
    /**
     * Starts transaction.
     */
    AbstractSqliteQueryRunner.prototype.startTransaction = function (isolationLevel) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.driver.transactionSupport === "none")
                            throw new error_1.TypeORMError("Transactions aren't supported by ".concat(this.connection.driver.options.type, "."));
                        if (this.isTransactionActive && this.driver.transactionSupport === "simple")
                            throw new error_1.TransactionAlreadyStartedError();
                        if (isolationLevel && isolationLevel !== "READ UNCOMMITTED" && isolationLevel !== "SERIALIZABLE")
                            throw new error_1.TypeORMError("SQLite only supports SERIALIZABLE and READ UNCOMMITTED isolation");
                        this.isTransactionActive = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.broadcaster.broadcast('BeforeTransactionStart')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.isTransactionActive = false;
                        throw err_1;
                    case 4:
                        if (!(this.transactionDepth === 0)) return [3 /*break*/, 10];
                        if (!isolationLevel) return [3 /*break*/, 8];
                        if (!(isolationLevel === "READ UNCOMMITTED")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.query("PRAGMA read_uncommitted = true")];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.query("PRAGMA read_uncommitted = false")];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.query("BEGIN TRANSACTION")];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.query("SAVEPOINT typeorm_".concat(this.transactionDepth))];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        this.transactionDepth += 1;
                        return [4 /*yield*/, this.broadcaster.broadcast('AfterTransactionStart')];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    AbstractSqliteQueryRunner.prototype.commitTransaction = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isTransactionActive)
                            throw new TransactionNotStartedError_1.TransactionNotStartedError();
                        return [4 /*yield*/, this.broadcaster.broadcast('BeforeTransactionCommit')];
                    case 1:
                        _a.sent();
                        if (!(this.transactionDepth > 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.query("RELEASE SAVEPOINT typeorm_".concat(this.transactionDepth - 1))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.query("COMMIT")];
                    case 4:
                        _a.sent();
                        this.isTransactionActive = false;
                        _a.label = 5;
                    case 5:
                        this.transactionDepth -= 1;
                        return [4 /*yield*/, this.broadcaster.broadcast('AfterTransactionCommit')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    AbstractSqliteQueryRunner.prototype.rollbackTransaction = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isTransactionActive)
                            throw new TransactionNotStartedError_1.TransactionNotStartedError();
                        return [4 /*yield*/, this.broadcaster.broadcast('BeforeTransactionRollback')];
                    case 1:
                        _a.sent();
                        if (!(this.transactionDepth > 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.query("ROLLBACK TO SAVEPOINT typeorm_".concat(this.transactionDepth - 1))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.query("ROLLBACK")];
                    case 4:
                        _a.sent();
                        this.isTransactionActive = false;
                        _a.label = 5;
                    case 5:
                        this.transactionDepth -= 1;
                        return [4 /*yield*/, this.broadcaster.broadcast('AfterTransactionRollback')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns raw data stream.
     */
    AbstractSqliteQueryRunner.prototype.stream = function (query, parameters, onEnd, onError) {
        throw new error_1.TypeORMError("Stream is not supported by sqlite driver.");
    };
    /**
     * Returns all available database names including system databases.
     */
    AbstractSqliteQueryRunner.prototype.getDatabases = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve([])];
            });
        });
    };
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     */
    AbstractSqliteQueryRunner.prototype.getSchemas = function (database) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve([])];
            });
        });
    };
    /**
     * Checks if database with the given name exist.
     */
    AbstractSqliteQueryRunner.prototype.hasDatabase = function (database) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve(false)];
            });
        });
    };
    /**
     * Loads currently using database
     */
    AbstractSqliteQueryRunner.prototype.getCurrentDatabase = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve(undefined)];
            });
        });
    };
    /**
     * Checks if schema with the given name exist.
     */
    AbstractSqliteQueryRunner.prototype.hasSchema = function (schema) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                throw new error_1.TypeORMError("This driver does not support table schemas");
            });
        });
    };
    /**
     * Loads currently using database schema
     */
    AbstractSqliteQueryRunner.prototype.getCurrentSchema = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve(undefined)];
            });
        });
    };
    /**
     * Checks if table with the given name exist in the database.
     */
    AbstractSqliteQueryRunner.prototype.hasTable = function (tableOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var tableName, sql, result;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableName = tableOrName instanceof Table_1.Table ? tableOrName.name : tableOrName;
                        sql = "SELECT * FROM \"sqlite_master\" WHERE \"type\" = 'table' AND \"name\" = '".concat(tableName, "'");
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length ? true : false];
                }
            });
        });
    };
    /**
     * Checks if column with the given name exist in the given table.
     */
    AbstractSqliteQueryRunner.prototype.hasColumn = function (tableOrName, columnName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var tableName, sql, columns;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableName = tableOrName instanceof Table_1.Table ? tableOrName.name : tableOrName;
                        sql = "PRAGMA table_info(".concat(this.escapePath(tableName), ")");
                        return [4 /*yield*/, this.query(sql)];
                    case 1:
                        columns = _a.sent();
                        return [2 /*return*/, !!columns.find(function (column) { return column["name"] === columnName; })];
                }
            });
        });
    };
    /**
     * Creates a new database.
     */
    AbstractSqliteQueryRunner.prototype.createDatabase = function (database, ifNotExist) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    /**
     * Drops database.
     */
    AbstractSqliteQueryRunner.prototype.dropDatabase = function (database, ifExist) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    /**
     * Creates a new table schema.
     */
    AbstractSqliteQueryRunner.prototype.createSchema = function (schemaPath, ifNotExist) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    /**
     * Drops table schema.
     */
    AbstractSqliteQueryRunner.prototype.dropSchema = function (schemaPath, ifExist) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    /**
     * Creates a new table.
     */
    AbstractSqliteQueryRunner.prototype.createTable = function (table, ifNotExist, createForeignKeys, createIndices) {
        if (ifNotExist === void 0) { ifNotExist = false; }
        if (createForeignKeys === void 0) { createForeignKeys = true; }
        if (createIndices === void 0) { createIndices = true; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var upQueries, downQueries, isTableExist;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        upQueries = [];
                        downQueries = [];
                        if (!ifNotExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.hasTable(table)];
                    case 1:
                        isTableExist = _a.sent();
                        if (isTableExist)
                            return [2 /*return*/, Promise.resolve()];
                        _a.label = 2;
                    case 2:
                        upQueries.push(this.createTableSql(table, createForeignKeys));
                        downQueries.push(this.dropTableSql(table));
                        if (createIndices) {
                            table.indices.forEach(function (index) {
                                // new index may be passed without name. In this case we generate index name manually.
                                if (!index.name)
                                    index.name = _this.connection.namingStrategy.indexName(table, index.columnNames, index.where);
                                upQueries.push(_this.createIndexSql(table, index));
                                downQueries.push(_this.dropIndexSql(index));
                            });
                        }
                        return [4 /*yield*/, this.executeQueries(upQueries, downQueries)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops the table.
     */
    AbstractSqliteQueryRunner.prototype.dropTable = function (tableOrName, ifExist, dropForeignKeys, dropIndices) {
        if (dropForeignKeys === void 0) { dropForeignKeys = true; }
        if (dropIndices === void 0) { dropIndices = true; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var isTableExist, createForeignKeys, table, _a, upQueries, downQueries;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!ifExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.hasTable(tableOrName)];
                    case 1:
                        isTableExist = _b.sent();
                        if (!isTableExist)
                            return [2 /*return*/, Promise.resolve()];
                        _b.label = 2;
                    case 2:
                        createForeignKeys = dropForeignKeys;
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 3];
                        _a = tableOrName;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        table = _a;
                        upQueries = [];
                        downQueries = [];
                        if (dropIndices) {
                            table.indices.forEach(function (index) {
                                upQueries.push(_this.dropIndexSql(index));
                                downQueries.push(_this.createIndexSql(table, index));
                            });
                        }
                        upQueries.push(this.dropTableSql(table, ifExist));
                        downQueries.push(this.createTableSql(table, createForeignKeys));
                        return [4 /*yield*/, this.executeQueries(upQueries, downQueries)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new view.
     */
    AbstractSqliteQueryRunner.prototype.createView = function (view) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var upQueries, downQueries;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        upQueries = [];
                        downQueries = [];
                        upQueries.push(this.createViewSql(view));
                        upQueries.push(this.insertViewDefinitionSql(view));
                        downQueries.push(this.dropViewSql(view));
                        downQueries.push(this.deleteViewDefinitionSql(view));
                        return [4 /*yield*/, this.executeQueries(upQueries, downQueries)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops the view.
     */
    AbstractSqliteQueryRunner.prototype.dropView = function (target) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var viewName, view, upQueries, downQueries;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewName = target instanceof View_1.View ? target.name : target;
                        return [4 /*yield*/, this.getCachedView(viewName)];
                    case 1:
                        view = _a.sent();
                        upQueries = [];
                        downQueries = [];
                        upQueries.push(this.deleteViewDefinitionSql(view));
                        upQueries.push(this.dropViewSql(view));
                        downQueries.push(this.insertViewDefinitionSql(view));
                        downQueries.push(this.createViewSql(view));
                        return [4 /*yield*/, this.executeQueries(upQueries, downQueries)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Renames the given table.
     */
    AbstractSqliteQueryRunner.prototype.renameTable = function (oldTableOrName, newTableName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var oldTable, _a, newTable, up, down;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oldTableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = oldTableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(oldTableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        oldTable = _a;
                        newTable = oldTable.clone();
                        newTable.name = newTableName;
                        up = new Query_1.Query("ALTER TABLE ".concat(this.escapePath(oldTable.name), " RENAME TO ").concat(this.escapePath(newTableName)));
                        down = new Query_1.Query("ALTER TABLE ".concat(this.escapePath(newTableName), " RENAME TO ").concat(this.escapePath(oldTable.name)));
                        return [4 /*yield*/, this.executeQueries(up, down)];
                    case 4:
                        _b.sent();
                        // rename old table;
                        oldTable.name = newTable.name;
                        // rename unique constraints
                        newTable.uniques.forEach(function (unique) {
                            unique.name = _this.connection.namingStrategy.uniqueConstraintName(newTable, unique.columnNames);
                        });
                        // rename foreign key constraints
                        newTable.foreignKeys.forEach(function (foreignKey) {
                            foreignKey.name = _this.connection.namingStrategy.foreignKeyName(newTable, foreignKey.columnNames, _this.getTablePath(foreignKey), foreignKey.referencedColumnNames);
                        });
                        // rename indices
                        newTable.indices.forEach(function (index) {
                            index.name = _this.connection.namingStrategy.indexName(newTable, index.columnNames, index.where);
                        });
                        // recreate table with new constraint names
                        return [4 /*yield*/, this.recreateTable(newTable, oldTable)];
                    case 5:
                        // recreate table with new constraint names
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new column from the column in the table.
     */
    AbstractSqliteQueryRunner.prototype.addColumn = function (tableOrName, column) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        return [2 /*return*/, this.addColumns(table, [column])];
                }
            });
        });
    };
    /**
     * Creates a new columns from the column in the table.
     */
    AbstractSqliteQueryRunner.prototype.addColumns = function (tableOrName, columns) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        columns.forEach(function (column) { return changedTable.addColumn(column); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Renames column in the given table.
     */
    AbstractSqliteQueryRunner.prototype.renameColumn = function (tableOrName, oldTableColumnOrName, newTableColumnOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, oldColumn, newColumn;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        oldColumn = oldTableColumnOrName instanceof TableColumn_1.TableColumn ? oldTableColumnOrName : table.columns.find(function (c) { return c.name === oldTableColumnOrName; });
                        if (!oldColumn)
                            throw new error_1.TypeORMError("Column \"".concat(oldTableColumnOrName, "\" was not found in the \"").concat(table.name, "\" table."));
                        newColumn = undefined;
                        if (newTableColumnOrName instanceof TableColumn_1.TableColumn) {
                            newColumn = newTableColumnOrName;
                        }
                        else {
                            newColumn = oldColumn.clone();
                            newColumn.name = newTableColumnOrName;
                        }
                        return [2 /*return*/, this.changeColumn(table, oldColumn, newColumn)];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     */
    AbstractSqliteQueryRunner.prototype.changeColumn = function (tableOrName, oldTableColumnOrName, newColumn) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, oldColumn;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        oldColumn = oldTableColumnOrName instanceof TableColumn_1.TableColumn ? oldTableColumnOrName : table.columns.find(function (c) { return c.name === oldTableColumnOrName; });
                        if (!oldColumn)
                            throw new error_1.TypeORMError("Column \"".concat(oldTableColumnOrName, "\" was not found in the \"").concat(table.name, "\" table."));
                        return [4 /*yield*/, this.changeColumns(table, [{ oldColumn: oldColumn, newColumn: newColumn }])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Changes a column in the table.
     * Changed column looses all its keys in the db.
     */
    AbstractSqliteQueryRunner.prototype.changeColumns = function (tableOrName, changedColumns) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        changedColumns.forEach(function (changedColumnSet) {
                            if (changedColumnSet.newColumn.name !== changedColumnSet.oldColumn.name) {
                                changedTable.findColumnUniques(changedColumnSet.oldColumn).forEach(function (unique) {
                                    unique.columnNames.splice(unique.columnNames.indexOf(changedColumnSet.oldColumn.name), 1);
                                    unique.columnNames.push(changedColumnSet.newColumn.name);
                                    unique.name = _this.connection.namingStrategy.uniqueConstraintName(changedTable, unique.columnNames);
                                });
                                changedTable.findColumnForeignKeys(changedColumnSet.oldColumn).forEach(function (fk) {
                                    fk.columnNames.splice(fk.columnNames.indexOf(changedColumnSet.oldColumn.name), 1);
                                    fk.columnNames.push(changedColumnSet.newColumn.name);
                                    fk.name = _this.connection.namingStrategy.foreignKeyName(changedTable, fk.columnNames, _this.getTablePath(fk), fk.referencedColumnNames);
                                });
                                changedTable.findColumnIndices(changedColumnSet.oldColumn).forEach(function (index) {
                                    index.columnNames.splice(index.columnNames.indexOf(changedColumnSet.oldColumn.name), 1);
                                    index.columnNames.push(changedColumnSet.newColumn.name);
                                    index.name = _this.connection.namingStrategy.indexName(changedTable, index.columnNames, index.where);
                                });
                            }
                            var originalColumn = changedTable.columns.find(function (column) { return column.name === changedColumnSet.oldColumn.name; });
                            if (originalColumn)
                                changedTable.columns[changedTable.columns.indexOf(originalColumn)] = changedColumnSet.newColumn;
                        });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops column in the table.
     */
    AbstractSqliteQueryRunner.prototype.dropColumn = function (tableOrName, columnOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, column;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        column = columnOrName instanceof TableColumn_1.TableColumn ? columnOrName : table.findColumnByName(columnOrName);
                        if (!column)
                            throw new error_1.TypeORMError("Column \"".concat(columnOrName, "\" was not found in table \"").concat(table.name, "\""));
                        return [4 /*yield*/, this.dropColumns(table, [column])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops the columns in the table.
     */
    AbstractSqliteQueryRunner.prototype.dropColumns = function (tableOrName, columns) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        columns.forEach(function (column) {
                            var columnInstance = column instanceof TableColumn_1.TableColumn ? column : table.findColumnByName(column);
                            if (!columnInstance)
                                throw new Error("Column \"".concat(column, "\" was not found in table \"").concat(table.name, "\""));
                            changedTable.removeColumn(columnInstance);
                            changedTable.findColumnUniques(columnInstance).forEach(function (unique) { return changedTable.removeUniqueConstraint(unique); });
                            changedTable.findColumnIndices(columnInstance).forEach(function (index) { return changedTable.removeIndex(index); });
                            changedTable.findColumnForeignKeys(columnInstance).forEach(function (fk) { return changedTable.removeForeignKey(fk); });
                        });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new primary key.
     */
    AbstractSqliteQueryRunner.prototype.createPrimaryKey = function (tableOrName, columnNames) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        changedTable.columns.forEach(function (column) {
                            if (columnNames.find(function (columnName) { return columnName === column.name; }))
                                column.isPrimary = true;
                        });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        // mark columns as primary in original table
                        table.columns.forEach(function (column) {
                            if (columnNames.find(function (columnName) { return columnName === column.name; }))
                                column.isPrimary = true;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates composite primary keys.
     */
    AbstractSqliteQueryRunner.prototype.updatePrimaryKeys = function (tableOrName, columns) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops a primary key.
     */
    AbstractSqliteQueryRunner.prototype.dropPrimaryKey = function (tableOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        changedTable.primaryColumns.forEach(function (column) {
                            column.isPrimary = false;
                        });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        // mark primary columns as non-primary in original table
                        table.primaryColumns.forEach(function (column) {
                            column.isPrimary = false;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new unique constraint.
     */
    AbstractSqliteQueryRunner.prototype.createUniqueConstraint = function (tableOrName, uniqueConstraint) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createUniqueConstraints(tableOrName, [uniqueConstraint])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new unique constraints.
     */
    AbstractSqliteQueryRunner.prototype.createUniqueConstraints = function (tableOrName, uniqueConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        uniqueConstraints.forEach(function (uniqueConstraint) { return changedTable.addUniqueConstraint(uniqueConstraint); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops an unique constraint.
     */
    AbstractSqliteQueryRunner.prototype.dropUniqueConstraint = function (tableOrName, uniqueOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, uniqueConstraint;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        uniqueConstraint = uniqueOrName instanceof TableUnique_1.TableUnique ? uniqueOrName : table.uniques.find(function (u) { return u.name === uniqueOrName; });
                        if (!uniqueConstraint)
                            throw new error_1.TypeORMError("Supplied unique constraint was not found in table ".concat(table.name));
                        return [4 /*yield*/, this.dropUniqueConstraints(table, [uniqueConstraint])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates an unique constraints.
     */
    AbstractSqliteQueryRunner.prototype.dropUniqueConstraints = function (tableOrName, uniqueConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        uniqueConstraints.forEach(function (uniqueConstraint) { return changedTable.removeUniqueConstraint(uniqueConstraint); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates new check constraint.
     */
    AbstractSqliteQueryRunner.prototype.createCheckConstraint = function (tableOrName, checkConstraint) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createCheckConstraints(tableOrName, [checkConstraint])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates new check constraints.
     */
    AbstractSqliteQueryRunner.prototype.createCheckConstraints = function (tableOrName, checkConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        checkConstraints.forEach(function (checkConstraint) { return changedTable.addCheckConstraint(checkConstraint); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops check constraint.
     */
    AbstractSqliteQueryRunner.prototype.dropCheckConstraint = function (tableOrName, checkOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, checkConstraint;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        checkConstraint = checkOrName instanceof TableCheck_1.TableCheck ? checkOrName : table.checks.find(function (c) { return c.name === checkOrName; });
                        if (!checkConstraint)
                            throw new error_1.TypeORMError("Supplied check constraint was not found in table ".concat(table.name));
                        return [4 /*yield*/, this.dropCheckConstraints(table, [checkConstraint])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops check constraints.
     */
    AbstractSqliteQueryRunner.prototype.dropCheckConstraints = function (tableOrName, checkConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        checkConstraints.forEach(function (checkConstraint) { return changedTable.removeCheckConstraint(checkConstraint); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new exclusion constraint.
     */
    AbstractSqliteQueryRunner.prototype.createExclusionConstraint = function (tableOrName, exclusionConstraint) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                throw new error_1.TypeORMError("Sqlite does not support exclusion constraints.");
            });
        });
    };
    /**
     * Creates a new exclusion constraints.
     */
    AbstractSqliteQueryRunner.prototype.createExclusionConstraints = function (tableOrName, exclusionConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                throw new error_1.TypeORMError("Sqlite does not support exclusion constraints.");
            });
        });
    };
    /**
     * Drops exclusion constraint.
     */
    AbstractSqliteQueryRunner.prototype.dropExclusionConstraint = function (tableOrName, exclusionOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                throw new error_1.TypeORMError("Sqlite does not support exclusion constraints.");
            });
        });
    };
    /**
     * Drops exclusion constraints.
     */
    AbstractSqliteQueryRunner.prototype.dropExclusionConstraints = function (tableOrName, exclusionConstraints) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                throw new error_1.TypeORMError("Sqlite does not support exclusion constraints.");
            });
        });
    };
    /**
     * Creates a new foreign key.
     */
    AbstractSqliteQueryRunner.prototype.createForeignKey = function (tableOrName, foreignKey) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createForeignKeys(tableOrName, [foreignKey])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new foreign keys.
     */
    AbstractSqliteQueryRunner.prototype.createForeignKeys = function (tableOrName, foreignKeys) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        foreignKeys.forEach(function (foreignKey) { return changedTable.addForeignKey(foreignKey); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops a foreign key from the table.
     */
    AbstractSqliteQueryRunner.prototype.dropForeignKey = function (tableOrName, foreignKeyOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, foreignKey;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        foreignKey = foreignKeyOrName instanceof TableForeignKey_1.TableForeignKey ? foreignKeyOrName : table.foreignKeys.find(function (fk) { return fk.name === foreignKeyOrName; });
                        if (!foreignKey)
                            throw new error_1.TypeORMError("Supplied foreign key was not found in table ".concat(table.name));
                        return [4 /*yield*/, this.dropForeignKeys(tableOrName, [foreignKey])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops a foreign keys from the table.
     */
    AbstractSqliteQueryRunner.prototype.dropForeignKeys = function (tableOrName, foreignKeys) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, changedTable;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        changedTable = table.clone();
                        foreignKeys.forEach(function (foreignKey) { return changedTable.removeForeignKey(foreignKey); });
                        return [4 /*yield*/, this.recreateTable(changedTable, table)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new index.
     */
    AbstractSqliteQueryRunner.prototype.createIndex = function (tableOrName, index) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, up, down;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        // new index may be passed without name. In this case we generate index name manually.
                        if (!index.name)
                            index.name = this.connection.namingStrategy.indexName(table, index.columnNames, index.where);
                        up = this.createIndexSql(table, index);
                        down = this.dropIndexSql(index);
                        return [4 /*yield*/, this.executeQueries(up, down)];
                    case 4:
                        _b.sent();
                        table.addIndex(index);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a new indices
     */
    AbstractSqliteQueryRunner.prototype.createIndices = function (tableOrName, indices) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = indices.map(function (index) { return _this.createIndex(tableOrName, index); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops an index from the table.
     */
    AbstractSqliteQueryRunner.prototype.dropIndex = function (tableOrName, indexOrName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var table, _a, index, up, down;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(tableOrName instanceof Table_1.Table)) return [3 /*break*/, 1];
                        _a = tableOrName;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getCachedTable(tableOrName)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        table = _a;
                        index = indexOrName instanceof TableIndex_1.TableIndex ? indexOrName : table.indices.find(function (i) { return i.name === indexOrName; });
                        if (!index)
                            throw new error_1.TypeORMError("Supplied index ".concat(indexOrName, " was not found in table ").concat(table.name));
                        up = this.dropIndexSql(index);
                        down = this.createIndexSql(table, index);
                        return [4 /*yield*/, this.executeQueries(up, down)];
                    case 4:
                        _b.sent();
                        table.removeIndex(index);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drops an indices from the table.
     */
    AbstractSqliteQueryRunner.prototype.dropIndices = function (tableOrName, indices) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = indices.map(function (index) { return _this.dropIndex(tableOrName, index); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all table contents.
     * Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.
     */
    AbstractSqliteQueryRunner.prototype.clearTable = function (tableName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("DELETE FROM ".concat(this.escapePath(tableName)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes all tables from the currently connected database.
     */
    AbstractSqliteQueryRunner.prototype.clearDatabase = function (database) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var dbPath, isAnotherTransactionActive, selectViewDropsQuery, dropViewQueries, selectTableDropsQuery, dropTableQueries, error_2, rollbackError_1;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbPath = undefined;
                        if (database && this.driver.getAttachedDatabaseHandleByRelativePath(database)) {
                            dbPath = this.driver.getAttachedDatabaseHandleByRelativePath(database);
                        }
                        return [4 /*yield*/, this.query("PRAGMA foreign_keys = OFF;")];
                    case 1:
                        _a.sent();
                        isAnotherTransactionActive = this.isTransactionActive;
                        if (!!isAnotherTransactionActive) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, 16, 18]);
                        selectViewDropsQuery = dbPath ? "SELECT 'DROP VIEW \"".concat(dbPath, "\".\"' || name || '\";' as query FROM \"").concat(dbPath, "\".\"sqlite_master\" WHERE \"type\" = 'view'") : "SELECT 'DROP VIEW \"' || name || '\";' as query FROM \"sqlite_master\" WHERE \"type\" = 'view'";
                        return [4 /*yield*/, this.query(selectViewDropsQuery)];
                    case 4:
                        dropViewQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropViewQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 5:
                        _a.sent();
                        selectTableDropsQuery = dbPath ? "SELECT 'DROP TABLE \"".concat(dbPath, "\".\"' || name || '\";' as query FROM \"").concat(dbPath, "\".\"sqlite_master\" WHERE \"type\" = 'table' AND \"name\" != 'sqlite_sequence'") : "SELECT 'DROP TABLE \"' || name || '\";' as query FROM \"sqlite_master\" WHERE \"type\" = 'table' AND \"name\" != 'sqlite_sequence'";
                        return [4 /*yield*/, this.query(selectTableDropsQuery)];
                    case 6:
                        dropTableQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropTableQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 7:
                        _a.sent();
                        if (!!isAnotherTransactionActive) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.commitTransaction()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 18];
                    case 10:
                        error_2 = _a.sent();
                        _a.label = 11;
                    case 11:
                        _a.trys.push([11, 14, , 15]);
                        if (!!isAnotherTransactionActive) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.rollbackTransaction()];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        rollbackError_1 = _a.sent();
                        return [3 /*break*/, 15];
                    case 15: throw error_2;
                    case 16: return [4 /*yield*/, this.query("PRAGMA foreign_keys = ON;")];
                    case 17:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    AbstractSqliteQueryRunner.prototype.loadViews = function (viewNames) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var hasTable, viewNamesString, query, dbViews;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hasTable(this.getTypeormMetadataTableName())];
                    case 1:
                        hasTable = _a.sent();
                        if (!hasTable) {
                            return [2 /*return*/, []];
                        }
                        if (!viewNames) {
                            viewNames = [];
                        }
                        viewNamesString = viewNames.map(function (name) { return "'" + name + "'"; }).join(", ");
                        query = "SELECT \"t\".* FROM \"".concat(this.getTypeormMetadataTableName(), "\" \"t\" INNER JOIN \"sqlite_master\" s ON \"s\".\"name\" = \"t\".\"name\" AND \"s\".\"type\" = 'view' WHERE \"t\".\"type\" = '").concat(MetadataTableType_1.MetadataTableType.VIEW, "'");
                        if (viewNamesString.length > 0)
                            query += " AND \"t\".\"name\" IN (".concat(viewNamesString, ")");
                        return [4 /*yield*/, this.query(query)];
                    case 2:
                        dbViews = _a.sent();
                        return [2 /*return*/, dbViews.map(function (dbView) {
                                var view = new View_1.View();
                                view.name = dbView["name"];
                                view.expression = dbView["value"];
                                return view;
                            })];
                }
            });
        });
    };
    AbstractSqliteQueryRunner.prototype.loadTableRecords = function (tablePath, tableOrIndex) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var database, _a, schema, tableName, res;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        database = undefined;
                        _a = (0, tslib_1.__read)(this.splitTablePath(tablePath), 2), schema = _a[0], tableName = _a[1];
                        if (schema && this.driver.getAttachedDatabasePathRelativeByHandle(schema)) {
                            database = this.driver.getAttachedDatabasePathRelativeByHandle(schema);
                        }
                        return [4 /*yield*/, this.query("SELECT ".concat(database ? "'".concat(database, "'") : null, " as database, ").concat(schema ? "'".concat(schema, "'") : null, " as schema, * FROM ").concat(schema ? "\"".concat(schema, "\".") : "").concat(this.escapePath("sqlite_master"), " WHERE \"type\" = '").concat(tableOrIndex, "' AND \"").concat(tableOrIndex === "table" ? "name" : "tbl_name", "\" IN ('").concat(tableName, "')"))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    AbstractSqliteQueryRunner.prototype.loadPragmaRecords = function (tablePath, pragma) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, tableName, res;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tslib_1.__read)(this.splitTablePath(tablePath), 2), tableName = _a[1];
                        return [4 /*yield*/, this.query("PRAGMA ".concat(pragma, "(\"").concat(tableName, "\")"))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    AbstractSqliteQueryRunner.prototype.loadTables = function (tableNames) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var dbTables, dbIndicesDef, tablesSql, _a, _b, _c, _d, tableNamesString;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // if no tables given then no need to proceed
                        if (tableNames && tableNames.length === 0) {
                            return [2 /*return*/, []];
                        }
                        dbTables = [];
                        if (!!tableNames) return [3 /*break*/, 3];
                        tablesSql = "SELECT * FROM \"sqlite_master\" WHERE \"type\" = 'table'";
                        _b = (_a = dbTables.push).apply;
                        _c = [dbTables];
                        _d = [[]];
                        return [4 /*yield*/, this.query(tablesSql)];
                    case 1:
                        _b.apply(_a, _c.concat([tslib_1.__spreadArray.apply(void 0, _d.concat([tslib_1.__read.apply(void 0, [_e.sent()]), false]))]));
                        tableNamesString = dbTables.map(function (_a) {
                            var name = _a.name;
                            return "'".concat(name, "'");
                        }).join(", ");
                        return [4 /*yield*/, this.query("SELECT * FROM \"sqlite_master\" WHERE \"type\" = 'index' AND \"tbl_name\" IN (".concat(tableNamesString, ")"))];
                    case 2:
                        dbIndicesDef = _e.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, Promise.all(tableNames.map(function (tableName) { return _this.loadTableRecords(tableName, "table"); }))];
                    case 4:
                        dbTables = (_e.sent()).reduce(function (acc, res) { return ((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(acc), false), (0, tslib_1.__read)(res), false)); }, []).filter(Boolean);
                        return [4 /*yield*/, Promise.all((tableNames !== null && tableNames !== void 0 ? tableNames : []).map(function (tableName) { return _this.loadTableRecords(tableName, "index"); }))];
                    case 5:
                        dbIndicesDef = (_e.sent()).reduce(function (acc, res) { return ((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(acc), false), (0, tslib_1.__read)(res), false)); }, []).filter(Boolean);
                        _e.label = 6;
                    case 6:
                        // if tables were not found in the db, no need to proceed
                        if (dbTables.length === 0) {
                            return [2 /*return*/, []];
                        }
                        // create table schemas for loaded tables
                        return [2 /*return*/, Promise.all(dbTables.map(function (dbTable) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                                var tablePath, table, sql, _a, dbColumns, dbIndices, dbForeignKeys, autoIncrementColumnName, tableSql, autoIncrementIndex, comma, bracket, tableForeignKeyConstraints, uniqueRegexResult, uniqueMappings, uniqueRegex, tableUniquePromises, _b, result, regexp, indicesPromises, indices;
                                var _this = this;
                                return (0, tslib_1.__generator)(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            tablePath = dbTable['database'] && this.driver.getAttachedDatabaseHandleByRelativePath(dbTable['database']) ? "".concat(this.driver.getAttachedDatabaseHandleByRelativePath(dbTable['database']), ".").concat(dbTable['name']) : dbTable['name'];
                                            table = new Table_1.Table({ name: tablePath });
                                            sql = dbTable["sql"];
                                            return [4 /*yield*/, Promise.all([
                                                    this.loadPragmaRecords(tablePath, "table_info"),
                                                    this.loadPragmaRecords(tablePath, "index_list"),
                                                    this.loadPragmaRecords(tablePath, "foreign_key_list"),
                                                ])];
                                        case 1:
                                            _a = tslib_1.__read.apply(void 0, [_c.sent(), 3]), dbColumns = _a[0], dbIndices = _a[1], dbForeignKeys = _a[2];
                                            autoIncrementColumnName = undefined;
                                            tableSql = dbTable["sql"];
                                            autoIncrementIndex = tableSql.toUpperCase().indexOf("AUTOINCREMENT");
                                            if (autoIncrementIndex !== -1) {
                                                autoIncrementColumnName = tableSql.substr(0, autoIncrementIndex);
                                                comma = autoIncrementColumnName.lastIndexOf(",");
                                                bracket = autoIncrementColumnName.lastIndexOf("(");
                                                if (comma !== -1) {
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(comma);
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(0, autoIncrementColumnName.lastIndexOf("\""));
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(autoIncrementColumnName.indexOf("\"") + 1);
                                                }
                                                else if (bracket !== -1) {
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(bracket);
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(0, autoIncrementColumnName.lastIndexOf("\""));
                                                    autoIncrementColumnName = autoIncrementColumnName.substr(autoIncrementColumnName.indexOf("\"") + 1);
                                                }
                                            }
                                            // create columns from the loaded columns
                                            table.columns = dbColumns.map(function (dbColumn) {
                                                var tableColumn = new TableColumn_1.TableColumn();
                                                tableColumn.name = dbColumn["name"];
                                                tableColumn.type = dbColumn["type"].toLowerCase();
                                                tableColumn.default = dbColumn["dflt_value"] !== null && dbColumn["dflt_value"] !== undefined ? dbColumn["dflt_value"] : undefined;
                                                tableColumn.isNullable = dbColumn["notnull"] === 0;
                                                // primary keys are numbered starting with 1, columns that aren't primary keys are marked with 0
                                                tableColumn.isPrimary = dbColumn["pk"] > 0;
                                                tableColumn.comment = ""; // SQLite does not support column comments
                                                tableColumn.isGenerated = autoIncrementColumnName === dbColumn["name"];
                                                if (tableColumn.isGenerated) {
                                                    tableColumn.generationStrategy = "increment";
                                                }
                                                if (tableColumn.type === "varchar") {
                                                    // Check if this is an enum
                                                    var enumMatch = sql.match(new RegExp("\"(" + tableColumn.name + ")\" varchar CHECK\\s*\\(\\s*\"\\1\"\\s+IN\\s*\\(('[^']+'(?:\\s*,\\s*'[^']+')+)\\s*\\)\\s*\\)"));
                                                    if (enumMatch) {
                                                        // This is an enum
                                                        tableColumn.enum = enumMatch[2].substr(1, enumMatch[2].length - 2).split("','");
                                                    }
                                                }
                                                // parse datatype and attempt to retrieve length, precision and scale
                                                var pos = tableColumn.type.indexOf("(");
                                                if (pos !== -1) {
                                                    var fullType = tableColumn.type;
                                                    var dataType_1 = fullType.substr(0, pos);
                                                    if (!!_this.driver.withLengthColumnTypes.find(function (col) { return col === dataType_1; })) {
                                                        var len = parseInt(fullType.substring(pos + 1, fullType.length - 1));
                                                        if (len) {
                                                            tableColumn.length = len.toString();
                                                            tableColumn.type = dataType_1; // remove the length part from the datatype
                                                        }
                                                    }
                                                    if (!!_this.driver.withPrecisionColumnTypes.find(function (col) { return col === dataType_1; })) {
                                                        var re = new RegExp("^".concat(dataType_1, "\\((\\d+),?\\s?(\\d+)?\\)"));
                                                        var matches = fullType.match(re);
                                                        if (matches && matches[1]) {
                                                            tableColumn.precision = +matches[1];
                                                        }
                                                        if (!!_this.driver.withScaleColumnTypes.find(function (col) { return col === dataType_1; })) {
                                                            if (matches && matches[2]) {
                                                                tableColumn.scale = +matches[2];
                                                            }
                                                        }
                                                        tableColumn.type = dataType_1; // remove the precision/scale part from the datatype
                                                    }
                                                }
                                                return tableColumn;
                                            });
                                            tableForeignKeyConstraints = OrmUtils_1.OrmUtils.uniq(dbForeignKeys, function (dbForeignKey) { return dbForeignKey["id"]; });
                                            table.foreignKeys = tableForeignKeyConstraints.map(function (foreignKey) {
                                                var ownForeignKeys = dbForeignKeys.filter(function (dbForeignKey) { return dbForeignKey["id"] === foreignKey["id"] && dbForeignKey["table"] === foreignKey["table"]; });
                                                var columnNames = ownForeignKeys.map(function (dbForeignKey) { return dbForeignKey["from"]; });
                                                var referencedColumnNames = ownForeignKeys.map(function (dbForeignKey) { return dbForeignKey["to"]; });
                                                // build foreign key name, because we can not get it directly.
                                                var fkName = _this.connection.namingStrategy.foreignKeyName(table, columnNames, foreignKey.referencedTableName, foreignKey.referencedColumnNames);
                                                return new TableForeignKey_1.TableForeignKey({
                                                    name: fkName,
                                                    columnNames: columnNames,
                                                    referencedTableName: foreignKey["table"],
                                                    referencedColumnNames: referencedColumnNames,
                                                    onDelete: foreignKey["on_delete"],
                                                    onUpdate: foreignKey["on_update"]
                                                });
                                            });
                                            uniqueMappings = [];
                                            uniqueRegex = /CONSTRAINT "([^"]*)" UNIQUE \((.*?)\)/g;
                                            while ((uniqueRegexResult = uniqueRegex.exec(sql)) !== null) {
                                                uniqueMappings.push({
                                                    name: uniqueRegexResult[1],
                                                    columns: uniqueRegexResult[2].substr(1, uniqueRegexResult[2].length - 2).split("\", \"")
                                                });
                                            }
                                            tableUniquePromises = dbIndices
                                                .filter(function (dbIndex) { return dbIndex["origin"] === "u"; })
                                                .map(function (dbIndex) { return dbIndex["name"]; })
                                                .filter(function (value, index, self) { return self.indexOf(value) === index; })
                                                .map(function (dbIndexName) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                                                var dbIndex, indexInfos, indexColumns, column, foundMapping;
                                                return (0, tslib_1.__generator)(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            dbIndex = dbIndices.find(function (dbIndex) { return dbIndex["name"] === dbIndexName; });
                                                            return [4 /*yield*/, this.query("PRAGMA index_info(\"".concat(dbIndex["name"], "\")"))];
                                                        case 1:
                                                            indexInfos = _a.sent();
                                                            indexColumns = indexInfos
                                                                .sort(function (indexInfo1, indexInfo2) { return parseInt(indexInfo1["seqno"]) - parseInt(indexInfo2["seqno"]); })
                                                                .map(function (indexInfo) { return indexInfo["name"]; });
                                                            if (indexColumns.length === 1) {
                                                                column = table.columns.find(function (column) {
                                                                    return !!indexColumns.find(function (indexColumn) { return indexColumn === column.name; });
                                                                });
                                                                if (column)
                                                                    column.isUnique = true;
                                                            }
                                                            foundMapping = uniqueMappings.find(function (mapping) {
                                                                return mapping.columns.every(function (column) {
                                                                    return indexColumns.indexOf(column) !== -1;
                                                                });
                                                            });
                                                            return [2 /*return*/, new TableUnique_1.TableUnique({
                                                                    name: foundMapping ? foundMapping.name : this.connection.namingStrategy.uniqueConstraintName(table, indexColumns),
                                                                    columnNames: indexColumns
                                                                })];
                                                    }
                                                });
                                            }); });
                                            _b = table;
                                            return [4 /*yield*/, Promise.all(tableUniquePromises)];
                                        case 2:
                                            _b.uniques = (_c.sent());
                                            regexp = /CONSTRAINT "([^"]*)" CHECK (\(.*?\))([,]|[)]$)/g;
                                            while (((result = regexp.exec(sql)) !== null)) {
                                                table.checks.push(new TableCheck_1.TableCheck({ name: result[1], expression: result[2] }));
                                            }
                                            indicesPromises = dbIndices
                                                .filter(function (dbIndex) { return dbIndex["origin"] === "c"; })
                                                .map(function (dbIndex) { return dbIndex["name"]; })
                                                .filter(function (value, index, self) { return self.indexOf(value) === index; }) // unqiue
                                                .map(function (dbIndexName) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                                                var indexDef, condition, dbIndex, indexInfos, indexColumns, dbIndexPath, isUnique;
                                                return (0, tslib_1.__generator)(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            indexDef = dbIndicesDef.find(function (dbIndexDef) { return dbIndexDef["name"] === dbIndexName; });
                                                            condition = /WHERE (.*)/.exec(indexDef["sql"]);
                                                            dbIndex = dbIndices.find(function (dbIndex) { return dbIndex["name"] === dbIndexName; });
                                                            return [4 /*yield*/, this.query("PRAGMA index_info(\"".concat(dbIndex["name"], "\")"))];
                                                        case 1:
                                                            indexInfos = _a.sent();
                                                            indexColumns = indexInfos
                                                                .sort(function (indexInfo1, indexInfo2) { return parseInt(indexInfo1["seqno"]) - parseInt(indexInfo2["seqno"]); })
                                                                .map(function (indexInfo) { return indexInfo["name"]; });
                                                            dbIndexPath = "".concat(dbTable["database"] ? "".concat(dbTable["database"], ".") : '').concat(dbIndex["name"]);
                                                            isUnique = dbIndex["unique"] === "1" || dbIndex["unique"] === 1;
                                                            return [2 /*return*/, new TableIndex_1.TableIndex({
                                                                    table: table,
                                                                    name: dbIndexPath,
                                                                    columnNames: indexColumns,
                                                                    isUnique: isUnique,
                                                                    where: condition ? condition[1] : undefined
                                                                })];
                                                    }
                                                });
                                            }); });
                                            return [4 /*yield*/, Promise.all(indicesPromises)];
                                        case 3:
                                            indices = _c.sent();
                                            table.indices = indices.filter(function (index) { return !!index; });
                                            return [2 /*return*/, table];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    /**
     * Builds create table sql.
     */
    AbstractSqliteQueryRunner.prototype.createTableSql = function (table, createForeignKeys) {
        var _this = this;
        var primaryColumns = table.columns.filter(function (column) { return column.isPrimary; });
        var hasAutoIncrement = primaryColumns.find(function (column) { return column.isGenerated && column.generationStrategy === "increment"; });
        var skipPrimary = primaryColumns.length > 1;
        if (skipPrimary && hasAutoIncrement)
            throw new error_1.TypeORMError("Sqlite does not support AUTOINCREMENT on composite primary key");
        var columnDefinitions = table.columns.map(function (column) { return _this.buildCreateColumnSql(column, skipPrimary); }).join(", ");
        var _a = (0, tslib_1.__read)(this.splitTablePath(table.name), 1), database = _a[0];
        var sql = "CREATE TABLE ".concat(this.escapePath(table.name), " (").concat(columnDefinitions);
        // need for `addColumn()` method, because it recreates table.
        table.columns
            .filter(function (column) { return column.isUnique; })
            .forEach(function (column) {
            var isUniqueExist = table.uniques.some(function (unique) { return unique.columnNames.length === 1 && unique.columnNames[0] === column.name; });
            if (!isUniqueExist)
                table.uniques.push(new TableUnique_1.TableUnique({
                    name: _this.connection.namingStrategy.uniqueConstraintName(table, [column.name]),
                    columnNames: [column.name]
                }));
        });
        if (table.uniques.length > 0) {
            var uniquesSql = table.uniques.map(function (unique) {
                var uniqueName = unique.name ? unique.name : _this.connection.namingStrategy.uniqueConstraintName(table, unique.columnNames);
                var columnNames = unique.columnNames.map(function (columnName) { return "\"".concat(columnName, "\""); }).join(", ");
                return "CONSTRAINT \"".concat(uniqueName, "\" UNIQUE (").concat(columnNames, ")");
            }).join(", ");
            sql += ", ".concat(uniquesSql);
        }
        if (table.checks.length > 0) {
            var checksSql = table.checks.map(function (check) {
                var checkName = check.name ? check.name : _this.connection.namingStrategy.checkConstraintName(table, check.expression);
                return "CONSTRAINT \"".concat(checkName, "\" CHECK (").concat(check.expression, ")");
            }).join(", ");
            sql += ", ".concat(checksSql);
        }
        if (table.foreignKeys.length > 0 && createForeignKeys) {
            var foreignKeysSql = table.foreignKeys.filter(function (fk) {
                var _a = (0, tslib_1.__read)(_this.splitTablePath(fk.referencedTableName), 1), referencedDatabase = _a[0];
                if (referencedDatabase !== database) {
                    return false;
                }
                return true;
            })
                .map(function (fk) {
                var _a = (0, tslib_1.__read)(_this.splitTablePath(fk.referencedTableName), 2), referencedTable = _a[1];
                var columnNames = fk.columnNames.map(function (columnName) { return "\"".concat(columnName, "\""); }).join(", ");
                if (!fk.name)
                    fk.name = _this.connection.namingStrategy.foreignKeyName(table, fk.columnNames, _this.getTablePath(fk), fk.referencedColumnNames);
                var referencedColumnNames = fk.referencedColumnNames.map(function (columnName) { return "\"".concat(columnName, "\""); }).join(", ");
                var constraint = "CONSTRAINT \"".concat(fk.name, "\" FOREIGN KEY (").concat(columnNames, ") REFERENCES \"").concat(referencedTable, "\" (").concat(referencedColumnNames, ")");
                if (fk.onDelete)
                    constraint += " ON DELETE ".concat(fk.onDelete);
                if (fk.onUpdate)
                    constraint += " ON UPDATE ".concat(fk.onUpdate);
                return constraint;
            }).join(", ");
            sql += ", ".concat(foreignKeysSql);
        }
        if (primaryColumns.length > 1) {
            var columnNames = primaryColumns.map(function (column) { return "\"".concat(column.name, "\""); }).join(", ");
            sql += ", PRIMARY KEY (".concat(columnNames, ")");
        }
        sql += ")";
        var tableMetadata = this.connection.entityMetadatas.find(function (metadata) { return _this.getTablePath(table) === _this.getTablePath(metadata); });
        if (tableMetadata && tableMetadata.withoutRowid) {
            sql += " WITHOUT ROWID";
        }
        return new Query_1.Query(sql);
    };
    /**
     * Builds drop table sql.
     */
    AbstractSqliteQueryRunner.prototype.dropTableSql = function (tableOrName, ifExist) {
        var tableName = tableOrName instanceof Table_1.Table ? tableOrName.name : tableOrName;
        var query = ifExist ? "DROP TABLE IF EXISTS ".concat(this.escapePath(tableName)) : "DROP TABLE ".concat(this.escapePath(tableName));
        return new Query_1.Query(query);
    };
    AbstractSqliteQueryRunner.prototype.createViewSql = function (view) {
        if (typeof view.expression === "string") {
            return new Query_1.Query("CREATE VIEW \"".concat(view.name, "\" AS ").concat(view.expression));
        }
        else {
            return new Query_1.Query("CREATE VIEW \"".concat(view.name, "\" AS ").concat(view.expression(this.connection).getQuery()));
        }
    };
    AbstractSqliteQueryRunner.prototype.insertViewDefinitionSql = function (view) {
        var expression = typeof view.expression === "string" ? view.expression.trim() : view.expression(this.connection).getQuery();
        return this.insertTypeormMetadataSql({
            type: MetadataTableType_1.MetadataTableType.VIEW,
            name: view.name,
            value: expression
        });
    };
    /**
     * Builds drop view sql.
     */
    AbstractSqliteQueryRunner.prototype.dropViewSql = function (viewOrPath) {
        var viewName = viewOrPath instanceof View_1.View ? viewOrPath.name : viewOrPath;
        return new Query_1.Query("DROP VIEW \"".concat(viewName, "\""));
    };
    /**
     * Builds remove view sql.
     */
    AbstractSqliteQueryRunner.prototype.deleteViewDefinitionSql = function (viewOrPath) {
        var viewName = viewOrPath instanceof View_1.View ? viewOrPath.name : viewOrPath;
        return this.deleteTypeormMetadataSql({ type: MetadataTableType_1.MetadataTableType.VIEW, name: viewName });
    };
    /**
     * Builds create index sql.
     */
    AbstractSqliteQueryRunner.prototype.createIndexSql = function (table, index) {
        var columns = index.columnNames.map(function (columnName) { return "\"".concat(columnName, "\""); }).join(", ");
        var _a = (0, tslib_1.__read)(this.splitTablePath(table.name), 2), database = _a[0], tableName = _a[1];
        return new Query_1.Query("CREATE ".concat(index.isUnique ? "UNIQUE " : "", "INDEX ").concat(database ? "\"".concat(database, "\".") : "").concat(this.escapePath(index.name), " ON \"").concat(tableName, "\" (").concat(columns, ") ").concat(index.where ? "WHERE " + index.where : ""));
    };
    /**
     * Builds drop index sql.
     */
    AbstractSqliteQueryRunner.prototype.dropIndexSql = function (indexOrName) {
        var indexName = indexOrName instanceof TableIndex_1.TableIndex ? indexOrName.name : indexOrName;
        return new Query_1.Query("DROP INDEX ".concat(this.escapePath(indexName)));
    };
    /**
     * Builds a query for create column.
     */
    AbstractSqliteQueryRunner.prototype.buildCreateColumnSql = function (column, skipPrimary) {
        var c = "\"" + column.name + "\"";
        if (column instanceof ColumnMetadata_1.ColumnMetadata) {
            c += " " + this.driver.normalizeType(column);
        }
        else {
            c += " " + this.connection.driver.createFullType(column);
        }
        if (column.enum)
            c += " CHECK( \"" + column.name + "\" IN (" + column.enum.map(function (val) { return "'" + val + "'"; }).join(",") + ") )";
        if (column.isPrimary && !skipPrimary)
            c += " PRIMARY KEY";
        if (column.isGenerated === true && column.generationStrategy === "increment") // don't use skipPrimary here since updates can update already exist primary without auto inc.
            c += " AUTOINCREMENT";
        if (column.collation)
            c += " COLLATE " + column.collation;
        if (column.isNullable !== true)
            c += " NOT NULL";
        if (column.default !== undefined && column.default !== null)
            c += " DEFAULT (" + column.default + ")";
        return c;
    };
    AbstractSqliteQueryRunner.prototype.recreateTable = function (newTable, oldTable, migrateData) {
        if (migrateData === void 0) { migrateData = true; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var upQueries, downQueries, _a, databaseNew, tableNameNew, _b, tableNameOld, newColumnNames, oldColumnNames;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        upQueries = [];
                        downQueries = [];
                        // drop old table indices
                        oldTable.indices.forEach(function (index) {
                            upQueries.push(_this.dropIndexSql(index));
                            downQueries.push(_this.createIndexSql(oldTable, index));
                        });
                        _a = (0, tslib_1.__read)(this.splitTablePath(newTable.name), 2), databaseNew = _a[0], tableNameNew = _a[1];
                        _b = (0, tslib_1.__read)(this.splitTablePath(oldTable.name), 2), tableNameOld = _b[1];
                        newTable.name = tableNameNew = "".concat(databaseNew ? "".concat(databaseNew, ".") : "", "temporary_").concat(tableNameNew);
                        // create new table
                        upQueries.push(this.createTableSql(newTable, true));
                        downQueries.push(this.dropTableSql(newTable));
                        // migrate all data from the old table into new table
                        if (migrateData) {
                            newColumnNames = newTable.columns.map(function (column) { return "\"".concat(column.name, "\""); }).join(", ");
                            oldColumnNames = oldTable.columns.map(function (column) { return "\"".concat(column.name, "\""); }).join(", ");
                            if (oldTable.columns.length < newTable.columns.length) {
                                newColumnNames = newTable.columns.filter(function (column) {
                                    return oldTable.columns.find(function (c) { return c.name === column.name; });
                                }).map(function (column) { return "\"".concat(column.name, "\""); }).join(", ");
                            }
                            else if (oldTable.columns.length > newTable.columns.length) {
                                oldColumnNames = oldTable.columns.filter(function (column) {
                                    return newTable.columns.find(function (c) { return c.name === column.name; });
                                }).map(function (column) { return "\"".concat(column.name, "\""); }).join(", ");
                            }
                            upQueries.push(new Query_1.Query("INSERT INTO ".concat(this.escapePath(newTable.name), "(").concat(newColumnNames, ") SELECT ").concat(oldColumnNames, " FROM ").concat(this.escapePath(oldTable.name))));
                            downQueries.push(new Query_1.Query("INSERT INTO ".concat(this.escapePath(oldTable.name), "(").concat(oldColumnNames, ") SELECT ").concat(newColumnNames, " FROM ").concat(this.escapePath(newTable.name))));
                        }
                        // drop old table
                        upQueries.push(this.dropTableSql(oldTable));
                        downQueries.push(this.createTableSql(oldTable, true));
                        // rename old table
                        upQueries.push(new Query_1.Query("ALTER TABLE ".concat(this.escapePath(newTable.name), " RENAME TO ").concat(this.escapePath(tableNameOld))));
                        downQueries.push(new Query_1.Query("ALTER TABLE ".concat(this.escapePath(oldTable.name), " RENAME TO ").concat(this.escapePath(tableNameNew))));
                        newTable.name = oldTable.name;
                        // recreate table indices
                        newTable.indices.forEach(function (index) {
                            // new index may be passed without name. In this case we generate index name manually.
                            if (!index.name)
                                index.name = _this.connection.namingStrategy.indexName(newTable, index.columnNames, index.where);
                            upQueries.push(_this.createIndexSql(newTable, index));
                            downQueries.push(_this.dropIndexSql(index));
                        });
                        return [4 /*yield*/, this.executeQueries(upQueries, downQueries)];
                    case 1:
                        _c.sent();
                        this.replaceCachedTable(oldTable, newTable);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * tablePath e.g. "myDB.myTable", "myTable"
     */
    AbstractSqliteQueryRunner.prototype.splitTablePath = function (tablePath) {
        return ((tablePath.indexOf(".") !== -1) ? tablePath.split(".") : [undefined, tablePath]);
    };
    /**
     * Escapes given table or view path. Tolerates leading/trailing dots
     */
    AbstractSqliteQueryRunner.prototype.escapePath = function (target, disableEscape) {
        var tableName = target instanceof Table_1.Table || target instanceof View_1.View ? target.name : target;
        return tableName.replace(/^\.+|\.+$/g, "").split(".").map(function (i) { return disableEscape ? i : "\"".concat(i, "\""); }).join(".");
    };
    return AbstractSqliteQueryRunner;
}(BaseQueryRunner_1.BaseQueryRunner));
exports.AbstractSqliteQueryRunner = AbstractSqliteQueryRunner;

//# sourceMappingURL=AbstractSqliteQueryRunner.js.map
