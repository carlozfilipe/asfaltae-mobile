import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UsingJoinTableOnlyOnOneSideAllowedError = /** @class */ (function (_super) {
    __extends(UsingJoinTableOnlyOnOneSideAllowedError, _super);
    function UsingJoinTableOnlyOnOneSideAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinTable is allowed only on one side of the many-to-many relationship. " +
            "Both ".concat(entityMetadata.name, "#").concat(relation.propertyName, " and ").concat(relation.inverseEntityMetadata.name, "#").concat(relation.inverseRelation.propertyName, " ") +
            "has JoinTable decorators. Choose one of them and left JoinColumn decorator only on it.") || this;
    }
    return UsingJoinTableOnlyOnOneSideAllowedError;
}(TypeORMError));
export { UsingJoinTableOnlyOnOneSideAllowedError };

//# sourceMappingURL=UsingJoinTableOnlyOnOneSideAllowedError.js.map
