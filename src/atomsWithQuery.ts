import { fetchQuery } from 'relay-runtime';
import type {
  CacheConfig,
  Environment,
  FetchQueryFetchPolicy,
  GraphQLTaggedNode,
  OperationType,
} from 'relay-runtime';
import type { Getter, WritableAtom } from 'jotai';
import { environmentAtom } from './environmentAtom';
import { createAtoms } from './common';

type Config = {
  networkCacheConfig?: CacheConfig;
  fetchPolicy?: FetchQueryFetchPolicy;
};

type Action = {
  type: 'refetch';
};

export function atomsWithQuery<T extends OperationType>(
  taggedNode: GraphQLTaggedNode,
  getVariables: (get: Getter) => T['variables'],
  getConfig?: (get: Getter) => Config,
  getEnvironment: (get: Getter) => Environment = (get) => get(environmentAtom),
): readonly [
  dataAtom: WritableAtom<T['response'], Action>,
  statusAtom: WritableAtom<T['response'] | undefined, Action>,
] {
  return createAtoms(
    (get) => [taggedNode, getVariables(get), getConfig?.(get)] as const,
    getEnvironment,
    (environment, args) => fetchQuery(environment, ...args),
    (action, _environment, refresh) => {
      if (action.type === 'refetch') {
        refresh();
      }
    },
  );
}
