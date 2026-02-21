import { useAudio } from '../../contexts/AudioContext'
import './PlayButton.css'

interface PlayButtonProps {
    text: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function PlayButton({ text, size = 'md', className = '' }: PlayButtonProps) {
    const { speak, isSpeaking } = useAudio()

    return (
        <button
            className={`play-btn play-btn-${size} ${isSpeaking ? 'speaking' : ''} ${className}`}
            onClick={() => speak(text)}
            disabled={isSpeaking}
            aria-label={`Play pronunciation for ${text}`}
        >
            {isSpeaking ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>}
        </button>
    )
}
