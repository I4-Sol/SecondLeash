import * as bcrypt from 'bcrypt';

describe('Password Hashing', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'TestPassword123!';
    const hash = await bcrypt.hash(password, 12);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await bcrypt.compare('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });
});
