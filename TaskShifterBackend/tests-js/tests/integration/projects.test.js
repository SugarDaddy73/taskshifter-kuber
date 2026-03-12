import { getAuthedClient } from '../helpers/authSetup.js';

describe('Projects Integration', () => {
  let client;
  let projectId;

  beforeAll(async () => {
    client = await getAuthedClient();
  });

  test('POST /projects → creates project', async () => {
    const res = await client.createProject('Prj-' + Date.now());
    expect([200, 201]).toContain(res.status);
    projectId = res.data.id;
  });

  test('GET /projects → returns list', async () => {
    const res = await client.getProjects();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('GET /projects/{id} → returns single project', async () => {
    const res = await client.getProjectById(projectId);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(projectId);
  });

  test('PUT /projects/{id} → updates project name', async () => {
    const res = await client.updateProject(projectId, { name: 'Updated Project Name' });
    expect([200, 204]).toContain(res.status);
    const verify = await client.getProjectById(projectId);
    expect(verify.data.name).toBe('Updated Project Name');
  });

  test('DELETE /projects/{id} → deletes project', async () => {
    const res = await client.createProject('ToDeleteProject');
    const del = await client.deleteProject(res.data.id);
    expect([200, 204]).toContain(del.status);
  });
});
