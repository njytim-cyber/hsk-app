import { useState, useMemo } from 'react'
import { getScrambleBlocks, shuffleArray } from './videoLessonData'
import type { VideoLessonConfig } from './videoLessonData'
import './ScrambleStage.css'

interface ScrambleStageProps {
    data: VideoLessonConfig
    onComplete: (attempts: number) => void
}

export function ScrambleStage({ data, onComplete }: ScrambleStageProps) {
    const correctOrder = useMemo(() => getScrambleBlocks(data), [data])

    // Build a lookup: hanzi → english for glosses
    const glossMap = useMemo(() => {
        const map: Record<string, string> = {}
        data.words.forEach(w => {
            if (w.hanzi.trim() && w.english) map[w.hanzi] = w.english
        })
        return map
    }, [data.words])

    const [available, setAvailable] = useState<string[]>(() => shuffleArray(correctOrder))
    const [placed, setPlaced] = useState<string[]>([])
    const [shakeIndex, setShakeIndex] = useState<number | null>(null)
    const [lastCorrectIndex, setLastCorrectIndex] = useState<number | null>(null)
    const [attempts, setAttempts] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const nextCorrectWord = correctOrder[placed.length]

    const handleTapBlock = (block: string, index: number) => {
        setAttempts(prev => prev + 1)

        if (block === nextCorrectWord) {
            // Haptic feedback on correct
            try { navigator.vibrate?.(30) } catch { /* ok */ }
            setPlaced(prev => [...prev, block])
            setAvailable(prev => prev.filter((_, i) => i !== index))
            setLastCorrectIndex(placed.length)

            if (placed.length + 1 === correctOrder.length) {
                setIsComplete(true)
                try { navigator.vibrate?.([50, 50, 100]) } catch { /* ok */ }
            }
        } else {
            // Haptic feedback on wrong
            try { navigator.vibrate?.([20, 30, 20]) } catch { /* ok */ }
            setShakeIndex(index)
            setTimeout(() => setShakeIndex(null), 500)
        }
    }

    const handleReset = () => {
        setPlaced([])
        setAvailable(shuffleArray(correctOrder))
        setShakeIndex(null)
        setLastCorrectIndex(null)
    }

    const progress = Math.round((placed.length / correctOrder.length) * 100)

    const nextCorrectAvailIndex = available.findIndex(b => b === nextCorrectWord)

    return (
        <div className="scramble-stage">
            <header className="stage-header">
                <h2 className="stage-title">Sentence Building</h2>
            </header>

            {/* English hint for learners */}
            <p className="scramble-stage__translation">{data.sentenceEn}</p>

            {/* Progress */}
            <div className="scramble-stage__progress-bar">
                <div className="scramble-stage__progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Sentence tray */}
            <div className={`scramble-stage__tray ${isComplete ? 'scramble-stage__tray--complete' : ''}`}>
                {placed.length === 0 && (
                    <span className="scramble-stage__tray-hint">Tap words in order</span>
                )}
                {placed.map((block, i) => (
                    <span
                        key={`placed-${i}`}
                        className={`tray-block ${i === lastCorrectIndex ? 'tray-block--just-placed' : ''}`}
                    >
                        {block}
                    </span>
                ))}
                {!isComplete && placed.length > 0 && <span className="tray-cursor" />}
            </div>

            {/* Available blocks with English glosses */}
            {!isComplete && (
                <div className="scramble-stage__blocks">
                    {available.map((block, i) => (
                        <button
                            key={`${block}-${i}`}
                            className={[
                                'scramble-block',
                                shakeIndex === i ? 'scramble-block--shake' : '',
                                i === nextCorrectAvailIndex && placed.length === 0 ? 'scramble-block--hint' : '',
                            ].join(' ')}
                            onClick={() => handleTapBlock(block, i)}
                        >
                            <span className="scramble-block__hanzi">{block}</span>
                            {glossMap[block] && (
                                <span className="scramble-block__gloss">{glossMap[block]}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Reset */}
            {!isComplete && placed.length > 0 && (
                <button className="reset-link" onClick={handleReset}>↺ Start over</button>
            )}

            {/* Completion */}
            {isComplete && (
                <div className="scramble-stage__complete animate-fade-up">
                    <div className="scramble-stage__success-burst">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                    <button className="continue-btn" onClick={() => onComplete(attempts)}>
                        <span>See Results</span><span className="continue-btn__arrow">→</span>
                    </button>
                </div>
            )}
        </div>
    )
}
