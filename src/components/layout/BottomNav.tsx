import { NavLink } from 'react-router-dom'

const tabs = [
    { path: '/learn', icon: '📖', label: '学习' },
    { path: '/write', icon: '✍️', label: '写字' },
    { path: '/quiz', icon: '🎧', label: '听写' },
    { path: '/review', icon: '🔄', label: '复习' },
    { path: '/me', icon: '👤', label: '我的' },
]

export function BottomNav() {
    return (
        <nav className="bottom-nav">
            {tabs.map(tab => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                </NavLink>
            ))}
        </nav>
    )
}
