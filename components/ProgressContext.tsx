'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ProgressData = {
  attempted: Record<string, boolean>;   // questionId → attempted
  correct: Record<string, boolean>;     // questionId → got it right
  flashcardMastered: Record<string, boolean>; // questionId → mastered
};

type ProgressCtx = {
  data: ProgressData;
  markAttempted: (questionId: string) => void;
  markCorrect: (questionId: string, correct: boolean) => void;
  markFlashcardMastered: (questionId: string, mastered: boolean) => void;
  getTopicProgress: (questionIds: string[]) => { attempted: number; correct: number; total: number };
  reset: () => void;
};

const EMPTY: ProgressData = { attempted: {}, correct: {}, flashcardMastered: {} };

const ProgressContext = createContext<ProgressCtx>({
  data: EMPTY,
  markAttempted: () => {},
  markCorrect: () => {},
  markFlashcardMastered: () => {},
  getTopicProgress: () => ({ attempted: 0, correct: 0, total: 0 }),
  reset: () => {},
});

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressData>(EMPTY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eco_progress');
      if (saved) setData(JSON.parse(saved));
    } catch {}
  }, []);

  function save(next: ProgressData) {
    setData(next);
    localStorage.setItem('eco_progress', JSON.stringify(next));
  }

  const markAttempted = useCallback((questionId: string) => {
    setData((prev) => {
      const next = { ...prev, attempted: { ...prev.attempted, [questionId]: true } };
      localStorage.setItem('eco_progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const markCorrect = useCallback((questionId: string, correct: boolean) => {
    setData((prev) => {
      const next = {
        ...prev,
        attempted: { ...prev.attempted, [questionId]: true },
        correct: { ...prev.correct, [questionId]: correct },
      };
      localStorage.setItem('eco_progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const markFlashcardMastered = useCallback((questionId: string, mastered: boolean) => {
    setData((prev) => {
      const next = { ...prev, flashcardMastered: { ...prev.flashcardMastered, [questionId]: mastered } };
      localStorage.setItem('eco_progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const getTopicProgress = useCallback(
    (questionIds: string[]) => ({
      total: questionIds.length,
      attempted: questionIds.filter((id) => data.attempted[id]).length,
      correct: questionIds.filter((id) => data.correct[id]).length,
    }),
    [data]
  );

  function reset() {
    save(EMPTY);
  }

  return (
    <ProgressContext.Provider value={{ data, markAttempted, markCorrect, markFlashcardMastered, getTopicProgress, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}
