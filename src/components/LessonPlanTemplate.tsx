// src/components/LessonPlanTemplate.tsx (Updated)
/*
JSON Schema for the 'tableContent' property of a Plan object:
[
  {
    "id": "string", // Unique ID for the row
    "cells": [
      {
        "id": "string",        // Unique ID for the cell
        "content": "string",     // HTML content from the rich text editor
        "placeholder": "string", // Placeholder text for the editor
        "size": "number"         // Width percentage (0-100)
      }
    ],
    "isHeader": "boolean" // Optional, for styling header rows differently
  }
]
*/
import React from 'react';
import { Plus, Trash2, Split } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { RootState } from '../app/store';
import { 
    updatePlan, 
    updatePlanCell, 
    addPlanRow, 
    removePlanRow,
    resizePlanRow,
    splitPlanCell,
    mergePlanCell
} from '../features/plans/plansSlice';
import InlineToolbarEditor from './InlineToolbarEditor';
import ExportControls from './ExportControls';

export default function LessonPlanTemplate() {
  const dispatch = useDispatch();
  const plans = useSelector((s: RootState) => s.plans.items);
  const currentId = useSelector((s: RootState) => s.plans.currentId) || plans[0]?.id;
  const plan = plans.find(p => p.id === currentId);

  if (!plan) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please create or select a lesson plan to begin.
      </div>
    );
  }

  const { tableContent: planRows, id: planId } = plan;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-sm">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
            <input 
                type="text"
                value={plan.title}
                onChange={(e) => dispatch(updatePlan({ id: planId, title: e.target.value }))}
                placeholder="Untitled Lesson Plan"
                className="w-full text-2xl md:text-3xl font-bold bg-transparent focus:outline-none text-slate-800 dark:text-slate-100"
            />
            <ExportControls />
        </div>

        <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            {planRows.map((row) => (
                <div key={row.id} className="group flex border-b border-slate-300 dark:border-slate-700 last:border-b-0">
                    <PanelGroup 
                        direction="horizontal"
                        className="flex-1"
                        onLayout={(layout: number[]) => dispatch(resizePlanRow({ planId, rowId: row.id, sizes: layout }))}
                    >
                        {row.cells.map((cell, cellIndex) => (
                            <React.Fragment key={cell.id}>
                                <Panel defaultSize={cell.size}>
                                    <div className="relative h-full group/cell">
                                        <InlineToolbarEditor
                                            value={cell.content}
                                            onChange={(newContent) => dispatch(updatePlanCell({ planId, rowId: row.id, cellId: cell.id, content: newContent }))}
                                            placeholder={cell.placeholder}
                                        />
                                        <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => dispatch(splitPlanCell({ planId, rowId: row.id, cellId: cell.id }))}
                                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300" 
                                                title="Split Cell">
                                                <Split size={14} />
                                            </button>
                                            {row.cells.length > 1 && (
                                                <button 
                                                    onClick={() => dispatch(mergePlanCell({ planId, rowId: row.id, cellId: cell.id }))}
                                                    className="p-1 rounded bg-slate-100 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-red-900/40 text-slate-500 hover:text-red-600 dark:text-slate-300"
                                                    title="Merge Cell">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Panel>
                                {cellIndex < row.cells.length - 1 && (
                                    <PanelResizeHandle className="w-1 bg-slate-200 dark:bg-slate-600 hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors" />
                                )}
                            </React.Fragment>
                        ))}
                    </PanelGroup>
                     {!row.isHeader && (
                        <button 
                            onClick={() => dispatch(removePlanRow({ planId, rowId: row.id }))}
                            className="w-8 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 transition-opacity"
                            title="Remove Row">
                            <Trash2 size={16}/>
                        </button>
                     )}
                </div>
            ))}
        </div>
        <div className="mt-2">
            <button 
                onClick={() => dispatch(addPlanRow({ planId }))} 
                className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                <Plus size={16} /> Add Row
            </button>
        </div>
    </div>
  );
}