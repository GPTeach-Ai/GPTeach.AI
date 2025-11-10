<<<<<<< HEAD
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
import React, { useEffect } from 'react';
import { Plus, Trash2, Split } from 'lucide-react';
=======
import React, { createContext, useState, useContext, useMemo, useCallback, useRef, useEffect } from 'react';
import { Plus, Minus, GripVertical, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, List, ListOrdered, Pilcrow, CheckSquare, ChevronDown, Highlighter, RemoveFormatting } from 'lucide-react';
>>>>>>> 7ba6bb5ab70263be12b9cdf41bb033cf5a4ebda4
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
    mergePlanCell,
    movePlanRow,
    movePlanCell,
} from '../features/plans/plansSlice';
import ExportControls from './ExportControls';
<<<<<<< HEAD
import { useSelector as useReduxSelector } from 'react-redux';
import { loadCurriculumData } from '../services/curriculumDataService';
=======
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '../lib/utils';
import type { Row, Cell } from '../lib/types';
>>>>>>> 7ba6bb5ab70263be12b9cdf41bb033cf5a4ebda4


// --- CONTEXT FOR ACTIVE EDITOR --- //
type EditorContextType = { editor: Editor | null; setEditor: (editor: Editor | null) => void; };
const EditorContext = createContext<EditorContextType>({ editor: null, setEditor: () => {} });
const useEditorContext = () => useContext(EditorContext);
const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  return <EditorContext.Provider value={{ editor, setEditor }}>{children}</EditorContext.Provider>;
};

const HIGHLIGHTS = [ '#fef08a', '#d9f99d', '#a7f3d0', '#a5f3fc', '#bfdbfe', '#e9d5ff', '#fecdd3', ];

function HighlightPicker() {
  const { editor } = useEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  const handleColorSelect = (color: string) => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color }).run();
    setIsOpen(false);
  };

  const handleRemoveHighlight = () => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} className="relative">
      <button 
        disabled={!editor}
        onMouseDown={(e) => e.preventDefault()} 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
        title="Highlight Color"
      >
        <Highlighter size={16} />
      </button>
      {isOpen && editor && (
        <div className="absolute top-full mt-1 z-10 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleRemoveHighlight}
              className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600 transition-transform hover:scale-110 flex items-center justify-center bg-white dark:bg-slate-700"
              title="Remove highlight"
            >
              <RemoveFormatting size={16} className="text-slate-500" />
            </button>
            {HIGHLIGHTS.map(color => (
              <button
                key={color}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleColorSelect(color)}
                className={cn(
                  "w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600 transition-transform hover:scale-110",
                  editor.isActive('highlight', { color }) && 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-slate-800'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LinkEditor({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousUrl = editor.getAttributes('link').href;

  const handleSave = () => {
    const url = inputRef.current?.value;
    if (url === null || url === undefined) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    onClose();
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
      <input
        ref={inputRef}
        defaultValue={previousUrl}
        placeholder="Enter URL"
        className="px-2 py-1 text-sm rounded-md border bg-transparent border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } }}
      />
      <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md bg-emerald-500 text-white hover:bg-emerald-600">Save</button>
    </div>
  );
}

// --- STICKY FORMATTING TOOLBAR --- //
function FormattingToolbar() {
  const { editor } = useEditorContext();
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
  const linkButtonRef = useRef<HTMLDivElement>(null);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate(v => v + 1);
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
    }
  }, [editor]);

  const handleMouseDown = (e: React.MouseEvent) => e.preventDefault();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linkButtonRef.current && !linkButtonRef.current.contains(event.target as Node)) {
        setIsLinkEditorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-2">
      <div className={cn(
          "flex items-center flex-wrap justify-start gap-1 max-w-max transition-opacity duration-200",
          !editor && "opacity-40 pointer-events-none"
      )}>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleBold().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('bold') && 'bg-blue-100 dark:bg-blue-900')}><Bold size={16} /></button>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleItalic().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('italic') && 'bg-blue-100 dark:bg-blue-900')}><Italic size={16} /></button>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleUnderline().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('underline') && 'bg-blue-100 dark:bg-blue-900')}><UnderlineIcon size={16} /></button>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleStrike().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('strike') && 'bg-blue-100 dark:bg-blue-900')}><Strikethrough size={16} /></button>
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
          
          <div ref={linkButtonRef} className="relative">
              <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => setIsLinkEditorOpen(v => !v)} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('link') && 'bg-blue-100 dark:bg-blue-900')}><LinkIcon size={16} /></button>
              {isLinkEditorOpen && editor && (
                <div className="absolute top-full mt-1 z-10">
                  <LinkEditor editor={editor} onClose={() => setIsLinkEditorOpen(false)} />
                </div>
              )}
          </div>
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1" />

          <HighlightPicker />
          
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleBulletList().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('bulletList') && 'bg-blue-100 dark:bg-blue-900')}><List size={16} /></button>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('orderedList') && 'bg-blue-100 dark:bg-blue-900')}><ListOrdered size={16} /></button>
          <button disabled={!editor} onMouseDown={handleMouseDown} onClick={() => editor?.chain().focus().toggleTaskList().run()} className={cn("p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700", editor?.isActive('taskList') && 'bg-blue-100 dark:bg-blue-900')}><CheckSquare size={16} /></button>
      </div>
    </div>
  );
}

