'use client';

import { useState } from 'react';
import { CheckSquare, Square, Calendar, Clock, Tag, Plus, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import TaskForm from './task-form';
import { useAppContext } from '../app/contexts/app-context';

export default function TaskList() {
  const { 
    tasks, 
    selectedFolder, 
    folders,
    tags,
    loading
  } = useAppContext();
  
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Helper to get folder name
  const getFolderName = (folderId) => {
    const folder = folders.find(folder => folder._id === folderId);
    return folder ? folder.name : 'Unknown';
  };

  // Determine the title of the task section
  const getTaskListTitle = () => {
    if (selectedFolder) {
      const folder = folders.find(folder => folder._id === selectedFolder);
      return folder ? `Tasks in ${folder.name}` : 'Tasks';
    }
    return 'All Tasks';
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setIsCreateTaskDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{getTaskListTitle()}</h2>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsCreateTaskDialogOpen(true);
          }}
          disabled={loading.tasks}
        >
          <Plus className="h-4 w-4 mr-1" /> Create Task
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {loading.tasks ? (
          <div className="p-4 text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tasks found
            <div className="mt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingTask(null);
                  setIsCreateTaskDialogOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add your first task
              </Button>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task._id} 
              className="border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              onClick={() => openEditDialog(task)}
            >
              <div className="flex items-start gap-2">
                {task.status === 'completed' ? (
                  <CheckSquare className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                ) : (
                  <Square className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    {task.priority && (
                      <span className={`text-xs rounded-full px-2 py-0.5 ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {task.due_date && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    
                    {task.folderDetails && task.folderDetails.length > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-gray-100 rounded-md px-2 py-0.5">
                          {task.folderDetails[0].name}
                        </span>
                      </div>
                    )}
                    
                    {task.tagDetails && task.tagDetails.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        {task.tagDetails.map(tag => (
                          <span 
                            key={tag.id} 
                            className="flex items-center text-xs rounded-md px-2 py-0.5"
                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Dialog */}
      <TaskForm
        isOpen={isCreateTaskDialogOpen}
        onClose={() => setIsCreateTaskDialogOpen(false)}
        task={editingTask}
      />
    </div>
  );
}