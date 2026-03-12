import axios from 'axios';
import dotenv from 'dotenv';
import { log, debug } from './logger.js';
import http from 'http';
import https from 'https';

dotenv.config();

const BASE = process.env.API_BASE_URL || 'http://localhost:7700';
const ENABLE_LOGS = (process.env.ENABLE_LOGS || 'true') === 'true';

// Create agents with proper configuration
const httpAgent = new http.Agent({ 
  keepAlive: false,
  keepAliveMsecs: 1000,
  timeout: 30000,
  maxSockets: 1,
  maxFreeSockets: 1
});

const httpsAgent = new https.Agent({ 
  keepAlive: false,
  keepAliveMsecs: 1000,
  timeout: 30000,
  maxSockets: 1,
  maxFreeSockets: 1
});

export default class ApiClient {
  constructor(baseUrl = BASE) {
    this.baseUrl = baseUrl;
    this.token = null;
    this.client = axios.create({
      baseURL: baseUrl,
      validateStatus: () => true,
      headers: { 'Content-Type': 'application/json' },
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      timeout: 10000,
      maxRedirects: 0
    });
  }

  // Enhanced destroy method
  destroy() {
    if (this.client) {
      // Cancel all pending requests
      const cancelTokenSource = axios.CancelToken.source();
      cancelTokenSource.cancel('Client destroyed');
      
      // Destroy agents
      if (this.client.defaults.httpAgent) {
        this.client.defaults.httpAgent.destroy();
      }
      if (this.client.defaults.httpsAgent) {
        this.client.defaults.httpsAgent.destroy();
      }
      
      this.client = null;
    }
  }

  setToken(token) {
    this.token = token;
    if (token)
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete this.client.defaults.headers.common['Authorization'];
    log(`🔑 Token set: ${!!token}`);
  }

  // AUTH
  async register(payload) {
    log('POST /auth/register', payload);
    const res = await this.client.post('/auth/register', payload);
    debug('➡ register:', res.status, res.data);
    if (res.data?.accessToken) this.setToken(res.data.accessToken);
    return res;
  }

  async login(payload) {
    log('POST /auth/login', payload);
    const res = await this.client.post('/auth/login', payload);
    debug('➡ login:', res.status, res.data);
    if (res.data?.accessToken) this.setToken(res.data.accessToken);
    return res;
  }

  // USERS
  async getProfile() {
    log('GET /users/profile');
    const res = await this.client.get('/users/profile');
    debug('➡ getProfile:', res.status, res.data);
    return res;
  }

  async updateProfile(payload) {
    log('PUT /users/profile', payload);
    const res = await this.client.put('/users/profile', payload);
    debug('➡ updateProfile:', res.status, res.data);
    return res;
  }

  async getUserById(id) {
    log(`GET /users/profile/${id}`);
    const res = await this.client.get(`/users/profile/${id}`);
    debug('➡ getUserById:', res.status, res.data);
    return res;
  }

  async updatePassword(payload) {
    log('PUT /users/password', payload);
    const res = await this.client.put('/users/password', payload);
    debug('➡ updatePassword:', res.status, res.data);
    return res;
  }

  // PROJECTS
  async createProject(name) {
    const body = { name };
    log('POST /projects', body);
    const res = await this.client.post('/projects', body);
    debug('➡ createProject:', res.status, res.data);
    return res;
  }

  async getProjects() {
    log('GET /projects');
    const res = await this.client.get('/projects');
    debug('➡ getProjects:', res.status, res.data);
    return res;
  }

  async getProjectById(id) {
    log(`GET /projects/${id}`);
    const res = await this.client.get(`/projects/${id}`);
    debug('➡ getProjectById:', res.status, res.data);
    return res;
  }

  async updateProject(id, body) {
    log(`PUT /projects/${id}`, body);
    const res = await this.client.put(`/projects/${id}`, body);
    debug('➡ updateProject:', res.status, res.data);
    return res;
  }

  async deleteProject(id) {
    log(`DELETE /projects/${id}`);
    const res = await this.client.delete(`/projects/${id}`);
    debug('➡ deleteProject:', res.status, res.data);
    return res;
  }

  // MEMBERS
  async addMember(projectId, email) {
    log(`POST /projects/${projectId}/members`, { email });
    const res = await this.client.post(`/projects/${projectId}/members`, { email });
    debug('➡ addMember:', res.status, res.data);
    return res;
  }

