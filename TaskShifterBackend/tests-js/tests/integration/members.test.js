import { getAuthedClient } from '../helpers/authSetup.js';

describe('Members Integration', () => {
  let projectOwnerClient, projectId, memberId, memberClient;

  beforeAll(async () => {
    // Create project owner client
    projectOwnerClient = await getAuthedClient();
    const prj = await projectOwnerClient.createProject('Members Project ' + Date.now());
    projectId = prj.data.id;
    console.log('Created project:', projectId);
  });

  test('POST /projects/{projectId}/members → add member', async () => {
    // Create a separate client for the new member
    memberClient = await getAuthedClient();
    const memberEmail = memberClient.makeEmail();
    
    // Register the new user with the member client (this sets its token)
    await memberClient.register({
      email: memberEmail,
      username: memberClient.makeUsername(),
      fullName: 'Member User',
      password: memberClient.makePassword()
    });
    
    // Use the PROJECT OWNER client to add the member (not the member client)
    const res = await projectOwnerClient.addMember(projectId, memberEmail);
    expect([200, 201]).toContain(res.status);

    // Verify with project owner client
    const verify = await projectOwnerClient.getProjectById(projectId);
    const member = verify.data.members.find(m => m.email === memberEmail);
    expect(member).toBeTruthy();
    memberId = member.id;
    console.log('Member added with ID:', memberId);
  });

  test('PUT /projects/{projectId}/members/{userId}/role → change role', async () => {
    // Make sure memberId is set
    if (!memberId) {
      throw new Error('memberId is not set. Previous test probably failed.');
    }
    
    const res = await projectOwnerClient.updateMemberRole(projectId, memberId, 1);
    expect([200, 204]).toContain(res.status);
  });

  test('DELETE /projects/{projectId}/members/{userId} → remove member', async () => {
    // Make sure memberId is set
    if (!memberId) {
      throw new Error('memberId is not set. Previous test probably failed.');
    }
    
    const res = await projectOwnerClient.removeMember(projectId, memberId);
    expect([200, 204]).toContain(res.status);
  });
});