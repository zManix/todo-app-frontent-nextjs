'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  // State for folders, tasks, and tags
  const [folders, setFolders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  
  // Selected folder and filters
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    folders: false,
    tasks: false,
    tags: false
  });
  
  // Fetch folders
  const fetchFolders = async () => {
    try {
      setLoading(prev => ({ ...prev, folders: true }));
      const folderData = await api.getFolders();
      setFolders(folderData);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(prev => ({ ...prev, folders: false }));
    }
  };
  
  // Fetch tasks with optional filters
  const fetchTasks = async (filters = {}) => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }));
      const taskData = await api.getTasks(filters);
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };
  
  // Fetch tags
  const fetchTags = async () => {
    try {
      setLoading(prev => ({ ...prev, tags: true }));
      const tagData = await api.getTags();
      setTags(tagData);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(prev => ({ ...prev, tags: false }));
    }
  };
  
  // Create new folder
  const createFolder = async (folderData) => {
    try {
      const newFolder = await api.createFolder(folderData);
      setFolders(prev => [...prev, newFolder]);
      return newFolder;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  };
  
  // Create new task
  const createTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };
  
  // Create new tag
  const createTag = async (tagData) => {
    try {
      const newTag = await api.createTag(tagData);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  };
  
  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await api.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
  
  // Update folder
  const updateFolder = async (id, folderData) => {
    try {
      const updatedFolder = await api.updateFolder(id, folderData);
      setFolders(prev => prev.map(folder => folder._id === id ? updatedFolder : folder));
      return updatedFolder;
    } catch (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  };
  
  // Update tag
  const updateTag = async (id, tagData) => {
    try {
      const updatedTag = await api.updateTag(id, tagData);
      setTags(prev => prev.map(tag => tag._id === id ? updatedTag : tag));
      return updatedTag;
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  };
  
  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };
  
  // Delete folder
  const deleteFolder = async (id) => {
    try {
      await api.deleteFolder(id);
      setFolders(prev => prev.filter(folder => folder._id !== id));
      if (selectedFolder === id) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  };
  
  // Delete tag
  const deleteTag = async (id) => {
    try {
      await api.deleteTag(id);
      setTags(prev => prev.filter(tag => tag._id !== id));
      setSelectedTags(prev => prev.filter(tagId => tagId !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  };
  
  // Select folder and fetch its tasks
  const selectFolder = (folderId) => {
    setSelectedFolder(folderId);
    if (folderId) {
      fetchTasks({ folder: folderId, tag: selectedTags.length > 0 ? selectedTags[0] : undefined });
    } else {
      fetchTasks({ tag: selectedTags.length > 0 ? selectedTags[0] : undefined });
    }
  };
  
  // Toggle tag selection
  const toggleTagSelection = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
      // Re-fetch with updated filters
      fetchTasks({ 
        folder: selectedFolder, 
        tag: selectedTags.filter(id => id !== tagId)[0]
      });
    } else {
      setSelectedTags([tagId]); // Currently API supports single tag filter
      fetchTasks({ folder: selectedFolder, tag: tagId });
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchFolders();
    fetchTags();
    fetchTasks();
  }, []);
  
  const value = {
    folders,
    tasks,
    tags,
    selectedFolder,
    selectedTags,
    loading,
    fetchFolders,
    fetchTasks,
    fetchTags,
    createFolder,
    createTask,
    createTag,
    updateTask,
    updateFolder,
    updateTag,
    deleteTask,
    deleteFolder,
    deleteTag,
    selectFolder,
    toggleTagSelection
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};