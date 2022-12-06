import {
	AnnouncementNode,
	EventParticipation,
	ExerciseTestCase,
	FileNode,
	LessonNode,
	NodeComment,
	PollNode,
	TopicNode,
	User,
} from "./interfaces";
import {
	Course,
	Event,
	EventParticipationSlot,
	EventParticipationSlotSubmission,
	EventState,
	EventTemplate,
	EventTemplateRule,
	EventTemplateRuleClause,
	EventTemplateRuleType,
	EventType,
	Exercise,
	ExerciseChoice,
	ExerciseSolution,
	ExerciseSolutionComment,
	ExerciseSolutionVote,
	ExerciseState,
	ExerciseTestCaseType,
	ExerciseType,
	Tag,
} from ".";
import {
	AnnouncementNodeState,
	CourseTreeNodeType,
	EventAccessRule,
	EventParticipationState,
	ExerciseSolutionState,
	LessonNodeState,
	PollNodeState,
	VoteType,
} from "./types";

export const getBlankUser = (): User => ({
	id: "",
	email: "",
	full_name: "",
	first_name: "",
	last_name: "",
	is_teacher: false,
	mat: "",
	course: "",
});

export const getBlankCourse = (): Course => ({
	id: "",
	name: "",
	privileges: [],
});

export const getBlankExerciseSolution = (
	state: ExerciseSolutionState | undefined,
	content = "",
): ExerciseSolution => ({
	id: "",
	state,
	comments: [],
	// votes: [],
	content,
	user: null,
	score: 0,
	is_bookmarked: false,
});

export const getBlankChoice = (): ExerciseChoice => ({
	id: "",
	text: "",
	correctness: 0,
});

export const getBlankTestCase = (): ExerciseTestCase => ({
	id: "",
	text: "",
	code: "",
	testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
	stdin: "",
	expected_stdout: "",
});

export const getBlankExercise = (): Exercise => ({
	id: "",
	label: "",
	text: "",
	exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
	state: ExerciseState.DRAFT,
	all_or_nothing: false,
	choices: [],
});

export const getBlankExam = (): Event => ({
	id: "",
	name: "",
	instructions: "",
	begin_timestamp: null,
	end_timestamp: null,
	event_type: EventType.EXAM,
	state: EventState.DRAFT,
	exercises_shown_at_a_time: 1,
	allow_going_back: true,
	randomize_rule_order: false,
	access_rule: EventAccessRule.ALLOW_ACCESS,
	access_rule_exceptions: [],
	template: { id: "", rules: [] },
	time_limit_seconds: null,
});

export const getBlankPractice = (): Event => ({
	id: "",
	name: "",
	instructions: "",
	begin_timestamp: null,
	end_timestamp: null,
	event_type: EventType.SELF_SERVICE_PRACTICE,
	state: EventState.OPEN,
	exercises_shown_at_a_time: null,
	allow_going_back: true,
	randomize_rule_order: false,
	time_limit_seconds: null,
});

export const getBlankEventTemplate = (): EventTemplate => ({
	id: "",
	rules: [],
	name: "",
});

export const getBlankEventParticipation = (): EventParticipation => ({
	begin_timestamp: "",
	event: getBlankExam(),
	id: "",
	slots: [],
	state: EventParticipationState.IN_PROGRESS,
	user: getBlankUser(),
});

export const getBlankEventTemplateRule = (
	rule_type?: EventTemplateRuleType,
	initialAmount?: number,
): EventTemplateRule => ({
	id: "",
	amount: initialAmount ?? 1,
	weight: 1,
	rule_type,
});

export const getBlankTag = (): Tag => ({
	id: "",
	name: "",
});

export const getBlankTagBasedEventTemplateRuleClause = (
	tag?: Tag,
): EventTemplateRuleClause => ({
	id: "",
	tags: tag ? [tag] : [],
});

export const getFakeEventParticipationSlot = (
	exercise: Exercise,
): EventParticipationSlot => ({
	id: "",
	exercise,
	answer_text: "",
	selected_choices: [],
	sub_slots: [
		...(exercise.sub_exercises?.map(e => getFakeEventParticipationSlot(e)) ?? []),
	],
});

export const getEmptySubmission = (): EventParticipationSlotSubmission => ({
	selected_choices: [],
	answer_text: "",
	attachment: undefined,
});

export const getVote = (voteType: VoteType): ExerciseSolutionVote => ({
	id: "",
	vote_type: voteType,
});

export const getComment = (content: string): ExerciseSolutionComment => ({
	id: "",
	user: getBlankUser(),
	content,
});

export const getBlankLessonNode = (parentId: string | null): LessonNode => ({
	parent_id: parentId,
	title: "",
	body: "",
	created: "",
	state: LessonNodeState.DRAFT,
	id: "",
	resourcetype: CourseTreeNodeType.LessonNode,
});

export const getBlankAnnouncementNode = (): AnnouncementNode => ({
	id: "",
	parent_id: null,
	body: "",
	created: "",
	state: AnnouncementNodeState.DRAFT,
	resourcetype: CourseTreeNodeType.AnnouncementNode,
});

export const getBlankPollNode = (): PollNode => ({
	choices: [],
	id: "",
	text: "",
	created: "",
	parent_id: null,
	state: PollNodeState.DRAFT,
	resourcetype: CourseTreeNodeType.PollNode,
});

export const getBlankTopicNode = (parentId: string | null, name = ""): TopicNode => ({
	parent_id: parentId,
	name,
	created: "",
	id: "",
	resourcetype: CourseTreeNodeType.TopicNode,
});

export const getBlankFileNode = (parentId: string | null): FileNode => ({
	parent_id: parentId,
	file: null,
	created: "",
	id: "",
	mime_type: "",
	thumbnail: "",
	resourcetype: CourseTreeNodeType.FileNode,
});

export const getBlankCourseTreeNodeComment = (comment: string): NodeComment => ({
	comment,
	user: getBlankUser(),
	created: "",
	is_edited: false,
	id: "",
});
