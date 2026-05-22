class EventBus {
    constructor() {
        this.handlers = new Map();
    }
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(handler);
    }
    off(event, handler) {
        this.handlers.get(event)?.delete(handler);
    }
    emit(event, payload) {
        this.handlers.get(event)?.forEach((fn) => {
            try {
                fn(payload);
            }
            catch (e) {
                console.error(`[EventBus] ${event} 处理器异常:`, e);
            }
        });
    }
    clear() {
        this.handlers.clear();
    }
}
export const bus = new EventBus();
//# sourceMappingURL=EventBus.js.map