import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { Plan, TimedActivity, RubricCriterion, Outcome, Row, Cell, TemplateField } from '../../lib/types'

type PlansState = {
  items: Plan[]
  currentId?: string
}

// ... (default table and empty plan functions remain the same) ...
const createDefaultTable = (): Row[] => [
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Date:</strong>', placeholder: 'Date', colSpan: 1 },
        { id: nanoid(), content: '<strong>Grade/Class:</strong>', placeholder: 'Grade/Class', colSpan: 1 },
        { id: nanoid(), content: '<strong>Name:</strong>', placeholder: 'Name', colSpan: 1 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Course/level:</strong>', placeholder: 'Course/level', colSpan: 1 },
        { id: nanoid(), content: '<strong>School:</strong>', placeholder: 'School', colSpan: 1 },
        { id: nanoid(), content: '<strong>Lesson time:</strong>', placeholder: 'Lesson time', colSpan: 1 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Prerequisites/Previous Knowledge:</strong>', placeholder: 'Students should have a basic understanding of...', colSpan: 2 },
        { id: nanoid(), content: '<strong>Location/facility:</strong>', placeholder: 'e.g., Classroom, Gym', colSpan: 1 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Outcome(s) (quoted from program of studies):</strong>', placeholder: 'e.g., SCI10-1: Analyze the structure of cells', colSpan: 2 },
        { id: nanoid(), content: '<strong>Resources (e.g., materials for teacher and/or learner, technical requirements):</strong>', placeholder: 'Textbooks, video links, chart paper', colSpan: 1 },
      ],
    },
    {
      id: nanoid(),
      cells: [
        { id: nanoid(), content: '<strong>Goal of this lesson/demo (what will students know, understand and be able to do after this lesson):</strong>', placeholder: 'What will students know, understand, and be able to do?', colSpan: 2 },
        { id: nanoid(), content: '<strong>Safety Considerations:</strong>', placeholder: 'e.g., Proper handling of lab equipment', colSpan: 1 },
      ],
    },
    {
      id: nanoid(),
      cells: [{ id: nanoid(), content: '<strong>Essential question(s):</strong>', placeholder: 'Enter essential questions...', colSpan: 3 }],
    },
    {
      id: nanoid(),
      cells: [{ id: nanoid(), content: '<strong>Essential vocabulary:</strong>', placeholder: 'Enter essential vocabulary...', colSpan: 3 }],
    },
    {
      id: nanoid(),
      cells: [{ id: nanoid(), content: '<strong>Cross-curricular connections (opportunities for synthesis and application) - choose specific outcomes.</strong>', placeholder: 'Enter cross-curricular connections...', colSpan: 3 }],
    },
    {
      id: nanoid(),
      cells: [{ id: nanoid(), content: '<strong>Differentiated instructions (i.e., select one student and select one group and provide detailed instructions):</strong>', placeholder: 'Enter differentiated instructions...', colSpan: 3 }],
    },
    {
      id: nanoid(),
      isHeader: true,
      cells: [
          { id: nanoid(), content: '<b>Time for activity (in minutes)</b>', placeholder: '', colSpan: 1 },
          { id: nanoid(), content: '<b>Description of activity, New learning</b>', placeholder: '', colSpan: 1 },
          { id: nanoid(), content: '<b>Check for understanding (formative, summative assessments)</b>', placeholder: '', colSpan: 1 },
      ]
    },
    {
      id: nanoid(),
      cells: [
          { id: nanoid(), content: '', placeholder: 'Anticipatory set/hook/introduction', colSpan: 1 },
          { id: nanoid(), content: '', placeholder: 'Body/activities/strategies (this section should be VERY detailed)', colSpan: 1 },
          { id: nanoid(), content: '<ul><li>real world, community connections</li><li>Student Feedback opportunities</li><li>Looking ahead</li></ul>', placeholder: 'Closing', colSpan: 1 },
      ]
    }
];
const emptyPlan = (classId: string, folderId: string | null): Plan => ({
  id: nanoid(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  title: 'Untitled Lesson',
  grade: '',
  subject: '',
  topic: '',
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
  classId,
  folderId,
})


// Helper to create a new table structure from a template's fields
const createTableFromTemplate = (fields: TemplateField[]): Row[] => {
    const newRows: Row[] = [];
    const fieldToAction: Record<TemplateField, () => void> = {
        title: () => {}, // Title is handled separately
        grade: () => {}, // Grade is handled separately
        subject: () => {}, // Subject is handled separately
        duration: () => {}, // Duration is handled separately
        outcomes: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Outcomes:</strong>', placeholder: 'List program of studies outcomes...', colSpan: 3 }]
        }),
        objectives: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Objectives:</strong>', placeholder: 'What will students be able to do?', colSpan: 3 }]
        }),
        materials: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Materials & Resources:</strong>', placeholder: 'List all required materials...', colSpan: 3 }]
        }),
        priorKnowledge: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Prior Knowledge:</strong>', placeholder: 'What should students already know?', colSpan: 3 }]
        }),
        activities: () => newRows.push(
            {
                id: nanoid(),
                isHeader: true,
                cells: [
                    { id: nanoid(), content: '<b>Time (min)</b>', placeholder: '', colSpan: 1 },
                    { id: nanoid(), content: '<b>Activity Description</b>', placeholder: '', colSpan: 2 },
                ]
            },
            {
                id: nanoid(),
                cells: [
                    { id: nanoid(), content: '', placeholder: 'e.g., 15', colSpan: 1 },
                    { id: nanoid(), content: '', placeholder: 'Introduction / Hook', colSpan: 2 },
                ]
            }
        ),
        assessment: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Assessment:</strong>', placeholder: 'How will you check for understanding?', colSpan: 3 }]
        }),
        differentiation: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Differentiation:</strong>', placeholder: 'How will you support diverse learners?', colSpan: 3 }]
        }),
        extensions: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Extensions:</strong>', placeholder: 'Activities for early finishers...', colSpan: 3 }]
        }),
        references: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>References:</strong>', placeholder: 'Cite any sources used...', colSpan: 3 }]
        }),
        rubric: () => newRows.push({
            id: nanoid(),
            cells: [{ id: nanoid(), content: '<strong>Rubric:</strong>', placeholder: 'Define criteria for success...', colSpan: 3 }]
        }),
    };

    fields.forEach(field => {
        if (fieldToAction[field]) {
            fieldToAction[field]();
        }
    });

    return newRows;
};

