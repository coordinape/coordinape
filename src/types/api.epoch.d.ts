import { Moment } from 'moment';

export interface ITiming {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IEpochTiming {
  hasBegun: boolean;
  timeUntilStart: ITiming;
  hasEnded: boolean;
  timeUntilEnd: ITiming;
}

export interface IEpochTimings {
  previousEpochTiming?: IEpochTiming;
  currentEpochTiming?: IEpochTiming;
  nextEpochTiming?: IEpochTiming;
}

export interface IApiEpoch {
  id: number;
  number?: number;
  start_date: string;
  end_date: string;
  circle_id: number;
  created_at: string;
  updated_at: string;
  ended: number; // boolean
  grant: string; // 0.00 - stored as decimal in database
  regift_days: number;
  notified_before_end?: string;
  notified_start?: string;
  notified_end?: string;
  days?: number; // Used for repeating
  repeat?: number; // 1: weekly, 2: monthly
  repeat_day_of_month: number;
  start_time: number; // 00:00:00 UTC
}

export interface IEpoch extends IApiEpoch {
  repeat?: 'weekly' | 'monthly';
  ended: boolean;
  startDate: Moment;
  endDate: Moment;
  // Calculated:
  started: boolean;
  totalTokens: number;
  uniqueUsers: number;
  activeUsers: number;
  // timeUntilStart: ITiming;
  // timeUntilEnd: ITiming;
  calculatedDays: number;
  labelGraph: string;
  labelDayRange: string;
  labelTimeStart: string;
  labelTimeEnd: string;
  labelActivity: string;
  labelUntilStart: string;
  labelUntilEnd: string;
}
