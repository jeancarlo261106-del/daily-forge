import type { DietGoal, ActivityLevel } from "@/lib/protein";

export interface OnboardingData {
  weight: number;
  height: number;
  age: number;
  sex: string | null;
  activityLevel: ActivityLevel;
  dietGoal: DietGoal;
}

export interface DailyProgress {
  consumed: number;
  target: number;
  percentage: number;
  entries: ProteinEntryData[];
}

export interface ProteinEntryData {
  id: string;
  amount: number;
  note: string | null;
  loggedAt: Date;
}

export interface WeeklyDataPoint {
  date: string;
  dayLabel: string;
  consumed: number;
  target: number;
}

export interface CalendarDay {
  date: string;
  consumed: number;
  target: number;
  percentage: number;
}
