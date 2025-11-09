import React from 'react'
import type { TemplateField } from '../lib/types'
import { FIELD_HINTS, labelForField } from '../lib/templateFields'

type PreviewRow =
  | { type: 'standard'; field: TemplateField }
  | { type: 'timed'; field: 'timedActivities' }

const DEFAULT_HINT = 'Space for detailed notes or bullet points.'

export default function TemplatePreview({ fields }: { fields: TemplateField[] }) {
  const rows: PreviewRow[] = []
  fields.forEach((field) => {
    if (field === 'timedActivities') {
      rows.push({ type: 'timed', field: 'timedActivities' })
    } else {
      rows.push({ type: 'standard', field })
    }
  })

  return (
    <div className="border border-gray-300 rounded-lg bg-white/90 shadow-sm overflow-hidden">
      <table className="w-full border-collapse text-xs">
        <tbody>
          {rows.map((row, index) => {
            if (row.type === 'timed') {
              return (
                <tr key={`${row.field}-${index}`}>
                  <td colSpan={2} className="p-0 border-t border-gray-300">
                    <TimedActivitiesPreview />
                  </td>
                </tr>
              )
            }
            return (
              <tr key={`${row.field}-${index}`}>
                <td className="w-1/3 border-t border-gray-300 bg-gray-50 px-3 py-2 font-semibold uppercase tracking-wide">
                  {labelForField(row.field)}
                </td>
                <td className="border-t border-l border-gray-300 h-12 px-3 py-2 italic text-gray-500">
                  {FIELD_HINTS[row.field] || DEFAULT_HINT}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TimedActivitiesPreview() {
  return (
    <div className="w-full">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border-b border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold uppercase tracking-wide">
              Time for activity (minutes)
            </th>
            <th className="border-b border-l border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold uppercase tracking-wide">
              Description of activity / new learning
            </th>
            <th className="border-b border-l border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold uppercase tracking-wide">
              Check for understanding
            </th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={`timed-row-${row}`}>
              <td className="border-b border-gray-300 px-3 py-3 text-gray-400 italic">e.g., 10 min</td>
              <td className="border-b border-l border-gray-300 px-3 py-3 text-gray-400 italic">
                Outline the learning task, cues, and transitions.
              </td>
              <td className="border-b border-l border-gray-300 px-3 py-3 text-gray-400 italic">
                List checks (questioning, exit slip, observation).
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
