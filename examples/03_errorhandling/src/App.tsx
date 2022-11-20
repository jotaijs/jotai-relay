import React, { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Provider, useAtom, useSetAtom } from 'jotai/react';
import { atom, createStore } from 'jotai/vanilla';
import { environmentAtom, atomWithQuery } from 'jotai-relay';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
// eslint-disable-next-line
// @ts-ignore
import graphql from 'babel-plugin-relay/macro';

import type {
  AppCountriesQuery,
  CountryFilterInput,
} from './__generated__/AppCountriesQuery.graphql';

const myEnvironment = new Environment({
  network: Network.create(async (params, variables) => {
    const response = await fetch('https://countries.trevorblades.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });
    return response.json();
  }),
  store: new Store(new RecordSource()),
});

const filterAtom = atom<CountryFilterInput | null>({});

const countriesAtom = atomWithQuery<AppCountriesQuery>(
  graphql`
    query AppCountriesQuery($filter: CountryFilterInput) {
      countries(filter: $filter) {
        name
      }
    }
  `,
  (get) => ({ filter: get(filterAtom) }),
);

const Main = () => {
  const [data, dispatch] = useAtom(countriesAtom);
  const setFilter = useSetAtom(filterAtom);
  return (
    <div>
      <button type="button" onClick={() => setFilter(null)}>
        Make error
      </button>
      <button type="button" onClick={() => dispatch({ type: 'refetch' })}>
        Refetch
      </button>
      <ul>
        {data.countries.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const setFilter = useSetAtom(filterAtom);
  const dispatch = useSetAtom(countriesAtom);
  const retry = () => {
    setFilter({});
    dispatch({ type: 'refetch' });
    resetErrorBoundary();
  };
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button type="button" onClick={retry}>
        Try again
      </button>
    </div>
  );
};

const store = createStore();
store.set(environmentAtom, myEnvironment);

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Suspense fallback="Loading...">
          <Main />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
