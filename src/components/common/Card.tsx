import { type ReactNode } from 'react'
import './Card.css'

interface CardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    hoverable?: boolean
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
    const classes = `card ${hoverable ? 'card-hoverable' : ''} ${className}`

    return onClick ? (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    ) : (
        <div className={classes}>
            {children}
        </div>
    )
}
