// src/features/plans/plansSlice.ts (Corrected)

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { Plan, TimedActivity, RubricCriterion, Outcome, Row, Cell, TemplateField } from '../../lib/types'

type PlansState = {
  items: Plan[]
  currentId?: string
}

const createDefaultTable = (): Row[] => [
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Date:</strong>', placeholder: 'Date', size: 33.33 },
        { id: nanoid(), content: '<strong>Grade/Class:</strong>', placeholder: 'Grade/Class', size: 33.33 },
        { id: nanoid(), content: '<strong>Name:</strong>', placeholder: 'Name', size: 33.34 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Course/level:</strong>', placeholder: 'Course/level', size: 33.33 },
        { id: nanoid(), content: '<strong>School:</strong>', placeholder: 'School', size: 33.33 },
        { id: nanoid(), content: '<strong>Lesson time:</strong>', placeholder: 'Lesson time', size: 33.34 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Prerequisites/Previous Knowledge:</strong>', placeholder: 'Students should have a basic understanding of...', size: 66.66 },
        { id: nanoid(), content: '<strong>Location/facility:</strong>', placeholder: 'e.g., Classroom, Gym', size: 33.34 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Outcome(s) (quoted from program of studies):</strong>', placeholder: 'e.g., SCI10-1: Analyze the structure of cells', size: 66.66 },
        { id: nanoid(), content: '<strong>Resources:</strong>', placeholder: 'Textbooks, video links, chart paper', size: 33.34 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Goal of this lesson/demo:</strong>', placeholder: 'What will students know, understand, and be able to do?', size: 66.66 },
        { id: nanoid(), content: '<strong>Safety Considerations:</strong>', placeholder: 'e.g., Proper handling of lab equipment', size: 33.34 },
      ],
    },
    { id: nanoid(), cells: [{ id: nanoid(), content: '<strong>Essential question(s):</strong>', placeholder: 'Enter essential questions...', size: 100 }] },
    { id: nanoid(), cells: [{ id: nanoid(), content: '<strong>Differentiated instructions:</strong>', placeholder: 'Enter differentiated instructions...', size: 100 }] },
    {
      id: nanoid(),
      isHeader: true,
      cells: [
          { id: nanoid(), content: '<b>Time for activity (in minutes)</b>', placeholder: '', size: 25 },
          { id: nanoid(), content: '<b>Description of activity, New learning</b>', placeholder: '', size: 50 },
          { id: nanoid(), content: '<b>Check for understanding</b>', placeholder: '', size: 25 },
      ]
    },
    {
      id: nanoid(),
      cells: [
          { id: nanoid(), content: '', placeholder: 'Anticipatory set/hook...', size: 25 },
          { id: nanoid(), content: '', placeholder: 'Body/activities/strategies...', size: 50 },
          { id: nanoid(), content: '<ul><li>Real world connections</li><li>Student Feedback</li><li>Looking ahead</li></ul>', placeholder: 'Closing', size: 25 },
      ]
    }
];
// NOTE: The createTableFromTemplate function was removed as it's not being used in the latest implementation
// If you intend to use it later, it can be re-added here.

const emptyPlan = (): Plan => ({
  id: nanoid(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  title: 'Untitled Lesson',
  grade: '',
  subject: '',
  duration: 60,
  outcomes: [],
  objectives: '',
  materials: [],
  priorKnowledge: '',
  activities: [],
  assessment: '',
  differentiation: '',
  extensions: '',
  references: '',
  rubric: { criteria: [] },
  tableContent: createDefaultTable(),
})

const initial: PlansState = {
  items: [emptyPlan()],
  currentId: undefined
}

const plansSlice = createSlice({
  name: 'plans',
  initialState: initial,
  reducers: {
    createPlan(state) {
      const p = emptyPlan()
      state.items.unshift(p)
      state.currentId = p.id
    },
    setCurrentPlan(state, action: PayloadAction<string | undefined>) {
      state.currentId = action.payload
    },
    updatePlan(state, action: PayloadAction<Partial<Plan> & { id: string }>) {
      const idx = state.items.findIndex(p => p.id === action.payload.id)
      if (idx >= 0) {
        state.items[idx] = { ...state.items[idx], ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    deletePlan(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload)
      if (state.currentId === action.payload) state.currentId = state.items[0]?.id
    },
    setOutcomesForPlan(state, action: PayloadAction<{ planId: string; outcomes: Outcome[] }>) {
      const plan = state.items.find(p => p.id === action.payload.planId)
      if (plan) plan.outcomes = action.payload.outcomes
    },
    updatePlanCell(state, action: PayloadAction<{ planId: string; rowId: string; cellId: string; content: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row) {
                const cell = row.cells.find(c => c.id === action.payload.cellId);
                if (cell) cell.content = action.payload.content;
            }
        }
    },
    addPlanRow(state, action: PayloadAction<{ planId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const newRow: Row = {
                id: nanoid(),
                cells: [{ id: nanoid(), content: '', placeholder: 'New section', size: 100 }]
            };
            plan.tableContent.push(newRow);
        }
    },
    removePlanRow(state, action: PayloadAction<{ planId: string; rowId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            plan.tableContent = plan.tableContent.filter(row => row.id !== action.payload.rowId);
        }
    },
    resizePlanRow(state, action: PayloadAction<{ planId: string; rowId: string; sizes: number[] }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row && row.cells.length === action.payload.sizes.length) {
                row.cells.forEach((cell, index) => {
                    cell.size = action.payload.sizes[index];
                });
            }
        }
    },
    splitPlanCell(state, action: PayloadAction<{ planId: string; rowId: string; cellId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row) {
                const cellIndex = row.cells.findIndex(c => c.id === action.payload.cellId);
                if (cellIndex !== -1) {
                    const cellToSplit = row.cells[cellIndex];
                    const newSize = cellToSplit.size / 2;
                    
                    const newCell: Cell = { id: nanoid(), content: '', placeholder: 'New section', size: newSize };
                    
                    cellToSplit.size = newSize;
                    row.cells.splice(cellIndex + 1, 0, newCell);
                }
            }
        }
    },
    mergePlanCell(state, action: PayloadAction<{ planId: string; rowId: string; cellId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row && row.cells.length > 1) {
                const cellIndex = row.cells.findIndex(c => c.id === action.payload.cellId);
                if (cellIndex !== -1) {
                    const removedCell = row.cells[cellIndex];
                    
                    const targetIndex = cellIndex > 0 ? cellIndex - 1 : cellIndex + 1;
                    row.cells[targetIndex].size += removedCell.size;

                    row.cells.splice(cellIndex, 1);
                }
            }
        }
    },
    // This was the missing function
    applyTemplateToPlan(state, action: PayloadAction<{ planId: string; template: Template }>) {
      const plan = state.items.find(p => p.id === action.payload.planId);
      if (plan) {
        // This is a simplified logic. In a real app, you would have a more
        // complex function here to map template fields to a table structure.
        const newRows: Row[] = action.payload.template.fields.map(field => ({
          id: nanoid(),
          cells: [{ id: nanoid(), content: `<strong>${field}:</strong>`, placeholder: `Details for ${field}...`, size: 100 }]
        }));
        plan.tableContent = newRows;
      }
    }
  }
})

export const {
  createPlan, setCurrentPlan, updatePlan, deletePlan,
  setOutcomesForPlan, updatePlanCell, addPlanRow, removePlanRow,
  resizePlanRow, splitPlanCell, mergePlanCell,
  applyTemplateToPlan // **CRITICAL: Export the action here**
} = plansSlice.actions

export default plansSlice.reducer