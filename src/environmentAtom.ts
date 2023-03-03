import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { atom } from 'jotai/vanilla';

const DEFAULT_URL =
  (() => {
    try {
      return process.env.JOTAI_RELAY_DEFAULT_URL;
    } catch {
      return undefined;
    }
  })() || '/graphql';

const defaultEnvironment = new Environment({
  network: Network.create(async (params, variables) => {
    const response = await fetch(DEFAULT_URL, {
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

export const environmentAtom = atom(defaultEnvironment);

if (process.env.NODE_ENV !== 'production') {
  environmentAtom.debugPrivate = true;
}
