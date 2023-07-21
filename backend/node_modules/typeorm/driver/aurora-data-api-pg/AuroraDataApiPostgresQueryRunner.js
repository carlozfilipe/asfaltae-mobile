"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraDataApiPostgresQueryRunner = void 0;
var tslib_1 = require("tslib");
var QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
var TransactionNotStartedError_1 = require("../../error/TransactionNotStartedError");
var PostgresQueryRunner_1 = require("../postgres/PostgresQueryRunner");
var QueryResult_1 = require("../../query-runner/QueryResult");
var PostgresQueryRunnerWrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PostgresQueryRunnerWrapper, _super);
    function PostgresQueryRunnerWrapper(driver, mode) {
        return _super.call(this, driver, mode) || this;
    }
    return PostgresQueryRunnerWrapper;
}(PostgresQueryRunner_1.PostgresQueryRunner));
/**
 * Runs queries on a single postgres database connection.
 */
var AuroraDataApiPostgresQueryRunner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AuroraDataApiPostgresQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function AuroraDataApiPostgresQueryRunner(driver, client, mode) {
        var _this = _super.call(this, driver, mode) || this;
        _this.client = client;
        return _this;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    AuroraDataApiPostgresQueryRunner.prototype.connect = function () {
        var _this = this;
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);
        if (this.databaseConnectionPromise)
            return this.databaseConnectionPromise;
        if (this.mode === "slave" && this.driver.isReplicated) {
            this.databaseConnectionPromise = this.driver.obtainSlaveConnection().then(function (_a) {
                var _b = (0, tslib_1.__read)(_a, 2), connection = _b[0], release = _b[1];
                _this.driver.connectedQueryRunners.push(_this);
                _this.databaseConnection = connection;
                _this.releaseCallback = release;
                return _this.databaseConnection;
            });
        }
        else { // master
            this.databaseConnectionPromise = this.driver.obtainMasterConnection().then(function (_a) {
                var _b = (0, tslib_1.__read)(_a, 2), connection = _b[0], release = _b[1];
                _this.driver.connectedQueryRunners.push(_this);
                _this.databaseConnection = connection;
                _this.releaseCallback = release;
                return _this.databaseConnection;
            });
        }
        return this.databaseConnectionPromise;
    };
    /**
     * Starts transaction on the current connection.
     */
    AuroraDataApiPostgresQueryRunner.prototype.startTransaction = function (isolationLevel) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var err_1;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        if (!(this.transactionDepth === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.client.startTransaction()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.query("SAVEPOINT typeorm_".concat(this.transactionDepth))];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        this.transactionDepth += 1;
                        return [4 /*yield*/, this.broadcaster.broadcast('AfterTransactionStart')];
                    case 9:
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
    AuroraDataApiPostgresQueryRunner.prototype.commitTransaction = function () {
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
                    case 3: return [4 /*yield*/, this.client.commitTransaction()];
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
    AuroraDataApiPostgresQueryRunner.prototype.rollbackTransaction = function () {
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
                    case 3: return [4 /*yield*/, this.client.rollbackTransaction()];
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
     * Executes a given SQL query.
     */
    AuroraDataApiPostgresQueryRunner.prototype.query = function (query, parameters, useStructuredResult) {
        if (useStructuredResult === void 0) { useStructuredResult = false; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var raw, result;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.client.query(query, parameters)];
                    case 1:
                        raw = _a.sent();
                        result = new QueryResult_1.QueryResult();
                        result.raw = raw;
                        if ((raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('records')) && Array.isArray(raw.records)) {
                            result.records = raw.records;
                        }
                        if (raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('numberOfRecordsUpdated')) {
                            result.affected = raw.numberOfRecordsUpdated;
                        }
                        if (!useStructuredResult) {
                            return [2 /*return*/, result.raw];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return AuroraDataApiPostgresQueryRunner;
}(PostgresQueryRunnerWrapper));
exports.AuroraDataApiPostgresQueryRunner = AuroraDataApiPostgresQueryRunner;

//# sourceMappingURL=AuroraDataApiPostgresQueryRunner.js.map
