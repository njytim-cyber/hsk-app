import type { HSKLevel } from '../../data/types'
import { ProgressBar } from '../../components/common/ProgressBar'
import './LevelPicker.css'

interface LevelPickerProps {
    levels: HSKLevel[]
    getMastery: (keys: string[]) => number
    onSelectLevel: (index: number) => void
}

export function LevelPicker({ levels, getMastery, onSelectLevel }: LevelPickerProps) {
    return (
        <div className="level-picker">
            <h2 className="level-picker-title">选择等级</h2>
            <p className="level-picker-subtitle">Choose your HSK level</p>
            <div className="level-grid">
                {levels.map((level, i) => {
                    const wordKeys = level.lessons.flatMap(l => l.words.map(w => w.hanzi))
                    const mastery = getMastery(wordKeys)
                    const isAvailable = level.totalWords > 0

                    return (
                        <button
                            key={level.level}
                            className={`level-card ${!isAvailable ? 'level-locked' : ''}`}
                            onClick={() => isAvailable && onSelectLevel(i)}
                            disabled={!isAvailable}
                            style={{ '--level-color': level.color } as React.CSSProperties}
                        >
                            <div className="level-badge" style={{ background: level.color }}>
                                {level.level}
                            </div>
                            <div className="level-info">
                                <span className="level-label">{level.label}</span>
                                <span className="level-words">
                                    {isAvailable ? `${level.totalWords} words · ${level.lessons.length} lessons` : 'Coming soon'}
                                </span>
                            </div>
                            {isAvailable && (
                                <ProgressBar value={mastery} color={level.color} showPercent />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
