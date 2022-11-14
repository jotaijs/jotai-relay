import { commitMutation } from 'relay-runtime';
import type {
  Environment,
  MutationConfig,
  MutationParameters,
} from 'relay-runtime';
import { atom } from 'jotai';
import type { Getter, WritableAtom } from 'jotai';
import { environmentAtom } from './environmentAtom';

export function atomsWithMutation<T extends MutationParameters>(
  getEnvironment: (get: Getter) => Environment = (get) => get(environmentAtom),
): readonly [
  dataAtom: WritableAtom<undefined, MutationConfig<T>>,
  statusAtom: WritableAtom<undefined, MutationConfig<T>>,
] {
  const mutationAtom = atom(
    // Don't we have any valid value for this atom??
    undefined,
    (get, _set, config: MutationConfig<T>) => {
      const environment = getEnvironment(get);
      // TODO return disposable in Jotai v2 API
      commitMutation(environment, config);
    },
  );
  // A little unfortunate to return the same atom
  return [mutationAtom, mutationAtom] as const;
}
