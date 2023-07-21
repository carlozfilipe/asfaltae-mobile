"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importJsonsFromDirectories = exports.importClassesFromDirectories = void 0;
var tslib_1 = require("tslib");
var glob_1 = (0, tslib_1.__importDefault)(require("glob"));
var PlatformTools_1 = require("../platform/PlatformTools");
var EntitySchema_1 = require("../entity-schema/EntitySchema");
var ImportUtils_1 = require("./ImportUtils");
/**
 * Loads all exported classes from the given directory.
 */
function importClassesFromDirectories(logger, directories, formats) {
    if (formats === void 0) { formats = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"]; }
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        function loadFileClasses(exported, allLoaded) {
            if (typeof exported === "function" || exported instanceof EntitySchema_1.EntitySchema) {
                allLoaded.push(exported);
            }
            else if (Array.isArray(exported)) {
                exported.forEach(function (i) { return loadFileClasses(i, allLoaded); });
            }
            else if (typeof exported === "object" && exported !== null) {
                Object.keys(exported).forEach(function (key) { return loadFileClasses(exported[key], allLoaded); });
            }
            return allLoaded;
        }
        var logLevel, classesNotFoundMessage, classesFoundMessage, allFiles, dirPromises, dirs;
        var _this = this;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logLevel = "info";
                    classesNotFoundMessage = "No classes were found using the provided glob pattern: ";
                    classesFoundMessage = "All classes found using provided glob pattern";
                    allFiles = directories.reduce(function (allDirs, dir) {
                        return allDirs.concat(glob_1.default.sync(PlatformTools_1.PlatformTools.pathNormalize(dir)));
                    }, []);
                    if (directories.length > 0 && allFiles.length === 0) {
                        logger.log(logLevel, "".concat(classesNotFoundMessage, " \"").concat(directories, "\""));
                    }
                    else if (allFiles.length > 0) {
                        logger.log(logLevel, "".concat(classesFoundMessage, " \"").concat(directories, "\" : \"").concat(allFiles, "\""));
                    }
                    dirPromises = allFiles
                        .filter(function (file) {
                        var dtsExtension = file.substring(file.length - 5, file.length);
                        return formats.indexOf(PlatformTools_1.PlatformTools.pathExtname(file)) !== -1 && dtsExtension !== ".d.ts";
                    })
                        .map(function (file) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                        var _a, importOrRequireResult;
                        return (0, tslib_1.__generator)(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, ImportUtils_1.importOrRequireFile)(PlatformTools_1.PlatformTools.pathResolve(file))];
                                case 1:
                                    _a = tslib_1.__read.apply(void 0, [_b.sent(), 1]), importOrRequireResult = _a[0];
                                    return [2 /*return*/, importOrRequireResult];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(dirPromises)];
                case 1:
                    dirs = _a.sent();
                    return [2 /*return*/, loadFileClasses(dirs, [])];
            }
        });
    });
}
exports.importClassesFromDirectories = importClassesFromDirectories;
/**
 * Loads all json files from the given directory.
 */
function importJsonsFromDirectories(directories, format) {
    if (format === void 0) { format = ".json"; }
    var allFiles = directories.reduce(function (allDirs, dir) {
        return allDirs.concat(glob_1.default.sync(PlatformTools_1.PlatformTools.pathNormalize(dir)));
    }, []);
    return allFiles
        .filter(function (file) { return PlatformTools_1.PlatformTools.pathExtname(file) === format; })
        .map(function (file) { return require(PlatformTools_1.PlatformTools.pathResolve(file)); });
}
exports.importJsonsFromDirectories = importJsonsFromDirectories;

//# sourceMappingURL=DirectoryExportedClassesLoader.js.map
