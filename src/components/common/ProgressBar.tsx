import './ProgressBar.css'

interface ProgressBarProps {
    value: number        // 0-100
    color?: string       // CSS color or HSK level color var
    label?: string
    showPercent?: boolean
}

export function ProgressBar({
    value,
    color = 'var(--hsk-jade)',
    label,
    showPercent = false
}: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value))

    return (
        <div className="progress-bar-container">
            {label && <span className="progress-label">{label}</span>}
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${clamped}%`, background: color }}
                    role="progressbar"
                    aria-valuenow={clamped}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            {showPercent && <span className="progress-percent">{Math.round(clamped)}%</span>}
        </div>
    )
}
