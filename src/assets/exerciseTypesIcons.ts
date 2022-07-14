import { ExerciseType } from "@/models";

export const icons = {
  [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]: [
    "radio_button_checked",
    // "radio_button_unchecked",
  ],
  [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]: [
    "check_box",
    // "check_box_outline_blank",
  ],
  [ExerciseType.OPEN_ANSWER]: ["notes"],
  [ExerciseType.JS]: ["javascript"],
  [ExerciseType.C]: ["code"], // raw-c.svg
  [ExerciseType.COMPLETION]: [
    "expand_circle_down",
    // "horizontal_rule",
    // "horizontal_rule",
  ],
  [ExerciseType.ATTACHMENT]: ["cloud_upload"],
  [ExerciseType.AGGREGATED]: [
    "category",
    // "radio_button_checked", "check_box"
  ],
};
