import { useState } from 'react'
import { hskLevels } from '../../data'
import { useProgress } from '../../contexts/ProgressContext'
import { LevelPicker } from './LevelPicker'
import { LessonList } from './LessonList'
import { FlashcardSession } from './FlashcardSession'
import type { HSKLesson } from '../../data/types'
import './LearnPage.css'

type ViewState =
    | { mode: 'levels' }
    | { mode: 'lessons'; levelIndex: number }
    | { mode: 'flashcards'; lesson: HSKLesson }

export function LearnPage() {
    const [view, setView] = useState<ViewState>({ mode: 'levels' })
    const { getMastery } = useProgress()

    if (view.mode === 'flashcards') {
        return (
            <FlashcardSession
                lesson={view.lesson}
                onExit={() => setView({ mode: 'lessons', levelIndex: view.lesson.hskLevel - 1 })}
            />
        )
    }

    if (view.mode === 'lessons') {
        const level = hskLevels[view.levelIndex]
        return (
            <div className="page-learn animate-slide-up">
                <button
                    className="back-btn"
                    onClick={() => setView({ mode: 'levels' })}
                >
                    ← All Levels
                </button>
                <LessonList
                    level={level}
                    getMastery={getMastery}
                    onSelectLesson={(lesson) => setView({ mode: 'flashcards', lesson })}
                />
            </div>
        )
    }

    return (
        <div className="page-learn animate-slide-up">
            <LevelPicker
                levels={hskLevels}
                getMastery={getMastery}
                onSelectLevel={(i) => setView({ mode: 'lessons', levelIndex: i })}
            />
        </div>
    )
}
