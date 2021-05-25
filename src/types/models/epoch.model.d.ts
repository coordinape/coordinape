export interface IEpoch {
  id: number;
  number: number;
  start_date: Date;
  end_date: Date;
  circle_id: number;
  created_at: Date;
  updated_at: Date;
  ended: number;
  grant: string;
  is_regift_phase: boolean;
  notified_before_end: Date;
  notified_start: Date;
  notified_end: Date;
  regift_days: number;
}
