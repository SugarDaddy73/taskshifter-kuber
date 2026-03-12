import { getAuthedClient } from '../helpers/authSetup.js';

describe('E2E: full business flow', () => {
  let client;
  beforeAll(async () => {
    client = await getAuthedClient();
  });

  test('Create Project -> Column -> Task -> Comment -> Update -> Delete', async () => {
    const prj = await client.createProject('E2E Project ' + Date.now());
    expect([200, 201]).toContain(prj.status);

    const col = await client.createColumn(prj.data.id, { name: 'E2E-Col', color: 0, taskLimit: 10 });
    expect([200, 201]).toContain(col.status);

    const task = await client.createTask(prj.data.id, {
      title: 'E2E Task', description: 'desc', columnId: col.data.id
    });
    expect([200, 201]).toContain(task.status);

    const comment = await client.createComment(prj.data.id, task.data.id, { content: 'E2E comment' });
    expect([200, 201]).toContain(comment.status);

    const updTask = await client.updateTask(prj.data.id, task.data.id, {
      title: 'E2E Task Updated', description: 'u'
    });
    expect([200, 204]).toContain(updTask.status);

    const updComment = await client.updateComment(prj.data.id, task.data.id, comment.data.id, { content: 'edited' });
    expect([200, 204]).toContain(updComment.status);

    const delComment = await client.deleteComment(prj.data.id, task.data.id, comment.data.id);
    expect([200, 204]).toContain(delComment.status);

    const delTask = await client.deleteTask(prj.data.id, task.data.id);
    expect([200, 204]).toContain(delTask.status);

    const delColumn = await client.deleteColumn(prj.data.id, col.data.id);
    expect([200, 204]).toContain(delColumn.status);

    const delProject = await client.deleteProject(prj.data.id);
    expect([200, 204]).toContain(delProject.status);
  });
});
