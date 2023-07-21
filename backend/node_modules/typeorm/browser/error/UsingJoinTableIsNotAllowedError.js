import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UsingJoinTableIsNotAllowedError = /** @class */ (function (_super) {
    __extends(UsingJoinTableIsNotAllowedError, _super);
    function UsingJoinTableIsNotAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinTable on ".concat(entityMetadata.name, "#").concat(relation.propertyName, " is wrong. ") +
            "".concat(entityMetadata.name, "#").concat(relation.propertyName, " has ").concat(relation.relationType, " relation, ") +
            "however you can use JoinTable only on many-to-many relations.") || this;
    }
    return UsingJoinTableIsNotAllowedError;
}(TypeORMError));
export { UsingJoinTableIsNotAllowedError };

//# sourceMappingURL=UsingJoinTableIsNotAllowedError.js.map
