import { describe, expect, it } from 'vitest';
import { isValidEmail } from './emailValidation';

describe('isValidEmail', () => {
  it('accepts common valid addresses', () => {
    expect(isValidEmail('user@gmail.com')).toBe(true);
    expect(isValidEmail('name@company.co.uk')).toBe(true);
    expect(isValidEmail('info@getsirty.com')).toBe(true);
  });

  it('rejects invalid TLD typos', () => {
    expect(isValidEmail('dd@gmail.comm')).toBe(false);
    expect(isValidEmail('user@mail.con')).toBe(false);
    expect(isValidEmail('a@b.cpm')).toBe(false);
  });

  it('rejects malformed addresses', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@missing.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });
});
