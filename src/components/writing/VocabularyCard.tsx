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
                    🔊
                </button>
            )}
        </div>
    )
}
