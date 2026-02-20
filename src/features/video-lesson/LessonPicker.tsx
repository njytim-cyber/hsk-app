import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lessonUnits } from './lessonUnits'
import './LessonPicker.css'

interface UnitProgress {
    score: number
    stars: number
    completedAt: number
}

export function LessonPicker() {
    const navigate = useNavigate()
    const [progress, setProgress] = useState<Record<string, UnitProgress>>({})

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('hsk4-progress') || '{}')
            setProgress(stored)
        } catch { /* ok */ }
    }, [])

    const completedCount = Object.keys(progress).length

    return (
        <div className="lesson-picker">
            <header className="lesson-picker__header">
                <h1 className="lesson-picker__title">HSK 4 Lessons</h1>
                <p className="lesson-picker__subtitle">
                    {completedCount > 0
                        ? `${completedCount}/10 complete · ${37 - completedCount * 3} phrases left`
                        : '10 units · 37 phrases · tap to start'}
                </p>
            </header>

            <div className="lesson-picker__grid">
                {lessonUnits.map((unit, i) => {
                    const unitProgress = progress[unit.lesson.id]
                    const isDone = Boolean(unitProgress)
                    return (
                        <button
                            key={unit.id}
                            className={`unit-card ${isDone ? 'unit-card--done' : ''}`}
                            onClick={() => navigate(`/video-lesson/${unit.id}`)}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {isDone && (
                                <div className="unit-card__stars">
                                    {[1, 2, 3].map(s => (
                                        <span key={s} className={s <= (unitProgress?.stars || 0) ? 'star-filled' : 'star-empty'}>★</span>
                                    ))}
                                </div>
                            )}
                            <span className="unit-card__emoji">{unit.emoji}</span>
                            <span className="unit-card__title">{unit.title}</span>
                            <span className="unit-card__en">{unit.titleEn}</span>
                            <span className="unit-card__count">
                                {unit.lesson.words.filter(w => w.isTarget).length} phrases
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
