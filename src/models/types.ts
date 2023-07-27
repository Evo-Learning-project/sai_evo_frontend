export enum CourseTreeNodeType {
	LessonNode = "LessonNode",
	FileNode = "FileNode",
	TopicNode = "TopicNode",
	AnnouncementNode = "AnnouncementNode",
	PollNode = "PollNode",
}

export enum LessonNodeState {
	DRAFT,
	PUBLISHED,
}

export enum AnnouncementNodeState {
	DRAFT,
	PUBLISHED,
}

export enum PollNodeState {
	DRAFT,
	OPEN,
	CLOSED,
}

export enum ExerciseType {
	MULTIPLE_CHOICE_SINGLE_POSSIBLE,
	MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
	OPEN_ANSWER,
	COMPLETION,
	AGGREGATED,
	JS,
	ATTACHMENT,
	C,
	PYTHON,
	//EXTERNAL_RESOURCE,
}

export enum ExerciseTestCaseType {
	SHOW_CODE_SHOW_TEXT,
	SHOW_TEXT_ONLY,
	HIDDEN,
}

export enum ExerciseState {
	DRAFT,
	PRIVATE,
	PUBLIC,
}

export enum EventType {
	SELF_SERVICE_PRACTICE,
	IN_CLASS_PRACTICE,
	EXAM,
	HOME_ASSIGNMENT,
	EXTERNAL,
}

export enum EventState {
	DRAFT,
	PLANNED,
	OPEN,
	CLOSED,
	RESTRICTED,
}

export enum EventAccessRule {
	ALLOW_ACCESS,
	DENY_ACCESS,
}

export enum EventTimeLimitRule {
	NO_TIME_LIMIT,
	TIME_LIMIT,
}

export enum EventTemplateRuleType {
	TAG_BASED,
	ID_BASED,
	FULLY_RANDOM,
}

export enum EventParticipationState {
	IN_PROGRESS,
	TURNED_IN,
	CLOSED_BY_TEACHER,
}

export enum ParticipationAssessmentProgress {
	NOT_ASSESSED,
	PARTIALLY_ASSESSED,
	FULLY_ASSESSED,
}

export enum AssessmentVisibility {
	DRAFT,
	FOR_REVIEW,
	PUBLISHED,
}

export enum AssessmentSlotState {
	NOT_ASSESSED,
	ASSESSED,
}

export enum CoursePrivilege {
	UPDATE_COURSE = "update_course",
	MANAGE_MATERIAL = "manage_course_tree_nodes",
	ACCESS_EXERCISES = "access_exercises",
	MANAGE_EXERCISES = "manage_exercises",
	ASSESS_PARTICIPATIONS = "assess_participations",
	MANAGE_EVENTS = "manage_events",
	MANAGE_EXERCISE_SOLUTIONS = "manage_exercise_solutions",
}

export enum ExerciseSolutionState {
	DRAFT,
	SUBMITTED,
	APPROVED,
	REJECTED,
}

export enum VoteType {
	UP_VOTE,
	DOWN_VOTE,
}
