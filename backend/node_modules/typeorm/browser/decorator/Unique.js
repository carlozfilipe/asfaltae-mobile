import { getMetadataArgsStorage } from "../globals";
/**
 * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
 */
export function Unique(nameOrFieldsOrOptions, maybeFieldsOrOptions, maybeOptions) {
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
        getMetadataArgsStorage().uniques.push(args);
    };
}

//# sourceMappingURL=Unique.js.map
