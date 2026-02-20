import type { HSKLevel, HSKLesson } from '../../data/types'
import { ProgressBar } from '../../components/common/ProgressBar'
import './LessonList.css'

interface LessonListProps {
    level: HSKLevel
    getMastery: (keys: string[]) => number
    onSelectLesson: (lesson: HSKLesson) => void
}

export function LessonList({ level, getMastery, onSelectLesson }: LessonListProps) {
    return (
        <div className="lesson-list">
            <h2 className="lesson-list-title">{level.label}</h2>
            <p className="lesson-list-subtitle">{level.totalWords} words · {level.lessons.length} lessons</p>

            <div className="lesson-grid">
                {level.lessons.map((lesson, i) => {
                    const wordKeys = lesson.words.map(w => w.hanzi)
                    const mastery = getMastery(wordKeys)

                    return (
                        <button
                            key={lesson.id}
                            className="lesson-card"
                            onClick={() => onSelectLesson(lesson)}
                        >
                            <div className="lesson-number">{i + 1}</div>
                            <div className="lesson-info">
                                <span className="lesson-title">{lesson.title}</span>
                                <span className="lesson-title-en">{lesson.titleEn}</span>
                                <span className="lesson-count">{lesson.words.length} words</span>
                            </div>
                            <ProgressBar value={mastery} color={level.color} />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
