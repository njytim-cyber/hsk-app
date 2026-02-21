import { useState } from 'react'
import { useProgress } from '../../contexts/ProgressContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useAvatar } from '../../hooks/useAvatar'
import { hskLevels } from '../../data'
import { ProgressBar } from '../../components/common/ProgressBar'
import AvatarPicker from '../../components/avatar/AvatarPicker'
import type { GridStyle } from '../../components/writing/CharacterCanvas'
import './ProfilePage.css'

const GRID_OPTIONS: { value: GridStyle; label: string; icon: string }[] = [
    { value: 'tianzige', label: '田字格', icon: '⊞' },
    { value: 'mizige', label: '米字格', icon: '⊠' },
    { value: 'blank', label: '空白', icon: '□' },
]

export function ProfilePage() {
    const { xp, streak, wordProgress, getMastery } = useProgress()
    const { gridStyle, pinyinMode, showEnglish, update } = useSettings()
    const { avatar, setAvatar, avatarStyle } = useAvatar()

    const [showAvatarPicker, setShowAvatarPicker] = useState(false)

    const totalWords = Object.keys(wordProgress).length
    const masteredWords = Object.values(wordProgress).filter(p => p.score >= 4).length

    return (
        <div className="page-profile animate-fade-up">
            {/* Avatar + Quote */}
            <div className="profile-hero">
                <button
                    className="profile-avatar"
                    style={avatarStyle}
                    onClick={() => setShowAvatarPicker(true)}
                    aria-label="Change avatar"
                >
                    {(!avatarStyle || !avatarStyle.backgroundImage) && <span className="avatar-placeholder">学</span>}
                </button>
                <div className="profile-hero-info">
                    <span className="profile-hero-name">学海无涯</span>
                    <span className="profile-quote">"Learning is a boundless sea."</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="profile-stats-grid">
                <div className="stat-card">
                    <span className="stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg></span>
                    <span className="stat-value">{xp}</span>
                    <span className="stat-label">XP</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg></span>
                    <span className="stat-value">{streak}</span>
                    <span className="stat-label">Day Streak</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📝</span>
                    <span className="stat-value">{totalWords}</span>
                    <span className="stat-label">Words Seen</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <span className="stat-value">{masteredWords}</span>
                    <span className="stat-label">Mastered</span>
                </div>
            </div>

            {/* Level Mastery */}
            <section className="profile-section">
                <h3 className="section-title">Level Progress</h3>
                {hskLevels.filter(l => l.totalWords > 0).map(level => {
                    const wordKeys = level.lessons.flatMap(l => l.words.map(w => w.hanzi))
                    const mastery = getMastery(wordKeys)
                    return (
                        <div key={level.level} className="mastery-row">
                            <span className="mastery-label" style={{ color: level.color }}>{level.label}</span>
                            <ProgressBar value={mastery} color={level.color} showPercent />
                        </div>
                    )
                })}
            </section>

            {/* Settings */}
            <section className="profile-section">
                <h3 className="section-title">Settings</h3>

                {/* Grid style */}
                <div className="setting-row">
                    <span className="setting-label">Grid Paper</span>
                    <div className="setting-options">
                        {GRID_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                className={`setting-btn ${gridStyle === opt.value ? 'active' : ''}`}
                                onClick={() => update('gridStyle', opt.value)}
                            >
                                <span>{opt.icon}</span>
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pinyin mode */}
                <div className="setting-row">
                    <span className="setting-label">Pinyin Display</span>
                    <div className="setting-options">
                        {(['always', 'hint', 'never'] as const).map(mode => (
                            <button
                                key={mode}
                                className={`setting-btn ${pinyinMode === mode ? 'active' : ''}`}
                                onClick={() => update('pinyinMode', mode)}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Show English toggle */}
                <div className="setting-row">
                    <span className="setting-label">Show English</span>
                    <button
                        className={`toggle-btn ${showEnglish ? 'on' : ''}`}
                        onClick={() => update('showEnglish', !showEnglish)}
                        role="switch"
                        aria-checked={showEnglish}
                    >
                        <span className="toggle-thumb" />
                    </button>
                </div>
            </section>

            {/* Modals */}
            {showAvatarPicker && (
                <AvatarPicker
                    current={avatar}
                    onSelect={setAvatar}
                    onClose={() => setShowAvatarPicker(false)}
                />
            )}
        </div>
    )
}
