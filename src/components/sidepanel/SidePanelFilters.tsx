import './SidePanel.css'
import type { CSSProperties } from 'react'

import { FORM_FILTERS, TYPE_COLORS } from '../../lib/constants'
import { getContrastColor, toRgba } from '../../lib/ui'
import type { FormTag } from '../../lib/types'
import { chipBase, panelCardBase } from '../styles'

type SidePanelFiltersProps = {
  generationOptions: number[]
  selectedGenerations: number[]
  typeOptions: string[]
  selectedTypes: string[]
  selectedForms: FormTag[]
  panelSwatchA: string
  panelSwatchB: string
  chipStyle: (active: boolean, base: string) => CSSProperties
  onToggleGeneration: (gen: number) => void
  onToggleType: (type: string) => void
  onToggleForm: (form: FormTag) => void
  onClearFilters: () => void
}

export const SidePanelFilters = ({
  generationOptions,
  selectedGenerations,
  typeOptions,
  selectedTypes,
  selectedForms,
  panelSwatchA,
  panelSwatchB,
  chipStyle,
  onToggleGeneration,
  onToggleType,
  onToggleForm,
  onClearFilters,
}: SidePanelFiltersProps) => {
  return (
    <div className={`${panelCardBase} side-panel-section side-panel-filters space-y-4`}>
      <div className="side-panel-section-header flex items-center justify-between">
        <h3 className="side-panel-section-heading text-sm font-semibold uppercase tracking-[0.1em]">
          Filters
        </h3>
        <button
          className={`${chipBase} side-panel-clear`}
          style={chipStyle(false, panelSwatchA)}
          onClick={onClearFilters}
        >
          Clear
        </button>
      </div>

      <div className="side-panel-filter-groups space-y-5">
        <div className="side-panel-filter">
          <p className="side-panel-section-title text-xs font-semibold uppercase tracking-[0.1em] text-[var(--panel-ink-muted)]">
            Generation
          </p>
          <div className="side-panel-filter-options mt-2 flex flex-wrap gap-[2px]">
            {generationOptions.map((gen) => (
              <button
                key={`gen-${gen}`}
                className={`${chipBase} side-panel-filter-chip`}
                style={chipStyle(selectedGenerations.includes(gen), panelSwatchB)}
                onClick={() => onToggleGeneration(gen)}
              >
                Gen {gen}
              </button>
            ))}
          </div>
        </div>

        <div className="side-panel-filter">
          <p className="side-panel-section-title text-xs font-semibold uppercase tracking-[0.1em] text-[var(--panel-ink-muted)]">
            Type
          </p>
          <div className="side-panel-filter-options mt-2 flex flex-wrap gap-[2px]">
            {typeOptions.map((type) => {
              const isActive = selectedTypes.includes(type)
              const color = TYPE_COLORS[type] ?? '#64748B'
              return (
                <button
                  key={type}
                  className={`${chipBase} side-panel-filter-chip`}
                  style={{
                    borderColor: isActive ? toRgba(color, 0.5) : toRgba(color, 0.22),
                    backgroundColor: isActive ? color : toRgba(color, 0.2),
                    color: isActive ? getContrastColor(color) : 'var(--panel-ink)',
                    boxShadow: isActive ? `0 12px 24px ${toRgba(color, 0.35)}` : undefined,
                  }}
                  onClick={() => onToggleType(type)}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        <div className="side-panel-filter">
          <p className="side-panel-section-title text-xs font-semibold uppercase tracking-[0.1em] text-[var(--panel-ink-muted)]">
            Forms
          </p>
          <div className="side-panel-filter-options mt-2 flex flex-wrap gap-[2px]">
            {FORM_FILTERS.map((form) => (
              <button
                key={form.id}
                className={`${chipBase} side-panel-filter-chip`}
                style={chipStyle(selectedForms.includes(form.id), panelSwatchA)}
                onClick={() => onToggleForm(form.id)}
              >
                {form.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
