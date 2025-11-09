// src/lib/types.ts (Corrected)

export type Outcome = {
  id: string;
  subject: string;
  grade: string;
  code: string;
  description: string;
  jurisdiction: 'Alberta' | 'Other';
  gradeLabel?: string;
  strand?: string;
  strandSlug?: string;
};

export type TemplateField =
  | 'title' | 'date' | 'grade' | 'subject' | 'school' | 'teacherName'
  | 'courseLevel' | 'lessonTime' | 'location' | 'duration' | 'outcomes'
  | 'objectives' | 'materials' | 'resources' | 'priorKnowledge' | 'activities'
  | 'assessment' | 'differentiation' | 'extensions' | 'references' | 'rubric'
  | 'safety' | 'essentialQuestions' | 'essentialVocabulary' | 'crossCurricular'
  | 'anticipatorySet' | 'bodySequence' | 'closing' | 'timedActivities'
  | 'understandingChecks' | 'studentFeedback' | 'lookingAhead';

export type Template = {
  id: string;
  name: string;
  summary: string;
  fields: TemplateField[];
  scaffold?: Partial<Record<TemplateField, any>>;
  variables?: string[];
};

export type TimedActivity = {
  id: string;
  minutes: number;
  title: string;
  details: string;
};

export type Cell = {
  id: string;
  content: string;
  placeholder: string;
  size: number; // Width percentage (0-100)
};

export type Row = {
  id: string;
  cells: Cell[];
  isHeader?: boolean;
};

export type Plan = {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  title: string;
  grade: string;
  subject: string;
  duration: number;
  outcomes: Outcome[];
  objectives: string;
  materials: string[];
  priorKnowledge: string;
  activities: TimedActivity[];
  assessment: string;
  differentiation: string;
  extensions: string;
  references: string;
  rubric: Rubric;
  tableContent: Row[];
};

export type RubricLevel = {
  label: string;
  descriptor: string;
};

export type RubricCriterion = {
  id: string;
  name: string;
  levels: RubricLevel[];
};

export type Rubric = {
  criteria: RubricCriterion[];
};

export type Class = {
  id: string;
  name: string;
  section: string;
};

export type TemplatePreviewVariant = 'classic' | 'split' | 'sectioned';