// --- RICH TEXT EDITOR COMPONENT FOR CELLS --- //
function RichTextCellEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string; }) {
  const { setEditor } = useEditorContext();
  const editor = useEditor({
    extensions: [ 
        StarterKit, 
        Underline, 
        Link.configure({ openOnClick: false }), 
        TaskList, 
        TaskItem.configure({ nested: true }),
        Placeholder.configure({ placeholder: placeholder || '...' }),
        Highlight.configure({ multicolor: true }),
    ],
    content: value || '',
    editorProps: { attributes: { class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3 min-h-[52px] h-full text-[15px] leading-relaxed' } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: ({ event }) => {
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (relatedTarget?.closest('.formatting-toolbar-container')) {
            return; // Don't blur if focus is moving to the toolbar
        }
        setEditor(null);
    },
  });
  return <EditorContent editor={editor} />;
}

// --- DRAGGABLE CELL COMPONENT --- //
function SortableCell({ cell, planId, rowId }: { cell: Cell; planId: string; rowId: string }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cell.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [controlsRef]);

  const handleSplit = () => {
    dispatch(splitPlanCell({ planId, rowId, cellId: cell.id }));
    setIsMenuOpen(false);
  }

  const handleMerge = () => {
    dispatch(mergePlanCell({ planId, rowId, cellId: cell.id }));
  }

  return (
    <Panel defaultSize={cell.size || 25} minSize={10} className="flex !overflow-visible">
        <div ref={setNodeRef} style={style} className="w-full h-full relative group/cell hover:z-20" {...attributes}>
            <RichTextCellEditor value={cell.content} onChange={(newContent) => dispatch(updatePlanCell({ planId, rowId, cellId: cell.id, content: newContent }))} placeholder={cell.placeholder} />
            <div ref={controlsRef} className="absolute top-2 right-2 flex flex-col items-center gap-0.5 p-0.5 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-200/80 dark:border-slate-700/80 opacity-0 group-hover/cell:opacity-100 transition-opacity z-30">
                {isMenuOpen ? (
                  <>
                    <button onClick={handleSplit} className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" title="Add Cell"><Plus size={14} /></button>
                    <button onClick={handleMerge} className="p-1 rounded-md text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40" title="Remove Cell"><Minus size={14} /></button>
                  </>
                ) : (
                  <>
                    <button {...listeners} className="p-1 rounded-md text-slate-500 cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-700" title="Move Cell"><GripVertical size={14} /></button>
                    <button onClick={() => setIsMenuOpen(true)} className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" title="More options"><ChevronDown size={14} /></button>
                  </>
                )}
            </div>
        </div>
    </Panel>
  );
}


