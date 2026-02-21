import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import './AppShell.css'

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const location = useLocation()
    const isImmersive = location.pathname === '/' || location.pathname.startsWith('/video-lesson/')

    return (
        <div className={`app-shell ${isImmersive ? 'app-shell--immersive' : ''}`}>
            {!isImmersive && <Header />}
            <main className="app-content">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
