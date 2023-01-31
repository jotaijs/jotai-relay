import { commitMutation } from 'relay-runtime';
import type {
  Disposable,
  Environment,
  MutationConfig,
  MutationParameters,
} from 'relay-runtime';
import { atom } from 'jotai/vanilla';
import type { Getter, WritableAtom } from 'jotai/vanilla';
import { environmentAtom } from './environmentAtom';

export function atomWithMutation<T extends MutationParameters>(
  getEnvironment: (get: Getter) => Environment = (get) => get(environmentAtom),
): WritableAtom<undefined, [MutationConfig<T>], Disposable> {
  const mutationAtom = atom(
    // Don't we have any valid value for this atom??
    undefined,
    (get, _set, config: MutationConfig<T>) => {
      const environment = getEnvironment(get);
      return commitMutation(environment, config);
    },
  );
  return mutationAtom;
}
