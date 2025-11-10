// src/components/CreatePlanModal.tsx
import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import type { TemplateField } from '../lib/types';
import { labelForField } from '../lib/templateFields';

export type CreatePlanData = {
    title: string;
    grade: string;
    subject: string;
    topic: string;
    fields: TemplateField[];
    optionalFieldContent: Partial<Record<TemplateField, string>>;
};

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreatePlanData, andOpen: boolean) => void;
}

const optionalFields: TemplateField[] = [
    'outcomes', 'objectives', 'materials', 'priorKnowledge', 
    'activities', 'assessment', 'differentiation', 'extensions', 
    'references', 'rubric'
];

export default function CreatePlanModal({ isOpen, onClose, onCreate }: CreatePlanModalProps) {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedFields, setSelectedFields] = useState<TemplateField[]>([]);
  const [optionalFieldContent, setOptionalFieldContent] = useState<Partial<Record<TemplateField, string>>>({});

  const handleCreate = (andOpen: boolean) => (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && grade.trim() && subject.trim() && topic.trim()) {
      onCreate({ title: title.trim(), grade: grade.trim(), subject: subject.trim(), topic: topic.trim(), fields: selectedFields, optionalFieldContent }, andOpen);
      // Reset form
      setTitle('');
      setGrade('');
      setSubject('');
      setTopic('');
      setSelectedFields([]);
      setOptionalFieldContent({});
    }
  };

  const toggleField = (field: TemplateField) => {
      setSelectedFields(prev => 
        prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
      );
  };
  
  const handleContentChange = (field: TemplateField, content: string) => {
    setOptionalFieldContent(prev => ({ ...prev, [field]: content }));
  };

  if (!isOpen) return null;
  
  const canSubmit = title.trim() && grade.trim() && subject.trim() && topic.trim();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold">Create New Lesson Plan</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleCreate(true)}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="planTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <input id="planTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" required autoFocus/>
                </div>
                 <div>
                    <label htmlFor="planTopic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Topic <span className="text-red-500">*</span>
                    </label>
                    <input id="planTopic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="planGrade" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Grade <span className="text-red-500">*</span>
                    </label>
                    <input id="planGrade" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
                <div>
                    <label htmlFor="planSubject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                    </label>
                    <input id="planSubject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                </div>
            </div>

            <details className="pt-2">
                <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2">
                    <PlusCircle size={16} /> Add & Pre-fill Optional Fields
                </summary>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {optionalFields.map(field => (
                        <label key={field} className="flex items-center gap-2 p-2 rounded-md bg-slate-100 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                            <input 
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => toggleField(field)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">{labelForField(field)}</span>
                        </label>
                    ))}
                </div>
            </details>

            {selectedFields.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {selectedFields.map(field => (
                        <div key={field}>
                            <label htmlFor={`field-${field}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {labelForField(field)}
                            </label>
                            <textarea
                                id={`field-${field}`}
                                value={optionalFieldContent[field] || ''}
                                onChange={(e) => handleContentChange(field, e.target.value)}
                                className="w-full h-24 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder={`Enter initial content for ${labelForField(field)}...`}
                            />
                        </div>
                    ))}
                </div>
            )}
          </div>
          <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 mr-2">
              Cancel
            </button>
            <button type="button" onClick={handleCreate(false)} disabled={!canSubmit} className="px-4 py-2 rounded-md text-sm font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 mr-2">
              Create
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-300" disabled={!canSubmit}>
              Create and Open
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}