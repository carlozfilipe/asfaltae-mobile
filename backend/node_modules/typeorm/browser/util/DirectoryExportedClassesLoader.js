import { __awaiter, __generator, __read } from "tslib";
import glob from "glob";
import { PlatformTools } from "../platform/PlatformTools";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { importOrRequireFile } from "./ImportUtils";
/**
 * Loads all exported classes from the given directory.
 */
export function importClassesFromDirectories(logger, directories, formats) {
    if (formats === void 0) { formats = [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts"]; }
    return __awaiter(this, void 0, void 0, function () {
        function loadFileClasses(exported, allLoaded) {
            if (typeof exported === "function" || exported instanceof EntitySchema) {
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
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logLevel = "info";
                    classesNotFoundMessage = "No classes were found using the provided glob pattern: ";
                    classesFoundMessage = "All classes found using provided glob pattern";
                    allFiles = directories.reduce(function (allDirs, dir) {
                        return allDirs.concat(glob.sync(PlatformTools.pathNormalize(dir)));
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
                        return formats.indexOf(PlatformTools.pathExtname(file)) !== -1 && dtsExtension !== ".d.ts";
                    })
                        .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, importOrRequireResult;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, importOrRequireFile(PlatformTools.pathResolve(file))];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 1]), importOrRequireResult = _a[0];
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
/**
 * Loads all json files from the given directory.
 */
export function importJsonsFromDirectories(directories, format) {
    if (format === void 0) { format = ".json"; }
    var allFiles = directories.reduce(function (allDirs, dir) {
        return allDirs.concat(glob.sync(PlatformTools.pathNormalize(dir)));
    }, []);
    return allFiles
        .filter(function (file) { return PlatformTools.pathExtname(file) === format; })
        .map(function (file) { return require(PlatformTools.pathResolve(file)); });
}

//# sourceMappingURL=DirectoryExportedClassesLoader.js.map
