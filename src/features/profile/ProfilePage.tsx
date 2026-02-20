import { useState } from 'react'
import { useProgress } from '../../contexts/ProgressContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useAvatar } from '../../hooks/useAvatar'
import { hskLevels } from '../../data'
import { ProgressBar } from '../../components/common/ProgressBar'
import AvatarPicker from '../../components/avatar/AvatarPicker'
import ShopModal from '../../components/shop/ShopModal'
import type { GridStyle } from '../../components/writing/CharacterCanvas'
import type { ShopItem } from '../../data/types'
import './ProfilePage.css'

const GRID_OPTIONS: { value: GridStyle; label: string; icon: string }[] = [
    { value: 'tianzige', label: '田字格', icon: '⊞' },
    { value: 'mizige', label: '米字格', icon: '⊠' },
    { value: 'blank', label: '空白', icon: '□' },
]

export function ProfilePage() {
    const { xp, coins, streak, wordProgress, purchasedItems, getMastery, purchase } = useProgress()
    const { gridStyle, pinyinMode, showEnglish, update } = useSettings()
    const { avatar, setAvatar, avatarStyle } = useAvatar()

    const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [showShop, setShowShop] = useState(false)

    const totalWords = Object.keys(wordProgress).length
    const masteredWords = Object.values(wordProgress).filter(p => p.score >= 4).length

    const handlePurchase = (item: ShopItem) => {
        purchase(item.id, item.price)
    }

    return (
        <div className="page-profile animate-fade-up">
            {/* Avatar + Name */}
            <div className="profile-hero">
                <button
                    className="profile-avatar"
                    style={avatarStyle}
                    onClick={() => setShowAvatarPicker(true)}
                    aria-label="Change avatar"
                />
                <div className="profile-hero-info">
                    <span className="profile-hero-coins">🪙 {coins}</span>
                    <button className="shop-open-btn" onClick={() => setShowShop(true)}>
                        🏪 商店
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="profile-stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-value">{xp}</span>
                    <span className="stat-label">XP</span>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🔥</span>
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

            {showShop && (
                <ShopModal
                    coins={coins}
                    purchasedItems={purchasedItems}
                    onPurchase={handlePurchase}
                    onClose={() => setShowShop(false)}
                />
            )}
        </div>
    )
}
