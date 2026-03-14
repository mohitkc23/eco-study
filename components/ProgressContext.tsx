'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ProgressData = {
  attempted: Record<string, boolean>;   // questionId → attempted
  correct: Record<string, boolean>;     // questionId → got it right
};

type ProgressCtx = {
  data: ProgressData;
  markAttempted: (questionId: string) => void;
  markCorrect: (questionId: string, correct: boolean) => void;
  getTopicProgress: (questionIds: string[]) => { attempted: number; correct: number; total: number };
  reset: () => void;
};

const EMPTY: ProgressData = { attempted: {}, correct: {} };

const ProgressContext = createContext<ProgressCtx>({
  data: EMPTY,
  markAttempted: () => {},
  markCorrect: () => {},
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
      if (saved) {
        // Strip out flashcards data if they had it stored
        const parsed = JSON.parse(saved);
        setData({
          attempted: parsed.attempted || {},
          correct: parsed.correct || {},
        });
      }
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
    <ProgressContext.Provider value={{ data, markAttempted, markCorrect, getTopicProgress, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}
