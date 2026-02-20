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
            {isSpeaking ? '⏸️' : '🔊'}
        </button>
    )
}
