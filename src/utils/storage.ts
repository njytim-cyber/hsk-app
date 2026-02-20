/** Typed localStorage wrapper with JSON serialization */

const PREFIX = 'hsk_'

export function load<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(PREFIX + key)
        return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
        return fallback
    }
}

export function save<T>(key: string, value: T): void {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
        // Storage full or unavailable — fail silently
    }
}

export function remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
}
