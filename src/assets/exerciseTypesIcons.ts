import { ExerciseType } from '@/models';

export const icons = {
  [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]: [
    'radio_button_checked',
    'radio_button_unchecked',
  ],
  [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]: [
    'check_box',
    'check_box_outline_blank',
  ],
  [ExerciseType.OPEN_ANSWER]: ['text_snippet-sm'],
  [ExerciseType.JS]: ['javascript-lg'],
  [ExerciseType.COMPLETION]: [
    'expand_more',
    'horizontal_rule',
    'horizontal_rule',
  ],
  [ExerciseType.ATTACHMENT]: ['attachment-sm'],
  [ExerciseType.AGGREGATED]: ['radio_button_checked', 'check_box'],
};