  async removeMember(projectId, userId) {
    log(`DELETE /projects/${projectId}/members/${userId}`);
    const res = await this.client.delete(`/projects/${projectId}/members/${userId}`);
    debug('➡ removeMember:', res.status, res.data);
    return res;
  }

  async updateMemberRole(projectId, userId, newRole) {
    log(`PUT /projects/${projectId}/members/${userId}/role`, { newRole });
    const res = await this.client.put(`/projects/${projectId}/members/${userId}/role`, { newRole });
    debug('➡ updateMemberRole:', res.status, res.data);
    return res;
  }

  async leaveProject(projectId) {
    log(`POST /projects/${projectId}/leave`);
    const res = await this.client.post(`/projects/${projectId}/leave`);
    debug('➡ leaveProject:', res.status, res.data);
    return res;
  }

  // COLUMNS
  async createColumn(projectId, payload) {
    log(`POST /projects/${projectId}/columns`, payload);
    const res = await this.client.post(`/projects/${projectId}/columns`, payload);
    debug('➡ createColumn:', res.status, res.data);
    return res;
  }

  async updateColumn(projectId, columnId, payload) {
    log(`PUT /projects/${projectId}/columns/${columnId}`, payload);
    const res = await this.client.put(`/projects/${projectId}/columns/${columnId}`, payload);
    debug('➡ updateColumn:', res.status, res.data);
    return res;
  }

  async deleteColumn(projectId, columnId) {
    log(`DELETE /projects/${projectId}/columns/${columnId}`);
    const res = await this.client.delete(`/projects/${projectId}/columns/${columnId}`);
    debug('➡ deleteColumn:', res.status, res.data);
    return res;
  }

  async moveColumnLeft(projectId, columnId) {
    log(`POST /projects/${projectId}/columns/${columnId}/move-left`);
    const res = await this.client.post(`/projects/${projectId}/columns/${columnId}/move-left`);
    debug('➡ moveColumnLeft:', res.status, res.data);
    return res;
  }

  async moveColumnRight(projectId, columnId) {
    log(`POST /projects/${projectId}/columns/${columnId}/move-right`);
    const res = await this.client.post(`/projects/${projectId}/columns/${columnId}/move-right`);
    debug('➡ moveColumnRight:', res.status, res.data);
    return res;
  }

  // TASKS
  async createTask(projectId, payload) {
    log(`POST /projects/${projectId}/tasks`, payload);
    const res = await this.client.post(`/projects/${projectId}/tasks`, payload);
    debug('➡ createTask:', res.status, res.data);
    return res;
  }

  async updateTask(projectId, taskId, payload) {
    log(`PUT /projects/${projectId}/tasks/${taskId}`, payload);
    const res = await this.client.put(`/projects/${projectId}/tasks/${taskId}`, payload);
    debug('➡ updateTask:', res.status, res.data);
    return res;
  }

  async deleteTask(projectId, taskId) {
    log(`DELETE /projects/${projectId}/tasks/${taskId}`);
    const res = await this.client.delete(`/projects/${projectId}/tasks/${taskId}`);
    debug('➡ deleteTask:', res.status, res.data);
    return res;
  }

  // COMMENTS
  async createComment(projectId, taskId, payload) {
    log(`POST /projects/${projectId}/tasks/${taskId}/comments`, payload);
    const res = await this.client.post(`/projects/${projectId}/tasks/${taskId}/comments`, payload);
    debug('➡ createComment:', res.status, res.data);
    return res;
  }

  async updateComment(projectId, taskId, commentId, payload) {
    log(`PUT /projects/${projectId}/tasks/${taskId}/comments/${commentId}`, payload);
    const res = await this.client.put(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, payload);
    debug('➡ updateComment:', res.status, res.data);
    return res;
  }

  async deleteComment(projectId, taskId, commentId) {
    log(`DELETE /projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
    const res = await this.client.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
    debug('➡ deleteComment:', res.status, res.data);
    return res;
  }

  // HELPERS
  makeEmail() {
    return `test_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
  }

  makeUsername() {
    const s = Math.random().toString(36).replace(/[^a-z]+/g, '').slice(2, 10);
    return (s || 'user') + 'a';
  }

  makePassword() {
    return 'P@ssw0rd';
  }
}
