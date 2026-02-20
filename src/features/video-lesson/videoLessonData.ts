/** Shared types and utilities for the video lesson system */

export interface SubtitleWord {
    hanzi: string
    pinyin: string
    english: string
    startTime: number
    endTime: number
    isTarget?: boolean
}

export interface VideoLessonConfig {
    id: string
    title: string
    titleEn: string
    hskLevel: number
    videoSrc: string
    /** Description of the intended video content (for placeholder) */
    videoDescription: string
    sentence: string
    sentenceEn: string
    words: SubtitleWord[]
    writingTarget: string[]
    scrambleAnswer: string[]
}

/** Utility: get only meaningful words (no punctuation) for scramble */
export function getScrambleBlocks(data: VideoLessonConfig): string[] {
    return data.scrambleAnswer.filter(b => !/^[，。！？、；：]$/.test(b))
}

/** Utility: shuffle an array (Fisher-Yates) */
export function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
