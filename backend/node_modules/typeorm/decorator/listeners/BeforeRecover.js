"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeRecover = void 0;
var globals_1 = require("../../globals");
var EventListenerTypes_1 = require("../../metadata/types/EventListenerTypes");
/**
 * Calls a method on which this decorator is applied before this entity soft removal.
 */
function BeforeRecover() {
    return function (object, propertyName) {
        (0, globals_1.getMetadataArgsStorage)().entityListeners.push({
            target: object.constructor,
            propertyName: propertyName,
            type: EventListenerTypes_1.EventListenerTypes.BEFORE_RECOVER
        });
    };
}
exports.BeforeRecover = BeforeRecover;

//# sourceMappingURL=BeforeRecover.js.map
