import { NavLink } from 'react-router-dom'

const navItems = [
    { path: '/', icon: '', label: '主页' },
    { path: '/learn', icon: '', label: '学习' },
    { path: '/write', icon: '', label: '写字' },
    { path: '/profile', icon: '', label: '我的' }
]

export function BottomNav() {
    return (
        <nav className="bottom-nav">
            {navItems.map(tab => (
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
