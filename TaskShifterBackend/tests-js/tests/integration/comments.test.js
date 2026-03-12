import { getAuthedClient } from '../helpers/authSetup.js';

describe('Comments Integration', () => {
  let client, projectId, columnId, taskId, commentId;

  beforeAll(async () => {
    client = await getAuthedClient();
    const prj = await client.createProject('Comment Project ' + Date.now());
    projectId = prj.data.id;
    const col = await client.createColumn(projectId, { name: 'Todo', color: 0, taskLimit: 5 });
    columnId = col.data.id;
    const task = await client.createTask(projectId, { title: 'Task for comment', description: 'desc', columnId });
    taskId = task.data.id;
  });

  test('POST /comments → create comment', async () => {
    const res = await client.createComment(projectId, taskId, { content: 'hello comment' });
    expect([200, 201]).toContain(res.status);
    expect(res.data).toHaveProperty('id');
    commentId = res.data.id;
  });

  test('PUT /comments → update comment', async () => {
    const res = await client.updateComment(projectId, taskId, commentId, { content: 'edited' });
    expect([200, 204]).toContain(res.status);
  });

  test('DELETE /comments → delete comment', async () => {
    const res = await client.deleteComment(projectId, taskId, commentId);
    expect([200, 204]).toContain(res.status);
  });
});
