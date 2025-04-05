export interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  date?: Date;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    originalTitle: string;
  };
}