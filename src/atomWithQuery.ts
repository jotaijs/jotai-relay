import { fetchQuery } from 'relay-runtime';
import type {
  Environment,
  GraphQLTaggedNode,
  OperationType,
} from 'relay-runtime';
import type { Getter, WritableAtom } from 'jotai/vanilla';
import { environmentAtom } from './environmentAtom';
import { createAtom } from './common';

type Config = Parameters<typeof fetchQuery>[3];

type Action = {
  type: 'refetch';
};

export function atomWithQuery<T extends OperationType>(
  taggedNode: GraphQLTaggedNode,
  getVariables: (get: Getter) => T['variables'],
  getConfig?: (get: Getter) => Config,
  getEnvironment: (get: Getter) => Environment = (get) => get(environmentAtom),
): WritableAtom<T['response'], [Action], void> {
  return createAtom(
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
