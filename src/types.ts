export interface Event {
  id: string;
  title: string;
  date: Date;
  content?: string;
}

export interface EventParams {
  targetEventId: string | null;
  date: Date;
  title: string;
  content: string;
}
