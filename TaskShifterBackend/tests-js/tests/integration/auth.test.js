import { getAuthedClient } from '../helpers/authSetup.js';

describe('Auth Integration', () => {
  let client;

  beforeAll(async () => {
    client = await getAuthedClient();
  });

  test('POST /auth/register → returns accessToken (200)', async () => {
    const res = await client.register({
      email: client.makeEmail(),
      username: client.makeUsername(),
      fullName: 'Integration Tester',
      password: client.makePassword()
    });

    expect([200, 201]).toContain(res.status);
    expect(res.data).toHaveProperty('accessToken');
  });

  test('POST /auth/login → returns accessToken (200)', async () => {
    const email = client.makeEmail();
    const password = client.makePassword();
    const username = client.makeUsername();

    const reg = await client.register({
      email, username, fullName: 'Test Login', password
    });
    expect([200, 201]).toContain(reg.status);

    const res = await client.login({ email, password });
    expect([200, 201]).toContain(res.status);
    expect(res.data).toHaveProperty('accessToken');
  });

  test('POST /auth/login → 400 for bad payload', async () => {
    const res = await client.login({});
    expect([400, 422]).toContain(res.status);
  });
});
