import { useCallback, useEffect, useMemo, useState } from 'react';
import { MosslightState } from '../domain/types';
import { mosslightRepository } from '../data/repositories/mosslightRepository';

export type AppStatus = 'loading' | 'ready' | 'error' | 'saving';

export function useMosslight() {
  const [state, setState] = useState<MosslightState | undefined>();
  const [status, setStatus] = useState<AppStatus>('loading');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let mounted = true;
    mosslightRepository.load().then((result) => {
      if (!mounted) return;
      if (result.error || !result.data) {
        setError(result.error ?? 'Unable to open Mosslight.');
        setStatus('error');
        return;
      }
      setState(result.data);
      setStatus('ready');
    });
    return () => { mounted = false; };
  }, []);

  const transact = useCallback(async (updater: (current: MosslightState) => MosslightState) => {
    if (!state) return;
    setStatus('saving');
    setError(undefined);
    try {
      const next = updater(state);
      setState(next);
      const result = await mosslightRepository.save(next);
      if (result.error) {
        setError(result.error);
        setStatus('error');
        return;
      }
      setState(result.data);
      setStatus('ready');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong.');
      setStatus('ready');
    }
  }, [state]);

  const reset = useCallback(async () => {
    setStatus('loading');
    const result = await mosslightRepository.reset();
    if (result.error || !result.data) {
      setError(result.error ?? 'Unable to reset sanctuary.');
      setStatus('error');
      return;
    }
    setState(result.data);
    setStatus('ready');
  }, []);

  return useMemo(() => ({ state, status, error, transact, reset }), [state, status, error, transact, reset]);
}
