'use client';

import { useState } from 'react';
import { Folder, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '../app/contexts/app-context';

export default function FolderList() {
  const { 
    folders, 
    selectedFolder, 
    selectFolder, 
    createFolder, 
    updateFolder, 
    deleteFolder,
    loading 
  } = useAppContext();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder({ name: newFolderName.trim() });
      setNewFolderName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditFolder = async () => {
    if (newFolderName.trim() && editingFolder) {
      await updateFolder(editingFolder._id, { name: newFolderName.trim() });
      setNewFolderName('');
      setEditingFolder(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsEditDialogOpen(true);
  };

  const handleDeleteFolder = async (folderId) => {
    if (confirm('Are you sure you want to delete this folder?')) {
      await deleteFolder(folderId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Folders</h2>
        <Button 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={loading.folders}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Folder
        </Button>
      </div>

      {/* Folder list */}
      <div className="space-y-1">
        <div 
          className={`flex items-center p-2 rounded-md cursor-pointer ${selectedFolder === null ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => selectFolder(null)}
        >
          <Folder className="h-5 w-5 mr-2 text-blue-500" />
          <span>All Tasks</span>
        </div>
        
        {loading.folders ? (
          <div className="p-4 text-center text-gray-500">Loading folders...</div>
        ) : folders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No folders created yet</div>
        ) : (
          folders.map((folder) => (
            <div 
              key={folder._id} 
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedFolder === folder._id ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <div 
                className="flex items-center flex-grow"
                onClick={() => selectFolder(folder._id)}
              >
                <Folder className="h-5 w-5 mr-2 text-blue-500" />
                <span>{folder.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(folder)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteFolder(folder._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input 
                id="folder-name"
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-folder-name">Folder Name</Label>
              <Input 
                id="edit-folder-name"
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}