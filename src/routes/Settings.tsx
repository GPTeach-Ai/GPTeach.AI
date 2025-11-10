import React, { useMemo, useState } from 'react'
import GlassCard from '../components/GlassCard'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../app/store'
import { setTheme } from '../features/ui/uiSlice'
import { restoreClass, deleteClass } from '../features/classes/classesSlice'
import { restoreFolder, deleteFolder } from '../features/folders/foldersSlice'
import { restorePlan, deletePlan } from '../features/plans/plansSlice'
import { RotateCcw, Trash2, ChevronRight } from 'lucide-react'

export default function Settings() {
  const dispatch = useDispatch()
  const theme = useSelector((s: RootState) => s.ui.theme)
  
  const { items: allClasses } = useSelector((state: RootState) => state.classes);
  const { items: allFolders } = useSelector((state: RootState) => state.folders);
  const { items: allPlans } = useSelector((state: RootState) => state.plans);

  const recentlyDeletedItems = useMemo(() => {
    const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    
    const deletedClasses = allClasses
        .filter(c => c.deletedAt && new Date(c.deletedAt).getTime() > sevenDaysAgo)
        .map(c => ({ ...c, type: 'Class', name: c.name }));
    
    const deletedFolders = allFolders
        .filter(f => f.deletedAt && new Date(f.deletedAt).getTime() > sevenDaysAgo)
        .map(f => ({ ...f, type: 'Folder', name: f.name }));

    const deletedPlans = allPlans
        .filter(p => p.deletedAt && new Date(p.deletedAt).getTime() > sevenDaysAgo)
        .map(p => ({ ...p, type: 'Lesson Plan', name: p.title }));
        
    return [...deletedClasses, ...deletedFolders, ...deletedPlans].sort((a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime());
  }, [allClasses, allFolders, allPlans]);

  const handleRestore = (item: any) => {
    if (item.type === 'Class') dispatch(restoreClass(item.id));
    else if (item.type === 'Folder') dispatch(restoreFolder(item.id));
    else if (item.type === 'Lesson Plan') dispatch(restorePlan(item.id));
  };

  const handleDeletePermanent = (item: any) => {
    if (window.confirm(`Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`)) {
      if (item.type === 'Class') dispatch(deleteClass(item.id));
      else if (item.type === 'Folder') dispatch(deleteFolder(item.id));
      else if (item.type === 'Lesson Plan') dispatch(deletePlan(item.id));
    }
  };

  const getExpiryDate = (deletedAt: string) => {
    const date = new Date(deletedAt);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
  };


  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-3">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="flex gap-2">
            <button onClick={() => dispatch(setTheme('light'))} className={"px-4 py-2 rounded-xl " + (theme==='light' ? "bg-accent-500 text-white" : "bg-emerald-100")}>Light</button>
            <button onClick={() => dispatch(setTheme('dark'))} className={"px-4 py-2 rounded-xl " + (theme==='dark' ? "bg-accent-500 text-white" : "bg-emerald-100")}>Dark</button>
          </div>
        </GlassCard>
        
        <GlassCard>
            <details className="group">
                <summary className="list-none flex justify-between items-center text-xl font-semibold cursor-pointer select-none">
                    <span>Recently Deleted</span>
                    <ChevronRight className="group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="mt-4 pt-4 border-t border-slate-300/70 dark:border-slate-600/70 space-y-2">
                    {recentlyDeletedItems.length > 0 ? (
                        recentlyDeletedItems.map(item => (
                            <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.type} • Deletes on {getExpiryDate(item.deletedAt!)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleRestore(item)} title="Restore" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                      <RotateCcw size={16}/> Restore
                                    </button>
                                    <button onClick={() => handleDeletePermanent(item)} title="Delete Permanently" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40">
                                      <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No recently deleted items.</p>
                    )}
                </div>
            </details>
        </GlassCard>
        
        <GlassCard className="space-y-3">
          <h2 className="text-xl font-semibold">Placeholder API</h2>
          <p className="text-sm text-gray-600">Set your GPT API later. For now, this is a UI-only demo.</p>
        </GlassCard>
      </div>
    </div>
  )
}