import { EventState } from '@/models';

export const icons = {
  [EventState.DRAFT]: ['insert_drive_file-sm'],
  [EventState.PLANNED]: ['event_available-sm'],
  [EventState.OPEN]: ['alarm-sm'],
  [EventState.CLOSED]: ['event_busy-sm'],
};
