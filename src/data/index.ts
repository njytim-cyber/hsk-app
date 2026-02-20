import type { HSKLevel } from './types'
import { hsk1Lessons, hsk1Words } from './hsk1'

/** All HSK levels with metadata */
export const hskLevels: HSKLevel[] = [
    {
        level: 1,
        label: 'HSK 1',
        color: 'var(--hsk1-color)',
        totalWords: hsk1Words.length,
        lessons: hsk1Lessons,
    },
    {
        level: 2,
        label: 'HSK 2',
        color: 'var(--hsk2-color)',
        totalWords: 0, // Placeholder — data coming in future
        lessons: [],
    },
    {
        level: 3,
        label: 'HSK 3',
        color: 'var(--hsk3-color)',
        totalWords: 0,
        lessons: [],
    },
    {
        level: 4,
        label: 'HSK 4',
        color: 'var(--hsk4-color)',
        totalWords: 0,
        lessons: [],
    },
]

/** Get all words for a specific HSK level */
export function getWordsForLevel(level: 1 | 2 | 3 | 4) {
    const levelData = hskLevels.find(l => l.level === level)
    return levelData?.lessons.flatMap(l => l.words) ?? []
}

/** Get a specific lesson by ID */
export function getLessonById(lessonId: number) {
    for (const level of hskLevels) {
        const lesson = level.lessons.find(l => l.id === lessonId)
        if (lesson) return lesson
    }
    return undefined
}

/** Get all available lessons across all levels */
export function getAllLessons() {
    return hskLevels.flatMap(l => l.lessons)
}