// --- DRAGGABLE ROW COMPONENT --- //
function SortableRow({ row, planId, rowIndex }: { row: Row; planId: string; rowIndex: number; }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 20 : 1 };
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
  const cellIds = useMemo(() => row.cells.map(c => c.id), [row.cells]);

  function handleCellDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cellIds.indexOf(active.id as string);
      const newIndex = cellIds.indexOf(over.id as string);
      dispatch(movePlanCell({ planId, rowId: row.id, fromIndex: oldIndex, toIndex: newIndex }));
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="group flex border-b border-slate-300 dark:border-slate-600 last:border-b-0 transition-colors">
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
          <button {...attributes} {...listeners} className="p-1 rounded-md text-slate-500 cursor-grab active:cursor-grabbing hover:bg-slate-200 dark:hover:bg-slate-600" title="Move Row"><GripVertical size={14} /></button>
          <button onClick={() => dispatch(addPlanRow({ planId, rowIndex }))} className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600" title="Add Row Below"><Plus size={14} /></button>
          <button onClick={() => dispatch(removePlanRow({ planId, rowId: row.id }))} className="p-1 rounded-md text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40" title="Remove Row"><Minus size={14} /></button>
        </div>
      </div>
      
      <div className="flex-1">
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleCellDragEnd}
            modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext items={cellIds} strategy={horizontalListSortingStrategy}>
              <PanelGroup direction="horizontal" className="flex-1" onLayout={(layout: number[]) => dispatch(resizePlanRow({ planId, rowId: row.id, sizes: layout }))}>
              {row.cells.map((cell, cellIndex) => (
                  <React.Fragment key={cell.id}>
                      <SortableCell cell={cell} planId={planId} rowId={row.id} />
                      {cellIndex < row.cells.length - 1 && (
                        <PanelResizeHandle className="w-1 bg-slate-300 dark:bg-slate-600 hover:bg-emerald-400/60 dark:hover:bg-emerald-600/60 transition-colors" />
                      )}
                  </React.Fragment>
              ))}
              </PanelGroup>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// --- MAIN TEMPLATE COMPONENT --- //
