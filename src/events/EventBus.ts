type EventHandler<T = unknown> = (payload: T) => void

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler)
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler as EventHandler)
  }

  emit<T>(event: string, payload: T): void {
    this.handlers.get(event)?.forEach((fn) => {
      try {
        fn(payload)
      } catch (e) {
        console.error(`[EventBus] ${event} 处理器异常:`, e)
      }
    })
  }

  clear(): void {
    this.handlers.clear()
  }
}

export const bus = new EventBus()
