import { useState, useCallback } from 'react'
import type { AvatarPosition } from '../data/types'

const STORAGE_KEY = 'hsk_avatar'

/** 8x8 sprite sheet — 64 avatars total */
const GRID_SIZE = 8

function getRandomAvatar(): AvatarPosition {
    const index = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE)
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE
    return {
        posX: (col * 100) / (GRID_SIZE - 1),
        posY: (row * 100) / (GRID_SIZE - 1),
    }
}

function loadAvatar(): AvatarPosition {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as AvatarPosition
    } catch { /* ignore */ }
    // First time? Assign random
    const avatar = getRandomAvatar()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar))
    return avatar
}

export function useAvatar() {
    const [avatar, setAvatarState] = useState<AvatarPosition>(loadAvatar)

    const setAvatar = useCallback((pos: AvatarPosition) => {
        setAvatarState(pos)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    }, [])

    const avatarStyle = {
        backgroundImage: `url('/avatars.webp')`,
        backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
        backgroundPosition: `${avatar.posX}% ${avatar.posY}%`,
    }

    return { avatar, setAvatar, avatarStyle, GRID_SIZE }
}

/** Convert sprite index (0-63) to position */
export function indexToPosition(index: number): AvatarPosition {
    const row = Math.floor(index / GRID_SIZE)
    const col = index % GRID_SIZE
    return {
        posX: (col * 100) / (GRID_SIZE - 1),
        posY: (row * 100) / (GRID_SIZE - 1),
    }
}
