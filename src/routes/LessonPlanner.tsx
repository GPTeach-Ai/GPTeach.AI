// src/routes/LessonPlanner.tsx (Updated)

import React from 'react';
import LessonPlanTemplate from '../components/LessonPlanTemplate';
import AIChatInterface from '../components/AIChatInterface';
// The Nav component is no longer needed here.

export default function LessonPlanner() {
  return (
    // This component now just needs to be 'h-full' to fill the space provided by AppLayout.
    <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[1fr_400px]">
      
      <div className="h-full min-h-0">
        <LessonPlanTemplate />
      </div>

      <aside className="h-full min-h-0">
        <AIChatInterface />
      </aside>
        
    </div>
  );
}