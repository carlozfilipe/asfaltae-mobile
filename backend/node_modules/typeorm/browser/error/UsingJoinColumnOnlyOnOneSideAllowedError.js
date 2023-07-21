import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UsingJoinColumnOnlyOnOneSideAllowedError = /** @class */ (function (_super) {
    __extends(UsingJoinColumnOnlyOnOneSideAllowedError, _super);
    function UsingJoinColumnOnlyOnOneSideAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinColumn is allowed only on one side of the one-to-one relationship. " +
            "Both ".concat(entityMetadata.name, "#").concat(relation.propertyName, " and ").concat(relation.inverseEntityMetadata.name, "#").concat(relation.inverseRelation.propertyName, " ") +
            "has JoinTable decorators. Choose one of them and left JoinTable decorator only on it.") || this;
    }
    return UsingJoinColumnOnlyOnOneSideAllowedError;
}(TypeORMError));
export { UsingJoinColumnOnlyOnOneSideAllowedError };

//# sourceMappingURL=UsingJoinColumnOnlyOnOneSideAllowedError.js.map
