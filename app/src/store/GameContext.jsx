import { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext(null);
const GameDispatchContext = createContext(null);

const STORAGE_KEY = 'hifazat_dojo_state';
const TEACHER_DATA_KEY = 'hifazat_dojo_teacher_data';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }
  return null;
}

function saveState(state) {
  try {
    const toSave = {
      language: state.language,
      unlockedLevels: state.unlockedLevels,
      completedLevels: state.completedLevels,
      levelScores: state.levelScores,
      learnerName: state.learnerName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

export function saveTeacherRecord(record) {
  try {
    const existing = loadTeacherData();
    existing.push(record);
    localStorage.setItem(TEACHER_DATA_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save teacher data', e);
  }
}

export function loadTeacherData() {
  try {
    const saved = localStorage.getItem(TEACHER_DATA_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load teacher data', e);
  }
  return [];
}

export function clearTeacherData() {
  try {
    localStorage.removeItem(TEACHER_DATA_KEY);
  } catch (e) {
    console.error('Failed to clear teacher data', e);
  }
}

const defaultState = {
  language: 'ur', // Default to Urdu for authentic school context, can be toggled
  unlockedLevels: [1],
  completedLevels: [],
  levelScores: {},
  learnerName: '',
  // Active quiz session state
  currentLevel: null,
  currentQuestionIndex: 0,
  score: 0,
  correctAnswers: 0,
  streak: 0,
  maxStreak: 0,
  answers: [],
  showResult: false,
  selectedAnswer: null,
  isAnswered: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'TOGGLE_LANGUAGE': {
      const nextLang = state.language === 'ur' ? 'en' : 'ur';
      return { ...state, language: nextLang };
    }

    case 'SET_LEARNER_NAME':
      return { ...state, learnerName: action.payload };

    case 'START_LEVEL':
      return {
        ...state,
        currentLevel: action.payload,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        streak: 0,
        maxStreak: 0,
        answers: [],
        showResult: false,
        selectedAnswer: null,
        isAnswered: false,
      };

    case 'ANSWER_QUESTION': {
      const { answer, isCorrect, points } = action.payload;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      return {
        ...state,
        selectedAnswer: answer,
        isAnswered: true,
        score: Math.min(100, state.score + points),
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentQuestionIndex,
            answer,
            isCorrect,
            points,
          },
        ],
      };
    }

    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex >= 9) {
        // Level complete: 7 out of 10 (70%) required to unlock the next level
        const passed = state.correctAnswers >= 7;
        const newUnlocked = passed && state.currentLevel < 4
          ? [...new Set([...state.unlockedLevels, state.currentLevel + 1])]
          : state.unlockedLevels;
        const newCompleted = passed
          ? [...new Set([...state.completedLevels, state.currentLevel])]
          : state.completedLevels;

        const previousScoreData = state.levelScores[state.currentLevel];
        const updatedPassed = previousScoreData?.passed || passed;
        const updatedBestScore = Math.max(previousScoreData?.score || 0, state.score);
        const updatedBestCorrect = Math.max(previousScoreData?.correct || 0, state.correctAnswers);

        return {
          ...state,
          showResult: true,
          unlockedLevels: newUnlocked,
          completedLevels: newCompleted,
          levelScores: {
            ...state.levelScores,
            [state.currentLevel]: {
              score: updatedBestScore,
              lastScore: state.score,
              correct: updatedBestCorrect,
              lastCorrect: state.correctAnswers,
              passed: updatedPassed,
              maxStreak: Math.max(state.maxStreak, state.streak),
              date: new Date().toISOString(),
            },
          },
        };
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
        isAnswered: false,
      };
    }

    case 'RESET_LEVEL':
      return {
        ...state,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        streak: 0,
        maxStreak: 0,
        answers: [],
        showResult: false,
        selectedAnswer: null,
        isAnswered: false,
      };

    case 'RESET_ALL':
      return { ...defaultState, language: state.language };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const saved = loadState();
  const initialState = saved ? { ...defaultState, ...saved } : defaultState;

  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Sync state changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state.language, state.unlockedLevels, state.completedLevels, state.levelScores, state.learnerName]);

  // Synchronize document dir and lang for global RTL/LTR consistency
  useEffect(() => {
    const isUrdu = state.language === 'ur';
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    document.documentElement.lang = isUrdu ? 'ur' : (state.language || 'en');
  }, [state.language]);

  return (
    <GameContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (!context) throw new Error('useGameDispatch must be used within GameProvider');
  return context;
}
