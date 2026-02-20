import { useLocation } from 'react-router-dom'
import { useAvatar } from '../../hooks/useAvatar'
import { useProgress } from '../../contexts/ProgressContext'

export function Header() {
    const { pathname } = useLocation()
    const { avatarStyle } = useAvatar()
    const { xp, streak, coins } = useProgress()

    const titles: Record<string, string> = {
        '/learn': '学习',
        '/write': '写字',
        '/quiz': '听写',
        '/review': '复习',
        '/me': '我的',
    }

    const title = titles[pathname] ?? 'HSK'

    return (
        <header className="app-header">
            <div className="header-avatar" style={avatarStyle} />
            <h1 className="header-title">{title}</h1>
            <div className="header-stats">
                {streak > 0 && <span className="header-streak">🔥{streak}</span>}
                <span className="header-xp">⭐{xp}</span>
                <span className="header-coins">🪙{coins}</span>
            </div>
        </header>
    )
}
