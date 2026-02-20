/** HSK vocabulary data model types */

export interface HSKWord {
    /** Chinese characters */
    hanzi: string
    /** Pinyin with tone marks */
    pinyin: string
    /** English translation */
    english: string
    /** HSK level (1-4) */
    hskLevel: 1 | 2 | 3 | 4
    /** Lesson ID within the level */
    lessonId: number
    /** Part of speech */
    partOfSpeech?: string
}

export interface HSKLesson {
    /** Unique lesson identifier */
    id: number
    /** Chinese title */
    title: string
    /** English title */
    titleEn: string
    /** HSK level */
    hskLevel: 1 | 2 | 3 | 4
    /** Words in this lesson */
    words: HSKWord[]
}

export interface HSKLevel {
    level: 1 | 2 | 3 | 4
    label: string
    color: string
    totalWords: number
    lessons: HSKLesson[]
}

/** SRS word state */
export interface WordProgress {
    /** Character or word key */
    key: string
    /** Mastery score 0-5 */
    score: number
    /** Days until next review */
    interval: number
    /** Timestamp of next review */
    nextReview: number
    /** Ease factor for SRS */
    easeFactor: number
    /** Total times reviewed */
    reviewCount: number
}

/** Session result after completing a practice round */
export interface SessionResult {
    wordsCompleted: number
    totalWords: number
    mistakeCount: number
    durationMs: number
    xpEarned: number
}

/** ═══ Shop System Types ═══ */

export type ShopItemType = 'cosmetic' | 'consumable' | 'permanent' | 'content'
export type ShopCategory = 'appearance' | 'powerup' | 'tool' | 'content'

export interface ShopItem {
    id: string
    name: string
    description: string
    price: number
    type: ShopItemType
    category: ShopCategory
    icon: string
    /** Whether item can be purchased multiple times */
    stackable?: boolean
    /** Item-specific data */
    data?: Record<string, unknown>
}

/** ═══ Avatar System ═══ */

export interface AvatarPosition {
    /** X position in sprite sheet (0-100 %) */
    posX: number
    /** Y position in sprite sheet (0-100 %) */
    posY: number
}
