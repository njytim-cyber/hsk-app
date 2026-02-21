import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LearnPage } from './features/learn/LearnPage'
import { WritePage } from './features/write/WritePage'
import { QuizPage } from './features/quiz/QuizPage'
import { ReviewPage } from './features/review/ReviewPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { VideoLessonPage } from './features/video-lesson/VideoLessonPage'
import { VideoFeed } from './features/video-lesson/VideoFeed'

export default function App() {
  return (
    <Routes>
      {/* Landing: TikTok-style video feed */}
      <Route path="/" element={<VideoFeed />} />

      {/* Direct lesson access */}
      <Route path="/video-lesson/:unitId" element={<VideoLessonPage />} />

      {/* Standard app routes */}
      <Route path="*" element={
        <AppShell>
          <Routes>
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/me" element={<ProfilePage />} />
          </Routes>
        </AppShell>
      } />
    </Routes>
  )
}


