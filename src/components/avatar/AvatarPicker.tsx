import { useState } from 'react'
import { indexToPosition } from '../../hooks/useAvatar'
import type { AvatarPosition } from '../../data/types'
import './AvatarPicker.css'

interface Props {
    current: AvatarPosition
    onSelect: (pos: AvatarPosition) => void
    onClose: () => void
}

const GRID = 8
const TOTAL = GRID * GRID

export default function AvatarPicker({ current, onSelect, onClose }: Props) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <div className="avatar-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
        }}>
            <div className="avatar-modal">
                <div className="avatar-modal-header">
                    <button className="avatar-close-btn" onClick={onClose}>❮</button>
                    <h2 className="avatar-modal-title">选择头像</h2>
                    <div style={{ width: 40 }} />
                </div>

                <div className="avatar-grid">
                    {Array.from({ length: TOTAL }, (_, i) => {
                        const pos = indexToPosition(i)
                        const isSelected = pos.posX === current.posX && pos.posY === current.posY
                        const isHovered = hoveredIndex === i

                        return (
                            <button
                                key={i}
                                className={`avatar-option ${isSelected ? 'selected' : ''}`}
                                style={{
                                    backgroundImage: `url('/avatars.webp')`,
                                    backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                                    backgroundPosition: `${pos.posX}% ${pos.posY}%`,
                                    transform: isHovered ? 'scale(1.15)' : undefined,
                                }}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    onSelect(pos)
                                    onClose()
                                }}
                                aria-label={`Avatar ${i + 1}`}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
