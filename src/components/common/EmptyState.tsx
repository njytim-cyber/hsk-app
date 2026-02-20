import './EmptyState.css'

interface EmptyStateProps {
    icon: string
    title: string
    subtitle?: string
    action?: {
        label: string
        onClick: () => void
    }
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
    return (
        <div className="empty-state">
            <span className="empty-icon">{icon}</span>
            <h2 className="empty-title">{title}</h2>
            {subtitle && <p className="empty-subtitle">{subtitle}</p>}
            {action && (
                <button className="btn btn-primary" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
        </div>
    )
}
