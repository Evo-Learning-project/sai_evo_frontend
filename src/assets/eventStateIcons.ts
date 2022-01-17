import { EventState } from '@/models';

export const icons = {
  [EventState.DRAFT]: ['insert_drive_file-sm'],
  [EventState.PLANNED]: ['public-sm'],
  [EventState.OPEN]: ['visibility_off-sm'],
  [EventState.CLOSED]: ['visibility_off-sm'],
};
