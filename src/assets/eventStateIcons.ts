import { EventState } from "@/models";

export const icons = {
  [EventState.DRAFT]: ["insert_drive_file"],
  [EventState.PLANNED]: ["event_available"],
  [EventState.OPEN]: ["update"],
  [EventState.CLOSED]: ["block"],
  [EventState.RESTRICTED]: ["lock"],
};
