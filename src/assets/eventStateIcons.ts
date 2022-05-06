import { EventState } from "@/models";

export const icons = {
  [EventState.DRAFT]: ["insert_drive_file-sm"],
  [EventState.PLANNED]: ["event_available-sm"],
  [EventState.OPEN]: ["update-sm"],
  [EventState.CLOSED]: ["block-sm"],
  [EventState.RESTRICTED]: ["lock-sm"],
};
