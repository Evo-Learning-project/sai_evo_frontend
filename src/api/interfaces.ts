import { ExerciseState, ExerciseType, EventType, ExerciseSolutionState } from "@/models";

export interface ExerciseSearchFilter {
	label: string;
	text: string;
	tags: string[];
	exercise_types: ExerciseType[];
	states: ExerciseState[];
	with_submitted_solutions?: boolean;
}

export interface ExerciseSolutionSearchFilter {
	states: ExerciseSolutionState[];
}

export interface CourseSearchFilter {
	name: string;
	hidden: boolean;
	withPrivileges: boolean;
}

export interface EventSearchFilter {
	event_type?: EventType;
}

export interface BackendPaginatedResponse<T> {
	results: T[];
	previous: null | string;
	next: null | string;
	count: number;
}

export interface PaginatedData<T> {
	data: T[];
	isLastPage: boolean;
	pageNumber: number;
	count: number;
}
// TODO define operations on paginated data (insert, reset, delete from...)
