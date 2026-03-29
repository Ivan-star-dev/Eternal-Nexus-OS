import { describe, expect, it } from "vitest";

// TODO: import from actual nervous system when T-002 lands
// import { EventBus } from "@/lib/nervous-system/event-bus";

/**
 * Minimal stub — replace with the real EventBus once T-002 lands.
 * Models the idempotency contract: publishing an event with the same ID twice
 * must not create a duplicate entry in the bus's internal log.
 */
interface NervousEvent {
  id: string;
  type: string;
  payload: unknown;
}

class EventBus {
  private readonly _log: Map<string, NervousEvent> = new Map();

  publish(event: NervousEvent): void {
    // Idempotent: second publish with the same ID is a no-op.
    if (this._log.has(event.id)) return;
    this._log.set(event.id, event);
  }

  get size(): number {
    return this._log.size;
  }

  get(id: string): NervousEvent | undefined {
    return this._log.get(id);
  }
}

describe("nervous-system — idempotent event publishing", () => {
  it("publishing the same event twice should not create a duplicate", () => {
    const bus = new EventBus();
    const event: NervousEvent = {
      id: "evt-00000001",
      type: "sensor.update",
      payload: { source: "climate", value: 31.4 },
    };

    bus.publish(event);
    bus.publish(event); // second publish — must be a no-op

    expect(bus.size).toBe(1);
  });

  it("retains the first payload when the same ID is published again with different data", () => {
    const bus = new EventBus();
    const original: NervousEvent = {
      id: "evt-00000002",
      type: "sensor.update",
      payload: { value: 10 },
    };
    const duplicate: NervousEvent = {
      id: "evt-00000002",
      type: "sensor.update",
      payload: { value: 99 }, // mutated payload — should be ignored
    };

    bus.publish(original);
    bus.publish(duplicate);

    expect(bus.get("evt-00000002")?.payload).toEqual({ value: 10 });
  });

  it("allows distinct events with different IDs to coexist", () => {
    const bus = new EventBus();

    bus.publish({ id: "evt-aaa", type: "ping", payload: null });
    bus.publish({ id: "evt-bbb", type: "ping", payload: null });

    expect(bus.size).toBe(2);
  });
});
