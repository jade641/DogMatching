import { type DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../services/api";

interface AsyncState<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
}

/** Loads data when `deps` change; `reload(true)` refreshes without showing a spinner. */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });
  const fnRef = useRef(fn);
  const callId = useRef(0);

  useEffect(() => {
    fnRef.current = fn;
  });

  const reload = useCallback(async (silent = false) => {
    const id = ++callId.current;
    if (!silent) setState((s) => ({ ...s, loading: true, error: undefined }));
    try {
      const data = await fnRef.current();
      if (id === callId.current) setState({ data, error: undefined, loading: false });
    } catch (e) {
      if (id === callId.current) setState((s) => ({ data: s.data, error: errorMessage(e), loading: false }));
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const setData = useCallback((update: T | ((current: T | undefined) => T)) => {
    setState((s) => ({
      ...s,
      data: typeof update === "function" ? (update as (current: T | undefined) => T)(s.data) : update,
    }));
  }, []);

  return { ...state, reload, setData };
}
