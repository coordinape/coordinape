import { DateTime, Interval } from 'luxon';

export interface ITiming {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IApiEpoch {
  id: number;
  number?: number;
  start_date: string; // 2021-07-09T00:00:00.000000Z
  end_date: string;
  circle_id: number;
  created_at: string;
  updated_at: string;
  ended: boolean;
  grant: string; // 0.00 - stored as decimal in database
  notified_before_end?: string;
  notified_start?: string;
  notified_end?: string;
  days?: number; // Used for repeating
  repeat?: number; // 1: weekly, 2: monthly
  repeat_day_of_month: number;
  description?: string;
}

export interface IEpoch extends IApiEpoch {
  repeatEnum: 'weekly' | 'monthly' | 'none';
  ended: boolean;
  startDate: DateTime;
  startDay: string;
  endDate: DateTime;
  endDay: string;
  interval: Interval;
  // Calculated:
  started: boolean;
  // timeUntilStart: ITiming;
  // timeUntilEnd: ITiming;
  calculatedDays: number;
  labelGraph: string;
  labelUntilStart: string;
  labelUntilEnd: string;
}
