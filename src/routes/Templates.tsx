// src/routes/Templates.tsx (Corrected)

import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Corrected import
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { applyTemplateToPlan } from '../features/plans/plansSlice';
import GlassCard from '../components/GlassCard';
import type { Template } from '../lib/types';
import { lessonPlanTemplates } from '../lib/templatesData';
import TemplatePreview from '../components/TemplatePreview';

export default function Templates() {
  const plans = useSelector((s: RootState) => s.plans.items);
  const currentPlanId = useSelector((s: RootState) => s.plans.currentId) || plans[0]?.id;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApplyTemplate = (template: Template) => {
    if (currentPlanId) {
      dispatch(applyTemplateToPlan({ planId: currentPlanId, template }));
      navigate('/planner');
    } else {
      alert("No active lesson plan to apply the template to. Please create a plan first.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Lesson Plan Templates
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Choose a pre-defined structure to kickstart your planning process.
        </p>
        <div className="space-y-8">
          {lessonPlanTemplates.map((tpl) => (
            <GlassCard key={tpl.id} className="!p-0 overflow-hidden">
                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">{tpl.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{tpl.summary}</p>
                        </div>
                        <button 
                            onClick={() => handleApplyTemplate(tpl)} 
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
                        >
                            Use Template
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4">
                    <TemplatePreview fields={tpl.fields} />
                </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}