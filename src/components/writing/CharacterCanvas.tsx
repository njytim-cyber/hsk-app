import { useEffect, useRef } from 'react'
import { useHanziWriter, type HanziWriterCallbacks } from '../../hooks/useHanziWriter'
import './CharacterCanvas.css'

export type GridStyle = 'tianzige' | 'mizige' | 'blank'

interface CharacterCanvasProps {
    character: string
    gridStyle?: GridStyle
    showOutline?: boolean
    showCharacter?: boolean
    onQuizReady?: (controls: {
        quiz: (cb?: HanziWriterCallbacks) => void
        reveal: () => void
        highlightStroke: (n: number) => void
        animateCharacter: () => Promise<void>
    }) => void
    className?: string
}

export function CharacterCanvas({
    character,
    gridStyle = 'tianzige',
    showOutline = true,
    showCharacter = false,
    onQuizReady,
    className = '',
}: CharacterCanvasProps) {
    const { containerRef, quiz, reveal, highlightStroke, animateCharacter, isLoading } = useHanziWriter({
        character,
        showOutline,
        showCharacter,
    })

    const onQuizReadyRef = useRef(onQuizReady)

    useEffect(() => {
        onQuizReadyRef.current = onQuizReady
    }, [onQuizReady])

    useEffect(() => {
        if (!isLoading) {
            onQuizReadyRef.current?.({ quiz, reveal, highlightStroke, animateCharacter })
        }
    }, [isLoading, quiz, reveal, highlightStroke, animateCharacter])

    return (
        <div className={`character-canvas grid-${gridStyle} ${className}`}>
            <div ref={containerRef} className="writer-container" />
            {isLoading && <div className="writer-loading"><span className="animate-pulse">⏳</span></div>}
        </div>
    )
}
