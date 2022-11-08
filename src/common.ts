import type { Environment } from 'relay-runtime';
import type { RelayObservable } from 'relay-runtime/lib/network/RelayObservable';
import { atom } from 'jotai';
import type { Getter } from 'jotai';
import { atomWithObservable } from 'jotai/utils';

export const createAtoms = <
  Args,
  Result,
  Action,
  ActionResult extends Promise<void> | void,
>(
  getArgs: (get: Getter) => Args,
  getEnvironment: (get: Getter) => Environment,
  execute: (environment: Environment, args: Args) => RelayObservable<Result>,
  handleAction: (
    action: Action,
    environment: Environment,
    refresh: () => void,
  ) => ActionResult,
) => {
  const refreshAtom = atom(0);

  const observableAtom = atom((get) => {
    get(refreshAtom);
    const args = getArgs(get);
    const environment = getEnvironment(get);
    const observable = execute(environment, args);
    return observable;
  });

  const baseStatusAtom = atom((get) => {
    const observable = get(observableAtom);
    const resultAtom = atomWithObservable(() => observable, {
      initialValue: undefined,
    });
    return resultAtom;
  });

  const statusAtom = atom(
    (get) => {
      const resultAtom = get(baseStatusAtom);
      return get(resultAtom);
    },
    (get, set, action: Action) => {
      const environment = getEnvironment(get);
      const refresh = () => {
        set(refreshAtom, (c) => c + 1);
      };
      return handleAction(action, environment, refresh);
    },
  );

  const baseDataAtom = atom((get) => {
    const observable = get(observableAtom);
    const resultAtom = atomWithObservable(() => observable);
    return resultAtom;
  });

  const dataAtom = atom(
    (get) => {
      const resultAtom = get(baseDataAtom);
      const result = get(resultAtom);
      return result;
    },
    (_get, set, action: Action) => set(statusAtom, action),
  );

  return [dataAtom, statusAtom] as const;
};
