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
	// global data
	courses: Course[];

	tags: Tag[];

	paginatedSolutionsByExerciseId: Record<string, PaginatedData<ExerciseSolution>>; // string = exercise id,

	exerciseTestCaseAttachmentsByTestCaseId: Record<string, ExerciseTestCaseAttachment[]>;

	// mappings

	// paginated resources

	// ! previous teacher store
	// exercises currently displayed
	paginatedExercises: PaginatedData<Exercise>;

	// events currently displayed (e.g. course exam list)
	events: Event[];

	// event participations currently displayed (e.g. exam results page)
	// TODO rename to something like currentEventParticipations
	// eventParticipations: EventParticipation[];

	// users currently displayed (e.g. course insights page)
	users: User[];

	// --------------------------------------------

	// ! previous student store
	// event participation currently displayed (e.g. during an exam or when reviewing answers)
	currentEventParticipation: EventParticipation | null;
	// event participations of the user
	// ! currently used on the home page for student dashboard, with the Event nested inside; improve
	eventParticipations: PaginatedData<EventParticipation>;
	// ! currently used to hold data about the practice being created - maybe this shouldn't be in the store?
	// event currently being edited
	editingEvent: Event | null;
	// ! this is pretty local, maybe shouldn't live in the store?
	// event currently being displayed (e.g. in the confirmation page before joining an event)
	previewingEvent: Event | null;
	// --------------------------------------------

	// Gamification -------------------------------

	// gamification context for the current course
	gamificationContext: GamificationContext | null;
	// goals of the current gamificationContext
	gamificationContextGoals: Goal[];
	// mapping from goal id to GoalProgress for that goal
	progressByGoalId: Record<string, GoalProgress>;

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
