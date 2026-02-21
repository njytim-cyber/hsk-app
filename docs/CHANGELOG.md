# Changelog

## [2026-02-21] - Tang Dynasty Aesthetic Polish & Production Build

### Added
- **Practice Stage Context Headers:** Added elegant, 100% width `.stage-header` titles (e.g., "Listening & Speaking", "Character Writing") to all 5 interactive modules (`PhoneticStage`, `WritingStage`, `ScrambleStage`, `FlashcardSession`, `QuizPage`) to orient learners.
- **Calligraphy Empty States:** Injected the classic proverb "学海无涯" (Learning is a boundless sea) and a default "学" placeholder on the Profile page when no avatar is set, curing the "Empty State Neglect."

### Changed
- **Sancai Strictness Enforcement:** Purged default pastel greens and generic yellows. The app now strictly adheres to the Deep Jade, True Gold, Cinnabar Red, and Ink Black Tang palette.
- **Editorial Typography:** Overhauled default body text out of basic sans-serif into a premium humanist stack (`Optima`, `Avenir Next`) complementing the `KaiTi` Chinese characters.
- **Frosted Glass Navigation:** Rebuilt the `BottomNav` with a `16px` backdrop-filter blur, increased height for breathing room (`72px`), and an engraved top border.
- **Liquid Progress Bars:** Replaced basic DOM `<progress>`-like flat bars with deep-set "engraved tracks", a dynamic Jade-to-Gold `linear-gradient` fill, and a sweeping 2.5s glass shine animation.
- **Premium SVGs:** Eradicated all system emojis across the app. Replaced generic 5-point stars with bespoke "Gold Sparkle" vectors and swapped harsh red "X" close buttons for elegant, thin-stroke left directional arrows.
- **Ma (Breathing Room):** Substantially increased internal block padding on the central HSK level cards and rounded the indicator badges into perfect circles.

### Fixed
- **Strict Pre-Commit Linting:** Resolved 12 critical ESLint/TypeScript errors to stabilize the production build, including:
  - React Rules of Hooks violations (`useRef` updates during the render phase in `CharacterCanvas`).
  - Cascading render warnings via improper `setState` inside `useEffect` in `LessonPicker`, `WritingStage`, and `useHanziWriter`.
  - Vite Fast Refresh export warnings within `AudioContext` and `ProgressContext`.
