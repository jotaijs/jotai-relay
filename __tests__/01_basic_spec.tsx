import {
  environmentAtom,
  atomWithQuery,
  atomWithMutation,
  atomWithSubscription,
} from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(environmentAtom).toBeDefined();
    expect(atomWithQuery).toBeDefined();
    expect(atomWithMutation).toBeDefined();
    expect(atomWithSubscription).toBeDefined();
  });
});
