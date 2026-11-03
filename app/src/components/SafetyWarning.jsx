import { SAFETY_WARNING, SAFETY_WARNING_UR } from '../data/questions';
import { useGame } from '../store/GameContext';

export default function SafetyWarning() {
  const { language } = useGame();
  const isUrdu = language === 'ur';

  return (
    <div className={`warning-banner ${isUrdu ? 'rtl' : ''}`}>
      <span className="text-danger-400 text-xl flex-shrink-0">⚠️</span>
      <p className="text-sm md:text-base leading-relaxed">
        {isUrdu ? SAFETY_WARNING_UR : SAFETY_WARNING}
      </p>
    </div>
  );
}
