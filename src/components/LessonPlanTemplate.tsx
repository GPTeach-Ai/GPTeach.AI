// src/components/LessonPlanTemplate.tsx (New Code)

import React from 'react';
import { Plus } from 'lucide-react';

// A reusable input component for a cleaner look
const FormField = ({ label, placeholder, className = '' }: { label: string, placeholder?: string, className?: string }) => (
  <div className={`border-b border-slate-200 dark:border-slate-700 py-3 ${className}`}>
    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder || '...'}
      className="w-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />
  </div>
);

const TextAreaField = ({ label, placeholder, rows = 3, className = '' }: { label: string, placeholder?: string, rows?: number, className?: string }) => (
    <div className={`border-b border-slate-200 dark:border-slate-700 py-3 ${className}`}>
        <label className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-1">{label}</label>
        <textarea
            placeholder={placeholder || '...'}
            rows={rows}
            className="w-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
        />
    </div>
);

export default function LessonPlanTemplate() {
  return (
    <div className="h-full w-full max-w-4xl mx-auto p-8 overflow-y-auto">
      <div className="mb-8">
        <input 
            defaultValue="Untitled Lesson Plan" 
            className="text-3xl font-bold bg-transparent focus:outline-none w-full text-slate-800 dark:text-slate-100"
        />
        <p className="text-slate-400">Start typing or insert using /</p>
      </div>

      {/* Header Grid */}
      <div className="grid grid-cols-3 gap-x-8">
        <FormField label="Date" placeholder="November 8, 2025" />
        <FormField label="Grade/Class" placeholder="Grade 10 Science" />
        <FormField label="Name" placeholder="Your Name" />
        <FormField label="Course/Level" placeholder="Biology 20" />
        <FormField label="School" />
        <FormField label="Lesson Time" placeholder="80 minutes" />
      </div>

      {/* Main Content Sections */}
      <div className="mt-6 space-y-4">
        <TextAreaField label="Prerequisites/Previous Knowledge" placeholder="Students should have a basic understanding of..." />
        <TextAreaField label="Outcome(s) (quoted from program of studies)" placeholder="e.g., SCI10-1: Analyze the structure of cells" />
        <TextAreaField label="Goal of this lesson/demo" placeholder="What will students know, understand, and be able to do?" />
        <TextAreaField label="Resources" placeholder="e.g., Textbooks, video links, chart paper" />
        <TextAreaField label="Safety Considerations" placeholder="e.g., Proper handling of lab equipment" />
      </div>
      
      {/* Activities Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Timed Activities</h3>
        <div className="grid grid-cols-[100px_1fr_200px] gap-x-6 items-center border-t border-b border-slate-200 dark:border-slate-700 py-2">
            <div className="text-sm font-medium text-slate-500">Time (min)</div>
            <div className="text-sm font-medium text-slate-500">Description of Activity</div>
            <div className="text-sm font-medium text-slate-500">Check for Understanding</div>
        </div>
        {/* Example Activity Row */}
        <div className="grid grid-cols-[100px_1fr_200px] gap-x-6 items-start py-3 border-b border-slate-200 dark:border-slate-700">
            <input type="number" placeholder="15" className="bg-transparent focus:outline-none text-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" />
            <textarea placeholder="Anticipatory set/hook/introduction..." rows={3} className="w-full bg-transparent focus:outline-none resize-none p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"></textarea>
            <textarea placeholder="Formative assessment..." rows={3} className="w-full bg-transparent focus:outline-none resize-none p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"></textarea>
        </div>
        <div className="grid grid-cols-[100px_1fr_200px] gap-x-6 items-start py-3 border-b border-slate-200 dark:border-slate-700">
            <input type="number" placeholder="50" className="bg-transparent focus:outline-none text-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" />
            <textarea placeholder="Body/activities/strategies (this section should be VERY detailed)" rows={5} className="w-full bg-transparent focus:outline-none resize-none p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"></textarea>
            <textarea placeholder="Summative assessment..." rows={5} className="w-full bg-transparent focus:outline-none resize-none p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"></textarea>
        </div>
      </div>
      
      <button className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        <Plus size={16} /> Add Activity Row
      </button>
    </div>
  );
}