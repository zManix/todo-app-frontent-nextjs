"use client";

import { useState } from "react";
import { Tag, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "../app/contexts/app-context";

export default function TagSelector() {
  const {
    tags,
    selectedTags,
    toggleTagSelection,
    createTag,
    updateTag,
    deleteTag,
    loading,
  } = useAppContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6"); // Default blue
  const [editingTag, setEditingTag] = useState(null);

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      await createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setNewTagName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditTag = async () => {
    if (newTagName.trim() && editingTag) {
      await updateTag(editingTag._id, {
        name: newTagName.trim(),
        color: newTagColor,
      });
      setNewTagName("");
      setEditingTag(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      await deleteTag(tagId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Filter by Tags</h2>
        <Button
          size="sm"
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={loading.tags}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Tag
        </Button>
      </div>

      {/* Tag list */}
      <div className="flex flex-wrap gap-2">
        {loading.tags ? (
          <div className="p-4 text-center text-gray-500 w-full">
            Loading tags...
          </div>
        ) : tags.length === 0 ? (
          <div className="p-4 text-center text-gray-500 w-full">
            No tags created yet
          </div>
        ) : (
          tags.map((tag) => (
            <div key={tag._id} className="flex items-center">
              <div
                className={`flex items-center rounded-md cursor-pointer border px-2 py-1 ${
                  selectedTags.includes(tag._id)
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => toggleTagSelection(tag._id)}
                style={{ borderLeftColor: tag.color, borderLeftWidth: "4px" }}
              >
                <Tag className="h-3 w-3 mr-1" style={{ color: tag.color }} />
                <span className="text-sm">{tag.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteTag(tag._id)}
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

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-color">Tag Color</Label>
              <div className="flex gap-2">
                <input
                  id="tag-color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-12 h-9 cursor-pointer border rounded-md"
                />
                <Input
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTag}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tag-color">Tag Color</Label>
              <div className="flex gap-2">
                <input
                  id="edit-tag-color"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-12 h-9 cursor-pointer border rounded-md"
                />
                <Input
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTag}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
