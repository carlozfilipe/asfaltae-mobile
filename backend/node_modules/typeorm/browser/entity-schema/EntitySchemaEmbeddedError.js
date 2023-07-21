import { __extends } from "tslib";
import { TypeORMError } from "../error";
var EntitySchemaEmbeddedError = /** @class */ (function (_super) {
    __extends(EntitySchemaEmbeddedError, _super);
    function EntitySchemaEmbeddedError(message) {
        return _super.call(this, message) || this;
    }
    EntitySchemaEmbeddedError.createEntitySchemaIsRequiredException = function (field) {
        return new EntitySchemaEmbeddedError("EntitySchema is required for ".concat(field, " embedded field"));
    };
    EntitySchemaEmbeddedError.createTargetIsRequired = function (field) {
        return new EntitySchemaEmbeddedError("Target field is required for ".concat(field, " embedded EntitySchema"));
    };
    return EntitySchemaEmbeddedError;
}(TypeORMError));
export { EntitySchemaEmbeddedError };

//# sourceMappingURL=EntitySchemaEmbeddedError.js.map
