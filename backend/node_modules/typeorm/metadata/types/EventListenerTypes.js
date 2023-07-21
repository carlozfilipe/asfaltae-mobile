"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListenerTypes = void 0;
/**
 * Provides a constants for each entity listener type.
 */
var EventListenerTypes = /** @class */ (function () {
    function EventListenerTypes() {
    }
    EventListenerTypes.AFTER_LOAD = "after-load";
    EventListenerTypes.BEFORE_INSERT = "before-insert";
    EventListenerTypes.AFTER_INSERT = "after-insert";
    EventListenerTypes.BEFORE_UPDATE = "before-update";
    EventListenerTypes.AFTER_UPDATE = "after-update";
    EventListenerTypes.BEFORE_REMOVE = "before-remove";
    EventListenerTypes.AFTER_REMOVE = "after-remove";
    EventListenerTypes.BEFORE_SOFT_REMOVE = "before-soft-remove";
    EventListenerTypes.AFTER_SOFT_REMOVE = "after-soft-remove";
    EventListenerTypes.BEFORE_RECOVER = "before-recover";
    EventListenerTypes.AFTER_RECOVER = "after-recover";
    return EventListenerTypes;
}());
exports.EventListenerTypes = EventListenerTypes;

//# sourceMappingURL=EventListenerTypes.js.map
