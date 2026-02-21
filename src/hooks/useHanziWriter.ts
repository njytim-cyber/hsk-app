import { useRef, useEffect, useCallback, useState } from 'react'
import HanziWriter from 'hanzi-writer'

export interface HanziWriterCallbacks {
    onCorrectStroke?: (data: { strokeNum: number; totalStrokes: number }) => void
    onMistake?: (data: { strokeNum: number; totalStrokes: number }) => void
    onComplete?: () => void
}

interface UseHanziWriterOptions {
    character: string
    showOutline?: boolean
    showCharacter?: boolean
    strokeColor?: string
    outlineColor?: string
    highlightColor?: string
    leniency?: number
}

interface UseHanziWriterReturn {
    containerRef: React.RefObject<HTMLDivElement | null>
    quiz: (callbacks?: HanziWriterCallbacks) => void
    reveal: () => void
    highlightStroke: (strokeNum: number) => void
    animateCharacter: () => Promise<void>
    showOutline: () => void
    hideOutline: () => void
    isLoading: boolean
    totalStrokes: number
}

export function useHanziWriter(options: UseHanziWriterOptions): UseHanziWriterReturn {
    const containerRef = useRef<HTMLDivElement>(null)
    const writerRef = useRef<HanziWriter | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [totalStrokes, setTotalStrokes] = useState(0)

    const {
        character,
        showOutline = true,
        showCharacter = false,
        strokeColor = '#264653',
        outlineColor = 'rgba(38, 70, 83, 0.15)',
        highlightColor = '#2a9d8f',
        leniency = 1.5,
    } = options

    // Create/recreate writer when character changes
    useEffect(() => {
        const el = containerRef.current
        if (!el || !character) return

        // Clean up previous writer
        el.innerHTML = ''
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true)

        const size = el.clientWidth || 280

        const writer = HanziWriter.create(el, character, {
            width: size,
            height: size,
            padding: 8,
            showOutline,
            showCharacter,
            strokeColor,
            outlineColor,
            highlightColor,
            strokeAnimationSpeed: 1.5,
            delayBetweenStrokes: 100,
            leniency,
            onLoadCharDataSuccess: (data: { strokes: string[] }) => {
                setIsLoading(false)
                setTotalStrokes(data.strokes.length)
            },
        })

        writerRef.current = writer

        return () => {
            // HanziWriter doesn't have a destroy method, just clear DOM
            el.innerHTML = ''
            writerRef.current = null
        }
    }, [character, showOutline, showCharacter, strokeColor, outlineColor, highlightColor, leniency])

    const quiz = useCallback((callbacks?: HanziWriterCallbacks) => {
        writerRef.current?.quiz({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onMistake: (data) => callbacks?.onMistake?.({ strokeNum: (data as any).strokeNum ?? 0, totalStrokes: (data as any).mistakesOnStroke ?? 0 }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCorrectStroke: (data) => callbacks?.onCorrectStroke?.({ strokeNum: (data as any).strokeNum ?? 0, totalStrokes: (data as any).totalMistakes ?? 0 }),
            onComplete: () => callbacks?.onComplete?.(),
        })
    }, [])

    const reveal = useCallback(() => {
        writerRef.current?.showCharacter()
        writerRef.current?.showOutline()
    }, [])

    const highlightStroke = useCallback((strokeNum: number) => {
        writerRef.current?.highlightStroke(strokeNum)
    }, [])

    const animateCharacter = useCallback(() => {
        return new Promise<void>((resolve) => {
            if (!writerRef.current) { resolve(); return }
            writerRef.current.animateCharacter({
                onComplete: () => resolve(),
            })
        })
    }, [])

    const showOutlineFn = useCallback(() => {
        writerRef.current?.showOutline()
    }, [])

    const hideOutlineFn = useCallback(() => {
        writerRef.current?.hideOutline()
    }, [])

    return {
        containerRef,
        quiz,
        reveal,
        highlightStroke,
        animateCharacter,
        showOutline: showOutlineFn,
        hideOutline: hideOutlineFn,
        isLoading,
        totalStrokes,
    }
}
