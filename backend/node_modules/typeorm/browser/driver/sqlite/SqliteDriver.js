import { __asyncValues, __awaiter, __extends, __generator } from "tslib";
import mkdirp from "mkdirp";
import path from "path";
import { DriverPackageNotInstalledError } from "../../error/DriverPackageNotInstalledError";
import { SqliteQueryRunner } from "./SqliteQueryRunner";
import { DriverOptionNotSetError } from "../../error/DriverOptionNotSetError";
import { PlatformTools } from "../../platform/PlatformTools";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { filepathToName, isAbsolute } from "../../util/PathUtils";
/**
 * Organizes communication with sqlite DBMS.
 */
var SqliteDriver = /** @class */ (function (_super) {
    __extends(SqliteDriver, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SqliteDriver(connection) {
        var _this = _super.call(this, connection) || this;
        _this.connection = connection;
        _this.options = connection.options;
        _this.database = _this.options.database;
        // validate options to make sure everything is set
        if (!_this.options.database)
            throw new DriverOptionNotSetError("database");
        // load sqlite package
        _this.loadDependencies();
        return _this;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Closes connection with database.
     */
    SqliteDriver.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.queryRunner = undefined;
                        _this.databaseConnection.close(function (err) { return err ? fail(err) : ok(); });
                    })];
            });
        });
    };
    /**
     * Creates a query runner used to execute database queries.
     */
    SqliteDriver.prototype.createQueryRunner = function (mode) {
        if (!this.queryRunner)
            this.queryRunner = new SqliteQueryRunner(this);
        return this.queryRunner;
    };
    SqliteDriver.prototype.normalizeType = function (column) {
        if (column.type === Buffer) {
            return "blob";
        }
        return _super.prototype.normalizeType.call(this, column);
    };
    SqliteDriver.prototype.afterConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.attachDatabases()];
            });
        });
    };
    /**
     * For SQLite, the database may be added in the decorator metadata. It will be a filepath to a database file.
     */
    SqliteDriver.prototype.buildTableName = function (tableName, _schema, database) {
        if (!database)
            return tableName;
        if (this.getAttachedDatabaseHandleByRelativePath(database))
            return "".concat(this.getAttachedDatabaseHandleByRelativePath(database), ".").concat(tableName);
        if (database === this.options.database)
            return tableName;
        // we use the decorated name as supplied when deriving attach handle (ideally without non-portable absolute path)
        var identifierHash = filepathToName(database);
        // decorated name will be assumed relative to main database file when non absolute. Paths supplied as absolute won't be portable
        var absFilepath = isAbsolute(database) ? database : path.join(this.getMainDatabasePath(), database);
        this.attachedDatabases[database] = {
            attachFilepathAbsolute: absFilepath,
            attachFilepathRelative: database,
            attachHandle: identifierHash,
        };
        return "".concat(identifierHash, ".").concat(tableName);
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates connection with the database.
     */
    SqliteDriver.prototype.createDatabaseConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            // Internal function to run a command on the connection and fail if an error occured.
            function run(line) {
                return new Promise(function (ok, fail) {
                    databaseConnection.run(line, function (err) {
                        if (err)
                            return fail(err);
                        ok();
                    });
                });
            }
            var databaseConnection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createDatabaseDirectory(this.options.database)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (ok, fail) {
                                var connection = new _this.sqlite.Database(_this.options.database, function (err) {
                                    if (err)
                                        return fail(err);
                                    ok(connection);
                                });
                            })];
                    case 2:
                        databaseConnection = _a.sent();
                        if (!this.options.key) return [3 /*break*/, 4];
                        return [4 /*yield*/, run("PRAGMA key = ".concat(JSON.stringify(this.options.key), ";"))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!this.options.enableWAL) return [3 /*break*/, 6];
                        return [4 /*yield*/, run("PRAGMA journal_mode = WAL;")];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: 
                    // we need to enable foreign keys in sqlite to make sure all foreign key related features
                    // working properly. this also makes onDelete to work with sqlite.
                    return [4 /*yield*/, run("PRAGMA foreign_keys = ON;")];
                    case 7:
                        // we need to enable foreign keys in sqlite to make sure all foreign key related features
                        // working properly. this also makes onDelete to work with sqlite.
                        _a.sent();
                        return [2 /*return*/, databaseConnection];
                }
            });
        });
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    SqliteDriver.prototype.loadDependencies = function () {
        try {
            var sqlite = this.options.driver || PlatformTools.load("sqlite3");
            this.sqlite = sqlite.verbose();
        }
        catch (e) {
            throw new DriverPackageNotInstalledError("SQLite", "sqlite3");
        }
    };
    /**
     * Auto creates database directory if it does not exist.
     */
    SqliteDriver.prototype.createDatabaseDirectory = function (fullPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mkdirp(path.dirname(fullPath))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs the attaching of the database files. The attachedDatabase should have been populated during calls to #buildTableName
     * during EntityMetadata production (see EntityMetadata#buildTablePath)
     *
     * https://sqlite.org/lang_attach.html
     */
    SqliteDriver.prototype.attachDatabases = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, _d, attachHandle, attachFilepathAbsolute, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, 8, 13]);
                        _b = __asyncValues(Object.values(this.attachedDatabases));
                        _e.label = 1;
                    case 1: return [4 /*yield*/, _b.next()];
                    case 2:
                        if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 6];
                        _d = _c.value, attachHandle = _d.attachHandle, attachFilepathAbsolute = _d.attachFilepathAbsolute;
                        return [4 /*yield*/, this.createDatabaseDirectory(attachFilepathAbsolute)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, this.connection.query("ATTACH \"".concat(attachFilepathAbsolute, "\" AS \"").concat(attachHandle, "\""))];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(_b)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SqliteDriver.prototype.getMainDatabasePath = function () {
        var optionsDb = this.options.database;
        return path.dirname(isAbsolute(optionsDb) ? optionsDb : path.join(process.cwd(), optionsDb));
    };
    return SqliteDriver;
}(AbstractSqliteDriver));
export { SqliteDriver };

//# sourceMappingURL=SqliteDriver.js.map
