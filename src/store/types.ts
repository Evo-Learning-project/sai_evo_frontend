import { ExerciseSearchFilter, PaginatedData } from "@/api/interfaces";
import { Goal, GoalProgress } from "@/gamification";
import { ErrorMessage } from "@/interfaces";
import {
	Course,
	EventParticipation,
	Exercise,
	Tag,
	Event,
	User,
	ExerciseSolution,
	GamificationContext,
	ExerciseTestCaseAttachment,
	CourseTreeNode,
} from "@/models";

export interface StudentState {
	currentEventParticipation: EventParticipation | null;
	eventParticipations: PaginatedData<EventParticipation>;
	editingEvent: Event | null;
	previewingEvent: Event | null;
	exerciseThreads: Exercise[];
}
export interface TeacherState {
	paginatedExercises: PaginatedData<Exercise>;
	events: Event[];
	eventParticipations: EventParticipation[];
	currentExercisePage: number;
	users: User[];
}

export interface MetaStoreState {
	// user data
	user: User;
	token: string;
	refreshToken: string;

	// bookeeping
	loading: boolean; // global spinner
	firstLoading: boolean; // skeletons on page
	localLoading: boolean; // spinners in buttons and local components
	pageWideErrorData: ErrorMessage | null; // for errors that entirely replace the current view
	errorNotificationData: ErrorMessage | null; // for small errors that can be ignored
	saving: boolean;
	savingError: boolean;
	showSuccessFeedback: boolean;
	dirtyTex: boolean;
	helpCenterOpen: boolean;
	helpCenterSelectedArticleId: string | null;
}

export interface MainStoreState {
	/**
	 *  Paginated resources and list-based resources
	 */
	courses: Course[]; // global list of courses
	paginatedCourseTreeNodes: PaginatedData<CourseTreeNode>;
	tags: Tag[]; // tags of current course
	users: User[]; // users currently displayed (e.g. course insights page)
	paginatedExercises: PaginatedData<Exercise>; // exercises currently displayed
	events: Event[]; // events currently displayed (e.g. course exam list)
	// event participations of the user
	// ! currently used on the home page for student dashboard, with the Event nested inside; improve
	eventParticipations: PaginatedData<EventParticipation>; // TODO rename to paginatedEventParticipations
	// TODO rename to something like currentEventParticipations
	// eventParticipations: EventParticipation[]; // event participations currently displayed (e.g. exam results page)

	/**
	 * Mappings
	 */
	// exercise id to set of ExerciseSolution
	paginatedSolutionsByExerciseId: Record<string, PaginatedData<ExerciseSolution>>;
	// testcase id to set of ExerciseTestCaseAttachment
	exerciseTestCaseAttachmentsByTestCaseId: Record<string, ExerciseTestCaseAttachment[]>;
	// gamification goal id to GoalProgress
	progressByGoalId: Record<string, GoalProgress>;
	// node id to set of children nodes
	paginatedChildrenByNodeId: Record<string, PaginatedData<CourseTreeNode>>;

	/**
	 * Stand-alone data, used as main source of information for a view
	 * or component
	 */
	// event participation currently displayed (e.g. during an exam or when reviewing answers)
	currentEventParticipation: EventParticipation | null;
	// ! see if this is really necessary here
	// event currently being edited
	editingEvent: Event | null;
	// event currently being displayed (e.g. in the confirmation page before joining an event)
	previewingEvent: Event | null;

	// --------------------------------------------

	// ! previous student store

	// --------------------------------------------

	// Gamification -------------------------------

	// gamification context for the current course
	gamificationContext: GamificationContext | null;
	// goals of the current gamificationContext
	gamificationContextGoals: Goal[];

	// --------------------------------------------
}

export interface SharedState {
	// user data
	user: User;
	token: string;
	refreshToken: string;

	// global data
	courses: Course[];
	tags: Tag[];
	paginatedSolutionsByExerciseId: Record<string, PaginatedData<ExerciseSolution>>; // string = exercise id,
	exerciseTestCaseAttachmentsByTestCaseId: Record<string, ExerciseTestCaseAttachment[]>;

	// bookeeping
	loading: boolean; // global spinner
	firstLoading: boolean; // skeletons on page
	localLoading: boolean; // spinners in buttons and local components
	pageWideErrorData: ErrorMessage | null; // for errors that entirely replace the current view
	errorNotificationData: ErrorMessage | null; // for small errors that can be ignored
	saving: boolean;
	savingError: boolean;
	showSuccessFeedback: boolean;
	dirtyTex: boolean;
	helpCenterOpen: boolean;
	helpCenterSelectedArticleId: string | null;

	//gamification
	gamificationContext: GamificationContext | null;
	gamificationContextGoals: Goal[];
	progressByGoalId: Record<string, GoalProgress>;
}

interface StoreOperationParameters<T> {
	courseId: string;
	eventId: string;
	exerciseId: string;
	ruleId: string;
	clauseId: string;
	slotId: string;
	templateId: string;
	filters: ExerciseSearchFilter;
	children: "choices" | "sub_exercises" | "testcases";
	childType: "choice" | "sub_exercise" | "testcase";
	fromFirstPage: boolean;
	participationIds: string[];
	participationId: string;
	//payload: T;
	changes: Partial<T>;
	mutate: boolean;
	reFetch: boolean;
}

export type ActionPayload<T> = Partial<StoreOperationParameters<T>> & {
	payload: T;
};

export type MutationPayload<T> = Partial<StoreOperationParameters<T>> & {
	payload: T;
};
