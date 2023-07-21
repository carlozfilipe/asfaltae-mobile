"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySchemaEmbeddedError = void 0;
var tslib_1 = require("tslib");
var error_1 = require("../error");
var EntitySchemaEmbeddedError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(EntitySchemaEmbeddedError, _super);
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
}(error_1.TypeORMError));
exports.EntitySchemaEmbeddedError = EntitySchemaEmbeddedError;

//# sourceMappingURL=EntitySchemaEmbeddedError.js.map
