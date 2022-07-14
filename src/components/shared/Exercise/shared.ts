import {
  Exercise,
  EventParticipationSlotSubmission,
  getEmptySubmission,
} from "@/models";
import { PropType } from "@vue/runtime-core";

export const exerciseProps = {
  exercise: {
    type: Object as PropType<Exercise>,
    required: true as const,
  },
  submission: {
    type: Object as PropType<EventParticipationSlotSubmission>,
    default: getEmptySubmission,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  showSolution: {
    type: Boolean,
    default: false,
  },
  showPublicTags: {
    type: Boolean,
    default: false,
  },
  showPrivateTags: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
};
