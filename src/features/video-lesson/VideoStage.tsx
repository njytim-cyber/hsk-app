import { useRef, useState, useEffect } from 'react'
import type { VideoLessonConfig } from './videoLessonData'
import './VideoStage.css'

interface VideoStageProps {
    data: VideoLessonConfig
    onComplete: () => void
}

export function VideoStage({ data, onComplete }: VideoStageProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const onTimeUpdate = () => setCurrentTime(video.currentTime)
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        const onEnded = () => { setIsPlaying(false); setHasEnded(true) }

        video.addEventListener('timeupdate', onTimeUpdate)
        video.addEventListener('play', onPlay)
        video.addEventListener('pause', onPause)
        video.addEventListener('ended', onEnded)

        // Autoplay muted (browser policy allows this)
        video.muted = true
        video.play().catch(() => { /* ok */ })

        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate)
            video.removeEventListener('play', onPlay)
            video.removeEventListener('pause', onPause)
            video.removeEventListener('ended', onEnded)
        }
    }, [])

    const handlePlayPause = () => {
        const video = videoRef.current
        if (!video || hasEnded) return
        // First tap: unmute
        if (isMuted) {
            video.muted = false
            setIsMuted(false)
            if (video.paused) video.play()
            return
        }
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }

    // Build the full sentence string from meaningful words
    const fullSentence = data.words
        .filter(w => w.hanzi.trim())
        .map(w => w.hanzi)
        .join('')

    return (
        <div className="video-stage" onClick={handlePlayPause}>
            <video
                ref={videoRef}
                src={data.videoSrc}
                className="video-stage__video"
                playsInline
                preload="auto"
            />

            <div className="video-stage__scrim" />

            {/* HSK badge */}
            <div className="video-stage__top-badge">
                <span className="video-stage__badge">HSK {data.hskLevel}</span>
            </div>

            {/* Play button */}
            {!isPlaying && !hasEnded && (
                <div className="video-stage__play-overlay">
                    <div className="video-stage__play-ring" />
                    <div className="video-stage__play-btn"><svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3" /></svg></div>
                </div>
            )}

            {/* Muted indicator — tap to unmute */}
            {isMuted && isPlaying && (
                <div className="video-stage__muted-indicator animate-fade-up">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    <span>Tap to unmute</span>
                </div>
            )}

            {/* Bottom: simple subtitle + vocab on end */}
            <div className="video-stage__bottom">
                {/* Simple static subtitle — large, centered */}
                {!hasEnded && currentTime > 0.5 && (
                    <p className="video-stage__subtitle">{fullSentence}</p>
                )}

                {/* After video ends */}
                {hasEnded && (
                    <div className="video-stage__end-section animate-fade-up">
                        <p className="video-stage__subtitle">{fullSentence}</p>
                        <span className="video-stage__subtitle-en">{data.titleEn}</span>
                        <div className="vocab-preview">
                            {data.words.filter(w => w.isTarget).map((w, i) => (
                                <div key={i} className="vocab-chip" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <span className="vocab-chip__hanzi">{w.hanzi}</span>
                                    <span className="vocab-chip__pinyin">{w.pinyin}</span>
                                    <span className="vocab-chip__en">{w.english}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="continue-btn"
                            style={{ animationDelay: '0.2s' }}
                            onClick={(e) => { e.stopPropagation(); onComplete() }}
                        >
                            <span>Let's Practice</span>
                            <span className="continue-btn__arrow">→</span>
                        </button>
                    </div>
                )}
            </div>

            {!isPlaying && !hasEnded && currentTime > 0 && (
                <div className="video-stage__paused-label">Paused</div>
            )}
        </div>
    )
}
