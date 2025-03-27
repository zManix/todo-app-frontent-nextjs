"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Check, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "../app/contexts/app-context";

export default function TaskForm({ isOpen, onClose, task }) {
  const { folders, tags, createTask, updateTask, deleteTask, selectedFolder } =
    useAppContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: null,
    folders: [],
    tags: [],
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        priority: task.priority || "medium",
        due_date: task.due_date ? new Date(task.due_date) : null,
        folders: task.folders || [],
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: null,
        folders: selectedFolder ? [selectedFolder] : [],
        tags: [],
      });
    }
  }, [task, selectedFolder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, due_date: date }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id);
      onClose();
    }
  };

  const toggleFolder = (folderId) => {
    setFormData((prev) => {
      const folderExists = prev.folders.includes(folderId);
      if (folderExists) {
        return {
          ...prev,
          folders: prev.folders.filter((id) => id !== folderId),
        };
      } else {
        return { ...prev, folders: [...prev.folders, folderId] };
      }
    });
  };

  const toggleTag = (tagId) => {
    setFormData((prev) => {
      const tagExists = prev.tags.includes(tagId);
      if (tagExists) {
        return { ...prev, tags: prev.tags.filter((id) => id !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this task"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-10 font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date ? (
                    format(formData.due_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={handleDateChange}
                  initialFocus
                />
                {formData.due_date && (
                  <div className="p-2 border-t border-gray-200 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDateChange(null)}
                    >
                      <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDateChange(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Folders</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-10 font-normal"
                >
                  {formData.folders.length > 0 ? (
                    <>
                      {formData.folders.length} folder
                      {formData.folders.length !== 1 ? "s" : ""} selected
                    </>
                  ) : (
                    <span>Select folders</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search folders..." />
                  <CommandEmpty>No folders found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {folders.map((folder) => {
                      const isSelected = formData.folders.includes(folder._id);
                      return (
                        <CommandItem
                          key={folder._id}
                          value={folder._id}
                          onSelect={() => toggleFolder(folder._id)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {isSelected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <div className="w-4" />
                            )}
                            {folder.name}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {formData.folders.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.folders.map((folderId) => {
                  const folder = folders.find((f) => f._id === folderId);
                  return folder ? (
                    <Badge
                      key={folder._id}
                      variant="secondary"
                      className="gap-1"
                    >
                      {folder.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleFolder(folder._id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-10 font-normal"
                >
                  {formData.tags.length > 0 ? (
                    <>
                      {formData.tags.length} tag
                      {formData.tags.length !== 1 ? "s" : ""} selected
                    </>
                  ) : (
                    <span>Select tags</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {tags.map((tag) => {
                      const isSelected = formData.tags.includes(tag._id);
                      return (
                        <CommandItem
                          key={tag._id}
                          value={tag._id}
                          onSelect={() => toggleTag(tag._id)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {isSelected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <div className="w-4" />
                            )}
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tagId) => {
                  const tag = tags.find((t) => t._id === tagId);
                  return tag ? (
                    <Badge
                      key={tag._id}
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }}
                    >
                      {tag.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleTag(tag._id)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          {task && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{task ? "Update" : "Create"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
