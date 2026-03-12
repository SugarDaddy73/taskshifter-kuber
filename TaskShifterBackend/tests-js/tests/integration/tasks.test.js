import { getAuthedClient } from '../helpers/authSetup.js';

describe('Tasks Integration', () => {
  let client, projectId, columnId, taskId;

  beforeAll(async () => {
    client = await getAuthedClient();
    const prj = await client.createProject('Task Project ' + Date.now());
    projectId = prj.data.id;
    const col = await client.createColumn(projectId, { name: 'Todo', color: 0, taskLimit: 5 });
    columnId = col.data.id;
  });

  test('POST /projects/{id}/tasks → creates task', async () => {
    const res = await client.createTask(projectId, {
      title: 'Test Task',
      description: 'desc',
      priority: 1,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      estimatedPoints: 3,
      columnId
    });
    expect([200, 201]).toContain(res.status);
    taskId = res.data.id;
  });

  test('PUT /projects/{id}/tasks/{taskId} → updates task', async () => {
    const res = await client.updateTask(projectId, taskId, {
      title: 'Updated Task',
      description: 'updated',
      priority: 2,
      estimatedPoints: 5,
      columnId
    });
    expect([200, 204]).toContain(res.status);
  });

  test('DELETE /projects/{id}/tasks/{taskId} → deletes task', async () => {
    const res = await client.deleteTask(projectId, taskId);
    expect([200, 204]).toContain(res.status);
  });
});