const initial: PlansState = {
  items: [],
  currentId: undefined,
}

type CreatePlanPayload = {
    classId: string;
    folderId: string | null;
    title: string;
    grade: string;
    subject: string;
    topic: string;
    fields: TemplateField[];
    optionalFieldContent: Partial<Record<TemplateField, string>>;
};

const plansSlice = createSlice({
  name: 'plans',
  initialState: initial,
  reducers: {
    addPlan(state, action: PayloadAction<Plan>) {
        state.items.push(action.payload);
    },
    createPlan(state, action: PayloadAction<CreatePlanPayload>) {
      const { classId, folderId, title, grade, subject, topic, fields, optionalFieldContent } = action.payload;
      
      const tableContent = createTableFromTemplate(fields);

      const fieldToCellMarker: Partial<Record<TemplateField, string>> = {
          outcomes: '<strong>Outcomes:</strong>',
          objectives: '<strong>Objectives:</strong>',
          materials: '<strong>Materials & Resources:</strong>',
          priorKnowledge: '<strong>Prior Knowledge:</strong>',
          assessment: '<strong>Assessment:</strong>',
          differentiation: '<strong>Differentiation:</strong>',
          extensions: '<strong>Extensions:</strong>',
          references: '<strong>References:</strong>',
          rubric: '<strong>Rubric:</strong>'
      };

      if (optionalFieldContent) {
          for (const [field, content] of Object.entries(optionalFieldContent)) {
              if (!content) continue;
              const marker = fieldToCellMarker[field as TemplateField];
              let cellUpdated = false;

              if (marker) {
                  for (const row of tableContent) {
                      for (const cell of row.cells) {
                          if (cell.content.includes(marker)) {
                              cell.content += `<p>${content.replace(/\n/g, '<br>')}</p>`;
                              cellUpdated = true;
                              break;
                          }
                      }
                      if (cellUpdated) break;
                  }
              } else if (field === 'activities') {
                  const activitiesHeaderIndex = tableContent.findIndex(row => 
                      row.isHeader && row.cells.some(cell => cell.content.includes('Activity Description'))
                  );
                  if (activitiesHeaderIndex !== -1 && activitiesHeaderIndex + 1 < tableContent.length) {
                      const activityContentRow = tableContent[activitiesHeaderIndex + 1];
                      if (activityContentRow.cells.length > 1) {
                          activityContentRow.cells[1].content = `<p>${content.replace(/\n/g, '<br>')}</p>`;
                      }
                  }
              }
          }
      }

      const newPlan: Plan = {
          ...emptyPlan(classId, folderId),
          title,
          grade,
          subject,
          topic,
          tableContent: [
              {
                  id: nanoid(),
                  cells: [
                    { id: nanoid(), content: `<strong>Grade:</strong> ${grade}`, placeholder: '', colSpan: 1 },
                    { id: nanoid(), content: `<strong>Subject:</strong> ${subject}`, placeholder: '', colSpan: 1 },
                    { id: nanoid(), content: `<strong>Topic:</strong> ${topic}`, placeholder: '', colSpan: 1 },
                  ]
              },
              ...tableContent
          ],
      };
      
      state.items.unshift(newPlan);
      state.currentId = newPlan.id;
    },
    importUploadedPlan(state, action: PayloadAction<{ classId: string; folderId: string | null; file: { name: string; type: string } }>) {
        const { classId, folderId, file } = action.payload;
        const lastDotIndex = file.name.lastIndexOf('.');
        const title = lastDotIndex > 0 ? file.name.slice(0, lastDotIndex) : file.name;

        const newPlan: Plan = {
            id: nanoid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: title,
            classId: classId,
            folderId: folderId,
            uploadedFile: file,
            grade: '',
            subject: '',
            topic: '',
            duration: 0,
            outcomes: [],
            objectives: `File uploaded: ${file.name}`,
            materials: [],
            priorKnowledge: '',
            activities: [],
            assessment: '',
            differentiation: '',
            extensions: '',
            references: '',
            rubric: { criteria: [] },
            tableContent: [
                {
                    id: nanoid(),
                    cells: [
                        {
                            id: nanoid(),
                            content: `<h3>Uploaded File: ${file.name}</h3><p>This lesson plan was created from an uploaded file. You can add notes and details below.</p>`,
                            placeholder: '',
                            colSpan: 3
                        }
                    ]
                }
            ],
        };
        state.items.unshift(newPlan);
        state.currentId = newPlan.id;
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
    softDeletePlan(state, action: PayloadAction<string>) {
        const plan = state.items.find(p => p.id === action.payload);
        if (plan) {
            plan.deletedAt = new Date().toISOString();
        }
    },
    restorePlan(state, action: PayloadAction<string>) {
        const plan = state.items.find(p => p.id === action.payload);
        if (plan) {
            plan.deletedAt = null;
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
            plan.updatedAt = new Date().toISOString();
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row) {
                const cell = row.cells.find(c => c.id === action.payload.cellId);
                if (cell) {
                    cell.content = action.payload.content;
                }
            }
        }
    },
    addPlanRow(state, action: PayloadAction<{ planId: string; rowIndex?: number }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            plan.updatedAt = new Date().toISOString();
            const { rowIndex } = action.payload;
            const newRow: Row = { id: nanoid(), cells: [] };

            let referenceCellCount = 1;
            // If inserting after a specific row, mimic its structure
            if (rowIndex !== undefined && plan.tableContent[rowIndex]) {
                referenceCellCount = plan.tableContent[rowIndex].cells.length;
            }

            const totalSize = 100;
            const sizePerCell = totalSize / referenceCellCount;

            for (let i = 0; i < referenceCellCount; i++) {
                newRow.cells.push({
                    id: nanoid(),
                    content: '',
                    placeholder: 'New cell',
                    size: sizePerCell,
                });
            }
            // If only one cell, use a more descriptive placeholder.
            if (newRow.cells.length === 1) {
                newRow.cells[0].placeholder = 'New section';
            }

            if (rowIndex !== undefined) {
                plan.tableContent.splice(rowIndex + 1, 0, newRow);
            } else {
                plan.tableContent.push(newRow);
            }
        }
    },
    removePlanRow(state, action: PayloadAction<{ planId: string; rowId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            plan.updatedAt = new Date().toISOString();
            plan.tableContent = plan.tableContent.filter(row => row.id !== action.payload.rowId);
        }
    },
    movePlanRow(state, action: PayloadAction<{ planId: string; fromIndex: number; toIndex: number }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const [movedRow] = plan.tableContent.splice(action.payload.fromIndex, 1);
            plan.tableContent.splice(action.payload.toIndex, 0, movedRow);
        }
    },
    movePlanCell(state, action: PayloadAction<{ planId: string; rowId: string; fromIndex: number; toIndex: number }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row) {
                const [movedCell] = row.cells.splice(action.payload.fromIndex, 1);
                row.cells.splice(action.payload.toIndex, 0, movedCell);
            }
        }
    },
    resizePlanRow(state, action: PayloadAction<{ planId: string; rowId: string; sizes: number[] }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const row = plan.tableContent.find(r => r.id === action.payload.rowId);
            if (row) {
                row.cells.forEach((cell, index) => {
                    if (action.payload.sizes[index] !== undefined) {
                        cell.size = action.payload.sizes[index];
                    }
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
                if (cellIndex >= 0) {
                    const originalCell = row.cells[cellIndex];
                    const newSize = (originalCell.size || 100 / row.cells.length) / 2;
                    originalCell.size = newSize;
                    const newCell: Cell = {
                        id: nanoid(),
                        content: '',
                        placeholder: 'New cell',
                        size: newSize
                    };
                    row.cells.splice(cellIndex + 1, 0, newCell);
                }
            }
        }
    },
    mergePlanCell(state, action: PayloadAction<{ planId: string; rowId: string; cellId: string }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            const rowIdx = plan.tableContent.findIndex(r => r.id === action.payload.rowId);
            if (rowIdx !== -1) {
                const row = plan.tableContent[rowIdx];
                const cellIndex = row.cells.findIndex(c => c.id === action.payload.cellId);
                
                if (cellIndex !== -1) {
                    row.cells.splice(cellIndex, 1); // Remove the cell

                    if (row.cells.length === 0) {
                        // If the row is now empty, remove the row itself
                        plan.tableContent.splice(rowIdx, 1);
                    } else {
                        // Otherwise, redistribute sizes evenly
                        const evenSize = 100 / row.cells.length;
                        row.cells.forEach(cell => {
                            cell.size = evenSize;
                        });
                    }
                }
            }
        }
    },
    applyTemplateToPlan(state, action: PayloadAction<{ planId: string; fields: TemplateField[] }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            plan.updatedAt = new Date().toISOString();
            plan.tableContent = createTableFromTemplate(action.payload.fields);
        }
    },
    duplicatePlan(state, action: PayloadAction<{ planId: string }>) {
        const originalPlan = state.items.find(p => p.id === action.payload.planId);
        if (originalPlan) {
            const newPlan: Plan = {
                ...JSON.parse(JSON.stringify(originalPlan)),
                id: nanoid(),
                title: `${originalPlan.title} Copy`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            state.items.unshift(newPlan);
        }
    },
    pasteCopiedPlan(state, action: PayloadAction<{ sourcePlanId: string, targetClassId: string, targetFolderId: string | null }>) {
        const originalPlan = state.items.find(p => p.id === action.payload.sourcePlanId);
        if (originalPlan) {
            const newPlan: Plan = {
                ...JSON.parse(JSON.stringify(originalPlan)),
                id: nanoid(),
                classId: action.payload.targetClassId,
                folderId: action.payload.targetFolderId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            state.items.unshift(newPlan);
        }
    },
    movePlan(state, action: PayloadAction<{ planId: string; targetClassId: string; targetFolderId: string | null }>) {
        const plan = state.items.find(p => p.id === action.payload.planId);
        if (plan) {
            plan.classId = action.payload.targetClassId;
            plan.folderId = action.payload.targetFolderId;
            plan.updatedAt = new Date().toISOString();
        }
    },
  }
})

export const {
  addPlan, createPlan, setCurrentPlan, updatePlan, deletePlan,
  setOutcomesForPlan, updatePlanCell, addPlanRow, removePlanRow,
  movePlanRow, movePlanCell, resizePlanRow, splitPlanCell, mergePlanCell,
  applyTemplateToPlan, importUploadedPlan,
  duplicatePlan, pasteCopiedPlan, movePlan,
  softDeletePlan, restorePlan
} = plansSlice.actions

export default plansSlice.reducer