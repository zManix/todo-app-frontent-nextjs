// lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = {
  // Tasks
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.folder) queryParams.append('folder', filters.folder);
    if (filters.tag) queryParams.append('tag', filters.tag);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/tasks${query}`);
    return response.json();
  },
  
  getTaskById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return response.json();
  },
  
  createTask: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },
  
  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },
  
  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // Folders
  getFolders: async () => {
    const response = await fetch(`${API_BASE_URL}/folders`);
    return response.json();
  },
  
  getFolderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`);
    return response.json();
  },
  
  createFolder: async (folderData) => {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folderData)
    });
    return response.json();
  },
  
  updateFolder: async (id, folderData) => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folderData)
    });
    return response.json();
  },
  
  deleteFolder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // Tags
  getTags: async () => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    return response.json();
  },
  
  getTagById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`);
    return response.json();
  },
  
  createTag: async (tagData) => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData)
    });
    return response.json();
  },
  
  updateTag: async (id, tagData) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData)
    });
    return response.json();
  },
  
  deleteTag: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // Stats and aggregations
  getTasksByStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks-by-status`);
    return response.json();
  },
  
  getTasksByFolder: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks-by-folder`);
    return response.json();
  },
  
  getTasksByTag: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks-by-tag`);
    return response.json();
  },
  
  getTaskStats: async () => {
    const response = await fetch(`${API_BASE_URL}/task-stats`);
    return response.json();
  }
};

export default api;