"use client";

import FolderList from "@/components/folder-list";
import TagSelector from "@/components/tag-selector";
import TaskList from "@/components/task-list";
import { AppProvider } from "./contexts/app-context";

export default function Home() {
  return (
    <AppProvider>
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-gray-500">
            Organize your tasks with folders and tags
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-8">
            <FolderList />
            <TagSelector />
          </div>
          <div className="md:col-span-3">
            <TaskList />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
