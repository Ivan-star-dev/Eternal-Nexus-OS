import { describe, expect, it } from "vitest";

// TODO: import from actual nervous system when T-002 lands
// import { EventBus, ReplayCursor } from "@/lib/nervous-system/event-bus";

/**
 * Minimal stub — replace with the real EventBus replay API once T-002 lands.
 * A cursor is an opaque position marker (here: the index into the ordered log)
 * from which a client can receive all subsequent events.
 */
interface NervousEvent {
  id: string;
  type: string;
  payload: unknown;
  sequence: number; // monotonically increasing, assigned by the bus on publish
}

type Cursor = number; // sequence number of the last event the client has seen

class EventBus {
  private readonly _log: NervousEvent[] = [];
  private _sequence = 0;

  publish(event: Omit<NervousEvent, "sequence">): void {
    this._log.push({ ...event, sequence: ++this._sequence });
  }

  /**
   * Returns all events with sequence > cursor.
   * Passing cursor = 0 replays everything from the beginning.
   */
  replayFrom(cursor: Cursor): NervousEvent[] {
    return this._log.filter((e) => e.sequence > cursor);
  }

  get head(): Cursor {
    return this._sequence;
  }
}

describe("nervous-system — replay from cursor", () => {
  it("clients should be able to replay events from a given cursor", () => {
    const bus = new EventBus();

    bus.publish({ id: "evt-001", type: "a", payload: null });
    bus.publish({ id: "evt-002", type: "b", payload: null });

    // Client joins after the first two events and records where it is now.
    const cursor: Cursor = bus.head;

    bus.publish({ id: "evt-003", type: "c", payload: null });
    bus.publish({ id: "evt-004", type: "d", payload: null });

    const replayed = bus.replayFrom(cursor);

    expect(replayed).toHaveLength(2);
    expect(replayed.map((e) => e.id)).toEqual(["evt-003", "evt-004"]);
  });

  it("cursor = 0 replays all events from the beginning", () => {
    const bus = new EventBus();

    bus.publish({ id: "evt-001", type: "a", payload: null });
    bus.publish({ id: "evt-002", type: "b", payload: null });
    bus.publish({ id: "evt-003", type: "c", payload: null });

    const replayed = bus.replayFrom(0);

    expect(replayed).toHaveLength(3);
  });

  it("replaying from the current head returns an empty array", () => {
    const bus = new EventBus();

    bus.publish({ id: "evt-001", type: "a", payload: null });
    bus.publish({ id: "evt-002", type: "b", payload: null });

    const replayed = bus.replayFrom(bus.head);

    expect(replayed).toHaveLength(0);
  });

  it("events are returned in publication order", () => {
    const bus = new EventBus();

    bus.publish({ id: "evt-001", type: "a", payload: null });
    bus.publish({ id: "evt-002", type: "b", payload: null });
    bus.publish({ id: "evt-003", type: "c", payload: null });

    const replayed = bus.replayFrom(0);
    const sequences = replayed.map((e) => e.sequence);

    expect(sequences).toEqual([...sequences].sort((a, b) => a - b));
  });
});
