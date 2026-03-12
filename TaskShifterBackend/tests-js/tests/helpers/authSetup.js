import ApiClient from './apiClient.js';

export async function getAuthedClient() {
  const client = new ApiClient();
  const email = client.makeEmail();
  const username = client.makeUsername();
  const fullName = 'Test User';
  const password = client.makePassword();

  const res = await client.register({ email, username, fullName, password });
  if (![200, 201].includes(res.status))
    throw new Error('Failed to register test user');

  return client;
}
