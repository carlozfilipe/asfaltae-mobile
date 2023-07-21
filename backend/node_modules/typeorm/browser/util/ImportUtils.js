import { __awaiter, __generator } from "tslib";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
export function importOrRequireFile(filePath) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var tryToImport, tryToRequire, extension, packageJson, isModule;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tryToImport = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Function("return filePath => import(filePath)")()(filePath.startsWith("file://") ? filePath : pathToFileURL(filePath).toString())];
                                case 1: 
                                // `Function` is required to make sure the `import` statement wil stay `import` after
                                // transpilation and won't be converted to `require`
                                return [2 /*return*/, [_a.sent(), "esm"]];
                            }
                        });
                    }); };
                    tryToRequire = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, [require(filePath), "commonjs"]];
                        });
                    }); };
                    extension = filePath.substring(filePath.lastIndexOf(".") + ".".length);
                    if (!(extension === "mjs" || extension === "mts")) return [3 /*break*/, 1];
                    return [2 /*return*/, tryToImport()];
                case 1:
                    if (!(extension === "cjs" || extension === "cts")) return [3 /*break*/, 2];
                    return [2 /*return*/, tryToRequire()];
                case 2:
                    if (!(extension === "js" || extension === "ts")) return [3 /*break*/, 4];
                    return [4 /*yield*/, getNearestPackageJson(filePath)];
                case 3:
                    packageJson = _b.sent();
                    if (packageJson != null) {
                        isModule = ((_a = packageJson) === null || _a === void 0 ? void 0 : _a.type) === "module";
                        if (isModule)
                            return [2 /*return*/, tryToImport()];
                        else
                            return [2 /*return*/, tryToRequire()];
                    }
                    else
                        return [2 /*return*/, tryToRequire()];
                    _b.label = 4;
                case 4: return [2 /*return*/, tryToRequire()];
            }
        });
    });
}
function getNearestPackageJson(filePath) {
    return new Promise(function (accept) {
        var currentPath = filePath;
        function searchPackageJson() {
            var nextPath = path.dirname(currentPath);
            if (currentPath === nextPath) // the top of the file tree is reached
                accept(null);
            else {
                currentPath = nextPath;
                var potentialPackageJson_1 = path.join(currentPath, "package.json");
                fs.stat(potentialPackageJson_1, function (err, stats) {
                    if (err != null)
                        searchPackageJson();
                    else if (stats.isFile()) {
                        fs.readFile(potentialPackageJson_1, "utf8", function (err, data) {
                            if (err != null)
                                accept(null);
                            else {
                                try {
                                    accept(JSON.parse(data));
                                }
                                catch (err) {
                                    accept(null);
                                }
                            }
                        });
                    }
                    else
                        searchPackageJson();
                });
            }
        }
        searchPackageJson();
    });
}

//# sourceMappingURL=ImportUtils.js.map
