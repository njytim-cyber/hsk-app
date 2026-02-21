import { useLocation } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'

export function Header() {
    const { pathname } = useLocation()
    const { xp, streak } = useProgress()

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
            <h1 className="header-title">{title}</h1>
            <div className="header-stats">
                {streak > 0 && <span className="header-streak"><svg width="14" height="14" viewBox="0 0 24 24" fill="var(--hsk-coral)" stroke="var(--hsk-coral)" strokeWidth="2" style={{ marginRight: 2, verticalAlign: 'middle', marginTop: '-2px' }}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>{streak}</span>}
                <span className="header-xp"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ marginRight: 2, verticalAlign: 'middle', marginTop: '-2px' }}><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /></svg>{xp}</span>
            </div>
        </header>
    )
}
