import { getAuthedClient } from '../helpers/authSetup.js';

describe('Columns Integration', () => {
  let client;
  let projectId, col1, col2;

  beforeAll(async () => {
    client = await getAuthedClient();
    const prj = await client.createProject('Column Project ' + Date.now());
    projectId = prj.data.id;
  });

  test('POST /projects/{id}/columns → creates column', async () => {
    const res = await client.createColumn(projectId, { name: 'Todo', color: 0, taskLimit: 5 });
    expect([200, 201]).toContain(res.status);
    col1 = res.data.id;
  });

  test('Create second column for move tests', async () => {
    const res = await client.createColumn(projectId, { name: 'Doing', color: 1, taskLimit: 5 });
    expect([200, 201]).toContain(res.status);
    col2 = res.data.id;
  });

  test('PUT /projects/{id}/columns/{colId} → updates column', async () => {
    const res = await client.updateColumn(projectId, col1, { name: 'Todo Updated', color: 2, taskLimit: 10 });
    expect([200, 204]).toContain(res.status);
  });

  test('Move column right/left updates order', async () => {
    const right = await client.moveColumnRight(projectId, col1);
    expect([200, 204]).toContain(right.status);

    const left = await client.moveColumnLeft(projectId, col2);
    expect([200, 204]).toContain(left.status);
  });

  test('DELETE /projects/{id}/columns/{colId} → deletes column', async () => {
    const res = await client.deleteColumn(projectId, col1);
    expect([200, 204]).toContain(res.status);
  });
});
