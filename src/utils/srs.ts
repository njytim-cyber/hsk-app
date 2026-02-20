import type { WordProgress } from '../data/types'

/**
 * Spaced Repetition System — SM-2 inspired algorithm
 * Adapted from chinese-tingxie's SRS engine
 */

/** Create initial progress for a new word */
export function createWordProgress(key: string): WordProgress {
    return {
        key,
        score: 0,
        interval: 0,
        nextReview: Date.now(),
        easeFactor: 2.5,
        reviewCount: 0,
    }
}

/**
 * Grade a word after review
 * @param progress Current word progress
 * @param quality Rating 0-5 (0=complete fail, 5=perfect)
 * @returns Updated word progress
 */
export function gradeWord(progress: WordProgress, quality: number): WordProgress {
    const q = Math.max(0, Math.min(5, quality))
    const now = Date.now()

    // Update ease factor (SM-2 formula)
    let ef = progress.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    ef = Math.max(1.3, ef)

    // Calculate new interval
    let interval: number
    if (q < 3) {
        // Failed — reset to beginning
        interval = 0
    } else if (progress.interval === 0) {
        interval = 1
    } else if (progress.interval === 1) {
        interval = 6
    } else {
        interval = Math.round(progress.interval * ef)
    }

    // Determine mastery score (0-5)
    let score = progress.score
    if (q >= 4) {
        score = Math.min(5, score + 1)
    } else if (q < 3) {
        score = Math.max(0, score - 1)
    }

    return {
        key: progress.key,
        score,
        interval,
        nextReview: now + interval * 24 * 60 * 60 * 1000,
        easeFactor: ef,
        reviewCount: progress.reviewCount + 1,
    }
}

/** Get all words due for review, sorted by most overdue first */
export function getDueWords(progressMap: Record<string, WordProgress>): WordProgress[] {
    const now = Date.now()
    return Object.values(progressMap)
        .filter(p => p.nextReview <= now)
        .sort((a, b) => a.nextReview - b.nextReview)
}

/** Calculate mastery percentage for a set of words */
export function getMasteryPercent(
    wordKeys: string[],
    progressMap: Record<string, WordProgress>
): number {
    if (wordKeys.length === 0) return 0
    const totalScore = wordKeys.reduce((sum, key) => {
        return sum + (progressMap[key]?.score ?? 0)
    }, 0)
    return Math.round((totalScore / (wordKeys.length * 5)) * 100)
}