export default function LessonPlanTemplate() {
  const dispatch = useDispatch();
  const plans = useSelector((s: RootState) => s.plans.items);
  const currentId = useSelector((s: RootState) => s.plans.currentId) || plans[0]?.id;
  const plan = plans.find(p => p.id === currentId);
  const highlightCellId = useSelector((s: RootState) => (s as any).ui?.highlightCellId) as string | undefined;

  // Load curriculum data on mount
  useEffect(() => {
    loadCurriculumData().catch(console.error);
  }, []);

  const planRows = useMemo(() => plan?.tableContent || [], [plan]);
  const rowIds = useMemo(() => planRows.map(r => r.id), [planRows]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleRowDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (plan && over && active.id !== over.id) {
      const oldIndex = rowIds.indexOf(active.id as string);
      const newIndex = rowIds.indexOf(over.id as string);
      dispatch(movePlanRow({ planId: plan.id, fromIndex: oldIndex, toIndex: newIndex }));
    }
  }

<<<<<<< HEAD
  const { tableContent: planRows, id: planId } = plan;
  
  // Build context for AI suggestions
  const lessonContext = `Lesson Plan: ${plan.title || 'Untitled'}. ${
    planRows
      .slice(0, 5)
      .map(row => row.cells.map(cell => cell.content).join(' '))
      .join(' ')
  }`;

  return (
    <div className="relative h-full w-full overflow-auto">
      {/* Subtle liquid glass background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
      <div className="pointer-events-none fixed -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl opacity-60 animate-[float_26s_ease-in-out_infinite] dark:bg-emerald-500/10" />
      <div className="pointer-events-none fixed right-[-10rem] bottom-[-8rem] -z-10 h-96 w-96 rounded-full bg-cyan-400/15 blur-[160px] opacity-40 animate-[float-delayed_32s_ease-in-out_infinite] dark:bg-cyan-500/10" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-sm">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-3 mb-6">
          {/* Title Card with glass effect */}
          <div className="flex-1 rounded-xl border border-slate-300/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm p-4">
            <div className="flex justify-between items-center">
              <input 
                type="text"
                value={plan.title}
                onChange={(e) => dispatch(updatePlan({ id: planId, title: e.target.value }))}
                placeholder="Untitled Lesson Plan"
                className="flex-1 text-2xl md:text-3xl font-bold bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <ExportControls />
            </div>
          </div>
          
          {/* Add Row Button */}
          <button 
            onClick={() => dispatch(addPlanRow({ planId }))} 
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all">
            <Plus size={18} /> Add Row
          </button>
        </div>

        {/* Main table with glass styling */}
        <div className="rounded-xl border border-slate-300/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden">
          {planRows.map((row) => (
            <div key={row.id} className="group flex border-b border-slate-200/60 dark:border-slate-700/60 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
              <PanelGroup 
                direction="horizontal"
                className="flex-1"
                onLayout={(layout: number[]) => dispatch(resizePlanRow({ planId, rowId: row.id, sizes: layout }))}
              >
                {row.cells.map((cell, cellIndex) => (
                  <React.Fragment key={cell.id}>
                    <Panel defaultSize={cell.size || (100 / row.cells.length)} minSize={10}>
                      <div className={`relative h-full group/cell ${highlightCellId === cell.id ? 'rounded-lg ring-2 ring-emerald-400/90 shadow-[0_0_0_8px_rgba(16,185,129,0.12)] bg-emerald-100/35 dark:bg-emerald-900/20 transition-all duration-300 animate-[pulse_2s_ease-in-out_infinite]' : ''}`}>
                        <InlineToolbarEditor
                          value={cell.content}
                          onChange={(newContent) => dispatch(updatePlanCell({ planId, rowId: row.id, cellId: cell.id, content: newContent }))}
                          placeholder={cell.placeholder}
                          enableAISuggestions={true}
                          context={lessonContext}
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={() => dispatch(splitPlanCell({ planId, rowId: row.id, cellId: cell.id }))}
                            className="p-1.5 rounded-lg bg-white/90 hover:bg-emerald-50 dark:bg-slate-700/90 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 transition-all hover:scale-105" 
                            title="Split Cell">
                            <Split size={14} />
                          </button>
                          {row.cells.length > 1 && (
                            <button 
                              onClick={() => dispatch(mergePlanCell({ planId, rowId: row.id, cellId: cell.id }))}
                              className="p-1.5 rounded-lg bg-white/90 hover:bg-red-50 dark:bg-slate-700/90 dark:hover:bg-red-900/40 text-slate-600 hover:text-red-600 dark:text-slate-300 shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 transition-all hover:scale-105"
                              title="Remove Cell">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
=======
  if (!plan) return <div className="p-8 text-center">Please create or select a lesson plan.</div>;

  return (
    <EditorProvider>
        <div className="relative h-full w-full overflow-auto">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-sm">
                
                <div className="rounded-xl border border-slate-300/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                    {/* Title and Export Controls - Not Sticky */}
                    <div className="border-b border-slate-300/60 dark:border-slate-700/60">
                      <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-2 p-4">
                          <input type="text" value={plan.title} onChange={(e) => dispatch(updatePlan({ id: plan.id, title: e.target.value }))} placeholder="Untitled Lesson Plan" className="flex-grow text-2xl md:text-3xl font-bold bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-[250px]" />
                          <div className="flex items-center gap-2 flex-shrink-0">
                              <ExportControls />
                          </div>
>>>>>>> 7ba6bb5ab70263be12b9cdf41bb033cf5a4ebda4
                      </div>
                    </div>

                    {/* Formatting Toolbar - Sticky */}
                    <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-300/60 dark:border-slate-700/60 formatting-toolbar-container">
                      <FormattingToolbar />
                    </div>

                    {/* Table Content */}
                    <div className="overflow-hidden">
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRowDragEnd}>
                          <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                              {planRows.map((row, index) => <SortableRow key={row.id} row={row} planId={plan.id} rowIndex={index} />)}
                          </SortableContext>
                      </DndContext>
                    </div>
                </div>

                 <div className="mt-4">
                    <button onClick={() => dispatch(addPlanRow({ planId: plan.id }))} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-600 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-500 font-medium transition-all">
                        <Plus size={18} /> Add Section
                    </button>
                </div>
            </div>
        </div>
    </EditorProvider>
  );
}