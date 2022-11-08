import { environmentAtom, atomsWithQuery } from '../src/index';

describe('basic spec', () => {
  it('should export functions', () => {
    expect(environmentAtom).toBeDefined();
    expect(atomsWithQuery).toBeDefined();
  });
});
