import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { X } from 'lucide-react';
import type { Class, Folder, Plan } from '../lib/types';

interface MoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (moveDetails: { targetClassId: string; targetFolderId: string | null }) => void;
  item: Plan | Folder | null;
}

const generateFolderOptions = (allFolders: Folder[], currentClassId: string, itemToMove?: Folder | Plan | null) => {
    const options: { value: string | null; label: string; depth: number }[] = [{ value: null, label: '(Class Root)', depth: 0 }];
    if (!itemToMove) return options;
    
    const itemIsFolder = 'parentId' in itemToMove;

    const getDescendants = (folderId: string): string[] => {
        let kids = allFolders.filter(f => f.parentId === folderId).map(f => f.id);
        kids.forEach(kidId => {
            kids = kids.concat(getDescendants(kidId));
        });
        return kids;
    };
    
    const excludedIds = itemIsFolder ? [itemToMove.id, ...getDescendants(itemToMove.id)] : [];

    const buildOptionsRecursive = (parentId: string | null, depth: number) => {
        allFolders
            .filter(f => f.classId === currentClassId && f.parentId === parentId && !f.deletedAt && !excludedIds.includes(f.id))
            .forEach(folder => {
                options.push({ value: folder.id, label: folder.name, depth });
                buildOptionsRecursive(folder.id, depth + 1);
            });
    };

    buildOptionsRecursive(null, 1);
    return options;
};


export default function MoveItemModal({ isOpen, onClose, onMove, item }: MoveItemModalProps) {
  const { items: allClasses } = useSelector((state: RootState) => state.classes);
  const { items: allFolders } = useSelector((state: RootState) => state.folders);
  
  const [moveType, setMoveType] = useState<'class' | 'folder'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const currentClassId = item?.classId || '';
  const availableClasses = allClasses.filter(c => !c.archived && !c.deletedAt && c.id !== currentClassId);
  
  const folderOptions = useMemo(() => 
    generateFolderOptions(allFolders, currentClassId, item),
    [allFolders, currentClassId, item]
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moveType === 'class' && selectedClassId) {
        onMove({ targetClassId: selectedClassId, targetFolderId: null });
    } else if (moveType === 'folder') {
        onMove({ targetClassId: currentClassId, targetFolderId: selectedFolderId });
    }
  };

  if (!isOpen || !item) return null;
  const itemName = 'title' in item ? item.title : item.name;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold">Move "{itemName}"</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Move to:</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="moveType" value="class" checked={moveType === 'class'} onChange={() => setMoveType('class')} /> Another Class
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="moveType" value="folder" checked={moveType === 'folder'} onChange={() => setMoveType('folder')} /> Another Folder
                    </label>
                </div>
            </div>

            {moveType === 'class' && (
                <div>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                        <option value="" disabled>Select a class...</option>
                        {availableClasses.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                            </option>
                        ))}
                    </select>
                    {availableClasses.length === 0 && (
                        <p className="mt-2 text-xs text-amber-600">No other active classes available.</p>
                    )}
                </div>
            )}
            
            {moveType === 'folder' && (
                 <div>
                    <select
                        value={selectedFolderId === null ? 'root' : selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value === 'root' ? null : e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                        {folderOptions.map(opt => (
                            <option key={opt.value || 'root'} value={opt.value || 'root'}>
                                {'— '.repeat(opt.depth)}{opt.label}
                            </option>
                        ))}
                    </select>
                    {folderOptions.length <= 1 && (
                         <p className="mt-2 text-xs text-amber-600">No other folders in this class.</p>
                    )}
                </div>
            )}

          </div>
          <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(moveType === 'class' && !selectedClassId) || (moveType === 'folder' && folderOptions.length <= 1)}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-300"
            >
              Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}