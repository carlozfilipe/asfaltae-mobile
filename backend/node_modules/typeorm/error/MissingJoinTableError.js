"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingJoinTableError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var MissingJoinTableError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MissingJoinTableError, _super);
    function MissingJoinTableError(entityMetadata, relation) {
        var _this = _super.call(this) || this;
        if (relation.inverseRelation) {
            _this.message = "JoinTable is missing on both sides of ".concat(entityMetadata.name, "#").concat(relation.propertyName, " and ") +
                "".concat(relation.inverseEntityMetadata.name, "#").concat(relation.inverseRelation.propertyName, " many-to-many relationship. ") +
                "You need to put decorator decorator on one of the sides.";
        }
        else {
            _this.message = "JoinTable is missing on ".concat(entityMetadata.name, "#").concat(relation.propertyName, " many-to-many relationship. ") +
                "You need to put JoinTable decorator on it.";
        }
        return _this;
    }
    return MissingJoinTableError;
}(TypeORMError_1.TypeORMError));
exports.MissingJoinTableError = MissingJoinTableError;

//# sourceMappingURL=MissingJoinTableError.js.map
