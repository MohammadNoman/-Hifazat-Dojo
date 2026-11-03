import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { GameProvider, useGame } from './store/GameContext';
import Navbar from './components/Navbar';
import HeroPage from './pages/HeroPage';
import LanguagePage from './pages/LanguagePage';
import LevelSelectPage from './pages/LevelSelectPage';
import QuizPage from './pages/QuizPage';
import CertificatePage from './pages/CertificatePage';
import AboutPage from './pages/AboutPage';
import TeacherPage from './pages/TeacherPage';

function Footer() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  return (
    <footer className="no-print border-t border-navy-800/80 bg-navy-950/80 py-8 px-4 text-center text-xs text-navy-400 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>🛡️</span>
          <span className="font-semibold text-navy-200">Hifazat Dojo</span>
          <span>•</span>
          <span>STREAM School Project</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-shield-400 transition-colors">
            {isUrdu ? 'حفاظتی گائیڈ' : 'Safety Guide'}
          </Link>
          <Link to="/teacher" className="hover:text-shield-400 transition-colors">
            {isUrdu ? 'اساتذہ' : 'Teachers'}
          </Link>
          <Link to="/language" className="hover:text-shield-400 transition-colors">
            {isUrdu ? 'زبان تبدیل کریں' : 'Language'}
          </Link>
        </div>

        <p className="text-navy-500">
          Static Client-Side App • 100% Offline & Private
        </p>
      </div>
    </footer>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-white selection:bg-shield-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/levels" element={<LevelSelectPage />} />
          <Route path="/quiz/:levelId" element={<QuizPage />} />
          <Route path="/certificate/:levelId" element={<CertificatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </GameProvider>
  );
}
