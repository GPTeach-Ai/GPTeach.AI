// src/components/CreateFolderModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Palette, X } from 'lucide-react';
import { createFolder, updateFolder } from '../features/folders/foldersSlice';
import type { Folder } from '../lib/types';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  parentId: string | null;
  folderItem?: Folder | null; // For editing
}

const PASTEL_COLORS = [
  '#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#7dd3fc', '#a5b4fc', '#d8b4fe'
];

export default function CreateFolderModal({ isOpen, onClose, classId, parentId, folderItem }: CreateFolderModalProps) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PASTEL_COLORS[1]);

  const isEditMode = Boolean(folderItem);

  useEffect(() => {
    if (isOpen) {
      if (folderItem) {
        setName(folderItem.name);
        setColor(folderItem.color);
      } else {
        // Reset for 'create' mode
        setName('');
        setColor(PASTEL_COLORS[1]);
      }
    }
  }, [isOpen, folderItem]);

  const handleResetAndClose = () => {
    setName('');
    setColor(PASTEL_COLORS[1]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditMode && folderItem) {
      dispatch(updateFolder({ id: folderItem.id, name: name.trim(), color }));
    } else {
      dispatch(createFolder({ name: name.trim(), classId, parentId, color }));
    }

    handleResetAndClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Folder' : 'Create Folder'}</h2>
          <button onClick={handleResetAndClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="folderName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Folder Name (required)
              </label>
              <input
                id="folderName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Folder Color
              </label>
              <div className="flex items-center flex-wrap gap-3">
                {PASTEL_COLORS.map((themeColor) => (
                  <button
                    key={themeColor}
                    type="button"
                    onClick={() => setColor(themeColor)}
                    className="w-8 h-8 rounded-full transition-transform duration-150 ease-in-out hover:scale-110"
                    style={{ backgroundColor: themeColor }}
                    aria-label={`Set color to ${themeColor}`}
                  >
                    {color === themeColor && (
                      <div className="w-full h-full rounded-full ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-slate-800" />
                    )}
                  </button>
                ))}
                <label className="w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 relative">
                  <Palette size={16} />
                  <input
                    type="color"
                    value={color}
                    onInput={(e) => setColor(e.currentTarget.value)}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-300"
              disabled={!name.trim()}
            >
              {isEditMode ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}