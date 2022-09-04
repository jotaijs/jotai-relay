import {
  fetchQuery,
  OperationType,
  Environment,
  GraphQLTaggedNode,
  CacheConfig,
  FetchQueryFetchPolicy,
  Subscription,
} from 'relay-runtime';
import { atom } from 'jotai';
import type { Getter } from 'jotai';
import { environmentAtom } from './environmentAtom';

type Timeout = ReturnType<typeof setTimeout>;

type AtomWithQueryAction = {
  type: 'refetch';
};

type Options = {
  getEnvironment?: (get: Getter) => Environment;
  networkCacheConfig?: CacheConfig | null | undefined;
  fetchPolicy?: FetchQueryFetchPolicy | null | undefined;
};

export function atomWithQuery<T extends OperationType>(
  taggedNode: GraphQLTaggedNode,
  getVariables: (get: Getter) => T['variables'],
  options?: Options,
) {
  type Response = T['response'];
  type Result = { response: Response } | { error: Error };
  const queryResultAtom = atom((get) => {
    const variables = getVariables(get);
    const { getEnvironment, ...fetchQueryOptions } = options || {};
    const environment = getEnvironment
      ? getEnvironment(get)
      : get(environmentAtom);
    let resolve: ((result: Result) => void) | null = null;
    const setResolve = (r: (result: Result) => void) => {
      resolve = r;
    };
    const resultAtom = atom<Result | Promise<Result>>(
      new Promise<Result>(setResolve),
    );
    let setResult: ((result: Result) => void) | null = null;
    const listener = (result: Result) => {
      if (!resolve && !setResult) {
        throw new Error('setting result without mount');
      }
      if (resolve) {
        resolve(result);
        resolve = null;
      }
      if (setResult) {
        setResult(result);
      }
    };
    let subscription: Subscription | null = null;
    let timer: Timeout | undefined;
    const startQuery = () => {
      if (subscription) {
        clearTimeout(timer);
        subscription.unsubscribe();
      }
      subscription = fetchQuery(
        environment,
        taggedNode,
        variables,
        fetchQueryOptions,
      ).subscribe({
        next: (response: Response) => listener({ response }),
        error: (error: Error) => listener({ error }),
      });
      if (!setResult) {
        // not mounted yet
        timer = setTimeout(() => {
          if (subscription) {
            subscription.unsubscribe();
            subscription = null;
          }
        }, 1000);
      }
    };
    startQuery();
    resultAtom.onMount = (update) => {
      setResult = update;
      if (subscription) {
        clearTimeout(timer as Timeout);
      } else {
        startQuery();
      }
      return () => {
        setResult = null;
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      };
    };
    return { resultAtom, setResolve, startQuery };
  });
  const queryAtom = atom(
    (get) => {
      const queryResult = get(queryResultAtom);
      const { resultAtom } = queryResult;
      const result = get(resultAtom);
      if ('error' in result) {
        throw result.error;
      }
      return result.response;
    },
    (get, set, action: AtomWithQueryAction) => {
      switch (action.type) {
        case 'refetch': {
          const { resultAtom, setResolve, startQuery } = get(queryResultAtom);
          set(
            resultAtom,
            new Promise<Result>((r) => {
              setResolve(r);
            }),
          );
          startQuery();
          return;
        }
        default: {
          throw new Error(`Unknown action type: ${action.type}`);
        }
      }
    },
  );
  return queryAtom;
}
