import './StrokeProgress.css'

interface StrokeProgressProps {
    total: number
    completed: number
    current: number
}

export function StrokeProgress({ total, completed, current }: StrokeProgressProps) {
    return (
        <div className="stroke-progress" role="group" aria-label="Stroke progress">
            {Array.from({ length: total }, (_, i) => {
                let state = 'remaining'
                if (i < completed) state = 'done'
                else if (i === current) state = 'active'

                return (
                    <span
                        key={i}
                        className={`stroke-dot stroke-${state}`}
                        aria-label={`Stroke ${i + 1}: ${state}`}
                    />
                )
            })}
        </div>
    )
}
