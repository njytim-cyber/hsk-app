import { useState, useCallback } from 'react'
import { lessonUnits } from './lessonUnits'
import { VideoLessonPage } from './VideoLessonPage'
import { TopicsSheet } from './TopicsSheet'
import './VideoFeed.css'

export function VideoFeed() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [slideDir, setSlideDir] = useState<'up' | 'down'>('up')
    const [showTopics, setShowTopics] = useState(false)

    const goToLesson = useCallback((index: number, direction: 'up' | 'down') => {
        if (index < 0 || index >= lessonUnits.length || transitioning) return
        setSlideDir(direction)
        setTransitioning(true)
        setTimeout(() => {
            setCurrentIndex(index)
            setTransitioning(false)
        }, 250)
    }, [transitioning])

    const handleSwipeUp = useCallback(() => {
        goToLesson(currentIndex + 1, 'up')
    }, [currentIndex, goToLesson])

    const handleSwipeDown = useCallback(() => {
        goToLesson(currentIndex - 1, 'down')
    }, [currentIndex, goToLesson])

    const handleExit = useCallback(() => {
        setShowTopics(true)
    }, [])

    const unit = lessonUnits[currentIndex]

    const exitClass = slideDir === 'up' ? 'vf-slide--exit-up' : 'vf-slide--exit-down'
    const enterClass = slideDir === 'up' ? 'vf-slide--enter-up' : 'vf-slide--enter-down'

    return (
        <div className="video-feed">
            {/* HSK badge — top right */}
            <div className="vf-hsk-badge">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M8 7h8M8 11h5" />
                </svg>
                <span className="vf-hsk-badge__label">HSK 4</span>
            </div>

            {/* Lesson indicator dots — right side */}
            <div className="vf-dots">
                {lessonUnits.map((u, i) => (
                    <button
                        key={u.id}
                        className={[
                            'vf-dot',
                            i === currentIndex ? 'vf-dot--active' : '',
                            i < currentIndex ? 'vf-dot--done' : '',
                        ].join(' ')}
                        onClick={() => goToLesson(i, i > currentIndex ? 'up' : 'down')}
                        aria-label={u.title}
                    />
                ))}
            </div>

            {/* Current lesson title — subtle overlay at top */}
            <div className={`vf-lesson-title ${transitioning ? 'vf-lesson-title--hidden' : ''}`}>
                <span className="vf-lesson-title__emoji">{unit.emoji}</span>
                <span className="vf-lesson-title__text">{unit.title}</span>
            </div>

            {/* Current lesson */}
            <div className={`vf-lesson ${transitioning ? exitClass : enterClass}`}>
                <VideoLessonPage
                    key={unit.id}
                    feedUnit={unit}
                    onSwipeUp={handleSwipeUp}
                    onSwipeDown={handleSwipeDown}
                    onExitToFeed={handleExit}
                    onNextInFeed={handleSwipeUp}
                />
            </div>

            <TopicsSheet
                isOpen={showTopics}
                onClose={() => setShowTopics(false)}
                onSelect={(index: number) => {
                    if (index === currentIndex) return
                    goToLesson(index, index > currentIndex ? 'up' : 'down')
                }}
            />
        </div>
    )
}
