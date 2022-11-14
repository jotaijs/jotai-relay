import { requestSubscription } from 'relay-runtime';
import type {
  Environment,
  GraphQLTaggedNode,
  OperationType,
  SelectorStoreUpdater,
  Subscribable,
} from 'relay-runtime';
import type { Getter, WritableAtom } from 'jotai';
import { environmentAtom } from './environmentAtom';
import { createAtoms } from './common';

type Configs = Parameters<typeof requestSubscription>[1]['configs'];

type Action = {
  type: 'refetch';
};

export function atomsWithSubscription<T extends OperationType>(
  taggedNode: GraphQLTaggedNode,
  getVariables: (get: Getter) => T['variables'],
  getConfigs?: (get: Getter) => Configs,
  updater?: SelectorStoreUpdater<T['response']>,
  getEnvironment: (get: Getter) => Environment = (get) => get(environmentAtom),
): readonly [
  dataAtom: WritableAtom<T['response'], Action>,
  statusAtom: WritableAtom<T['response'] | undefined, Action>,
] {
  return createAtoms(
    (get) => ({
      configs: getConfigs?.(get),
      subscription: taggedNode,
      variables: getVariables(get),
    }),
    getEnvironment,
    (environment, config) => {
      const subscribable: Subscribable<T['response']> = {
        subscribe: (observer) => {
          const disposable = requestSubscription(environment, {
            ...config,
            updater,
            onNext: observer.next,
            onError: observer.error,
            onCompleted: observer.complete,
          });
          return {
            unsubscribe: () => {
              disposable.dispose();
            },
            closed: false, // HACK we don't use this.
          };
        },
      };
      return subscribable;
    },
    (action, _environment, refresh) => {
      if (action.type === 'refetch') {
        refresh();
      }
    },
  );
}
