export interface WeekendScorecard {
  outcomeQuality: number; // 1-5
  timeSaved: number; // 1-5
  repeatability: number; // 1-5
}

export interface Weekend {
  id: number;
  title: string;
  goal: string;
  deliverable: string;
  doneWhen: string;
  completed: boolean;
  notes: string;
  scorecard: WeekendScorecard;
}

export interface TrackerState {
  weekends: Weekend[];
  lastUpdated: string;
}
