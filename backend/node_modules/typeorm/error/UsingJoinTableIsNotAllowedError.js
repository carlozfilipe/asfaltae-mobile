"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsingJoinTableIsNotAllowedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var UsingJoinTableIsNotAllowedError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UsingJoinTableIsNotAllowedError, _super);
    function UsingJoinTableIsNotAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinTable on ".concat(entityMetadata.name, "#").concat(relation.propertyName, " is wrong. ") +
            "".concat(entityMetadata.name, "#").concat(relation.propertyName, " has ").concat(relation.relationType, " relation, ") +
            "however you can use JoinTable only on many-to-many relations.") || this;
    }
    return UsingJoinTableIsNotAllowedError;
}(TypeORMError_1.TypeORMError));
exports.UsingJoinTableIsNotAllowedError = UsingJoinTableIsNotAllowedError;

//# sourceMappingURL=UsingJoinTableIsNotAllowedError.js.map
