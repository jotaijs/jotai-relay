import type { Environment, Subscribable } from 'relay-runtime';
import { atom } from 'jotai/vanilla';
import type { Getter } from 'jotai/vanilla';
import { atomWithObservable } from 'jotai/vanilla/utils';

export const createAtom = <Args, Result, Action, ActionResult>(
  getArgs: (get: Getter) => Args,
  getEnvironment: (get: Getter) => Environment,
  execute: (environment: Environment, args: Args) => Subscribable<Result>,
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
    (get, set, action: Action) => {
      const environment = getEnvironment(get);
      const refresh = () => {
        set(refreshAtom, (c) => c + 1);
      };
      return handleAction(action, environment, refresh);
    },
  );

  return dataAtom;
};
