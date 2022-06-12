import { environmentAtom, atomWithQuery } from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(environmentAtom).toBeDefined();
    expect(atomWithQuery).toBeDefined();
  });
});
