export type CertificationLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "coding";
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  field: string;
  level: CertificationLevel;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  totalPoints: number;
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
    points: number;
  }[];
  timeTaken: number; // in minutes
  completedAt: Date;
}


