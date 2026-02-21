import { useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { lessonUnits, type LessonUnit } from './lessonUnits'
import { IntroStage } from './IntroStage'
import { VideoStage } from './VideoStage'
import { PhoneticStage } from './PhoneticStage'
import { WritingStage } from './WritingStage'
import { ScrambleStage } from './ScrambleStage'
import { useProgress } from '../../contexts/ProgressContext'
import './VideoLessonPage.css'

type Stage = 'intro' | 'video' | 'phonetic' | 'writing' | 'scramble'

/* ── Clean SVG icons for each stage ── */
const StageIcon = ({ stage, active }: { stage: Stage; active: boolean }) => {
    const color = active ? 'var(--tang-red)' : 'var(--hsk-ink-faint)'
    const props = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

    switch (stage) {
        case 'intro':
            return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
        case 'video':
            return <svg {...props}><polygon points="5 3 19 12 5 21 5 3" fill={active ? color : 'none'} /></svg>
        case 'phonetic':
            return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={active ? color : 'none'} /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
        case 'writing':
            return <svg {...props}><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
        case 'scramble':
            return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    }
}

interface Scores {
    pronunciation: number
    writing: number
    scrambleAttempts: number
}

interface VideoLessonPageProps {
    feedUnit?: LessonUnit
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    onExitToFeed?: () => void
    onNextInFeed?: () => void
}

export function VideoLessonPage({ feedUnit, onSwipeUp, onSwipeDown, onExitToFeed, onNextInFeed }: VideoLessonPageProps = {}) {
    const navigate = useNavigate()
    const { unitId } = useParams<{ unitId: string }>()
    const { addXp } = useProgress()

    const unit = useMemo(
        () => feedUnit || lessonUnits.find(u => u.id === unitId),
        [feedUnit, unitId]
    )

    const unitIndex = useMemo(
        () => feedUnit
            ? lessonUnits.indexOf(feedUnit)
            : lessonUnits.findIndex(u => u.id === unitId),
        [feedUnit, unitId]
    )

    const hasVideo = Boolean(unit?.lesson.videoSrc)
    const STAGES: Stage[] = useMemo(
        () => hasVideo
            ? ['intro', 'video', 'phonetic', 'writing', 'scramble']
            : ['intro', 'phonetic', 'writing', 'scramble'],
        [hasVideo]
    )

    const [stage, setStage] = useState<Stage>(hasVideo ? 'video' : 'intro')
    const [scores, setScores] = useState<Scores>({ pronunciation: 0, writing: 0, scrambleAttempts: 0 })
    const [transitioning, setTransitioning] = useState(false)
    const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
    const contentRef = useRef<HTMLDivElement>(null)
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

    const currentIndex = STAGES.indexOf(stage)

    const goToStage = useCallback((next: Stage, direction: 'left' | 'right' = 'left') => {
        setSlideDir(direction)
        setTransitioning(true)
        setTimeout(() => {
            setStage(next)
            setTransitioning(false)
            contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
        }, 150)
    }, [])

    const goToIndex = useCallback((index: number, direction: 'left' | 'right') => {
        if (index < 0 || index >= STAGES.length) return
        goToStage(STAGES[index], direction)
    }, [goToStage, STAGES])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0]
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return
        if (stage === 'writing') { touchStartRef.current = null; return }
        const touch = e.changedTouches[0]
        const dx = touch.clientX - touchStartRef.current.x
        const dy = touch.clientY - touchStartRef.current.y
        const dt = Date.now() - touchStartRef.current.time
        touchStartRef.current = null

        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 500) {
            if (dx < 0) goToIndex(currentIndex + 1, 'left')
            else goToIndex(currentIndex - 1, 'right')
        }
        // Vertical swipe → switch lessons in feed mode
        if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.5 && dt < 500) {
            if (dy < 0 && onSwipeUp) onSwipeUp()
            else if (dy > 0 && onSwipeDown) onSwipeDown()
        }
    }, [currentIndex, goToIndex, stage, onSwipeUp, onSwipeDown])

    // If unit not found, redirect
    if (!unit) {
        navigate('/', { replace: true })
        return null
    }

    const data = unit.lesson

    const handleIntroStart = () => {
        if (hasVideo) goToStage('video', 'left')
        else goToStage('phonetic', 'left')
    }
    const handleVideoComplete = () => goToStage('phonetic', 'left')
    const handlePhoneticComplete = (score: number) => {
        setScores(prev => ({ ...prev, pronunciation: score }))
        goToStage('writing', 'left')
    }
    const handleWritingComplete = (accuracy: number) => {
        setScores(prev => ({ ...prev, writing: accuracy }))
        goToStage('scramble', 'left')
    }
    const handleScrambleComplete = (attempts: number) => {
        // Calculate final score
        const scrambleBlocks = data.scrambleAnswer.filter(b => !/^[，。！？、；：]$/.test(b)).length
        const scrambleEfficiency = Math.round(
            (scrambleBlocks / Math.max(attempts, scrambleBlocks)) * 100
        )
        const overallScore = Math.round(
            (scores.pronunciation + scores.writing + scrambleEfficiency) / 3
        )
        const xpEarned = Math.round(overallScore * 1.5)
        const stars = overallScore >= 90 ? 3 : overallScore >= 60 ? 2 : 1

        // Save progress to local storage (HSK4 map)
        try {
            const key = 'hsk4-progress'
            const existing = JSON.parse(localStorage.getItem(key) || '{}')
            existing[data.id] = { score: overallScore, stars, completedAt: Date.now() }
            localStorage.setItem(key, JSON.stringify(existing))
        } catch { /* ok */ }

        // Add to global XP state
        addXp(xpEarned)

        // Haptic burst for completing the loop seamlessly
        if (navigator.vibrate) navigator.vibrate([30, 50, 30])

        // Setup scores for next round
        setScores({ pronunciation: 0, writing: 0, scrambleAttempts: 0 })

        // Auto-advance
        if (onNextInFeed) {
            onNextInFeed()
            return
        }
        const nextIndex = unitIndex + 1
        if (nextIndex < lessonUnits.length) {
            navigate(`/video-lesson/${lessonUnits[nextIndex].id}`)
        } else {
            navigate('/lessons')
        }
    }
    const handleExit = () => {
        if (onExitToFeed) { onExitToFeed(); return }
        navigate('/lessons')
    }

    const enterClass = slideDir === 'left' ? 'vl-content--enter-left' : 'vl-content--enter-right'
    const exitClass = slideDir === 'left' ? 'vl-content--exit-left' : 'vl-content--exit-right'

    // Hide bottom bar during intro and video
    const showBottomBar = stage !== 'intro' && stage !== 'video'

    return (
        <div
            className="video-lesson-page"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={contentRef}
                className={`vl-content ${transitioning ? exitClass : enterClass}`}
            >
                {stage === 'intro' && <IntroStage data={data} onStart={handleIntroStart} />}
                {stage === 'video' && <VideoStage data={data} onComplete={handleVideoComplete} />}
                {stage === 'phonetic' && <PhoneticStage data={data} onComplete={handlePhoneticComplete} />}
                {stage === 'writing' && <WritingStage data={data} onComplete={handleWritingComplete} />}
                {stage === 'scramble' && <ScrambleStage data={data} onComplete={handleScrambleComplete} />}
            </div>

            {showBottomBar && (
                <div className="vl-bottom-bar">
                    <button className="vl-bottom-bar__close" onClick={handleExit} aria-label="Exit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="vl-bottom-bar__tabs">
                        {STAGES.filter(s => s !== 'intro').map((s) => {
                            const stageIndex = STAGES.indexOf(s)
                            return (
                                <button
                                    key={s}
                                    className={`vl-btab ${stageIndex === currentIndex ? 'vl-btab--active' : ''} ${stageIndex < currentIndex ? 'vl-btab--done' : ''}`}
                                    onClick={() => goToIndex(stageIndex, stageIndex > currentIndex ? 'left' : 'right')}
                                >
                                    <StageIcon stage={s} active={stageIndex === currentIndex} />
                                </button>
                            )
                        })}
                    </div>
                    <div className="vl-bottom-bar__progress">
                        {STAGES.filter(s => s !== 'intro').map((s) => {
                            const stageIndex = STAGES.indexOf(s)
                            return (
                                <div
                                    key={s}
                                    className={[
                                        'vl-seg',
                                        stageIndex < currentIndex ? 'vl-seg--done' : '',
                                        stageIndex === currentIndex ? 'vl-seg--active' : '',
                                    ].join(' ')}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
