import { hash } from "./StringUtils";
var WINDOWS_PATH_REGEXP = /^([a-zA-Z]:.*)$/;
var UNC_WINDOWS_PATH_REGEXP = /^\\\\(\.\\)?(.*)$/;
export function toPortablePath(filepath) {
    if (process.platform !== "win32")
        return filepath;
    if (filepath.match(WINDOWS_PATH_REGEXP))
        filepath = filepath.replace(WINDOWS_PATH_REGEXP, "/$1");
    else if (filepath.match(UNC_WINDOWS_PATH_REGEXP))
        filepath = filepath.replace(UNC_WINDOWS_PATH_REGEXP, function (match, p1, p2) { return "/unc/".concat(p1 ? ".dot/" : "").concat(p2); });
    return filepath.replace(/\\/g, "/");
}
/**
 * Create deterministic valid database name (class, database) of fixed length from any filepath. Equivalent paths for windows/posix systems should
 * be equivalent to enable portability
 */
export function filepathToName(filepath) {
    var uniq = toPortablePath(filepath).toLowerCase();
    return hash(uniq, { length: 63 });
}
/**
 * Cross platform isAbsolute
 */
export function isAbsolute(filepath) {
    return !!filepath.match(/^(?:[a-z]:|[\\]|[\/])/i);
}

//# sourceMappingURL=PathUtils.js.map
