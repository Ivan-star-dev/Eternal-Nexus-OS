// ═══════════════════════════════════════════════════════════════
// React hooks for ReactiveWorkerFSM
//
// useReactiveWorkerFSM — creates and manages an FSM instance
// useFSMSelector — subscribes to a slice of FSM context
// Convenience hooks: useWorkerState, useActiveSource, useConfidence
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  ReactiveWorkerFSM,
  type FSMContext,
  type FSMEvent,
  type FSMConfig,
  type WorkerState,
} from "@/lib/state/reactive-worker-fsm";

interface UseReactiveFSMReturn {
  state: WorkerState;
  context: FSMContext;
  confidence: number;
  shouldUseWorker: boolean;
  activeSource: "worker" | "fallback";
  send: (event: FSMEvent) => void;
  fsm: ReactiveWorkerFSM;
}

export function useReactiveWorkerFSM(
  config?: Partial<FSMConfig>
): UseReactiveFSMReturn {
  const fsmRef = useRef<ReactiveWorkerFSM | null>(null);

  if (!fsmRef.current) {
    fsmRef.current = new ReactiveWorkerFSM(config);
  }

  const fsm = fsmRef.current;

  const [state, setState] = useState<WorkerState>(() => fsm.getContext().state);
  const [context, setContext] = useState<FSMContext>(() => fsm.getContext());
  const [confidence, setConfidence] = useState(() => fsm.getContext().confidence);
  const [activeSource, setActiveSource] = useState<"worker" | "fallback">(
    () => fsm.getContext().activeSource
  );

  useEffect(() => {
    const unsubs = [
      fsm.subscribe((ctx) => ctx.state, setState),
      fsm.subscribe((ctx) => ctx.confidence, setConfidence),
      fsm.subscribe((ctx) => ctx.activeSource, setActiveSource),
      fsm.subscribe((ctx) => ({ ...ctx }), setContext),
    ];
    return () => unsubs.forEach((u) => u());
  }, [fsm]);

  useEffect(() => {
    return () => {
      fsmRef.current?.destroy();
    };
  }, []);

  const send = useCallback(
    (event: FSMEvent) => {
      fsm.send(event);
    },
    [fsm]
  );

  const shouldUseWorker = useMemo(() => fsm.shouldUseWorker(), [state]);

  return { state, context, confidence, shouldUseWorker, activeSource, send, fsm };
}

/** Subscribe to a specific slice of FSM context */
export function useFSMSelector<T>(
  fsm: ReactiveWorkerFSM,
  selector: (ctx: FSMContext) => T
): T {
  const [value, setValue] = useState(() => selector(fsm.getContext()));

  useEffect(() => {
    return fsm.subscribe(selector, setValue);
  }, [fsm, selector]);

  return value;
}

/** Convenience: current FSM state */
export function useWorkerState(fsm: ReactiveWorkerFSM): WorkerState {
  return useFSMSelector(fsm, (ctx) => ctx.state);
}

/** Convenience: active data source */
export function useActiveSource(fsm: ReactiveWorkerFSM): "worker" | "fallback" {
  return useFSMSelector(fsm, (ctx) => ctx.activeSource);
}

/** Convenience: confidence score */
export function useConfidence(fsm: ReactiveWorkerFSM): number {
  return useFSMSelector(fsm, (ctx) => ctx.confidence);
}

/** Convenience: latency stats */
export function useLatencyStats(fsm: ReactiveWorkerFSM) {
  return useFSMSelector(
    fsm,
    useCallback(
      (ctx: FSMContext) => ({
        last: ctx.lastLatencyMs,
        p50: ctx.latencyP50,
        p90: ctx.latencyP90,
      }),
      []
    )
  );
}
