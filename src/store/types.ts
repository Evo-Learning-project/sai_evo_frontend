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
