import {
	ExerciseState,
	ExerciseType,
	EventType,
	ExerciseSolutionState,
	EventState,
} from "@/models";

export interface EventParticipationSearchFilter {
	bookmarked?: boolean;
	event_type?: EventType;
}

export interface ExerciseSearchFilter {
	label: string;
	text: string;
	tags: string[];
	exercise_types: ExerciseType[];
	states: ExerciseState[];
	with_submitted_solutions?: boolean;
	with_bookmarked_solutions?: boolean;
	by_popularity?: boolean;
}

export interface ExerciseSolutionSearchFilter {
	states: ExerciseSolutionState[];
	bookmarked?: boolean;
}

export interface CourseSearchFilter {
	name: string;
	hidden: boolean;
	withPrivileges: boolean;
}

export interface EventSearchFilter {
	event_type?: EventType;
	state?: EventState;
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
