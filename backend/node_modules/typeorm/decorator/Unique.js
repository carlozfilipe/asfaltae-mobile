"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unique = void 0;
var globals_1 = require("../globals");
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 */
function Unique(nameOrFieldsOrOptions, maybeFieldsOrOptions, maybeOptions) {
    var name = typeof nameOrFieldsOrOptions === "string" ? nameOrFieldsOrOptions : undefined;
    var fields = typeof nameOrFieldsOrOptions === "string" ? maybeFieldsOrOptions : nameOrFieldsOrOptions;
    var options = (typeof nameOrFieldsOrOptions === "object" && !Array.isArray(nameOrFieldsOrOptions)) ? nameOrFieldsOrOptions : maybeOptions;
    if (!options)
        options = (typeof maybeFieldsOrOptions === "object" && !Array.isArray(maybeFieldsOrOptions)) ? maybeFieldsOrOptions : maybeOptions;
    return function (clsOrObject, propertyName) {
        var columns = fields;
        if (propertyName !== undefined) {
            switch (typeof (propertyName)) {
                case "string":
                    columns = [propertyName];
                    break;
                case "symbol":
                    columns = [propertyName.toString()];
                    break;
            }
        }
        var args = {
            target: propertyName ? clsOrObject.constructor : clsOrObject,
            name: name,
            columns: columns,
            deferrable: options ? options.deferrable : undefined,
        };
        (0, globals_1.getMetadataArgsStorage)().uniques.push(args);
    };
}
exports.Unique = Unique;

//# sourceMappingURL=Unique.js.map
