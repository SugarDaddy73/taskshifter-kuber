import { getAuthedClient } from '../helpers/authSetup.js';

describe('Users Integration', () => {
  let client;
  let userId;

  beforeAll(async () => {
    client = await getAuthedClient();
  });

  test('GET /users/profile → returns profile', async () => {
    const res = await client.getProfile();
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('email');
    userId = res.data.id;
  });

  test('PUT /users/profile → updates all fields correctly', async () => {
    const updatedData = {
      email: 'updatedemail@example.com',
      username: 'UpdatedUser',
      fullName: 'Updated Name'
    };

    const res = await client.updateProfile(updatedData);
    expect([200, 204]).toContain(res.status);

    const verify = await client.getProfile();
    expect(verify.status).toBe(200);
    expect(verify.data.email).toBe(updatedData.email);
    expect(verify.data.username).toBe(updatedData.username);
    expect(verify.data.fullName).toBe(updatedData.fullName);
  });

  test('GET /users/profile/{id} → returns correct user by id', async () => {
    const res = await client.getUserById(userId);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(userId);
  });

  test('PUT /users/password → invalid body => 400/422', async () => {
    const res = await client.updatePassword({});
    expect([400, 422]).toContain(res.status);
  });
});
