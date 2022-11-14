import {
  environmentAtom,
  atomsWithQuery,
  atomsWithMutation,
  atomsWithSubscription,
} from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(environmentAtom).toBeDefined();
    expect(atomsWithQuery).toBeDefined();
    expect(atomsWithMutation).toBeDefined();
    expect(atomsWithSubscription).toBeDefined();
  });
});
