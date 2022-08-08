import { ParticipationAssessmentProgress } from "@/models";

export const icons = {
	[ParticipationAssessmentProgress.NOT_ASSESSED]: ["warning"],
	[ParticipationAssessmentProgress.PARTIALLY_ASSESSED]: ["pending_actions"],
	[ParticipationAssessmentProgress.FULLY_ASSESSED]: ["check"],
};
