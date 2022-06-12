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
  const queryResultAtom = atom((get) => {
    const environment = options?.getEnvironment
      ? options.getEnvironment(get)
      : get(environmentAtom);
    const variables = getVariables(get);
    let resolve: ((result: Response) => void) | null = null;
    const resultAtom = atom<Response | Promise<Response>>(
      new Promise<Response>((r) => {
        resolve = r;
      }),
    );
    let setResult: (result: Response | Promise<Response>) => void = () => {
      throw new Error('setting result without mount');
    };
    const listener = (result: Response) => {
      if (resolve) {
        resolve(result);
        resolve = null;
      } else {
        setResult(result);
      }
    };
    let subscription: Subscription | null = fetchQuery(
      environment,
      taggedNode,
      variables,
    ).subscribe({
      next: listener,
      // TODO error handling
    });
    const timer = setTimeout(() => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    }, 1000);
    resultAtom.onMount = (update) => {
      setResult = update;
      if (subscription) {
        clearTimeout(timer);
      } else {
        subscription = fetchQuery(environment, taggedNode, variables).subscribe(
          {
            next: listener,
            // TODO error handling
          },
        );
      }
      return () => subscription?.unsubscribe();
    };
    return { resultAtom };
  });
  const queryAtom = atom((get) => {
    const queryResult = get(queryResultAtom);
    const { resultAtom } = queryResult;
    return get(resultAtom);
  });
  return queryAtom;
}
