import { useState, useEffect } from 'react'
import { lessonUnits } from './lessonUnits'
import './TopicsSheet.css'

interface UnitProgress {
    score: number
    stars: number
    completedAt: number
}

interface TopicsSheetProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (index: number) => void
}

export function TopicsSheet({ isOpen, onClose, onSelect }: TopicsSheetProps) {
    const [progress] = useState<Record<string, UnitProgress>>(() => {
        try {
            return JSON.parse(localStorage.getItem('hsk4-progress') || '{}')
        } catch {
            return {}
        }
    })

    const completedCount = Object.keys(progress).length

    // Lock body scroll when sheet is open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="topics-sheet">
            <div className="topics-sheet__backdrop" onClick={onClose} />
            <div className="topics-sheet__drawer">
                <div className="topics-sheet__handle" />

                <header className="topics-sheet__header">
                    <h2 className="topics-sheet__title">HSK 4 Curriculum</h2>
                    <p className="topics-sheet__subtitle">
                        {completedCount > 0
                            ? `${completedCount}/10 complete · ${37 - completedCount * 3} phrases left`
                            : '10 units · 37 phrases · tap to jump'}
                    </p>
                </header>

                <div className="topics-sheet__grid">
                    {lessonUnits.map((unit, i) => {
                        const unitProgress = progress[unit.lesson.id]
                        const isDone = Boolean(unitProgress)
                        return (
                            <button
                                key={unit.id}
                                className={`unit-card ${isDone ? 'unit-card--done' : ''}`}
                                onClick={() => {
                                    onSelect(i)
                                    onClose()
                                }}
                                style={{ animationDelay: `${i * 0.03}s` }}
                            >
                                {/* Typography Watermark */}
                                <span className="unit-card__watermark" aria-hidden="true">
                                    {unit.title.charAt(0)}
                                </span>

                                {isDone && (
                                    <div className="unit-card__stars">
                                        {[1, 2, 3].map(s => (
                                            <span key={s} className={s <= (unitProgress?.stars || 0) ? 'star-filled' : 'star-empty'}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg></span>
                                        ))}
                                    </div>
                                )}
                                <div className="unit-card__content">
                                    <span className="unit-card__title">{unit.title}</span>
                                    <span className="unit-card__en">{unit.titleEn}</span>
                                    <span className="unit-card__count">
                                        {unit.lesson.words.filter(w => w.isTarget).length} phrases
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
