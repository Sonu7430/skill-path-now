import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssessmentAnswer {
  questionId: string;
  answer: string;
  skillArea: string;
}

interface AssessmentState {
  answers: AssessmentAnswer[];
  selectedCareer: string | null;
  completedAt: Date | null;
  addAnswer: (answer: AssessmentAnswer) => void;
  setSelectedCareer: (careerId: string) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
  getSkillScores: () => Record<string, number>;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      answers: [],
      selectedCareer: null,
      completedAt: null,

      addAnswer: (answer) =>
        set((state) => {
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === answer.questionId
          );
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = answer;
            return { answers: newAnswers };
          }
          return { answers: [...state.answers, answer] };
        }),

      setSelectedCareer: (careerId) => set({ selectedCareer: careerId }),

      completeAssessment: () => set({ completedAt: new Date() }),

      resetAssessment: () =>
        set({ answers: [], selectedCareer: null, completedAt: null }),

      getSkillScores: () => {
        const state = get();
        const skillScores: Record<string, number> = {};
        
        state.answers.forEach((answer) => {
          if (!skillScores[answer.skillArea]) {
            skillScores[answer.skillArea] = 0;
          }
          
          // Simple scoring: correct answer = 1 point
          if (answer.answer) {
            skillScores[answer.skillArea] += 1;
          }
        });

        return skillScores;
      },
    }),
    {
      name: 'assessment-storage',
    }
  )
);
