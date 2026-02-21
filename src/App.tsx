import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { VideoLessonPage } from './features/video-lesson/VideoLessonPage'
import { VideoFeed } from './features/video-lesson/VideoFeed'

// Lazy load standard app routes
const LearnPage = lazy(() => import('./features/learn/LearnPage').then(m => ({ default: m.LearnPage })))
const WritePage = lazy(() => import('./features/write/WritePage').then(m => ({ default: m.WritePage })))
const QuizPage = lazy(() => import('./features/quiz/QuizPage').then(m => ({ default: m.QuizPage })))
const ReviewPage = lazy(() => import('./features/review/ReviewPage').then(m => ({ default: m.ReviewPage })))
const ProfilePage = lazy(() => import('./features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })))

// Simple loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--hsk-ink-faint)' }}>
    加载中...
  </div>
)

export default function App() {
  return (
    <AppShell>
      <Routes>
        {/* Landing: TikTok-style video feed */}
        <Route path="/" element={<VideoFeed />} />

        {/* Direct lesson access */}
        <Route path="/video-lesson/:unitId" element={<VideoLessonPage />} />

        {/* Standard app routes */}
        <Route path="/learn" element={<Suspense fallback={<PageLoader />}><LearnPage /></Suspense>} />
        <Route path="/write" element={<Suspense fallback={<PageLoader />}><WritePage /></Suspense>} />
        <Route path="/quiz" element={<Suspense fallback={<PageLoader />}><QuizPage /></Suspense>} />
        <Route path="/review" element={<Suspense fallback={<PageLoader />}><ReviewPage /></Suspense>} />
        <Route path="/me" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
      </Routes>
    </AppShell>
  )
}


