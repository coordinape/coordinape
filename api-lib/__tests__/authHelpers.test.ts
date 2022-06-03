import { hashTokenString } from '../authHelpers';

describe('authHelpers', () => {
  test('hashTokenString', () => {
    expect(hashTokenString('coordinape')).toBe(
      '6c6b826a40341603daef9419ebbd15f4b0ac4047be07e2631f90e1432a06944a'
    );
  });
});
