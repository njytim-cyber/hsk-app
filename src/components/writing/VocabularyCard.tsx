import type { HSKWord } from '../../data/types'
import './VocabularyCard.css'

interface VocabularyCardProps {
    word: HSKWord
    showPinyin?: boolean
    showEnglish?: boolean
    onPlayAudio?: (word: HSKWord) => void
    onClick?: () => void
}

export function VocabularyCard({
    word,
    showPinyin = true,
    showEnglish = true,
    onPlayAudio,
    onClick,
}: VocabularyCardProps) {
    return (
        <div className="vocab-card" onClick={onClick} role={onClick ? 'button' : undefined}>
            <div className="vocab-hanzi">{word.hanzi}</div>
            {showPinyin && <div className="vocab-pinyin">{word.pinyin}</div>}
            {showEnglish && <div className="vocab-english">{word.english}</div>}
            {onPlayAudio && (
                <button
                    className="vocab-audio-btn"
                    onClick={(e) => { e.stopPropagation(); onPlayAudio(word); }}
                    aria-label={`Play audio for ${word.hanzi}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginTop: '-2px' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                </button>
            )}
        </div>
    )
}
